### Orchestrate

**You own the program, never the code. Author briefs, drain the queue, keep the frontier green, decide.** Use this for a project that spans many PRs or sessions and needs a standing coordinator. One task driven to a predicate is Autonomous run. Work one agent can finish inside the active session's budget does not need this ceremony.

Ceremony must scale with the program. Every gate costs coordinator time. Collapse cheap, near-identical units instead of wrapping each in a large process.

Three rules carry the rest.

- Completions are queue events, not interrupts.
- Every worker starts from one complete stored brief.
- The brief and repository state are the durable handoff. Chat memory is not.

Open a task list with the steps below. A skipped step stays listed with `skip: <reason>`.

#### Roles and placement

- **Coordinator.** The parent Kiro session frames the program, authors briefs, drains reports, owns the operator update, and makes judgment calls. It does not edit code. It uses Kiro's subagent capability for bounded fan-out and fan-in. State reads and writes go through `../scripts/orch/orch.ts` at drain points.
- **Track owner.** Use a custom named agent only when a track needs distinct prompts, tools, permissions, or model configuration. Otherwise the coordinator owns the track directly. Avoid unnecessary nesting because each layer costs context and hides child progress.
- **Worker or verifier.** Use a named agent or native subagent for work within the attached session. Use a Kiro cloud session when work must continue detached and remain available across supported surfaces. In Kiro CLI, `/spawn` is a CLI-specific user command for a separate long-running session, not a subagent call; give it the stored brief and repository pointers explicitly. Every writer gets an exclusive branch or worktree.

Define the fan-out graph before execution. Independent workers run in parallel. Dependencies wait for upstream reports, then receive those reports in their briefs. Fan all reports back into the coordinator for one verdict. Subagents do not ask the operator questions; the coordinator asks ordinary questions in chat when evidence cannot settle a product decision.

#### Store layout

Create a durable, repository-approved program directory such as `docs/decisions/<project-slug>/`. Commit it when the program needs cross-session or cross-surface handoff; otherwise keep it ignored but preserve it with the branch. Use `bun ../scripts/orch/orch.ts` from this playbook directory, or resolve the script from the installed skill directory. The plain TSV, Markdown, and JSON files remain readable without the CLI.

- `preferences.md` records numbered standing constraints: branch shape, verification bar, forbidden paths, escalation policy, and tool availability.
- `overview.md` appends PR and issue facts.
- `units.tsv` records id, track, state, branch, PR, head SHA, and brief path.
- `frontier.json` records ordered PRs, branches, head SHAs, generation, and lowest unmerged PR.
- `ledger.tsv` records verification keyed by PR and head SHA.
- `inbox/` holds completion pointers.
- `gates.md` holds questions, options, and the default when no answer is available.
- `decisions.tsv` records consequential choices and evidence.
- `status.md` is generated from the tables at each drain.

Each file has one writer. Owners publish facts; readers aggregate at read time.

#### The brief

Every worker receives a complete brief. A missing field is a refuse-to-dispatch condition.

```
GOAL         one sentence and an observable outcome
SCOPE        paths allowed and forbidden; exclusive branch or worktree
CONTEXT      repository files, PRs, upstream reports, and decision-log paths
ACCEPTANCE   checkable criteria, one per line
VERIFY       exact commands and available UI/CLI verification tools
TIMEBOX      finite cap; return partial evidence at expiry
FORBIDDEN    no topology changes, force-push, or out-of-scope fixes
REPORT       status, branch, SHA, PR, verdict, checks run, deviations, follow-ups
STANDING     preferences.md content or repository path
```

Collapse this to a paragraph for a one-command unit, but keep goal, scope, verification, timebox, and report. Do not depend on implicit chat history. Start a fresh worker with a consolidated brief when context is lost.

#### Steps

1. **Frame.** State a countable done predicate, units, rough effort, expected PR shape, finite execution budget, and tracks. If one agent can finish within that budget, run Autonomous run instead. Stop assigning new work near the end of the budget and land verified units.
2. **Install the runtime.** Run `bun <poteto-mode-dir>/scripts/orch/orch.ts --store <program-dir> init`, resolving both placeholders first. Write standing orders, seed the frontier from existing PRs, and create the repository decision log before dispatch.
3. **Pilot.** Run one representative unit through brief, worker, verification, branch or PR, ledger, and merge. Fix the contract from evidence before broad fan-out.
4. **Scale.** Run a rolling window of independent workers up to the capacity the coordinator can drain. Recompute ready work after each drain and relay upstream reports into dependent briefs.
5. **Drain.** Process completion pointers in batches. Classify each as landed, needs verification, failed, expired, or noise. Update units, ledger, frontier, and status before dispatching replacements.
6. **Land.** Integrate verified units continuously. Graphite is optional when the repository already uses it. Otherwise use ordinary git branches and `gh` PRs, merging in dependency order. Keep one topology writer.
7. **Close.** Reconcile every worker to a terminal row, verify the done predicate on the real artifact, confirm each landed head has a verdict, preserve the branch and decision log, and write the exact resume command for unfinished work.

#### Queue and drain

- Push completion pointers into `inbox/`; never deep-review inline.
- Drain after critical sections, at track rollups, before operator updates, and at the declared bounded checkpoint cadence.
- Finish brief authoring, topology operations, conflict decisions, gate writes, and ledger or frontier updates before draining.
- Account for every worker as arrived, replaced, expired, or absorbed. Never silently redo missing work.
- End each drain with counts, changes, and open gates from generated status.

#### Stack safety

- Treat the frontier as computed data, not narrative.
- Graphite users recompute it from `gt` where Graphite metadata exists. Non-Graphite users compute it from git refs and GitHub base relationships through `gh`.
- Exactly one topology writer may restack, rebase shared branches, retarget PRs, or merge.
- Workers never mutate stack topology. A changed head SHA voids its old verifier row unless patch-id evidence proves the patch unchanged.
- Merges and topology changes are units with briefs and receipts.

#### Verification

Scale verification to risk. The worker may run a cheap deterministic command; the coordinator spot-checks the receipt. Use an independent verifier subagent for expensive, judgment-heavy, security-sensitive, or high-blast-radius work. Use project tests and the UI, CLI, shell, diagnostics, screenshot, simulator, or MCP tools actually available. Never invent an absent browser or verification capability.

Record verdicts in `ledger.tsv` keyed by PR plus head SHA. CI green is an input, not a verdict. Behavioral work needs live evidence. A changed head requires re-verification. Externalize output immediately to a branch, PR, ledger row, or repository artifact.

#### Liveness and failure

- Inspect durable side effects: branches, SHAs, PRs, checks, ledger rows, and reports. When using Kiro cloud sessions, inspect their documented session state from a supported client. Do not infer liveness from undocumented session storage or relaunch a worker merely to poll it.
- Every worker has a finite timebox. On expiry, mark it terminal and start a fresh worker with a smaller or corrected brief when the retry budget permits.
- Retry at most twice. Change one cause at a time: smaller scope for capacity failure, same brief for transient network failure, corrected tools for tool failure. Then abandon or replan.
- When infrastructure repeatedly fails, write a terminal handoff with completed state, durable locations, and the exact resume command. Do not claim the coordinator continues after an attached local session closes.
- A later report reconciles against the current frontier before acceptance. Salvage unique findings through a fresh unit, never a blind merge.

#### Escalation

Ask the operator, in ordinary chat, about irreversible actions, genuine product or preference calls no experiment settles, contradictory standing orders, and program-level dead ends that survived a replan. Park each question in `gates.md` first.

Handle frontier updates, safe retries, CI triage, review-thread triage, formatting, and already-scoped reversible work without asking. Mid-run discoveries fix only what blocks the frontier; park unrelated work as follow-ups.

**Reply:** the predicate and counts from `units.tsv` and `ledger.tsv`, tracks and landed work, frontier PRs plus SHAs, verdict summary, abandoned units and reasons, operator gates, store path, decision-log path, and durable branch or PR links.