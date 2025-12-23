---
description: Review and update local documentation (README.md, CLAUDE.md, docs/) to reflect recent code changes
---

# Sync Docs - Documentation Update Assistant

Review code changes from the current session and update relevant local documentation to keep it in sync.

## Instructions

### 1. Identify Changes Made

First, determine what was changed in this session:

```bash
# Check recent git changes (staged and unstaged)
git diff --name-only HEAD
git diff --name-only --cached

# If no uncommitted changes, check recent commits
git log --oneline -10 --name-only
```

Categorize changes:
- **New features** added
- **APIs or interfaces** changed
- **Configuration** changes
- **Architecture** changes
- **Bug fixes** (may affect known issues docs)
- **Dependencies** added/removed

### 2. Find Related Documentation

Scan for documentation files that might need updates:

```
Priority documentation files:
├── CLAUDE.md          # Project instructions for Claude Code
├── README.md          # Project overview and setup
├── docs/              # Documentation directory
│   ├── *.md
│   └── **/*.md
├── CHANGELOG.md       # Version history
├── CONTRIBUTING.md    # Contribution guidelines
└── API.md / api/      # API documentation
```

### 3. Analyze Documentation Gaps

For each change category, check if documentation needs updates:

| Change Type | Check These Docs |
|-------------|------------------|
| New feature | README.md (features list), relevant docs/*.md |
| API change | API.md, README.md (usage examples) |
| Config change | README.md (setup), CLAUDE.md (instructions) |
| New dependency | README.md (installation), package.json docs |
| Architecture change | CLAUDE.md, architecture docs |
| New command/script | README.md, CLAUDE.md |

### 4. Propose Updates

For each doc that needs updating, present:

```markdown
## Documentation Updates Needed

### [filename]
**Current content** (relevant section):
> [quote existing text]

**Suggested update**:
> [proposed new text]

**Reason**: [why this update is needed]
```

### 5. Apply Updates

After user confirms, use the Edit tool to update documentation files.

For CLAUDE.md specifically, ensure:
- Build/test commands are current
- File structure reflects actual layout
- Code conventions match current patterns
- Any new workflows are documented

## What to Update in Each File

### CLAUDE.md
- Project structure changes
- New commands or scripts
- Updated build/test instructions
- New code conventions established
- Architecture decisions made

### README.md
- New features in features list
- Installation steps if dependencies changed
- Usage examples if API changed
- Configuration options

### docs/*.md
- API documentation for changed endpoints
- Architecture docs for structural changes
- User guides for new features

### CHANGELOG.md (if exists)
- New version entry with changes
- Categorized by: Added, Changed, Fixed, Removed

## Example Interaction

**User**: `/sync-docs`

**Assistant**: "I'll review the changes from this session and check if documentation needs updates.

**Changes detected**:
- Added `integration-plugin/` with Cross-Tool Workflow skill
- Modified `jira-plugin/skills/sprint-planning/` (split into two skills)
- Updated `confluence-plugin/skills/` (token optimization)

**Documentation to update**:

### README.md
Current features list doesn't include the new Integration Plugin.

**Suggested addition** to Available Plugins section:
```markdown
### Integration Plugin
Cross-tool workflow orchestration...
```

### CLAUDE.md
No updates needed - file structure section already covers plugin layout.

Should I apply these updates?"

**User**: "Yes"

**Assistant**: [Makes the edits]
"Documentation updated:
- README.md: Added Integration Plugin section
- 1 file updated

Documentation is now in sync with code changes."

## Tips

- Run before `/sunset` to ensure docs are current for handoff
- Focus on user-facing documentation first (README, CLAUDE.md)
- Don't over-document internal implementation details
- Keep CLAUDE.md focused on what Claude Code needs to know
- Update CHANGELOG.md if project uses semantic versioning
