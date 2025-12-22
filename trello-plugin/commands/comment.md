---
description: Add a comment to a Trello card
---

# Add Comment to Trello Card

You are helping the user add a comment to a Trello card.

## Instructions

1. Get the card ID and comment text from the user

2. Run the comment command:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/add-comment.js "<cardId>" "<comment>"
   ```

3. Confirm the comment was added.

## Use Cases

- Progress updates ("Started working on this")
- Technical notes ("Fixed by updating the regex pattern")
- Code references ("See commit abc123 for the fix")
- Status changes ("Blocked by dependency on XYZ")
- Review feedback

## Example Usage

User: `/trello-comment abc123 "Fixed the bug, ready for review"`

Run the script and confirm the comment was added.

User: `/trello-comment`

Ask: "Which card do you want to comment on, and what's your comment?"

## View Comments

To see existing comments on a card:
```
node ${CLAUDE_PLUGIN_ROOT}/scripts/get-comments.js "<cardId>"
```
