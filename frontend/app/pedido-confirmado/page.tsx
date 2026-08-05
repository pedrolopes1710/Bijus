"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle, Loader2, XCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCart } from "@/contexts/cart-context"
import { obterEstadoPagamentoStripe } from "@/lib/api"

export default function PedidoConfirmadoPage() {
  const { limparCarrinho } = useCart()
  const [estado, setEstado] = useState<"loading" | "paid" | "failed">("loading")
  const [mensagem, setMensagem] = useState("")

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id")
    if (!sessionId) {
      setMensagem("Não foi possível identificar a sessão de pagamento.")
      setEstado("failed")
      return
    }

    obterEstadoPagamentoStripe(sessionId)
      .then((resultado) => {
        if (!resultado.pago) {
          setMensagem("O pagamento ainda não foi confirmado. Consulte as suas encomendas dentro de alguns instantes.")
          setEstado("failed")
          return
        }
        limparCarrinho()
        sessionStorage.removeItem("ultimo_pedido")
        setEstado("paid")
      })
      .catch((error) => {
        setMensagem(error.message || "Não foi possível confirmar o pagamento.")
        setEstado("failed")
      })
  }, [limparCarrinho])

  return (
    <ProtectedRoute>
      <Header />
      <main className="min-h-screen bg-neutral-50 py-12">
        <div className="container mx-auto max-w-2xl px-4">
          <Card className="p-8 text-center">
            <div className="mb-6 flex justify-center">
              {estado === "loading" && <Loader2 className="h-20 w-20 animate-spin text-neutral-500" />}
              {estado === "paid" && <CheckCircle className="h-20 w-20 text-green-600" />}
              {estado === "failed" && <XCircle className="h-20 w-20 text-red-600" />}
            </div>

            <h1 className="mb-4 text-3xl font-bold">
              {estado === "loading" && "A confirmar o pagamento"}
              {estado === "paid" && "Pagamento confirmado"}
              {estado === "failed" && "Pagamento por confirmar"}
            </h1>

            <p className="mb-8 text-neutral-600">
              {estado === "loading" && "Estamos a validar a resposta segura da Stripe."}
              {estado === "paid" && "A encomenda foi paga com MB WAY e já pode ser preparada."}
              {estado === "failed" && mensagem}
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg"><Link href="/encomendas">Ver encomendas</Link></Button>
              <Button asChild variant="outline" size="lg"><Link href="/catalogo">Continuar a comprar</Link></Button>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </ProtectedRoute>
  )
}
