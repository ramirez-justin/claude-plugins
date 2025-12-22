#!/usr/bin/env node

/**
 * Get all lists on the Trello board
 * Usage: node get-lists.js [--with-cards]
 */

const { getTrelloClient } = require('./trello-client');

async function getLists() {
  const args = process.argv.slice(2);
  const withCards = args.includes('--with-cards');

  const trello = getTrelloClient();

  try {
    if (withCards) {
      const overview = await trello.getBoardOverview();

      console.log('Board Overview:');
      console.log('================');

      overview.forEach(list => {
        console.log(`\n${list.name} (${list.cards.length} cards)`);
        console.log(`  ID: ${list.id}`);

        if (list.cards.length > 0) {
          list.cards.forEach(card => {
            const due = card.due ? ` [Due: ${new Date(card.due).toLocaleDateString()}]` : '';
            console.log(`    - ${card.name}${due}`);
          });
        }
      });
    } else {
      const lists = await trello.getLists();

      console.log('Board Lists:');
      console.log('=============');

      lists.forEach(list => {
        console.log(`\n${list.name}`);
        console.log(`  ID: ${list.id}`);
        console.log(`  Position: ${list.pos}`);
        console.log(`  Closed: ${list.closed}`);
      });
    }
  } catch (error) {
    console.error('Error getting lists:', error.message);
    process.exit(1);
  }
}

getLists();
