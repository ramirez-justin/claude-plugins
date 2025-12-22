#!/usr/bin/env node

/**
 * Create a new Trello card
 * Usage: node create-card.js <listId> <name> [description] [due] [labels]
 */

const { getTrelloClient } = require('./trello-client');

async function createCard() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: create-card.js <listId> <name> [description] [due] [labels]');
    console.error('Example: create-card.js abc123 "Fix login bug" "Users cannot login with special chars" "2024-12-31"');
    process.exit(1);
  }

  const [listId, name, description = '', due = null, labels = null] = args;

  const trello = getTrelloClient();

  try {
    const cardData = {
      idList: listId,
      name: name,
      desc: description
    };

    if (due) cardData.due = due;
    if (labels) cardData.idLabels = labels;

    const card = await trello.createCard(cardData);

    console.log(`Created card: ${card.name}`);
    console.log(`  ID: ${card.id}`);
    console.log(`  URL: ${card.shortUrl}`);
    if (card.due) console.log(`  Due: ${card.due}`);

    return card;
  } catch (error) {
    console.error('Error creating card:', error.message);
    process.exit(1);
  }
}

createCard();
