import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'

import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page'

import { getPage, getPageSlugs } from '@/payload/utils/fumadocs/source'
import type { Doc } from '@payload-types'

import { RichText } from '@/components/richtext'
import { generateMeta } from '@/lib/utils/generateMeta'

type Args = {
  params: Promise<{
    slug?: string[]
  }>
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const { isEnabled } = await draftMode()

  if (!slug || slug.length === 0) {
    return { title: 'Documentation' }
  }

  const page = await getPage(slug, isEnabled)

  if (!page) {
    return { title: 'Not Found' }
  }

  return generateMeta({ 
    doc: { 
      title: page.title, 
      excerpt: page.description 
    } as Pick<Doc, 'title' | 'excerpt'>
  })
}

export async function generateStaticParams() {
  const slugs = await getPageSlugs()
  return slugs.map(slug => ({ slug }))
}

export default async function DocPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const { isEnabled } = await draftMode()
  
  if (!slug || slug.length === 0) {
    notFound()
  }

  const page = await getPage(slug, isEnabled)

  if (!page) {
    notFound()
  }

  return (
    <DocsPage
      toc={page.toc}
      full={false}
      tableOfContent={{
        single: true,
        style: 'clerk',
      }}
    >
      <DocsTitle>{page.title}</DocsTitle>
      <DocsDescription>{page.description}</DocsDescription>
      <DocsBody>
        <RichText data={page.body} />
      </DocsBody>
    </DocsPage>
  )
}
