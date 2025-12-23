# Integration Plugin

Cross-tool workflow orchestration for Trello, Jira, and Confluence.

## Overview

This plugin provides guidance for coordinating work across multiple Atlassian tools and Trello. It helps you:

- Decide which tool to use for different tasks
- Link work items across systems
- Coordinate releases across tools
- Maintain traceability from code to documentation

## Skills

### Cross-Tool Workflow Orchestration

Guides you through multi-tool workflows:

- **Tool Selection**: When to use Trello vs Jira vs Confluence
- **Escalation Patterns**: Moving work from Trello to Jira
- **Documentation Flows**: Creating Confluence docs from Jira issues
- **Release Coordination**: End-to-end release management

## Installation

Add to your `.claude/settings.json`:

```json
{
  "plugins": {
    "integration": {
      "source": "https://github.com/ramirez-justin/claude-plugins/integration-plugin"
    }
  }
}
```

## Usage

The skill activates when you:

- Ask which tool to use for a task
- Need to link work across systems
- Want to coordinate a release
- Mention "integration" or "workflow" with multiple tools

## Related Plugins

This plugin works best with:

- **trello-plugin**: Trello board and card management
- **jira-plugin**: Jira issue and sprint management
- **confluence-plugin**: Confluence page management

## License

MIT
