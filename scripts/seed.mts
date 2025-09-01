#!/usr/bin/env tsx
/**
 * PayloadCMS Seeding CLI - Improved Version
 * 
 * Uses the robust seeding service with proper payload instance
 */
import 'dotenv/config' 

import { getPayload } from 'payload'
import configPromise from '../src/payload/payload.config.ts'
import { seed, clearSeed, validateSeed } from '../src/payload/seed/index.ts'

// Set environment variable to skip cache revalidation during seeding
process.env.PAYLOAD_SEED = 'true'

const command = process.argv[2] || 'seed'

console.log('🌱 PayloadCMS Seeding CLI\n')

async function main() {
  try {
    // Initialize payload
    console.log('🔧 Initializing Payload...')
    const payload = await getPayload({
      config: configPromise,
      cron: false,
    })
    console.log('✅ Payload initialized\n')

    switch (command) {
      case 'all':
      case 'seed':
      case undefined:
        console.log('Starting complete seeding process...')
        await seed(payload)
        break
        
      case 'clear':
        console.log('Clearing all seeded data...')
        await clearSeed(payload)
        break
        
      case 'validate':
        console.log('Validating seeded data...')
        const result = await validateSeed(payload)
        if (result.errors.length === 0) {
          console.log('\n🎉 All validation checks passed!')
        } else {
          console.log('\n⚠️  Validation issues found:')
          result.errors.forEach(error => console.log(`   - ${error}`))
          process.exit(1)
        }
        break
        
      default:
        console.log('Available commands:')
        console.log('  all, seed  - Seed all data (docs + menu)')
        console.log('  clear      - Clear all seeded data')
        console.log('  validate   - Validate existing seeded data')
        console.log('\nUsage:')
        console.log('  pnpm seed [command]')
        process.exit(1)
    }
    
    console.log('\n✨ Operation completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('\n💥 Operation failed:', error)
    process.exit(1)
  }
}

main()
