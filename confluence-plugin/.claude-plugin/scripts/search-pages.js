#!/usr/bin/env node

/**
 * Search for Confluence pages using direct API calls
 * Usage: node search-pages.js [options]
 */

const { getConfluenceClient } = require('./confluence-client');

async function searchPages() {
  const args = process.argv.slice(2);

  const options = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];

    if (key === 'space-id') options.spaceId = value;
    else if (key === 'title') options.title = value;
    else if (key === 'limit') options.limit = parseInt(value);
  }

  if (Object.keys(options).length === 0) {
    console.error('Usage: search-pages.js [--space-id <id>] [--title <title>] [--limit <number>]');
    console.error('Example: search-pages.js --space-id 123456');
    console.error('Example: search-pages.js --title "Getting Started"');
    console.error('Example: search-pages.js --space-id 123456 --limit 10');
    process.exit(1);
  }

  const confluence = getConfluenceClient();

  try {
    const result = await confluence.searchPages(options);

    if (!result.results || result.results.length === 0) {
      console.log('\nNo pages found.');
      return;
    }

    console.log(`\nFound ${result.results.length} pages:\n`);

    result.results.forEach(page => {
      console.log(`${page.title} (ID: ${page.id})`);
      console.log(`  Space: ${page.spaceId}`);
      console.log(`  Status: ${page.status}`);
      console.log(`  URL: https://${process.env.CONFLUENCE_HOST}/wiki/spaces/${page.spaceId}/pages/${page.id}\n`);
    });

    return result;
  } catch (error) {
    console.error('Error searching pages:', error.message);
    process.exit(1);
  }
}

searchPages();
