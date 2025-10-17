#!/usr/bin/env node

/**
 * Search for Jira issues using JQL and direct API calls
 * Usage: node search-issues.js <jql-query> [maxResults]
 */

const { getJiraClient } = require('./jira-client');

async function searchIssues() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: search-issues.js <jql-query> [maxResults]');
    console.error('Example: search-issues.js "project = PROJ AND status = Open" 10');
    console.error('Example: search-issues.js "assignee = currentUser() AND status != Done" 20');
    process.exit(1);
  }

  const jql = args[0];
  const maxResults = parseInt(args[1]) || 50;
  const jira = getJiraClient();

  try {
    const result = await jira.searchIssues(jql, {
      maxResults: maxResults,
      fields: ['summary', 'status', 'assignee', 'priority', 'issuetype', 'updated']
    });

    console.log(`\nFound ${result.total} issues (showing ${result.issues.length}):\n`);

    result.issues.forEach(issue => {
      console.log(`${issue.key}: ${issue.fields.summary}`);
      console.log(`  Status: ${issue.fields.status.name} | Type: ${issue.fields.issuetype.name} | Priority: ${issue.fields.priority?.name || 'None'}`);
      console.log(`  Assignee: ${issue.fields.assignee?.displayName || 'Unassigned'}`);
      console.log(`  URL: https://${process.env.JIRA_HOST}/browse/${issue.key}\n`);
    });

    return result;
  } catch (error) {
    console.error('Error searching issues:', error.message);
    process.exit(1);
  }
}

searchIssues();
