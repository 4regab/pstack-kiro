# Steer with principle names

pstack ships 21 principles as individual skills. `poteto-mode` indexes them so a short name can point to a complete engineering rule. Invoke or reference pstack when you want those rules applied; do not rely on an unstated persistent mode.

## Steering in practice

```text
apply subtract before you add. delete obsolete adapters before designing what remains.
```

```text
apply prove it works. run the real import flow and show the written records.
```

```text
apply separate before serializing shared state. give concurrent writers separate worktrees.
```

A useful principle citation names the decision it changed. Name-dropping without a changed decision or check is not application.

## The 21 principles

### Core

- [Laziness Protocol](../../skills/principle-laziness-protocol/SKILL.md): prefer deletion and the smallest correct change.
- [Foundational Thinking](../../skills/principle-foundational-thinking/SKILL.md): choose core data structures before logic.
- [Redesign from First Principles](../../skills/principle-redesign-from-first-principles/SKILL.md): integrate requirements instead of bolting them on.
- [Subtract Before You Add](../../skills/principle-subtract-before-you-add/SKILL.md): remove dead weight first.
- [Minimize Reader Load](../../skills/principle-minimize-reader-load/SKILL.md): collapse unnecessary layers and hidden state.
- [Outcome-Oriented Execution](../../skills/principle-outcome-oriented-execution/SKILL.md): converge on the target design without throwaway compatibility states.
- [Experience First](../../skills/principle-experience-first/SKILL.md): choose the user's result over implementation convenience.
- [Exhaust the Design Space](../../skills/principle-exhaust-the-design-space/SKILL.md): compare competing prototypes when precedent is absent.
- [Build the Lever](../../skills/principle-build-the-lever/SKILL.md): build the script or tool that performs or proves repeatable work.

### Architecture

- [Model the Domain](../../skills/principle-model-the-domain/SKILL.md): encode repeated rules in one structure.
- [Boundary Discipline](../../skills/principle-boundary-discipline/SKILL.md): validate at trust boundaries and keep internals typed.
- [Type System Discipline](../../skills/principle-type-system-discipline/SKILL.md): make invalid states unrepresentable.
- [Make Operations Idempotent](../../skills/principle-make-operations-idempotent/SKILL.md): make retries converge.
- [Migrate Callers Then Delete Legacy APIs](../../skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md): migrate and delete in one verified wave.
- [Separate Before Serializing Shared State](../../skills/principle-separate-before-serializing-shared-state/SKILL.md): remove sharing before adding coordination.

### Verification

- [Prove It Works](../../skills/principle-prove-it-works/SKILL.md): verify the real artifact.
- [Fix Root Causes](../../skills/principle-fix-root-causes/SKILL.md): reproduce and trace before changing code.
- [Sequence Work into Verifiable Units](../../skills/principle-sequence-verifiable-units/SKILL.md): end each small unit with a check.

### Delegation and learning

- [Guard the Context Window](../../skills/principle-guard-the-context-window/SKILL.md): route bulk reading to subagents and keep summaries in the parent.
- [Never Block on the Human](../../skills/principle-never-block-on-the-human/SKILL.md): proceed on reversible work and reserve confirmation for irreversible actions.
- [Encode Lessons in Structure](../../skills/principle-encode-lessons-in-structure/SKILL.md): turn repeated advice into types, tests, lint, or scripts.

Next: [Make it yours](./09-make-it-yours.md).
