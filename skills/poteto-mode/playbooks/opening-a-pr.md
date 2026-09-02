### Opening a PR

Invoked at the end of every other playbook.

**Worktree.** Work from a git worktree or branch off main. Kiro subagents share the workspace unless you explicitly give each lane a separate worktree. Create one writer-owned worktree or branch per parallel lane. Dirty branch with unrelated work: preserve it, create a fresh worktree, and apply only the scoped patch. Snarled worktree: stop and reconstruct from the durable branch rather than resetting user work.

**Commits.** Commit liberally; rebase into small, ordered commits before opening PRs. Each commit is a future PR: landable, ordered to tell the story. Amend when the fix belongs in a just-made commit; new commit when separable.

**PRs.** Review the diff for vague prose, unrelated changes, accidental complexity, and narrating comments before commit. Use the **technical-writing**, **unslop**, and **no-comments** skills when available; otherwise apply their standards directly. Write every PR title, PR description, and commit body as concise technical prose. Apply every technical-writing layer except Diátaxis. Use one word for each action, keep articles, and avoid `-ing` when a plain verb works.

**Titles.** Use Conventional Commits in the form `type(scope): subject`. Use `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, or `perf` as the type. Use the changed area, such as `pstack` or `poteto-mode`, as the scope. Keep the subject short and imperative. Apply the same `/technical-writing` and `/unslop` pass as the body. Name a real symbol when one carries the change. For example, `fix(pstack): retarget opening-a-pr babysit trigger`. Do not add a trailing period.

**Descriptions.** Use these sections in order. Drop a section when it is empty.

- `## Why`. State the intent and why this approach fits.
- `## Scope`. State facts from the diff. Name real symbols and paths. Name both sides of a rename or retarget. State what is in and out when the boundary matters.
- `## Tradeoffs`. State real choices only. Skip this section when there are none.
- `## Blast Radius`. State who and what the change touches. Explain why the change is safe or risky. If main is red without the fix, name the continuing cost.
- `## Verification`. State how you ran each check and its rigor. Name the real project or Kiro tool, such as a targeted test, terminal command, diagnostic, screenshot, simulator, or installed MCP integration. State the outcome of each check, not only the command name.

After these sections, attach videos or screenshots when they prove a claim. Do not use `## Summary` or `## Test plan` boilerplate. A commit body does not restate its subject.

**Size and stacks.** Prefer five narrow PRs to one large PR. Graphite (`gt`) is optional for repositories that already use it. Otherwise use ordinary git branches and `gh` PRs, record parent/base relationships in PR descriptions, and keep the ordered chain visible to reviewers. Branch from main only for independent work. Rebase on `main` before substantial stack work.

**Readiness.** Open every PR ready, never as a draft. Set `draft: false` when the available PR tool exposes that field. If a PR still opens as a draft, run the host's ready command, such as `gh pr ready <number>`. Run `gh pr view <number>` before you refer to PR status.

**Babysit.** Opening a PR does not start a babysit. Post the URL and keep building. Finish the phase or stack first. Run a separate babysit pass only when the user asks for one after the whole stack exists. A babysit for each new PR stalls the build and spends checks on commits that later waves rerun. Push back when feedback drifts from intent.

A subagent that opens a PR runs the available design review and prose/comment checks. It returns the URL and does not babysit. Return to the parent.
