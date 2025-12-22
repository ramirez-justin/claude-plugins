#!/usr/bin/env node

/**
 * Get details of a Confluence page using direct API calls
 * Usage: node get-page.js <page-id>
 */

const { getConfluenceClient } = require('./confluence-client');

async function getPage() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: get-page.js <page-id>');
    console.error('Example: get-page.js 123456');
    process.exit(1);
  }

  const pageId = args[0];
  const confluence = getConfluenceClient();

  try {
    const page = await confluence.getPage(pageId);

    console.log(`\n${page.title}`);
    console.log(`ID: ${page.id}`);
    console.log(`Space: ${page.spaceId}`);
    console.log(`Status: ${page.status}`);
    console.log(`Created: ${new Date(page.createdAt).toLocaleDateString()}`);
    console.log(`URL: https://${process.env.CONFLUENCE_HOST}/wiki/spaces/${page.spaceId}/pages/${page.id}`);

    // Extract text from ADF format
    if (page.body?.atlas_doc_format?.value) {
      try {
        const adf = JSON.parse(page.body.atlas_doc_format.value);
        if (adf.content) {
          console.log(`\nContent Preview:`);
          const text = adf.content
            .map(block => block.content?.map(c => c.text).join('') || '')
            .join('\n')
            .substring(0, 300);
          console.log(text + (text.length === 300 ? '...' : ''));
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }

    return page;
  } catch (error) {
    console.error(`Error fetching page ${pageId}:`, error.message);
    process.exit(1);
  }
}

getPage();
