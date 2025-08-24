import { Montserrat, Merriweather, Source_Code_Pro } from 'next/font/google'

export const sans = Montserrat({
  display: 'swap',
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
})
export const serif = Merriweather({
  display: 'swap',
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
})
export const mono = Source_Code_Pro({
  display: 'swap',
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
})
