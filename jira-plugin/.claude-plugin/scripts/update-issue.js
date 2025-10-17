#!/usr/bin/env node

/**
 * Update a Jira issue using direct API calls
 * Usage: node update-issue.js <issue-key> <field> <value>
 */

const { getJiraClient } = require('./jira-client');

async function updateIssue() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.error('Usage: update-issue.js <issue-key> <field> <value>');
    console.error('Example: update-issue.js PROJ-123 summary "New summary text"');
    console.error('Example: update-issue.js PROJ-123 priority High');
    console.error('\nSupported fields: summary, description, priority, assignee');
    process.exit(1);
  }

  const [issueKey, field, ...valueParts] = args;
  const value = valueParts.join(' ');

  const jira = getJiraClient();

  try {
    const updateData = { fields: {} };

    // Handle different field types
    switch (field.toLowerCase()) {
      case 'summary':
        updateData.fields[field.toLowerCase()] = value;
        break;
      case 'description':
        // Use ADF format for description
        updateData.fields.description = {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: value
                }
              ]
            }
          ]
        };
        break;
      case 'priority':
        updateData.fields.priority = { name: value };
        break;
      case 'assignee':
        updateData.fields.assignee = { name: value };
        break;
      default:
        console.error(`Unknown field: ${field}`);
        console.error('Supported fields: summary, description, priority, assignee');
        process.exit(1);
    }

    await jira.updateIssue(issueKey, updateData);

    console.log(`✓ Updated ${issueKey}`);
    console.log(`  ${field}: ${value}`);
    console.log(`  URL: https://${process.env.JIRA_HOST}/browse/${issueKey}`);

  } catch (error) {
    console.error(`Error updating issue ${issueKey}:`, error.message);
    process.exit(1);
  }
}

updateIssue();
