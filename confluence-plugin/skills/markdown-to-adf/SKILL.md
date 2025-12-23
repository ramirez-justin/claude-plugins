---
name: Markdown to ADF Converter
description: Convert Markdown content to Confluence's ADF (Atlassian Document Format) for creating and updating pages. Use when creating Confluence pages from README files, documentation, or any Markdown content. Handles headings, lists, code blocks, tables, links, and more.
---

# Markdown to ADF Converter

Expert assistance for converting Markdown content to Confluence's ADF (Atlassian Document Format).

## When to Use This Skill

- Converting README.md to Confluence
- Creating Confluence pages from Markdown documentation
- Updating Confluence with Markdown content
- User mentions: convert, markdown, ADF, format

## What is ADF?

**ADF (Atlassian Document Format)** is Confluence's JSON-based document format representing content as a tree of nodes.

```json
{
  "version": 1,
  "type": "doc",
  "content": [/* nodes */]
}
```

## Quick Conversion Reference

### Text Formatting

| Markdown | ADF Mark Type | Example |
|----------|---------------|---------|
| `**bold**` | `{"type": "strong"}` | `{"type": "text", "text": "bold", "marks": [{"type": "strong"}]}` |
| `*italic*` | `{"type": "em"}` | `{"type": "text", "text": "italic", "marks": [{"type": "em"}]}` |
| `` `code` `` | `{"type": "code"}` | `{"type": "text", "text": "code", "marks": [{"type": "code"}]}` |
| `~~strike~~` | `{"type": "strike"}` | `{"type": "text", "text": "strike", "marks": [{"type": "strike"}]}` |
| `<u>underline</u>` | `{"type": "underline"}` | `{"type": "text", "text": "underline", "marks": [{"type": "underline"}]}` |
| `[link](url)` | `{"type": "link", "attrs": {"href": "url"}}` | Text with link mark |

**Combined marks**: Use array of marks for `***bold italic***`

### Block Elements

| Markdown | ADF Type | Key Attributes |
|----------|----------|----------------|
| `# Heading` | `heading` | `attrs.level: 1-6` |
| Paragraph | `paragraph` | - |
| `- bullet` | `bulletList` → `listItem` | - |
| `1. ordered` | `orderedList` → `listItem` | - |
| ` ```lang ` | `codeBlock` | `attrs.language` |
| `> quote` | `blockquote` | - |
| `---` | `rule` | - |
| `\| table \|` | `table` → `tableRow` → `tableCell/tableHeader` | - |
| `![alt](url)` | `mediaSingle` → `media` | `attrs: {type: "external", url, alt}` |
| `- [x] task` | `taskList` → `taskItem` | `attrs.state: "DONE"/"TODO"` |

### Headings

```json
{"type": "heading", "attrs": {"level": 1}, "content": [{"type": "text", "text": "Title"}]}
```

Confluence supports levels 1-6.

### Lists

**Bullet list structure**:
```json
{
  "type": "bulletList",
  "content": [
    {"type": "listItem", "content": [
      {"type": "paragraph", "content": [{"type": "text", "text": "Item"}]}
    ]}
  ]
}
```

Nested lists: Add another `bulletList`/`orderedList` inside the `listItem.content` array.

### Code Blocks

```json
{
  "type": "codeBlock",
  "attrs": {"language": "python"},
  "content": [{"type": "text", "text": "def hello():\n    print('Hello')"}]
}
```

**Supported languages**: javascript, python, java, go, rust, typescript, sql, bash, json, xml, html, css, and more.

### Tables

```json
{
  "type": "table",
  "content": [
    {"type": "tableRow", "content": [
      {"type": "tableHeader", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Header"}]}]},
      {"type": "tableHeader", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Header 2"}]}]}
    ]},
    {"type": "tableRow", "content": [
      {"type": "tableCell", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Cell"}]}]},
      {"type": "tableCell", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Cell 2"}]}]}
    ]}
  ]
}
```

## Confluence-Specific Extensions

### Panels (Callouts)

```json
{"type": "panel", "attrs": {"panelType": "info"}, "content": [/* paragraphs */]}
```

**Panel types**: `info`, `note`, `warning`, `error`, `success`

**Convert from**: `> ℹ️ **Info**` or `> ⚠️ **Warning**`

### Expand/Collapse

```json
{"type": "expand", "attrs": {"title": "Click to expand"}, "content": [/* content */]}
```

**Convert from**: `<details><summary>Title</summary>Content</details>`

### Status Badge

```json
{"type": "status", "attrs": {"text": "DONE", "color": "green"}}
```

**Colors**: `neutral`, `purple`, `blue`, `red`, `yellow`, `green`

### Mentions and Emojis

```json
{"type": "mention", "attrs": {"id": "user-id", "text": "@username"}}
{"type": "emoji", "attrs": {"shortName": ":smile:", "text": "😀"}}
```

## Complete Example

**Markdown Input**:
```markdown
# Project Documentation

This is a **sample project** with `code examples`.

- Feature 1
- Feature 2

```bash
npm install my-package
```

| Command | Description |
|---------|-------------|
| `start` | Start server |
```

**ADF Output**:
```json
{
  "version": 1,
  "type": "doc",
  "content": [
    {"type": "heading", "attrs": {"level": 1}, "content": [{"type": "text", "text": "Project Documentation"}]},
    {"type": "paragraph", "content": [
      {"type": "text", "text": "This is a "},
      {"type": "text", "text": "sample project", "marks": [{"type": "strong"}]},
      {"type": "text", "text": " with "},
      {"type": "text", "text": "code examples", "marks": [{"type": "code"}]},
      {"type": "text", "text": "."}
    ]},
    {"type": "bulletList", "content": [
      {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Feature 1"}]}]},
      {"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Feature 2"}]}]}
    ]},
    {"type": "codeBlock", "attrs": {"language": "bash"}, "content": [{"type": "text", "text": "npm install my-package"}]},
    {"type": "table", "content": [
      {"type": "tableRow", "content": [
        {"type": "tableHeader", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Command"}]}]},
        {"type": "tableHeader", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Description"}]}]}
      ]},
      {"type": "tableRow", "content": [
        {"type": "tableCell", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "start", "marks": [{"type": "code"}]}]}]},
        {"type": "tableCell", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Start server"}]}]}
      ]}
    ]}
  ]
}
```

## Conversion Patterns

### README.md to Confluence
1. Extract title from first H1
2. Convert sections to H2/H3
3. Preserve code blocks with language tags
4. Convert tables for command reference
5. Add info panels for warnings/notes

### API Documentation
1. Endpoint sections as H2
2. Parameters as tables
3. Code examples with syntax highlighting
4. Response schemas as code blocks

### Architecture Docs
1. Diagrams as images
2. Decision records with info panels
3. Component lists as bullet lists
4. Tech stack tables

## Limitations and Workarounds

| Markdown Feature | Workaround |
|-----------------|------------|
| HTML tags | Convert to ADF equivalent or plain text |
| Footnotes | Use numbered references in text |
| Definition lists | Use tables or headings |
| Complex nesting | Flatten or use expand sections |

### Confluence Enhancements

Add these to improve Markdown content:
- Info panels for important notes
- Expand sections for optional details
- Status badges for project status
- Task lists for checklists

## How I'll Help

When converting Markdown to ADF, I will:

1. **Parse the Markdown**: Understand structure and content
2. **Convert to ADF**: Build proper JSON structure
3. **Enhance for Confluence**: Add panels, badges where appropriate
4. **Validate**: Ensure valid ADF format
5. **Create/Update**: Use `/confluence-create-page` or `/confluence-update-page`

## Example Interaction

**You**: "Convert my README.md to a Confluence page"

**Me**: "I'll convert your README.md to Confluence ADF format.

[Reads README.md]

I see:
- Title: 'My Project'
- Sections: Overview, Installation, Usage
- Code blocks in bash and javascript
- A table of CLI commands

Converting to ADF with enhancements:
- Code blocks with proper language tags
- Tables for command reference
- Info panels for warnings

Ready to create the page. Which space should I use?"

**You**: "Space 123456"

**Me**: [Uses `/confluence-create-page` with converted ADF]
"Created page 'My Project' in space 123456!"
