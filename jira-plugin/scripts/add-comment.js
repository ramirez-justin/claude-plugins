#!/usr/bin/env node

/**
 * Add a comment to a Jira issue using direct API calls
 * Usage: node add-comment.js <issue-key> <comment>
 */

const { getJiraClient } = require('./jira-client');

async function addComment() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: add-comment.js <issue-key> <comment>');
    console.error('Example: add-comment.js PROJ-123 "This is a comment"');
    process.exit(1);
  }

  const [issueKey, ...commentParts] = args;
  const comment = commentParts.join(' ');

  const jira = getJiraClient();

  try {
    await jira.addComment(issueKey, comment);

    console.log(`✓ Added comment to ${issueKey}`);
    console.log(`  Comment: ${comment}`);
    console.log(`  URL: https://${process.env.JIRA_HOST}/browse/${issueKey}`);

  } catch (error) {
    console.error(`Error adding comment to ${issueKey}:`, error.message);
    process.exit(1);
  }
}

addComment();
