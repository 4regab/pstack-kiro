# Set up Benny

This file is a direct setup runbook. It is not a discoverable Kiro skill despite its retained `SKILL.md` filename.

Benny needs committed, secret-free prompt/configuration files and external infrastructure that owns Slack Events ingestion, queueing or scheduling, CI checkout, retries, and Kiro CLI 3.0 headless invocation. It does not create that infrastructure.

Kiro IDE and Kiro CLI do not schedule Slack events. Kiro Web Automations are a separate product surface and are out of scope.

Never place a secret value in this pack, a committed configuration file, a launch prompt, or an event envelope. Do not enable production traffic until all readiness and thread-safety checks pass.

## 1. Merge the pack

Ask which repository will contain and execute Benny. Merge the directory containing `FOR_AGENTS.md` into `<target-repository>/.benny/automations/benny/`.

1. Create the destination when absent.
2. Copy every source file to the same relative path.
3. Preserve destination-only files and unrelated content.
4. Keep user-owned configuration, feature maps, and routing maps outside the managed pack.
5. Inspect and merge conflicts without discarding local edits. Stop when ownership is ambiguous.
6. Verify the destination contains `FOR_AGENTS.md`, this runbook, both operational prompt documents, their references, and both launch templates.

The operational `SKILL.md` files are read directly as prompt/runbook documents. Treat them as committed files, not root skills, slash commands, or editor-managed state.

## 2. Create committed, secret-free configuration

Copy and adapt:

- `../../templates/configuration.example.yaml` to `.benny/configuration.yaml`
- `../reproduce-and-fix-issues/references/feature-map.example.md` to `.benny/feature-map.md`
- `../triage-issue-reports/references/routing.example.md` to `.benny/routing.md` when routing is needed

Pack refreshes may update source-managed examples after conflict review, but must never overwrite these user-owned copies.

Use stable repository-relative paths. The external worker must check out a revision containing every referenced prompt, config, and map. Missing or uncommitted operational inputs are a hard failure; do not paraphrase around them at runtime.

Confirm these choices:

- Source Slack channel ID and configured triage identity
- Optional operations channel ID
- Repository location and default branch
- Tracker adapter, target fields, and compensation capability
- Optional routing-map path
- Control adapter and completed feature-map path
- Slack, tracker, repository, and control action/tool names
- Status strings, artifact retention, and polling/effort budgets
- Optional narrowly scoped bot-token environment-variable name

All adapter, MCP server, and tool/action names must come from deployment configuration. Do not invent fixed names. Model and session selection belong to the external Kiro CLI deployment.

## 3. Configure external orchestration

Use existing Slack Events, queue, CI, or scheduler infrastructure. Benny does not implement these services.

### Ingress responsibilities

1. Validate the Slack request signature and reject malformed, wrong-channel, or unsupported events.
2. Accept only the intended new top-level report trigger.
3. Preserve `event_id`, `source_channel_id`, `message_ts`, and canonical root `thread_ts` in a secret-free immutable envelope.
4. Deduplicate Slack retries and queue deliveries with a stable key derived from the workflow, source channel, and root thread timestamp.
5. Enqueue triage without placing credentials in the envelope.

### Worker responsibilities

1. Check out the configured committed revision in an isolated workspace.
2. Verify `.benny/configuration.yaml`, the matching launch template, the matching operational prompt document, and referenced maps exist in that revision.
3. Construct one positional prompt from the committed launch template plus the immutable envelope. Never put secrets in the prompt or command arguments.
4. Invoke the deployment's authenticated Kiro CLI 3.0 headless session:

   ```sh
   kiro-cli chat --no-interactive --trust-tools="$KIRO_WORKFLOW_TRUSTED_TOOL_CATEGORIES" --require-mcp-startup "$PROMPT"
   ```

   Render `KIRO_WORKFLOW_TRUSTED_TOOL_CATEGORIES` from the matching triage or repro allowlist. Triage must not receive control, code-write, or draft-pull-request categories. Do not use `--trust-all-tools`.

5. Before launch, configure an isolated Kiro CLI environment with exactly the MCP servers listed for that workflow. Verify the committed names match the effective Kiro MCP configuration; missing, extra, or mismatched servers fail before launch.
6. Require every effective MCP server to start. Treat exit code `3` as MCP startup failure and every other nonzero exit as a failed run.
7. Enforce time budgets, retries, workspace cleanup, artifact retention, and run-output capture externally.

The triage marker may cause the external event handler or queue coordinator to enqueue repro. It must validate the configured triage author, exact original root thread, and exactly one accepted marker. It must pass the original root coordinates, never the marker reply timestamp. Missing, conflicting, untrusted, `other`, or timed-out markers produce no repro job.

## 4. Validate adapter capabilities

Triage requires configured capabilities to:

- Read the source root, thread, and attachments
- Post a reply with an explicit thread timestamp
- Search and read tracker issues
- Create and update tracker issues
- Compensate by canceling, closing, or deleting an issue created by the run when the Slack verdict fails

Repro requires configured capabilities to:

- Read and reply within the immutable source thread
- Optionally create and edit one operations-channel status thread
- Read repository history and create draft-only pull requests
- Drive the target app through the configured control adapter
- Capture screenshots and recordings outside the repository
- Inspect app state without mutating it

The optional environment variable named by `slack.optional_bot_token_env` may fill only a configured narrow gap, such as attachment download or editing one operations status. Store its value in the external secret store or environment, never YAML, and never expose it to a child worker.

Do not use undocumented integration endpoints. Missing capabilities fail closed.

## 5. Validate routing and control

If routing is configured, copy the routing example to `.benny/routing.md`. Keep owner pings off by default. A ping is allowed only for a configured feature owner or a strongly evidenced regression author. Without a matching route, do not guess a destination or owner.

Read `../reproduce-and-fix-issues/references/control-adapter.md` and the completed feature map. Confirm the configured adapter can bring up the target revision, navigate mapped features through the real UI, arrange declared states safely, inspect state read-only, capture screenshots, record the path, reset independently, and clean up without deleting user work.

If any required feature or capability is absent, leave repro disabled.

## 6. Bind committed launch prompts

The external triage job must supply [`../../templates/triage-automation-prompt.md`](../../templates/triage-automation-prompt.md) with the immutable event envelope to `kiro-cli chat --no-interactive`. That prompt directs the session to `.benny/automations/benny/skills/triage-issue-reports/SKILL.md` and `.benny/configuration.yaml`.

The external repro job must do the same with [`../../templates/reproduce-automation-prompt.md`](../../templates/reproduce-automation-prompt.md). It must retain the original source coordinates and pass only after the trusted-marker gate.

The coordinator session is the only Slack poster. Analysis workers are read-only. A code worker may edit only in an environment that provably excludes Slack credentials and every Slack write capability.

## 7. Test readiness and thread safety

Use a test channel or harmless test report. Verify the runner uses the committed revision and exact committed paths.

1. Ingress rejects an invalid signature, wrong channel, reply event, and duplicate delivery without launching a run.
2. Triage stores the root `thread_ts`, posts exactly one verdict reply, and emits exactly one fixed Benny protocol marker.
3. Repro accepts a marker only from the configured triage identity under the same immutable root.
4. No source-channel root message, fallback thread, cross-post, broadcast, or DM appears.
5. A delegated worker cannot access Slack credentials or any Slack write capability.
6. Missing coordinates, deleted/inaccessible parent, failed preflight, missing config, or missing adapter produces no source post and no uncompensated tracker issue.
7. The control-adapter readiness check completes real UI drive, read-only inspection, screenshot, recording, independent reset, and cleanup without a source-channel post.
8. Existing fix ownership switches to verification and never creates a competing pull request.
9. A new pull request is draft-only and appears only after twice-repeated before/after UI proof, checks, secret review, and blast-radius review.

Enable normal traffic only after all checks pass. This blueprint intentionally stops at orchestration requirements; do not add an unrequested Slack service, queue worker, or scheduler implementation.