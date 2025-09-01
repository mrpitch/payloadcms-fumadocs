import type { Metadata } from 'next'

import type { Doc } from '@payload-types'

export const generateMeta = async (args: { doc: Partial<Doc> | null }): Promise<Metadata> => {
  const { doc } = args

  const title = doc?.title ? doc?.title + ' | PayloadCMS Fumadocs' : 'PayloadCMS Fumadocs'
  return {
    description: doc?.excerpt,
    title,
  }
}
