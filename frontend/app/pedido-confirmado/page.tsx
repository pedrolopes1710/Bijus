"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function PedidoConfirmadoPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-24 w-24 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold mb-4">Pedido Confirmado!</h1>

            <p className="text-neutral-600 mb-8">
              Obrigado pela sua compra. Receberá um email de confirmação com os detalhes do seu pedido.
            </p>

            <div className="bg-neutral-100 p-6 rounded-lg mb-8 text-left">
              <h2 className="font-semibold mb-3">Próximos Passos:</h2>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Receberá um email de confirmação nos próximos minutos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>O seu pedido será processado em 1-2 dias úteis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Enviaremos uma notificação quando o pedido for enviado</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Entrega estimada: 3-5 dias úteis</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/catalogo">Continuar Comprando</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">Voltar ao Início</Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
