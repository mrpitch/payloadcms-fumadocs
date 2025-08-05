import type { ReactNode } from 'react'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { baseOptions } from '@/fumadocs/layout.config'
import { getMenuBySlug } from '@/lib/utils/getCollection'
import type { Menu } from '@payload-types'
import { createPageTree } from '@/payload/utils/create-page-tree'
import type { PageTree } from 'fumadocs-core/server'

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode
  params: { slug: string }
}) {
  //const { slug } = await params
  //const menuSlug = 'topic-2'
  //const sidebarNavigation = (await getMenuBySlug(menuSlug)) as Menu

  //const pageTree = createPageTree(sidebarNavigation)
  //console.log('pageTree', JSON.stringify(pageTree, null, 2))
  const pageTree = {
    name: 'Documentation',
    children: [
      {
        type: 'folder' as const,
        root: true,
        index: {
          type: 'page' as const,
          name: 'Doc 1',
          url: '/docs/doc-1',
        },
        name: 'Components',
        children: [
          {
            type: 'page' as const,
            name: 'Doc 1',
            url: '/docs/doc-1',
          },
          {
            type: 'page' as const,
            name: 'Doc 2',
            url: '/docs/doc-2',
          },
          {
            type: 'folder' as const,
            name: 'SubTopic',
            children: [
              {
                type: 'page' as const,
                name: 'Doc 3',
                url: '/docs/doc-3',
              },
            ],
          },
        ],
      },
      {
        type: 'folder' as const,
        name: 'Getting Started',
        root: true,
        index: {
          type: 'page' as const,
          name: 'Doc 5',
          url: '/docs/doc-5',
        },
        children: [
          {
            type: 'page' as const,
            name: 'Doc 5',
            url: '/docs/doc-5',
          },
          {
            type: 'page' as const,
            name: 'Doc 6',
            url: '/docs/doc-6',
          },
        ],
      },
    ],
  }
  return (
    <DocsLayout
      sidebar={{
        enabled: true,
        tabs: [
          {
            title: 'Components 1',
            description: 'Hello World!',
            url: '/docs/doc-1',
            urls: new Set(['/docs/doc-1', '/docs/doc-2', '/docs/doc-3']),
          },
          {
            title: 'Components 2',
            description: 'Hello World!',
            url: '/docs/doc-5',
            urls: new Set(['/docs/doc-5', '/docs/doc-6']),
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
