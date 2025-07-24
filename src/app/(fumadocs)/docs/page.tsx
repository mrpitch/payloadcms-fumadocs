import { headers as getHeaders } from 'next/headers.js'
import Link from 'next/link'

import { getAllByCollection, getCollectionBySlug, getSlugs } from '@/lib/utils/getCollection'

export default async function HomePage() {
  const items = await getAllByCollection('docs')

  const item = await getCollectionBySlug({
    collection: 'docs',
    slug: 'my-example-doc',
    draft: false,
  })

  return (
    <main className="w-full p-4">
      <h1>Hello World</h1>
      <ul>
        {items.docs.map((doc) => (
          <li key={doc.id}>
            <Link href={`/docs/${doc.slug}`}>{doc.title}</Link>
          </li>
        ))}
      </ul>
      <pre>{JSON.stringify(item, null, 2)}</pre>
      <pre>{JSON.stringify(items, null, 2)}</pre>
    </main>
  )
}
