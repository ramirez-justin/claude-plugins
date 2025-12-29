# YAML Language Server

YAML language server for Claude Code with JSON Schema validation support.

## Supported File Extensions

- `.yaml`
- `.yml`

## Installation

Using npm:
```bash
npm install -g yaml-language-server
```

Using yarn:
```bash
yarn global add yaml-language-server
```

## Server Command

```bash
yaml-language-server --stdio
```

## Features

- JSON Schema validation (Schema 7 and below)
- Document formatting
- Auto-completion
- Hover documentation
- Document symbols

## Configuration

The default YAML spec version is 1.2. This can be changed with the `yaml.yamlVersion` setting.

## Resources

- [npm Package](https://www.npmjs.com/package/yaml-language-server)
- [GitHub Repository](https://github.com/redhat-developer/yaml-language-server)
