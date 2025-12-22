#!/usr/bin/env node

/**
 * Get comments on a Trello card
 * Usage: node get-comments.js <cardId>
 */

const { getTrelloClient } = require('./trello-client');

async function getComments() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: get-comments.js <cardId>');
    console.error('Example: get-comments.js abc123');
    process.exit(1);
  }

  const [cardId] = args;

  const trello = getTrelloClient();

  try {
    const comments = await trello.getCardComments(cardId);

    if (comments.length === 0) {
      console.log('No comments on this card.');
      return [];
    }

    console.log(`Comments (${comments.length}):`);
    console.log('================');

    comments.forEach(comment => {
      const date = new Date(comment.date).toLocaleString();
      const author = comment.memberCreator?.fullName || comment.memberCreator?.username || 'Unknown';
      console.log(`\n[${date}] ${author}:`);
      console.log(`  ${comment.data.text}`);
      console.log(`  ID: ${comment.id}`);
    });

    return comments;
  } catch (error) {
    console.error('Error getting comments:', error.message);
    process.exit(1);
  }
}

getComments();
