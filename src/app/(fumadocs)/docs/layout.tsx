import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import type { ReactNode } from 'react'
import { baseOptions } from '@/fumadocs/layout.config'
import { getAllByCollection } from '@/lib/utils/getCollection'
import type { Doc } from '@payload-types'
import { getGlobals } from '@/lib/utils/getGlobals'
import type { AppConfiguration } from '@payload-types'

//const pageTree = (await getAllByCollection('docs')) as { docs: Doc[] }
const appConfiguration = (await getGlobals('app-configuration')) as AppConfiguration

const sidebarNavigation = appConfiguration?.sideBarNavigation?.navItems

//console.log('sidebarNavigation', JSON.stringify(sidebarNavigation, null, 2))

const pageTree = {
  name: 'Docs',
  children: sidebarNavigation
    ?.map((item, index) => {
      const link = item?.link

      // Handle reference type links (internal links) - use slug from referenced doc
      if (link?.type === 'reference' && link.reference && typeof link.reference === 'object') {
        const referencedDoc = link.reference as Doc
        const slug = referencedDoc.slug || `doc-${referencedDoc.id || index}`
        console.log('slug', slug)
        // Check if this item has nested links
        const hasNestedLinks = link.nestedLinks && link.nestedLinks.length > 0

        if (hasNestedLinks) {
          // Create a folder structure
          return {
            type: 'folder',
            name: link.label || referencedDoc.title,
            index: {
              type: 'page',
              name: link.label || referencedDoc.title,
              url: `/docs/${slug}`,
            },
            children: link.nestedLinks.map((nestedLink: any, nestedIndex: number) => {
              if (
                nestedLink.type === 'reference' &&
                nestedLink.reference &&
                typeof nestedLink.reference === 'object'
              ) {
                const nestedDoc = nestedLink.reference as Doc
                const nestedSlug = nestedDoc.slug || `nested-doc-${nestedDoc.id || nestedIndex}`
                return {
                  type: 'page',
                  name: nestedLink.label || nestedDoc.title,
                  url: `/docs/${nestedSlug}`,
                }
              }
              if (nestedLink.type === 'external') {
                return {
                  type: 'page',
                  name: nestedLink.label,
                  url: nestedLink.url,
                  external: true,
                }
              }
              return {
                type: 'page',
                name: nestedLink.label || `Nested Item ${nestedIndex + 1}`,
                url: `#nested-${index}-${nestedIndex}`,
              }
            }),
          }
        } else {
          // Create a simple page
          return {
            type: 'page',
            name: link.label || referencedDoc.title,
            url: `/docs/${slug}`,
          }
        }
      }

      // Handle external links - use the url field
      if (link?.type === 'external' && link.url) {
        return {
          type: 'page',
          name: link.label,
          url: link.url,
          external: true,
        }
      }

      // Handle label-only items (nolink type) - these become folders
      if (link?.type === 'nolink') {
        const hasNestedLinks = link.nestedLinks && link.nestedLinks.length > 0

        if (hasNestedLinks) {
          return {
            type: 'folder',
            name: link.label,
            children: link.nestedLinks.map((nestedLink: any, nestedIndex: number) => {
              if (
                nestedLink.type === 'reference' &&
                nestedLink.reference &&
                typeof nestedLink.reference === 'object'
              ) {
                const nestedDoc = nestedLink.reference as Doc
                const nestedSlug = nestedDoc.slug || `nested-doc-${nestedDoc.id || nestedIndex}`
                return {
                  type: 'page',
                  name: nestedLink.label || nestedDoc.title,
                  url: `/docs/${nestedSlug}`,
                }
              }
              if (nestedLink.type === 'external') {
                return {
                  type: 'page',
                  name: nestedLink.label,
                  url: nestedLink.url,
                  external: true,
                }
              }
              return {
                type: 'page',
                name: nestedLink.label || `Nested Item ${nestedIndex + 1}`,
                url: `#nested-${index}-${nestedIndex}`,
              }
            }),
          }
        } else {
          // Empty folder
          return {
            type: 'folder',
            name: link.label,
            children: [],
          }
        }
      }

      // Fallback
      return {
        type: 'page',
        name: link?.label || `Item ${index + 1}`,
        url: `#item-${index}`,
      }
    })
    .filter(Boolean) as any,
}
console.log('pageTree', JSON.stringify(pageTree, null, 2))
// Transform flat docs array into tree structure
const tree = {
  name: 'Docs',
  children: pageTree.children.map((doc: any) => ({
    name: doc.name,
    url: `/docs/${doc.reference}`,
    children: doc.children,
  })),
} as any

export default function Layout({ children }: { children: ReactNode }) {
  console.log('=== DEBUGGING DUPLICATE KEYS ===')
  const allUrls: string[] = []

  const collectUrls = (items: any[], level = 0) => {
    items?.forEach((item, index) => {
      const indent = '  '.repeat(level)
      console.log(`${indent}${index}: ${item.name} -> ${item.url}`)
      allUrls.push(item.url)

      if (item.children && item.children.length > 0) {
        collectUrls(item.children, level + 1)
      }
    })
  }

  collectUrls(pageTree.children)

  // Find duplicates
  const duplicates = allUrls.filter((url, index) => allUrls.indexOf(url) !== index)
  console.log('=== DUPLICATE URLS ===')
  console.log(duplicates)

  // Also log the full structure
  console.log('=== FULL PAGE TREE STRUCTURE ===')
  console.log(JSON.stringify(pageTree, null, 2))
  return (
    <DocsLayout tree={tree} {...baseOptions}>
      {children}
    </DocsLayout>
  )
}
