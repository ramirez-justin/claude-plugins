# Vim Language Server

VimScript language server for Claude Code, providing code intelligence for Vim configuration files.

## Supported File Extensions

- `.vim` - Vim script files
- `.vimrc` - Vim configuration
- `vimrc` - Vim configuration (no dot)
- `.gvimrc` - GUI Vim configuration
- `.exrc` - Ex configuration

## Installation

Using npm:
```bash
npm install -g vim-language-server
```

Using yarn:
```bash
yarn global add vim-language-server
```

## Server Command

```bash
vim-language-server --stdio
```

## Features

- Auto completion
- Function signature help
- Hover documentation
- Go to definition
- Go to references
- Document symbols
- Document highlight
- Folding range
- Select range
- Rename
- Snippets
- Diagnostics

## Resources

- [npm Package](https://www.npmjs.com/package/vim-language-server)
- [GitHub Repository](https://github.com/iamcco/vim-language-server)
