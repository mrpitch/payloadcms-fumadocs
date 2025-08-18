import { BookIcon } from 'lucide-react'
import { baseOptions } from '@/app/(fumadocs)/layout.config'
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptionsHome: BaseLayoutProps = {
  ...baseOptions,
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [
    {
      icon: 'home',
      text: 'Home',
      url: '/',
    },
    {
      type: 'icon',
      icon: <BookIcon />,
      text: 'Docs',
      url: '/docs/doc-1',
    },
  ],
}
