import type { ReactNode } from 'react'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { baseOptions } from '../layout.config'
import {
  NavbarMenu,
  NavbarMenuContent,
  NavbarMenuLink,
  NavbarMenuTrigger,
} from 'fumadocs-ui/layouts/home/navbar'
import { Book, BookIcon, ComponentIcon, HomeIcon, HouseIcon } from 'lucide-react'
import { getAllByCollection } from '@/lib/utils/getCollection'
import { Card, Cards } from '@/components/card'

export default async function Layout({ children }: { children: ReactNode }) {
  const items = await getAllByCollection('docs')
  return (
    <HomeLayout
      {...baseOptions}
      links={[
        {
          type: 'menu',
          on: 'menu',
          text: 'Documentation',
          items: [
            {
              text: 'Home',
              url: '/',
              icon: <HomeIcon />,
            },
            {
              text: 'Getting Started',
              url: '/docs/doc-1',
              icon: <Book />,
            },
            {
              text: 'Components',
              url: '/docs/doc-2',
              icon: <ComponentIcon />,
            },
            {
              icon: <HouseIcon />,
              text: 'Advanced Research',
              url: '/docs/doc-5',
            },
          ],
        },
        //shared links
        {
          type: 'icon',
          icon: <BookIcon />,
          text: 'Docs',
          url: '/docs/doc-1',
        },
        //
        {
          type: 'custom',
          // only displayed on navbar, not mobile menu
          on: 'nav',
          children: (
            <NavbarMenu>
              <NavbarMenuTrigger>Documentation</NavbarMenuTrigger>
              <NavbarMenuContent className="grid grid-cols-2 gap-4">
                {items.docs.map((doc) => (
                  <NavbarMenuLink key={doc.id} href={`/docs/${doc.slug}`}>
                    <ComponentIcon className="bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
                    <p className="font-medium">{doc.title}</p>
                    <p className="text-fd-muted-foreground text-sm">{doc.excerpt}</p>
                  </NavbarMenuLink>
                ))}
              </NavbarMenuContent>
            </NavbarMenu>
          ),
        },
      ]}
    >
      <main className="container w-full">
        <div className="flex-1 flex items-center justify-center p-8">{children}</div>
      </main>
    </HomeLayout>
  )
}
