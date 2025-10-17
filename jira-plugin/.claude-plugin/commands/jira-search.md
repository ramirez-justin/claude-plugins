# Search Jira Issues

You are helping the user search for Jira issues using JQL (Jira Query Language).

## Instructions

1. Ask the user what they want to search for if not already provided.

2. Help construct a JQL query. Common examples:
   - `project = PROJ AND status = Open`
   - `assignee = currentUser() AND status != Done`
   - `project = PROJ AND priority = High`
   - `text ~ "keyword"`
   - `created >= -7d` (issues created in last 7 days)

3. Use the Bash tool to run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/search-issues.js "<jql-query>" [maxResults]
   ```

4. Display the search results to the user.

## Example Usage

User: `/jira-search project = DEV AND status = Open`

Run the search and display results.

User: `/jira-search`

Ask: "What would you like to search for? I can help you build a JQL query. For example:
- All open issues in a project
- Your assigned issues
- High priority bugs
- Recently created issues"
