# Claude Code Plugins

A collection of zero-dependency plugins for [Claude Code](https://claude.com/claude-code) that provide direct integrations with popular Atlassian tools using OpenAPI specifications.

## Why These Plugins?

- **Zero Dependencies**: Only Node.js built-in modules (no npm packages!)
- **No MCP Overhead**: Direct REST API calls without Model Context Protocol
- **OpenAPI Based**: Standards-compliant implementations following official specs
- **Production Ready**: Comprehensive error handling and documentation
- **Easy to Use**: Simple slash commands in Claude Code
- **Easy to Extend**: Clean architecture makes adding features straightforward

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

## Quick Start

### Installation

1. **Install a plugin** from within Claude Code:
   ```bash
   /plugin install https://github.com/sethdford/claude-plugins/jira-plugin
   /plugin install https://github.com/sethdford/claude-plugins/confluence-plugin
   ```

2. **Get your Atlassian API token**:
   - Visit https://id.atlassian.com/manage-profile/security/api-tokens
   - Click "Create API token"
   - Copy the generated token

3. **Configure credentials** in `.claude/settings.json`:
   ```json
   {
     "env": {
       "JIRA_HOST": "your-domain.atlassian.net",
       "JIRA_EMAIL": "your-email@example.com",
       "JIRA_API_TOKEN": "your-api-token",

       "CONFLUENCE_HOST": "your-domain.atlassian.net",
       "CONFLUENCE_EMAIL": "your-email@example.com",
       "CONFLUENCE_API_TOKEN": "your-api-token"
     }
   }
   ```

4. **Start using the plugins**:
   ```
   /jira-my-issues
   /confluence-list-spaces
   ```

## Architecture

Both plugins share the same minimalist architecture:

```
plugin/
├── .claude-plugin/
│   ├── commands/           # Slash command definitions
│   ├── scripts/            # Direct API integration scripts
│   │   └── *-client.js    # Zero-dependency HTTP client
│   └── plugin.json         # Plugin manifest
├── package.json            # No dependencies!
├── *-openapi-*.json       # OpenAPI spec (reference)
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
- `GET /rest/api/3/search` - Search with JQL
- `POST /rest/api/3/issue/{key}/comment` - Add comment
- `POST /rest/api/3/issue/{key}/transitions` - Transition issue

### Confluence Plugin (REST API v2)
- `GET /wiki/api/v2/pages/{id}` - Get page
- `POST /wiki/api/v2/pages` - Create page
- `PUT /wiki/api/v2/pages/{id}` - Update page
- `DELETE /wiki/api/v2/pages/{id}` - Delete page
- `GET /wiki/api/v2/pages` - Search pages
- `GET /wiki/api/v2/spaces` - List spaces

## Contributing

Contributions are welcome! To add a new plugin or enhance existing ones:

1. Fork this repository
2. Create a feature branch
3. Follow the zero-dependency architecture
4. Add comprehensive documentation
5. Submit a pull request

## Development

### Adding New Features

Each plugin can be extended by:
1. Adding new methods to the `*-client.js` file
2. Creating new scripts in `.claude-plugin/scripts/`
3. Adding new command files in `.claude-plugin/commands/`

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
- Jira REST API v3 (OpenAPI specification)
- Confluence REST API v2 (OpenAPI specification)
- [Claude Code](https://claude.com/claude-code) - AI-powered coding assistant

---

**Zero dependencies. Zero MCP. Zero hassle.**

Made with ❤️ for the Claude Code community
