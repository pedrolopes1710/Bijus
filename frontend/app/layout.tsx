import type React from "react"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"
import ClientLayout from "./ClientLayout"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "bg-background")}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
