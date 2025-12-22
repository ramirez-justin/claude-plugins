# View Trello Board Lists

You are helping the user view the lists on their Trello board.

## Instructions

1. To show just the lists:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/get-lists.js
   ```

2. To show lists with cards (board overview):
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/get-lists.js --with-cards
   ```

3. Present the information in a clear format.

## Example Usage

User: `/trello-lists`

Run the basic command and show the list names and IDs.

User: `/trello-lists --with-cards`

Run with the flag and show a complete board overview with cards under each list.

## Scrumban Board Structure

The user uses a Scrumban workflow with these lists:
- **Done** - Completed items
- **Blocked** - Items waiting on dependencies
- **In-Progress** - Currently being worked on
- **Next Up** - Ready to start
- **Backlog** - Future work items
