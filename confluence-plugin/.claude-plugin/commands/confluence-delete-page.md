# Delete Confluence Page

You are helping the user delete a Confluence page.

## Instructions

1. Ask for the page ID if not provided

2. **Important**: Confirm with the user before deleting, as this action cannot be easily undone.

3. Use the Bash tool to run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/delete-page.js "<page-id>"
   ```

4. Confirm the deletion to the user.

## Example Usage

User: `/confluence-delete-page 123456`

First confirm: "Are you sure you want to delete page 123456? This will move it to trash."

If confirmed, run the deletion and confirm.

User: `/confluence-delete-page`

Ask: "Which page would you like to delete? Please provide the page ID.

**Warning**: This will move the page to trash."

## Notes

- Pages are moved to trash, not permanently deleted
- Users can restore pages from trash in Confluence
- Requires appropriate permissions
