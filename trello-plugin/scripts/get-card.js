#!/usr/bin/env node

/**
 * Get Trello card details
 * Usage: node get-card.js <cardId>
 */

const { getTrelloClient } = require('./trello-client');

async function getCard() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: get-card.js <cardId>');
    console.error('Example: get-card.js abc123');
    process.exit(1);
  }

  const [cardId] = args;

  const trello = getTrelloClient();

  try {
    const card = await trello.getCard(cardId);

    console.log(`Card: ${card.name}`);
    console.log(`  ID: ${card.id}`);
    console.log(`  URL: ${card.shortUrl}`);
    console.log(`  Description: ${card.desc || '(none)'}`);
    console.log(`  Due: ${card.due || '(none)'}`);
    console.log(`  Closed: ${card.closed}`);

    if (card.labels && card.labels.length > 0) {
      console.log(`  Labels: ${card.labels.map(l => l.name || l.color).join(', ')}`);
    }

    if (card.members && card.members.length > 0) {
      console.log(`  Members: ${card.members.map(m => m.fullName || m.username).join(', ')}`);
    }

    if (card.checklists && card.checklists.length > 0) {
      console.log('  Checklists:');
      card.checklists.forEach(cl => {
        const complete = cl.checkItems.filter(i => i.state === 'complete').length;
        const total = cl.checkItems.length;
        console.log(`    - ${cl.name}: ${complete}/${total} complete`);
        cl.checkItems.forEach(item => {
          const status = item.state === 'complete' ? '[x]' : '[ ]';
          console.log(`      ${status} ${item.name}`);
        });
      });
    }

    return card;
  } catch (error) {
    console.error('Error getting card:', error.message);
    process.exit(1);
  }
}

getCard();
