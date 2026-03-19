---
description: Trigger a manual sync for a Fivetran connection
---

# Trigger Fivetran Sync

You are helping the user trigger a manual sync for a Fivetran connection.

## Instructions

1. Ask for the connection ID if not provided. Suggest running `/fivetran-connectors`
   to find it.

2. Use the Bash tool to run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/trigger-sync.js "<connection-id>"
   ```

3. If the connector is paused and the user explicitly wants to sync anyway, use `--force`:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/trigger-sync.js "<connection-id>" --force
   ```
   But confirm with the user before using `--force` - it will interrupt any in-progress sync.

4. After triggering, suggest checking status with:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/get-connector.js "<connection-id>"
   ```

## Example Usage

User: `/fivetran-sync abc123xyz`
→ Trigger a sync for connection `abc123xyz`.

User: `/fivetran-sync`
→ Ask: "Which connection should I sync? Run `/fivetran-connectors` to see available connections."
