# Quick Installation Guide

## Step 1: Install the Plugin

From within Claude Code, run:

```bash
/plugin install /Users/sethford/Downloads/plugins/jira-plugin
```

Or if you've published it to a Git repository:

```bash
/plugin marketplace add your-github-username/jira-plugin
/plugin install jira@your-marketplace-name
```

**No npm install needed!** This plugin has ZERO dependencies - it only uses Node.js built-in modules.

## Step 2: Get Your Jira API Token

1. Visit https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Name it "Claude Code" (or whatever you prefer)
4. Copy the generated token

## Step 3: Configure Credentials

Edit your `.claude/settings.json` and add:

```json
{
  "env": {
    "JIRA_HOST": "your-domain.atlassian.net",
    "JIRA_EMAIL": "your-email@example.com",
    "JIRA_API_TOKEN": "paste-your-token-here"
  }
}
```

**Important notes:**
- Don't include `https://` in `JIRA_HOST`
- Use your full Atlassian account email
- Never commit your API token to version control

## Step 4: Test It Out

Try these commands in Claude Code:

```
/jira-my-issues
```

This should show your assigned Jira issues. If it works, you're all set!

## Troubleshooting

If you get authentication errors:
- Double-check your credentials in settings.json
- Verify your API token is still valid
- Make sure JIRA_HOST doesn't include https://

If commands aren't found:
- Restart Claude Code after installing
- Run `/plugin list` to verify the plugin is installed

## What Makes This Different?

This plugin uses:
- **Zero npm dependencies** - Only Node.js built-in `https` module
- **Direct REST API calls** - Based on Jira OpenAPI v3 specification
- **No MCP overhead** - Simpler and faster than MCP-based integrations

## Available Commands

- `/jira-create` - Create new issue
- `/jira-get <key>` - View issue details
- `/jira-search <jql>` - Search with JQL
- `/jira-my-issues [status]` - Your issues
- `/jira-update <key> <field> <value>` - Update issue
- `/jira-comment <key> <comment>` - Add comment
- `/jira-transition <key> <status>` - Change status

Enjoy! 🚀

---

**Zero dependencies. Zero MCP. Zero hassle.**
