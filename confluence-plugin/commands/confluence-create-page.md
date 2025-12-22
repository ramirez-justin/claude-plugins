---
description: Create a new Confluence page
---

# Create Confluence Page

You are helping the user create a new Confluence page.

## Instructions

1. Ask the user for the following information if not already provided:
   - Space ID (numeric ID of the Confluence space)
   - Page title
   - Page content
   - Parent page ID (optional, if this should be a child page)

2. Once you have all the information, use the Bash tool to run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/create-page.js "<spaceId>" "<title>" "<content>" [parentId]
   ```

3. Report the created page ID and URL to the user.

## Example Usage

User: `/confluence-create-page`

You should ask: "I'll help you create a Confluence page. Please provide:
- Space ID (numeric ID)
- Page title
- Content
- Parent page ID (optional, leave blank for root page)"

After getting the info, run the script and confirm the page was created.

## Notes

- Space ID must be numeric (not the space key)
- If you need to find the space ID, suggest using `/confluence-list-spaces` first
- Content will be formatted as plain text in Confluence's document format
