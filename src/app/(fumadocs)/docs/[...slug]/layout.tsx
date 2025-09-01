import type { ReactNode } from 'react'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { baseOptions } from '@/app/(fumadocs)/layout.config'
import { getTree, getSidebarTabs } from '@/payload/utils/fumadocs/source'

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const currentPath = slug ? `/docs/${slug.join('/')}` : '/docs'
  
  const [pageTree, sidebarTabsRaw] = await Promise.all([
    getTree( {currentPath, draft: false }),
    getSidebarTabs(),
  ])

  // Convert urls arrays back to Sets for Fumadocs
  const sidebarTabs = sidebarTabsRaw.map((tab: any) => ({
    ...tab,
    urls: new Set(tab.urls),
  }))

  return (
    <DocsLayout
      tree={pageTree}
      sidebar={{
        enabled: true,
        tabs: sidebarTabs,
      }}
      {...baseOptions}
    >
      {children}
    </DocsLayout>
  )
}
