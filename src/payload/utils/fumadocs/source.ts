/**
 * Fumadocs Custom Source Implementation for PayloadCMS
 * 
 * Maps PayloadCMS content to Fumadocs Page Tree and provides page loading functionality
 */

import { unstable_cache } from 'next/cache'
import type { PageTree, TOCItemType } from 'fumadocs-core/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { importMap } from '@/app/(payload)/admin/importMap'
import type { Doc } from '@payload-types'
import { revalidate } from '@/lib/utils/constants'

const payload = await getPayload({
  config: configPromise,
  cron: false,
  importMap,
})

// Page Tree Types from Fumadocs
type TreeNode = PageTree.Node
type TreeRoot = PageTree.Root
type TreeItem = PageTree.Item  
type TreeFolder = PageTree.Folder
type TreeSeparator = PageTree.Separator

/**
 * Generate Fumadocs Sidebar Tabs from PayloadCMS Settings.docsMenu
 */
export const getSidebarTabs = unstable_cache(
  async (draft = false) => {
    try {
      // Get settings with docsMenu configuration
      const settings = await payload.findGlobal({
        slug: 'settings',
        draft,
        depth: 5,
      })

      const docsMenu = settings.docsMenu as any
      
      if (!docsMenu?.menuSections || !Array.isArray(docsMenu.menuSections)) {
        return []
      }

      // Helper function to collect all URLs from menu items recursively
      const collectUrlsFromMenuItems = (menuItems: any[]): string[] => {
        const urls: string[] = []
        
        for (const item of menuItems) {
          if (!item.link) continue
          
          const link = item.link
          
          // Add main link URL if it's a reference
          if (link.type === 'reference' && link.reference?.value?.slug) {
            urls.push(`/docs/${link.reference.value.slug}`)
          }
          
          // Add child link URLs
          if (link.menuChildLinks && Array.isArray(link.menuChildLinks)) {
            for (const child of link.menuChildLinks) {
              if (child.type === 'reference' && child.reference?.value?.slug) {
                urls.push(`/docs/${child.reference.value.slug}`)
              }
            }
          }
        }
        
        return urls
      }

      // Map menu sections to Fumadocs sidebar tabs
      return docsMenu.menuSections.map((section: any) => {
        const indexDoc = section.indexItem
        const baseUrl = indexDoc?.slug ? `/docs/${indexDoc.slug}` : `/docs`
        
        // Collect all URLs that belong to this section
        const sectionUrls = new Set<string>()
        
        // Add index URL
        if (indexDoc?.slug) {
          sectionUrls.add(`/docs/${indexDoc.slug}`)
        }
        
        // Add all menu item URLs
        if (section.menuItems && Array.isArray(section.menuItems)) {
          const menuUrls = collectUrlsFromMenuItems(section.menuItems)
          menuUrls.forEach(url => sectionUrls.add(url))
        }
        
        return {
          title: section.label,
          description: section.description,
          url: baseUrl,
          urls: Array.from(sectionUrls), // Convert Set to Array for serialization
        }
      })
    } catch (error) {
      console.error('Error generating sidebar tabs:', error)
      return []
    }
  },
  ['fumadocs-sidebar-tabs'],
  { revalidate, tags: ['global', 'global_settings'] }
)

/**
 * Generate Fumadocs Page Tree from PayloadCMS Settings.docsMenu
 * Returns only the content for the currently active section/tab
 */
interface IPageTreeProps {
  currentPath?: string
  draft?: boolean
}
export const getTree = async (props: IPageTreeProps): Promise<TreeRoot> => {
  const { currentPath = '', draft = false } = props
  const cacheKey = `fumadocs-page-tree-${currentPath}-${draft}`
  
  return unstable_cache(
    async (): Promise<TreeRoot> => {
      try {
        // Get settings with docsMenu configuration
        const settings = await payload.findGlobal({
          slug: 'settings',
          draft,
          depth: 5,
        })

        const docsMenu = settings.docsMenu as any
        
        if (!docsMenu?.menuSections || !Array.isArray(docsMenu.menuSections)) {
          // Return empty tree if no menu configured
          return {
            name: 'Documentation',
            children: [],
          }
        }

        // Find which section is currently active based on the current path
        let activeSection = null
        if (currentPath) {
          // Try to match the current path to a section's index item or any of its pages
          for (const section of docsMenu.menuSections) {
            // Check if current path matches this section's index item
            if (section.indexItem?.slug && currentPath.includes(section.indexItem.slug)) {
              activeSection = section
              break
            }
            
            // Check if current path matches any page in this section
            if (section.menuItems && Array.isArray(section.menuItems)) {
              const hasMatchingPage = section.menuItems.some((item: any) => {
                if (item.link?.type === 'reference' && item.link.reference?.value?.slug) {
                  return currentPath.includes(item.link.reference.value.slug)
                }
                if (item.link?.menuChildLinks) {
                  return item.link.menuChildLinks.some((child: any) => {
                    return child.reference?.value?.slug && currentPath.includes(child.reference.value.slug)
                  })
                }
                return false
              })
              if (hasMatchingPage) {
                activeSection = section
                break
              }
            }
          }
        }
        
        // If no active section found, default to first section
        if (!activeSection) {
          activeSection = docsMenu.menuSections[0]
        }

        // Generate tree for only the active section
        const children: TreeNode[] = []

        // Get menu items from active section first
        let sectionItems: TreeNode[] = []
        if (activeSection.menuItems && Array.isArray(activeSection.menuItems)) {
          sectionItems = processMenuItems(activeSection.menuItems)
        }

        // Check if index item is already included in menu items
        const indexDoc = activeSection.indexItem as Doc
        let indexAlreadyInMenu = false
        
        if (indexDoc?.slug) {
          indexAlreadyInMenu = sectionItems.some((item) => {
            if (item.type === 'page') {
              return item.url === `/docs/${indexDoc.slug}`
            }
            if (item.type === 'folder' && item.index) {
              return item.index.url === `/docs/${indexDoc.slug}`
            }
            return false
          })
        }

        // Add index page only if it's not already in menu items
        if (indexDoc?.slug && !indexAlreadyInMenu) {
          children.push({
            type: 'page',
            name: indexDoc.title || 'Overview',
            url: `/docs/${indexDoc.slug}`,
            description: indexDoc.excerpt,
          })
        }

        // Add all menu items
        children.push(...sectionItems)

        return {
          name: activeSection.label || 'Documentation',
          children,
        }
      } catch (error) {
        console.error('Error generating page tree:', error)
        return {
          name: 'Documentation', 
          children: [],
        }
      }
    },
    [cacheKey],
    { 
      revalidate, 
      tags: ['global', 'global_settings', 'docs'],
    }
  )()
}

/**
 * Process menu items recursively to handle nested children and folders
 */
function processMenuItems(menuItems: any[]): TreeNode[] {
  const nodes = menuItems
    .map((item: any): TreeNode | null => {
      if (!item.link) return null

      const link = item.link

      // Handle folder-type (nolink) items
      if (link.type === 'nolink') {
        const folderNode: TreeFolder = {
          type: 'folder',
          name: link.label,
          defaultOpen: false,
          children: link.menuChildLinks ? processChildLinks(link.menuChildLinks) : [],
        }
        return folderNode
      }

      // Handle regular document reference links
      if (link.type === 'reference' && link.reference?.relationTo === 'docs') {
        const doc = link.reference?.value as Doc
        if (!doc || !doc.slug) return null

        const pageNode: TreeItem = {
          type: 'page',
          name: link.label || doc.title || 'Untitled',
          url: `/docs/${doc.slug}`,
          description: doc.excerpt,
        }
        
        // Add nested children if they exist
        if (link.menuChildLinks && link.menuChildLinks.length > 0) {
          // For pages with children, we need to create a folder structure
          const folderNode: TreeFolder = {
            type: 'folder',
            name: link.label || doc.title || 'Untitled',
            defaultOpen: false,
            index: pageNode, // The main page becomes the index
            children: processChildLinks(link.menuChildLinks),
          }
          return folderNode
        }

        return pageNode
      }

      return null
    })
    
  return nodes.filter((node): node is TreeNode => node !== null)
}

/**
 * Process child links recursively
 */
function processChildLinks(childLinks: any[]): TreeNode[] {
  const nodes = childLinks
    .map((child: any): TreeNode | null => {
      if (child.type === 'reference' && child.reference?.relationTo === 'docs') {
        const doc = child.reference?.value as Doc
        if (!doc || !doc.slug) return null

        const pageNode: TreeItem = {
          type: 'page',
          name: child.label || doc.title || 'Untitled',
          url: `/docs/${doc.slug}`,
          description: doc.excerpt,
        }
        
        return pageNode
      }
      return null
    })
    
  return nodes.filter((node): node is TreeNode => node !== null)
}

/**
 * Page data structure returned by getPage
 */
export interface FumadocsPage {
  title: string
  description?: string | null
  body: any // Lexical rich text data
  toc: TOCItemType[]
  url: string
}

/**
 * Load a specific page by slug(s) for Fumadocs
 */
export const getPage = unstable_cache(
  async (slugs: string[], draft = false): Promise<FumadocsPage | null> => {
    try {
      // Handle nested slugs - for now just take the first segment
      const slug = slugs[0] || ''
      
      if (!slug) {
        return null
      }

      // Find the document by slug
      const result = await payload.find({
        collection: 'docs',
        where: {
          slug: {
            equals: slug,
          },
        },
        draft,
        depth: 2,
        limit: 1,
      })

      if (!result.docs || result.docs.length === 0) {
        return null
      }

      const doc = result.docs[0]
      
      // Generate TOC from Lexical content
      const toc = generateTocFromLexical(doc.copy)

      return {
        title: doc.title,
        description: doc.excerpt,
        body: doc.copy,
        toc,
        url: `/docs/${doc.slug}`,
      }
    } catch (error) {
      console.error('Error loading page:', error)
      return null
    }
  },
  ['fumadocs-page'],
  { revalidate, tags: ['docs'] }
)

/**
 * Generate all available page slugs for static generation
 */
export const getPageSlugs = unstable_cache(
  async (draft = false): Promise<string[][]> => {
    try {
      const result = await payload.find({
        collection: 'docs',
        where: {
          _status: {
            equals: draft ? undefined : 'published',
          },
        },
        draft,
        select: {
          slug: true,
        },
        limit: 1000,
      })

      return result.docs
        .filter((doc): doc is Doc & { slug: string } => 
          doc && typeof doc.slug === 'string' && doc.slug.length > 0
        )
        .map(doc => [doc.slug])
    } catch (error) {
      console.error('Error getting page slugs:', error)
      return []
    }
  },
  ['fumadocs-page-slugs'],
  { revalidate, tags: ['docs'] }
)

/**
 * Generate Table of Contents from Lexical editor data
 */
function generateTocFromLexical(lexicalData: any): TOCItemType[] {
  if (!lexicalData?.root?.children) {
    return []
  }

  const headings: TOCItemType[] = []

  function traverseNodes(nodes: any[]): void {
    for (const node of nodes) {
      if (node.type === 'heading' && node.tag && node.children) {
        // Extract depth from heading tag (h1, h2, h3, etc.)
        const depth = parseInt(node.tag.replace('h', ''), 10)
        
        // Extract text content from children
        let title = ''
        function extractText(children: any[]): string {
          return children
            .map((child) => {
              if (child.type === 'text') {
                return child.text || ''
              }
              if (child.children) {
                return extractText(child.children)
              }
              return ''
            })
            .join('')
        }
        
        title = extractText(node.children).trim()
        
        if (title) {
          // Generate URL fragment from title
          const url = `#${title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special chars except hyphens
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .trim()}`

          headings.push({
            title,
            url,
            depth,
          })
        }
      }

      // Recursively traverse child nodes
      if (node.children && Array.isArray(node.children)) {
        traverseNodes(node.children)
      }
    }
  }

  traverseNodes(lexicalData.root.children)
  
  return headings
}
