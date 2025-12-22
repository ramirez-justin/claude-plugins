# Create Trello Card

You are helping the user create a new Trello card.

## Instructions

1. First, get the available lists on the board by running:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/get-lists.js
   ```

2. Ask the user for the following information if not already provided:
   - Which list to add the card to (show them the available lists)
   - Card name/title
   - Description (optional)
   - Due date (optional, format: YYYY-MM-DD or ISO 8601)

3. Once you have all the information, use the Bash tool to run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/create-card.js "<listId>" "<name>" "<description>" "<due>"
   ```

4. Report the created card details and URL to the user.

## Scrumban Workflow Tips

For the user's Scrumban workflow (Done, Blocked, In-Progress, Next Up, Backlog):
- New work items typically go to **Backlog**
- Items ready to work on next go to **Next Up**
- When starting work, cards move to **In-Progress**

## Example Usage

User: `/trello-create`

You should first fetch the lists, then ask: "I'll help you create a Trello card. Here are your available lists:
- Backlog
- Next Up
- In-Progress
- Blocked
- Done

Which list should I add the card to? Also please provide:
- Card name
- Description (optional)
- Due date (optional)"

After getting the info, run the script and confirm the card was created with its URL.
