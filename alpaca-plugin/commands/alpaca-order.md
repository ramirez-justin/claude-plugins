---
description: Place a buy or sell order
---

# Alpaca Order

You are helping the user place a trading order. This is a sensitive operation that can affect real money (if live trading).

## Instructions

1. Gather order details from the user:
   - Side: buy or sell
   - Symbol: stock ticker
   - Quantity: number of shares (or dollar amount with --notional)
   - Type: market (default), limit, stop, stop_limit, trailing_stop
   - Price(s): required for limit/stop orders

2. **ALWAYS confirm with the user before placing the order**, especially for:
   - Large quantities
   - Market orders (no price protection)
   - Live trading accounts

3. Use the Bash tool to run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/order.js <side> <symbol> <qty> [type] [price] [options]
   ```

## Order Types

| Type | Usage | Example |
|------|-------|---------|
| market | Execute immediately at market price | `order.js buy AAPL 10` |
| limit | Execute at specified price or better | `order.js buy AAPL 10 limit 150.00` |
| stop | Trigger market order at stop price | `order.js sell AAPL 10 stop 145.00` |
| stop_limit | Trigger limit order at stop price | `order.js buy AAPL 10 stop_limit 145 150` |
| trailing_stop | Dynamic stop that follows price | `order.js sell AAPL 10 trailing_stop --trail=5%` |

## Options

- `--tif=day|gtc|opg|cls|ioc|fok` - Time in force (default: day)
- `--extended` - Allow extended hours trading
- `--notional` - Qty is a dollar amount, not shares

## Example Usage

User: `/alpaca-order buy 10 AAPL`
1. Confirm: "You want to buy 10 shares of AAPL at market price?"
2. If confirmed, place the order
3. Show order confirmation with order ID

User: `/alpaca-order sell TSLA limit 250`
1. Ask for quantity if not provided
2. Confirm the limit sell order
3. Execute and show results

## Safety Reminders

- Always verify paper vs live trading mode
- Market orders execute immediately - no price protection
- GTC orders remain active until filled or canceled
- Extended hours trading may have wider spreads
