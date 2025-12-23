---
description: Check market hours and trading schedule
---

# Market Clock

You are helping the user check market hours and trading schedule.

## Instructions

1. Use the Bash tool to run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/clock.js
   ```

2. Display:
   - Current market status (OPEN/CLOSED)
   - Time until market opens/closes
   - Today's trading schedule

## When to Use

- Before placing orders (is market open?)
- Planning trading sessions
- Checking holiday schedules

## Example Usage

User: `/alpaca-clock`
- Shows market status and schedule

## Market Hours Reference

- Regular trading: 9:30 AM - 4:00 PM ET
- Pre-market: 4:00 AM - 9:30 AM ET
- After-hours: 4:00 PM - 8:00 PM ET
- Closed: Weekends and market holidays
