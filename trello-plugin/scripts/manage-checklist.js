#!/usr/bin/env node

/**
 * Manage Trello card checklists
 * Usage:
 *   node manage-checklist.js <cardId> list                     - List all checklists
 *   node manage-checklist.js <cardId> create <name>            - Create new checklist
 *   node manage-checklist.js <cardId> add <checklistId> <item> - Add item to checklist
 *   node manage-checklist.js <cardId> check <itemId>           - Mark item complete
 *   node manage-checklist.js <cardId> uncheck <itemId>         - Mark item incomplete
 */

const { getTrelloClient } = require('./trello-client');

async function manageChecklist() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage:');
    console.error('  manage-checklist.js <cardId> list');
    console.error('  manage-checklist.js <cardId> create <name>');
    console.error('  manage-checklist.js <cardId> add <checklistId> <item>');
    console.error('  manage-checklist.js <cardId> check <itemId>');
    console.error('  manage-checklist.js <cardId> uncheck <itemId>');
    process.exit(1);
  }

  const [cardId, action, ...rest] = args;

  const trello = getTrelloClient();

  try {
    switch (action) {
      case 'list': {
        const checklists = await trello.getCardChecklists(cardId);

        if (checklists.length === 0) {
          console.log('No checklists on this card.');
          return [];
        }

        console.log(`Checklists (${checklists.length}):`);
        console.log('==================');

        checklists.forEach(cl => {
          const complete = cl.checkItems.filter(i => i.state === 'complete').length;
          const total = cl.checkItems.length;
          const pct = total > 0 ? Math.round((complete / total) * 100) : 0;

          console.log(`\n${cl.name} (${complete}/${total} - ${pct}%)`);
          console.log(`  ID: ${cl.id}`);

          cl.checkItems.forEach(item => {
            const status = item.state === 'complete' ? '[x]' : '[ ]';
            console.log(`  ${status} ${item.name} (${item.id})`);
          });
        });

        return checklists;
      }

      case 'create': {
        if (rest.length < 1) {
          console.error('Usage: manage-checklist.js <cardId> create <name>');
          process.exit(1);
        }

        const name = rest.join(' ');
        const checklist = await trello.createChecklist(cardId, name);

        console.log(`Created checklist: ${checklist.name}`);
        console.log(`  ID: ${checklist.id}`);

        return checklist;
      }

      case 'add': {
        if (rest.length < 2) {
          console.error('Usage: manage-checklist.js <cardId> add <checklistId> <item>');
          process.exit(1);
        }

        const [checklistId, ...itemArgs] = rest;
        const itemName = itemArgs.join(' ');
        const item = await trello.addChecklistItem(checklistId, itemName);

        console.log(`Added checklist item: ${item.name}`);
        console.log(`  ID: ${item.id}`);

        return item;
      }

      case 'check': {
        if (rest.length < 1) {
          console.error('Usage: manage-checklist.js <cardId> check <itemId>');
          process.exit(1);
        }

        const [checkItemId] = rest;
        const item = await trello.updateChecklistItem(cardId, checkItemId, { state: 'complete' });

        console.log(`Marked item complete: ${item.name}`);

        return item;
      }

      case 'uncheck': {
        if (rest.length < 1) {
          console.error('Usage: manage-checklist.js <cardId> uncheck <itemId>');
          process.exit(1);
        }

        const [checkItemId] = rest;
        const item = await trello.updateChecklistItem(cardId, checkItemId, { state: 'incomplete' });

        console.log(`Marked item incomplete: ${item.name}`);

        return item;
      }

      default:
        console.error(`Unknown action: ${action}`);
        console.error('Valid actions: list, create, add, check, uncheck');
        process.exit(1);
    }
  } catch (error) {
    console.error('Error managing checklist:', error.message);
    process.exit(1);
  }
}

manageChecklist();
