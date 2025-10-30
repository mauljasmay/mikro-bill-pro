import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ErrorBoundary from '@/components/ErrorBoundary'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MikroBill Pro - Mikrotik Billing & Management System',
  description: 'Complete PPPoE and Hotspot billing solution with Mikrotik RouterOS integration, Xendit payment gateway, and real-time monitoring. Automate your ISP business with our comprehensive billing system.',
  keywords: 'mikrotik billing, pppoe billing, hotspot billing, isp management, routeros, xendit payment, internet billing, automated provisioning, bandwidth management',
  authors: [{ name: 'MikroBill Pro' }],
  creator: 'MikroBill Pro',
  publisher: 'MikroBill Pro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mikrobillpro.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'MikroBill Pro - Mikrotik Billing & Management System',
    description: 'Complete PPPoE and Hotspot billing solution with Mikrotik RouterOS integration, Xendit payment gateway, and real-time monitoring.',
    url: 'https://mikrobillpro.com',
    siteName: 'MikroBill Pro',
    images: [
      {
        url: '/hero-bg.jpg',
        width: 1440,
        height: 720,
        alt: 'MikroBill Pro - Mikrotik Billing System',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MikroBill Pro - Mikrotik Billing & Management System',
    description: 'Complete PPPoE and Hotspot billing solution with Mikrotik RouterOS integration, Xendit payment gateway, and real-time monitoring.',
    images: ['/hero-bg.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}