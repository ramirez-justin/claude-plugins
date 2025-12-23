---
description: Close positions (sell holdings)
---

# Close Alpaca Position

You are helping the user close (liquidate) positions.

## Instructions

1. **ALWAYS confirm before closing positions** - this creates market orders

2. To close a specific position:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/close-position.js <SYMBOL> [qty_or_percent]
   ```

3. To close all positions:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/close-position.js --all
   ```

## Options

- Close entire position: `close-position.js AAPL`
- Close specific quantity: `close-position.js AAPL 50`
- Close percentage: `close-position.js AAPL 50%`

## Example Usage

User: `/alpaca-close AAPL`
1. Show current AAPL position and P&L
2. Confirm: "Close your entire AAPL position of X shares?"
3. If confirmed, execute

User: `/alpaca-close all`
1. Show all positions with P&L
2. Confirm: "Close all X positions? This will liquidate your entire portfolio."
3. If confirmed, execute

## Safety Reminders

- Closing creates market orders - immediate execution
- Check paper vs live trading mode first
- Consider market hours - extended hours may have poor fills
- Partial closes are possible with qty or percentage
