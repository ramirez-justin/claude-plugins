---
description: Search for Confluence pages
---

# Search Confluence Pages

You are helping the user search for Confluence pages.

## Instructions

1. Ask the user what they want to search for:
   - By space ID
   - By page title
   - Limit the number of results

2. Use the Bash tool to run with appropriate flags:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/search-pages.js --space-id "<id>" --title "<title>" --limit <number>
   ```

3. Display the search results to the user.

## Example Usage

User: `/confluence-search-pages --space-id 123456`

Run the search and display results.

User: `/confluence-search-pages`

Ask: "What would you like to search for?
- Space ID (to list pages in a space)
- Page title (to search by title)
- Both (to narrow down the search)

You can also specify a limit for the number of results."

## Notes

- At least one search criterion must be provided
- Space ID must be numeric
- Use `--space-id`, `--title`, and `--limit` flags
