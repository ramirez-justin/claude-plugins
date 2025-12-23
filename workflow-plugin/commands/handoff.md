---
description: Resume work by consuming the handoff context file from a previous agent session
---

# Handoff - Resume Agent Context

You are resuming work from a previous agent session. This command reads the handoff document created by `/sunset`, internalizes the context, and then removes the file.

## Instructions

1. **Check for Handoff File** - Look for `.claude-handoff.md` in the current working directory.

2. **If File Exists**:
   - Read the entire handoff document using the Read tool
   - Internalize all the context: original task, completed work, remaining work, decisions, and recommendations
   - Delete the `.claude-handoff.md` file using Bash (`rm .claude-handoff.md`)
   - Summarize the handoff to the user, including:
     - What the original task was
     - What was already completed
     - What remains to be done
     - Any blockers or concerns
   - Ask if they'd like you to continue with the recommended next steps

3. **If File Does Not Exist**:
   - Inform the user that no handoff file was found
   - Suggest they may need to run `/sunset` in their previous session first, or check if they're in the correct directory

## Example Usage - File Exists

User: `/handoff`

Response: "Found handoff document from previous session. Reading context...

**Previous Session Summary:**

**Original Task:** [task description]

**Completed:**
- [completed item 1]
- [completed item 2]

**Remaining Work:**
- [ ] [remaining task 1]
- [ ] [remaining task 2]

**Key Context:**
- [important context point]

**Recommended Next Steps:**
1. [step 1]
2. [step 2]

Handoff file consumed and removed. Would you like me to continue with the recommended next steps?"

## Example Usage - File Not Found

User: `/handoff`

Response: "No handoff file found at `.claude-handoff.md` in the current directory.

This could mean:
- The previous session didn't run `/sunset`
- You're in a different directory than where the handoff was created
- The handoff file was already consumed

Would you like me to help you get started fresh, or check a different location?"
