# Workflow Plugin

Agent workflow management tools for Claude Code - handoffs, context preservation, and documentation sync.

## Overview

This plugin provides commands for managing Claude Code session workflows:

- **Session Handoffs**: Preserve context when switching sessions
- **Documentation Sync**: Keep docs updated with code changes

## Commands

### `/sunset`

Prepare for session handoff by creating a comprehensive context file.

**What it does:**
- Gathers context from the current session
- Creates `.claude-handoff.md` with task status, decisions, and next steps
- Compacts the session to free up context

**Usage:**
```
/sunset
```

### `/handoff`

Resume work by consuming a handoff context file from a previous session.

**What it does:**
- Reads `.claude-handoff.md` from the working directory
- Loads previous session context
- Continues where the previous session left off

**Usage:**
```
/handoff
```

### `/sync-docs`

Review and update local documentation to reflect recent code changes.

**What it does:**
- Identifies code changes from the current session
- Finds related documentation (README.md, CLAUDE.md, docs/)
- Proposes updates to keep docs in sync
- Applies updates after confirmation

**Usage:**
```
/sync-docs
```

**Best practice:** Run before `/sunset` to ensure documentation is current for handoff.

## Installation

Add to your Claude Code settings:

```bash
/install-plugin https://github.com/ramirez-justin/claude-plugins workflow
```

## Typical Workflow

```
1. Start session, work on tasks
2. Before ending: /sync-docs (update documentation)
3. Then: /sunset (create handoff, compact)
4. New session: /handoff (resume with context)
```

## License

MIT
