#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const errors = [];
const results = [];

function fail(file, message) {
  errors.push(`${path.relative(root, file) || "."}: ${message}`);
}

function read(file) {
  return fs.readFileSync(file, "utf8").replaceAll("\r\n", "\n");
}

function parseJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(file, `invalid JSON: ${error.message}`);
    return null;
  }
}

function walk(directory, predicate) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && [".git", "node_modules"].includes(entry.name)) return [];
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file, predicate) : predicate(file) ? [file] : [];
  });
}

function lineNumber(text, index) {
  return text.slice(0, index).split("\n").length;
}

const manifestFile = path.join(root, "plugin.json");
const manifest = parseJson(manifestFile);
if (manifest) {
  const allowedKeys = new Set([
    "$schema",
    "name",
    "version",
    "description",
    "author",
    "homepage",
    "repository",
    "license",
    "keywords",
    "extensions",
  ]);
  const unexpected = Object.keys(manifest).filter((key) => !allowedKeys.has(key));
  if (unexpected.length) fail(manifestFile, `unsupported Agent Plugins 1.0 fields: ${unexpected.join(", ")}`);
  if (manifest.$schema !== "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json") {
    fail(manifestFile, "missing the canonical Agent Plugins 1.0 $schema");
  }
  if (!/^(?!.*(?:--|\.\.))[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(manifest.name ?? "")) {
    fail(manifestFile, "name does not match the Agent Plugins 1.0 pattern");
  }
  for (const field of ["version", "description", "homepage", "repository", "license"]) {
    if (typeof manifest[field] !== "string" || manifest[field].trim() === "") {
      fail(manifestFile, `${field} must be a non-empty string`);
    }
  }
  if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(manifest.version ?? "")) {
    fail(manifestFile, "version is not semantic version syntax");
  }
  const allowedAuthorKeys = new Set(["name", "email", "url"]);
  if (!manifest.author || typeof manifest.author !== "object" || Array.isArray(manifest.author)) {
    fail(manifestFile, "author must be an object");
  } else {
    const unexpectedAuthorKeys = Object.keys(manifest.author).filter((key) => !allowedAuthorKeys.has(key));
    if (unexpectedAuthorKeys.length) fail(manifestFile, `unsupported author fields: ${unexpectedAuthorKeys.join(", ")}`);
    if (typeof manifest.author.name !== "string" || manifest.author.name.trim() === "") {
      fail(manifestFile, "author.name is required by this package");
    }
  }
  if (!Array.isArray(manifest.keywords) || manifest.keywords.length === 0 || manifest.keywords.some((keyword) => typeof keyword !== "string" || keyword.trim() === "")) {
    fail(manifestFile, "keywords must be a non-empty array of non-empty strings");
  }
  if (!fs.existsSync(path.join(root, "skills"))) fail(manifestFile, "root skills directory is missing");
}
if (fs.existsSync(path.join(root, ".kiro-plugin", "plugin.json"))) {
  fail(path.join(root, ".kiro-plugin", "plugin.json"), "obsolete nested manifest still exists");
}
results.push("plugin manifest");

const currentToolTags = new Set(["read", "write", "shell", "web", "subagent", "knowledge", "todo_list", "@mcp", "@builtin", "*"]);
const allowedAgentKeys = new Set(["name", "description", "prompt", "tools", "includePowers"]);
const agentFiles = walk(path.join(root, "agents"), (file) => file.endsWith(".json"));
for (const file of agentFiles) {
  const agent = parseJson(file);
  if (!agent) continue;
  const unexpected = Object.keys(agent).filter((key) => !allowedAgentKeys.has(key));
  if (unexpected.length) fail(file, `unsupported package agent fields: ${unexpected.join(", ")}`);
  if (!agent.name || !agent.description) fail(file, "name and description are required");
  if (agent.name !== path.basename(file, ".json")) fail(file, "name must match the JSON filename");
  if (!Array.isArray(agent.tools) || agent.tools.length === 0) fail(file, "tools must be a non-empty category array");
  for (const tool of agent.tools ?? []) {
    if (!currentToolTags.has(tool)) fail(file, `legacy or unknown tool category: ${tool}`);
  }
  if (agent.name === "poteto-agent" && agent.includePowers !== true) {
    fail(file, "poteto-agent must include installed Powers");
  }
  if (agent.name === "comment-sicko" && "includePowers" in agent) {
    fail(file, "comment-sicko must not import Power tools");
  }
  if (typeof agent.prompt !== "string" || !agent.prompt.startsWith("file://./")) {
    fail(file, "prompt must be a sibling-relative file://./ URI");
  } else {
    const prompt = path.resolve(path.dirname(file), agent.prompt.slice("file://".length));
    if (path.dirname(prompt) !== path.dirname(file)) fail(file, "prompt must stay adjacent to its agent JSON");
    if (path.extname(prompt) !== ".md") fail(file, "prompt must resolve to a Markdown file");
    if (!fs.existsSync(prompt)) fail(file, `prompt does not resolve: ${agent.prompt}`);
  }
  if (agent.name === "comment-sicko" && (agent.tools.length !== 1 || agent.tools[0] !== "read")) {
    fail(file, "comment-sicko must expose only the read category");
  }
  if (agent.name === "poteto-agent") {
    for (const tool of ["read", "write", "shell", "subagent", "todo_list"]) {
      if (!agent.tools.includes(tool)) fail(file, `poteto-agent must include the ${tool} category`);
    }
  }
}
if (agentFiles.length !== 2) fail(path.join(root, "agents"), `expected 2 agent JSON files, found ${agentFiles.length}`);
results.push(`${agentFiles.length} agent configs and prompt URIs`);

const skillFiles = walk(path.join(root, "skills"), (file) => path.basename(file) === "SKILL.md");
const allowedSkillFields = new Set(["name", "description", "license", "compatibility"]);
for (const file of skillFiles) {
  const text = read(file);
  if (!text.startsWith("---\n")) {
    fail(file, "missing opening YAML frontmatter delimiter");
    continue;
  }
  const end = text.indexOf("\n---\n", 4);
  if (end === -1) {
    fail(file, "missing closing YAML frontmatter delimiter");
    continue;
  }
  const frontmatter = text.slice(4, end);
  const fields = [];
  for (const [index, line] of frontmatter.split("\n").entries()) {
    if (!line.trim()) continue;
    const match = /^([A-Za-z][\w-]*):(?:[ \t]+(.+))?$/.exec(line);
    if (!match) {
      fail(file, `frontmatter line ${index + 2} must be a supported top-level scalar`);
      continue;
    }
    const [, field, rawValue = ""] = match;
    let value = rawValue.trim();
    if (value.startsWith('"')) {
      try {
        value = JSON.parse(value);
      } catch {
        fail(file, `frontmatter field ${field} has invalid double-quoted syntax`);
        value = "";
      }
    } else if (value.startsWith("'")) {
      if (!/^'(?:[^']|'')*'$/.test(value)) {
        fail(file, `frontmatter field ${field} has invalid single-quoted syntax`);
        value = "";
      } else {
        value = value.slice(1, -1).replaceAll("''", "'");
      }
    } else if (
      // ponytail: keep plain scalars unambiguous; quote strings that do not start with a letter.
      !value ||
      !/^\p{L}/u.test(value) ||
      /:\s|\s#/.test(value) ||
      /^(?:null|true|false|yes|no|on|off)$/i.test(value)
    ) {
      fail(file, `frontmatter field ${field} must be a plain or quoted string scalar`);
      value = "";
    }
    fields.push({ field, value });
  }
  const fieldNames = fields.map(({ field }) => field);
  const duplicates = fieldNames.filter((field, index) => fieldNames.indexOf(field) !== index);
  const unsupported = fieldNames.filter((field) => !allowedSkillFields.has(field));
  if (duplicates.length) fail(file, `duplicate frontmatter fields: ${[...new Set(duplicates)].join(", ")}`);
  if (unsupported.length) fail(file, `unsupported Agent Skills fields: ${unsupported.join(", ")}`);

  const value = (field) => fields.find((entry) => entry.field === field)?.value ?? "";
  const name = value("name");
  const description = value("description");
  const directoryName = path.basename(path.dirname(file));
  if (!name) fail(file, "frontmatter needs a non-empty name");
  if (!description || [">", ">-", "|", "|-"].includes(description)) {
    fail(file, "frontmatter needs a non-empty inline description");
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || name.length > 64) {
    fail(file, "name must be lowercase kebab case and at most 64 characters");
  }
  if (name !== directoryName) fail(file, `name must match directory ${directoryName}`);
  if (description.length > 1024) fail(file, "description exceeds 1024 characters");
}
if (skillFiles.length === 0) fail(path.join(root, "skills"), "no SKILL.md files found");
results.push(`${skillFiles.length} Agent Skills frontmatter blocks`);

const markdownFiles = [
  path.join(root, "README.md"),
  ...["docs", "agents", "skills", "automations"].flatMap((directory) =>
    walk(path.join(root, directory), (file) => file.endsWith(".md"))
  ),
];
let relativeLinkCount = 0;
const linkPattern = /!?\[[^\]]*\]\(([^)]+)\)/g;
for (const file of markdownFiles) {
  const text = read(file);
  for (const match of text.matchAll(linkPattern)) {
    let target = match[1].trim();
    if (target.startsWith("<") && target.endsWith(">")) target = target.slice(1, -1);
    if (/^(?:[a-z]+:|#)/i.test(target)) continue;
    target = target.split(/\s+["']/)[0].split("#")[0].split("?")[0];
    if (!target) continue;
    relativeLinkCount += 1;
    let decoded;
    try {
      decoded = decodeURIComponent(target);
    } catch {
      fail(file, `line ${lineNumber(text, match.index)} has an invalid encoded link: ${target}`);
      continue;
    }
    const resolved = path.resolve(path.dirname(file), decoded);
    if (!fs.existsSync(resolved)) fail(file, `line ${lineNumber(text, match.index)} has a broken relative link: ${target}`);
  }
}
results.push(`${relativeLinkCount} relative Markdown links across ${markdownFiles.length} active package docs`);

const prohibited = /(?:\.cursor(?:[\\/]|\b)|\/add-plugin\b|\/loop\b|\/automate(?:\s|$)|\/transcript\b|cursor-team-kit|kiro\s*crew|@kirocrew|grok\s+bot|subagent_type|generalPurpose|run_in_background|AskQuestion|is_background|agent-transcripts|api2\.cursor|SendToUser|update_state|claude-fable|gpt-5\.6-sol|grok-4\.6|claude-opus-5)/i;
for (const file of markdownFiles) {
  const text = read(file);
  for (const [index, line] of text.split("\n").entries()) {
    const archivalProvenance =
      file === path.join(root, "README.md") &&
      line.includes("https://github.com/cursor/plugins/tree/main/pstack");
    if (!archivalProvenance && (prohibited.test(line) || /\bcursor\b/i.test(line))) {
      fail(file, `line ${index + 1} contains an active legacy platform reference: ${line.trim()}`);
    }
  }
}
results.push("active package legacy-reference scan");

if (errors.length) {
  console.error(`Validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("pstack package validation passed:");
  for (const result of results) console.log(`- ${result}`);
}
