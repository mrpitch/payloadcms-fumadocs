/**
 * Additional utilities for Fumadocs + PayloadCMS integration
 */

import type { PageTree, TOCItemType } from 'fumadocs-core/server'
import { flattenTree } from 'fumadocs-core/server'
import { getTree, getPage } from './source'

/**
 * Get all page URLs from the page tree (useful for sitemap generation)
 */
export async function getAllPageUrls(draft = false): Promise<string[]> {
  const tree = await getTree({ currentPath: '', draft })
  const flatPages = flattenTree(tree.children)
  
  return flatPages
    .filter(page => !page.external)
    .map(page => page.url)
}

/**
 * Find a page by its URL in the page tree
 */
export async function findPageByUrl(url: string, draft = false): Promise<PageTree.Item | null> {
  const tree = await getTree({ currentPath: '', draft })
  const flatPages = flattenTree(tree.children)
  
  return flatPages.find(page => page.url === url) || null
}

/**
 * Get breadcrumbs for a given page URL
 */
export async function getBreadcrumbs(url: string, draft = false): Promise<Array<{ name: string; url: string }>> {
  const tree = await getTree({ currentPath: '', draft })
  const breadcrumbs: Array<{ name: string; url: string }> = []
  
  function searchTree(nodes: PageTree.Node[], currentPath: Array<{ name: string; url: string }>): boolean {
    for (const node of nodes) {
      if (node.type === 'page' && node.url === url) {
        breadcrumbs.push(...currentPath, { name: String(node.name), url: node.url })
        return true
      }
      
      if (node.type === 'folder') {
        const newPath = [...currentPath, { name: String(node.name), url: node.index?.url || '#' }]
        
        // Check index page
        if (node.index && node.index.url === url) {
          breadcrumbs.push(...newPath)
          return true
        }
        
        // Check children
        if (searchTree(node.children, newPath)) {
          return true
        }
      }
    }
    
    return false
  }
  
  searchTree(tree.children, [])
  return breadcrumbs
}

/**
 * Get navigation context for a page (previous/next pages)
 */
export async function getPageNavigation(url: string, draft = false): Promise<{
  previous?: PageTree.Item
  next?: PageTree.Item
}> {
  const tree = await getTree({ currentPath: '', draft })
  const flatPages = flattenTree(tree.children).filter(page => !page.external)
  
  const currentIndex = flatPages.findIndex(page => page.url === url)
  
  if (currentIndex === -1) {
    return {}
  }
  
  return {
    previous: currentIndex > 0 ? flatPages[currentIndex - 1] : undefined,
    next: currentIndex < flatPages.length - 1 ? flatPages[currentIndex + 1] : undefined,
  }
}

/**
 * Enhanced page data with additional navigation context
 */
export interface EnhancedFumadocsPage {
  title: string
  description?: string | null
  body: any
  toc: TOCItemType[]
  url: string
  breadcrumbs: Array<{ name: string; url: string }>
  navigation: {
    previous?: PageTree.Item
    next?: PageTree.Item
  }
}

/**
 * Get a page with enhanced navigation context
 */
export async function getEnhancedPage(slugs: string[], draft = false): Promise<EnhancedFumadocsPage | null> {
  const page = await getPage(slugs, draft)
  
  if (!page) {
    return null
  }
  
  const [breadcrumbs, navigation] = await Promise.all([
    getBreadcrumbs(page.url, draft),
    getPageNavigation(page.url, draft)
  ])
  
  return {
    ...page,
    breadcrumbs,
    navigation,
  }
}

/**
 * Search pages by title or description
 */
export async function searchPages(query: string, draft = false): Promise<PageTree.Item[]> {
  const tree = await getTree({ currentPath: '', draft })
  const flatPages = flattenTree(tree.children)
  
  const lowercaseQuery = query.toLowerCase()
  
  return flatPages.filter(page => {
    const title = String(page.name).toLowerCase()
    const description = page.description ? String(page.description).toLowerCase() : ''
    
    return title.includes(lowercaseQuery) || description.includes(lowercaseQuery)
  })
}

/**
 * Get all folders from the page tree
 */
export async function getAllFolders(draft = false): Promise<PageTree.Folder[]> {
  const tree = await getTree({ currentPath: '', draft })
  const folders: PageTree.Folder[] = []
  
  function collectFolders(nodes: PageTree.Node[]): void {
    for (const node of nodes) {
      if (node.type === 'folder') {
        folders.push(node)
        collectFolders(node.children)
      }
    }
  }
  
  collectFolders(tree.children)
  return folders
}

/**
 * Validate that all pages in the tree are accessible
 */
export async function validatePageTree(draft = false): Promise<{
  valid: boolean
  errors: string[]
}> {
  const tree = await getTree({ currentPath: '', draft })
  const flatPages = flattenTree(tree.children)
  const errors: string[] = []
  
  for (const page of flatPages) {
    if (!page.external && page.url.startsWith('/docs/')) {
      // Extract slug from URL
      const slug = page.url.replace('/docs/', '')
      const pageData = await getPage([slug], draft)
      
      if (!pageData) {
        errors.push(`Page not found for URL: ${page.url}`)
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}
