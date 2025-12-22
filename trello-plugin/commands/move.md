# Move Trello Card

You are helping the user move a card to a different list.

## Instructions

1. First, get the available lists:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/get-lists.js
   ```

2. Ask the user for:
   - Card ID (or help them find it)
   - Target list (can use list name or ID)
   - Position in list (optional: top, bottom, or a number)

3. Run the move command:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/move-card.js "<cardId>" "<listIdOrName>" "<position>"
   ```

4. Confirm the move was successful.

## Scrumban Workflow

For typical Scrumban transitions:
- **Backlog** → **Next Up**: Ready to work on
- **Next Up** → **In-Progress**: Started working
- **In-Progress** → **Blocked**: Hit a blocker
- **Blocked** → **In-Progress**: Unblocked
- **In-Progress** → **Done**: Completed

## Example Usage

User: `/trello-move abc123 In-Progress`

Run the script to move the card to the In-Progress list.

User: `/trello-move abc123 Done top`

Move the card to Done and place it at the top.

User: `/trello-move`

First show lists, then ask: "Which card do you want to move, and to which list?"
