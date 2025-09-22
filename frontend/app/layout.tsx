import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "BijouxVera - Joias e Bijuterias Elegantes",
  description:
    "Descubra nossa coleção exclusiva de joias e bijuterias. Peças únicas e elegantes para todas as ocasiões.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
