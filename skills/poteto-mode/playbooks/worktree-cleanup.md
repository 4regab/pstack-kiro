### Worktree and simulator cleanup

**You own the disk and the safety gate.** Prune merged or abandoned git worktrees and stale iOS simulators to reclaim space. Deletion is irreversible, so every step guards against deleting something in use or holding uncommitted work.

1. Snapshot and audit. Record `df -h /`, then run `../scripts/worktree-audit.sh` (principle-build-the-lever). It reads paths from `git worktree list`, never hand-types them. Pass an explicitly exported transcript directory as `KIRO_TRANSCRIPTS_DIR` only when the user supplied one. Without that export the script treats chat activity as unknown and cannot classify a worktree as safe from transcript evidence alone.
2. The bucket is advice, not permission. Current Kiro context, active cloud sessions, branches, PRs, and the user's explicit pinned set are the real artifacts (principle-prove-it-works). Cross-check every candidate. Never inspect private internal session storage.
3. Verify usage before deleting. For every recent or unknown activity row, fan out subagents only over the explicitly supplied exports and repository evidence. Each reports whether the worktree is active and which branch or session owns it. If evidence is missing, hold it for review.
4. Pause on irreversible loss. `wip:N` is N tracked uncommitted edits. Show the diff and get a decision first. `scratch:N` is untracked content; name the files and ask before deletion when their purpose is unclear.
5. Prune only the confirmed set. Per path, ask for confirmation before `git worktree remove --force <path>`. If ignored build artifacts leave a directory behind, confirm again before filesystem deletion. Then run `git worktree prune`, re-list, and record `df -h /`.
6. Simulators and caches need the same explicit gate. List candidates and sizes first. Delete unavailable simulators or disposable caches only after confirmation. Never infer that application support, session databases, snapshots, package caches, or device data are safe because they are old.

This playbook deletes user state with no code review to catch a slip, so the gates above are the review.

**Reply:** `df -h /` before and after with space reclaimed, the worktrees pruned, and a one-line reason for each item held back.