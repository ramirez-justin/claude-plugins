---
name: Cross-Tool Workflow Orchestration
description: Guide for coordinating work across Trello, Jira, and Confluence. Use when work spans multiple tools, when deciding which tool to use, or when linking work items across systems.
---

# Cross-Tool Workflow Orchestration

Expert guidance for coordinating work across Trello, Jira, and Confluence.

## When to Use This Skill

- Deciding which tool to use for a task
- Linking work across multiple systems
- Escalating from Trello to Jira
- Creating documentation from issues
- Coordinating releases across tools
- User asks: "Which tool should I use?" or "How do I connect these?"

## Tool Selection Guide

### When to Use Each Tool

| Scenario | Tool | Why |
|----------|------|-----|
| Quick task tracking | **Trello** | Lightweight, visual, fast |
| Personal/team kanban | **Trello** | Simple board management |
| Sprint planning | **Jira** | Story points, velocity, sprints |
| Bug tracking with SLAs | **Jira** | Workflows, priorities, reporting |
| Complex project management | **Jira** | Dependencies, epics, roadmaps |
| Meeting notes | **Confluence** | Rich text, collaboration |
| Technical documentation | **Confluence** | Structured, searchable |
| Decision records (ADRs) | **Confluence** | Permanent, linkable |
| Release notes | **Confluence** | Formatted, versioned |

### Decision Tree

```
Is this a quick, informal task?
├─ Yes → Trello
└─ No → Does it need sprint tracking or workflows?
         ├─ Yes → Jira
         └─ No → Is it documentation?
                  ├─ Yes → Confluence
                  └─ No → Consider tool complexity needs
```

## Cross-Tool Workflows

### 1. Trello → Jira Escalation

**When to escalate**:
- Task becomes complex (needs subtasks, dependencies)
- Needs formal tracking (SLAs, sprint planning)
- Bug requires investigation workflow
- Work becomes part of a larger epic

**How to link**:
```
Trello Card:
- Title: [ESCALATED] Original task name
- Description: Add "Escalated to Jira: PROJ-123"
- Archive card after Jira issue created

Jira Issue:
- Description: Include "Originally from Trello card [link]"
- Label: `from-trello`
```

**Commands**:
1. `/trello get <card-id>` - Get card details
2. `/jira-create` - Create Jira issue with card content
3. `/trello comment <card-id>` - Add Jira link to card
4. `/trello archive <card-id>` - Archive original card

### 2. Jira → Confluence Documentation

**When to create docs**:
- Architecture decision made in issue
- Feature ready for user documentation
- Post-mortem needed for incident
- Release preparation

**Linking pattern**:
```
Jira Issue:
- Add Confluence page link in comments
- Label: `documented`

Confluence Page:
- Include "Related issues: PROJ-123, PROJ-456"
- Use Jira macro to embed issue status
```

**Commands**:
1. `/jira-get <issue-key>` - Get issue details
2. `/confluence-create-page` - Create doc with issue content
3. `/jira-comment <issue-key>` - Add doc link to issue

### 3. Code → Issue → Documentation Flow

**Full traceability pattern**:

```
Git Commit: "feat: add user auth [PROJ-123]"
     ↓
Jira Issue: PROJ-123 (tracks implementation)
     ↓
Confluence: ADR for auth decision + API docs
     ↓
Release Notes: Generated from Jira fixVersion
```

**Linking conventions**:
- Commits: Include issue key in message
- Branches: `feature/PROJ-123-user-auth`
- PRs: Reference issue in description
- Jira: Link to PR, Confluence pages
- Confluence: Reference Jira issues

### 4. Release Coordination

**End-to-end release workflow**:

```
1. PLANNING
   └─ Jira: Create fixVersion, assign issues

2. DEVELOPMENT
   └─ Code: Branch per issue, link commits
   └─ Jira: Track progress in sprint

3. DOCUMENTATION
   └─ Confluence: Update API docs, user guides
   └─ Jira → Confluence: Create from issue details

4. RELEASE
   └─ Jira: Mark fixVersion as released
   └─ Confluence: Generate release notes from fixVersion
   └─ Trello: Update roadmap board (if used)
```

**Commands for release**:
1. `/jira-search fixVersion = "2.0.0"` - Get all issues
2. Use Release Notes Generator skill for Confluence
3. `/trello update` - Update roadmap card if applicable

## Linking Patterns

### Issue References

| Context | Format | Example |
|---------|--------|---------|
| Commit message | `[PROJ-123]` | `fix: login bug [PROJ-123]` |
| Branch name | `type/PROJ-123-desc` | `feature/PROJ-123-auth` |
| PR description | Full URL or key | `Fixes PROJ-123` |
| Confluence | Jira macro | `{jira:PROJ-123}` |
| Trello card | URL in description | Link to Jira issue |

### Bidirectional Links

Always link both directions:
- Jira → Confluence: Add page link in issue
- Confluence → Jira: Reference issue key in page
- Trello → Jira: Comment with issue link
- Code → Issue: Issue key in commit/branch

## Common Workflows

### Bug Report to Fix

```
1. Bug discovered
   └─ Create: Jira bug issue (PROJ-123)

2. Investigation
   └─ Jira: Add findings to description
   └─ Confluence: Create post-mortem if major

3. Fix implemented
   └─ Code: Branch `bugfix/PROJ-123-login-fix`
   └─ Commit: `fix: resolve login issue [PROJ-123]`

4. Verified and closed
   └─ Jira: Transition to Done
   └─ Confluence: Update known issues if documented
```

### Feature Development

```
1. Feature requested
   └─ Jira: Create story/epic

2. Design phase
   └─ Confluence: Create design doc
   └─ Jira: Link design doc to epic

3. Implementation
   └─ Jira: Break into sprint tasks
   └─ Code: Link commits to tasks

4. Documentation
   └─ Confluence: API docs, user guide
   └─ Jira: Link documentation

5. Release
   └─ Jira: Set fixVersion
   └─ Confluence: Release notes
```

### Quick Task to Formal Project

```
1. Start simple
   └─ Trello: Create card for quick task

2. Scope grows
   └─ Trello: Add checklist, realize complexity

3. Escalate
   └─ Jira: Create formal issue
   └─ Trello: Archive with link to Jira

4. Plan properly
   └─ Jira: Add to sprint, estimate
   └─ Confluence: Create requirements doc if needed
```

## Integration Tips

### Naming Conventions

Use consistent naming across tools:
- **Trello lists**: "To Do", "In Progress", "Done"
- **Jira statuses**: Map to Trello columns
- **Confluence spaces**: Match project keys

### Labels and Tags

Consistent labeling helps cross-tool queries:
- `type:bug`, `type:feature`, `type:tech-debt`
- `priority:high`, `priority:low`
- `team:frontend`, `team:backend`

### Automation Opportunities

Common automation patterns:
- Jira issue closed → Update Trello card
- PR merged → Transition Jira issue
- Release created → Generate Confluence notes

## How I'll Help

When orchestrating cross-tool workflows, I will:

1. **Recommend tools**: Suggest best tool for the task
2. **Create linked items**: Set up proper cross-references
3. **Coordinate updates**: Keep items in sync
4. **Generate documentation**: Create docs from issues
5. **Track releases**: Coordinate across all systems

## Example Interactions

**You**: "I have a Trello card that's gotten complex. Should I move it to Jira?"

**Me**: "Let me check the card details.

[Uses `/trello get <card-id>`]

This card has:
- 8 checklist items
- Multiple comments with requirements
- Dependencies mentioned

**Recommendation**: Yes, escalate to Jira because:
- Needs subtasks for checklist items
- Would benefit from sprint tracking
- Dependencies need formal linking

I can:
1. Create a Jira story with this content
2. Link the card to the new issue
3. Archive the Trello card

Proceed?"

---

**You**: "We're releasing v2.0. What do I need to update?"

**Me**: "I'll coordinate the v2.0 release across tools.

**Checklist**:

1. **Jira**
   - [ ] All issues in fixVersion='2.0.0' are Done
   - [ ] Mark version as released
   [Uses `/jira-search fixVersion = "2.0.0"`]

2. **Confluence**
   - [ ] Release notes generated
   - [ ] API docs updated for changes
   - [ ] Upgrade guide created (breaking changes)
   [Uses Release Notes Generator skill]

3. **Trello** (if roadmap board exists)
   - [ ] Move '2.0 Release' card to Done
   - [ ] Create card for next milestone

Found 23 issues in v2.0.0. Ready to generate release notes?"
