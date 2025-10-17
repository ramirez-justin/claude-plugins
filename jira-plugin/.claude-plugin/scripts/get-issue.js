#!/usr/bin/env node

/**
 * Get details of a Jira issue using direct API calls
 * Usage: node get-issue.js <issue-key>
 */

const { getJiraClient } = require('./jira-client');

async function getIssue() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: get-issue.js <issue-key>');
    console.error('Example: get-issue.js PROJ-123');
    process.exit(1);
  }

  const issueKey = args[0];
  const jira = getJiraClient();

  try {
    const issue = await jira.getIssue(issueKey);

    console.log(`\n${issue.key}: ${issue.fields.summary}`);
    console.log(`URL: https://${process.env.JIRA_HOST}/browse/${issue.key}`);
    console.log(`Status: ${issue.fields.status.name}`);
    console.log(`Type: ${issue.fields.issuetype.name}`);
    console.log(`Priority: ${issue.fields.priority?.name || 'None'}`);
    console.log(`Assignee: ${issue.fields.assignee?.displayName || 'Unassigned'}`);
    console.log(`Reporter: ${issue.fields.reporter.displayName}`);
    console.log(`Created: ${new Date(issue.fields.created).toLocaleDateString()}`);
    console.log(`Updated: ${new Date(issue.fields.updated).toLocaleDateString()}`);

    // Handle both old text format and new ADF format for description
    if (issue.fields.description) {
      let descText = '';
      if (typeof issue.fields.description === 'string') {
        descText = issue.fields.description;
      } else if (issue.fields.description.content) {
        // Extract text from ADF format
        descText = issue.fields.description.content
          .map(block => block.content?.map(c => c.text).join('') || '')
          .join('\n');
      }
      if (descText) {
        console.log(`\nDescription:\n${descText}`);
      }
    }

    if (issue.fields.comment?.comments?.length > 0) {
      console.log(`\nComments (${issue.fields.comment.comments.length}):`);
      issue.fields.comment.comments.slice(-3).forEach(comment => {
        let commentText = '';
        if (typeof comment.body === 'string') {
          commentText = comment.body;
        } else if (comment.body.content) {
          commentText = comment.body.content
            .map(block => block.content?.map(c => c.text).join('') || '')
            .join(' ');
        }
        console.log(`  - ${comment.author.displayName}: ${commentText.substring(0, 100)}${commentText.length > 100 ? '...' : ''}`);
      });
    }

    return issue;
  } catch (error) {
    console.error(`Error fetching issue ${issueKey}:`, error.message);
    process.exit(1);
  }
}

getIssue();
