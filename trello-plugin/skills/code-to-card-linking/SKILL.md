---
name: Code-to-Card Linking
description: Link code changes, commits, and PRs to Trello cards. Keep cards updated based on development activity. Track code references and maintain traceability between code and tasks.
allowed-tools: Read, Grep, Bash
---

# Code-to-Card Linking

Expert assistance for maintaining traceability between your code and Trello cards.

## When to Use This Skill

- Linking commits to Trello cards
- Updating cards based on code changes
- Finding cards related to code
- Adding code references to cards
- Tracking which cards are affected by changes
- Creating cards from code context

## Linking Strategies

### 1. Card ID in Commit Messages

Include the Trello card short ID in commit messages:

```bash
git commit -m "Fix email validation regex [abc123]"
git commit -m "[abc123] Add unit tests for login"
git commit -m "Implement OAuth flow (closes abc123)"
```

**Patterns to detect:**
- `[cardId]` - Card reference
- `(closes cardId)` - Card should be moved to Done
- `(fixes cardId)` - Bug fix for card
- `#cardId` - Simple reference

### 2. Card URL in Commit Messages

For more explicit linking:

```bash
git commit -m "Add dark mode toggle

Implements the feature described in:
https://trello.com/c/abc123/dark-mode-toggle"
```

### 3. Branch Names with Card IDs

```bash
git checkout -b feature/abc123-dark-mode
git checkout -b fix/def456-login-bug
git checkout -b task/ghi789-refactor-auth
```

### 4. Code Comments

```javascript
// TODO: Complete this feature [trello:abc123]
// FIXME: This is a workaround for bug [trello:def456]
// See: https://trello.com/c/ghi789 for requirements
```

## Detecting Code-Card Relationships

### From Git History

```bash
# Find commits mentioning a card
git log --grep="abc123" --oneline

# Find commits in a branch
git log main..feature/abc123 --oneline

# Find recent commits
git log --since="1 week ago" --oneline
```

### From Code Comments

```bash
# Find TODO/FIXME with card references
grep -r "TODO.*trello" src/
grep -r "FIXME.*trello" src/
grep -r "trello.com/c/" src/
```

### From Branch Names

```bash
# Current branch
git branch --show-current

# Extract card ID from branch name
# feature/abc123-description -> abc123
```

## Updating Cards from Code

### After Commits

When I detect relevant commits, I can:

1. **Add comment with commit info**:
```
Commit: abc123f
Author: developer
Message: Fix email validation regex

Files changed:
- src/validation/email.js
- tests/validation.test.js
```

2. **Update checklist items**:
```
[x] Fix email validation (commit abc123f)
```

3. **Move card if appropriate**:
- Commit message says "closes" → Move to Done
- Commit message says "fixes" → Add comment, consider Done
- Work in progress → Keep in In-Progress

### After Pull Requests

When a PR is created or merged:

1. **Add PR link to card**:
```
PR #123: Fix email validation
https://github.com/user/repo/pull/123
Status: Open / Merged
```

2. **Update card status**:
- PR opened → Card stays In-Progress
- PR merged → Move to Done
- PR closed without merge → Add comment

### After Deployments

When code is deployed:

1. **Add deployment comment**:
```
Deployed to staging on 2024-01-15
Version: v1.2.3
```

2. **Update checklist**:
```
[x] Deployed to staging
[ ] Verified in staging
[ ] Deployed to production
```

## Finding Related Cards

### From File Changes

When you modify a file, I can:

1. Search for cards mentioning the file
2. Search for cards about the feature area
3. Check recent activity for related work

```
Modified: src/auth/login.js

Related cards found:
- "Fix login with special characters" (In-Progress)
- "Add OAuth login" (Next Up)
- "Improve login performance" (Backlog)
```

### From Error Messages

When you encounter an error:

1. Search for cards with similar errors
2. Check if there's already a bug card
3. Offer to create a new card if not found

```
Error: "Invalid email format"

Related cards:
- "Email validation is too strict" (Backlog)
No exact match found. Create a new card?
```

### From Function Names

When working on specific functionality:

```
Working on: validateEmail()

Related cards:
- "Email validation allows invalid formats" (Bug)
- "Add email format examples" (Backlog)
```

## Automation Patterns

### Pre-Commit Hook

Before committing, check for card references:

```bash
#!/bin/bash
# Check if commit message contains card reference
if ! grep -qE '\[([a-zA-Z0-9]+)\]|trello\.com/c/' "$1"; then
  echo "Warning: No Trello card reference in commit message"
  echo "Consider adding [cardId] to link this commit"
fi
```

### Post-Commit Actions

After committing, I can:

1. Ask if you want to update the linked card
2. Automatically add commit comment
3. Check if card should be moved

### PR Template

```markdown
## Description
[What this PR does]

## Trello Card
[Link to Trello card]

## Checklist
- [ ] Linked to Trello card
- [ ] Card updated with PR link
- [ ] Tests pass
```

## How I'll Help

### Detecting Relationships

I'll monitor for:
- Branch names with card patterns
- Commit messages with card references
- Code comments with Trello links
- File changes in areas with active cards

### Suggesting Updates

When you make changes, I'll ask:
- "Should I add this commit to the card?"
- "This looks like it completes the card. Move to Done?"
- "Should I add a progress comment?"

### Maintaining Links

I'll help:
- Add PR links to cards
- Update checklists from commits
- Track deployment status
- Keep card descriptions current

## Example Workflows

### Starting Work on a Card

```
You: "I'm going to work on the login bug"

Me: "I found the card 'Fix login with special characters' (abc123).
Let me:
1. Move it to In-Progress
2. Create a branch for you: fix/abc123-login-special-chars

git checkout -b fix/abc123-login-special-chars

Ready to start!"
```

### Making a Commit

```
You: [Makes code changes and commits]

git commit -m "Fix email regex to allow + character"

Me: "I noticed you're on branch fix/abc123-login-special-chars.
Should I:
1. Add a comment to card abc123 about this commit?
2. Check off the 'Fix email validation' checklist item?
3. The commit message doesn't reference the card - want me to amend it to include [abc123]?"
```

### Completing Work

```
You: "I've finished the login fix"

Me: "Let me wrap up the card:

1. Adding final commit comment with summary
2. Checking off remaining checklist items
3. Moving card to Done

Would you also like me to:
- Add a link to the PR once you create it?
- Archive the card?
- Create any follow-up cards?"
```

### Finding Related Cards

```
You: [Opens src/auth/password.js]

Me: "I see you're working on password.js. Related cards on the board:
- 'Add password strength indicator' (Next Up)
- 'Fix password reset timeout' (Blocked)

Are you working on one of these, or starting something new?"
```

## Card Comment Templates

### Commit Comment
```
Commit pushed

**Commit**: abc123f
**Branch**: fix/abc123-login-special-chars
**Files**:
- src/validation/email.js (+15, -3)
- tests/validation.test.js (+42)

**Message**: Fix email regex to allow + character
```

### PR Comment
```
Pull Request opened

**PR**: #123 - Fix login with special characters
**URL**: https://github.com/user/repo/pull/123
**Status**: Open, awaiting review
**Reviewers**: @teammate
```

### Deployment Comment
```
Deployed

**Environment**: Staging
**Version**: v1.2.3-beta.1
**Time**: 2024-01-15 14:30 UTC
**Commit**: abc123f

Ready for QA verification.
```

### Completion Comment
```
Card completed

**Summary**:
- Fixed email validation to accept + characters
- Added 5 new test cases
- Updated API documentation

**Commits**: 3 commits
**PR**: #123 (merged)
**Branch**: fix/abc123-login-special-chars (deleted)
```

## Best Practices

1. **Always reference cards** in commits and PRs
2. **Keep cards updated** with progress
3. **Link PRs** to cards before merging
4. **Add deployment info** for traceability
5. **Archive completed cards** periodically
6. **Use consistent patterns** for card references
7. **Document in code** where appropriate
