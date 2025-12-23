#!/usr/bin/env node

/**
 * Close a position
 * Usage: node close-position.js <symbol> [qty_or_percent]
 *        node close-position.js --all
 *
 * Examples:
 *   node close-position.js AAPL           # Close entire AAPL position
 *   node close-position.js AAPL 50        # Close 50 shares
 *   node close-position.js AAPL 50%       # Close 50% of position
 *   node close-position.js --all          # Close all positions
 */

const { getAlpacaClient } = require('./alpaca-client');

async function closePosition() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: close-position.js <symbol> [qty_or_percent]');
    console.error('       close-position.js --all');
    console.error('');
    console.error('Examples:');
    console.error('  close-position.js AAPL        # Close entire position');
    console.error('  close-position.js AAPL 50     # Close 50 shares');
    console.error('  close-position.js AAPL 50%    # Close 50% of position');
    console.error('  close-position.js --all       # Close all positions');
    process.exit(1);
  }

  const alpaca = getAlpacaClient();
  const isPaper = process.env.ALPACA_PAPER !== 'false';

  try {
    if (args[0] === '--all') {
      // Get current positions first
      const positions = await alpaca.getPositions();

      if (positions.length === 0) {
        console.log('\nNo open positions to close.');
        return;
      }

      console.log(`\n=== Closing All Positions ${isPaper ? '(Paper Trading)' : '(LIVE TRADING)'} ===\n`);
      console.log(`Found ${positions.length} position(s):`);
      positions.forEach(p => {
        const pl = parseFloat(p.unrealized_pl);
        const plSign = pl >= 0 ? '+' : '';
        console.log(`  ${p.symbol}: ${p.qty} shares (${plSign}$${pl.toFixed(2)})`);
      });

      const result = await alpaca.closeAllPositions(true);

      console.log('\nClose orders submitted:');
      if (Array.isArray(result)) {
        result.forEach(item => {
          if (item.status === 200 || item.body?.id) {
            console.log(`  ${item.symbol || 'Order'}: Closing...`);
          } else {
            console.log(`  Failed: ${item.body?.message || 'Unknown error'}`);
          }
        });
      } else {
        console.log('All positions are being closed.');
      }
    } else {
      const symbol = args[0].toUpperCase();
      const qtyArg = args[1];

      // Get current position
      let position;
      try {
        position = await alpaca.getPosition(symbol);
      } catch (e) {
        console.error(`\nNo position found for ${symbol}`);
        process.exit(1);
      }

      const currentQty = Math.abs(parseFloat(position.qty));
      const pl = parseFloat(position.unrealized_pl);
      const plSign = pl >= 0 ? '+' : '';

      console.log(`\n=== Closing ${symbol} Position ${isPaper ? '(Paper Trading)' : '(LIVE TRADING)'} ===\n`);
      console.log(`Current Position: ${position.qty} shares @ $${parseFloat(position.avg_entry_price).toFixed(2)}`);
      console.log(`Current Price: $${parseFloat(position.current_price).toFixed(2)}`);
      console.log(`Unrealized P&L: ${plSign}$${pl.toFixed(2)}`);

      const options = {};

      if (qtyArg) {
        if (qtyArg.endsWith('%')) {
          options.percentage = parseFloat(qtyArg) / 100;
          console.log(`\nClosing ${qtyArg} of position...`);
        } else {
          options.qty = qtyArg;
          console.log(`\nClosing ${qtyArg} shares...`);
        }
      } else {
        console.log('\nClosing entire position...');
      }

      const result = await alpaca.closePosition(symbol, options);

      console.log('\n--- Close Order Submitted ---');
      console.log(`Order ID: ${result.id}`);
      console.log(`Status: ${result.status}`);
      console.log(`Side: ${result.side.toUpperCase()}`);
      console.log(`Quantity: ${result.qty}`);
    }
  } catch (error) {
    console.error('Error closing position:', error.message);
    process.exit(1);
  }
}

closePosition();
