#!/usr/bin/env node

/**
 * Create a new Jira issue using direct API calls
 * Usage: node create-issue.js <project> <summary> <description> [issueType] [priority]
 */

const { getJiraClient } = require('./jira-client');

async function createIssue() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.error('Usage: create-issue.js <project> <summary> <description> [issueType] [priority]');
    console.error('Example: create-issue.js PROJ "Bug in login" "Users cannot login" Bug High');
    process.exit(1);
  }

  const [project, summary, description, issueType = 'Task', priority = 'Medium'] = args;

  const jira = getJiraClient();

  try {
    // Jira API v3 format for creating issues
    const issueData = {
      fields: {
        project: {
          key: project
        },
        summary: summary,
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: description
                }
              ]
            }
          ]
        },
        issuetype: {
          name: issueType
        },
        priority: {
          name: priority
        }
      }
    };

    const issue = await jira.createIssue(issueData);

    console.log(`✓ Created issue: ${issue.key}`);
    console.log(`  URL: https://${process.env.JIRA_HOST}/browse/${issue.key}`);
    console.log(`  Summary: ${summary}`);

    return issue;
  } catch (error) {
    console.error('Error creating issue:', error.message);
    process.exit(1);
  }
}

createIssue();
