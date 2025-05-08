import './globals.css'
import { Inter, Raleway } from 'next/font/google'
import type { Metadata } from 'next'
import { AuthProvider } from './context/AuthContext'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
})

const raleway = Raleway({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-raleway',
})

export const metadata: Metadata = {
  title: 'CompetitionWeb - Платформа для проведения соревнований',
  description: 'Организация спортивных, интеллектуальных и творческих соревнований',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${raleway.variable}`}>
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
} 