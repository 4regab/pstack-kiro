# Benny

Benny is a provider-neutral blueprint for two externally triggered Slack issue workflows: one triages reports; the other reproduces confirmed bugs and may prepare a bounded draft fix.

It does not implement Slack ingestion, scheduling, queues, or CI. Kiro IDE and Kiro CLI do not provide Slack event scheduling. Existing external Slack Events/queue/CI or scheduler infrastructure invokes a Kiro CLI 3.0 headless session with the committed launch prompt and event envelope:

```sh
kiro-cli chat --no-interactive "$PROMPT"
```

Because Benny calls tools in a non-interactive session, the external runner must render separate least-privilege `--trust-tools` categories for triage and repro. It must launch each workflow with an isolated Kiro CLI MCP configuration that matches that workflow's committed required-server list and use `--require-mcp-startup`. Do not use `--trust-all-tools`.

Kiro Web Automations are separate and out of scope for this IDE/CLI port.

## Set it up

1. Merge this directory into the target repository at `.benny/automations/benny/`. Preserve destination-only files and review conflicts instead of overwriting local edits.
2. Adapt and commit the secret-free [`configuration.example.yaml`](./templates/configuration.example.yaml), [`routing.example.md`](./skills/triage-issue-reports/references/routing.example.md), and [`feature-map.example.md`](./skills/reproduce-and-fix-issues/references/feature-map.example.md) under `.benny/`.
3. Configure deployment-specific Slack, tracker, repository, and control adapters. Their MCP/tool names are configured inputs, not names supplied by Benny.
4. Configure external ingress and workers to validate Slack events, preserve immutable root-thread coordinates, check out the committed revision, and invoke the matching committed prompt template through `kiro-cli chat --no-interactive`.
5. Keep secrets in the external runner's secret store or environment, then run the adapter-readiness and harmless thread-safety checks in [`skills/setup-benny/SKILL.md`](./skills/setup-benny/SKILL.md).

The operational files remain named `SKILL.md` because they live outside root `skills/`; they are direct prompt/runbook documents without skill frontmatter or slash-command behavior.