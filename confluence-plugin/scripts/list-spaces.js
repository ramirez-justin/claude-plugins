#!/usr/bin/env node

/**
 * List Confluence spaces using direct API calls
 * Usage: node list-spaces.js [limit]
 */

const { getConfluenceClient } = require('./confluence-client');

async function listSpaces() {
  const args = process.argv.slice(2);
  const limit = parseInt(args[0]) || 25;

  const confluence = getConfluenceClient();

  try {
    const result = await confluence.getSpaces({ limit });

    if (!result.results || result.results.length === 0) {
      console.log('\nNo spaces found.');
      return;
    }

    console.log(`\nFound ${result.results.length} spaces:\n`);

    result.results.forEach(space => {
      console.log(`${space.name} (${space.key})`);
      console.log(`  ID: ${space.id}`);
      console.log(`  Type: ${space.type}`);
      console.log(`  Status: ${space.status}`);
      if (space.description?.plain?.value) {
        console.log(`  Description: ${space.description.plain.value.substring(0, 100)}${space.description.plain.value.length > 100 ? '...' : ''}`);
      }
      console.log(`  URL: https://${process.env.CONFLUENCE_HOST}/wiki/spaces/${space.key}\n`);
    });

    return result;
  } catch (error) {
    console.error('Error listing spaces:', error.message);
    process.exit(1);
  }
}

listSpaces();
