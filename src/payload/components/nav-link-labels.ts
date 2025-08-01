'use client'

import { useRowLabel } from '@payloadcms/ui'

export const NavLinkLabel = () => {
  const { data, rowNumber } = useRowLabel<{ link: { label?: string } }>()

  return data.link?.label || `Link ${String(rowNumber).padStart(2, '0')} `
}

export const NavLinkChildLabel = () => {
  const { data, rowNumber } = useRowLabel<{ label?: string }>()

  return data.label || `Link ${String(rowNumber).padStart(2, '0')} `
}
