#!/usr/bin/env node

/**
 * Show current sync status and last known outcomes for a Fivetran connection.
 *
 * Note: The Fivetran REST API does not expose a sync history log endpoint.
 * This script shows what's available: the current status, last success/failure
 * timestamps, and any active tasks or warnings from the connection state.
 *
 * For detailed sync logs, use the Fivetran dashboard or configure a log service
 * (Fivetran supports forwarding logs to Datadog, Splunk, etc.).
 *
 * Usage: node sync-history.js <connector_id>
 */

const { getFivetranClient } = require('./fivetran-client');

async function main() {
  const connectorId = process.argv[2];

  if (!connectorId) {
    console.error('Usage: node sync-history.js <connector_id>');
    console.error('Run list-connectors.js to find connection IDs.');
    process.exit(1);
  }

  const client = getFivetranClient();

  try {
    const response = await client.getConnector(connectorId);
    const c = response.data;

    if (!c) {
      console.error(`Connection not found: ${connectorId}`);
      process.exit(1);
    }

    const name = c.schema || c.id;
    console.log(`\n=== Sync Status: ${name} ===\n`);

    console.log(`Sync State:   ${c.status?.sync_state || 'unknown'}`);
    console.log(`Update State: ${c.status?.update_state || 'unknown'}`);
    console.log(`Paused:       ${c.paused ? 'yes' : 'no'}`);

    if (c.succeeded_at) {
      console.log(`\nLast Success: ${new Date(c.succeeded_at).toLocaleString()}`);
    } else {
      console.log('\nLast Success: never');
    }

    if (c.failed_at) {
      console.log(`Last Failure: ${new Date(c.failed_at).toLocaleString()}`);
    }

    if (c.sync_frequency) {
      const nextSync = c.next_sync_time
        ? new Date(c.next_sync_time).toLocaleString()
        : `every ${c.sync_frequency} minutes`;
      console.log(`Next Sync:    ${nextSync}`);
    }

    if (c.status?.tasks && c.status.tasks.length > 0) {
      console.log('\nActive Tasks:');
      for (const task of c.status.tasks) {
        console.log(`  [${task.code}] ${task.message}`);
      }
    }

    if (c.status?.warnings && c.status.warnings.length > 0) {
      console.log('\nWarnings:');
      for (const warn of c.status.warnings) {
        console.log(`  [${warn.code}] ${warn.message}`);
      }
    }

    console.log(`\nNote: Full sync logs are only available in the Fivetran dashboard.`);
    console.log(`Dashboard: https://fivetran.com/dashboard/connectors/${c.id}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
