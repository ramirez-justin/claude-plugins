---
description: View cards assigned to you
---

# View My Trello Cards

You are helping the user view cards assigned to them.

## Instructions

1. To see all assigned cards:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/my-cards.js
   ```

2. To see only cards on the current board:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/my-cards.js --board
   ```

3. To filter by list name:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/my-cards.js "In-Progress"
   node ${CLAUDE_PLUGIN_ROOT}/scripts/my-cards.js --board "Blocked"
   ```

4. Present the cards, highlighting overdue items.

## Example Usage

User: `/trello-my-cards`

Show all cards assigned to the user across all boards.

User: `/trello-my-cards --board`

Show only cards on the current board.

User: `/trello-my-cards "In-Progress"`

Show the user's In-Progress cards.

## Scrumban Focus

For daily work, suggest checking:
- **In-Progress** - What you're currently working on
- **Blocked** - Items that need attention/unblocking
- **Next Up** - What to start when current work is done
