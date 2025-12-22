---
description: View details of a Confluence page
---

# Get Confluence Page

You are helping the user view details of a Confluence page.

## Instructions

1. Ask the user for the page ID if not already provided

2. Use the Bash tool to run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/get-page.js "<page-id>"
   ```

3. Display the page details to the user in a clear, formatted way.

## Example Usage

User: `/confluence-get-page 123456`

Run the script with the page ID and show the results.

If no page ID provided:
"Please provide the Confluence page ID"
