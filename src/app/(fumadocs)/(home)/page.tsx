import Link from 'next/link'
import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@/payload/payload.config'

const headers = await getHeaders()
const payloadConfig = await config
const payload = await getPayload({ config: payloadConfig })
const { user } = await payload.auth({ headers })

export default async function HomePage() {
  const docs = await payload.find({
    collection: 'docs',
  })

  return (
    <main className="w-full p-4">
      <h1>Hello World</h1>
      {docs.docs.map((doc) => (
        <div key={doc.id}>
          <h2>{doc.title}</h2>
          <p>{doc.excerpt}</p>
        </div>
      ))}
      <pre>{JSON.stringify(docs, null, 2)}</pre>
    </main>
  )
}
