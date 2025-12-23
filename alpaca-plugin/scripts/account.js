#!/usr/bin/env node

/**
 * Get Alpaca account information
 * Usage: node account.js
 */

const { getAlpacaClient } = require('./alpaca-client');

async function getAccount() {
  const alpaca = getAlpacaClient();

  try {
    const account = await alpaca.getAccount();

    const isPaper = process.env.ALPACA_PAPER !== 'false';
    console.log(`\n=== Alpaca Account ${isPaper ? '(Paper Trading)' : '(LIVE TRADING)'} ===\n`);

    console.log(`Account ID: ${account.id}`);
    console.log(`Status: ${account.status}`);
    console.log(`Currency: ${account.currency}`);
    console.log(`Pattern Day Trader: ${account.pattern_day_trader ? 'Yes' : 'No'}`);
    console.log(`Trading Blocked: ${account.trading_blocked ? 'Yes' : 'No'}`);
    console.log(`Account Blocked: ${account.account_blocked ? 'Yes' : 'No'}`);

    console.log('\n--- Balances ---');
    console.log(`Cash: $${parseFloat(account.cash).toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    console.log(`Portfolio Value: $${parseFloat(account.portfolio_value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    console.log(`Equity: $${parseFloat(account.equity).toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    console.log(`Last Equity: $${parseFloat(account.last_equity).toLocaleString('en-US', { minimumFractionDigits: 2 })}`);

    console.log('\n--- Buying Power ---');
    console.log(`Buying Power: $${parseFloat(account.buying_power).toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    console.log(`Daytrading Buying Power: $${parseFloat(account.daytrading_buying_power).toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    console.log(`Regt Buying Power: $${parseFloat(account.regt_buying_power).toLocaleString('en-US', { minimumFractionDigits: 2 })}`);

    console.log('\n--- Margins ---');
    console.log(`Initial Margin: $${parseFloat(account.initial_margin).toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    console.log(`Maintenance Margin: $${parseFloat(account.maintenance_margin).toLocaleString('en-US', { minimumFractionDigits: 2 })}`);

    if (account.long_market_value !== '0') {
      console.log(`Long Market Value: $${parseFloat(account.long_market_value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    }
    if (account.short_market_value !== '0') {
      console.log(`Short Market Value: $${parseFloat(account.short_market_value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    }

    // Calculate daily P&L
    const equity = parseFloat(account.equity);
    const lastEquity = parseFloat(account.last_equity);
    const dailyPL = equity - lastEquity;
    const dailyPLPercent = lastEquity > 0 ? ((dailyPL / lastEquity) * 100).toFixed(2) : 0;
    const plSign = dailyPL >= 0 ? '+' : '';

    console.log(`\n--- Daily P&L ---`);
    console.log(`Change: ${plSign}$${dailyPL.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${plSign}${dailyPLPercent}%)`);

    return account;
  } catch (error) {
    console.error('Error fetching account:', error.message);
    process.exit(1);
  }
}

getAccount();
