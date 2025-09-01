/**
 * Test utilities for Fumadocs + PayloadCMS integration
 */

import { getTree, getPage, getPageSlugs } from './source'
import { getAllPageUrls, searchPages, validatePageTree } from './utils'

/**
 * Run basic integration tests
 */
export async function testFumadocsIntegration() {
  console.log('🧪 Testing Fumadocs + PayloadCMS Integration...\n')

  try {
    // Test 1: Page Tree Generation
    console.log('📊 Testing page tree generation...')
    const tree = await getTree({ currentPath: '', draft: false })
    console.log(`✅ Page tree generated with ${tree.children.length} top-level items`)
    console.log(`   Tree structure:`, JSON.stringify(tree, null, 2))

    // Test 2: Page Slugs
    console.log('\n📄 Testing page slug generation...')
    const slugs = await getPageSlugs()
    console.log(`✅ Found ${slugs.length} page slugs:`)
    slugs.slice(0, 5).forEach(slug => console.log(`   - ${slug.join('/')}`))
    if (slugs.length > 5) console.log(`   ... and ${slugs.length - 5} more`)

    // Test 3: Page Loading
    if (slugs.length > 0) {
      console.log('\n🔍 Testing page loading...')
      const firstSlug = slugs[0]
      const page = await getPage(firstSlug)
      
      if (page) {
        console.log(`✅ Loaded page: "${page.title}"`)
        console.log(`   - URL: ${page.url}`)
        console.log(`   - TOC items: ${page.toc.length}`)
        console.log(`   - Description: ${page.description || 'No description'}`)
      } else {
        console.log(`❌ Failed to load page with slug: ${firstSlug.join('/')}`)
      }
    }

    // Test 4: Validation
    console.log('\n🔍 Validating page tree...')
    const validation = await validatePageTree()
    if (validation.valid) {
      console.log('✅ Page tree validation passed')
    } else {
      console.log('❌ Page tree validation failed:')
      validation.errors.forEach((error: string) => console.log(`   - ${error}`))
    }

    // Test 5: Search
    console.log('\n🔍 Testing search functionality...')
    const searchResults = await searchPages('guide')
    console.log(`✅ Search found ${searchResults.length} results for "guide"`)

    // Test 6: URL Generation
    console.log('\n🌐 Testing URL generation...')
    const urls = await getAllPageUrls()
    console.log(`✅ Generated ${urls.length} page URLs`)
    urls.slice(0, 3).forEach(url => console.log(`   - ${url}`))

    console.log('\n🎉 All tests completed!')

  } catch (error) {
    console.error('❌ Test failed:', error)
    throw error
  }
}

/**
 * Simple health check for the integration
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const tree = await getTree({ currentPath: '', draft: false })
    const slugs = await getPageSlugs()
    
    return tree.children.length > 0 && slugs.length > 0
  } catch {
    return false
  }
}

/**
 * Debug information about the current setup
 */
export async function debugInfo() {
  console.log('🔧 Fumadocs Integration Debug Info\n')

  try {
    const tree = await getTree({ currentPath: '', draft: false })
    const slugs = await getPageSlugs()
    const urls = await getAllPageUrls()

    console.log('📊 Statistics:')
    console.log(`   - Page tree nodes: ${tree.children.length}`)
    console.log(`   - Available slugs: ${slugs.length}`)
    console.log(`   - Generated URLs: ${urls.length}`)

    console.log('\n🏗️ Tree Structure:')
    tree.children.forEach((node, index) => {
      if (node.type === 'folder') {
        console.log(`   ${index + 1}. 📁 ${node.name} (${node.children.length} children)`)
        if (node.index) {
          console.log(`      🏠 Index: ${node.index.name} → ${node.index.url}`)
        }
        node.children.slice(0, 3).forEach(child => {
          if (child.type === 'page') {
            console.log(`      📄 ${child.name} → ${child.url}`)
          }
        })
        if (node.children.length > 3) {
          console.log(`      ... and ${node.children.length - 3} more pages`)
        }
      } else if (node.type === 'page') {
        console.log(`   ${index + 1}. 📄 ${node.name} → ${node.url}`)
      }
    })

  } catch (error) {
    console.error('❌ Debug failed:', error)
  }
}
