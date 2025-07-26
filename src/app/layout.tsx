import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pack Move Go - Professional Moving Services',
  description: 'Professional moving services with packing, moving, and storage solutions. Get a free quote today!',
  keywords: 'moving services, packing, storage, professional movers',
  authors: [{ name: 'Pack Move Go' }],
  creator: 'Pack Move Go',
  publisher: 'Pack Move Go',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.packmovego.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Pack Move Go - Professional Moving Services',
    description: 'Professional moving services with packing, moving, and storage solutions.',
    url: 'https://www.packmovego.com',
    siteName: 'Pack Move Go',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pack Move Go',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pack Move Go - Professional Moving Services',
    description: 'Professional moving services with packing, moving, and storage solutions.',
    images: ['/og-image.jpg'],
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
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 