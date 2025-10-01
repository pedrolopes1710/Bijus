"use client"

import { useCart } from "@/contexts/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CarrinhoPage() {
  const { itens, removerDoCarrinho, atualizarQuantidade, totalPreco, isLoaded } = useCart()

  if (!isLoaded) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral-50 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center py-16">
              <p className="text-neutral-600">Carregando carrinho...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (itens.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral-50 py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingBag className="h-24 w-24 text-neutral-300 mb-6" />
              <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h1>
              <p className="text-neutral-600 mb-8">Adicione produtos ao carrinho para continuar comprando</p>
              <Button asChild size="lg">
                <Link href="/catalogo">Ver Catálogo</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Carrinho de Compras</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {itens.map((item) => (
                <Card key={item.produto.id} className="p-6">
                  <div className="flex gap-6">
                    <div className="relative w-32 h-32 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
                      <Image
                        src={`/.jpg?key=qlgep&height=128&width=128&query=${encodeURIComponent(item.produto.nome)}`}
                        alt={item.produto.nome}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{item.produto.nome}</h3>
                          <p className="text-sm text-neutral-600">{item.produto.categoria.nome}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removerDoCarrinho(item.produto.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => atualizarQuantidade(item.produto.id, item.quantidade - 1)}
                            disabled={item.quantidade <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantidade}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => atualizarQuantidade(item.produto.id, item.quantidade + 1)}
                            disabled={item.quantidade >= item.produto.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold">{(item.produto.preco * item.quantidade).toFixed(2)}€</p>
                          <p className="text-sm text-neutral-600">{item.produto.preco.toFixed(2)}€ cada</p>
                        </div>
                      </div>
                      {item.quantidade >= item.produto.stock && (
                        <p className="text-xs text-orange-600 mt-2">Stock máximo atingido</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-6">Resumo do Pedido</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span>{totalPreco.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Envio</span>
                    <span className="text-green-600 font-medium">Grátis</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>{totalPreco.toFixed(2)}€</span>
                  </div>
                </div>

                <Button asChild size="lg" className="w-full mb-3">
                  <Link href="/checkout">Finalizar Compra</Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
                  <Link href="/catalogo">Continuar Comprando</Link>
                </Button>

                <div className="mt-6 pt-6 border-t space-y-2 text-sm text-neutral-600">
                  <p className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Envio grátis para Portugal
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Garantia de 2 anos
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Devolução em 30 dias
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
