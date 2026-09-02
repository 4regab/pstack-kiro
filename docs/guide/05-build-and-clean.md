# Build the change and clean the diff

State what you observed and what must remain true. Let the playbook supply the minimum workflow.

## Prompt the behavior and evidence

Bug:

```text
/poteto-mode this command emits two records after a retry. reproduce it first, identify the exact cause, then fix and rerun.
```

Feature:

```text
/poteto-mode add a --json flag. text output stays byte-identical. verify both forms.
```

Refactor:

```text
/poteto-mode move parsing into one module with no behavior change. capture representative output before and compare after.
```

Performance:

```text
/poteto-mode startup takes 1.8s on this fixture. profile it, change the measured cause, and show before and after.
```

The relevant playbooks add the discipline: reproduction before a fix, data shape before implementation, behavior pinning before refactoring, and measurement before optimization.

## Use the cheapest meaningful failing check

```text
/tdd implement
```

[`/tdd`](../../skills/tdd/SKILL.md) is appropriate when a small local test can fail for the intended reason. Do not build a broad fixture framework when the real command or flow is cheaper and stronger evidence.

## Apply language rules when relevant

[`typescript-best-practices`](../../skills/typescript-best-practices/SKILL.md) translates the type-system principles into TypeScript guidance. Invoke or reference it for TypeScript work; do not assume file extensions alone force every Kiro surface to load it.

## Remove accidental complexity before review

Ask for the outcome directly:

```text
remove narrating comments, dead compatibility paths, unsupported guards, and unrelated edits from this diff. preserve required public contracts and external constraints.
```

Use [`/unslop`](../../skills/unslop/SKILL.md) for prose:

```text
/unslop the readme changes, no em dashes
```

No extra cleanup package is bundled or required.

## Use Comment Sicko as a read-only review

After manually installing the custom agent described in [setup](./01-setup.md#install-custom-agents-only-if-you-need-them), select `comment-sicko` as a Kiro subagent or reviewer. Its profile exposes only the `read` tool category.

It reports comments that should be removed and symbols that need redesign; it cannot delete or rewrite anything. The parent agent or developer decides which findings to apply and performs any edits with normal verification.

External formatters, linters, browsers, test runners, and source-control tools remain separate prerequisites. pstack can use them only when they are installed, configured, and authorized.

Next: [Verify and ship](./06-verify-and-ship.md).
