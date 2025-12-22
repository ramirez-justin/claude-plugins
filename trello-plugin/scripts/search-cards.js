#!/usr/bin/env node

/**
 * Search Trello cards
 * Usage: node search-cards.js <query> [--all-boards]
 */

const { getTrelloClient } = require('./trello-client');

async function searchCards() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: search-cards.js <query> [--all-boards]');
    console.error('Example: search-cards.js "login bug"');
    console.error('Example: search-cards.js "authentication" --all-boards');
    process.exit(1);
  }

  const allBoards = args.includes('--all-boards');
  const query = args.filter(a => a !== '--all-boards').join(' ');

  const trello = getTrelloClient();

  try {
    const options = allBoards ? { idBoards: 'mine' } : {};
    const results = await trello.search(query, options);

    const cards = results.cards || [];

    if (cards.length === 0) {
      console.log(`No cards found for: "${query}"`);
      return [];
    }

    console.log(`Search Results (${cards.length} cards):`);
    console.log('=========================');

    cards.forEach(card => {
      const board = card.board?.name || 'Unknown board';
      const list = card.list?.name || 'Unknown list';
      const due = card.due ? ` [Due: ${new Date(card.due).toLocaleDateString()}]` : '';

      console.log(`\n${card.name}${due}`);
      console.log(`  ID: ${card.id}`);
      console.log(`  Board: ${board}`);
      console.log(`  List: ${list}`);
      console.log(`  URL: ${card.shortUrl}`);

      if (card.desc) {
        const shortDesc = card.desc.length > 100 ? card.desc.substring(0, 100) + '...' : card.desc;
        console.log(`  Description: ${shortDesc}`);
      }
    });

    return cards;
  } catch (error) {
    console.error('Error searching cards:', error.message);
    process.exit(1);
  }
}

searchCards();
