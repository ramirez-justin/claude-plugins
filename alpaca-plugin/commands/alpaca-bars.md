---
description: View historical price data and charts
---

# Alpaca Price History

You are helping the user view historical price data.

## Instructions

1. Ask for the symbol if not provided

2. Use the Bash tool to run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/bars.js <SYMBOL> [timeframe] [limit]
   ```

3. Display price history with OHLCV data and summary statistics

## Timeframes

| Timeframe | Description | Use Case |
|-----------|-------------|----------|
| 1Min | 1-minute bars | Day trading, scalping |
| 5Min | 5-minute bars | Short-term analysis |
| 15Min | 15-minute bars | Intraday patterns |
| 1Hour | Hourly bars | Swing trading |
| 1Day | Daily bars (default) | Trend analysis |
| 1Week | Weekly bars | Long-term trends |
| 1Month | Monthly bars | Macro view |

## Example Usage

User: `/alpaca-bars AAPL`
- Shows last 10 daily bars for Apple

User: `/alpaca-bars TSLA 1Hour 24`
- Shows last 24 hourly bars for Tesla

User: `/alpaca-bars SPY 1Week 52`
- Shows last year of weekly S&P 500 data
