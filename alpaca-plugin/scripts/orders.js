#!/usr/bin/env node

/**
 * Get orders from Alpaca
 * Usage: node orders.js [status]
 *   status: open (default), closed, all
 */

const { getAlpacaClient } = require('./alpaca-client');

async function getOrders() {
  const args = process.argv.slice(2);
  const status = args[0] || 'open';

  if (!['open', 'closed', 'all'].includes(status)) {
    console.error('Usage: orders.js [status]');
    console.error('  status: open (default), closed, all');
    process.exit(1);
  }

  const alpaca = getAlpacaClient();

  try {
    const orders = await alpaca.getOrders({ status, limit: 50 });

    if (orders.length === 0) {
      console.log(`\nNo ${status} orders found.`);
      return;
    }

    console.log(`\n=== ${status.charAt(0).toUpperCase() + status.slice(1)} Orders (${orders.length}) ===\n`);

    orders.forEach(order => {
      displayOrder(order);
    });
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    process.exit(1);
  }
}

function displayOrder(order) {
  const qty = order.qty || order.notional;
  const qtyLabel = order.qty ? 'shares' : 'notional';
  const filledQty = order.filled_qty || '0';

  let priceInfo = '';
  if (order.type === 'limit') {
    priceInfo = `@ $${parseFloat(order.limit_price).toFixed(2)} limit`;
  } else if (order.type === 'stop') {
    priceInfo = `@ $${parseFloat(order.stop_price).toFixed(2)} stop`;
  } else if (order.type === 'stop_limit') {
    priceInfo = `@ $${parseFloat(order.stop_price).toFixed(2)} stop / $${parseFloat(order.limit_price).toFixed(2)} limit`;
  } else if (order.type === 'trailing_stop') {
    priceInfo = `trailing ${order.trail_percent ? order.trail_percent + '%' : '$' + order.trail_price}`;
  } else {
    priceInfo = 'market';
  }

  const statusColors = {
    'new': 'NEW',
    'partially_filled': 'PARTIAL',
    'filled': 'FILLED',
    'done_for_day': 'DONE',
    'canceled': 'CANCELED',
    'expired': 'EXPIRED',
    'replaced': 'REPLACED',
    'pending_cancel': 'CANCELING',
    'pending_replace': 'REPLACING',
    'pending_new': 'PENDING',
    'accepted': 'ACCEPTED',
    'accepted_for_bidding': 'BIDDING',
    'stopped': 'STOPPED',
    'rejected': 'REJECTED',
    'suspended': 'SUSPENDED',
    'calculated': 'CALCULATED'
  };

  const statusLabel = statusColors[order.status] || order.status.toUpperCase();
  const side = order.side.toUpperCase();
  const submittedAt = new Date(order.submitted_at).toLocaleString();

  console.log(`[${statusLabel}] ${side} ${qty} ${qtyLabel} ${order.symbol} ${priceInfo}`);
  console.log(`  Order ID: ${order.id}`);
  console.log(`  Type: ${order.type} | TIF: ${order.time_in_force}`);
  console.log(`  Filled: ${filledQty}/${qty} ${order.filled_avg_price ? '@ $' + parseFloat(order.filled_avg_price).toFixed(2) : ''}`);
  console.log(`  Submitted: ${submittedAt}`);
  if (order.extended_hours) {
    console.log(`  Extended Hours: Yes`);
  }
  console.log('');
}

getOrders();
