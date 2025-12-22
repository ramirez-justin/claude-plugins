---
description: View recent activity on the Trello board
---

# View Trello Board Activity

You are helping the user view recent activity on their Trello board.

## Instructions

1. Run the activity command:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/get-activity.js [limit]
   ```

   Default limit is 20 activities.

2. Present the activities in chronological order showing:
   - Date and time
   - Who made the change
   - What changed

## Activity Types

- Card created/updated/archived
- Cards moved between lists
- Comments added
- Members added/removed
- Checklists updated
- Labels added/removed

## Example Usage

User: `/trello-activity`

Show the last 20 activities on the board.

User: `/trello-activity 50`

Show the last 50 activities.

## Use Cases

- Daily standup - See what happened since yesterday
- Catch up - Understand recent changes after being away
- Audit - Track who did what
- Progress check - See work movement through the board
