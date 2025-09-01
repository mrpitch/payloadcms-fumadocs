import { Poppins, Lora, Fira_Code } from 'next/font/google'

export const sans = Poppins({
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
export const mono = Fira_Code({
  display: 'swap',
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
})
