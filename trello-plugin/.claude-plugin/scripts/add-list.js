#!/usr/bin/env node

/**
 * Add a new list to the Trello board
 * Usage: node add-list.js <name> [position]
 */

const { getTrelloClient } = require('./trello-client');

async function addList() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: add-list.js <name> [position]');
    console.error('Position: top, bottom, or a number');
    console.error('Example: add-list.js "Sprint 5" top');
    process.exit(1);
  }

  const [name, pos = 'bottom'] = args;

  const trello = getTrelloClient();

  try {
    const list = await trello.createList(name, undefined, pos);

    console.log(`Created list: ${list.name}`);
    console.log(`  ID: ${list.id}`);
    console.log(`  Position: ${list.pos}`);

    return list;
  } catch (error) {
    console.error('Error creating list:', error.message);
    process.exit(1);
  }
}

addList();
