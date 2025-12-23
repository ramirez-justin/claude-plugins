#!/usr/bin/env node

/**
 * Get latest quote for a symbol
 * Usage: node quote.js <symbol> [symbol2] [symbol3] ...
 */

const { getAlpacaClient } = require('./alpaca-client');

async function getQuote() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: quote.js <symbol> [symbol2] [symbol3] ...');
    console.error('Example: quote.js AAPL');
    console.error('Example: quote.js AAPL MSFT GOOGL');
    process.exit(1);
  }

  const symbols = args.map(s => s.toUpperCase());
  const alpaca = getAlpacaClient();

  try {
    if (symbols.length === 1) {
      // Single symbol - get detailed quote
      const symbol = symbols[0];
      const [quote, trade] = await Promise.all([
        alpaca.getLatestQuote(symbol),
        alpaca.getLatestTrade(symbol)
      ]);

      console.log(`\n=== ${symbol} Quote ===\n`);

      if (quote.quote) {
        const q = quote.quote;
        console.log(`Bid: $${q.bp?.toFixed(2) || 'N/A'} x ${q.bs || 0}`);
        console.log(`Ask: $${q.ap?.toFixed(2) || 'N/A'} x ${q.as || 0}`);
        if (q.bp && q.ap) {
          const spread = q.ap - q.bp;
          const spreadPercent = ((spread / q.ap) * 100).toFixed(3);
          console.log(`Spread: $${spread.toFixed(2)} (${spreadPercent}%)`);
        }
        console.log(`Quote Time: ${new Date(q.t).toLocaleString()}`);
      }

      if (trade.trade) {
        const t = trade.trade;
        console.log(`\nLast Trade: $${t.p?.toFixed(2) || 'N/A'}`);
        console.log(`Size: ${t.s || 0} shares`);
        console.log(`Trade Time: ${new Date(t.t).toLocaleString()}`);
        console.log(`Exchange: ${t.x || 'N/A'}`);
      }
    } else {
      // Multiple symbols - get snapshots
      const snapshots = await alpaca.getSnapshots(symbols);

      console.log(`\n=== Market Quotes ===\n`);

      for (const symbol of symbols) {
        const snapshot = snapshots[symbol];
        if (snapshot) {
          const price = snapshot.latestTrade?.p || snapshot.latestQuote?.ap || 'N/A';
          const bid = snapshot.latestQuote?.bp || 'N/A';
          const ask = snapshot.latestQuote?.ap || 'N/A';

          let changeStr = '';
          if (snapshot.dailyBar && snapshot.prevDailyBar) {
            const change = snapshot.dailyBar.c - snapshot.prevDailyBar.c;
            const changePercent = ((change / snapshot.prevDailyBar.c) * 100).toFixed(2);
            const sign = change >= 0 ? '+' : '';
            changeStr = ` | ${sign}$${change.toFixed(2)} (${sign}${changePercent}%)`;
          }

          console.log(`${symbol.padEnd(6)} | Last: $${typeof price === 'number' ? price.toFixed(2) : price} | Bid: $${typeof bid === 'number' ? bid.toFixed(2) : bid} | Ask: $${typeof ask === 'number' ? ask.toFixed(2) : ask}${changeStr}`);
        } else {
          console.log(`${symbol.padEnd(6)} | No data available`);
        }
      }
    }
  } catch (error) {
    console.error('Error fetching quote:', error.message);
    process.exit(1);
  }
}

getQuote();
