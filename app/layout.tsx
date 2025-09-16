import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { MusicProvider } from '@/contexts/MusicContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Productivity Bingo - Quest for Achievement',
  description: 'Transform your productivity into an epic adventure with medieval-themed bingo boards and magical rewards!',
  keywords: 'productivity, bingo, gamification, ADHD, autism, task management, medieval, fantasy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MusicProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontFamily: 'Cinzel, serif',
                fontWeight: '600',
              },
            }}
          />
        </MusicProvider>
      </body>
    </html>
  )
}
