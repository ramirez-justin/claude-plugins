#!/usr/bin/env node

/**
 * Trigger a manual sync for a Fivetran connector.
 *
 * Usage: node trigger-sync.js <connector_id> [--force]
 *
 * Options:
 *   --force   Sync even if the connector is paused.
 */

const { getFivetranClient } = require('./fivetran-client');

async function main() {
  const args = process.argv.slice(2);
  const connectorId = args.find(a => !a.startsWith('--'));
  const force = args.includes('--force');

  if (!connectorId) {
    console.error('Usage: node trigger-sync.js <connector_id> [--force]');
    console.error('Run list-connectors.js to find connector IDs.');
    process.exit(1);
  }

  const client = getFivetranClient();

  try {
    // Fetch current state first so we can show what we're triggering
    const current = await client.getConnector(connectorId);
    const c = current.data;
    const name = c?.schema || connectorId;

    if (c?.paused && !force) {
      console.error(`Connector "${name}" is currently paused.`);
      console.error('Use --force to sync anyway, or resume the connector first.');
      process.exit(1);
    }

    console.log(`Triggering sync for "${name}" (${connectorId})...`);

    await client.triggerSync(connectorId, force);

    console.log(`Sync triggered successfully.`);

    if (force && c?.paused) {
      console.log(`Note: Connector is paused but --force was used. This is a one-time sync.`);
    }

    console.log(`\nCheck status: node get-connector.js ${connectorId}`);
    console.log(`View history: node sync-history.js ${connectorId}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
