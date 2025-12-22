#!/usr/bin/env node

/**
 * Direct Confluence API client using Node.js built-in https module
 * No external dependencies - uses OpenAPI spec endpoints directly
 */

const https = require('https');

class ConfluenceClient {
  constructor() {
    // Check for required environment variables
    const required = ['CONFLUENCE_HOST', 'CONFLUENCE_EMAIL', 'CONFLUENCE_API_TOKEN'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
      console.error(`Error: Missing required environment variables: ${missing.join(', ')}`);
      console.error('\nPlease set the following in your .claude/settings.json:');
      console.error(JSON.stringify({
        "env": {
          "CONFLUENCE_HOST": "your-domain.atlassian.net",
          "CONFLUENCE_EMAIL": "your-email@example.com",
          "CONFLUENCE_API_TOKEN": "your-api-token"
        }
      }, null, 2));
      process.exit(1);
    }

    this.host = process.env.CONFLUENCE_HOST;
    this.email = process.env.CONFLUENCE_EMAIL;
    this.apiToken = process.env.CONFLUENCE_API_TOKEN;
    this.baseUrl = `/wiki/api/v2`;
  }

  /**
   * Make an HTTP request to Confluence API
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
              reject(new Error(`HTTP ${res.statusCode}: ${error.message || data}`));
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
   * GET /wiki/api/v2/pages/{id}
   */
  async getPage(pageId) {
    return this.request('GET', `/pages/${pageId}?body-format=atlas_doc_format`);
  }

  /**
   * Convert plain text to Atlassian Document Format (ADF)
   * Required for API v2 when using atlas_doc_format representation
   */
  textToAdf(text) {
    return {
      version: 1,
      type: 'doc',
      content: text.split('\n\n').map(paragraph => ({
        type: 'paragraph',
        content: paragraph ? [{ type: 'text', text: paragraph }] : []
      }))
    };
  }

  /**
   * POST /wiki/api/v2/pages
   * Note: When using atlas_doc_format, body.value must be a JSON string, not an object
   * See: https://community.developer.atlassian.com/t/confluence-rest-api-v2-create-page-with-atlas-doc-format-representation/67565
   */
  async createPage(pageData) {
    return this.request('POST', '/pages', pageData);
  }

  /**
   * Create a page with plain text content (convenience method)
   * Handles ADF conversion automatically
   */
  async createPageWithText(spaceId, title, textContent, options = {}) {
    const adf = this.textToAdf(textContent);
    const pageData = {
      spaceId: spaceId,
      status: options.status || 'current',
      title: title,
      body: {
        representation: 'atlas_doc_format',
        value: JSON.stringify(adf)  // Must be JSON string, not object
      }
    };
    if (options.parentId) {
      pageData.parentId = options.parentId;
    }
    return this.request('POST', '/pages', pageData);
  }

  /**
   * PUT /wiki/api/v2/pages/{id}
   * Note: When using atlas_doc_format, body.value must be a JSON string, not an object
   */
  async updatePage(pageId, updateData) {
    return this.request('PUT', `/pages/${pageId}`, updateData);
  }

  /**
   * Update a page with plain text content (convenience method)
   * Handles ADF conversion automatically
   */
  async updatePageWithText(pageId, title, textContent, version) {
    const adf = this.textToAdf(textContent);
    const updateData = {
      id: pageId,
      status: 'current',
      title: title,
      body: {
        representation: 'atlas_doc_format',
        value: JSON.stringify(adf)  // Must be JSON string, not object
      },
      version: {
        number: version + 1,
        message: 'Updated via API'
      }
    };
    return this.request('PUT', `/pages/${pageId}`, updateData);
  }

  /**
   * DELETE /wiki/api/v2/pages/{id}
   */
  async deletePage(pageId) {
    return this.request('DELETE', `/pages/${pageId}`);
  }

  /**
   * GET /wiki/api/v2/pages
   */
  async searchPages(options = {}) {
    const params = new URLSearchParams();
    if (options.spaceId) params.append('space-id', options.spaceId);
    if (options.title) params.append('title', options.title);
    if (options.limit) params.append('limit', options.limit);

    const queryString = params.toString();
    return this.request('GET', `/pages${queryString ? '?' + queryString : ''}`);
  }

  /**
   * GET /wiki/api/v2/spaces
   */
  async getSpaces(options = {}) {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit || 25);

    const queryString = params.toString();
    return this.request('GET', `/spaces${queryString ? '?' + queryString : ''}`);
  }

  /**
   * GET /wiki/api/v2/spaces/{id}
   */
  async getSpace(spaceId) {
    return this.request('GET', `/spaces/${spaceId}`);
  }

  /**
   * POST /wiki/rest/api/content/{id}/label
   * Note: v2 API does not support adding labels yet - must use v1 endpoint
   * See: https://community.atlassian.com/forums/Confluence-questions/How-to-add-a-label-to-a-Confluence-page-using-the-v2-API/qaq-p/2618944
   */
  async addLabels(pageId, labels) {
    // Labels API requires v1 endpoint - v2 only has read-only label endpoints
    const labelArray = Array.isArray(labels)
      ? labels.map(l => typeof l === 'string' ? { prefix: 'global', name: l } : l)
      : [{ prefix: 'global', name: labels }];

    return this.requestV1('POST', `/content/${pageId}/label`, labelArray);
  }

  /**
   * Make an HTTP request to Confluence API v1 (for endpoints not yet in v2)
   */
  async requestV1(method, path, body = null) {
    return new Promise((resolve, reject) => {
      const auth = Buffer.from(`${this.email}:${this.apiToken}`).toString('base64');

      const options = {
        hostname: this.host,
        port: 443,
        path: `/wiki/rest/api${path}`,
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
              reject(new Error(`HTTP ${res.statusCode}: ${error.message || data}`));
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
   * GET /wiki/api/v2/pages/{id}/children
   */
  async getPageChildren(pageId, options = {}) {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit || 25);

    const queryString = params.toString();
    return this.request('GET', `/pages/${pageId}/children${queryString ? '?' + queryString : ''}`);
  }

  /**
   * GET /wiki/api/v2/blogposts
   */
  async getBlogPosts(options = {}) {
    const params = new URLSearchParams();
    if (options.spaceId) params.append('space-id', options.spaceId);
    if (options.limit) params.append('limit', options.limit || 25);

    const queryString = params.toString();
    return this.request('GET', `/blogposts${queryString ? '?' + queryString : ''}`);
  }
}

function getConfluenceClient() {
  return new ConfluenceClient();
}

module.exports = { getConfluenceClient, ConfluenceClient };
