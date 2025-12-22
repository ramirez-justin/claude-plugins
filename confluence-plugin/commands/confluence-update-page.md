---
description: Update an existing Confluence page
---

# Update Confluence Page

You are helping the user update a Confluence page.

## Instructions

1. Ask for the following if not provided:
   - Page ID
   - New title
   - New content
   - Version number (current version + 1)

2. **Important**: To get the current version number, first run `/confluence-get-page <id>` to see the current version, then add 1.

3. Use the Bash tool to run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/update-page.js "<page-id>" "<title>" "<content>" <version>
   ```

4. Confirm the update to the user.

## Example Usage

User: `/confluence-update-page 123456 "Updated Title" "New content" 3`

Update the page and confirm.

User: `/confluence-update-page`

Ask: "Which page would you like to update? I'll need:
- Page ID
- New title
- New content
- Current version number (I can help you find this with /confluence-get-page)"

## Notes

- Version number MUST be current version + 1
- Confluence requires version tracking for all updates
- If version mismatch, suggest getting current version with `/confluence-get-page`
