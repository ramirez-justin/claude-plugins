# Ruff LSP

Python linter and code formatter (Ruff) language server for Claude Code, providing diagnostics, code actions, and formatting.

## Supported File Extensions

- `.py` - Python files
- `.pyi` - Python type stub files

## Installation

Using pip:
```bash
pip install ruff
```

Using pipx (recommended for CLI tools):
```bash
pipx install ruff
```

Using uv (fastest):
```bash
uv tool install ruff
```

Using Homebrew:
```bash
brew install ruff
```

## Server Command

```bash
ruff server
```

## Features

- **Diagnostics** - Linting errors and warnings (800+ built-in rules)
- **Code Actions** - Automatic fixes for lint issues
- **Formatting** - Built-in code formatter (replaces Black)

## Note

Ruff is designed to work alongside another Python language server (like Pyright) for navigation, autocompletion, and type checking. Use both for full Python IDE support.

## Resources

- [Ruff Documentation](https://docs.astral.sh/ruff/)
- [Ruff GitHub](https://github.com/astral-sh/ruff)
- [Editor Integration](https://docs.astral.sh/ruff/editors/)
