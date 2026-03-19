#!/usr/bin/env node

/**
 * List all Fivetran groups (destinations/warehouses).
 * Useful for finding your group_id to set in FIVETRAN_GROUP_ID.
 *
 * Usage: node list-groups.js
 */

const { getFivetranClient } = require('./fivetran-client');

async function main() {
  const client = getFivetranClient();

  try {
    const response = await client.listGroups();
    const groups = response.data?.items || [];

    if (groups.length === 0) {
      console.log('No groups found.');
      return;
    }

    console.log(`\nFivetran Groups (${groups.length} total)\n`);
    console.log('ID'.padEnd(30) + 'NAME'.padEnd(40) + 'CREATED');
    console.log('-'.repeat(90));

    for (const group of groups) {
      const created = group.created_at
        ? new Date(group.created_at).toLocaleDateString()
        : 'unknown';
      console.log(
        group.id.padEnd(30) +
        (group.name || group.id).padEnd(40) +
        created
      );
    }

    console.log(`\nTip: Set FIVETRAN_GROUP_ID=<id> in your settings.json to use /fivetran-connectors without specifying a group.`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
