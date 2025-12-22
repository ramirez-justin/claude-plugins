---
name: Structured Card Creation
description: Create well-structured Trello cards from code changes, conversations, or requirements. Use when creating cards, bugs, features, or tasks. Analyzes context to generate clear titles, descriptions, checklists, and appropriate placement in the Scrumban workflow.
allowed-tools: Read, Grep, Bash
---

# Structured Card Creation

Expert assistance for creating well-structured, comprehensive Trello cards from any context.

## When to Use This Skill

- User wants to create a Trello card
- User mentions tracking work, bugs, features, or tasks
- After implementing code that should be tracked
- When discussing a problem that should be documented
- User asks to "add to the board" or "create a card"

## Card Types and When to Use Them

### Bug
**When to use**: Something is broken or not working as expected

**Card structure**:
- Title: Clear, specific description of the bug
- Description: Steps to reproduce, expected vs actual behavior
- Checklist: Verification steps
- List: Usually **Backlog** or **Next Up** based on severity

**Example**:
```
Title: Login fails when email contains + character

Description:
## Problem
Users cannot log in if their email contains a + character.

## Steps to Reproduce
1. Go to login page
2. Enter email with + (e.g., user+test@example.com)
3. Enter valid password
4. Click submit

## Expected
User logs in successfully

## Actual
Error: "Invalid email format"

## Impact
Affects users with email aliases (common in tech)

Checklist:
[ ] Fix email validation regex
[ ] Add unit test for + in emails
[ ] Test with various email formats
[ ] Verify in staging
```

### Feature
**When to use**: New functionality or capability

**Card structure**:
- Title: Action-oriented description
- Description: User story, requirements, acceptance criteria
- Checklist: Implementation steps
- List: Usually **Backlog**, moved to **Next Up** when prioritized

**Example**:
```
Title: Add dark mode toggle to settings

Description:
## User Story
As a user, I want to toggle dark mode so that I can reduce eye strain at night.

## Requirements
- Toggle in settings page
- Persists across sessions
- Smooth transition animation
- Respects system preference as default

## Acceptance Criteria
- [ ] Toggle visible in settings
- [ ] Theme changes immediately
- [ ] Preference saved to localStorage
- [ ] Respects prefers-color-scheme
- [ ] All components support both themes

Checklist:
[ ] Create theme context
[ ] Add toggle component
[ ] Update CSS variables
[ ] Test all components
[ ] Add to settings page
```

### Task
**When to use**: Technical work, refactoring, maintenance

**Card structure**:
- Title: What needs to be done
- Description: Why and how
- Checklist: Sub-tasks
- List: **Backlog** or appropriate priority list

**Example**:
```
Title: Refactor authentication module for testability

Description:
## Objective
Make the auth module easier to test by extracting dependencies.

## Approach
1. Extract HTTP client as dependency
2. Create interfaces for external services
3. Add dependency injection
4. Update tests to use mocks

## Benefits
- Faster tests (no network calls)
- Easier to test edge cases
- Better separation of concerns

Checklist:
[ ] Extract HTTP client interface
[ ] Update AuthService constructor
[ ] Create mock implementations
[ ] Update existing tests
[ ] Add new edge case tests
```

## Scrumban List Selection Guide

### Backlog
- New ideas and future work
- Items not yet prioritized
- Low-urgency bugs
- "Nice to have" features

### Next Up
- Prioritized work ready to start
- Items with all requirements clear
- Work that should happen soon
- High-priority bugs

### In-Progress
- Currently being worked on
- Limit: 2-3 items per person (WIP limit)
- Move here when starting work

### Blocked
- Work that cannot proceed
- Waiting on external dependencies
- Needs decision or clarification
- Always add comment explaining blocker

### Done
- Completed work
- Verified and tested
- Ready for archive if old

## Creating Cards from Code Context

When creating a card based on code I've written or changes I've detected:

1. **Analyze the change**:
   - What was added/modified?
   - What problem does it solve?
   - What testing is needed?

2. **Determine card type**:
   - Bug fix? → Bug card
   - New feature? → Feature card
   - Refactoring? → Task card

3. **Extract details**:
   - Use file names for context
   - Include relevant code snippets
   - Reference related files

4. **Generate structured content**:
   - Clear, descriptive title (< 60 characters)
   - Complete description with context
   - Appropriate checklist items

## Title Best Practices

### Good Titles
- "Fix login failure with special characters in email"
- "Add user profile picture upload"
- "Refactor database queries for performance"
- "Update API documentation for v2 endpoints"

### Bad Titles
- "Bug fix" (too vague)
- "Work on feature" (not specific)
- "Fix the thing" (unclear)
- "Authentication stuff" (not actionable)

## Checklist Best Practices

### Implementation Checklist
```
[ ] Implement core functionality
[ ] Add unit tests
[ ] Add integration tests
[ ] Update documentation
[ ] Code review
[ ] Test in staging
```

### Bug Fix Checklist
```
[ ] Reproduce the bug
[ ] Identify root cause
[ ] Implement fix
[ ] Add regression test
[ ] Verify fix works
[ ] Check for similar issues
```

### Review Checklist
```
[ ] Code follows style guide
[ ] Tests pass
[ ] No security vulnerabilities
[ ] Performance is acceptable
[ ] Documentation updated
```

## Description Templates

### Bug Description
```markdown
## Problem
[Brief description of what's broken]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- Browser: [if applicable]
- OS: [if applicable]
- Version: [app version]

## Screenshots/Logs
[If available]

## Possible Fix
[If you have ideas]
```

### Feature Description
```markdown
## User Story
As a [user type]
I want [goal]
So that [benefit]

## Requirements
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

## Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

## Technical Notes
[Any implementation considerations]

## Out of Scope
[What we're NOT doing]
```

### Task Description
```markdown
## Objective
[What needs to be accomplished]

## Context
[Why this work is needed]

## Approach
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Definition of Done
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]
```

## How I'll Help

When you need to create a card, I will:

1. **Gather context**: Understand what you want to track
2. **Determine type**: Bug, Feature, or Task
3. **Choose list**: Based on priority and workflow
4. **Structure content**: Use appropriate template
5. **Create checklist**: Break down into actionable items
6. **Show preview**: Let you review before creating
7. **Create card**: Use `/trello-create` command
8. **Follow up**: Suggest adding to sprint or assigning

## Example Interaction

**You**: "The authentication module I just wrote should be tracked"

**Me**: "I'll create a feature card for this. Let me analyze what you built...

**Proposed Card:**

**Title**: Implement OAuth 2.0 authentication system

**List**: Next Up (ready to work on) or In-Progress (if you're working now)

**Description**:
## User Story
As a user, I want to login with OAuth providers so I don't need another password.

## Implementation Details
Files modified:
- `src/auth/oauth.js` - OAuth client integration
- `src/components/login.js` - OAuth login buttons
- `src/config/auth.js` - Provider configuration

## Technical Notes
- Using PKCE flow for security
- Tokens stored in httpOnly cookies
- Refresh logic implemented

**Checklist**:
- [x] Google OAuth integration
- [x] GitHub OAuth integration
- [ ] Apple OAuth integration
- [ ] Documentation
- [ ] Security review

Does this look good? Should I create it?"

**You**: "Yes, put it in In-Progress"

**Me**: [Uses `/trello-create`] "Created card in In-Progress. Would you like me to assign it to you or add any labels?"
