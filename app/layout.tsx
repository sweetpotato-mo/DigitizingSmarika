import './globals.css'
import type { Metadata } from 'next'
import { Lora, Playfair_Display, Noto_Sans_Devanagari } from 'next/font/google'
import NavBar from '@/components/NavBar'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { Suspense } from 'react'

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const noto = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Smarika - Digital Heritage Book',
  description: 'A trilingual digital heritage archive',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${lora.variable} ${playfair.variable} ${noto.variable} bg-[#F9F7F2]`}>
        <LanguageProvider>
          {/* Wrap NavBar in Suspense to fix build error */}
          <Suspense fallback={<div className="h-16 w-full bg-white/50 animate-pulse" />}>
            <NavBar />
          </Suspense>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}