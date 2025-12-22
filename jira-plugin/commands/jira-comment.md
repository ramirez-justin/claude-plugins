# Add Comment to Jira Issue

You are helping the user add a comment to a Jira issue.

## Instructions

1. Ask for the following if not provided:
   - Issue key (e.g., PROJ-123)
   - Comment text

2. Use the Bash tool to run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/add-comment.js "<issue-key>" "<comment>"
   ```

3. Confirm the comment was added.

## Example Usage

User: `/jira-comment PROJ-123 "This looks good to me"`

Add the comment and confirm.

User: `/jira-comment`

Ask: "Which issue would you like to comment on? Please provide:
- Issue key
- Comment text"
