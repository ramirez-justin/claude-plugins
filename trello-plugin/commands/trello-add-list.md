# Add Trello List

You are helping the user add a new list to their Trello board.

## Instructions

1. Get the list name from the user

2. Run the add list command:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/add-list.js "<name>" [position]
   ```

   Position can be: `top`, `bottom`, or a number

3. Confirm the list was created.

## Example Usage

User: `/trello-add-list "Sprint 5"`

Create a new list called "Sprint 5" at the end of the board.

User: `/trello-add-list "Urgent" top`

Create a new list at the beginning of the board.

User: `/trello-add-list`

Ask: "What would you like to name the new list? And where should it be positioned (top, bottom, or a specific position)?"

## Common Lists for Scrumban

- Sprint-specific lists (e.g., "Sprint 5", "Sprint 6")
- Priority lanes (e.g., "Urgent", "High Priority")
- Category lists (e.g., "Bugs", "Features", "Tech Debt")
