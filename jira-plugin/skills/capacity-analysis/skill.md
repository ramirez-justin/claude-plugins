---
name: Advanced Capacity Analysis
description: Deep-dive into team capacity calculations, velocity tracking, and sprint health analysis. Use when analyzing velocity trends, calculating detailed capacity adjustments, or diagnosing sprint anti-patterns.
allowed-tools: Bash
---

# Advanced Capacity Analysis

Advanced techniques for capacity planning, velocity analysis, and sprint health diagnostics.

## When to Use This Skill

- Detailed capacity calculations with multiple adjustments
- Analyzing velocity trends over time
- Diagnosing sprint health issues
- User mentions: velocity, capacity, burndown, trends

**For basic sprint planning**: See the Sprint Planning Assistant skill.

## Detailed Capacity Calculation

### Full Formula

```
Base Hours = Team Size × Sprint Days × Hours/Day
Actual = Base - (PTO + Meetings + Support Rotation + Buffer)
```

### Example Calculation

```
Team: 6 developers
Sprint: 10 work days
Work: 6 hours/day (accounting for meetings)
PTO: 1 person out 3 days
Training: 2 people × 2 days
On-call: 1 person at 80% capacity
Buffer: 10%

Base capacity: 45 points (historical velocity)

Adjustments:
- PTO: 3 days / 10 days × (1/6 team) = -7.5% → -3.4 pts
- Training: 4 person-days / 60 total = -6.7% → -3 pts
- On-call: 20% of 1/6 team = -3.3% → -1.5 pts
- Buffer: -10% → -4.5 pts

Sprint capacity: 45 - 3.4 - 3 - 1.5 - 4.5 ≈ 33 points
```

### Focus Factor

Percentage of time on sprint work:

| Team Type | Focus Factor |
|-----------|--------------|
| New team | 50-60% |
| Typical team | 60-70% |
| High performing | 70-80% |

## Velocity Tracking

### Calculating Velocity

**Method 1: Simple Average** (last 3 sprints)
```
Sprints: 38, 42, 44 points
Velocity = (38 + 42 + 44) / 3 = 41 points
```

**Method 2: Weighted Average** (recent sprints count more)
```
Velocity = (Sprint_N × 3 + Sprint_N-1 × 2 + Sprint_N-2 × 1) / 6
Example: (44 × 3 + 42 × 2 + 38 × 1) / 6 = 42 points
```

### Interpreting Velocity Trends

| Trend | Meaning | Action |
|-------|---------|--------|
| Increasing | Team maturing, processes improving | Gradually increase commitments |
| Stable | Consistent, predictable | Use as reliable planning baseline |
| Decreasing | Technical debt? Team changes? | Investigate root causes |
| Erratic | Inconsistent sizing or scope changes | Improve estimation practices |

### Velocity vs. Capacity

- **Velocity**: Historical output (points completed)
- **Capacity**: Theoretical input (available effort)

**Use velocity for planning**, not capacity. Velocity accounts for real-world factors.

## Sprint Queries

**Sprint burndown data**:
```jql
sprint = "Sprint 42" AND status IN ("In Progress", "To Do")
```

**Carry-over issues**:
```jql
sprint WAS "Sprint 42" AND sprint = "Sprint 43" AND resolution IS EMPTY
```

**Blocked issues**:
```jql
sprint in openSprints() AND status = "Blocked"
```

## Sprint Anti-Patterns

### Overcommitment
Loading 60 points when velocity is 40.

**Symptoms**: Incomplete sprints, stressed team, quality issues

**Fix**: Use historical velocity, add 10% buffer, track carry-over rate

### Under-commitment
Loading 20 points when velocity is 40 to "guarantee" completion.

**Symptoms**: Team finishing early, stakeholders frustrated

**Fix**: Commit to realistic amount, have stretch goals ready

### No Sprint Goal
Just a collection of random stories.

**Symptoms**: Lack of focus, unclear priorities, no cohesion

**Fix**: Define clear objective that ties stories together

### Splitting Mid-Sprint
Constantly splitting stories after sprint starts.

**Symptoms**: Scope creep, unclear definition of done

**Fix**: Better grooming and estimation up front

### Ignoring Dependencies
Starting blocked work.

**Symptoms**: Context switching, idle time, frustration

**Fix**: Map dependencies during planning, start unblocked work first

### Gold Plating
Adding unplanned features during implementation.

**Symptoms**: Stories take longer, scope creep

**Fix**: Stick to acceptance criteria, capture new ideas as separate stories

## Sprint Health Metrics

### Key Indicators

| Metric | Healthy Range | Warning Sign |
|--------|---------------|--------------|
| Carry-over rate | < 10% | > 20% |
| Velocity variance | ± 15% | > 30% |
| Blocked time | < 5% | > 15% |
| Stories completed | > 80% | < 60% |
| Story size variance | Low | High |

### Diagnostic Queries

**High carry-over diagnosis**:
```jql
sprint = "Sprint 42" AND statusCategory != Done
ORDER BY "Story Points" DESC
```

**Blocked items analysis**:
```jql
sprint in openSprints() AND status CHANGED TO "Blocked"
ORDER BY updated DESC
```

## Sprint Planning Template

```
Sprint Number: 43
Duration: Jan 15-28 (10 days)
Sprint Goal: Complete user profile functionality

TEAM CAPACITY
─────────────
Members: 6 developers
Availability:
- Alice: 10 days (full)
- Bob: 7 days (3 days PTO)      → -5%
- Carol: 10 days (full)
- Dave: 10 days (on-call)       → -3%
- Eve: 9 days (1 day training)  → -2%
- Frank: 10 days (full)

Historical velocity: 45 points
Adjusted capacity: 36 points

SPRINT BACKLOG (36 points)
──────────────────────────
□ PROJ-101: User profile page (8 pts)
□ PROJ-102: Avatar upload (5 pts)
□ PROJ-103: Profile editing (8 pts)
□ PROJ-104: Privacy settings (5 pts)
□ PROJ-105: Completion badge (3 pts)
□ PROJ-106: Update navigation (2 pts)
□ PROJ-107: Profile tests (5 pts)

STRETCH GOALS
─────────────
○ PROJ-108: Social media links (5 pts)
○ PROJ-109: Custom themes (8 pts)

DEPENDENCIES & RISKS
────────────────────
Dependencies:
- PROJ-102 needs design review (due Jan 16)
- PROJ-104 needs security review

Risks:
- Avatar upload may need third-party service
- Privacy settings have regulatory requirements

Mitigation:
- Start PROJ-101, 103, 106 first
- Spike for avatar service options
```

## How I'll Help

For advanced capacity analysis, I will:

1. **Calculate detailed capacity**: Account for all adjustments
2. **Analyze velocity trends**: Identify patterns and anomalies
3. **Diagnose sprint issues**: Find anti-patterns and root causes
4. **Provide queries**: JQL for sprint health monitoring
5. **Generate reports**: Sprint health and velocity reports

## Example Interaction

**You**: "Our velocity has been dropping. Sprint 40: 45pts, 41: 38pts, 42: 32pts. What's going on?"

**Me**: "I see a concerning 29% velocity decline over 3 sprints. Let me investigate.

[Queries sprint data]

**Analysis**:
- Carry-over rate increased: 8% → 15% → 22%
- 3 stories blocked in Sprint 42 (12 pts total)
- Average story size grew: 4.2 → 5.8 → 7.1 pts

**Likely causes**:
1. Stories are getting larger (harder to complete in sprint)
2. External dependencies causing blocks
3. Possible technical debt accumulation

**Recommendations**:
1. Break down stories > 8 pts before sprint
2. Identify and resolve blockers earlier
3. Reduce next sprint commitment to 28-30 pts
4. Schedule a retrospective focused on blockers

Want me to find the specific blocked issues?"
