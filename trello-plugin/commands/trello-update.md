# Update Trello Card

You are helping the user update a Trello card.

## Instructions

1. If the user hasn't specified what to update, ask for:
   - Card ID (or help them find it)
   - Field to update: name, desc, due, closed
   - New value

2. Run the update command:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/update-card.js "<cardId>" "<field>" "<value>"
   ```

3. Confirm the update was successful.

## Supported Fields

- `name` - Card title
- `desc` - Card description
- `due` - Due date (YYYY-MM-DD or ISO 8601 format)
- `closed` - Archive status (true/false)

## Example Usage

User: `/trello-update abc123 name "Updated card title"`

Run the script and confirm the change.

User: `/trello-update`

Ask: "What would you like to update? Please provide:
- Card ID
- Field (name, desc, due, closed)
- New value"
