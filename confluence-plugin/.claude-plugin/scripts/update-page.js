#!/usr/bin/env node

/**
 * Update a Confluence page using direct API calls
 * Usage: node update-page.js <page-id> <title> <content> <version>
 */

const { getConfluenceClient } = require('./confluence-client');

async function updatePage() {
  const args = process.argv.slice(2);

  if (args.length < 4) {
    console.error('Usage: update-page.js <page-id> <title> <content> <version>');
    console.error('Example: update-page.js 123456 "Updated Title" "New content" 2');
    console.error('\nNote: You need to provide the current version number + 1');
    process.exit(1);
  }

  const [pageId, title, content, version] = args;

  const confluence = getConfluenceClient();

  try {
    // Confluence API v2 format for updating pages
    const updateData = {
      id: pageId,
      status: 'current',
      title: title,
      body: {
        representation: 'atlas_doc_format',
        value: JSON.stringify({
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: content
                }
              ]
            }
          ]
        })
      },
      version: {
        number: parseInt(version),
        message: 'Updated via Claude Code'
      }
    };

    const page = await confluence.updatePage(pageId, updateData);

    console.log(`✓ Updated page: ${page.title}`);
    console.log(`  ID: ${page.id}`);
    console.log(`  Version: ${page.version.number}`);
    console.log(`  URL: https://${process.env.CONFLUENCE_HOST}/wiki/spaces/${page.spaceId}/pages/${page.id}`);

    return page;
  } catch (error) {
    console.error(`Error updating page ${pageId}:`, error.message);
    process.exit(1);
  }
}

updatePage();
