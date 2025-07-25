import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import type { ReactNode } from 'react'
import { baseOptions } from '@/fumadocs/layout.config'
import { getAllByCollection } from '@/lib/utils/getCollection'
import type { Doc } from '@payload-types'
import { getGlobals } from '@/payload/utils/getGlobals'
import type { AppConfiguration } from '@payload-types'

//const pageTree = (await getAllByCollection('docs')) as { docs: Doc[] }
const appConfiguration: AppConfiguration = await getGlobals('app-configuration')

const sidebarNavigation = appConfiguration?.sideBarNavigation?.navItems

console.log('reference')

const pageTree = {
  name: 'Docs',
  children: sidebarNavigation?.map((item) => ({
    name: item?.link?.label,
    reference:
      typeof item?.link?.reference?.value === 'object'
        ? item?.link?.reference?.value?.slug
        : item?.link?.reference?.value,
    url: item?.link?.url,
    children: [],
  })) as any,
}

// Transform flat docs array into tree structure
const tree = {
  name: 'Docs',
  children: pageTree.children.map((doc: any) => ({
    name: doc.name,
    url: `/docs/${doc.reference}`,
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
