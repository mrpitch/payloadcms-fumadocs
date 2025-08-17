import { unstable_cache } from 'next/cache'

import { getPayload } from 'payload'

import configPromise from '@payload-config'
import { importMap } from '@/app/(payload)/admin/importMap'

import type { Config, Setting } from '@payload-types'

import { revalidate } from '@/lib/utils/constants'

type TGlobal = keyof Config['globals']

const payload = await getPayload({
  config: configPromise,
  cron: false,
  importMap,
})

export const getSettings = async (draft?: boolean) => {
  const slug: TGlobal = 'settings'
  const cached = unstable_cache(
    async () => {
      return await payload.findGlobal({
        slug: slug,
        draft: draft || true,
        depth: 4,
      })
    },
    [`global_${slug}`],
    { revalidate: revalidate, tags: ['global', `global_${slug}`] },
  )

  return cached()
}

export const getDocsMenu = async (draft?: boolean) => {
  const slug: TGlobal = 'settings'
  const cached = unstable_cache(
    async () => {
      const result = await payload.findGlobal({
        slug: slug,
        draft: draft || true,
        depth: 5,
      })
      const { docsMenu } = result
      return docsMenu
    },
    [`global_${slug}`],
    { revalidate: revalidate, tags: ['global', `global_${slug}`] },
  )

  return cached()
}
