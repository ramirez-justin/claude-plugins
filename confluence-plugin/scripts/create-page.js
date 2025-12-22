#!/usr/bin/env node

/**
 * Create a new Confluence page using direct API calls
 * Usage: node create-page.js <spaceId> <title> <content> [parentId]
 */

const { getConfluenceClient } = require('./confluence-client');

async function createPage() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.error('Usage: create-page.js <spaceId> <title> <content> [parentId]');
    console.error('Example: create-page.js 123456 "My Page" "Page content here"');
    console.error('Example: create-page.js 123456 "Child Page" "Content" 789012');
    process.exit(1);
  }

  const [spaceId, title, content, parentId] = args;

  const confluence = getConfluenceClient();

  try {
    // Confluence API v2 format for creating pages
    const pageData = {
      spaceId: spaceId,
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
      }
    };

    if (parentId) {
      pageData.parentId = parentId;
    }

    const page = await confluence.createPage(pageData);

    console.log(`✓ Created page: ${page.title}`);
    console.log(`  ID: ${page.id}`);
    console.log(`  URL: https://${process.env.CONFLUENCE_HOST}/wiki/spaces/${spaceId}/pages/${page.id}`);

    return page;
  } catch (error) {
    console.error('Error creating page:', error.message);
    process.exit(1);
  }
}

createPage();
