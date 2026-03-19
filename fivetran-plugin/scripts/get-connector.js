#!/usr/bin/env node

/**
 * Get detailed information about a specific Fivetran connector.
 * Shows sync status, config, schedule, and recent errors.
 *
 * Usage: node get-connector.js <connector_id>
 */

const { getFivetranClient } = require('./fivetran-client');

async function main() {
  const connectorId = process.argv[2];

  if (!connectorId) {
    console.error('Usage: node get-connector.js <connector_id>');
    console.error('Run list-connectors.js to find connector IDs.');
    process.exit(1);
  }

  const client = getFivetranClient();

  try {
    const response = await client.getConnector(connectorId);
    const c = response.data;

    if (!c) {
      console.error(`Connector not found: ${connectorId}`);
      process.exit(1);
    }

    console.log(`\n=== Connector: ${c.schema || c.id} ===\n`);
    console.log(`ID:           ${c.id}`);
    console.log(`Service:      ${c.service}`);
    console.log(`Schema:       ${c.schema}`);
    console.log(`Status:       ${c.paused ? 'PAUSED' : 'ACTIVE'}`);
    console.log(`Sync State:   ${c.status?.sync_state || 'unknown'}`);
    console.log(`Setup State:  ${c.status?.setup_state || 'unknown'}`);
    console.log(`Update State: ${c.status?.update_state || 'unknown'}`);

    if (c.status?.is_historical_sync !== undefined) {
      console.log(`Historical:   ${c.status.is_historical_sync ? 'yes (initial load in progress)' : 'no'}`);
    }

    if (c.succeeded_at) {
      console.log(`\nLast Success: ${new Date(c.succeeded_at).toLocaleString()}`);
    }
    if (c.failed_at) {
      console.log(`Last Failure: ${new Date(c.failed_at).toLocaleString()}`);
    }

    if (c.sync_frequency) {
      console.log(`\nSync Every:   ${c.sync_frequency} minutes`);
    }
    if (c.schedule_type) {
      console.log(`Schedule:     ${c.schedule_type}`);
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

    if (c.config && Object.keys(c.config).length > 0) {
      console.log('\nConfig (non-sensitive):');
      const safeKeys = ['schema', 'table', 'report_type', 'frequency_type', 'start_date', 'end_date'];
      for (const key of safeKeys) {
        if (c.config[key] !== undefined) {
          console.log(`  ${key}: ${c.config[key]}`);
        }
      }
    }

    console.log(`\nView in dashboard: https://fivetran.com/dashboard/connectors/${c.id}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
