# Seamless Workflow Integration

This guide shows how to make the Jira and Confluence plugins a **seamless part of your development workflow** using agents and hooks.

## Table of Contents

- [Quick Start](#quick-start)
- [Using Agents](#using-agents)
- [Setting Up Hooks](#setting-up-hooks)
- [Workflow Examples](#workflow-examples)
- [Best Practices](#best-practices)

---

## Quick Start

The plugins work in three modes:

1. **Manual** - Use slash commands when you need them
2. **Agent-Assisted** - AI proactively suggests Jira/Confluence actions
3. **Automated** - Hooks trigger reminders based on your actions

### Manual Mode (Default)

Just use the commands when you need them:
```
/jira-my-issues
/confluence-search-pages --space-id 123456
```

This works immediately - no setup required!

### Agent Mode (Recommended)

Agents make Claude Code **proactively aware** of Jira and Confluence:

**Jira Assistant** - Tracks your work and suggests creating/updating issues
**Documentation Assistant** - Reminds you to update docs when code changes

Enable by adding to `.claude/settings.json`:
```json
{
  "enabledPlugins": ["jira", "confluence"]
}
```

The agents are **automatically available** once the plugins are installed!

### Automated Mode (Advanced)

Hooks trigger automatic prompts based on your actions. See [Setting Up Hooks](#setting-up-hooks) below.

---

## Using Agents

### Jira Assistant

The Jira Assistant helps you:
- Create issues for new work
- Update status as you progress
- Link code changes to issues
- Keep Jira in sync with reality

**Example interaction:**

```
You: [Write new authentication code]

Claude (Jira Assistant): "I see you've implemented new authentication logic.
Would you like me to:
1. Create a Jira issue to track this feature?
2. Update an existing authentication issue?
3. Search for related issues?"

You: "Create a new issue"

Claude: [Uses /jira-create to create PROJ-789]
"Created PROJ-789: Implement OAuth authentication
Would you like me to add the issue key to your next git commit message?"
```

### Documentation Assistant

The Documentation Assistant helps you:
- Create docs for new features
- Update docs when code changes
- Keep Confluence current
- Maintain documentation quality

**Example interaction:**

```
You: [Add new API endpoint /api/v2/users]

Claude (Doc Assistant): "New API endpoint detected!
I can create Confluence documentation with:
- Endpoint details: POST /api/v2/users
- Parameters from your code
- Example request/response
- Error codes

Should I create this page in your API documentation space?"

You: "Yes, space ID 123456"

Claude: [Uses /confluence-create-page to document the API]
"Created page: 'User API Documentation'
Link: https://your-domain.atlassian.net/wiki/spaces/123456/pages/..."
```

### Invoking Agents Manually

You can also explicitly ask agents for help:

```
You: "@jira-assistant what issues am I working on?"
Claude: [Uses /jira-my-issues and provides context]

You: "@documentation-assistant update the auth docs"
Claude: [Searches for auth documentation and offers to update]
```

---

## Setting Up Hooks

Hooks make the workflow **fully automated** by triggering prompts based on your actions.

### Example: Auto-remind about Jira after git commits

Add to `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "description": "Remind about Jira after git commits",
        "matcher": "Bash.*git commit",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Git commit created! Consider:\n- Adding Jira issue key to commit (e.g., 'PROJ-123: Fix bug')\n- Updating issue status\n- Adding progress comment\n\nWould you like me to help?"
          }
        ]
      }
    ]
  }
}
```

### Example: Auto-suggest docs after API changes

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "description": "Suggest documentation for new API files",
        "matcher": "Write.*api/.*\\.js",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "New API file detected! Should I:\n1. Create Confluence API documentation?\n2. Update existing API docs?\n3. Add to API index page?"
          }
        ]
      }
    ]
  }
}
```

### Pre-made Hook Templates

Both plugins include `hooks.example.json` files with ready-to-use hooks:

**Copy Jira hooks:**
```bash
# See jira-plugin/.claude-plugin/hooks.example.json
```

**Copy Confluence hooks:**
```bash
# See confluence-plugin/.claude-plugin/hooks.example.json
```

---

## Workflow Examples

### Example 1: Feature Development Workflow

**Scenario:** Building a new user profile feature

```
1. Start Work
   You: "I'm going to add user profile pictures"
   Agent: "Let me check for related Jira issues..."
   Agent: [Uses /jira-search]
   Agent: "No existing issues found. Should I create one?"
   You: "Yes"
   Agent: [Uses /jira-create → Creates PROJ-456]

2. During Development
   You: [Write code for profile picture upload]
   Hook: "Code changes detected. Update PROJ-456?"
   Agent: [Uses /jira-comment to add progress note]

3. Write Tests
   You: [Add tests for profile pictures]
   Agent: "Tests added! Should I update the issue?"
   Agent: [Uses /jira-update to change status to "In Review"]

4. Document
   You: [Complete implementation]
   Agent: "Feature complete! Let me help with documentation..."
   Agent: "Should I create a Confluence page explaining the new profile feature?"
   You: "Yes"
   Agent: [Uses /confluence-create-page]

5. Complete
   You: "It's done and deployed"
   Agent: [Uses /jira-transition PROJ-456 "Done"]
   Agent: "PROJ-456 marked as Done. Great work!"
```

### Example 2: Bug Fix Workflow

**Scenario:** User reports login broken with special characters

```
1. Identify Bug
   You: "Users can't login with email addresses containing +"
   Agent: "Shall I create a bug ticket?"
   You: "Yes, high priority"
   Agent: [Uses /jira-create with type=Bug, priority=High]
   Agent: "Created PROJ-789: Login fails with special characters"

2. Debug
   You: [Investigate and find the issue in validation code]
   Agent: "Want me to add your findings to PROJ-789?"
   Agent: [Uses /jira-comment with technical details]

3. Fix
   You: [Fix the validation regex]
   Hook: "Code changes in auth/validation.js detected"
   Agent: "This looks like the fix for PROJ-789. Update the issue?"
   Agent: [Uses /jira-update to add fix details]

4. Test
   You: [Add regression tests]
   Agent: "Tests added! Transition PROJ-789 to 'In Review'?"
   Agent: [Uses /jira-transition]

5. Document
   Agent: "Should I update the troubleshooting guide in Confluence?"
   Agent: [Uses /confluence-search-pages to find guide]
   Agent: [Uses /confluence-update-page to add fix]

6. Close
   You: "Deployed to production"
   Agent: [Uses /jira-transition PROJ-789 "Done"]
```

### Example 3: Documentation Maintenance

**Scenario:** API endpoint changes

```
1. Change API
   You: [Modify /api/users endpoint to add pagination]
   Hook: "API file changed! Update documentation?"

2. Find Existing Docs
   Agent: "Let me find the API documentation..."
   Agent: [Uses /confluence-search-pages --title "User API"]
   Agent: "Found existing page ID 987654"

3. Update Docs
   Agent: [Uses /confluence-get-page to retrieve current content]
   Agent: "Current docs don't mention pagination. Should I update?"
   You: "Yes"
   Agent: [Uses /confluence-update-page with pagination details]

4. Track in Jira
   Agent: "Should I add a comment to your current issue about the docs update?"
   Agent: [Uses /jira-comment to note documentation updated]
```

---

## Best Practices

### 1. Use Context Variables

Set these in `.claude/settings.json` for better defaults:

```json
{
  "env": {
    "JIRA_HOST": "your-domain.atlassian.net",
    "JIRA_EMAIL": "your@email.com",
    "JIRA_API_TOKEN": "your-token",
    "JIRA_DEFAULT_PROJECT": "PROJ",

    "CONFLUENCE_HOST": "your-domain.atlassian.net",
    "CONFLUENCE_EMAIL": "your@email.com",
    "CONFLUENCE_API_TOKEN": "your-token",
    "CONFLUENCE_DEFAULT_SPACE": "123456"
  }
}
```

### 2. Start with Agents, Add Hooks Later

**Recommended progression:**
1. Week 1: Use manual commands to learn
2. Week 2: Enable agents for suggestions
3. Week 3+: Add hooks for specific automation

### 3. Use Issue Keys in Commit Messages

Format: `PROJ-123: Your commit message`

Benefits:
- Easy traceability
- Jira can auto-link commits
- Agents can detect which issue you're working on

### 4. Maintain Documentation Structure

Keep Confluence organized:
```
Your Space/
├── API Documentation/
│   ├── User API
│   ├── Payment API
│   └── Admin API
├── Architecture/
│   ├── System Design
│   └── Data Models
└── Guides/
    ├── Setup Guide
    └── Deployment Guide
```

### 5. Regular Documentation Reviews

Ask the Documentation Assistant weekly:
```
You: "What documentation is outdated?"
Agent: [Uses /confluence-search-pages to find old pages]
Agent: [Compares with recent code changes]
Agent: "These pages haven't been updated in 6 months..."
```

---

## Combining Both Plugins

The real power comes from using both together:

### Feature Development Flow

```
START: Feature idea
  ↓
1. Jira: Create feature issue
  ↓
2. Develop: Write code
  ↓
3. Jira: Update issue with progress
  ↓
4. Test: Add tests
  ↓
5. Confluence: Create feature documentation
  ↓
6. Jira: Link documentation to issue
  ↓
7. Deploy: Ship to production
  ↓
8. Jira: Mark issue as Done
  ↓
9. Confluence: Update release notes
END
```

### The agents help with EVERY step automatically!

---

## Troubleshooting

**Q: Agents not suggesting actions?**
- Ensure plugins are installed: `/plugin list`
- Check agents are enabled in the plugin
- Agents work best with code context - try making code changes

**Q: Hooks not firing?**
- Verify hooks are in `.claude/settings.json`
- Check the matcher pattern is correct
- Restart Claude Code after adding hooks

**Q: Too many prompts?**
- Tune hook matchers to be more specific
- Remove hooks you don't find useful
- Use agents without hooks for lighter integration

---

## Summary

Three ways to integrate:

1. **Commands Only** - Manual, full control, works immediately
2. **+ Agents** - Proactive suggestions, context-aware, recommended
3. **+ Hooks** - Automated reminders, maximum integration

**Start simple, add automation as you find your rhythm!**
