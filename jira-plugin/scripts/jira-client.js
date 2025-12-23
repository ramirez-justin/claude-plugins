#!/usr/bin/env node

/**
 * Direct Jira API client using Node.js built-in https module
 * No external dependencies - uses OpenAPI spec endpoints directly
 */

const https = require('https');
const { execSync } = require('child_process');

/**
 * Resolve environment variable value, handling 1Password references
 * If value starts with 'op://', uses 1Password CLI to retrieve the secret
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

class JiraClient {
  constructor() {
    // Check for required environment variables
    const required = ['JIRA_HOST', 'JIRA_EMAIL', 'JIRA_API_TOKEN'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
      console.error(`Error: Missing required environment variables: ${missing.join(', ')}`);
      console.error('\nPlease set the following in your .claude/settings.json:');
      console.error(JSON.stringify({
        "env": {
          "JIRA_HOST": "your-domain.atlassian.net",
          "JIRA_EMAIL": "your-email@example.com",
          "JIRA_API_TOKEN": "your-api-token"
        }
      }, null, 2));
      process.exit(1);
    }

    this.host = resolveEnvValue(process.env.JIRA_HOST);
    this.email = resolveEnvValue(process.env.JIRA_EMAIL);
    this.apiToken = resolveEnvValue(process.env.JIRA_API_TOKEN);
    this.baseUrl = `/rest/api/3`;
  }

  /**
   * Make an HTTP request to Jira API
   */
  async request(method, path, body = null) {
    return new Promise((resolve, reject) => {
      const auth = Buffer.from(`${this.email}:${this.apiToken}`).toString('base64');

      const options = {
        hostname: this.host,
        port: 443,
        path: `${this.baseUrl}${path}`,
        method: method,
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const parsed = data ? JSON.parse(data) : {};
              resolve(parsed);
            } catch (e) {
              resolve(data);
            }
          } else {
            try {
              const error = JSON.parse(data);
              reject(new Error(`HTTP ${res.statusCode}: ${error.errorMessages?.join(', ') || error.message || data}`));
            } catch (e) {
              reject(new Error(`HTTP ${res.statusCode}: ${data}`));
            }
          }
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      if (body) {
        req.write(JSON.stringify(body));
      }

      req.end();
    });
  }

  /**
   * GET /rest/api/3/issue/{issueIdOrKey}
   */
  async getIssue(issueKey) {
    return this.request('GET', `/issue/${issueKey}`);
  }

  /**
   * POST /rest/api/3/issue
   */
  async createIssue(issueData) {
    return this.request('POST', '/issue', issueData);
  }

  /**
   * PUT /rest/api/3/issue/{issueIdOrKey}
   */
  async updateIssue(issueKey, updateData) {
    return this.request('PUT', `/issue/${issueKey}`, updateData);
  }

  /**
   * GET /rest/api/3/search/jql
   */
  async searchIssues(jql, options = {}) {
    const params = new URLSearchParams({
      jql: jql,
      maxResults: options.maxResults || 50,
      fields: options.fields?.join(',') || '*all'
    });
    return this.request('GET', `/search/jql?${params.toString()}`);
  }

  /**
   * POST /rest/api/3/issue/{issueIdOrKey}/comment
   * Note: API v3 requires Atlassian Document Format (ADF) for comment body
   */
  async addComment(issueKey, commentText) {
    // Convert plain text to ADF format required by API v3
    const adfBody = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: commentText
            }
          ]
        }
      ]
    };
    return this.request('POST', `/issue/${issueKey}/comment`, {
      body: adfBody
    });
  }

  /**
   * GET /rest/api/3/issue/{issueIdOrKey}/transitions
   */
  async getTransitions(issueKey) {
    return this.request('GET', `/issue/${issueKey}/transitions`);
  }

  /**
   * POST /rest/api/3/issue/{issueIdOrKey}/transitions
   */
  async transitionIssue(issueKey, transitionData) {
    return this.request('POST', `/issue/${issueKey}/transitions`, transitionData);
  }

  /**
   * GET /rest/api/3/myself
   */
  async getCurrentUser() {
    return this.request('GET', '/myself');
  }
}

function getJiraClient() {
  return new JiraClient();
}

module.exports = { getJiraClient, JiraClient };
