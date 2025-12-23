#!/usr/bin/env node

/**
 * Place an order on Alpaca
 * Usage: node order.js <side> <symbol> <qty> [type] [limit_price] [options...]
 *
 * Examples:
 *   node order.js buy AAPL 10                      # Market order for 10 shares
 *   node order.js sell AAPL 10                     # Market sell order
 *   node order.js buy AAPL 10 limit 150.00         # Limit order at $150
 *   node order.js buy AAPL 10 stop 145.00          # Stop order at $145
 *   node order.js buy AAPL 10 stop_limit 145 150   # Stop-limit order
 *   node order.js buy AAPL 10 market --tif=gtc     # GTC market order
 *   node order.js buy AAPL 10 market --extended    # Extended hours order
 */

const { getAlpacaClient } = require('./alpaca-client');

function parseArgs() {
  const args = process.argv.slice(2);
  const positional = [];
  const options = {};

  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      options[key] = value === undefined ? true : value;
    } else {
      positional.push(arg);
    }
  }

  return { positional, options };
}

async function placeOrder() {
  const { positional, options } = parseArgs();

  if (positional.length < 3) {
    console.error('Usage: order.js <side> <symbol> <qty> [type] [price] [stop_price]');
    console.error('');
    console.error('Arguments:');
    console.error('  side        buy or sell');
    console.error('  symbol      Stock symbol (e.g., AAPL)');
    console.error('  qty         Number of shares');
    console.error('  type        Order type: market (default), limit, stop, stop_limit, trailing_stop');
    console.error('  price       Limit price (for limit/stop_limit orders)');
    console.error('  stop_price  Stop price (for stop/stop_limit orders)');
    console.error('');
    console.error('Options:');
    console.error('  --tif=      Time in force: day (default), gtc, opg, cls, ioc, fok');
    console.error('  --extended  Allow extended hours trading');
    console.error('  --notional  Qty is a dollar amount, not shares');
    console.error('  --trail=    Trail amount for trailing_stop (percent or dollar with $)');
    console.error('');
    console.error('Examples:');
    console.error('  order.js buy AAPL 10                  # Market buy 10 shares');
    console.error('  order.js buy AAPL 10 limit 150.00     # Limit buy at $150');
    console.error('  order.js sell TSLA 5 stop 200.00      # Stop sell at $200');
    console.error('  order.js buy MSFT 1000 --notional     # Buy $1000 worth');
    process.exit(1);
  }

  const [side, symbol, qty, orderType = 'market', ...prices] = positional;

  // Validate side
  if (!['buy', 'sell'].includes(side.toLowerCase())) {
    console.error('Error: side must be "buy" or "sell"');
    process.exit(1);
  }

  // Build order object
  const order = {
    symbol: symbol.toUpperCase(),
    side: side.toLowerCase(),
    type: orderType.toLowerCase(),
    time_in_force: options.tif || 'day'
  };

  // Handle quantity vs notional
  if (options.notional) {
    order.notional = qty;
  } else {
    order.qty = qty;
  }

  // Handle extended hours
  if (options.extended) {
    order.extended_hours = true;
  }

  // Handle prices based on order type
  switch (order.type) {
    case 'limit':
      if (prices.length < 1) {
        console.error('Error: limit orders require a limit price');
        process.exit(1);
      }
      order.limit_price = prices[0];
      break;

    case 'stop':
      if (prices.length < 1) {
        console.error('Error: stop orders require a stop price');
        process.exit(1);
      }
      order.stop_price = prices[0];
      break;

    case 'stop_limit':
      if (prices.length < 2) {
        console.error('Error: stop_limit orders require stop price and limit price');
        process.exit(1);
      }
      order.stop_price = prices[0];
      order.limit_price = prices[1];
      break;

    case 'trailing_stop':
      if (options.trail) {
        if (options.trail.startsWith('$')) {
          order.trail_price = options.trail.slice(1);
        } else {
          order.trail_percent = options.trail.replace('%', '');
        }
      } else {
        console.error('Error: trailing_stop orders require --trail=<percent or $amount>');
        process.exit(1);
      }
      break;

    case 'market':
      // No additional params needed
      break;

    default:
      console.error(`Error: unknown order type "${orderType}"`);
      process.exit(1);
  }

  const alpaca = getAlpacaClient();
  const isPaper = process.env.ALPACA_PAPER !== 'false';

  // Display order summary
  console.log(`\n=== Order Summary ${isPaper ? '(Paper Trading)' : '(LIVE TRADING)'} ===\n`);
  console.log(`Action: ${order.side.toUpperCase()} ${order.qty || '$' + order.notional} ${order.symbol}`);
  console.log(`Type: ${order.type.toUpperCase()}`);
  if (order.limit_price) console.log(`Limit Price: $${order.limit_price}`);
  if (order.stop_price) console.log(`Stop Price: $${order.stop_price}`);
  if (order.trail_percent) console.log(`Trail: ${order.trail_percent}%`);
  if (order.trail_price) console.log(`Trail: $${order.trail_price}`);
  console.log(`Time in Force: ${order.time_in_force.toUpperCase()}`);
  if (order.extended_hours) console.log(`Extended Hours: Yes`);

  try {
    const result = await alpaca.createOrder(order);

    console.log('\n--- Order Placed Successfully ---');
    console.log(`Order ID: ${result.id}`);
    console.log(`Status: ${result.status}`);
    console.log(`Created: ${new Date(result.created_at).toLocaleString()}`);

    if (result.filled_qty && result.filled_qty !== '0') {
      console.log(`Filled: ${result.filled_qty} @ $${parseFloat(result.filled_avg_price).toFixed(2)}`);
    }

    return result;
  } catch (error) {
    console.error('\nError placing order:', error.message);
    process.exit(1);
  }
}

placeOrder();
