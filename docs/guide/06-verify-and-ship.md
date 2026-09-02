# Verify the result and open a PR

A green build proves compilation, not behavior. State the real artifact and run the check that observes it.

![A prototype follows a real test course while evidence is recorded.](./images/verification.jpg)

## State the finish condition first

```text
/poteto-mode add JSON output. text output stays byte-identical, JSON parses, and both forms run against the sample project. show commands and results.
```

Match proof to the change:

- CLI: run the real command.
- UI: walk the changed flow in the running app.
- Parser or migration: replay a representative saved input.
- Performance: compare equivalent before and after measurements.
- Storage: read back the value from the authoritative store.

An unavailable check makes the result inconclusive. Report the blocker rather than replacing the check with confidence.

## Create a project verification skill only when needed

```text
/create-verification-skill
```

[`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md) should reuse an existing harness first. When a reusable agent-facing workflow is justified, its project-local output belongs under:

```text
.kiro/skills/verify-<app>/
```

A useful verification skill documents Launch, Doctor, Drive, Evidence, and Cleanup, plus a feature map. Prove one complete path before trusting the instructions. Browser drivers, device simulators, PTYs, servers, credentials, and sample data are external prerequisites and must be named explicitly.

Use [`/maintain-verification-skill`](../../skills/maintain-verification-skill/SKILL.md) to audit drift. It should report product regressions rather than editing verification instructions to hide them.

## Open a focused PR

```text
/poteto-mode open a focused PR with ordered commits and the verification evidence in the description
```

Opening or updating a PR requires the provider CLI or API, authentication, repository access, and permission to push. pstack does not provision any of them.

## Drive a PR only while an execution surface is running

```text
/poteto-mode inspect PR 123. report conflicts, unresolved review threads, and failed checks. fix only verified blockers.
```

A local session can inspect and act while it remains active. It does not become a background watcher because the prompt says `babysit`. For detached continuation, start a Kiro cloud session. For scheduled repository checks, configure a Kiro Web Automation. Both require explicit repository access and permissions.

Merging is a separate, potentially irreversible decision. Never infer merge authorization from green checks. Graphite or another stack manager is optional external tooling, not a pstack or Kiro prerequisite.

Next: [Run autonomous work safely](./07-overnight.md).
