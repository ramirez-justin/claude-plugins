---
description: Check sync status and last outcomes for a Fivetran connection
---

# Check Fivetran Sync Status

You are helping the user check the sync status and last known outcomes for a
Fivetran connection.

## Instructions

1. Ask for the connection ID if not provided. Suggest running `/fivetran-connectors`
   to find it.

2. Use the Bash tool to run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/sync-history.js "<connection-id>"
   ```

3. Display the results. Note that the Fivetran REST API does not expose a full
   sync history log - only the current state and last success/failure timestamps
   are available via API. For detailed logs, direct the user to the Fivetran
   dashboard or suggest they configure a log service integration.

## Example Usage

User: `/fivetran-status abc123xyz`
→ Show current sync state, last success, last failure, and any warnings.

User: `/fivetran-status`
→ Ask: "Which connection? Run `/fivetran-connectors` to see all connections."
