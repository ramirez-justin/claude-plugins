---
name: Release Notes Generator
description: Generate comprehensive release notes for Confluence from Jira issues, git commits, and pull requests. Use when preparing releases, creating changelogs, documenting version updates, or when user mentions release notes, changelog, version, or release documentation.
allowed-tools: Read, Grep, Bash
---

# Release Notes Generator

Expert assistance for generating comprehensive release notes and changelogs in Confluence.

## When to Use This Skill

- Creating release notes for a new version
- Generating changelogs
- Preparing release announcements
- User mentions: release notes, changelog, version, release

## Release Notes Template

```markdown
# Version X.Y.Z - [Release Date]

## Highlights
[Brief overview of most important changes - 2-3 sentences]

## What's New

### Major Features [for MAJOR/MINOR releases]
- **Feature Name**: Description and user benefit

### Minor Features [optional]
- **Feature Name**: Brief description

## Improvements

### Performance [optional]
- Specific improvement with metrics (e.g., "50% faster page loads")

### User Experience [optional]
- UI/UX enhancements

### Developer Experience [optional]
- API improvements, tooling updates

## Bug Fixes
- **[PROJ-123]**: Fixed issue where...
- **[PROJ-456]**: Resolved bug with...

## Breaking Changes [if any]
⚠️ **Important**: These changes may require action.
- **Change**: What changed and migration steps

## Deprecations [if any]
⚠️ **Notice**: Will be removed in version X.X.
- **Feature/API**: Use [alternative] instead

## Security Updates [if any]
🔒 Security fixes included.
- **[PROJ-789]**: Description (CVE-YYYY-XXXX if applicable)

## Known Issues [if any]
- **Issue**: Description and workaround

## Upgrade Guide [for MAJOR releases]
### Prerequisites
- Requirements for upgrading

### Steps
1. Step-by-step instructions

### Migration Notes
- Database migrations, config changes, API updates

## Technical Details [for developers]
### Dependencies Updated
- Library X: v1.0 → v2.0

### API Changes [optional]
- New/modified/removed endpoints

## Contributors [optional]
Thanks to: @user1, @user2
```

## Release Type Guidelines

| Version | Include | Focus |
|---------|---------|-------|
| **MAJOR (X.0.0)** | All sections, detailed upgrade guide | Breaking changes, migration |
| **MINOR (x.Y.0)** | Features, improvements, bugs | New functionality |
| **PATCH (x.y.Z)** | Bug fixes, security | Critical fixes only |

### Section Selection by Type

**MAJOR releases**: All sections, emphasize Highlights, Breaking Changes, Upgrade Guide

**MINOR releases**: Skip Upgrade Guide unless needed, brief Technical Details

**PATCH releases**: Only Bug Fixes, Security Updates, Known Issues

## Gathering Information

### From Jira Issues

```jql
fixVersion = "2.0.0" ORDER BY type DESC, priority DESC
```

**Map issue types**:
- Epic/Story → New Features
- Task → Improvements
- Bug → Bug Fixes
- Label `breaking-change` → Breaking Changes
- Label `deprecation` → Deprecations
- Label `security` → Security Updates

### From Git Commits

```bash
git log v1.4.0..v1.5.0 --oneline
```

**Conventional commits mapping**:
- `feat:` → New Features
- `fix:` → Bug Fixes
- `perf:` → Performance Improvements
- `docs:` → Documentation (usually skip)
- `chore:` → Usually skip

### Combining Sources

```markdown
### Multi-language Support
**[PROJ-456]** (PR #123): Added 10 new languages.

Implementation by @johndoe
- Automatic language detection
- RTL language support
```

## Audience Adaptation

### For End Users
- Focus on benefits, not technical details
- Use friendly language, avoid jargon
- Include "How to Update" section
- Link to help/support resources

### For Developers
- Include API changes, code examples
- Database migrations with SQL
- Dependency version changes
- Performance benchmarks

## Best Practices

1. **Be specific**: "Dashboard loads 50% faster" not "Improved performance"
2. **Highlight breaking changes**: Use ⚠️, explain impact, provide migration path
3. **Credit contributors**: Link to PRs, thank community
4. **Link to details**: Don't duplicate docs, reference migration guides

## Semantic Versioning Quick Reference

| Change Type | Version Bump | Examples |
|-------------|--------------|----------|
| Breaking API change | MAJOR | Removed endpoint, changed response format |
| New feature (compatible) | MINOR | New endpoint, new parameter |
| Bug fix (compatible) | PATCH | Fixed validation, security patch |

## Release Notes Checklist

- [ ] Version number correct (semver)
- [ ] Release date accurate
- [ ] All issues from fixVersion included
- [ ] Breaking changes highlighted with migration steps
- [ ] Known issues documented
- [ ] Links working
- [ ] Proofread for clarity

## Confluence Organization

```
Product Documentation/
├── Releases/
│   ├── Version 2.0.0
│   ├── Version 1.5.0
│   └── Version 1.4.3
├── Upgrade Guides/
│   └── Upgrading to 2.0
└── Changelogs/
    └── Complete Changelog
```

## How I'll Help

When generating release notes, I will:

1. **Gather information**: Query Jira, parse commits, read PRs
2. **Categorize changes**: Group by type, identify breaking changes
3. **Generate content**: Clear descriptions with context
4. **Format for audience**: User-friendly or technical as needed
5. **Create in Confluence**: Convert to ADF, add styling
6. **Review checklist**: Verify completeness

## Example Interaction

**You**: "Generate release notes for v2.5.0"

**Me**: "I'll generate release notes for version 2.5.0.

[Searches Jira for fixVersion='2.5.0']

Found 23 issues:
- 8 features
- 10 improvements
- 4 bug fixes
- 1 breaking change

**Draft**:

# Version 2.5.0 - [Today]

## Highlights
New analytics dashboard with custom widgets. 25% performance improvement across all pages.

## What's New
### Analytics Dashboard
**[PROJ-301]**: Customizable widgets, real-time data...

## Breaking Changes
⚠️ **API Authentication**: API keys deprecated, use OAuth 2.0
[Migration steps...]

Ready to create in Confluence. Which space?"

**You**: "Space 123456"

**Me**: [Creates page]
"Created 'Version 2.5.0 Release Notes' in space 123456!"
