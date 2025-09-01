# Fumadocs + PayloadCMS Integration Utils

This service provides a complete integration between PayloadCMS and Fumadocs, enabling you to manage documentation content through PayloadCMS while maintaining full compatibility with Fumadocs UI components and navigation.

## Features

- ✅ **Page Tree Generation**: Automatically maps PayloadCMS menu structure to Fumadocs page tree
- ✅ **TOC Generation**: Extracts table of contents from Lexical editor content
- ✅ **Dynamic Content Loading**: Load pages dynamically with caching
- ✅ **Navigation Helpers**: Breadcrumbs, previous/next navigation, and search
- ✅ **Type Safety**: Full TypeScript support with proper Fumadocs types
- ✅ **Performance**: Built-in caching with Next.js `unstable_cache`

## Architecture

### PayloadCMS Content Model

The integration expects the following PayloadCMS structure:

1. **Docs Collection** (`docs`):
   - `title` (text)
   - `slug` (text) 
   - `excerpt` (textarea)
   - `copy` (Lexical rich text)
   - `publishedAt` (date)
   - `author` (relationship to users)

2. **Settings Global** (`settings`):
   - `docsMenu.menuSections` (array):
     - `label` (text) - Folder name
     - `description` (textarea) - Folder description
     - `indexItem` (relationship to docs) - Index page for folder
     - `menuItems` (array) - Pages in this folder

### Fumadocs Mapping

The service maps PayloadCMS data to Fumadocs schemas:

```typescript
// PayloadCMS menuSections -> Fumadocs Folder nodes
{
  type: 'folder',
  name: section.label,
  description: section.description, 
  index: { type: 'page', name: indexDoc.title, url: `/docs/${indexDoc.slug}` },
  children: [...] // Mapped from menuItems
}

// PayloadCMS docs -> Fumadocs Page nodes  
{
  type: 'page',
  name: doc.title,
  url: `/docs/${doc.slug}`,
  description: doc.excerpt
}

// Lexical content -> TOC
[
  { title: 'Heading Text', url: '#heading-text', depth: 2 }
]
```

## Usage

### Basic Setup

1. **Update your docs layout**:

```typescript
// src/app/(fumadocs)/docs/[...slug]/layout.tsx
import { getTree } from '@/lib/fumadocs/source'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'

export default async function Layout({ children }: { children: ReactNode }) {
  const pageTree = await getTree()
  
  return (
    <DocsLayout tree={pageTree}>
      {children}
    </DocsLayout>
  )
}
```

2. **Update your docs page**:

```typescript
// src/app/(fumadocs)/docs/[...slug]/page.tsx
import { getPage, getPageSlugs } from '@/lib/fumadocs/source'
import { DocsPage, DocsBody, DocsTitle } from 'fumadocs-ui/page'

export async function generateStaticParams() {
  const slugs = await getPageSlugs()
  return slugs.map(slug => ({ slug }))
}

export default async function DocPage({ params }: { params: { slug: string[] } }) {
  const page = await getPage(params.slug)
  
  if (!page) notFound()
  
  return (
    <DocsPage toc={page.toc}>
      <DocsTitle>{page.title}</DocsTitle>
      <DocsBody>
        {/* Render Lexical content */}
      </DocsBody>
    </DocsPage>
  )
}
```

## Additional Features

### Navigation Helpers

```typescript
// Get breadcrumbs for current page
const breadcrumbs = await getBreadcrumbs(slug)

// Get previous/next navigation
const nav = await getPageNavigation(slug)

// Search pages
const results = await searchPages(query)
```

### Caching Configuration

```typescript
// In lib/fumadocs/source.ts
export const getPage = cache(async (slug: string) => {
  // Page loading logic
}, {
  revalidate: 60 // Cache for 1 minute
})
```

### Draft Mode

The service supports Next.js draft mode for previewing unpublished content:

```typescript
// Enable draft mode
export async function GET(request: Request) {
  draftMode().enable()
  return new Response(null, {
    status: 307,
    headers: { Location: '/docs' },
  })
}

// Disable draft mode
export async function GET(request: Request) {
  draftMode().disable()
  return new Response(null, {
    status: 307,
    headers: { Location: '/docs' },
  })
}
```

## Utilities

### Debug Tools

```typescript
import { debugInfo } from '@/lib/fumadocs/utils'

// Print current integration state
await debugInfo()

// Validate page tree
await validatePageTree()
```

### Migration Helpers

```typescript
import { runMigrationCheck } from '@/lib/fumadocs/migrate'

// Check migration compatibility
await runMigrationCheck()
```

## Error Handling

The service includes comprehensive error handling:

1. **Missing Pages**:
   - Returns `null` from `getPage`
   - Use with `notFound()` in page component

2. **Invalid Tree Structure**:
   - Validates relationships
   - Checks for circular dependencies
   - Reports missing index pages

3. **Content Errors**:
   - Handles malformed Lexical content
   - Falls back to empty TOC if needed
   - Reports parsing errors

## TypeScript Support

The service includes full TypeScript definitions:

```typescript
import type { PageTree, Page, TOCItem } from 'fumadocs-core/types'
import type { LexicalJSON } from '@payloadcms/richtext-lexical'

// Your content types
interface DocsPage {
  title: string
  slug: string
  excerpt?: string
  copy: LexicalJSON
}

// Fumadocs types
interface FumadocsPage {
  title: string
  url: string
  content: ReactNode
  toc: TOCItem[]
}
```

## Testing

The service includes comprehensive tests:

```typescript
import { testFumadocsIntegration } from '@/lib/fumadocs/test'

describe('Fumadocs Integration', () => {
  it('should map content correctly', async () => {
    const result = await testFumadocsIntegration()
    expect(result.success).toBe(true)
  })
})
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm test:int`
5. Submit a pull request
