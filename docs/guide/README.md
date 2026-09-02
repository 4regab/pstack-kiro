# The pstack guide

pstack works best when you describe the result and the evidence that will prove it. `/poteto-mode` supplies the workflow; Kiro supplies Powers, custom agents, native subagents, local sessions, and optional cloud execution.

1. [Set up pstack](./01-setup.md). Install the Power, optionally copy the custom agents, and validate the package.
2. [Route work through `/poteto-mode`](./02-poteto-mode.md). Give it a goal and invoke it when you want the workflow applied.
3. [Understand the code](./03-understand.md). Use source, configured integrations, and explicit transcript exports before editing.
4. [Design the change](./04-design.md). Use Kiro-native subagents for independent attempts and bounded review.
5. [Build and clean the change](./05-build-and-clean.md). Reproduce, implement, and keep the diff small.
6. [Verify and ship](./06-verify-and-ship.md). Check the real artifact, then use separately configured source-control tools.
7. [Run autonomous work safely](./07-overnight.md). Choose an active CLI `/goal`, a Kiro cloud session, or a Web Automation deliberately.
8. [Steer with principle names](./08-principles.md). Use the 21 names as compact engineering direction.
9. [Make it yours](./09-make-it-yours.md). Build a project skill or steering rule from explicit evidence.
10. [Recipes and pitfalls](./10-recipes-and-pitfalls.md). Copy Kiro-native prompts and avoid common failures.

## The one habit to keep

Give the agent a goal and a checkable finish condition:

```text
/poteto-mode the export writes duplicate rows when a retry lands mid-run. reproduce it first, then fix it and show the real output.
```

You do not need to enumerate every skill. A short goal, constraints, and executable checks are stronger than a long ceremony.

Next: [Set up pstack](./01-setup.md).
