import { Antic, Amiri, Chivo_Mono } from 'next/font/google'

export const sans = Antic({
  display: 'swap',
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-sans',
})
export const serif = Amiri({
  display: 'swap',
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
})
export const mono = Chivo_Mono({
  display: 'swap',
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
})
