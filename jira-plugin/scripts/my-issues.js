#!/usr/bin/env node

/**
 * Get issues assigned to the current user using direct API calls
 * Usage: node my-issues.js [status]
 */

const { getJiraClient } = require('./jira-client');

async function getMyIssues() {
  const args = process.argv.slice(2);
  const status = args[0] || 'Open'; // Default to Open issues

  const jira = getJiraClient();

  try {
    // Build JQL query
    let jql = 'assignee = currentUser()';

    if (status.toLowerCase() !== 'all') {
      jql += ` AND status = "${status}"`;
    }

    jql += ' ORDER BY updated DESC';

    const result = await jira.searchIssues(jql, {
      maxResults: 50,
      fields: ['summary', 'status', 'priority', 'issuetype', 'updated', 'project']
    });

    if (result.issues.length === 0) {
      console.log(`\nNo ${status} issues assigned to you.`);
      return;
    }

    console.log(`\nYour ${status} issues (${result.issues.length}):\n`);

    result.issues.forEach(issue => {
      console.log(`${issue.key}: ${issue.fields.summary}`);
      console.log(`  Project: ${issue.fields.project.name} | Status: ${issue.fields.status.name} | Priority: ${issue.fields.priority?.name || 'None'}`);
      console.log(`  Updated: ${new Date(issue.fields.updated).toLocaleDateString()}`);
      console.log(`  URL: https://${process.env.JIRA_HOST}/browse/${issue.key}\n`);
    });

    return result;
  } catch (error) {
    console.error('Error fetching your issues:', error.message);
    process.exit(1);
  }
}

getMyIssues();
