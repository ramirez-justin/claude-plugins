#!/usr/bin/env node

/**
 * Cancel an order on Alpaca
 * Usage: node cancel-order.js <order_id>
 *        node cancel-order.js --all
 */

const { getAlpacaClient } = require('./alpaca-client');

async function cancelOrder() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: cancel-order.js <order_id>');
    console.error('       cancel-order.js --all');
    console.error('');
    console.error('Examples:');
    console.error('  cancel-order.js abc123-def456-...   # Cancel specific order');
    console.error('  cancel-order.js --all               # Cancel all open orders');
    process.exit(1);
  }

  const alpaca = getAlpacaClient();

  try {
    if (args[0] === '--all') {
      // Cancel all orders
      const result = await alpaca.cancelAllOrders();

      if (Array.isArray(result) && result.length > 0) {
        console.log(`\n=== Canceled ${result.length} Order(s) ===\n`);
        result.forEach(item => {
          if (item.status === 200) {
            console.log(`Canceled: ${item.id}`);
          } else {
            console.log(`Failed to cancel: ${item.id} - ${item.body?.message || 'Unknown error'}`);
          }
        });
      } else {
        console.log('\nNo open orders to cancel.');
      }
    } else {
      // Cancel specific order
      const orderId = args[0];

      // First get order details
      try {
        const order = await alpaca.getOrder(orderId);
        console.log(`\nCanceling order: ${order.side.toUpperCase()} ${order.qty} ${order.symbol}`);
      } catch (e) {
        // Continue even if we can't get details
      }

      await alpaca.cancelOrder(orderId);
      console.log(`\nOrder ${orderId} canceled successfully.`);
    }
  } catch (error) {
    console.error('Error canceling order:', error.message);
    process.exit(1);
  }
}

cancelOrder();
