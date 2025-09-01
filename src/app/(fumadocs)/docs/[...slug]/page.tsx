import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'

import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page'

import { getCollectionBySlug, getSlugs } from '@/lib/utils/getCollection'
import type { Doc } from '@payload-types'

import { RichText } from '@/components/richtext'
import { generateTocFromLexical } from '@/lib/utils/generateToc'
import { generateMeta } from '@/lib/utils/generateMeta'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const { isEnabled } = await draftMode()

  const doc = await getCollectionBySlug({
    collection: 'docs',
    slug: slug || '',
    draft: isEnabled,
  })

  return generateMeta({ doc: doc })
}

export async function generateStaticParams() {
  const docs = await getSlugs('docs')

  return (
    docs.docs
      ?.filter((doc: Pick<Doc, 'id' | 'slug'>) => {
        return doc && 'slug' in doc && typeof doc.slug === 'string'
      })
      .map((doc: Pick<Doc, 'id' | 'slug'>) => ({ slug: [(doc as { slug: string }).slug] })) || []
  )
}

export default async function Doc({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const { isEnabled } = await draftMode()
  const page = await getCollectionBySlug({
    collection: 'docs',
    slug: slug?.[0] || '',
    draft: isEnabled,
  })

  if (!page) {
    notFound()
  }

  const toc = generateTocFromLexical(page?.copy || { root: { children: [] } })

  return (
    <DocsPage
      toc={toc}
      full={false}
      tableOfContent={{
        single: true,
        style: 'clerk',
      }}
    >
      <DocsTitle>{page?.title}</DocsTitle>
      <DocsDescription>{page?.excerpt}</DocsDescription>
      <DocsBody>
        <RichText data={page?.copy} />

        {/* <pre>{JSON.stringify(page?.copy, null, 2)}</pre> */}
      </DocsBody>
    </DocsPage>
  )
}
