import { headers as getHeaders } from 'next/headers.js'

import { getAllByCollection, getCollectionBySlug, getSlugs } from '@/lib/utils/getCollection'
import Link from 'next/link'

export default async function HomePage() {
  const items = await getAllByCollection('docs')

  const item = await getCollectionBySlug({
    collection: 'docs',
    slug: 'my-example-doc',
    draft: false,
  })

  return (
    <>
      <h1>Hello World</h1>
      {items.docs.map((doc) => (
        <div key={doc.id}>
          <h2>{doc.title}</h2>
          <p>{doc.excerpt}</p>
          <Link href={`/docs/${doc.slug}`}>Read More</Link>
        </div>
      ))}
      <pre>{JSON.stringify(item, null, 2)}</pre>
      <pre>{JSON.stringify(items, null, 2)}</pre>
    </>
  )
}
