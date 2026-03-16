#!/usr/bin/env node

/**
 * Delete a Jira issue using direct API calls
 * Usage: node delete-issue.js <issue-key> [deleteSubtasks]
 *
 * deleteSubtasks: true|false (default: false)
 *   An issue with subtasks cannot be deleted unless deleteSubtasks is true.
 */

const { getJiraClient } = require('./jira-client');

async function deleteIssue() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: delete-issue.js <issue-key> [deleteSubtasks]');
    console.error('Example: delete-issue.js PROJ-123');
    console.error('Example: delete-issue.js PROJ-123 true');
    process.exit(1);
  }

  const [issueKey, deleteSubtasksArg = 'false'] = args;
  const deleteSubtasks = deleteSubtasksArg === 'true';

  const jira = getJiraClient();

  try {
    await jira.deleteIssue(issueKey, deleteSubtasks);

    console.log(`✓ Deleted issue: ${issueKey}`);
  } catch (error) {
    console.error(`Error deleting issue ${issueKey}:`, error.message);
    process.exit(1);
  }
}

deleteIssue();
