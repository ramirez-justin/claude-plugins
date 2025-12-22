#!/usr/bin/env node

/**
 * Archive a Trello card
 * Usage: node archive-card.js <cardId>
 */

const { getTrelloClient } = require('./trello-client');

async function archiveCard() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: archive-card.js <cardId>');
    console.error('Example: archive-card.js abc123');
    process.exit(1);
  }

  const [cardId] = args;

  const trello = getTrelloClient();

  try {
    const card = await trello.archiveCard(cardId);

    console.log(`Archived card: ${card.name}`);
    console.log(`  ID: ${card.id}`);

    return card;
  } catch (error) {
    console.error('Error archiving card:', error.message);
    process.exit(1);
  }
}

archiveCard();
