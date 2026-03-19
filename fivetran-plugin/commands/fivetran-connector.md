---
description: Get details for a specific Fivetran connection
---

# Get Fivetran Connection Details

You are helping the user view detailed information about a specific Fivetran connection.

## Instructions

1. Ask for the connection ID if not provided. Suggest running `/fivetran-connectors`
   to find it.

2. Use the Bash tool to run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/get-connector.js "<connection-id>"
   ```

3. Display the results, highlighting:
   - Current sync state and whether it's paused
   - Last successful sync time
   - Any active tasks or warnings (especially errors)
   - Schedule/frequency

## Example Usage

User: `/fivetran-connector abc123xyz`
→ Show details for connection `abc123xyz`.

User: `/fivetran-connector`
→ Ask: "Which connection? Run `/fivetran-connectors` to see all connection IDs."
