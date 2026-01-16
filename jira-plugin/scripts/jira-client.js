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

/**
 * Convert plain text or markdown-like text to Atlassian Document Format (ADF)
 * Supports: paragraphs, headings (## or h2.), bullet lists (- or *),
 * bold (**text**), inline code (`code`), and links ([text](url))
 */
function textToAdf(text) {
  const content = [];

  // Split by double newlines to get blocks, but preserve single newlines within blocks
  const blocks = text.split(/\n\n+/);

  for (const block of blocks) {
    const trimmedBlock = block.trim();
    if (!trimmedBlock) continue;

    // Check for heading (## Heading or h2. Heading)
    const headingMatch = trimmedBlock.match(/^(#{1,6})\s+(.+)$/) ||
                         trimmedBlock.match(/^h([1-6])\.\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].startsWith('#')
        ? headingMatch[1].length
        : parseInt(headingMatch[2] ? headingMatch[1] : '2');
      const headingText = headingMatch[2] || headingMatch[1];
      content.push({
        type: 'heading',
        attrs: { level: Math.min(level, 6) },
        content: parseInlineFormatting(headingText)
      });
      continue;
    }

    // Check for bullet list (lines starting with - or *)
    const lines = trimmedBlock.split('\n');
    const isBulletList = lines.every(line => /^[\-\*]\s+/.test(line.trim()));

    if (isBulletList) {
      content.push({
        type: 'bulletList',
        content: lines.map(line => ({
          type: 'listItem',
          content: [{
            type: 'paragraph',
            content: parseInlineFormatting(line.replace(/^[\-\*]\s+/, '').trim())
          }]
        }))
      });
      continue;
    }

    // Regular paragraph - handle single newlines as hard breaks
    const paragraphContent = [];
    const paragraphLines = trimmedBlock.split('\n');

    for (let i = 0; i < paragraphLines.length; i++) {
      const lineContent = parseInlineFormatting(paragraphLines[i]);
      paragraphContent.push(...lineContent);

      // Add hard break between lines (but not after the last line)
      if (i < paragraphLines.length - 1) {
        paragraphContent.push({ type: 'hardBreak' });
      }
    }

    content.push({
      type: 'paragraph',
      content: paragraphContent
    });
  }

  return {
    type: 'doc',
    version: 1,
    content: content.length > 0 ? content : [{ type: 'paragraph', content: [{ type: 'text', text: ' ' }] }]
  };
}

/**
 * Parse inline formatting: bold (**text** or *text*), code (`text`), links ([text](url) or [text|url])
 */
function parseInlineFormatting(text) {
  const content = [];

  // Regex to match inline formatting
  // Order matters: check for bold first, then code, then links
  const pattern = /(\*\*(.+?)\*\*|\*([^*]+?)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|\[([^\]|]+)\|([^\]]+)\])/g;

  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      content.push({ type: 'text', text: text.slice(lastIndex, match.index) });
    }

    if (match[2]) {
      // Bold with ** (e.g., **text**)
      content.push({ type: 'text', text: match[2], marks: [{ type: 'strong' }] });
    } else if (match[3]) {
      // Bold with single * (e.g., *text*) - Jira wiki style
      content.push({ type: 'text', text: match[3], marks: [{ type: 'strong' }] });
    } else if (match[4]) {
      // Inline code (e.g., `code`)
      content.push({ type: 'text', text: match[4], marks: [{ type: 'code' }] });
    } else if (match[5] && match[6]) {
      // Markdown link (e.g., [text](url))
      content.push({
        type: 'text',
        text: match[5],
        marks: [{ type: 'link', attrs: { href: match[6] } }]
      });
    } else if (match[7] && match[8]) {
      // Jira wiki link (e.g., [text|url])
      content.push({
        type: 'text',
        text: match[7],
        marks: [{ type: 'link', attrs: { href: match[8] } }]
      });
    }

    lastIndex = pattern.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    content.push({ type: 'text', text: text.slice(lastIndex) });
  }

  // If no content was added, add empty text
  if (content.length === 0) {
    content.push({ type: 'text', text: text || ' ' });
  }

  return content;
}

module.exports = { getJiraClient, JiraClient, textToAdf };
