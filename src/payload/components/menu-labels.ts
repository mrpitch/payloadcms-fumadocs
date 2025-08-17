'use client'

import { useRowLabel } from '@payloadcms/ui'

export const MenuSectionLabel = () => {
  const { data, rowNumber } = useRowLabel<{ label?: string }>()

  return data.label || `Section ${String(rowNumber).padStart(2, '0')} `
}

export const MenuLinkLabel = () => {
  const { data, rowNumber } = useRowLabel<{ link: { label?: string } }>()

  return data.link?.label || `Link ${String(rowNumber).padStart(2, '0')} `
}

export const MenuLinkChildLabel = () => {
  const { data, rowNumber } = useRowLabel<{ label?: string }>()

  return data.label || `Link ${String(rowNumber).padStart(2, '0')} `
}
