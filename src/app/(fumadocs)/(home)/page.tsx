import Link from 'next/link'

import { getAllByCollection, getCollectionBySlug } from '@/lib/utils/getCollection'

import { Cards, Card } from '@/components/card'
export default async function HomePage() {
  const items = await getAllByCollection('docs')

  const item = await getCollectionBySlug({
    collection: 'docs',
    slug: 'my-example-doc',
    draft: false,
  })

  return (
    <div className="flex flex-col w-full">
      <div className="flex-1  p-6">
        <h3 className="text-lg font-semibold mb-4">Docs</h3>
        <Cards>
          {items.docs.map((doc) => (
            <Card
              key={doc.id}
              title={doc.title}
              description={doc.excerpt}
              href={`/docs/${doc.slug}`}
              type="primary"
            ></Card>
          ))}
        </Cards>
      </div>
      <div className="flex-1 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">JSON Data</h3>
        <pre className="text-sm bg-fd-muted p-4 rounded overflow-auto">
          {JSON.stringify(items, null, 2)}
        </pre>
      </div>
    </div>
  )
}
