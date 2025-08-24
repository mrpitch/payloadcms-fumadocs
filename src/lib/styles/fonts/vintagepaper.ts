import { Libre_Baskerville, Lora, IBM_Plex_Mono } from 'next/font/google'

export const sans = Libre_Baskerville({
  display: 'swap',
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
})
export const serif = Lora({
  display: 'swap',
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
})
export const mono = IBM_Plex_Mono({
  display: 'swap',
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
})
