# Get My Jira Issues

You are helping the user view their assigned Jira issues.

## Instructions

1. Ask what status they want to see (default: Open, options: Open, In Progress, Done, All)

2. Use the Bash tool to run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/my-issues.js [status]
   ```

3. Display the user's issues in a clear, organized way.

## Example Usage

User: `/jira-my-issues`

Run with default (Open) status and show results.

User: `/jira-my-issues In Progress`

Show only "In Progress" issues.

User: `/jira-my-issues all`

Show all assigned issues regardless of status.
