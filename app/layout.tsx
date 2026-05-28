import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/lib/theme'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Snoops',
  description: 'Your minimal to-do companion',
  icons: {
    icon: '/snoopy.png',
    apple: '/snoopy.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="h-full" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
