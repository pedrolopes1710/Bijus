"use client"

import { Loader2 } from "lucide-react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { OrderTracker } from "@/components/order-tracker"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"

export default function EncomendasPage() {
  const { usuario, isLoading } = useAuth()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-10">
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-wide text-accent">Area de cliente</p>
            <h1 className="mt-2 text-3xl font-bold">Encomendas</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Acompanhe o estado real das compras registadas na loja.
            </p>
          </div>

          {isLoading ? (
            <div className="flex min-h-48 items-center justify-center rounded-lg border bg-card/40">
              <Loader2 className="h-7 w-7 animate-spin text-accent" />
            </div>
          ) : (
            <OrderTracker clienteId={usuario?.clienteDto?.id} />
          )}
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
