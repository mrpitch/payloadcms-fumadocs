import type { ReactNode } from 'react'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { baseOptionsHome } from './layout.config'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout {...baseOptionsHome}>
      <main className="container  w-full">{children}</main>
    </HomeLayout>
  )
}
