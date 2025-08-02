import type { ReactNode } from 'react'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { baseOptions } from '@/fumadocs/layout.config'
import { getAllByCollection } from '@/lib/utils/getCollection'
import type { Nav } from '@payload-types'
import { getSideNav } from '@/lib/utils/getGlobals'
import { createPageTree } from '@/payload/utils/create-page-tree'

const sidebarNavigation = (await getSideNav()) as Nav
//console.log('sidebarNavigation', JSON.stringify(sidebarNavigation, null, 2))

const pageTree = createPageTree(sidebarNavigation)
console.log('pageTree', JSON.stringify(pageTree, null, 2))

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      sidebar={{
        tabs: [
          {
            title: 'Components 1',
            description: 'Hello World!',
            url: '/docs/components',
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
