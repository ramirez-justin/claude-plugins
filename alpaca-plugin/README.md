# Alpaca Trading Plugin for Claude Code

Trade stocks and crypto directly from Claude Code using the Alpaca Markets API. This plugin provides zero-dependency direct API integration for account management, market data, and order execution.

## Features

- **Account Management**: View balances, buying power, and portfolio value
- **Position Tracking**: Monitor open positions with real-time P&L
- **Market Data**: Get real-time quotes and historical price bars
- **Order Execution**: Place market, limit, stop, and trailing stop orders
- **Market Hours**: Check market status and trading schedule
- **Paper Trading**: Safe testing environment (default mode)

## Quick Start

### 1. Get Alpaca API Keys

1. Sign up at [Alpaca Markets](https://alpaca.markets/)
2. Go to your dashboard and navigate to API Keys
3. Generate a new API key pair (paper trading recommended for testing)

### 2. Configure Environment

Add to your `.claude/settings.json`:

```json
{
  "env": {
    "ALPACA_API_KEY": "your-api-key-id",
    "ALPACA_API_SECRET": "your-api-secret-key",
    "ALPACA_PAPER": "true"
  }
}
```

### 3. Start Trading

```
/alpaca-account    # Check your account
/alpaca-quote AAPL # Get a stock quote
/alpaca-order buy AAPL 10  # Buy 10 shares (paper mode)
```

## Commands

| Command | Description |
|---------|-------------|
| `/alpaca-account` | View account info, balances, and buying power |
| `/alpaca-positions [symbol]` | View open positions and P&L |
| `/alpaca-quote <symbol>` | Get real-time stock quotes |
| `/alpaca-bars <symbol> [timeframe] [limit]` | View historical price data |
| `/alpaca-orders [status]` | View pending/completed orders |
| `/alpaca-order <side> <symbol> <qty> [type] [price]` | Place an order |
| `/alpaca-cancel <order_id \| --all>` | Cancel orders |
| `/alpaca-close <symbol \| --all>` | Close positions |
| `/alpaca-clock` | Check market hours and status |

## Order Types

### Market Order
Execute immediately at current market price:
```
/alpaca-order buy AAPL 10
```

### Limit Order
Execute at specified price or better:
```
/alpaca-order buy AAPL 10 limit 150.00
```

### Stop Order
Trigger market order when price reaches stop:
```
/alpaca-order sell AAPL 10 stop 145.00
```

### Stop-Limit Order
Trigger limit order when price reaches stop:
```
/alpaca-order buy AAPL 10 stop_limit 145.00 150.00
```

### Trailing Stop
Dynamic stop that follows the price:
```
/alpaca-order sell AAPL 10 trailing_stop --trail=5%
```

## Order Options

| Option | Description |
|--------|-------------|
| `--tif=day` | Day order (default) - expires at market close |
| `--tif=gtc` | Good-til-canceled - stays active until filled |
| `--tif=ioc` | Immediate-or-cancel - fill immediately or cancel |
| `--extended` | Allow extended hours trading |
| `--notional` | Quantity is dollar amount, not shares |

## Historical Data Timeframes

| Timeframe | Description |
|-----------|-------------|
| `1Min` | 1-minute bars |
| `5Min` | 5-minute bars |
| `15Min` | 15-minute bars |
| `1Hour` | Hourly bars |
| `1Day` | Daily bars (default) |
| `1Week` | Weekly bars |
| `1Month` | Monthly bars |

Example:
```
/alpaca-bars AAPL 1Hour 24   # Last 24 hourly bars
/alpaca-bars TSLA 1Week 52   # Last year of weekly bars
```

## Paper vs Live Trading

By default, the plugin uses paper trading mode, which simulates trades with fake money. This is perfect for:
- Testing strategies
- Learning the platform
- Trying new order types

To switch to live trading (real money):
```json
{
  "env": {
    "ALPACA_PAPER": "false"
  }
}
```

**Warning**: Live trading uses real money. Always double-check orders before confirming.

## Market Hours

- **Pre-market**: 4:00 AM - 9:30 AM ET
- **Regular**: 9:30 AM - 4:00 PM ET
- **After-hours**: 4:00 PM - 8:00 PM ET

Use `/alpaca-clock` to check current market status.

For extended hours trading, add `--extended` to your order.

## Architecture

This plugin follows the zero-dependency pattern:
- Uses Node.js built-in `https` module
- Direct REST API calls to Alpaca
- No npm packages required

```
alpaca-plugin/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   ├── alpaca-account.md
│   ├── alpaca-positions.md
│   └── ...
├── scripts/
│   ├── alpaca-client.js    # Main API client
│   ├── account.js
│   ├── order.js
│   └── ...
├── agents/
│   └── trading-assistant.md
└── hooks/
    └── hooks.json
```

## API Rate Limits

Alpaca has a rate limit of 200 requests per minute. The plugin handles this gracefully, but avoid rapid-fire requests.

## Security Notes

- Never commit API keys to version control
- Use paper trading for testing
- Always confirm orders before execution
- The trading assistant will warn about live trading mode

## Troubleshooting

### "Missing required environment variables"
Ensure `ALPACA_API_KEY` and `ALPACA_API_SECRET` are set in `.claude/settings.json`.

### "HTTP 401: Unauthorized"
Check that your API keys are correct and haven't expired.

### "HTTP 403: Forbidden"
You may be trying to trade an asset not available on your account type.

### "Market is closed"
Use `/alpaca-clock` to check market hours. Use `--extended` for after-hours trading.

## Resources

- [Alpaca Documentation](https://docs.alpaca.markets/)
- [Alpaca API Reference](https://docs.alpaca.markets/reference)
- [Paper Trading Guide](https://alpaca.markets/docs/trading/paper-trading/)

## License

MIT
