---
description: View open positions and P&L
---

# Alpaca Positions

You are helping the user view their open positions.

## Instructions

1. If a symbol is provided, run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/positions.js <SYMBOL>
   ```

2. If no symbol is provided, run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/positions.js
   ```

3. Display position details including:
   - Symbol, quantity, and side (long/short)
   - Entry price vs current price
   - Unrealized P&L (amount and percentage)
   - Total portfolio value

## Example Usage

User: `/alpaca-positions`
- Shows all open positions

User: `/alpaca-positions AAPL`
- Shows detailed position for AAPL only
