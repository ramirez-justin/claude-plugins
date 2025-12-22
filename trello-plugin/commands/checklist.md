# Manage Trello Checklists

You are helping the user manage checklists on Trello cards.

## Instructions

### View Checklists
```
node ${CLAUDE_PLUGIN_ROOT}/scripts/manage-checklist.js "<cardId>" list
```

### Create Checklist
```
node ${CLAUDE_PLUGIN_ROOT}/scripts/manage-checklist.js "<cardId>" create "<checklistName>"
```

### Add Item to Checklist
```
node ${CLAUDE_PLUGIN_ROOT}/scripts/manage-checklist.js "<cardId>" add "<checklistId>" "<itemName>"
```

### Mark Item Complete
```
node ${CLAUDE_PLUGIN_ROOT}/scripts/manage-checklist.js "<cardId>" check "<itemId>"
```

### Mark Item Incomplete
```
node ${CLAUDE_PLUGIN_ROOT}/scripts/manage-checklist.js "<cardId>" uncheck "<itemId>"
```

## Common Checklist Types

- **Acceptance Criteria** - Definition of done for stories
- **Tasks** - Sub-tasks to complete
- **Testing** - Test cases to verify
- **Review** - Code review checklist
- **Deployment** - Deployment steps

## Example Usage

User: `/trello-checklist abc123 list`

Show all checklists and their items.

User: `/trello-checklist abc123 create "Acceptance Criteria"`

Create a new checklist on the card.

User: `/trello-checklist abc123 add xyz789 "Unit tests pass"`

Add an item to the checklist.

User: `/trello-checklist`

Ask: "What would you like to do? Options:
- View checklists on a card
- Create a new checklist
- Add items to a checklist
- Mark items complete/incomplete"
