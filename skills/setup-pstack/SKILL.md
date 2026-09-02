---
name: setup-pstack
description: Configure model selection for pstack on Kiro IDE or CLI without a separate model registry. Use for setup-pstack, configuring pstack models, or pinning a named custom agent to an available model.
---

# Setup pstack

Use Kiro's model selection instead of maintaining a pstack-specific role-to-model map. Skills and ordinary subagent calls omit model identifiers and use the selected or default Kiro model. Only a named custom agent may be pinned, through that agent's supported `model` field, when the user explicitly requests it.

## Steps

### 1. Choose the scope

Ask one concise question if the request is ambiguous:

- **Conversation model:** change the model used for subsequent chat work.
- **Default behavior:** keep pstack model-neutral and use Kiro's selected or default model.
- **Named custom agent:** pin one existing custom agent to a model.

Do not create a role registry, model aliases, or steering rules. Kiro does not expose a portable per-call model override for subagents.

### 2. Select a conversation model

In Kiro IDE, tell the user to choose a model with the chat model selector. The selection applies to subsequent messages in that conversation.

In Kiro CLI, list the models available to the user's account:

```bash
kiro-cli chat --list-models --format json
```

Present the returned choices. In an interactive CLI session, select the confirmed ID with `/model <model-id>`. If the current surface cannot change the active model directly, give the user the exact available model ID and require them to select it in Kiro rather than inventing an unsupported configuration path.

### 3. Pin a named custom agent only when requested

Require the existing custom agent's name or user-provided configuration path. If neither is available, ask for it; do not guess which agent to edit.

Before writing, confirm the requested model is available either in the Kiro IDE model selector or in `kiro-cli chat --list-models --format json`. Use the exact model ID supplied by Kiro or the user; if the IDE shows only a display label and no exact ID is available, require the user to provide the ID or use the CLI command instead of guessing. Then update only the custom agent's supported `model` field and preserve every other setting. Do not add per-role mappings to `.kiro/steering` or pass a model on individual subagent calls; unpinned calls use Kiro's selected or default model.

If the user wants model diversity across reviewers, use separately configured named custom agents. If those agents do not exist, fall back to the selected or default model and state that the portable workflow cannot guarantee model diversity.

### 4. Confirm

Report one of these outcomes:

- conversation model selected in Kiro IDE;
- available CLI model ID identified for the user to select;
- named custom agent pinned through its `model` field; or
- no configuration changed because Kiro's selected or default model already covers the request.
