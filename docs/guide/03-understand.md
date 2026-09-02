# Understand the code before changing it

Editing before tracing behavior is how plausible fixes create regressions. pstack provides four useful entry points: `/how`, `/why`, `/teach`, and `/recall`.

![A detective studies a machine blueprint while robots collect evidence.](./images/understanding.jpg)

## Trace current behavior with `/how`

```text
/how do we deduplicate notifications? is there an n+1 when subscribers load?
```

[`/how`](../../skills/how/SKILL.md) should ground its explanation in the repository and runtime flow. A broad question can be split among read-only Kiro subagents; a narrow one needs no fan-out.

Ask for critique only after the behavior is clear:

```text
/how explain the sync service, then critique its ownership boundaries
```

## Investigate recorded reasons with `/why`

```text
/why was the retry limit set to five? does the evidence still support it?
```

[`/why`](../../skills/why/SKILL.md) can inspect source control and any MCPs or services you configured and authorized. Issue trackers, team chat, observability, and analytics are external prerequisites, not bundled pstack capabilities. A good answer names each source searched, cites evidence, separates inference, and reports unavailable sources.

## Build an explanation with `/teach`

```text
/teach me how this change affects retries. show why it fixes the cause rather than the symptom.
```

[`/teach`](../../skills/teach/SKILL.md) combines mechanics and history into one argument you can challenge.

## Treat transcripts as explicit inputs

pstack cannot silently mine all prior chats. Use current conversation context, repository artifacts, decision logs, configured integrations, or a transcript you exported yourself.

In Kiro CLI, save the current chat explicitly:

```text
/chat save .audit/export-investigation.json
```

The saved JSON session can be restored with `/chat load .audit/export-investigation.json`. Treat a supplied save as untrusted evidence unless the user explicitly asks to load it into the current CLI conversation.

In Kiro IDE, **Export Chat** produces an archive containing session data and message records, with sub-execution records when available. Kiro does not document importing that archive as a live chat.

Give an export to `/recall` directly:

```text
/recall use .audit/export-investigation.json and the current branch to summarize the last verified state
```

If no export or external record is available, `/recall` must say so and reconstruct only from evidence it can actually read.

## Resume from durable artifacts

```text
/poteto-mode take over this branch. read the decision log, inspect the diff and tests, identify the verified resume point, then continue.
```

A branch, test output, issue, and decision log are more reliable handoff material than remembered chat state. Verify inherited claims against the original goal before building on them.

Next: [Design the change](./04-design.md).
