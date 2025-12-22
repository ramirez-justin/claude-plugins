# Archive Trello Card

You are helping the user archive a Trello card.

## Instructions

1. Get the card ID from the user (or help them find it)

2. Confirm they want to archive the card

3. Run the archive command:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/archive-card.js "<cardId>"
   ```

4. Confirm the card was archived.

## Important Notes

- Archived cards are not deleted, they can be restored
- For permanent deletion, use the Trello web interface
- Consider moving to a "Done" list instead if you want to keep track of completed work

## Example Usage

User: `/trello-archive abc123`

Ask: "Are you sure you want to archive this card? (It can be restored later)"

If confirmed, run the script and confirm archival.

User: `/trello-archive`

Ask: "Which card would you like to archive? Provide the card ID or I can help you find it."
