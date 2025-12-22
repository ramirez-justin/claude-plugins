#!/usr/bin/env node

/**
 * Update a Trello card
 * Usage: node update-card.js <cardId> <field> <value>
 */

const { getTrelloClient } = require('./trello-client');

async function updateCard() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.error('Usage: update-card.js <cardId> <field> <value>');
    console.error('Fields: name, desc, due, closed, idList');
    console.error('Example: update-card.js abc123 name "Updated card name"');
    process.exit(1);
  }

  const [cardId, field, ...valueArgs] = args;
  const value = valueArgs.join(' ');

  const trello = getTrelloClient();

  try {
    const validFields = ['name', 'desc', 'due', 'closed', 'idList', 'pos'];
    if (!validFields.includes(field)) {
      console.error(`Invalid field: ${field}`);
      console.error(`Valid fields: ${validFields.join(', ')}`);
      process.exit(1);
    }

    const updates = {};
    updates[field] = field === 'closed' ? value === 'true' : value;

    const card = await trello.updateCard(cardId, updates);

    console.log(`Updated card: ${card.name}`);
    console.log(`  ${field}: ${value}`);
    console.log(`  URL: ${card.shortUrl}`);

    return card;
  } catch (error) {
    console.error('Error updating card:', error.message);
    process.exit(1);
  }
}

updateCard();
