# Fumadocs Integration Guide

This guide explains how the PayloadCMS and Fumadocs integration works in our documentation platform.

## Overview

The integration maps PayloadCMS content and navigation structure to Fumadocs' expected schema, enabling:

- Rich text content rendering
- Automatic table of contents
- Navigation structure
- Search functionality
- Draft/preview mode

## Core Components

### Source Service

Located in `src/lib/fumadocs/source.ts`, this is the main integration service that:

- Maps PayloadCMS data to Fumadocs schema
- Handles caching with Next.js
- Manages draft/preview mode
- Provides search functionality

### Data Mapping

#### Page Tree Generation

```typescript
// PayloadCMS menuSections → Fumadocs PageTree
{
  label: "Getting Started",
  description: "Start here", 
  indexItem: { slug: "intro" },
  menuItems: [...]
}

// Becomes:
{
  type: "folder",
  name: "Getting Started",
  description: "Start here",
  index: { type: "page", url: "/docs/intro" },
  children: [...]
}
```

#### Table of Contents

The system automatically generates TOC from Lexical headings:

```typescript
// Lexical heading nodes
{ 
  type: "heading", 
  tag: "h2", 
  children: [...] 
}

// Becomes:
{ 
  title: "Section Title", 
  url: "#section-title", 
  depth: 2 
}
```

## Key Functions

### Page Loading

```typescript
// Load a single page
const page = await getPage(slug)

// Get full navigation tree
const tree = await getTree()

// Generate static paths
const slugs = await getPageSlugs()
```

### Navigation

```typescript
// Get breadcrumbs
const breadcrumbs = await getBreadcrumbs(slug)

// Get prev/next navigation
const nav = await getPageNavigation(slug)

// Search pages
const results = await searchPages(query)
```

## Implementation Details

### Required PayloadCMS Structure

1. **Docs Collection**:
   - `title`: string
   - `slug`: string
   - `excerpt`: string
   - `copy`: Lexical rich text

2. **Settings Global**:
   - `docsMenu`: Navigation structure
   - `menuSections`: Array of sections

### Fumadocs Components

The integration works with all standard Fumadocs components:

```tsx
// In app/docs/[...slug]/page.tsx
import { DocsPage, DocsBody } from 'fumadocs-ui'

export default async function Page({ params }) {
  const page = await getPage(params.slug)
  
  return (
    <DocsPage toc={page.toc}>
      <DocsBody>
        {/* Render Lexical content */}
      </DocsBody>
    </DocsPage>
  )
}
```

## Testing & Validation

### Integration Testing

```typescript
import { testFumadocsIntegration } from '@/lib/fumadocs'

// Run full integration test
await testFumadocsIntegration()

// Check current state
await debugInfo()
```

### Migration Tools

```typescript
import { runMigrationCheck } from '@/lib/fumadocs'

// Verify migration compatibility
await runMigrationCheck()
```

## Benefits

1. **Content Management**:
   - Full CMS capabilities
   - Rich text editing
   - Media management
   - Draft system

2. **Development**:
   - Type safety
   - Built-in caching
   - Easy customization
   - Developer tools

3. **User Experience**:
   - Fast page loads
   - Smooth navigation
   - Search functionality
   - Responsive design

## Configuration

### Environment Setup

```bash
# Required for draft mode
PAYLOAD_SECRET=your-secret
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### Cache Configuration

```typescript
// In lib/fumadocs/source.ts
export const getPage = cache(async (slug: string) => {
  // Fetching and mapping logic
}, {
  revalidate: 60 // Cache for 1 minute
})
```

## Debugging

### Common Issues

1. **Missing Content**:
   - Check PayloadCMS connection
   - Verify slug mapping
   - Check cache invalidation

2. **Navigation Issues**:
   - Verify menu structure
   - Check relationship fields
   - Validate page tree

### Debug Tools

```typescript
// Print debug information
await debugInfo()

// Validate page tree
await validatePageTree()

// Test full integration
await testFumadocsIntegration()
```

## Next Steps

1. Run integration tests
2. Verify content mapping
3. Check navigation structure
4. Test search functionality
5. Configure caching
6. Set up draft mode

The integration provides a robust foundation for your documentation platform while maintaining flexibility for customization.
