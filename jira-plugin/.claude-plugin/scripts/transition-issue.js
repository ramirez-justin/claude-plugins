#!/usr/bin/env node

/**
 * Transition a Jira issue to a new status using direct API calls
 * Usage: node transition-issue.js <issue-key> <transition-name>
 */

const { getJiraClient } = require('./jira-client');

async function transitionIssue() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: transition-issue.js <issue-key> <transition-name>');
    console.error('Example: transition-issue.js PROJ-123 "In Progress"');
    console.error('Example: transition-issue.js PROJ-123 Done');
    console.error('\nTo see available transitions, run: transition-issue.js <issue-key> list');
    process.exit(1);
  }

  const [issueKey, ...transitionParts] = args;
  const transitionName = transitionParts.join(' ');

  const jira = getJiraClient();

  try {
    // Get available transitions
    const transitionsData = await jira.getTransitions(issueKey);

    // If user wants to list transitions
    if (transitionName.toLowerCase() === 'list') {
      console.log(`\nAvailable transitions for ${issueKey}:`);
      transitionsData.transitions.forEach(t => {
        console.log(`  - ${t.name} (id: ${t.id})`);
      });
      return;
    }

    // Find the transition ID
    const transition = transitionsData.transitions.find(
      t => t.name.toLowerCase() === transitionName.toLowerCase()
    );

    if (!transition) {
      console.error(`Error: Transition "${transitionName}" not found for ${issueKey}`);
      console.error('\nAvailable transitions:');
      transitionsData.transitions.forEach(t => {
        console.error(`  - ${t.name}`);
      });
      process.exit(1);
    }

    // Perform the transition
    await jira.transitionIssue(issueKey, {
      transition: { id: transition.id }
    });

    console.log(`✓ Transitioned ${issueKey} to "${transition.name}"`);
    console.log(`  URL: https://${process.env.JIRA_HOST}/browse/${issueKey}`);

  } catch (error) {
    console.error(`Error transitioning issue ${issueKey}:`, error.message);
    process.exit(1);
  }
}

transitionIssue();
