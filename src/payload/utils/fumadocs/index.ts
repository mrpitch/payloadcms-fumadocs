/**
 * Fumadocs + PayloadCMS Integration
 * 
 * This module provides a complete integration between PayloadCMS and Fumadocs,
 * mapping PayloadCMS content to Fumadocs schemas and providing helper utilities.
 */

// Core source functions
export { getTree, getPage, getPageSlugs, type FumadocsPage } from './source'

// Additional utilities
export {
  getAllPageUrls,
  findPageByUrl,
  getBreadcrumbs,
  getPageNavigation,
  getEnhancedPage,
  searchPages,
  getAllFolders,
  validatePageTree,
  type EnhancedFumadocsPage,
} from './utils'

// Testing and debugging
export {
  testFumadocsIntegration,
  healthCheck,
  debugInfo,
} from './test'

// Re-export common types from fumadocs-core
export type { PageTree, TOCItemType } from 'fumadocs-core/server'
