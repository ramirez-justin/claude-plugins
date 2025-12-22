#!/usr/bin/env node

/**
 * Archive a Trello list
 * Usage: node archive-list.js <listId>
 */

const { getTrelloClient } = require('./trello-client');

async function archiveList() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: archive-list.js <listId>');
    console.error('Example: archive-list.js abc123');
    process.exit(1);
  }

  const [listId] = args;

  const trello = getTrelloClient();

  try {
    const list = await trello.archiveList(listId);

    console.log(`Archived list: ${list.name}`);
    console.log(`  ID: ${list.id}`);

    return list;
  } catch (error) {
    console.error('Error archiving list:', error.message);
    process.exit(1);
  }
}

archiveList();
