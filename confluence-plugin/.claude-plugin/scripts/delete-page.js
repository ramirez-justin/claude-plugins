#!/usr/bin/env node

/**
 * Delete a Confluence page using direct API calls
 * Usage: node delete-page.js <page-id>
 */

const { getConfluenceClient } = require('./confluence-client');

async function deletePage() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: delete-page.js <page-id>');
    console.error('Example: delete-page.js 123456');
    process.exit(1);
  }

  const pageId = args[0];
  const confluence = getConfluenceClient();

  try {
    await confluence.deletePage(pageId);

    console.log(`✓ Deleted page: ${pageId}`);

  } catch (error) {
    console.error(`Error deleting page ${pageId}:`, error.message);
    process.exit(1);
  }
}

deletePage();
