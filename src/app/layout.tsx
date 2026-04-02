import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TrustWork — Find trusted workers through people you know',
  description: "Nigeria's trust-based labour marketplace. Find chefs, drivers, plumbers, and more — recommended by people in your contacts.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
