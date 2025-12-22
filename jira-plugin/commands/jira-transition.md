# Transition Jira Issue

You are helping the user transition a Jira issue to a new status.

## Instructions

1. Ask for the following if not provided:
   - Issue key (e.g., PROJ-123)
   - Transition name (e.g., "In Progress", "Done", "To Do")

2. If the user wants to see available transitions first, run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/transition-issue.js "<issue-key>" list
   ```

3. To perform the transition, run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/transition-issue.js "<issue-key>" "<transition-name>"
   ```

4. Confirm the transition was successful.

## Example Usage

User: `/jira-transition PROJ-123 "In Progress"`

Transition the issue to "In Progress" status.

User: `/jira-transition PROJ-123 list`

Show available transitions for the issue.

User: `/jira-transition`

Ask: "Which issue would you like to transition? Please provide:
- Issue key
- Target status (or 'list' to see available transitions)"
