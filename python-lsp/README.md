# Python LSP Plugin

Combined Python language server plugin for Claude Code featuring:

- **Ruff** - Fast linting and formatting
- **Pyright** - Type checking and symbol navigation

## Features

| Feature | Provider |
|---------|----------|
| Style linting (unused imports, etc.) | Ruff |
| Code formatting | Ruff |
| Type checking | Pyright |
| Go to definition | Pyright |
| Find references | Pyright |
| Document symbols | Pyright |
| Hover (type info) | Pyright |

## Requirements

Both tools must be installed:

```bash
# Install ruff
pip install ruff

# Install pyright
pip install pyright
```

## Installation

```bash
/plugin install python-lsp
```
