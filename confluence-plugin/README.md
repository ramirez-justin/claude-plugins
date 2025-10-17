# Confluence Plugin for Claude Code

A lightweight, zero-dependency Confluence integration plugin for Claude Code that uses direct REST API calls based on the Confluence OpenAPI specification. **NO external npm packages, NO MCP overhead - just pure Node.js built-in modules!**

## Features

- **Zero Dependencies**: Uses only Node.js built-in `https` module
- **Direct API Integration**: Calls Confluence REST API v2 endpoints directly based on OpenAPI spec
- **No MCP**: Simpler architecture without Model Context Protocol overhead
- Create new Confluence pages
- View page details
- Search for pages
- List all spaces
- Update existing pages
- Delete pages (move to trash)

## Installation

### 1. Install the Plugin

From within Claude Code, run:

```bash
/plugin install /path/to/confluence-plugin
```

**No npm install needed!** The plugin has zero dependencies.

### 2. Get Your Confluence API Token

1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a name (e.g., "Claude Code")
4. Copy the generated token

### 3. Configure Credentials

Add your Confluence credentials to `.claude/settings.json` in your project:

```json
{
  "env": {
    "CONFLUENCE_HOST": "your-domain.atlassian.net",
    "CONFLUENCE_EMAIL": "your-email@example.com",
    "CONFLUENCE_API_TOKEN": "your-api-token-here"
  }
}
```

**Important**:
- Don't include `https://` in `CONFLUENCE_HOST`, just the domain
- Use your Atlassian account email
- Keep your API token secure

### 4. You're Done!

No dependencies to install. Just start using the commands:

```
/confluence-list-spaces
```

## Available Commands

### `/confluence-create-page`
Create a new Confluence page.

**Example:**
```
/confluence-create-page
```

Claude will ask for:
- Space ID (numeric ID of the space)
- Page title
- Page content
- Parent page ID (optional)

### `/confluence-get-page <page-id>`
View details of a specific page.

**Example:**
```
/confluence-get-page 123456
```

### `/confluence-search-pages`
Search for pages by space or title.

**Examples:**
```
/confluence-search-pages --space-id 123456
/confluence-search-pages --title "Getting Started"
/confluence-search-pages --space-id 123456 --limit 10
```

### `/confluence-list-spaces [limit]`
List all Confluence spaces.

**Examples:**
```
/confluence-list-spaces        # Default limit of 25
/confluence-list-spaces 10     # Show only 10 spaces
```

### `/confluence-update-page`
Update an existing page.

**Example:**
```
/confluence-update-page
```

Claude will ask for:
- Page ID
- New title
- New content
- Version number (current version + 1)

**Note**: Use `/confluence-get-page` first to get the current version number.

### `/confluence-delete-page <page-id>`
Delete a page (moves to trash).

**Example:**
```
/confluence-delete-page 123456
```

## Architecture

This plugin uses a minimalist architecture:

- **Direct REST API calls**: Using Node.js built-in `https` module
- **OpenAPI v2 compliance**: Follows Confluence REST API v2 specification
- **Zero dependencies**: No external npm packages required
- **No MCP**: Simpler than Model Context Protocol implementations

### Directory Structure

```
confluence-plugin/
├── .claude-plugin/
│   ├── commands/           # Command definitions
│   │   ├── confluence-create-page.md
│   │   ├── confluence-get-page.md
│   │   ├── confluence-search-pages.md
│   │   ├── confluence-list-spaces.md
│   │   ├── confluence-update-page.md
│   │   └── confluence-delete-page.md
│   ├── scripts/            # Direct API integration scripts
│   │   ├── confluence-client.js    # HTTP client (zero dependencies)
│   │   ├── create-page.js
│   │   ├── get-page.js
│   │   ├── search-pages.js
│   │   ├── list-spaces.js
│   │   ├── update-page.js
│   │   └── delete-page.js
│   └── plugin.json         # Plugin manifest
├── package.json            # No dependencies!
├── confluence-openapi-v2.v3.json # OpenAPI spec (reference only)
├── .gitignore
└── README.md
```

## Why This Approach is Better

### Compared to Third-Party Libraries
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
- **Standards-Compliant**: Uses official Confluence REST API v2 specification
- **Future-Proof**: Easy to add new endpoints from the OpenAPI spec
- **Well-Documented**: OpenAPI spec provides comprehensive documentation

## API Endpoints Used

This plugin uses the following Confluence REST API v2 endpoints:

- `GET /wiki/api/v2/pages/{id}` - Get page details
- `POST /wiki/api/v2/pages` - Create page
- `PUT /wiki/api/v2/pages/{id}` - Update page
- `DELETE /wiki/api/v2/pages/{id}` - Delete page
- `GET /wiki/api/v2/pages` - Search pages
- `GET /wiki/api/v2/spaces` - List spaces
- `GET /wiki/api/v2/spaces/{id}` - Get space details

Authentication uses Basic Auth with email + API token.

## Content Format

Confluence uses the Atlassian Document Format (ADF) for page content. This plugin handles the conversion automatically:

- Plain text input is converted to ADF format
- ADF content is extracted and displayed as plain text

## Troubleshooting

### "Error: Missing required environment variables"

Make sure you've added `CONFLUENCE_HOST`, `CONFLUENCE_EMAIL`, and `CONFLUENCE_API_TOKEN` to your `.claude/settings.json`.

### "HTTP 401: Unauthorized"

- Verify your API token is correct
- Make sure you're using your Atlassian account email
- Check that your Confluence host is correct (without https://)

### "HTTP 404: Not Found"

- Verify the page/space ID exists
- Check that you have access permissions
- Ensure IDs are numeric (not space keys)

### Finding Space IDs

Space IDs are numeric values. Use `/confluence-list-spaces` to find the ID of your space. The space key (like "DOCS") is different from the space ID (like "123456").

### Version Conflicts When Updating

Confluence requires version numbers for updates. Always use `/confluence-get-page` first to get the current version, then add 1 for the update.

## Development

### Adding New Commands

1. Create a new command file in `.claude-plugin/commands/`
2. Create corresponding script in `.claude-plugin/scripts/`
3. Use the `ConfluenceClient` class methods or add new methods as needed

### Extending the API Client

The `ConfluenceClient` class in `confluence-client.js` can be extended with new methods:

```javascript
async newMethod(param) {
  return this.request('GET', `/path/to/endpoint?param=${param}`);
}
```

All Confluence API endpoints follow the pattern `/wiki/api/v2/{resource}`. Refer to the OpenAPI spec for available endpoints.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Credits

Built using:
- Node.js built-in `https` module (zero dependencies!)
- Confluence REST API v2 (OpenAPI specification)
- [Claude Code](https://claude.com/claude-code) - AI-powered coding assistant

---

**Zero dependencies. Zero MCP. Zero hassle. Just direct API integration.**
