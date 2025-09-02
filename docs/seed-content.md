# PayloadCMS + Fumadocs Seeding Service

Complete documentation seeding system for PayloadCMS with Fumadocs integration.

## Overview

This seeding service creates:
- **20 documentation pages** with Lorem ipsum content using Lexical rich text
- **2-section menu structure** (10 docs per section) with proper parent-child relationships  
- **Fumadocs-compatible content** with TOC-ready headings and structured navigation

## Features

- ✅ **Complete Documentation Set**: 20 pages with realistic content structure
- ✅ **Menu Hierarchy**: Organized sections with index pages and navigation items
- ✅ **Lexical Rich Text**: Proper heading structure for TOC generation
- ✅ **Author Relationships**: Creates default author if needed
- ✅ **Status Management**: Published docs ready for production
- ✅ **Validation**: Comprehensive data integrity checks
- ✅ **CLI Interface**: Easy command-line usage

## Quick Start

```bash
# Seed everything (recommended)
pnpm seed

# Or run specific operations
pnpm seed docs    # Documentation pages only
pnpm seed menu    # Menu structure only
pnpm seed clear   # Clear all seeded data
pnpm seed validate # Validate existing data
```

## Seeded Content Structure

### Documentation Pages (20 pages)

**Getting Started Section (10 pages):**
- Introduction (`introduction`)
- Quick Start (`quick-start`)  
- Installation (`installation`)
- Configuration (`configuration`)
- First Steps (`first-steps`)
- Basic Usage (`basic-usage`)
- Examples (`examples`)
- Troubleshooting (`troubleshooting`)
- Best Practices (`best-practices`)
- FAQ (`faq`)

**Advanced Section (10 pages):**
- Advanced Configuration (`advanced-configuration`)
- Custom Components (`custom-components`)
- API Integration (`api-integration`)
- Performance Optimization (`performance`)
- Security Guidelines (`security`)
- Deployment Guide (`deployment`)
- Testing Strategies (`testing`)
- Migration Guide (`migration`)
- Plugin Development (`plugins`)
- Contributing Guide (`contributing`)

### Menu Structure

Two main sections with proper hierarchy:
- **Getting Started**: Index page + 9 child pages
- **Advanced**: Index page + 9 child pages

Each page includes:
- Rich text content with headings (h1, h2) for TOC generation
- Realistic Lorem ipsum text
- Proper Lexical JSON structure
- SEO-friendly excerpts

## Usage Examples

### Complete Seeding
```bash
# Seeds docs + menu structure  
pnpm seed
```

### Incremental Seeding
```bash
# Seed docs only
pnpm seed docs

# Seed menu only (after docs exist)
pnpm seed menu
```

### Validation & Cleanup
```bash
# Check data integrity
pnpm seed validate

# Clear everything for fresh start
pnpm seed clear
```

## Integration with Fumadocs

The seeded content is designed to work seamlessly with the Fumadocs integration:

### Navigation Tree
```typescript
import { getTree } from '@/lib/fumadocs/source'

const tree = await getTree()
// Returns properly structured PageTree with seeded content
```

### Page Loading
```typescript
import { getPage } from '@/lib/fumadocs/source'

const page = await getPage(['getting-started', 'introduction'])
// Returns { title, content, toc } from seeded Lexical content
```

### TOC Generation
The seeded Lexical content includes proper heading structure:
```json
{
  "type": "heading",
  "tag": "h2", 
  "children": [{ "text": "Section Title" }]
}
```

This generates accurate table of contents via `generateTOC()`.

## File Structure

```
src/lib/seed/
├── index.ts           # Main seeding service
├── data/
│   ├── docs.json      # 20 documentation pages
│   └── menu.json      # Menu structure definition
└── README.md          # This file

scripts/
└── seed.mjs           # CLI wrapper
```

## API Reference

### Core Functions

#### `seedAll(): Promise<void>`
Complete seeding process - runs `seedDocs()` then `seedMenu()`.

#### `seedDocs(): Promise<Map<string, any>>`
Creates 20 documentation pages and returns mapping of slug → document.

#### `seedMenu(createdDocs?: Map<string, any>): Promise<void>`
Creates menu structure in Settings global. Uses `createdDocs` mapping if provided.

#### `clearAll(): Promise<void>`
Removes all seeded documentation and menu structure.

#### `validateSeed(): Promise<ValidationResult>`
Validates seeded data integrity and returns detailed report.

### ValidationResult
```typescript
{
  docsCount: number      // Number of docs found
  menuSections: number   // Number of menu sections
  errors: string[]       // Array of validation errors
}
```

## Configuration

### Environment Requirements
- PayloadCMS with Postgres database
- Collections: `docs`, `users`
- Globals: `settings`
- Lexical rich text editor configured

### Content Customization

Edit `src/lib/seed/data/docs.json` to customize:
- Page titles and slugs
- Content structure  
- Excerpt text
- Lexical rich text

Edit `src/lib/seed/data/menu.json` to customize:
- Section organization
- Menu labels
- Page relationships

## Troubleshooting

### Common Issues

**"Collection 'docs' not found"**
- Ensure PayloadCMS is properly configured
- Run migrations: `pnpm payload migrate`

**"Settings global not accessible"**  
- Check that Settings global is defined in Payload config
- Verify database connection

**"Menu structure validation failed"**
- Run `pnpm seed validate` to identify specific issues
- Ensure docs exist before seeding menu

### Debug Mode

Add debug logging:
```typescript
// In seed functions
console.log('Debug:', JSON.stringify(data, null, 2))
```

## Development

### Adding New Content

1. Edit `src/lib/seed/data/docs.json`
2. Update menu structure in `src/lib/seed/data/menu.json`  
3. Run `pnpm seed clear && pnpm seed` to test

### Testing Integration

```bash
# Seed data
pnpm seed

# Validate
pnpm seed validate

# Test Fumadocs
npm run dev
# Visit /docs to see seeded content
```

## Next Steps

After seeding:

1. **Review Content**: Visit PayloadCMS admin to review seeded pages
2. **Test Navigation**: Check `/docs` route with Fumadocs integration
3. **Customize**: Edit seeded content to match your documentation needs
4. **Production**: Use seeded structure as foundation for real documentation

## Related Files

- `src/lib/fumadocs/source.ts` - Fumadocs integration
- `src/payload/content-model/Docs.ts` - Docs collection schema
- `src/payload/content-model/Settings.ts` - Settings global schema
- `app/docs/[[...slug]]/page.tsx` - Docs page rendering
