### Pause safely

**You own a clean stop. Leave a checkpoint a cold-start agent can resume from.** For "pause safely", "I need to go offline", "change sessions", or "board my flight", and when context is about to compact or summarize. This is explicit only. On "keep going", "going to bed, keep going", or "don't stop", use the bounded Autonomous run rules and leave durable checkpoints.

1. Stop at a safe boundary. Finish the current atomic step or back out of it. Never stop mid-edit in a known-broken state. Start nothing new, and cancel any nested subagents.
2. Don't cross an irreversible line to pause. No PR and no push unless you already had one out.
3. Make the work durable. Preserve uncommitted edits without overwriting unrelated user work. When the user has authorized commits, commit the scoped edits as one clear `wip:` commit on the current branch and push the branch if cross-surface recovery is needed. Otherwise leave the tree intact and record the exact diff and path state in the resume note.
4. Write the resume note outside transient chat context, preferably in the repository's decision-log or handoff location. Capture intent, progress and verification, current branch and SHA, next steps, key files, and gotchas. A CLI `/chat save` archive or exported transcript may supplement the note, but the branch and repository note are the durable handoff.

**Reply:** where you are in the workflow, what's on disk versus still in your head (paths, no diff dumps), the commits you made and whether the tree is clean, and the first action on resume. This is a pause, not a final report. Resume is the Session pickup playbook reading this note.
