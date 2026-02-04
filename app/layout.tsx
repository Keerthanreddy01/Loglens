import React from "react"
import type { Metadata } from 'next'

import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import '@/styles/globals.css'



export const metadata: Metadata = {
  title: 'LogLens - Log Intelligence Platform',
  description: 'Production-grade log intelligence platform with real-time streaming, AI insights, and advanced analytics',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

import { ThemeProvider } from '../components/shared/theme-provider'
import { SmoothScroll } from '../components/ui/smooth-scroll'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll>
            {children}
            <Toaster position="bottom-right" theme="dark" />
            <Analytics />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  )
}

