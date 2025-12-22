#!/usr/bin/env node

/**
 * Get cards assigned to the current user
 * Usage: node my-cards.js [--board] [list-filter]
 */

const { getTrelloClient } = require('./trello-client');

async function myCards() {
  const args = process.argv.slice(2);
  const boardOnly = args.includes('--board');
  const listFilter = args.filter(a => a !== '--board').join(' ').toLowerCase();

  const trello = getTrelloClient();

  try {
    let cards;

    if (boardOnly) {
      // Get only cards from the current board
      const boardCards = await trello.getBoardCards();
      const member = await trello.getCurrentMember();

      cards = boardCards.filter(card =>
        card.idMembers && card.idMembers.includes(member.id)
      );
    } else {
      // Get all cards assigned to user across all boards
      cards = await trello.getMyCards();
    }

    // Filter by list name if provided
    if (listFilter) {
      const lists = await trello.getLists();
      const matchingListIds = lists
        .filter(l => l.name.toLowerCase().includes(listFilter))
        .map(l => l.id);

      cards = cards.filter(card => matchingListIds.includes(card.idList));
    }

    if (cards.length === 0) {
      console.log('No cards assigned to you.');
      return [];
    }

    console.log(`Your Cards (${cards.length}):`);
    console.log('================');

    // Group by board/list for better organization
    const grouped = {};
    cards.forEach(card => {
      const key = card.idBoard || 'default';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(card);
    });

    for (const [boardId, boardCards] of Object.entries(grouped)) {
      boardCards.forEach(card => {
        const due = card.due ? ` [Due: ${new Date(card.due).toLocaleDateString()}]` : '';
        const overdue = card.due && new Date(card.due) < new Date() ? ' (OVERDUE)' : '';

        console.log(`\n${card.name}${due}${overdue}`);
        console.log(`  ID: ${card.id}`);
        console.log(`  URL: ${card.shortUrl}`);

        if (card.desc) {
          const shortDesc = card.desc.length > 80 ? card.desc.substring(0, 80) + '...' : card.desc;
          console.log(`  Description: ${shortDesc}`);
        }
      });
    }

    return cards;
  } catch (error) {
    console.error('Error getting your cards:', error.message);
    process.exit(1);
  }
}

myCards();
