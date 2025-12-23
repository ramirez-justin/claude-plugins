#!/usr/bin/env node

/**
 * Get historical price bars for a symbol
 * Usage: node bars.js <symbol> [timeframe] [limit]
 *
 * Timeframes: 1Min, 5Min, 15Min, 30Min, 1Hour, 4Hour, 1Day, 1Week, 1Month
 */

const { getAlpacaClient } = require('./alpaca-client');

async function getBars() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: bars.js <symbol> [timeframe] [limit]');
    console.error('');
    console.error('Timeframes: 1Min, 5Min, 15Min, 30Min, 1Hour, 4Hour, 1Day, 1Week, 1Month');
    console.error('');
    console.error('Examples:');
    console.error('  bars.js AAPL              # Daily bars, last 10');
    console.error('  bars.js AAPL 1Hour 24     # Hourly bars, last 24');
    console.error('  bars.js TSLA 1Week 52     # Weekly bars, last year');
    process.exit(1);
  }

  const symbol = args[0].toUpperCase();
  const timeframe = args[1] || '1Day';
  const limit = parseInt(args[2]) || 10;

  const alpaca = getAlpacaClient();

  try {
    const result = await alpaca.getBars(symbol, { timeframe, limit });

    const bars = result.bars || [];

    if (bars.length === 0) {
      console.log(`\nNo bar data available for ${symbol}`);
      return;
    }

    console.log(`\n=== ${symbol} Price History (${timeframe}) ===\n`);

    // Calculate stats
    const closes = bars.map(b => b.c);
    const high = Math.max(...bars.map(b => b.h));
    const low = Math.min(...bars.map(b => b.l));
    const avgVolume = bars.reduce((sum, b) => sum + b.v, 0) / bars.length;

    // Display bars in reverse chronological order (most recent first)
    console.log('Date/Time'.padEnd(20) + 'Open'.padStart(10) + 'High'.padStart(10) + 'Low'.padStart(10) + 'Close'.padStart(10) + 'Volume'.padStart(12));
    console.log('-'.repeat(72));

    bars.slice().reverse().forEach(bar => {
      const date = new Date(bar.t);
      const dateStr = timeframe.includes('Min') || timeframe.includes('Hour')
        ? date.toLocaleString()
        : date.toLocaleDateString();

      console.log(
        dateStr.padEnd(20) +
        ('$' + bar.o.toFixed(2)).padStart(10) +
        ('$' + bar.h.toFixed(2)).padStart(10) +
        ('$' + bar.l.toFixed(2)).padStart(10) +
        ('$' + bar.c.toFixed(2)).padStart(10) +
        bar.v.toLocaleString().padStart(12)
      );
    });

    // Summary stats
    const firstClose = bars[0].c;
    const lastClose = bars[bars.length - 1].c;
    const change = lastClose - firstClose;
    const changePercent = ((change / firstClose) * 100).toFixed(2);
    const sign = change >= 0 ? '+' : '';

    console.log('\n--- Summary ---');
    console.log(`Period High: $${high.toFixed(2)}`);
    console.log(`Period Low: $${low.toFixed(2)}`);
    console.log(`Avg Volume: ${Math.round(avgVolume).toLocaleString()}`);
    console.log(`Period Change: ${sign}$${change.toFixed(2)} (${sign}${changePercent}%)`);
  } catch (error) {
    console.error('Error fetching bars:', error.message);
    process.exit(1);
  }
}

getBars();
