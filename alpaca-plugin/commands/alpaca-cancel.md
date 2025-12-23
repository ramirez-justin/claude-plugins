---
description: Cancel pending orders
---

# Cancel Alpaca Order

You are helping the user cancel pending orders.

## Instructions

1. If the user wants to cancel a specific order:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/cancel-order.js <order_id>
   ```

2. If the user wants to cancel all orders:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/cancel-order.js --all
   ```

3. **Confirm before canceling**, especially for `--all`

## Finding Order IDs

If the user doesn't know the order ID, first run:
```
node ${CLAUDE_PLUGIN_ROOT}/scripts/orders.js open
```

Then help them identify which order to cancel.

## Example Usage

User: `/alpaca-cancel abc123-def456...`
- Cancels the specific order

User: `/alpaca-cancel all`
1. Show current open orders
2. Confirm: "Are you sure you want to cancel all X open orders?"
3. If confirmed, cancel all
