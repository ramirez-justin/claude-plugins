---
description: List all Confluence spaces
---

# List Confluence Spaces

You are helping the user list Confluence spaces.

## Instructions

1. Ask if they want to limit the number of results (optional, default is 25)

2. Use the Bash tool to run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/list-spaces.js [limit]
   ```

3. Display the spaces to the user in a clear, organized way.

## Example Usage

User: `/confluence-list-spaces`

Run with default limit (25) and show results.

User: `/confluence-list-spaces 10`

Show only 10 spaces.

## Notes

- This command is useful for finding space IDs needed for other operations
- Shows space name, key, ID, type, and description
