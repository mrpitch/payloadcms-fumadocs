/**
 * PayloadCMS Seeding Service - Improved Version
 *
 * Based on robust seeding patterns with proper type safety and relationship handling
 */

import { Payload } from 'payload'
import type { Doc, User, Setting } from '@payload-types'
import { readFileSync } from 'fs'
import type { MenuItem } from './types'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// Import seed data
import menuData from './data/menu.json'

// ES module compatibility
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load and merge documentation files
const loadDocsData = () => {
  try {
    const dataDir = join(__dirname, 'data', 'docs')
    const gettingStartedData = JSON.parse(
      readFileSync(join(dataDir, 'getting-started.json'), 'utf-8'),
    )
    const advancedTopicsData = JSON.parse(
      readFileSync(join(dataDir, 'advanced-topics.json'), 'utf-8'),
    )
    // const dataDir = join(__dirname, 'data')
    // const data = JSON.parse(readFileSync(join(dataDir, 'docs.json'), 'utf-8'))

    // Merge all documentation arrays
    return [...gettingStartedData, ...advancedTopicsData]
  } catch (error) {
    console.error('Error loading docs data:', error)
    return []
  }
}

export type SeedUser = Omit<User, 'id' | 'updatedAt' | 'createdAt' | 'sizes'> & {
  password: string
}

export type SeedDoc = Omit<Doc, 'id' | 'updatedAt' | 'createdAt' | 'author'> & {
  _status: 'published' | 'draft'
}

export type SeedSetting = Omit<Setting, 'id' | 'updatedAt' | 'createdAt'> & {
  docsMenu: {
    menuSections: Array<{
      label: string
      description?: string
      indexItem?: string // slug reference
      menuItems: Array<{
        type: 'reference'
        reference: {
          relationTo: 'docs'
          value: string // slug reference
        }
      }>
    }>
  }
}

export interface SeedData {
  users: SeedUser[]
  docs: SeedDoc[]
  settings: SeedSetting
}

/**
 * Main seeding function using Payload instance
 */
export const seed = async (payload: Payload): Promise<void> => {
  try {
    console.log('🌱 Starting PayloadCMS seeding...\n')

    // Check if database is initialized
    try {
      await payload.count({
        collection: 'users',
      })
    } catch (error) {
      console.error('💥 Database not initialized. Please run migrations first.')
      console.error('Error details:', error)
      return
    }

    // 1. Create/find admin user
    let authorId: string | number
    const existingAdmin = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'hurdi@gurdi.de',
        },
      },
    })

    if (existingAdmin.totalDocs === 0) {
      console.log('👤 Creating admin user...')
      const adminUser = await payload.create({
        collection: 'users',
        data: {
          email: 'hurdi@gurdi.de',
          password: 'Test1234',
        },
      })
      console.log('✅ Created admin user:', adminUser)
      authorId = adminUser.id
      console.log('✅ Created admin user:', adminUser.email)
    } else {
      console.log('👤 Admin user already exists')
      authorId = existingAdmin.docs[0].id
    }

    // 2. Create documentation pages
    console.log('\n📄 Creating documentation pages...')
    const createdDocsMap = new Map<string, any>()

    // Load docs data when needed
    const docsData = loadDocsData()

    for (const docData of docsData) {
      const existingDoc = await payload.find({
        collection: 'docs',
        where: {
          slug: {
            equals: docData.slug,
          },
        },
      })

      if (existingDoc.totalDocs === 0) {
        try {
          const createdDoc = await payload.create({
            collection: 'docs',
            data: {
              title: docData.title,
              slug: docData.slug,
              excerpt: docData.excerpt,
              copy: docData.content as any,
              publishedAt: new Date().toISOString(),
              author: authorId,
              _status: 'published',
            },
          })

          createdDocsMap.set(docData.slug, createdDoc)
          console.log(`✅ Created: ${docData.title} (${docData.slug})`)
        } catch (error) {
          console.error(`❌ Failed to create ${docData.title}:`, error)
        }
      } else {
        createdDocsMap.set(docData.slug, existingDoc.docs[0])
        console.log(`📄 Already exists: ${docData.title}`)
      }
    }

    // 3. Create menu structure in settings
    console.log('\n📁 Creating menu structure...')

    try {
      // Get existing settings
      const existingSettings = await payload.findGlobal({
        slug: 'settings',
      })

      // Check if menu is already configured
      const hasExistingMenu = (existingSettings as any)?.docsMenu?.menuSections?.length > 0

      if (!hasExistingMenu) {
        // Process menu sections with proper references
        const processedMenuSections = []

        for (const section of menuData.menuSections) {
          console.log(`  📁 Processing section: ${section.label}`)

          // Find index item by slug
          let indexItemId = null
          if (section.indexItem && createdDocsMap.has(section.indexItem)) {
            indexItemId = createdDocsMap.get(section.indexItem).id
          }

          // Process menu items
          const processedMenuItems = []

          // Helper function to process child links recursively
          const processChildLinks = (childLinks: any[]) => {
            const processedChildren = []
            for (const child of childLinks) {
              if (
                child.type === 'reference' &&
                child.reference &&
                child.reference.relationTo === 'docs'
              ) {
                const docSlug = child.reference.value
                if (createdDocsMap.has(docSlug)) {
                  const doc = createdDocsMap.get(docSlug)
                  processedChildren.push({
                    type: 'reference',
                    label: doc.title,
                    reference: {
                      relationTo: 'docs',
                      value: doc.id,
                    },
                  })
                }
              }
            }
            return processedChildren
          }

          for (const item of section.menuItems as MenuItem[]) {
            if (
              item.type === 'reference' &&
              item.reference &&
              item.reference.relationTo === 'docs'
            ) {
              const docSlug = item.reference.value

              if (createdDocsMap.has(docSlug)) {
                const doc = createdDocsMap.get(docSlug)
                const menuChildLinks = item.menuChildLinks
                  ? processChildLinks(item.menuChildLinks)
                  : []

                processedMenuItems.push({
                  link: {
                    type: 'reference',
                    label: doc.title,
                    reference: {
                      relationTo: 'docs',
                      value: doc.id,
                    },
                    menuChildLinks,
                  },
                })
                console.log(
                  `    ✅ Added menu item: ${doc.title}${menuChildLinks.length > 0 ? ` (with ${menuChildLinks.length} children)` : ''}`,
                )
              } else {
                console.warn(`    ⚠️  Document not found for slug: "${docSlug}"`)
              }
            } else if (item.type === 'folder') {
              // Handle folder-type items (no direct link, only children)
              const menuChildLinks = item.menuChildLinks
                ? processChildLinks(item.menuChildLinks)
                : []

              processedMenuItems.push({
                link: {
                  type: 'nolink',
                  label: item?.label || '',
                  menuChildLinks,
                },
              })
              console.log(
                `    ✅ Added folder: ${item?.label || ''} (with ${menuChildLinks.length} children)`,
              )
            }
          }

          processedMenuSections.push({
            label: section.label,
            description: section.description,
            indexItem: indexItemId,
            menuItems: processedMenuItems,
          })
        }
        console.log('processed menu sections:', processedMenuSections)

        // Update settings global with menu structure
        await payload.updateGlobal({
          slug: 'settings',
          data: {
            settings: {
              siteName: 'Documentation Site',
              siteDescription: 'Comprehensive documentation and guides',
            },
            docsMenu: {
              menuSections: processedMenuSections,
            },
          } as any,
        })

        console.log(`✅ Created menu with ${processedMenuSections.length} sections`)
      } else {
        console.log('� Menu structure already exists')
      }
    } catch (error) {
      console.error('❌ Error creating menu structure:', error)
      throw error
    }

    console.log('\n🎉 Seeding completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`   - ${createdDocsMap.size} documentation pages processed`)
    console.log(`   - ${menuData.menuSections.length} menu sections configured`)
    console.log(`   - Settings global updated`)
  } catch (error) {
    console.error('💥 Seeding failed:', error)
    throw error
  }
}

/**
 * Clear all seeded data
 */
export const clearSeed = async (payload: Payload): Promise<void> => {
  try {
    console.log('🧹 Clearing seeded data...\n')

    // Clear docs
    const docs = await payload.find({
      collection: 'docs',
      limit: 1000,
    })

    for (const doc of docs.docs) {
      await payload.delete({
        collection: 'docs',
        id: doc.id,
      })
    }
    console.log(`🗑️  Deleted ${docs.docs.length} documents`)

    // Clear menu from settings
    try {
      await payload.updateGlobal({
        slug: 'settings',
        data: {
          docsMenu: {
            menuSections: [],
          },
        } as any,
      })
      console.log('🗑️  Cleared menu structure')
    } catch (error) {
      console.warn('⚠️  Could not clear menu structure:', error)
    }

    console.log('✅ All seeded data cleared')
  } catch (error) {
    console.error('❌ Error clearing data:', error)
    throw error
  }
}

/**
 * Validate seeded data
 */
export const validateSeed = async (
  payload: Payload,
): Promise<{
  docsCount: number
  menuSections: number
  errors: string[]
}> => {
  console.log('🔍 Validating seeded data...\n')

  const errors: string[] = []
  let docsCount = 0
  let menuSections = 0

  try {
    // Check docs
    const docs = await payload.find({
      collection: 'docs',
      limit: 1000,
    })
    docsCount = docs.docs.length
    console.log(`📄 Found ${docsCount} documents`)

    // Check settings and menu structure
    try {
      const settings = await payload.findGlobal({
        slug: 'settings',
      })

      if ((settings as any).docsMenu?.menuSections) {
        menuSections = (settings as any).docsMenu.menuSections.length
        console.log(`📁 Found ${menuSections} menu sections`)

        // Validate menu references
        for (const section of (settings as any).docsMenu.menuSections) {
          if (section.indexItem) {
            try {
              await payload.findByID({
                collection: 'docs',
                id: section.indexItem,
              })
            } catch {
              errors.push(`Index item not found for section: ${section.label}`)
            }
          }

          for (const item of section.menuItems || []) {
            if (item.link?.type === 'reference' && item.link.reference?.value) {
              try {
                await payload.findByID({
                  collection: 'docs',
                  id: item.link.reference.value,
                })
              } catch {
                errors.push(`Menu item reference not found in section: ${section.label}`)
              }
            }
          }
        }
      } else {
        errors.push('No menu sections found in settings')
      }
    } catch (error) {
      errors.push('Settings global not accessible')
    }

    if (errors.length === 0) {
      console.log('✅ Validation successful - all data is properly seeded')
    } else {
      console.log('⚠️  Validation found issues:')
      errors.forEach((error) => console.log(`   - ${error}`))
    }

    return {
      docsCount,
      menuSections,
      errors,
    }
  } catch (error) {
    console.error('❌ Validation failed:', error)
    throw error
  }
}
