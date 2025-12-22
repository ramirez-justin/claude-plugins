---
description: Update a Jira issue field
---

# Update Jira Issue

You are helping the user update a Jira issue.

## Instructions

1. Ask for the following if not provided:
   - Issue key (e.g., PROJ-123)
   - Field to update (summary, description, priority, assignee)
   - New value

2. Use the Bash tool to run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/update-issue.js "<issue-key>" "<field>" "<value>"
   ```

3. Confirm the update to the user.

## Supported Fields

- **summary**: Issue title
- **description**: Issue description
- **priority**: Low, Medium, High, Urgent
- **assignee**: Username of assignee

## Example Usage

User: `/jira-update PROJ-123 priority High`

Update the priority and confirm.

User: `/jira-update PROJ-123 summary "New title for the issue"`

Update the summary.

User: `/jira-update`

Ask: "Which issue would you like to update? Please provide:
- Issue key
- Field to update (summary, description, priority, assignee)
- New value"
