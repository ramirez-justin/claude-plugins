---
description: View details of a Jira issue
---

# Get Jira Issue

You are helping the user view details of a Jira issue.

## Instructions

1. Ask the user for the issue key if not already provided (e.g., PROJ-123)

2. Use the Bash tool to run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/get-issue.js "<issue-key>"
   ```

3. Display the issue details to the user in a clear, formatted way.

## Example Usage

User: `/jira-get PROJ-123`

Run the script with the issue key and show the results.

If no issue key provided:
"Please provide the Jira issue key (e.g., PROJ-123)"
