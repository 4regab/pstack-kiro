# Recipes and pitfalls

Copy the smallest prompt that states the goal, constraints, and proof.

![A finished result is checked against a recipe and verification list.](./images/recipes.jpg)

## Understand an unfamiliar subsystem

```text
use /how to trace initialization, then /why to inspect the recorded reason it changed. report unavailable sources.
```

## Compare designs

```text
/arena compare three approaches to this cache key. use compatibility, debuggability, and migration cost as the rubric.
```

## Check independent slices

```text
/swarm check every package under packages/ against its check.sh. one package per worker. one report with gaps.
```

## Review without editing

```text
/interrogate the branch skeptically. read only. report behavioral bugs, regressions, and missing evidence; omit style nitpicks.
```

## Fix a bug through the cheapest failing check

```text
/poteto-mode reproduce the duplicate write. if a small local test can fail for the right reason, /tdd it; otherwise run the real command.
```

## Run a bounded autonomous goal in CLI

```text
/goal --max 4 remove all legacy parser callers; zero matches, fixtures pass, old API deleted
```

`/goal` is Kiro CLI-specific. Inspect working-tree changes after completion or `/goal clear`.

## Hand detached work to a cloud session

```text
continue this migration in a cloud session. use a fresh worktree, keep .audit/migration.tsv, stop if credentials or merge permission are required.
```

Confirm the cloud-session Preview prerequisites and limits first. A detached session does not imply authorization for irreversible actions.

## Resume from an exported transcript

```text
/recall use .audit/session.json, the current diff, and test output to identify the last verified state. do not infer missing history.
```

Create `.audit/session.json` explicitly with Kiro CLI `/chat save .audit/session.json`, or supply an IDE Export Chat archive. Restore the CLI save only when intended with `/chat load .audit/session.json`.

## Common pitfalls

- **Assuming a skill stays active.** Reinvoke `/poteto-mode` or put genuinely durable project rules under `.kiro/steering/`.
- **Parallel writers in one checkout.** Give each writer a separate worktree or directory.
- **Using `/arena` for coverage.** Arena compares attempts to one brief; swarm partitions independent slices.
- **Treating a build as behavior proof.** Run the command, flow, readback, or profile that observes the change.
- **Assuming tools or data exist.** Name required CLIs, credentials, MCPs, repositories, transcript exports, and service access.

Back to the [guide index](./README.md).
