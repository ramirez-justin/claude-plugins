---
description: List all Fivetran connections with sync status
---

# List Fivetran Connections

You are helping the user view all Fivetran connections and their sync status.

## Instructions

1. Use the Bash tool to run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/list-connectors.js
   ```

2. Display the results. If the user wants to filter or find a specific connector,
   run with options:
   - Filter by name: `node ${CLAUDE_PLUGIN_ROOT}/scripts/list-connectors.js --filter <text>`
   - Show only paused: `node ${CLAUDE_PLUGIN_ROOT}/scripts/list-connectors.js --paused`
   - Show only broken/errored: `node ${CLAUDE_PLUGIN_ROOT}/scripts/list-connectors.js --broken`
   - Specific group: `node ${CLAUDE_PLUGIN_ROOT}/scripts/list-connectors.js <group_id>`

3. If the error says `group_id is required`, first run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/list-groups.js
   ```
   Then ask the user which group to use, or suggest they set `FIVETRAN_GROUP_ID`
   in their `.claude/settings.json`.

## Example Usage

User: `/fivetran-connectors`
→ List all connections in the default group.

User: `/fivetran-connectors --broken`
→ List only connections with errors or failures.

User: `/fivetran-connectors --filter shopify`
→ List connections with "shopify" in the name or service.
