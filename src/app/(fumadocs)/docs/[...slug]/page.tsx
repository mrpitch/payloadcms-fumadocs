import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'

import { getPayload } from 'payload'
import config from '@payload-config'

import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page'

import { getCollectionBySlug, getSlugs } from '@/lib/utils/getCollection'

export async function generateStaticParams() {
  const docs = await getSlugs('docs')
  return (
    docs.docs
      ?.filter((doc) => {
        return doc && 'slug' in doc && typeof doc.slug === 'string'
      })
      .map((doc) => ({ slug: [(doc as { slug: string }).slug] })) || []
  )
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

const payload = await getPayload({ config })

export default async function Doc({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const { isEnabled } = await draftMode()
  const page = await getCollectionBySlug({
    collection: 'docs',
    slug: slug?.[0] || 'my-doc-example-1',
    draft: false,
  })

  // const page = await payload.find({
  //   collection: 'docs',
  //   depth: 3,
  //   draft: false,
  //   overrideAccess: true,
  //   where: {
  //     slug: {
  //       equals: slug?.[0],
  //     },
  //   },
  // })
  if (!page) {
    notFound()
  }

  return (
    <DocsPage toc={[]} full={false}>
      <DocsTitle>{page?.title}</DocsTitle>
      <DocsDescription>{page?.excerpt}</DocsDescription>
      <DocsBody>
        <pre>{JSON.stringify(page, null, 2)}</pre>
      </DocsBody>
    </DocsPage>
  )
}
