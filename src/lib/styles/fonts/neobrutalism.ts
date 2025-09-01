import { DM_Sans, BioRhyme_Expanded, Space_Mono } from 'next/font/google'

export const sans = DM_Sans({
  display: 'swap',
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
})
export const serif = BioRhyme_Expanded({
  display: 'swap',
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
})
export const mono = Space_Mono({
  display: 'swap',
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
})
