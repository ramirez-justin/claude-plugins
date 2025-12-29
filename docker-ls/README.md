# Dockerfile Language Server

Dockerfile language server for Claude Code, providing code intelligence for Docker files.

## Supported File Extensions

- `Dockerfile`
- `Dockerfile.*` (e.g., `Dockerfile.dev`, `Dockerfile.prod`)
- `*.dockerfile`

## Installation

Using npm:
```bash
npm install -g dockerfile-language-server-nodejs
```

Using Homebrew:
```bash
brew install dockerfile-language-server
```

## Server Command

```bash
docker-langserver --stdio
```

## Features

- Syntax highlighting
- Auto completion
- Hover documentation
- Go to definition
- Find references
- Document formatting
- Rename
- Diagnostics
- Code actions

## Resources

- [npm Package](https://www.npmjs.com/package/dockerfile-language-server-nodejs)
- [GitHub Repository](https://github.com/rcjsuen/dockerfile-language-server)
