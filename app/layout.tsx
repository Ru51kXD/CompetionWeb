import './globals.css'
import { Inter, Raleway } from 'next/font/google'
import type { Metadata } from 'next'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import dynamic from 'next/dynamic'

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

// Dynamically import the MapsProvider with no SSR to avoid issues
const MapsProvider = dynamic(
  () => import('./components/MapsProvider').then(mod => mod.MapsProvider),
  { ssr: false }
)

export const metadata: Metadata = {
  title: 'CompetitionWeb - Управление соревнованиями',
  description: 'Платформа для создания и управления соревнованиями, командами и участниками',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${raleway.variable} h-full`}>
      <body className={`${inter.className} h-full`}>
        <AuthProvider>
          <ThemeProvider>
            <MapsProvider>
              {children}
            </MapsProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 