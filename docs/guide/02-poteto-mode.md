# Route work through `/poteto-mode`

`/poteto-mode` is the main pstack entry point. Give it the outcome, the constraints, and the evidence that will count as done. It selects the matching playbook and uses other skills when needed.

![A dispatcher routes robots toward bug-fix, feature, and investigation work.](./images/router.jpg)

## Say the goal, not the ceremony

```text
/poteto-mode users get two notifications after a retry. reproduce it first, then fix the root cause and verify one notification.
```

Do not prescribe `/how`, `/architect`, `/arena`, and every later step unless you intentionally want to override the playbook. The workflow is there to carry that sequencing.

For a read-only investigation, say so explicitly:

```text
/poteto-mode explain why the cache entry survives logout. do not change files.
```

For a new task in a long conversation, restate enough context to remove ambiguity:

```text
/poteto-mode new task: inspect the cache invalidation path. no edits until the live path is traced.
```

Short follow-ups such as `continue` rely on ordinary conversation context, not a guaranteed persistent pstack state. Reinvoke `/poteto-mode` when its playbook matters.

## Use Kiro-native subagents deliberately

Kiro can invoke built-in context-gathering and general-purpose subagents, plus custom agents you installed. Subagents have isolated conversation context and can run in parallel, while relevant workspace access is still shared.

A parent agent needs the `subagent` tool category to delegate. The optional `poteto-agent` profile already includes it and includes installed Powers.

Give every delegate:

- one bounded question or file set;
- a clear read-only or writing role;
- a required check or output format;
- an isolated worktree or directory if it writes concurrently.

Parallelism is useful only when the slices are independent or the attempts are intentionally compared.

## Separate concurrent writers

```text
/poteto-mode compare two parser designs. put each implementation in its own worktree and run the same fixture suite against both.
```

Kiro subagents can share the same workspace. Tool isolation does not prevent two writers from colliding in one checkout. Worktrees make ownership visible and cleanup reviewable.

## Choose the execution surface explicitly

A local IDE or CLI conversation runs while that session is active. For a bounded autonomous loop in CLI, use [`/goal`](./07-overnight.md#use-goal-in-kiro-cli). For work that must continue after clients disconnect, use a [Kiro cloud session](./07-overnight.md#use-a-cloud-session-for-detached-work). Scheduled repository work belongs in Kiro Web Automations, with its repositories, schedule, permissions, and plan configured separately.

Next: [Understand the code](./03-understand.md).
