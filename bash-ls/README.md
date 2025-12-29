# Bash Language Server

Bash language server for Claude Code with shellcheck and shfmt integration.

## Supported File Extensions

- `.sh` - Shell scripts
- `.bash` - Bash scripts
- `.bashrc` - Bash configuration
- `.bash_profile` - Bash profile
- `.zsh` - Zsh scripts
- `.zshrc` - Zsh configuration

## Installation

Using npm:
```bash
npm install -g bash-language-server
```

## Recommended Dependencies

For linting support (highly recommended):
```bash
# macOS
brew install shellcheck

# Ubuntu/Debian
apt install shellcheck
```

For formatting support:
```bash
# macOS
brew install shfmt

# Using Go
go install mvdan.cc/sh/v3/cmd/shfmt@latest
```

## Server Command

```bash
bash-language-server start
```

## Features

- Diagnostics via shellcheck
- Document formatting via shfmt
- Go to definition
- Find references
- Code completion
- Hover documentation
- Document symbols
- Rename

## Resources

- [npm Package](https://www.npmjs.com/package/bash-language-server)
- [GitHub Repository](https://github.com/bash-lsp/bash-language-server)
- [shellcheck](https://www.shellcheck.net/)
- [shfmt](https://github.com/mvdan/sh)
