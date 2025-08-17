import type { ReactNode } from 'react'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { baseOptionsHome } from './layout.config'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout {...baseOptionsHome}>
      <main className="container w-full">
        <div className="flex-1 flex items-center justify-center p-8">{children}</div>
      </main>
    </HomeLayout>
  )
}
