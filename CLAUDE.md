# Claude Code Instructions

This repository contains Claude Code plugins. Follow these conventions when working here.

## Creating a New Plugin

When asked to create a new plugin, follow this checklist in order:

### 1. Create Plugin Directory Structure

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   └── *.md
├── scripts/
│   └── *.js
├── agents/           (optional)
│   └── *.md
├── skills/           (optional)
│   └── */
├── hooks/            (optional)
│   └── *.js
└── README.md
```

### 2. Create Plugin Manifest

Create `.claude-plugin/plugin.json`:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "What the plugin does",
  "author": { "name": "Justin Ramirez" },
  "license": "MIT",
  "homepage": "https://github.com/ramirez-justin/claude-plugins",
  "repository": "https://github.com/ramirez-justin/claude-plugins",
  "keywords": ["relevant", "keywords"]
}
```

### 3. Create Command Files

Commands go in `commands/*.md` with required YAML frontmatter:

```markdown
---
description: Short description of command
---

# Command Title

Instructions for executing the command...
```

### 4. Create Scripts (Zero Dependencies)

Scripts in `scripts/*.js` must:
- Use only Node.js built-in modules (`https`, `fs`, `path`, etc.)
- NO npm dependencies
- Use direct REST API calls
- Include proper error handling

### 5. Create Agent Files (Optional)

Agents go in `agents/*.md` with required YAML frontmatter:

```markdown
---
description: What the agent does
capabilities:
  - Capability one
  - Capability two
---

# Agent Name

Agent instructions...
```

### 6. Create README.md

Document installation, configuration, and usage for humans.

### 7. Register in Marketplace (CRITICAL)

**This step is required for the plugin to appear in the marketplace.**

Add an entry to the root `.claude-plugin/marketplace.json` file:

```json
{
  "name": "my-plugin",
  "source": "./my-plugin",
  "description": "Short description for marketplace listing"
}
```

Add it to the `plugins` array in `.claude-plugin/marketplace.json`.

### 8. Update Root README.md

Add the new plugin to:
- The "Available Plugins" section
- The Quick Start installation examples
- The credentials configuration example (if needed)
- The agents list (if the plugin has an agent)

## Code Conventions

### Zero Dependencies

All scripts must use only Node.js built-in modules. No `npm install`, no `package.json` dependencies.

```javascript
// CORRECT - use built-in https
const https = require('https');

// WRONG - no external packages
const axios = require('axios');
```

### API Client Pattern

Create a `*-client.js` file in `scripts/` with reusable API methods:

```javascript
const https = require('https');

function makeRequest(method, path, data) {
  // Direct HTTPS request implementation
}

module.exports = { makeRequest, /* other methods */ };
```

### Environment Variables

Credentials come from environment variables set in `.claude/settings.json`:

```javascript
const apiKey = process.env.SERVICE_API_KEY;
if (!apiKey) {
  console.error('Missing SERVICE_API_KEY environment variable');
  process.exit(1);
}
```

### Command Scripts

Command scripts should:
- Parse arguments from `process.argv`
- Output results as formatted text or JSON
- Exit with appropriate codes (0 success, 1 error)
- Print helpful error messages

## File Locations

| File | Purpose |
|------|---------|
| `.claude-plugin/marketplace.json` | Root marketplace registry - lists all available plugins |
| `{plugin}/.claude-plugin/plugin.json` | Individual plugin manifest |
| `{plugin}/commands/*.md` | Slash command definitions |
| `{plugin}/scripts/*.js` | API integration scripts |
| `{plugin}/agents/*.md` | AI assistant agent definitions |
| `{plugin}/skills/*/` | Specialized workflow skills |
| `{plugin}/hooks/*.js` | Event-based automation |
