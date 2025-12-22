# Installation Guide

## Quick Start

1. Get API credentials from https://trello.com/app-key
2. Add to `.claude/settings.json`:
   ```json
   {
     "env": {
       "TRELLO_API_KEY": "your-key",
       "TRELLO_TOKEN": "your-token",
       "TRELLO_BOARD_ID": "your-board-id"
     }
   }
   ```
3. Restart Claude Code
4. Try `/trello-lists`

## Detailed Setup

### Step 1: Get Your API Key

1. Go to https://trello.com/app-key
2. You'll see your API Key at the top of the page
3. Copy this key

### Step 2: Generate a Token

1. On the same page, click the "Token" link
2. You'll be asked to authorize the application
3. Click "Allow"
4. Copy the token that's displayed

### Step 3: Find Your Board ID

Your board ID is in the URL when viewing your Trello board:

```
https://trello.com/b/ABC123XY/my-board-name
                    ^^^^^^^^
                    This is your board ID
```

### Step 4: Configure Claude Code

Create or edit `.claude/settings.json` in your project:

```json
{
  "env": {
    "TRELLO_API_KEY": "your-api-key-here",
    "TRELLO_TOKEN": "your-token-here",
    "TRELLO_BOARD_ID": "your-board-id-here"
  }
}
```

### Step 5: Restart Claude Code

Close and reopen Claude Code for the environment variables to take effect.

### Step 6: Verify Installation

Run this command to verify:

```
/trello-lists
```

You should see your board's lists.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TRELLO_API_KEY` | Your Trello API key | Yes |
| `TRELLO_TOKEN` | Your Trello access token | Yes |
| `TRELLO_BOARD_ID` | Default board ID | Yes |

## Recommended Board Structure

For best results with this plugin, set up your board with these lists:

1. **Done** - Completed items
2. **Blocked** - Items waiting on dependencies
3. **In-Progress** - Currently being worked on
4. **Next Up** - Ready to start
5. **Backlog** - Future work

## Troubleshooting

### "Missing required environment variables"

Double-check that all three variables are set in `.claude/settings.json` and restart Claude Code.

### "unauthorized permission requested"

1. Go to https://trello.com/app-key
2. Click "Token" to generate a new token
3. Make sure to click "Allow" when prompted
4. Update your settings with the new token

### "model not found"

The board ID is incorrect. Check your board URL and copy the ID after `/b/`.

## Uninstalling

To remove the plugin:

```bash
/plugin uninstall trello-plugin
```

To remove credentials, delete the Trello entries from `.claude/settings.json`.
