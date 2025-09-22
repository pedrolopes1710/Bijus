"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "@/features/shared/components/sidebar"
import { useState } from "react"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <div className="flex h-screen overflow-hidden">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 overflow-auto min-h-0">
          <main className={cn("p-4 md:p-6", sidebarOpen ? "md:ml-64" : "")}>
            <div className="min-h-full">{children}</div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}
