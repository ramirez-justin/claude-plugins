# Claude Code Plugins

A collection of zero-dependency plugins for [Claude Code](https://claude.com/claude-code) that provide direct integrations with popular project management tools using REST APIs.

## Why These Plugins?

- **Zero Dependencies**: Only Node.js built-in modules (no npm packages!)
- **No MCP Overhead**: Direct REST API calls without Model Context Protocol
- **OpenAPI Based**: Standards-compliant implementations following official specs
- **Production Ready**: Comprehensive error handling and documentation
- **Easy to Use**: Simple slash commands in Claude Code
- **Easy to Extend**: Clean architecture makes adding features straightforward
- **Seamless Workflow**: Agents and hooks integrate into your development process

## Workflow Integration

These plugins work in **three modes** to fit your workflow:

1. **Manual Commands** - Use slash commands when you need them (works immediately, no setup)
2. **Agent-Assisted** - AI proactively suggests Jira/Confluence actions based on context (recommended)
3. **Automated Hooks** - Triggers remind you to update Jira/Confluence based on your actions (advanced)

**See [WORKFLOW.md](./WORKFLOW.md)** for complete integration guide with examples!

### Quick Example: Agent Mode

```
You: [Write new authentication code]

Claude (Jira Assistant): "I see you've implemented authentication.
Would you like me to create a Jira issue to track this?"

You: "Yes"

Claude: [Creates PROJ-456 automatically]
```

**The plugins include intelligent agents and skills:**
- **Jira Assistant** - Tracks work and suggests issue updates
- **Documentation Assistant** - Reminds you to update Confluence when code changes
- **Trello Assistant** - Proactive Trello suggestions during development
- **Trading Assistant** - Monitors positions and suggests trading actions
- **Cross-Tool Workflow** - Coordinates work across Trello, Jira, and Confluence

## Available Plugins

### 🎯 [Jira Plugin](./jira-plugin)

Complete Jira integration for issue tracking and project management.

**Features:**
- Create, view, update, and transition issues
- Search issues with JQL (Jira Query Language)
- Add comments to issues
- View your assigned issues
- Full issue lifecycle management

**Commands:**
- `/jira-create` - Create new issue
- `/jira-get` - View issue details
- `/jira-search` - Search with JQL
- `/jira-my-issues` - Your assigned issues
- `/jira-update` - Update issue fields
- `/jira-comment` - Add comments
- `/jira-transition` - Change issue status

[→ Full Jira Plugin Documentation](./jira-plugin/README.md)

### 📚 [Confluence Plugin](./confluence-plugin)

Complete Confluence integration for wiki and documentation management.

**Features:**
- Create, view, update, and delete pages
- Search pages by space or title
- List all spaces
- Full page lifecycle management
- ADF (Atlassian Document Format) support

**Commands:**
- `/confluence-create-page` - Create new page
- `/confluence-get-page` - View page details
- `/confluence-search-pages` - Search pages
- `/confluence-list-spaces` - List all spaces
- `/confluence-update-page` - Update existing page
- `/confluence-delete-page` - Delete page

[→ Full Confluence Plugin Documentation](./confluence-plugin/README.md)

### 📋 [Trello Plugin](./trello-plugin)

Complete Trello integration for Kanban/Scrumban workflow management.

**Features:**
- Create, view, update, move, and archive cards
- List management and board overview
- Checklists with item management
- Comments on cards
- Search across boards
- Activity tracking
- Scrumban workflow optimized

**Commands:**
- `/trello-create` - Create new card
- `/trello-get` - View card details
- `/trello-update` - Update card fields
- `/trello-move` - Move card between lists
- `/trello-archive` - Archive a card
- `/trello-lists` - View board lists
- `/trello-search` - Search cards
- `/trello-my-cards` - Your assigned cards
- `/trello-checklist` - Manage checklists
- `/trello-comment` - Add comments
- `/trello-activity` - View board activity

[→ Full Trello Plugin Documentation](./trello-plugin/README.md)

### 📈 [Alpaca Plugin](./alpaca-plugin)

Alpaca Markets trading integration for stocks, crypto, and options.

**Features:**
- Paper and live trading support
- Real-time quotes and market data
- Order management (market, limit, stop)
- Position tracking and account info
- Historical price bars

**Commands:**
- `/alpaca-account` - View account info
- `/alpaca-quote` - Get real-time quotes
- `/alpaca-order` - Place orders
- `/alpaca-orders` - View open orders
- `/alpaca-positions` - View positions
- `/alpaca-cancel` - Cancel orders
- `/alpaca-close` - Close positions
- `/alpaca-clock` - Market hours
- `/alpaca-bars` - Historical data

[→ Full Alpaca Plugin Documentation](./alpaca-plugin/README.md)

### 🔄 [Workflow Plugin](./workflow-plugin)

Agent workflow management for handoffs and session continuity.

**Features:**
- Context preservation between sessions
- Structured handoff documentation
- Session sunset summaries

**Commands:**
- `/handoff` - Create handoff document for session continuity
- `/sunset` - Generate session summary before ending

### 🔗 [Integration Plugin](./integration-plugin)

Cross-tool workflow orchestration for Trello, Jira, and Confluence.

**Features:**
- Tool selection guidance (when to use which tool)
- Cross-tool linking patterns
- Trello → Jira escalation workflows
- Release coordination across systems
- End-to-end traceability

**Skills:**
- Cross-Tool Workflow Orchestration

[→ Full Integration Plugin Documentation](./integration-plugin/README.md)

## Quick Start

### Installation

1. **Install a plugin** from within Claude Code:
   ```bash
   /install-plugin https://github.com/ramirez-justin/claude-plugins jira
   /install-plugin https://github.com/ramirez-justin/claude-plugins confluence
   /install-plugin https://github.com/ramirez-justin/claude-plugins trello
   /install-plugin https://github.com/ramirez-justin/claude-plugins alpaca
   /install-plugin https://github.com/ramirez-justin/claude-plugins workflow
   /install-plugin https://github.com/ramirez-justin/claude-plugins integration
   ```

2. **Get your API credentials**:
   - **Atlassian (Jira/Confluence)**: Visit https://id.atlassian.com/manage-profile/security/api-tokens
   - **Trello**: Visit https://trello.com/app-key
   - **Alpaca**: Visit https://app.alpaca.markets/brokerage/api (paper) or live dashboard

3. **Configure credentials** in `.claude/settings.json`:
   ```json
   {
     "env": {
       "JIRA_HOST": "your-domain.atlassian.net",
       "JIRA_EMAIL": "your-email@example.com",
       "JIRA_API_TOKEN": "your-api-token",

       "CONFLUENCE_HOST": "your-domain.atlassian.net",
       "CONFLUENCE_EMAIL": "your-email@example.com",
       "CONFLUENCE_API_TOKEN": "your-api-token",

       "TRELLO_API_KEY": "your-api-key",
       "TRELLO_TOKEN": "your-token",
       "TRELLO_BOARD_ID": "your-board-id",

       "ALPACA_API_KEY": "your-api-key",
       "ALPACA_SECRET_KEY": "your-secret-key",
       "ALPACA_PAPER": "true"
     }
   }
   ```

4. **Start using the plugins**:
   ```
   /jira-my-issues
   /confluence-list-spaces
   /trello-my-cards
   ```

## Architecture

All plugins share the same minimalist architecture:

```
plugin/
├── .claude-plugin/
│   └── plugin.json         # Plugin manifest
├── commands/               # Slash command definitions
├── scripts/                # Direct API integration scripts
│   └── *-client.js         # Zero-dependency HTTP client
├── agents/                 # AI assistant agents
├── skills/                 # Specialized workflows
├── hooks/                  # Event-based automation
├── package.json            # No dependencies!
└── README.md
```

### Key Design Principles

1. **Zero Dependencies**: Only Node.js built-in `https` module
2. **Direct API Calls**: No abstraction layers or third-party libraries
3. **OpenAPI Compliance**: Follow official API specifications
4. **Simple Commands**: Intuitive slash commands for all operations
5. **Clear Error Messages**: Helpful feedback when things go wrong

## Why No MCP?

Model Context Protocol (MCP) adds unnecessary complexity for simple API integrations:

- **Extra Protocol Layer**: MCP requires additional translation
- **More Points of Failure**: More components means more can break
- **Performance Overhead**: Protocol translation adds latency
- **Harder to Debug**: Multiple layers make troubleshooting difficult

Our approach:
- **Direct HTTP Calls**: Straight to the API endpoints
- **Simpler Code**: Easy to understand and maintain
- **Better Performance**: No protocol translation overhead
- **Easier Debugging**: Direct requests are easy to trace

## API Endpoints

### Jira Plugin (REST API v3)
- `GET /rest/api/3/issue/{key}` - Get issue
- `POST /rest/api/3/issue` - Create issue
- `PUT /rest/api/3/issue/{key}` - Update issue
- `GET /rest/api/3/search/jql` - Search with JQL
- `POST /rest/api/3/issue/{key}/comment` - Add comment (uses ADF format)
- `POST /rest/api/3/issue/{key}/transitions` - Transition issue

### Confluence Plugin (REST API v2)
- `GET /wiki/api/v2/pages/{id}` - Get page
- `POST /wiki/api/v2/pages` - Create page (uses ADF format)
- `PUT /wiki/api/v2/pages/{id}` - Update page (uses ADF format)
- `DELETE /wiki/api/v2/pages/{id}` - Delete page
- `GET /wiki/api/v2/pages` - Search pages
- `GET /wiki/api/v2/spaces` - List spaces
- `POST /wiki/rest/api/content/{id}/label` - Add labels (v1 API - v2 not available)

### Trello Plugin (REST API)
- `GET /1/boards/{id}` - Get board
- `GET /1/boards/{id}/lists` - Get lists
- `GET /1/cards/{id}` - Get card
- `POST /1/cards` - Create card
- `PUT /1/cards/{id}` - Update card
- `GET /1/search` - Search cards
- `POST /1/cards/{id}/actions/comments` - Add comment
- `GET /1/checklists/{id}` - Manage checklists

## Contributing

Contributions are welcome! To add a new plugin or enhance existing ones:

1. Fork this repository
2. Create a feature branch
3. Follow the zero-dependency architecture
4. Add comprehensive documentation
5. Submit a pull request

## Development

### Creating a New Plugin

New plugins follow the architecture described above. Each plugin needs:

1. Plugin directory with `.claude-plugin/plugin.json` manifest
2. Commands in `commands/*.md` with YAML frontmatter
3. Scripts in `scripts/*.js` using only Node.js built-ins (zero dependencies)
4. Registration in `.claude-plugin/marketplace.json` at the repo root

See existing plugins for reference implementations.

### Extending Existing Plugins

Each plugin can be extended by adding:
- New methods to `scripts/*-client.js`
- New command files in `commands/`
- New agents in `agents/`
- Specialized skills in `skills/`

### Testing Locally

Install a plugin locally for testing:
```bash
/plugin install /path/to/plugin-directory
```

## Troubleshooting

### Authentication Issues

**Problem**: "HTTP 401: Unauthorized"

**Solution**:
- Verify API token is correct
- Ensure using your Atlassian account email
- Check host doesn't include `https://`
- Restart Claude Code after updating settings

### Missing Environment Variables

**Problem**: "Missing required environment variables"

**Solution**:
- Add credentials to `.claude/settings.json`
- Ensure proper JSON formatting
- Restart Claude Code

### Permission Errors

**Problem**: "HTTP 403: Forbidden" or "Permission denied"

**Solution**:
- Verify you have access to the project/space
- Check your Atlassian permissions
- Ensure API token has necessary scopes

## License

MIT

## Credits

Built using:
- Node.js built-in `https` module
- Jira REST API v3
- Confluence REST API v2
- Trello REST API
- [Claude Code](https://claude.com/claude-code) - AI-powered coding assistant

---

**Zero dependencies. Zero MCP. Zero hassle.**
