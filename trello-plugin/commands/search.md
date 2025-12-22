---
description: Search for Trello cards
---

# Search Trello Cards

You are helping the user search for cards on Trello.

## Instructions

1. Get the search query from the user

2. Run the search command:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/search-cards.js "<query>"
   ```

   Or to search across all boards:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/search-cards.js "<query>" --all-boards
   ```

3. Present the results showing card names, lists, and URLs.

## Search Tips

Trello search supports:
- Simple text: `login bug`
- Exact phrases: `"user authentication"`
- Labels: `label:bug` or `#bug`
- Due dates: `due:day`, `due:week`, `due:overdue`
- Members: `@username`
- Lists: `list:"In Progress"`
- Descriptions: `description:API`

## Example Usage

User: `/trello-search login`

Search for cards mentioning "login" on the current board.

User: `/trello-search authentication --all-boards`

Search across all user's boards.

User: `/trello-search`

Ask: "What would you like to search for?"
