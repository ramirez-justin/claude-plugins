---
description: Prepare agent handoff by creating a comprehensive context file and compacting the session
---

# Sunset - Agent Handoff Preparation

You are preparing to hand off your current work context to a new agent session. This command creates a comprehensive handoff document that preserves all critical context, then compacts the current session.

## Instructions

1. **Gather Context** - Before creating the handoff file, review the conversation to understand:
   - What task(s) the user originally requested
   - What work has been completed
   - What work remains to be done
   - Any important decisions made and their rationale
   - Any blockers, issues, or concerns encountered
   - Relevant file paths and code locations
   - Any user preferences or constraints mentioned

2. **Create the Handoff File** - Write a `.claude-handoff.md` file in the current working directory with the following structure:

```markdown
# Agent Handoff Document

> Generated: [current date/time]
> Previous Session Context Transfer

## Original Task
[Describe what the user originally asked for]

## Completed Work
[List what has been accomplished with specific details]
- [Item 1 with file paths if applicable]
- [Item 2 with file paths if applicable]
...

## Remaining Work
[List what still needs to be done]
- [ ] [Task 1]
- [ ] [Task 2]
...

## Key Decisions Made
[Document important decisions and their rationale]
- **[Decision]**: [Rationale]
...

## Important Context
[Any critical information the new agent needs to know]
- File structure insights
- Dependencies or relationships discovered
- User preferences mentioned
- Constraints or requirements

## Current State
[Describe the current state of the codebase/project relevant to the task]

## Files Modified
[List files that were created or modified during this session]
- `path/to/file1` - [what was done]
- `path/to/file2` - [what was done]
...

## Blockers or Concerns
[Any issues the new agent should be aware of]

## Recommended Next Steps
[Specific actionable steps for the new agent to take]
1. [Step 1]
2. [Step 2]
...
```

3. **Write the File** - Use the Write tool to create `.claude-handoff.md` in the current working directory.

4. **Confirm and Compact** - After writing the file:
   - Confirm to the user that the handoff file has been created
   - Tell them to run `/handoff` in their new session to consume the context
   - Use `/compact` to compact the current session (this frees up context for the user's next session)

## Example Usage

User: `/sunset`

Response: "I'll prepare a handoff document capturing our current session context.

[Creates comprehensive .claude-handoff.md file]

Handoff document created at `.claude-handoff.md`. This captures:
- The original task and requirements
- Work completed so far
- Remaining tasks
- Key decisions and their rationale
- Important context for continuity

To continue in a new session, run `/handoff` to consume this context.

Now compacting this session..."

[Runs /compact]
