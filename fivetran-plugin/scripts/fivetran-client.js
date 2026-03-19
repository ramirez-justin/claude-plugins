#!/usr/bin/env node

/**
 * Direct Fivetran API client using Node.js built-in https module.
 * No external dependencies - uses Fivetran REST API v1 directly.
 *
 * Auth: Basic auth with API key + secret (base64 encoded)
 * Docs: https://fivetran.com/docs/rest-api
 */

const https = require('https');
const { execSync } = require('child_process');

/**
 * Resolve environment variable value, handling 1Password references.
 * If value starts with 'op://', uses 1Password CLI to retrieve the secret.
 */
function resolveEnvValue(value) {
  if (!value) return value;
  if (value.startsWith('op://')) {
    try {
      return execSync(`op read "${value}"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    } catch (error) {
      console.error(`Error resolving 1Password reference: ${value}`);
      console.error('Make sure 1Password CLI is installed and you are signed in.');
      console.error('Install: https://developer.1password.com/docs/cli/get-started/');
      process.exit(1);
    }
  }
  return value;
}

class FivetranClient {
  constructor() {
    const required = ['FIVETRAN_API_KEY', 'FIVETRAN_API_SECRET'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
      console.error(`Error: Missing required environment variables: ${missing.join(', ')}`);
      console.error('\nPlease set the following in your .claude/settings.json under "env":');
      console.error(JSON.stringify({
        "FIVETRAN_API_KEY": "your-api-key",
        "FIVETRAN_API_SECRET": "your-api-secret",
        "FIVETRAN_GROUP_ID": "your-group-id (optional, needed for listing connectors)"
      }, null, 2));
      console.error('\nGet your API credentials at: https://fivetran.com/account/settings > API Config');
      process.exit(1);
    }

    this.apiKey = resolveEnvValue(process.env.FIVETRAN_API_KEY);
    this.apiSecret = resolveEnvValue(process.env.FIVETRAN_API_SECRET);
    this.groupId = resolveEnvValue(process.env.FIVETRAN_GROUP_ID || '');
    this.hostname = 'api.fivetran.com';
    this.basePath = '/v1';
  }

  /**
   * Make an HTTPS request to the Fivetran API.
   */
  async request(method, path, body = null, queryParams = {}) {
    return new Promise((resolve, reject) => {
      const auth = Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64');

      const params = new URLSearchParams(queryParams);
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const fullPath = `${this.basePath}${path}${queryString}`;

      const options = {
        hostname: this.hostname,
        port: 443,
        path: fullPath,
        method: method,
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => { data += chunk; });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(data ? JSON.parse(data) : {});
            } catch (e) {
              resolve(data);
            }
          } else {
            try {
              const error = JSON.parse(data);
              reject(new Error(`HTTP ${res.statusCode}: ${error.message || JSON.stringify(error)}`));
            } catch (e) {
              reject(new Error(`HTTP ${res.statusCode}: ${data}`));
            }
          }
        });
      });

      req.on('error', reject);

      if (body) {
        req.write(JSON.stringify(body));
      }

      req.end();
    });
  }

  /**
   * GET /v1/groups - List all destinations/groups.
   */
  async listGroups() {
    return this.request('GET', '/groups', null, { limit: 100 });
  }

  /**
   * GET /v1/groups/{group_id}/connections - List connections for a group.
   * Handles pagination automatically.
   */
  async listConnectors(groupId = null) {
    const gid = groupId || this.groupId;
    if (!gid) {
      throw new Error(
        'group_id is required. Set FIVETRAN_GROUP_ID in your settings or pass it as an argument.\n' +
        'Run: node list-groups.js to find your group ID.'
      );
    }

    const connectors = [];
    let cursor = null;

    do {
      const params = { limit: 100 };
      if (cursor) params.cursor = cursor;

      const response = await this.request('GET', `/groups/${gid}/connections`, null, params);
      const items = response.data?.items || [];
      connectors.push(...items);

      cursor = response.data?.next_cursor || null;
    } while (cursor);

    return connectors;
  }

  /**
   * GET /v1/connections/{connectionId} - Get connection details including sync status.
   */
  async getConnector(connectorId) {
    return this.request('GET', `/connections/${connectorId}`);
  }

  /**
   * POST /v1/connections/{connectionId}/sync - Trigger a manual sync.
   * Set force=true to stop any in-progress sync and re-run.
   */
  async triggerSync(connectorId, force = false) {
    return this.request('POST', `/connections/${connectorId}/sync`, { force });
  }

  /**
   * GET /v1/connections/{connectionId}/schemas - Get schema config for a connection.
   */
  async getSchemas(connectorId) {
    return this.request('GET', `/connections/${connectorId}/schemas`);
  }

  /**
   * PATCH /v1/connections/{connectionId} - Update connection config (pause/resume, schedule).
   */
  async updateConnector(connectorId, updates) {
    return this.request('PATCH', `/connections/${connectorId}`, updates);
  }
}

function getFivetranClient() {
  return new FivetranClient();
}

/**
 * Format a sync status object into a readable string.
 */
function formatSyncStatus(status) {
  if (!status) return 'unknown';
  const { sync_state, setup_state, update_state, is_historical_sync } = status;
  const parts = [sync_state || 'unknown'];
  if (setup_state && setup_state !== 'connected') parts.push(`setup:${setup_state}`);
  if (update_state && update_state !== 'on_schedule') parts.push(`update:${update_state}`);
  if (is_historical_sync) parts.push('historical');
  return parts.join(', ');
}

/**
 * Format a connector row for table output.
 */
function formatConnectorRow(connector) {
  const status = formatSyncStatus(connector.status);
  const lastSync = connector.succeeded_at
    ? new Date(connector.succeeded_at).toLocaleString()
    : connector.failed_at
      ? `failed ${new Date(connector.failed_at).toLocaleString()}`
      : 'never';

  return {
    id: connector.id,
    name: connector.schema || connector.id,
    service: connector.service,
    status,
    paused: connector.paused ? 'paused' : 'active',
    last_sync: lastSync
  };
}

module.exports = { getFivetranClient, FivetranClient, formatSyncStatus, formatConnectorRow };
