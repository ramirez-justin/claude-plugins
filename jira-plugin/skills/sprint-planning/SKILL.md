---
name: Sprint Planning Assistant
description: Assist with sprint planning, backlog grooming, and story point estimation. Use when planning sprints, estimating work, organizing backlog, or when user mentions sprint planning or story points.
allowed-tools: Bash
---

# Sprint Planning Assistant

Expert assistance for planning sprints, estimating work, and managing team capacity.

## When to Use This Skill

- Planning a new sprint
- Grooming/refining the backlog
- Estimating story points
- User mentions: sprint, estimation, story points, planning

**For advanced velocity/capacity analysis**: See the Advanced Capacity Analysis skill.

## Sprint Planning Process

### 1. Pre-Planning

**Review previous sprint**:
```jql
sprint = "Sprint 42" ORDER BY updated DESC
```

Analyze: What completed? What carried over? What was velocity?

**Check backlog health**:
```jql
project = PROJ AND sprint IS EMPTY AND status = "To Do" ORDER BY priority DESC
```

Verify stories have descriptions, acceptance criteria, and estimates.

### 2. Set Sprint Goal

Define a clear, valuable objective:
- "Complete user authentication system"
- "Improve page load performance by 50%"
- "Launch payment integration MVP"

### 3. Calculate Capacity

**Quick formula**:
```
Capacity = Historical Velocity - (PTO adjustments) - (10% buffer)
```

**Example**: Velocity 40 pts, 1 person out 2 days → ~35 pts capacity

### 4. Select Stories

**Criteria**:
1. Aligns with sprint goal
2. Has acceptance criteria
3. No blocking dependencies
4. Fits within capacity

**Query for candidates**:
```jql
project = PROJ AND status = "To Do" AND sprint IS EMPTY
AND "Story Points" IS NOT EMPTY
ORDER BY priority DESC, rank ASC
```

### 5. Review and Commit

- Total points within capacity?
- Dependencies manageable?
- Team agreement on scope?

## Story Point Estimation

### What Are Story Points?

Measure **relative effort/complexity**, not time:
- **Effort**: How much work?
- **Complexity**: How hard?
- **Uncertainty**: How much unknown?

### Fibonacci Scale (Recommended)

| Points | Meaning | Example |
|--------|---------|---------|
| 1 | Trivial | Config change, typo fix |
| 2 | Easy | Small, well-understood change |
| 3 | Moderate | Standard feature, clear path |
| 5 | Average | Typical feature, some complexity |
| 8 | Complex | Multiple components, higher uncertainty |
| 13 | Very Complex | Large feature, should consider splitting |
| 21 | Epic | Too large - must split |

### Estimation Techniques

**Planning Poker**:
1. PO explains story → Team asks questions
2. Everyone picks estimate secretly
3. Reveal simultaneously → Discuss differences
4. Re-estimate until consensus

**Reference Stories**: Compare to completed work
- "Similar to login feature (5 pts)"
- "Simpler than payment integration (8 pts)"

### Factors Affecting Estimates

**Increase for**: New technology, unclear requirements, many integrations, high risk

**Lower for**: Familiar code, clear requirements, self-contained changes

## Backlog Grooming

### Grooming Activities

1. **Refinement**: Clarify requirements, add acceptance criteria, identify dependencies
2. **Estimation**: Add/validate story points
3. **Prioritization**: Order by business value
4. **Cleanup**: Close duplicates, archive obsolete issues

### Story Readiness Checklist

- [ ] Clear title and description
- [ ] Acceptance criteria defined
- [ ] Story points estimated
- [ ] Priority set
- [ ] Dependencies identified
- [ ] Sprint ready

## Useful Queries

**Stories ready for sprint**:
```jql
project = PROJ AND type = Story AND status = "To Do"
AND sprint IS EMPTY AND "Story Points" IS NOT EMPTY
ORDER BY priority DESC
```

**Current sprint progress**:
```jql
sprint in openSprints() ORDER BY status ASC, priority DESC
```

**Unestimated stories**:
```jql
project = PROJ AND "Story Points" IS EMPTY AND status != Done
ORDER BY priority DESC
```

## How I'll Help

When you need sprint planning assistance, I will:

1. **Analyze backlog**: Review stories and readiness
2. **Calculate capacity**: Based on team size and velocity
3. **Suggest stories**: Prioritized candidates for the sprint
4. **Help estimate**: Guide story point discussions
5. **Identify risks**: Dependencies, blockers, unknowns

## Example Interaction

**You**: "Help me plan Sprint 45. Team of 5, velocity around 35 points"

**Me**: "I'll help plan Sprint 45.

**Capacity**: ~30-32 points (with 10% buffer)

Let me search for ready stories:
[Uses `/jira-search`]

**Recommended Sprint Backlog** (31 points):
1. PROJ-501: Payment gateway (13 pts) - HIGH
2. PROJ-502: Transaction history (8 pts)
3. PROJ-503: Receipt templates (5 pts)
4. PROJ-504: Error handling (5 pts)

**Sprint Goal**: Complete basic payment flow

**Stretch Goals**:
- PROJ-505: Refund functionality (8 pts)

Should I adjust the selection?"
