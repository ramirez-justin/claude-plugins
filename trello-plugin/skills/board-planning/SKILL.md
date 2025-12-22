---
name: Scrumban Board Planning
description: Help with sprint planning, backlog grooming, and board organization using Scrumban methodology. Use for prioritization, WIP management, and workflow optimization.
allowed-tools: Read, Grep, Bash
---

# Scrumban Board Planning

Expert assistance for managing your Trello board using Scrumban methodology - combining the best of Scrum and Kanban.

## When to Use This Skill

- Planning what to work on next
- Grooming the backlog
- Managing work-in-progress limits
- Optimizing board workflow
- Sprint/iteration planning
- Prioritization decisions
- Identifying bottlenecks

## Understanding Scrumban

Scrumban combines:
- **Kanban**: Visual workflow, WIP limits, continuous flow
- **Scrum**: Iterations, planning, prioritization

### Key Principles

1. **Visualize Work**: Everything on the board
2. **Limit WIP**: Don't start too much at once
3. **Pull System**: Pull new work when capacity allows
4. **Continuous Improvement**: Regular retrospectives

## Board Structure

### Recommended Columns (Right to Left)

```
Done | Blocked | In-Progress | Next Up | Backlog
```

Why right-to-left? Work flows from Backlog → Done, and Done should be most visible as a motivator.

### Column Purposes

**Backlog**
- All potential work items
- Not yet prioritized
- Can be large
- Regular grooming needed

**Next Up**
- Prioritized work ready to start
- Clear requirements
- Small enough to complete in days
- Replenished from Backlog

**In-Progress**
- Currently being worked on
- WIP Limit: 2-3 per person
- Oldest items should be finished first

**Blocked**
- Work that cannot proceed
- Always has a comment explaining why
- Daily check to unblock
- Goal: Empty this column

**Done**
- Completed work
- Archive weekly/monthly
- Celebrate accomplishments!

## WIP Limits

### Why Limit Work In Progress?

- Focus on finishing over starting
- Reduce context switching
- Identify bottlenecks faster
- Improve flow and throughput
- Better predictability

### Recommended Limits

| Team Size | In-Progress Limit |
|-----------|-------------------|
| 1 person  | 2-3 cards         |
| 2 people  | 3-4 cards         |
| 3 people  | 4-6 cards         |
| 5 people  | 6-8 cards         |

### When to Break WIP Limits

- Emergency/critical bugs
- Blocked item becomes unblocked
- Never for "just starting something new"

## Planning Cadence

### Daily (5 min)
```
1. Check Blocked column - any items to unblock?
2. Check In-Progress - any items close to done?
3. Pull from Next Up if capacity allows
4. Quick standup questions:
   - What did I finish?
   - What am I working on?
   - Any blockers?
```

### Weekly (30 min)
```
1. Review Done column - archive completed items
2. Celebrate wins!
3. Groom Backlog:
   - Remove outdated items
   - Break down large items
   - Add new items
4. Prioritize Next Up:
   - Ensure 5-10 items ready
   - Order by priority
5. Check metrics:
   - Items completed
   - Average time in each column
   - Blocked time
```

### Monthly (1 hour)
```
1. Retrospective:
   - What went well?
   - What could improve?
   - Action items
2. Process improvements:
   - Adjust WIP limits
   - Update column definitions
   - Add/remove columns
3. Long-term planning:
   - Major features coming up
   - Technical debt to address
   - Learning goals
```

## Prioritization Framework

### MoSCoW Method

**Must Have** (Critical)
- System doesn't work without it
- Deadline-driven requirements
- Security/compliance issues
→ Move to Next Up immediately

**Should Have** (Important)
- Significantly improves experience
- Expected by users
- Has workaround but painful
→ High priority in Next Up

**Could Have** (Nice to Have)
- Enhances experience
- Not critical to function
- Can wait for capacity
→ Lower priority in Next Up

**Won't Have** (Not Now)
- Out of scope for now
- Nice idea for later
- Low impact
→ Keep in Backlog or archive

### Weighted Shortest Job First (WSJF)

For each item, score:
- **Business Value**: 1-10
- **Time Criticality**: 1-10
- **Risk Reduction**: 1-10
- **Job Size**: 1-10

Formula: `(BV + TC + RR) / Size = Priority Score`

Higher score = Higher priority

## Handling Common Scenarios

### Too Many Items In Progress

```
Problem: WIP limit exceeded, nothing getting done

Solution:
1. STOP starting new work
2. Focus on finishing oldest items
3. Help teammates complete their work
4. Don't pull from Next Up until under limit

Prevention:
- Enforce WIP limits strictly
- Make "finishing" the priority
- Daily check on In-Progress count
```

### Blocked Items Piling Up

```
Problem: Blocked column growing, work stuck

Solution:
1. Daily review of blocked items
2. Escalate blockers immediately
3. Can we work around it temporarily?
4. Is there dependency we can remove?

Prevention:
- Identify dependencies before starting
- Have backup work ready
- Regular communication with dependencies
```

### Backlog Growing Too Large

```
Problem: Backlog has 100+ items, overwhelming

Solution:
1. Archive items older than 3 months
2. Combine similar items
3. Delete "nice to have" that won't happen
4. Set maximum backlog size (e.g., 50 items)

Prevention:
- Monthly backlog grooming
- Say "no" to low-priority items
- Time-box backlog review
```

### Nothing In Next Up

```
Problem: Finished work, nothing ready to start

Solution:
1. Pull from Backlog immediately
2. Quick prioritization session
3. Pick highest-impact items
4. Ensure they're ready to work on

Prevention:
- Keep 5-10 items in Next Up
- Weekly refill from Backlog
- Flag items that need clarification
```

## Breaking Down Work

### Signs a Card is Too Big

- Description longer than screen
- More than 10 checklist items
- Estimate of more than 3 days
- Multiple unrelated concerns
- "And" in the title

### How to Break Down

**By Feature Area**
```
"User authentication" becomes:
- Login page UI
- Password validation
- OAuth integration
- Password reset flow
- Session management
```

**By User Story**
```
"Admin dashboard" becomes:
- Admin can view user list
- Admin can edit user details
- Admin can deactivate users
- Admin can view analytics
```

**By Technical Layer**
```
"API for orders" becomes:
- Database schema for orders
- Order service logic
- REST API endpoints
- API documentation
- Integration tests
```

**By Iteration**
```
"Search functionality" becomes:
- v1: Basic text search
- v2: Filters and sorting
- v3: Advanced search syntax
- v4: Search suggestions
```

## Metrics to Track

### Lead Time
Time from card creation to Done

**Good**: Days
**Warning**: Weeks
**Problem**: Months

### Cycle Time
Time from In-Progress to Done

**Goal**: Minimize this
**Track**: Weekly average

### Throughput
Cards completed per week

**Track**: Trend over time
**Goal**: Steady or increasing

### WIP Age
How long items sit In-Progress

**Warning**: Items older than 3 days
**Action**: Focus on finishing or move to Blocked

## How I'll Help

When planning your board, I will:

1. **Review current state**:
   - Check all columns
   - Identify bottlenecks
   - Count WIP

2. **Suggest actions**:
   - Items to prioritize
   - Cards to break down
   - Blocked items to address

3. **Facilitate planning**:
   - Help prioritize backlog
   - Suggest what to pull into Next Up
   - Recommend WIP adjustments

4. **Track progress**:
   - Summarize completed work
   - Identify patterns
   - Suggest improvements

## Example Planning Session

**You**: "Help me plan what to work on this week"

**Me**: "Let me review your board first..."

```
/trello-lists --with-cards
```

"Here's your current board state:

**In-Progress (3 cards)** - At WIP limit
- 'Fix login bug' (3 days old) - almost done?
- 'Add user avatars' (1 day old)
- 'API documentation' (5 days old) - stuck?

**Blocked (1 card)**
- 'Payment integration' - waiting on Stripe approval

**Next Up (4 cards)**
- 'Dark mode toggle'
- 'Performance optimization'
- 'Email notifications'
- 'User preferences'

**Backlog (12 cards)**
- Various items...

**Recommendations:**

1. **Finish first**: The API documentation has been in progress for 5 days. Let's either finish it or identify what's blocking it.

2. **Check the blocker**: Payment integration has been blocked. Is there an update on Stripe approval?

3. **This week's focus**: After finishing current work, I'd suggest:
   - Dark mode toggle (small, quick win)
   - Performance optimization (high impact)

4. **Backlog grooming needed**: You have 12 items in backlog. Want me to help prioritize?

What would you like to focus on?"
