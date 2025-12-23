#!/usr/bin/env node

/**
 * Get all open positions
 * Usage: node positions.js [symbol]
 */

const { getAlpacaClient } = require('./alpaca-client');

async function getPositions() {
  const args = process.argv.slice(2);
  const symbol = args[0];

  const alpaca = getAlpacaClient();

  try {
    if (symbol) {
      // Get specific position
      const position = await alpaca.getPosition(symbol.toUpperCase());
      displayPosition(position);
    } else {
      // Get all positions
      const positions = await alpaca.getPositions();

      if (positions.length === 0) {
        console.log('\nNo open positions.');
        return;
      }

      console.log(`\n=== Open Positions (${positions.length}) ===\n`);

      let totalValue = 0;
      let totalPL = 0;

      positions.forEach(position => {
        displayPosition(position, true);
        totalValue += parseFloat(position.market_value);
        totalPL += parseFloat(position.unrealized_pl);
      });

      console.log('\n--- Portfolio Summary ---');
      console.log(`Total Market Value: $${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
      const plSign = totalPL >= 0 ? '+' : '';
      console.log(`Total Unrealized P&L: ${plSign}$${totalPL.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    }
  } catch (error) {
    if (error.message.includes('404')) {
      console.log(`\nNo position found for ${symbol.toUpperCase()}`);
    } else {
      console.error('Error fetching positions:', error.message);
      process.exit(1);
    }
  }
}

function displayPosition(position, compact = false) {
  const qty = parseFloat(position.qty);
  const avgEntry = parseFloat(position.avg_entry_price);
  const currentPrice = parseFloat(position.current_price);
  const marketValue = parseFloat(position.market_value);
  const unrealizedPL = parseFloat(position.unrealized_pl);
  const unrealizedPLPercent = parseFloat(position.unrealized_plpc) * 100;
  const plSign = unrealizedPL >= 0 ? '+' : '';

  if (compact) {
    console.log(`${position.symbol.padEnd(6)} | ${qty > 0 ? 'LONG' : 'SHORT'} ${Math.abs(qty)} @ $${avgEntry.toFixed(2)} | Current: $${currentPrice.toFixed(2)} | P&L: ${plSign}$${unrealizedPL.toFixed(2)} (${plSign}${unrealizedPLPercent.toFixed(2)}%)`);
  } else {
    console.log(`\n=== ${position.symbol} Position ===\n`);
    console.log(`Side: ${qty > 0 ? 'LONG' : 'SHORT'}`);
    console.log(`Quantity: ${Math.abs(qty)} shares`);
    console.log(`Avg Entry Price: $${avgEntry.toFixed(2)}`);
    console.log(`Current Price: $${currentPrice.toFixed(2)}`);
    console.log(`Market Value: $${marketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    console.log(`Cost Basis: $${parseFloat(position.cost_basis).toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    console.log(`\nUnrealized P&L: ${plSign}$${unrealizedPL.toFixed(2)} (${plSign}${unrealizedPLPercent.toFixed(2)}%)`);

    if (position.unrealized_intraday_pl) {
      const intradayPL = parseFloat(position.unrealized_intraday_pl);
      const intradayPLPercent = parseFloat(position.unrealized_intraday_plpc) * 100;
      const intradaySign = intradayPL >= 0 ? '+' : '';
      console.log(`Intraday P&L: ${intradaySign}$${intradayPL.toFixed(2)} (${intradaySign}${intradayPLPercent.toFixed(2)}%)`);
    }

    console.log(`\nAsset Class: ${position.asset_class}`);
    console.log(`Exchange: ${position.exchange}`);
  }
}

getPositions();
