import type { ReactNode } from 'react'
import { cookies } from 'next/headers'

import '@/lib/styles/global.css'
import { sans, serif, mono } from '@/lib/styles/fonts'

import { RootProvider } from 'fumadocs-ui/provider'

import CookieConsent from '@/components/cookie-consent'

export default async function Layout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const hasConsent = cookieStore.get('cookie_consent')?.value

  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
        {!hasConsent && <CookieConsent variant="default" />}
      </body>
    </html>
  )
}
