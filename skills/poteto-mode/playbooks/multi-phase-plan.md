### Multi-phase or multi-PR plan

**You own the plan, not the code. The plan is a checklist an owner runs box by box and the operator audits from the evidence.** For work that spans phases or stacked PRs. The plan is the deliverable. Do not implement.

1. When the change is one or two files with an obvious approach, skip the plan. Say so and stop.
2. Settle open questions by prototype before you write. For a question about layout, timing, behavior, or whether an API works, run `./prototype.md`. Keep the branch, SHA, and artifacts for Appendix A. Ask the operator only about a product or preference call that no run can settle. Give options (the **never-block-on-the-human** principle skill).
3. Explore with Kiro's subagent capability (the **guard-the-context-window** principle skill). Prefer the named `poteto-agent` when configured; otherwise use suitable named agents or native subagents. Define independent scopes, fan them out, and fan their reports back into one plan. Each uses its configured or selected/default model and returns file pointers, conventions, test commands, and entry points. No inlined dumps.
4. Copy the skeleton below into the plan file and fill every placeholder. Unless the operator names a path, write the file under the repository's documented planning or decision-log directory. Keep every heading and sub-block in order. One section per PR. One PR is one change with its own evidence (the **sequence-verifiable-units** principle skill). Name the execution playbook in **How to read this**. Pick between `./autopilot-full.md` and `./autopilot-stack.md` per the rule at the end of `./autopilot-stack.md`. A standing program takes `./orchestrate.md`.
5. Apply the available technical-writing and prose-review skills, or their standards directly. The body is one Diátaxis mode, how-to. Appendices hold explanation and reference. Two rules apply verbatim. "i dont want any abstract metaphors" and "write like hemingway". Each heading states the task or finding. No long dashes. No mid-sentence colons.
6. Run `bun <poteto-mode-dir>/scripts/check-plan.mjs <plan.md>` and fix every line it prints (the **encode-lessons-in-structure** principle skill). Resolve `<poteto-mode-dir>` from the installed skill location. The script enforces the skeleton's shape, verification rule, and punctuation rules.
7. Hand back. Post the plan path and the script's output, then stop. Execution starts on the operator's explicit go, under the execution playbook the plan names.

**Verification.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked (the **prove-it-works** principle skill). That sentence is the verification rule. Every verification block opens with it. The live block is mandatory. Size the fan-out to risk and available capacity; ten lanes are a ceiling, not a default. Each lane runs at the PR head with its configured or selected/default model, drives the real surface using available Kiro UI/CLI, project, shell, screenshot, simulator, or MCP tools, and returns a concrete scenario, artifact, and pass predicate. The perf block names the metric, probe, trunk baseline measured first, and numeric failure rule. A PR that changes an interaction is review-gated. The operator reviews artifacts before merge. A PR that changes no interaction writes `**Review gate.** None. <PR id> is not review-gated.` and no boxes under it.

**Verification tools.** Pick tools that exist on the active surface. Browser and desktop work use project-native tests, available screenshots, dev-server output, diagnostics, or an installed browser/MCP integration. CLIs and TUIs use shell execution, terminal output, and project tests. Native mobile uses available simulator tooling. A PR that touches two surfaces gets evidence from both. Missing tooling is a risk in Appendix C, never a reason to invent a capability.

````markdown
# <Program> plan

<Under ten lines. What changes, for whom, the rule the program enforces, and the PR ids in order.>

## How to read this

One box is one unit of work. Every box names the evidence that checks it. A nested box is a sub-step of the box above it. Check a box only when its evidence exists, a file, a log line, a screenshot, a test run, or a SHA. The body is a how-to. The appendices explain and record.

The program runs `<poteto-mode-dir>/playbooks/<execution playbook>.md`. Resolve `<poteto-mode-dir>` from the installed skill location. <Who merges, and which PR ids are the operator's items that stop at merge-ready.>

Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

## Program checklist

### Arm the program

- [ ] State the protocol and this plan to the operator, then stop. Start execution only on her explicit go.
- [ ] On her go, record the program objective, plan path, PR ids, verification rule, merge owner, finite checkpoint cadence, and done condition in the repository decision log. In Kiro CLI only, `/goal --max <finite-count> <objective>` may drive the current bounded cycle.
- [ ] Read the execution playbook and repository steering from the current branch at program start. Re-read them at each bounded checkpoint.
  - [ ] `<poteto-mode-dir>/playbooks/<execution playbook>.md`
  - [ ] `<poteto-mode-dir>/playbooks/opening-a-pr.md`
  - [ ] `<each optional named skill or custom-agent definition the program uses>`
- [ ] Choose the execution surface. Use the attached IDE or CLI session for supervised work. Use a Kiro cloud session for detached cross-surface continuation. A local session that closes does not wake itself.
- [ ] At each checkpoint, audit the decision log, active branches, PRs, checks, and verifier reports. Fix drift, replace timeboxed workers from their stored briefs, and send the operator the queue table of PR, owner, state, head SHA, verdicts, merges, gates, and blockers.
- [ ] On the operator's hold or stand-down, send every owner a zero-writes order at once.

### Spawn owners

- [ ] Assign one owner per PR through Kiro's subagent capability, or a Kiro cloud session when detached cross-surface work is required. Every owner receives an exclusive branch or worktree, a finite timebox, and the full lifecycle named by the execution playbook.
- [ ] Follow this dependency graph. Start dependent work only after its parent merges, or base it on the parent branch when the execution playbook stacks.
  - [ ] <PR id> and <PR id> are independent and first. Both branch from `main`.
  - [ ] <PR id> after <PR id>.
- [ ] Hold the file boundaries. <PR id or class> touches only `<glob>`.
- [ ] Hold the review gate. <PR ids> change an interaction. They wait for the operator's review in chat with screenshots and a video before merge.

### PR mechanics, for every PR

- [ ] Open the PR ready, never draft, with `gh pr create --draft=false` or the repository's supported equivalent. When the repository already uses Graphite, `gt` may create a stack; otherwise use ordinary git branches and `gh` PRs.
- [ ] Run the repo's lint and typecheck once before the PR-facing push. Push with hooks on.
- [ ] Review the diff for vague prose, unrelated changes, accidental complexity, and narrating comments before commit and review.
- [ ] Triage every automated review and security-review comment per `<poteto-mode-dir>/references/bugbot-triage.md`.
- [ ] Update from current trunk before babysit and again before the merge-ready report, using the repository's established safe workflow.

### Verdict and merge, for every PR

- [ ] At the merge-ready head SHA, fan out independent verifier subagents. Include one gates lane, the live lanes from the PR's **Verify, live** block, the perf lane from **Verify, perf**, and one audit lane that distrusts the PR body. Size the fan-out to risk and available capacity.
- [ ] Clean only when every lane is `PASS`. Findings go back to the owner. A new head gets fresh evidence and a fresh verdict.
- [ ] <The merge or append rule from the execution playbook, with the patch-id rule from `<poteto-mode-dir>/playbooks/shipping.md`>.

### Boot recipe, for every live lane

Each live lane runs at the PR head in an isolated worktree, subagent, or Kiro cloud session. Drive the surface through the project and Kiro verification tools actually available.

- [ ] `git fetch origin <head-branch> && git checkout <head SHA>` in the lane's isolated checkout.
- [ ] <Start the backend and surface. Wait for ready.>
- [ ] <Deliver input through available UI, CLI, test, shell, simulator, screenshot, or MCP tools. Name the read-only diagnostics.>
- [ ] Save evidence under a repository-approved artifact path or an explicitly reported temporary path and return those paths with the report.

## <Change as a verb phrase> (<PR id>)

**Depends on.** <PR id, or None.>

**Files.**

- [ ] Edit `<path>`.
- [ ] Create `<path>`.
- [ ] Delete `<path>`.

**Build.**

- [ ] <One change. Name the symbol and the file.>

**You see.**

- [ ] <One observable result, with the exact log line or screen state.>

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] <Test file and the case it gains.> Run `<command>`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Use enough independent lanes to cover the risk, up to the plan's stated ceiling, at the exact PR head.

- [ ] Lane 1. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 2. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 3. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 4. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 5. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 6. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 7. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 8. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 9. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 10. <Scenario.> Save `<slug>.png`. Pass when <predicate>.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. <What is measured.>
- [ ] Probe. <The command or procedure, run at trunk and at the head, interleaved.>
- [ ] Baseline. Record the trunk <value> first.
- [ ] Rule. <Head against trunk, with the number that fails.>

**Review gate.** The operator reviews before merge.

- [ ] Copy lane <n> screenshots into `<media path>/<pr-id>-review-<slug>.png`.
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `<media path>/<pr-id>-review.mp4`.
- [ ] Post the screenshots and the video in chat. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] <The owner squash-merges its own PR, or the root appends the PR to the Graphite stack and the operator lands it.>

## Close the program

- [ ] Every box above is checked with its evidence.
- [ ] Reply to the operator with the report the execution playbook names.

## Appendix A. Prototype evidence

<Each open question a prototype answered, with the branch, the SHA, and the artifact links. Each question that stays unproven.>

## Appendix B. Alternatives rejected

<Each approach weighed and why it lost.>

## Appendix C. Risks

<Each risk with the PR it lands in and what the owner watches.>

## Appendix D. Links and reading list

<Docs to read before editing. Which PRs use optional design or adversarial-review skills or named agents. The repository decision-log path and durable branch handoff.>
````

**Reply:** the plan path, the PR ids with their dependencies and the review-gated set, what the prototypes proved and what stays unproven, and the check script's output.
