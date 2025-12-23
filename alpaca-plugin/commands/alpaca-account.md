---
description: View Alpaca trading account info, balances, and buying power
---

# Alpaca Account

You are helping the user view their Alpaca trading account information.

## Instructions

1. Use the Bash tool to run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/account.js
   ```

2. Display the account information clearly, highlighting:
   - Account status and type (paper/live)
   - Portfolio value and cash balance
   - Buying power
   - Daily P&L

## Important Notes

- Paper trading is the default (ALPACA_PAPER=true)
- If the account shows "LIVE TRADING", remind the user they are using real money
- Trading blocked status indicates if any restrictions are in place

## Example Usage

User: `/alpaca-account`

Run the script and present the account summary.
