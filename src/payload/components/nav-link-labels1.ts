'use client'

import { useRowLabel } from '@payloadcms/ui'

export const NavLinkLabel = () => {
  const { data, rowNumber } = useRowLabel<{ link: { label?: string } }>()

  return data.link.label || `Link ${String(rowNumber).padStart(2, '0')} `
}
