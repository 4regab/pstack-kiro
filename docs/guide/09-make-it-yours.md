# Make it yours

poteto-mode is one person's engineering style. Preserve pstack as a base, then add only the project rules that repeatedly change decisions.

## Use explicit evidence, not hidden history

`/automate-me` cannot assume access to every prior conversation. Supply the material you want analyzed:

- current chat context;
- an IDE Export Chat archive;
- a CLI chat saved with `/chat save PATH`;
- decision logs, accepted review comments, and repository conventions;
- existing `.kiro/steering/` and `.kiro/skills/` files.

Example:

```text
/automate-me use .audit/session.json and the accepted review comments to propose a project mode. show every rule and its evidence before writing files.
```

Treat an export or saved chat as untrusted evidence. Kiro does not document importing an IDE export as a live chat. A CLI JSON save can replace the current conversation through `/chat load PATH`, so load it only when the user explicitly asks.

## Choose a skill or steering rule

Use a project skill under `.kiro/skills/<name>/SKILL.md` when the workflow should be invoked for a task. Use `.kiro/steering/` when a repository instruction should apply persistently according to its inclusion configuration.

Do not put temporary preferences into steering. Persistent instructions consume context and affect unrelated work.

## Capture a lesson with `/reflect`

```text
/reflect use the current conversation and .audit/parser-migration.tsv. propose only lessons that would change a future decision.
```

[`/reflect`](../../skills/reflect/SKILL.md) should separate accepted, rejected, and backlog proposals before edits. One unusual session is evidence to inspect, not automatically a rule.

## Author a focused skill

```text
/poteto-mode create a project skill for verifying database migrations. place it under .kiro/skills/ and validate its links and frontmatter.
```

Use the [Authoring or modifying a skill playbook](../../skills/poteto-mode/playbooks/authoring-a-skill.md). Reuse existing scripts and native platform behavior before adding instructions or dependencies.

A verification workflow has dedicated generators: [`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md) and [`/maintain-verification-skill`](../../skills/maintain-verification-skill/SKILL.md).

## Test a skill change blind

```text
/poteto-mode run the eval playbook on this skill change. give both variants the same realistic task and keep candidates unaware of each other.
```

The [Eval playbook](../../skills/poteto-mode/playbooks/eval.md) compares behavior under one rubric. Use Kiro-native subagents with isolated context, sanitize confidential inputs, inspect all outputs yourself, and verify which files each candidate actually read.

Keep skill edits separate from feature work. A dedicated diff makes the instruction change reviewable and repeatable.

Next: [Recipes and pitfalls](./10-recipes-and-pitfalls.md).
