import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title:       'Pryysm — 3D Fleet Control',
  description: '3D printing fleet management for operators, educators & bureaus',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body antialiased bg-[#f5f3ef] text-[#1a1624]">
        {children}
      </body>
    </html>
  )
}
