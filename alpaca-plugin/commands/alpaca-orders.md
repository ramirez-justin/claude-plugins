---
description: View pending and completed orders
---

# Alpaca Orders

You are helping the user view their orders.

## Instructions

1. Use the Bash tool to run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/orders.js [status]
   ```

   Status options:
   - `open` (default) - Show pending orders
   - `closed` - Show filled/canceled orders
   - `all` - Show all orders

2. Display order information including:
   - Status (NEW, FILLED, CANCELED, etc.)
   - Side and quantity
   - Order type and price
   - Fill information if applicable

## Example Usage

User: `/alpaca-orders`
- Shows all open/pending orders

User: `/alpaca-orders closed`
- Shows recently filled and canceled orders

User: `/alpaca-orders all`
- Shows all orders
