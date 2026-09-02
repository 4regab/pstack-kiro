---
name: reflect
description: Review an exported transcript or the current conversation with three independent lenses, surface durable learnings, and route approved findings to concrete Agent Skill edits. Use when the user says reflect.
---


# Reflect

Mine the current conversation for durable learnings, then route them into skill edits.

## When to invoke

- The user said "reflect" or "/reflect".
- A complex task (5+ tool calls) just landed cleanly and the recipe is worth keeping.
- The agent hit dead ends, found the working path, and the path generalizes.
- The user corrected the agent's approach mid-task.
- A non-trivial workflow emerged that isn't captured anywhere.

Skip when the conversation is trivial, off-topic, or already covered by an existing skill the parent followed correctly. One-offs are not learnings.

## Process

### 1. Gather the active conversation

Use an exported transcript when the current surface provides one, or a transcript path explicitly supplied by the user. Never probe private Kiro storage or infer an internal transcript layout. Confirm that a user-provided file belongs to the intended workspace before reading it.

If no exported transcript or explicit path is available, write a tight digest from the current conversation context. Include the user's goal, corrections, decisions, tools used, evidence, and unresolved work. Pass that digest to reviewers; do not claim it is a complete transcript.

### 2. Spawn three reviewers in parallel

Invoke three named Kiro reviewer subagents concurrently through the subagent capability. Use the judgment, tooling, and divergent roles when those named agents exist; otherwise invoke the default subagent three times with the distinct templates below. Omit per-call model settings. Prompts forbid file writes; the parent applies edits. MCP availability comes from each agent's configuration, so a reviewer must report a referenced source as unavailable rather than assume access.

| Lens | Prompt template |
|---|---|
| Judgment | `references/judgment-reviewer.md` |
| Tooling | `references/tooling-reviewer.md` |
| Divergent | `references/divergent-reviewer.md` |

Pass each template verbatim, substituting the exported transcript path or current-context digest where marked. Reviewers return findings through the subagent capability.

### 3. Synthesize

Invoke one named Kiro synthesizer through the subagent capability, or use the default subagent if none exists. Omit per-call model settings. Use `references/synthesizer.md` verbatim, with each reviewer's full output inlined where marked. The synthesizer may spot-check cited sources available through its configured tools and must mark unavailable sources instead of guessing. It returns a structured Accepted / Rejected / Backlog list.

### 4. Structural enforcement check

Sanity-check the synthesizer's Accepted list. For any item that would be enforced more reliably by a lint rule, script, metadata flag, or runtime check, move it from Accepted to Backlog. The synthesizer already applies this criterion; this is a final pass before edits land. See the **encode-lessons-in-structure** principle skill.

### 5. Apply

Before applying any Accepted edit, present the synthesizer's full Accepted/Rejected/Backlog output to the user and wait for explicit approval. The user picks which subset to apply and may redirect routings. Skill changes affect every future agent in the org; do not auto-apply.

Backlog items file to whatever devex / backlog tracker your team uses automatically. Those are tracker submissions, not skill edits. Only the Accepted list waits for approval.

For each approved Accepted item, follow the Routing field exactly:

- Trivial existing-skill edit (a one-line bullet, a tightened sentence, a stale fact corrected): parent does directly.
- Substantive existing-skill edit (a new section, a new pattern table, more than ~10 lines): use an installed Kiro skill-authoring capability when available; otherwise edit the existing `SKILL.md` minimally, preserving its frontmatter and structure, then validate it.
- `tune description: <skill path>` (the skill exists but didn't trigger when it should have): optimize the existing Agent Skills `description` and verify it remains a single useful field.
- `new skill: <kebab-name>`: create `.kiro/skills/<kebab-name>/SKILL.md` with only `name` and `description` frontmatter plus the minimum instructions. If the desired location or behavior is ambiguous, require explicit user input instead of inventing it.

If your environment ships a SKILL.md validator, run it on every touched skill before declaring done. Skip this step if it doesn't.

### 6. Summarize for the user

Short list, no preamble:

- Edits applied: `<skill path>`. What changed, one line each.
- New skills created: `<skill path>`. One line each (rare).
- Backlog filed to the devex tracker: `<issue title>` (`<tags>`). One line each.
- Dropped: one line per rejected finding + reason from the synthesizer.
