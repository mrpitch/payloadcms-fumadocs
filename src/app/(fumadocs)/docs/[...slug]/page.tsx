import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'

import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page'

import { getCollectionBySlug, getSlugs } from '@/lib/utils/getCollection'

import { RichText } from '@/components/richtext'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { generateTocFromLexical, generateTocFromPayload } from '@/lib/utils/generateToc'
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
      ?.filter((doc) => {
        return doc && 'slug' in doc && typeof doc.slug === 'string'
      })
      .map((doc) => ({ slug: [(doc as { slug: string }).slug] })) || []
  )
}

// export const toc = [
//   {
//     title: 'Heading h2',
//     depth: 2,
//     url: '#heading-h2',
//   },
//   {
//     title: 'Heading h3',
//     depth: 3,
//     url: '#heading-h3',
//   },
//   {
//     title: 'Heading h4',
//     depth: 4,
//     url: '#heading-h4',
//   },
//   {
//     title: 'Heading h5',
//     depth: 5,
//     url: '#heading-h5',
//   },
// ]

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

  const toc = generateTocFromLexical(page?.copy as DefaultTypedEditorState)

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
        <RichText data={page?.copy as DefaultTypedEditorState} />

        {/* <pre>{JSON.stringify(page?.copy, null, 2)}</pre> */}
      </DocsBody>
    </DocsPage>
  )
}
