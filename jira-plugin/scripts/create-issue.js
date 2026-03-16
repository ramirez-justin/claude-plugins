#!/usr/bin/env node

/**
 * Create a new Jira issue using direct API calls
 * Usage: node create-issue.js <project> <summary> <description> [issueType] [priority] [assignee] [labels]
 *
 * assignee: account ID string
 * labels:   comma-separated label string, e.g. "needs_grooming,backend"
 */

const { getJiraClient, textToAdf } = require('./jira-client');

async function createIssue() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.error('Usage: create-issue.js <project> <summary> <description> [issueType] [priority] [assignee] [labels]');
    console.error('Example: create-issue.js PROJ "Bug in login" "Users cannot login" Bug Major 712020:abc123 "needs_grooming,backend"');
    process.exit(1);
  }

  const [project, summary, description, issueType = 'Task', priority, assignee, labelsArg] = args;

  const jira = getJiraClient();

  try {
    // Jira API v3 format for creating issues
    const issueData = {
      fields: {
        project: {
          key: project
        },
        summary: summary,
        description: textToAdf(description),
        issuetype: {
          name: issueType
        },
      }
    };

    // Only include priority if explicitly provided (avoids "Medium" default mismatch)
    if (priority) {
      issueData.fields.priority = { name: priority };
    }

    // assignee.id per Jira REST API v3 POST /issue spec
    if (assignee) {
      issueData.fields.assignee = { id: assignee };
    }

    // labels is an array of strings
    if (labelsArg) {
      issueData.fields.labels = labelsArg.split(',').map(l => l.trim()).filter(Boolean);
    }

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
