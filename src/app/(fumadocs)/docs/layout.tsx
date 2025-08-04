import type { ReactNode } from 'react'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { baseOptions } from '@/fumadocs/layout.config'
import { getMenuBySlug } from '@/lib/utils/getCollection'
import type { Menu } from '@payload-types'
import { createPageTree } from '@/payload/utils/create-page-tree'

const sidebarNavigation = (await getMenuBySlug('topic-1')) as Menu
console.log('sidebarNavigation', JSON.stringify(sidebarNavigation, null, 2))

const pageTree = createPageTree(sidebarNavigation)
console.log('pageTree', JSON.stringify(pageTree, null, 2))

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      sidebar={{
        enabled: true,
        tabs: [
          {
            title: 'Components 1',
            description: 'Hello World!',
            url: '/docs/page-1',
          },
          {
            title: 'Components 2',
            description: 'Hello World!',
            url: '/docs/components',
          },
        ],
      }}
      tree={pageTree}
      {...baseOptions}
    >
      {children}
    </DocsLayout>
  )
}
