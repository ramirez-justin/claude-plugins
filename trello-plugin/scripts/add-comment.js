#!/usr/bin/env node

/**
 * Add a comment to a Trello card
 * Usage: node add-comment.js <cardId> <comment>
 */

const { getTrelloClient } = require('./trello-client');

async function addComment() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: add-comment.js <cardId> <comment>');
    console.error('Example: add-comment.js abc123 "Fixed the issue, ready for review"');
    process.exit(1);
  }

  const [cardId, ...commentArgs] = args;
  const comment = commentArgs.join(' ');

  const trello = getTrelloClient();

  try {
    const action = await trello.addComment(cardId, comment);

    console.log('Added comment to card');
    console.log(`  Comment: ${comment}`);
    console.log(`  ID: ${action.id}`);
    console.log(`  Date: ${action.date}`);

    return action;
  } catch (error) {
    console.error('Error adding comment:', error.message);
    process.exit(1);
  }
}

addComment();
