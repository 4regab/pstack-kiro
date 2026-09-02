#!/usr/bin/env node

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
const validatorSource = path.join(scriptsDirectory, "validate-package.mjs");
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "pstack-validator-"));

function write(root, relativePath, contents) {
  const file = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}

function createFixture(name) {
  const root = path.join(temporaryRoot, name);
  fs.mkdirSync(path.join(root, "scripts"), { recursive: true });
  fs.copyFileSync(validatorSource, path.join(root, "scripts", "validate-package.mjs"));
  write(root, "plugin.json", `${JSON.stringify({
    $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
    name: "pstack",
    version: "1.0.0",
    description: "Fixture",
    author: { name: "Fixture" },
    homepage: "https://example.com",
    repository: "https://example.com/repository",
    license: "MIT",
    keywords: ["fixture"],
  }, null, 2)}\n`);
  write(root, "README.md", "# Fixture\n\n[Skill](./skills/example/SKILL.md)\n");
  write(root, "agents/poteto-agent.json", `${JSON.stringify({
    name: "poteto-agent",
    description: "Fixture agent",
    prompt: "file://./poteto-agent.prompt.md",
    tools: ["read", "write", "shell", "subagent", "todo_list"],
    includePowers: true,
  }, null, 2)}\n`);
  write(root, "agents/poteto-agent.prompt.md", "# Poteto agent\n");
  write(root, "agents/comment-sicko.json", `${JSON.stringify({
    name: "comment-sicko",
    description: "Fixture reviewer",
    prompt: "file://./comment-sicko.prompt.md",
    tools: ["read"],
  }, null, 2)}\n`);
  write(root, "agents/comment-sicko.prompt.md", "# Comment reviewer\n");
  write(root, "skills/example/SKILL.md", "---\nname: example\ndescription: Fixture skill.\n---\n\n# Example\n");
  return root;
}

function run(root) {
  return spawnSync(process.execPath, [path.join(root, "scripts", "validate-package.mjs")], {
    cwd: root,
    encoding: "utf8",
  });
}

function expectFailure(name, mutate, expectedMessage) {
  const root = createFixture(name);
  mutate(root);
  const result = run(root);
  assert.notEqual(result.status, 0, `${name} unexpectedly passed`);
  assert.match(`${result.stdout}\n${result.stderr}`, expectedMessage, `${name} failed for the wrong reason`);
}

try {
  const valid = run(createFixture("valid"));
  assert.equal(valid.status, 0, `${valid.stdout}\n${valid.stderr}`);

  expectFailure("manifest-field", (root) => {
    const file = path.join(root, "plugin.json");
    const manifest = JSON.parse(fs.readFileSync(file, "utf8"));
    manifest.skills = "./skills";
    fs.writeFileSync(file, `${JSON.stringify(manifest, null, 2)}\n`);
  }, /unsupported Agent Plugins 1\.0 fields/);

  expectFailure("agent-tool", (root) => {
    const file = path.join(root, "agents", "poteto-agent.json");
    const agent = JSON.parse(fs.readFileSync(file, "utf8"));
    agent.tools = agent.tools.filter((tool) => tool !== "todo_list");
    fs.writeFileSync(file, `${JSON.stringify(agent, null, 2)}\n`);
  }, /must include the todo_list category/);

  expectFailure("skill-name", (root) => {
    write(root, "skills/example/SKILL.md", "---\nname: wrong-name\ndescription: Fixture skill.\n---\n");
  }, /name must match directory example/);

  expectFailure("malformed-frontmatter", (root) => {
    write(root, "skills/example/SKILL.md", "---\nname: example\ndescription: \"unterminated\n---\n");
  }, /invalid double-quoted syntax/);

  expectFailure("implicit-frontmatter-type", (root) => {
    write(root, "skills/example/SKILL.md", "---\nname: example\ndescription: 0x10\n---\n");
  }, /must be a plain or quoted string scalar/);

  expectFailure("broken-link", (root) => {
    write(root, "README.md", "# Fixture\n\n[Missing](./missing.md)\n");
  }, /broken relative link/);

  expectFailure("unsupported-command", (root) => {
    write(root, "README.md", "# Fixture\n\nRun `/transcript save session.json`.\n");
  }, /active legacy platform reference/);

  console.log("pstack validator self-check passed: 1 valid fixture and 7 rejected mutations");
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
