# Jira Plugin for Claude Code

A lightweight, zero-dependency Jira integration plugin for Claude Code that uses direct REST API calls based on the Jira OpenAPI specification. **NO external npm packages, NO MCP overhead - just pure Node.js built-in modules!**

## Features

- **Zero Dependencies**: Uses only Node.js built-in `https` module
- **Direct API Integration**: Calls Jira REST API v3 endpoints directly based on OpenAPI spec
- **No MCP**: Simpler architecture without Model Context Protocol overhead
- Create new Jira issues
- View issue details
- Search issues using JQL (Jira Query Language)
- View your assigned issues
- Update issue fields
- Add comments to issues
- Transition issues between statuses

## Installation

### 1. Install the Plugin

Clone or copy this plugin to your local Claude Code plugins directory:

```bash
# Install from local path
/plugin install /path/to/jira-plugin

# Or add to a plugin marketplace for easier distribution
```

**No npm install needed!** The plugin has zero dependencies.

### 2. Get Your Jira API Token

1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a name (e.g., "Claude Code")
4. Copy the generated token

### 3. Configure Credentials

Add your Jira credentials to `.claude/settings.json` in your project:

```json
{
  "env": {
    "JIRA_HOST": "your-domain.atlassian.net",
    "JIRA_EMAIL": "your-email@example.com",
    "JIRA_API_TOKEN": "your-api-token-here"
  }
}
```

**Important**:
- Don't include `https://` in `JIRA_HOST`, just the domain
- Use your Atlassian account email
- Keep your API token secure

### 4. You're Done!

No dependencies to install. Just start using the commands:

```
/jira-my-issues
```

## Available Commands

### `/jira-create`
Create a new Jira issue.

**Example:**
```
/jira-create
```

Claude will ask for:
- Project key (e.g., PROJ, DEV)
- Summary (issue title)
- Description
- Issue type (Task, Bug, Story, Epic)
- Priority (Low, Medium, High, Urgent)

### `/jira-get <issue-key>`
View details of a specific issue.

**Example:**
```
/jira-get PROJ-123
```

### `/jira-search <jql-query>`
Search for issues using JQL (Jira Query Language).

**Examples:**
```
/jira-search project = PROJ AND status = Open
/jira-search assignee = currentUser() AND status != Done
/jira-search priority = High AND created >= -7d
```

### `/jira-my-issues [status]`
View your assigned issues.

**Examples:**
```
/jira-my-issues              # Shows open issues
/jira-my-issues "In Progress" # Shows in-progress issues
/jira-my-issues all          # Shows all your issues
```

### `/jira-update <issue-key> <field> <value>`
Update an issue field.

**Examples:**
```
/jira-update PROJ-123 priority High
/jira-update PROJ-123 summary "New title"
/jira-update PROJ-123 description "Updated description"
```

Supported fields: `summary`, `description`, `priority`, `assignee`

### `/jira-comment <issue-key> <comment>`
Add a comment to an issue.

**Example:**
```
/jira-comment PROJ-123 "This looks good to me"
```

### `/jira-transition <issue-key> <transition>`
Change an issue's status.

**Examples:**
```
/jira-transition PROJ-123 "In Progress"
/jira-transition PROJ-123 Done
/jira-transition PROJ-123 list  # Shows available transitions
```

## JQL Query Examples

JQL (Jira Query Language) is powerful for searching issues. Here are common patterns:

```jql
# Your open issues
assignee = currentUser() AND status != Done

# High priority bugs in a project
project = PROJ AND issuetype = Bug AND priority = High

# Recently updated issues
project = PROJ AND updated >= -7d

# Unassigned issues
project = PROJ AND assignee is EMPTY

# Issues with specific text
text ~ "authentication"

# Multiple projects
project in (PROJ, DEV) AND status = Open
```

## Architecture

This plugin uses a minimalist architecture:

- **Direct REST API calls**: Using Node.js built-in `https` module
- **OpenAPI v3 compliance**: Follows Jira REST API v3 specification
- **Zero dependencies**: No external npm packages required
- **No MCP**: Simpler than Model Context Protocol implementations

### Directory Structure

```
jira-plugin/
├── .claude-plugin/
│   └── plugin.json         # Plugin manifest
├── commands/               # Command definitions
│   ├── jira-create.md
│   ├── jira-get.md
│   ├── jira-search.md
│   ├── jira-my-issues.md
│   ├── jira-update.md
│   ├── jira-comment.md
│   └── jira-transition.md
├── scripts/                # Direct API integration scripts
│   ├── jira-client.js      # HTTP client (zero dependencies)
│   ├── create-issue.js
│   ├── get-issue.js
│   ├── search-issues.js
│   ├── my-issues.js
│   ├── update-issue.js
│   ├── add-comment.js
│   └── transition-issue.js
├── agents/                 # AI assistants
│   └── jira-assistant.md
├── skills/                 # Specialized workflows
├── hooks/                  # Event-based automation
├── package.json            # No dependencies!
├── jira-swagger-v3.v3.json # OpenAPI spec (reference only)
├── INSTALL.md
└── README.md
```

## Why This Approach is Better

### Compared to Third-Party Libraries (like jira-client)
- **No Dependencies**: Zero npm packages means no security vulnerabilities or maintenance burden
- **Direct Control**: Full control over API calls and error handling
- **Smaller**: Minimal code footprint
- **Faster**: No library overhead

### Compared to MCP
- **Simpler**: No additional protocol layer
- **Easier to Debug**: Direct HTTP requests are easy to trace
- **More Reliable**: Fewer points of failure
- **Better Performance**: No protocol translation overhead

### Based on OpenAPI Spec
- **Standards-Compliant**: Uses official Jira REST API v3 specification
- **Future-Proof**: Easy to add new endpoints from the OpenAPI spec
- **Well-Documented**: OpenAPI spec provides comprehensive documentation

## API Endpoints Used

This plugin uses the following Jira REST API v3 endpoints:

- `GET /rest/api/3/issue/{issueIdOrKey}` - Get issue details
- `POST /rest/api/3/issue` - Create issue
- `PUT /rest/api/3/issue/{issueIdOrKey}` - Update issue
- `GET /rest/api/3/search/jql` - Search issues with JQL
- `POST /rest/api/3/issue/{issueIdOrKey}/comment` - Add comment
- `GET /rest/api/3/issue/{issueIdOrKey}/transitions` - List transitions
- `POST /rest/api/3/issue/{issueIdOrKey}/transitions` - Transition issue
- `GET /rest/api/3/myself` - Get current user

Authentication uses Basic Auth with email + API token.

### Important API Notes

- **Search Endpoint**: Uses `/search/jql` (the deprecated `/search` endpoint was removed in 2025)
- **Comments**: Require Atlassian Document Format (ADF) - the plugin handles conversion automatically
- **Descriptions**: Also use ADF format for rich text support

## Troubleshooting

### "Error: Missing required environment variables"

Make sure you've added `JIRA_HOST`, `JIRA_EMAIL`, and `JIRA_API_TOKEN` to your `.claude/settings.json`.

### "HTTP 401: Unauthorized"

- Verify your API token is correct
- Make sure you're using your Atlassian account email
- Check that your Jira host is correct (without https://)

### "HTTP 404: Not Found"

- Verify the project key exists and you have access
- Check that issue keys are formatted correctly (e.g., PROJ-123)

### "Project not found" or "Invalid field"

- Verify the project key exists and you have access
- Check field names match your Jira configuration
- Some fields may be custom fields specific to your Jira instance

## Development

### Adding New Commands

1. Create a new command file in `commands/`
2. Create corresponding script in `scripts/`
3. Use the `JiraClient` class methods or add new methods as needed

### Extending the API Client

The `JiraClient` class in `scripts/jira-client.js` can be extended with new methods:

```javascript
async newMethod(param) {
  return this.request('GET', `/path/to/endpoint?param=${param}`);
}
```

All Jira API endpoints follow the pattern `/rest/api/3/{resource}`. Refer to the OpenAPI spec (`jira-swagger-v3.v3.json`) for available endpoints.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Credits

Built using:
- Node.js built-in `https` module (zero dependencies!)
- Jira REST API v3 (OpenAPI specification)
- [Claude Code](https://claude.com/claude-code) - AI-powered coding assistant

---

**Zero dependencies. Zero MCP. Zero hassle. Just direct API integration.**
