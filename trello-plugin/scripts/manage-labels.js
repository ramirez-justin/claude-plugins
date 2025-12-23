#!/usr/bin/env node

/**
 * Manage Trello card labels
 * Usage:
 *   node manage-labels.js list                              - List all board labels
 *   node manage-labels.js show <cardId>                     - Show labels on a card
 *   node manage-labels.js add <cardId> <label1> [label2...] - Add labels to card by name
 *   node manage-labels.js remove <cardId> <label1> [label2...] - Remove labels from card
 */

const { getTrelloClient } = require('./trello-client');

async function manageLabels() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage:');
    console.error('  manage-labels.js list');
    console.error('  manage-labels.js show <cardId>');
    console.error('  manage-labels.js add <cardId> "Label1, Label2, ..."');
    console.error('  manage-labels.js remove <cardId> "Label1, Label2, ..."');
    console.error('');
    console.error('Multiple labels should be comma-separated.');
    process.exit(1);
  }

  const [action, ...rest] = args;

  const trello = getTrelloClient();

  try {
    switch (action) {
      case 'list': {
        const labels = await trello.getBoardLabels();

        if (labels.length === 0) {
          console.log('No labels on this board.');
          return [];
        }

        console.log(`Board Labels (${labels.length}):`);
        console.log('==================');

        labels.forEach(label => {
          const name = label.name || '(no name)';
          console.log(`  ${name} (${label.color}) - ID: ${label.id}`);
        });

        return labels;
      }

      case 'show': {
        if (rest.length < 1) {
          console.error('Usage: manage-labels.js show <cardId>');
          process.exit(1);
        }

        const [cardId] = rest;
        const card = await trello.getCard(cardId);

        if (!card.labels || card.labels.length === 0) {
          console.log(`Card "${card.name}" has no labels.`);
          return [];
        }

        console.log(`Labels on "${card.name}":`);
        console.log('==================');

        card.labels.forEach(label => {
          const name = label.name || '(no name)';
          console.log(`  ${name} (${label.color}) - ID: ${label.id}`);
        });

        return card.labels;
      }

      case 'add': {
        if (rest.length < 2) {
          console.error('Usage: manage-labels.js add <cardId> "Label1, Label2, ..."');
          process.exit(1);
        }

        const [cardId, ...labelArgs] = rest;
        const labelInput = labelArgs.join(' ');
        const labelNames = labelInput.split(',').map(l => l.trim()).filter(l => l);

        // Get all board labels for matching
        const boardLabels = await trello.getBoardLabels();
        const addedLabels = [];
        const notFound = [];

        for (const labelName of labelNames) {
          const label = boardLabels.find(l =>
            l.name && l.name.toLowerCase() === labelName.toLowerCase()
          );

          if (!label) {
            notFound.push(labelName);
          } else {
            await trello.addLabelToCard(cardId, label.id);
            addedLabels.push(label.name);
          }
        }

        const card = await trello.getCard(cardId);

        if (addedLabels.length > 0) {
          console.log(`Added labels to "${card.name}": ${addedLabels.join(', ')}`);
        }

        if (notFound.length > 0) {
          console.error(`Labels not found: ${notFound.join(', ')}`);
          console.error('Available labels:');
          boardLabels.filter(l => l.name).forEach(l => console.error(`  - ${l.name}`));
          if (addedLabels.length === 0) process.exit(1);
        }

        return addedLabels;
      }

      case 'remove': {
        if (rest.length < 2) {
          console.error('Usage: manage-labels.js remove <cardId> "Label1, Label2, ..."');
          process.exit(1);
        }

        const [cardId, ...labelArgs] = rest;
        const labelInput = labelArgs.join(' ');
        const labelNames = labelInput.split(',').map(l => l.trim()).filter(l => l);

        // Get card to find the labels
        const card = await trello.getCard(cardId);
        const removedLabels = [];
        const notFound = [];

        for (const labelName of labelNames) {
          const label = card.labels.find(l =>
            l.name && l.name.toLowerCase() === labelName.toLowerCase()
          );

          if (!label) {
            notFound.push(labelName);
          } else {
            await trello.removeLabelFromCard(cardId, label.id);
            removedLabels.push(label.name);
          }
        }

        if (removedLabels.length > 0) {
          console.log(`Removed labels from "${card.name}": ${removedLabels.join(', ')}`);
        }

        if (notFound.length > 0) {
          console.error(`Labels not found on card: ${notFound.join(', ')}`);
          if (card.labels.length > 0) {
            console.error('Labels on this card:');
            card.labels.filter(l => l.name).forEach(l => console.error(`  - ${l.name}`));
          }
          if (removedLabels.length === 0) process.exit(1);
        }

        return removedLabels;
      }

      default:
        console.error(`Unknown action: ${action}`);
        console.error('Valid actions: list, show, add, remove');
        process.exit(1);
    }
  } catch (error) {
    console.error('Error managing labels:', error.message);
    process.exit(1);
  }
}

manageLabels();
