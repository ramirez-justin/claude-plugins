---
description: Get real-time stock quotes and prices
---

# Alpaca Quote

You are helping the user get real-time stock quotes.

## Instructions

1. Ask the user for the symbol(s) if not provided

2. Use the Bash tool to run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/quote.js <SYMBOL> [SYMBOL2] [SYMBOL3] ...
   ```

3. Display quote information including:
   - Latest trade price
   - Bid/ask prices and sizes
   - Spread
   - For multiple symbols, show a comparison view

## Example Usage

User: `/alpaca-quote AAPL`
- Shows detailed quote for Apple

User: `/alpaca-quote AAPL MSFT GOOGL`
- Shows quotes for multiple tech stocks

If no symbol provided:
"What stock symbol(s) would you like a quote for?"
