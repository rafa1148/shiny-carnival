import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HoteliaOS - AI-Powered Hotel Reputation Management',
  description: 'Respond to reviews 5x faster with AI. Built for independent hotels in Southeast Asia.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  )
}