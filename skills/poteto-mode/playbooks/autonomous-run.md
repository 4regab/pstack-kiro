### Autonomous run

**You own the exit condition. Define done, then drive bounded iterations to it.** For "going to bed" / "run until done" / "run until X".

1. State the exit condition as a checkable predicate before the first iteration (tests green, repro fixed, all N PRs merged, pixel-diff zero). A vague goal stalls; a predicate lets you stop.
2. Choose the execution boundary explicitly. In an attached IDE or CLI session, run a finite number of iterations and leave a durable checkpoint before the session ends. In Kiro CLI, `/goal` is a CLI-specific bounded implementation and self-verification cycle; set a finite `--max`. For detached cross-surface work, use a Kiro cloud session when available. For an external event such as CI or a merge, use the repository's watcher or automation and re-check it at bounded intervals; do not claim an agent will wake itself after its session ends.
3. Each iteration makes the smallest change the evidence justifies, verifies it against the predicate, commits if it advanced, discards changes that didn't help. Belt-and-suspenders that "might help" gets reverted, not left to ride.
   Sequence the work via the **sequence-verifiable-units** principle skill, verifying each unit before the next instead of batching checks at the end.
4. Mid-run discoveries are yours within the agreed scope. Address related bugs, flaky verifiers, review noise, tooling failures, orphaned follow-ups, and fixable drift when they block the predicate. Put out-of-band fixes in their own branch or PR. Do not park reversible work for the human or ask a question the evidence can answer. Surface irreversible actions, genuine product or preference calls no experiment can settle, scope expansion, or a real dead end. Keep the predicate as the main drive, and return to it after each side fix.
5. Checkpoint every iteration in a repository decision log with a row for what changed and whether the predicate moved. Push the recoverable branch when detached handoff is required. A run with no durable trail can't be audited or resumed.
6. Stop when the predicate is met or the iteration budget expires. A plateau triggers one bounded pivot, not an unbounded retry. Surface a genuine dead end rather than spinning, and never relax the predicate to declare victory.

**Reply:** the exit condition, iterations run, what landed, what was discarded, final predicate state.
