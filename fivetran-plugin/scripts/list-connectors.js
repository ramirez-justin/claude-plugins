#!/usr/bin/env node

/**
 * List all Fivetran connectors for a group with their sync status.
 *
 * Usage: node list-connectors.js [group_id] [--filter <name>] [--paused] [--broken]
 *
 * Options:
 *   group_id          Optional. Overrides FIVETRAN_GROUP_ID env var.
 *   --filter <text>   Filter connectors by name/service containing text.
 *   --paused          Show only paused connectors.
 *   --broken          Show only connectors with errors or sync failures.
 */

const { getFivetranClient, formatConnectorRow } = require('./fivetran-client');

async function main() {
  const args = process.argv.slice(2);
  let groupId = null;
  let filter = null;
  let showPaused = false;
  let showBroken = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--filter' && args[i + 1]) {
      filter = args[++i].toLowerCase();
    } else if (args[i] === '--paused') {
      showPaused = true;
    } else if (args[i] === '--broken') {
      showBroken = true;
    } else if (!args[i].startsWith('--')) {
      groupId = args[i];
    }
  }

  const client = getFivetranClient();

  try {
    let connectors = await client.listConnectors(groupId);

    if (filter) {
      connectors = connectors.filter(c =>
        (c.schema || c.id).toLowerCase().includes(filter) ||
        (c.service || '').toLowerCase().includes(filter)
      );
    }

    if (showPaused) {
      connectors = connectors.filter(c => c.paused);
    }

    if (showBroken) {
      connectors = connectors.filter(c =>
        c.status?.sync_state === 'error' ||
        c.status?.setup_state === 'broken' ||
        c.failed_at
      );
    }

    if (connectors.length === 0) {
      console.log('No connectors found matching criteria.');
      return;
    }

    console.log(`\nFivetran Connectors (${connectors.length} total)\n`);

    const rows = connectors.map(formatConnectorRow);

    // Determine column widths
    const nameWidth = Math.min(40, Math.max(20, ...rows.map(r => r.name.length)) + 2);
    const serviceWidth = Math.min(25, Math.max(10, ...rows.map(r => r.service.length)) + 2);

    const header =
      'ID'.padEnd(30) +
      'NAME'.padEnd(nameWidth) +
      'SERVICE'.padEnd(serviceWidth) +
      'STATE'.padEnd(20) +
      'STATUS'.padEnd(10) +
      'LAST SYNC';
    console.log(header);
    console.log('-'.repeat(header.length + 20));

    for (const row of rows) {
      console.log(
        row.id.padEnd(30) +
        row.name.slice(0, nameWidth - 2).padEnd(nameWidth) +
        row.service.slice(0, serviceWidth - 2).padEnd(serviceWidth) +
        row.status.slice(0, 18).padEnd(20) +
        row.paused.padEnd(10) +
        row.last_sync
      );
    }

    console.log(`\nUse 'node get-connector.js <id>' for details or 'node trigger-sync.js <id>' to sync.`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
