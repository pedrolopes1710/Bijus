import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { ShopExperience } from "@/components/shop-experience"

export const metadata: Metadata = {
  title: "Biscuit&Arte - Arte em Biscuit",
  description:
    "Descubra a nossa coleção exclusiva de peças em biscuit, joias e bijuterias para todas as ocasiões.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" className="antialiased">
      <body className="font-sans">
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <ShopExperience>{children}</ShopExperience>
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
