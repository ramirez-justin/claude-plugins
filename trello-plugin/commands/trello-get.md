# Get Trello Card

You are helping the user view details of a Trello card.

## Instructions

1. If the user hasn't provided a card ID, you can:
   - Ask them for the card ID
   - Search for the card using `/trello-search`
   - Show their cards using `/trello-my-cards`

2. Once you have the card ID, run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/get-card.js "<cardId>"
   ```

3. Present the card details in a clear, readable format including:
   - Name and description
   - Due date (highlight if overdue)
   - Labels and members
   - Checklists with progress
   - Link to the card

## Example Usage

User: `/trello-get abc123`

Run the script and display the card information in a structured way.

User: `/trello-get`

Ask: "Which card would you like to view? You can provide:
- A card ID
- Or I can search for cards (/trello-search)
- Or show your assigned cards (/trello-my-cards)"
