import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import type { ReactNode } from 'react'
import { baseOptions } from '@/fumadocs/layout.config'
import { getAllByCollection } from '@/lib/utils/getCollection'
import type { Doc } from '@payload-types'

const pageTree = (await getAllByCollection('docs')) as { docs: Doc[] }

// Transform flat docs array into tree structure
const tree = {
  name: 'Docs',
  children: pageTree.docs.map((doc) => ({
    name: doc.title,
    url: `/docs/${doc.slug}`,
    children: [],
  })),
} as any

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout tree={tree} {...baseOptions}>
      {children}
    </DocsLayout>
  )
}
