# Set up pstack

Install the Power first. Custom agents are a separate, manual choice.

## Install the Power in Kiro IDE 1.0

1. Open the **Powers** panel.
2. Choose **Add Custom Power**.
3. Add the GitHub repository or select its local directory.
4. Confirm that `pstack` is installed and active.

The repository-root `plugin.json` uses Agent Plugins 1.0. Kiro discovers the bundled `skills/` through the Power.

## Use the installed Power from Kiro CLI 3.0

Start the v3 CLI and inspect detected Powers:

```text
kiro-cli --v3
/powers
```

CLI v3 automatically detects Powers installed by the IDE. You do not need to copy the Power into a second CLI-specific directory.

## Install custom agents only if you need them

Agent Plugins 1.0 does not install custom-agent profiles. Start from a local clone of this repository and copy each JSON file with its adjacent prompt file to either the target project or global agent directory.

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

The `file://./...` prompt URI resolves relative to the copied JSON file. Keep each pair together. Project profiles override same-named global profiles.

`poteto-agent` can delegate through Kiro's native `subagent` category, maintain multi-step work through `todo_list`, and include installed Powers. `comment-sicko` exposes only `read`, so it can report comment findings but cannot edit files.

## Validate the checkout

From the repository root, run:

```bash
node scripts/validate-package.mjs
node scripts/test-validator.mjs
```

The dependency-free scripts need Node.js 18 or newer. The first validates the current package; the second proves representative invalid manifest, agent, skill, link, and CLI-command mutations are rejected.

## Create project-local verification instructions when useful

If a project lacks a repeatable way to prove behavior, invoke [`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md). Project-local skills belong under `.kiro/skills/`. Durable repository instructions that should apply beyond a single skill belong under `.kiro/steering/`.

Do not generate either preemptively. An existing test, script, or native harness is cheaper and easier to maintain.

## Run one real task

```text
/poteto-mode add a --json flag to this command. text output stays byte-identical. run and show both forms.
```

Invoke `/poteto-mode` again on later turns when you want its workflow applied. Power activation and conversation context can help Kiro select relevant material, but pstack does not claim a permanent sticky mode.

Next: [Route work through `/poteto-mode`](./02-poteto-mode.md).
