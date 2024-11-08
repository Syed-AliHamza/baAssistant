import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/react'
import '@/app/globals.css'
import { cn } from '@/lib/utils'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import { Toaster } from '@/components/ui/sonner'
import { Inter } from 'next/font/google'
import ClerkWrapper from '../clerk-config'
import ClerkToken from '../components/clerkToken/index'
import { AuthProvider } from '../context/authContext'
import NextTopLoader from 'nextjs-toploader'

import './globals.css'
import ReactQueryProvider from '@/lib/utils/reactQueryProvider'
import React from 'react'

export const metadata = {
  metadataBase: new URL(process.env.API_BASE_URL),
  title: {
    default: process.env.BUSINESS_NAME,
    template: `%s - ${process.env.BUSINESS_NAME}`
  },
  description:
    'Transform your data into dynamic conversations—chat directly with your database for instant insights.',
  icons: {
    icon: '/company-logo.svg',
    shortcut: '/company-logo.svg',
    apple: '/company-logo.svg'
  },
  openGraph: {
    title: process.env.BUSINESS_NAME,
    description:
      'Transform your data into dynamic conversations—chat directly with your database for instant insights.',
    url: process.env.API_BASE_URL,
    type: 'website',
    images: [
      {
        url: `${process.env.API_BASE_URL}/images/cosmic-logo.png`, // Replace with the path to your new image
        width: 1200,
        height: 630,
        alt: process.env.BUSINESS_NAME
      }
    ]
  }
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

interface RootLayoutProps {
  children: React.ReactNode
}

const fontHeading = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading'
})

const fontBody = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body'
})

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-sans antialiased',
          GeistSans.variable,
          GeistMono.variable,
          fontHeading.variable,
          fontBody.variable
        )}
      >
        <NextTopLoader color="#003366" showSpinner={false} />
        <ClerkWrapper>
          <AuthProvider>
            <Toaster position="top-center" />
            <ClerkToken />
            <Providers
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ReactQueryProvider>
                <div className="flex flex-col min-h-screen">
                  {/* {!AuthProvider && <Header />} */}
                  <Header />

                  <main className="flex flex-col flex-1 relative w-full">
                    {children}
                  </main>
                </div>
              </ReactQueryProvider>
              <TailwindIndicator />
            </Providers>
            <Analytics />
          </AuthProvider>
        </ClerkWrapper>
      </body>
    </html>
  )
}
