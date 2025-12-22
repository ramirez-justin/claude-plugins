#!/usr/bin/env node

/**
 * Move a Trello card to a different list
 * Usage: node move-card.js <cardId> <listIdOrName> [position]
 */

const { getTrelloClient } = require('./trello-client');

async function moveCard() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: move-card.js <cardId> <listIdOrName> [position]');
    console.error('Position: top, bottom, or a number');
    console.error('Example: move-card.js abc123 "In-Progress" top');
    console.error('Example: move-card.js abc123 def456 bottom');
    process.exit(1);
  }

  const [cardId, listIdOrName, pos = 'bottom'] = args;

  const trello = getTrelloClient();

  try {
    let listId = listIdOrName;

    // Check if it's a list name (not a hex ID)
    if (!/^[a-f0-9]{24}$/.test(listIdOrName)) {
      // It's a name, look up the list ID
      listId = await trello.getListIdByName(listIdOrName);
    }

    const card = await trello.moveCard(cardId, listId, pos);

    console.log(`Moved card: ${card.name}`);
    console.log(`  To list: ${listIdOrName}`);
    console.log(`  Position: ${pos}`);
    console.log(`  URL: ${card.shortUrl}`);

    return card;
  } catch (error) {
    console.error('Error moving card:', error.message);
    process.exit(1);
  }
}

moveCard();
