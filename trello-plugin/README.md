# Trello Plugin for Claude Code

A lightweight, zero-dependency Trello integration plugin for Claude Code that uses direct REST API calls. **NO external npm packages, NO MCP overhead - just pure Node.js built-in modules!**

## Features

- **Zero Dependencies**: Uses only Node.js built-in `https` module
- **Direct API Integration**: Calls Trello REST API endpoints directly
- **Scrumban Workflow Support**: Optimized for Scrumban methodology
- **Full Card Management**: Create, update, move, archive cards
- **List Operations**: View, create, and archive lists
- **Checklists**: Create and manage checklists with items
- **Comments**: Add and view comments on cards
- **Search**: Find cards across your boards
- **Activity Tracking**: View recent board activity
- **AI Assistant**: Proactive Trello suggestions during development

## Installation

### 1. Install the Plugin

Clone or copy this plugin to your Claude Code plugins directory:

```bash
# Install from local path
/plugin install /path/to/trello-plugin
```

**No npm install needed!** The plugin has zero dependencies.

### 2. Get Your Trello API Credentials

1. Go to https://trello.com/app-key
2. Copy your API Key
3. Click "Token" link on that page to generate a token
4. Authorize the application
5. Copy the generated token

### 3. Get Your Board ID

Your board ID is in the Trello board URL:
```
https://trello.com/b/ABC123XY/my-board-name
                    ^^^^^^^^
                    This is your board ID
```

### 4. Configure Credentials

Add your Trello credentials to `.claude/settings.json` in your project:

```json
{
  "env": {
    "TRELLO_API_KEY": "your-api-key",
    "TRELLO_TOKEN": "your-token",
    "TRELLO_BOARD_ID": "your-board-id"
  }
}
```

### 5. You're Done!

Start using the commands:

```
/trello-my-cards
```

## Available Commands

### Card Management

#### `/trello-create`
Create a new Trello card.

```
/trello-create
```

Claude will ask for list, name, description, and due date.

#### `/trello-get <cardId>`
View details of a specific card.

```
/trello-get abc123
```

#### `/trello-update <cardId> <field> <value>`
Update a card field.

```
/trello-update abc123 name "Updated title"
/trello-update abc123 desc "New description"
/trello-update abc123 due "2024-12-31"
```

#### `/trello-move <cardId> <listName>`
Move a card to a different list.

```
/trello-move abc123 "In-Progress"
/trello-move abc123 Done
```

#### `/trello-archive <cardId>`
Archive a card.

```
/trello-archive abc123
```

### List Management

#### `/trello-lists`
View all lists on the board.

```
/trello-lists              # Just list names
/trello-lists --with-cards # Full board overview
```

#### `/trello-add-list <name>`
Add a new list to the board.

```
/trello-add-list "Sprint 5"
/trello-add-list "Urgent" top
```

### Comments

#### `/trello-comment <cardId> <text>`
Add a comment to a card.

```
/trello-comment abc123 "Fixed the issue, ready for review"
```

### Checklists

#### `/trello-checklist <cardId> <action>`
Manage checklists on cards.

```
/trello-checklist abc123 list                    # View checklists
/trello-checklist abc123 create "Acceptance Criteria"
/trello-checklist abc123 add xyz789 "Unit tests pass"
/trello-checklist abc123 check item123           # Mark complete
/trello-checklist abc123 uncheck item123         # Mark incomplete
```

### Search & Discovery

#### `/trello-search <query>`
Search for cards.

```
/trello-search "login bug"
/trello-search authentication --all-boards
```

#### `/trello-my-cards`
View cards assigned to you.

```
/trello-my-cards                   # All your cards
/trello-my-cards --board           # Only current board
/trello-my-cards "In-Progress"     # Filter by list
```

### Activity

#### `/trello-activity [limit]`
View recent board activity.

```
/trello-activity      # Last 20 activities
/trello-activity 50   # Last 50 activities
```

## Scrumban Workflow

This plugin is optimized for Scrumban methodology with these lists:

| List | Purpose |
|------|---------|
| **Done** | Completed items |
| **Blocked** | Items waiting on dependencies |
| **In-Progress** | Currently being worked on |
| **Next Up** | Prioritized, ready to start |
| **Backlog** | Future work items |

### Typical Workflow

```
Backlog → Next Up → In-Progress → Done
                         ↓
                     Blocked (if stuck)
                         ↓
                   In-Progress (when unblocked)
```

## Skills

The plugin includes specialized skills for advanced workflows:

### Card Creation Skill
Create well-structured cards from code context with:
- Proper titles and descriptions
- Appropriate list placement
- Checklists for acceptance criteria
- Bug/feature/task templates

### Board Planning Skill
Scrumban board management including:
- WIP limit recommendations
- Prioritization frameworks
- Backlog grooming guidance
- Workflow optimization

### Code-to-Card Linking Skill
Maintain traceability with:
- Commit-to-card linking
- Branch name patterns
- PR integration
- Deployment tracking

## Agent

The Trello Assistant agent proactively helps by:
- Suggesting card creation after code changes
- Recommending card moves based on work progress
- Offering to add comments for documentation
- Managing checklists during development
- Tracking blocked items

## Architecture

```
trello-plugin/
├── .claude-plugin/
│   ├── plugin.json         # Plugin manifest
│   └── marketplace.json    # Marketplace metadata
├── commands/               # Command definitions
│   ├── trello-create.md
│   ├── trello-get.md
│   ├── trello-update.md
│   ├── trello-move.md
│   ├── trello-archive.md
│   ├── trello-comment.md
│   ├── trello-lists.md
│   ├── trello-search.md
│   ├── trello-my-cards.md
│   ├── trello-checklist.md
│   ├── trello-activity.md
│   └── trello-add-list.md
├── scripts/                # Direct API scripts
│   ├── trello-client.js
│   ├── create-card.js
│   ├── get-card.js
│   ├── update-card.js
│   ├── archive-card.js
│   ├── move-card.js
│   ├── get-lists.js
│   ├── add-list.js
│   ├── archive-list.js
│   ├── add-comment.js
│   ├── get-comments.js
│   ├── manage-checklist.js
│   ├── search-cards.js
│   ├── my-cards.js
│   └── get-activity.js
├── agents/
│   └── trello-assistant.md
├── skills/
│   ├── card-creation/
│   ├── board-planning/
│   └── code-to-card-linking/
├── hooks/
│   └── hooks.json          # Event hooks
├── package.json
├── README.md
└── INSTALL.md
```

## API Endpoints Used

This plugin uses the following Trello REST API endpoints:

### Boards
- `GET /1/boards/{id}` - Get board
- `GET /1/boards/{id}/lists` - Get lists
- `GET /1/boards/{id}/cards` - Get cards
- `GET /1/boards/{id}/actions` - Get activity
- `GET /1/boards/{id}/members` - Get members
- `GET /1/boards/{id}/labels` - Get labels

### Lists
- `POST /1/lists` - Create list
- `PUT /1/lists/{id}` - Update list
- `PUT /1/lists/{id}/closed` - Archive list
- `GET /1/lists/{id}/cards` - Get cards in list

### Cards
- `GET /1/cards/{id}` - Get card
- `POST /1/cards` - Create card
- `PUT /1/cards/{id}` - Update card
- `DELETE /1/cards/{id}` - Delete card

### Comments
- `POST /1/cards/{id}/actions/comments` - Add comment
- `GET /1/cards/{id}/actions` - Get comments
- `PUT /1/actions/{id}` - Update comment
- `DELETE /1/actions/{id}` - Delete comment

### Checklists
- `GET /1/cards/{id}/checklists` - Get checklists
- `POST /1/checklists` - Create checklist
- `POST /1/checklists/{id}/checkItems` - Add item
- `PUT /1/cards/{id}/checkItem/{itemId}` - Update item
- `DELETE /1/checklists/{id}` - Delete checklist

### Search
- `GET /1/search` - Search cards

### Members
- `GET /1/members/me` - Current user
- `GET /1/members/me/cards` - User's cards

## Troubleshooting

### "Error: Missing required environment variables"

Make sure you've added all three variables to `.claude/settings.json`:
- `TRELLO_API_KEY`
- `TRELLO_TOKEN`
- `TRELLO_BOARD_ID`

### "HTTP 401: unauthorized permission requested"

- Verify your API token is correct
- Make sure the token has access to the board
- Try generating a new token

### "HTTP 404: model not found"

- Check that the board ID is correct
- Verify the card/list ID exists
- Ensure you have access to the board

### "List not found"

- Use `/trello-lists` to see available lists
- Check for exact spelling (case-insensitive matching is used)
- The list may have been archived

## License

MIT

## Credits

Built using:
- Node.js built-in `https` module (zero dependencies!)
- Trello REST API
- [Claude Code](https://claude.com/claude-code)

---

**Zero dependencies. Zero MCP. Just direct API integration for your Scrumban workflow.**
