import { Plus_Jakarta_Sans, Source_Serif_4, JetBrains_Mono } from 'next/font/google'

export const sans = Plus_Jakarta_Sans({
  display: 'swap',
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
})
export const serif = Source_Serif_4({
  display: 'swap',
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
})
export const mono = JetBrains_Mono({
  display: 'swap',
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
})
