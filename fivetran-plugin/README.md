# Fivetran Plugin for Claude Code

Zero-dependency Fivetran integration for Claude Code. List connections, check
sync status, and trigger manual syncs — all from your terminal.

## Setup

### 1. Get your API credentials

In the Fivetran dashboard, go to **Account Settings → API Config** and generate
an API key. You'll get a key and a secret.

### 2. Store credentials in 1Password

Create a 1Password item (e.g., "Fivetran API Key") with:
- **username**: your API key
- **password**: your API secret

### 3. Add to `.claude/settings.json`

In your settings file under `env`:

```json
{
  "env": {
    "FIVETRAN_API_KEY": "",
    "FIVETRAN_API_SECRET": "",
    "FIVETRAN_GROUP_ID": ""
  }
}
```

If using the dotfiles `inject-secrets` task, add to `mise.toml`:

```toml
[tasks.inject-secrets]
run = """
  # ... existing secrets ...
  FIVETRAN_KEY=$(op read "op://Employee/Fivetran API Key/username")
  FIVETRAN_SECRET=$(op read "op://Employee/Fivetran API Key/password")
  jq --arg key "$FIVETRAN_KEY" --arg secret "$FIVETRAN_SECRET" \
    '.env.FIVETRAN_API_KEY = $key | .env.FIVETRAN_API_SECRET = $secret' \
    "{{config_root}}/claude/.claude/settings.json" > ~/.claude/settings.json
"""
```

### 4. Find your group ID

```sh
node ~/.claude/plugins/fivetran@productivity-plugins/scripts/list-groups.js
```

Set the group ID in your settings as `FIVETRAN_GROUP_ID`.

### 5. Enable the plugin

Add to `enabledPlugins` in your `settings.json`:

```json
"fivetran@productivity-plugins": true
```

## Commands

| Command | Description |
|---------|-------------|
| `/fivetran-connectors` | List all connections with sync status |
| `/fivetran-connectors --broken` | Show only connections with errors |
| `/fivetran-connectors --paused` | Show only paused connections |
| `/fivetran-connectors --filter <text>` | Filter by name or service |
| `/fivetran-connector <id>` | Get details for a specific connection |
| `/fivetran-sync <id>` | Trigger a manual sync |
| `/fivetran-sync <id> --force` | Force sync (stops any in-progress sync) |
| `/fivetran-status <id>` | Check sync status and last outcomes |

## Notes

- The Fivetran REST API does not expose detailed sync history logs. Only the
  current state and last success/failure timestamps are available. For full
  logs, use the Fivetran dashboard or configure a log service.
- API docs: https://fivetran.com/docs/rest-api
