import type { ReactNode } from 'react'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { baseOptions } from '@/app/(fumadocs)/layout.config'
import { getDocsMenu } from '@/lib/utils/getMenu'
import { mapPageTreeFromDocsMenu, mapTabsFromDocsMenu } from '@/payload/utils/create-docs-menu'

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ slug: string }>
}) {
  const menu = await getDocsMenu()
  const pageTree = mapPageTreeFromDocsMenu(menu)
  const tabs = mapTabsFromDocsMenu(menu)

  return (
    <DocsLayout
      sidebar={{
        enabled: true,
        tabs: tabs,
      }}
      tree={pageTree}
      {...baseOptions}
    >
      {children}
    </DocsLayout>
  )
}
