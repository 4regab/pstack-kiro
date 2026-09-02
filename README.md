# pstack for Kiro

> Kiro adaptation of [`cursor/plugins/pstack`](https://github.com/cursor/plugins/tree/main/pstack) by [poteto (Lauren Tan)](https://x.com/poteto). All credit for the original design, writing, skills, and engineering philosophy belongs to poteto.

pstack is a Kiro Power for rigorous engineering work: understand the system first, make the smallest justified change, and prove the result against the real artifact. In poteto's words, **if you want to go fast, go deep first**. The goal is less code, higher quality, and parallel work that remains reviewable.

## Compatibility

| Surface | Support |
|---|---|
| Kiro IDE 1.0 | Install this repository as a custom Power. |
| Kiro CLI 3.0 | Automatically detects Powers installed by the IDE; use `kiro-cli --v3` and `/powers` to inspect them. |
| Custom agents | Manual install only; Agent Plugins 1.0 does not install custom-agent profiles. |
| Cloud sessions | Supported by Kiro as a Preview feature, subject to plan, repository-provider, version, and service limits. |

The root [`plugin.json`](./plugin.json) follows the [Agent Plugins 1.0 schema](https://agent-plugins.org/schemas/1.0.0/plugin.schema.json). The Power makes the bundled `skills/` available; it does not copy the profiles under `agents/` into Kiro.

## Install in Kiro IDE 1.0

1. Open the **Powers** panel.
2. Choose **Add Custom Power**.
3. Add this GitHub repository or select this repository as a local directory.
4. Confirm that `pstack` is installed and active.

Kiro CLI 3.0 sees the IDE-installed Power automatically:

```text
kiro-cli --v3
/powers
```

## Install the custom agents manually

Choose project scope or global scope. Start from a local clone of this repository and copy each JSON profile **with its adjacent prompt file**.

Project scope:

```bash
PSTACK_DIR="$PWD"
TARGET_PROJECT="/path/to/your/project"
mkdir -p "$TARGET_PROJECT/.kiro/agents"
cp "$PSTACK_DIR/agents/poteto-agent.json" "$PSTACK_DIR/agents/poteto-agent.prompt.md" "$TARGET_PROJECT/.kiro/agents/"
cp "$PSTACK_DIR/agents/comment-sicko.json" "$PSTACK_DIR/agents/comment-sicko.prompt.md" "$TARGET_PROJECT/.kiro/agents/"
```

Global scope:

```bash
PSTACK_DIR="$PWD"
mkdir -p ~/.kiro/agents
cp "$PSTACK_DIR/agents/poteto-agent.json" "$PSTACK_DIR/agents/poteto-agent.prompt.md" ~/.kiro/agents/
cp "$PSTACK_DIR/agents/comment-sicko.json" "$PSTACK_DIR/agents/comment-sicko.prompt.md" ~/.kiro/agents/
```

Project profiles override same-named global profiles. Both profiles use relative `file://./...` prompt URIs, so separating a JSON file from its prompt breaks loading.

- `poteto-agent` includes installed Powers and can use Kiro's `read`, `write`, `shell`, `subagent`, and `todo_list` tool categories.
- `comment-sicko` exposes only the `read` category. It reports proposed deletions and never edits files.

Installing the Power does **not** install either agent. Select the copied profile when creating an agent or make it available to a parent agent through Kiro's native subagent configuration.

## Validate this package

Run the dependency-free validator and its mutation self-check with Node.js 18 or newer:

```bash
node scripts/validate-package.mjs
node scripts/test-validator.mjs
```

The validator checks the manifest and agent JSON, prompt resolution, Agent Skills frontmatter, relative links across active package documentation, and legacy platform references. The self-check proves one valid fixture passes and representative invalid manifest, agent, skill, link, and CLI-command mutations fail. Neither script modifies the checkout.

## Use pstack

For a non-trivial task, state the outcome and how to verify it:

```text
/poteto-mode the export writes duplicate rows after a retry. reproduce it first, fix the root cause, and show the real output.
```

`poteto-mode` selects a playbook and uses the other skills as needed. Invoke it again when you want the workflow applied; a skill invocation is not a permanent mode switch.

Useful direct entries:

| Skill | Use it for |
|---|---|
| [`/how`](./skills/how/SKILL.md) | Trace how a subsystem works. |
| [`/why`](./skills/why/SKILL.md) | Investigate history through source control and configured integrations. |
| [`/architect`](./skills/architect/SKILL.md) | Settle callers, types, and boundaries before implementation. |
| [`/arena`](./skills/arena/SKILL.md) | Compare independent attempts to one brief. |
| [`/swarm`](./skills/swarm/SKILL.md) | Split independent slices and aggregate results. |
| [`/interrogate`](./skills/interrogate/SKILL.md) | Review a diff skeptically. |
| [`/tdd`](./skills/tdd/SKILL.md) | Write the smallest useful failing check before a fix. |
| [`/show-me-your-work`](./skills/show-me-your-work/SKILL.md) | Keep an auditable decision log. |
| [`/create-verification-skill`](./skills/create-verification-skill/SKILL.md) | Create project-local verification instructions under `.kiro/skills/`. |

The [guide](./docs/guide/README.md) covers setup, Kiro-native subagents, verification, cloud sessions, CLI `/goal`, exported transcripts, and external prerequisites.

## Engineering philosophy

pstack preserves poteto's original principles:

- Throughput without quality is not the goal.
- Understand behavior and history before editing.
- Prefer deletion and the smallest correct change.
- Design from callers, data shapes, and ownership boundaries.
- Reproduce defects and fix root causes.
- Verify the real artifact, not a proxy or self-report.
- Isolate parallel writers and make every unit reviewable.
- Encode repeated lessons in types, tests, scripts, and structure.

The complete [21-principle index](./docs/guide/08-principles.md) is the quickest reference. Fork it, improve it, and make it yours.

## Compatibility limits and external prerequisites

- pstack does not choose or guarantee a model. Kiro uses the model available in the current surface and configuration.
- Skills can call only tools, MCP servers, issue trackers, source-control providers, browsers, and observability systems that you have separately configured and authorized.
- GitHub, GitLab, Graphite, browser-driving, mobile simulators, and similar workflows require their own CLIs, credentials, repositories, and permissions.
- Kiro native subagents run in isolated context but can share workspace access. Concurrent writers still need separate worktrees or directories.
- Local IDE/CLI sessions do not keep running merely because a prompt asks them to. Use a Kiro cloud session for detached work, or Kiro Web Automations for scheduled repository work, after reviewing their Preview status, plan requirements, permissions, and limits.
- `/goal` is a Kiro CLI command. It runs a bounded autonomous loop and leaves file changes in place if cleared; it is not an IDE slash command.
- Chat history is not an implicit data source. Use current context, repository artifacts, configured integrations, or an explicit IDE/CLI transcript export. Kiro does not document importing an IDE chat export as a live conversation.
- [`automations/benny/`](./automations/benny/) is an external automation blueprint for Slack Events/queue/CI infrastructure invoking Kiro CLI headless sessions. It is not installed or activated by this Power and requires separately implemented infrastructure.

## License

MIT
