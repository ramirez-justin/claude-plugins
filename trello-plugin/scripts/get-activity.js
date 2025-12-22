#!/usr/bin/env node

/**
 * Get recent activity on the Trello board
 * Usage: node get-activity.js [limit]
 */

const { getTrelloClient } = require('./trello-client');

async function getActivity() {
  const args = process.argv.slice(2);
  const limit = parseInt(args[0]) || 20;

  const trello = getTrelloClient();

  try {
    const activities = await trello.getBoardActivity(undefined, limit);

    if (activities.length === 0) {
      console.log('No recent activity.');
      return [];
    }

    console.log(`Recent Activity (${activities.length}):`);
    console.log('======================');

    activities.forEach(action => {
      const date = new Date(action.date).toLocaleString();
      const member = action.memberCreator?.fullName || action.memberCreator?.username || 'Unknown';
      const type = action.type;

      let description = '';

      switch (type) {
        case 'createCard':
          description = `created card "${action.data.card?.name}"`;
          break;
        case 'updateCard':
          if (action.data.listAfter) {
            description = `moved "${action.data.card?.name}" from ${action.data.listBefore?.name} to ${action.data.listAfter?.name}`;
          } else if (action.data.old?.closed === false) {
            description = `archived card "${action.data.card?.name}"`;
          } else {
            description = `updated card "${action.data.card?.name}"`;
          }
          break;
        case 'commentCard':
          const comment = action.data.text?.substring(0, 50) || '';
          description = `commented on "${action.data.card?.name}": ${comment}...`;
          break;
        case 'addMemberToCard':
          description = `added a member to "${action.data.card?.name}"`;
          break;
        case 'removeMemberFromCard':
          description = `removed a member from "${action.data.card?.name}"`;
          break;
        case 'createList':
          description = `created list "${action.data.list?.name}"`;
          break;
        case 'updateList':
          description = `updated list "${action.data.list?.name}"`;
          break;
        case 'addChecklistToCard':
          description = `added checklist "${action.data.checklist?.name}" to "${action.data.card?.name}"`;
          break;
        case 'updateCheckItemStateOnCard':
          const state = action.data.checkItem?.state === 'complete' ? 'completed' : 'uncompleted';
          description = `${state} "${action.data.checkItem?.name}" on "${action.data.card?.name}"`;
          break;
        default:
          description = type;
      }

      console.log(`\n[${date}] ${member}`);
      console.log(`  ${description}`);
    });

    return activities;
  } catch (error) {
    console.error('Error getting activity:', error.message);
    process.exit(1);
  }
}

getActivity();
