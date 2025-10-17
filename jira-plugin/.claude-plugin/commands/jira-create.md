# Create Jira Issue

You are helping the user create a new Jira issue.

## Instructions

1. Ask the user for the following information if not already provided:
   - Project key (e.g., PROJ, DEV)
   - Issue summary (title)
   - Issue description
   - Issue type (default: Task, options: Bug, Story, Epic, Task)
   - Priority (default: Medium, options: Low, Medium, High, Urgent)

2. Once you have all the information, use the Bash tool to run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/create-issue.js "<project>" "<summary>" "<description>" "<type>" "<priority>"
   ```

3. Report the created issue key and URL to the user.

## Example Usage

User: `/jira-create`

You should ask: "I'll help you create a Jira issue. Please provide:
- Project key
- Summary
- Description
- Issue type (optional, default: Task)
- Priority (optional, default: Medium)"

After getting the info, run the script and confirm the issue was created.
