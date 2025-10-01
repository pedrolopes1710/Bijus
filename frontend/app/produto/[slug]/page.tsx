"use client"

import { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
import { fetchProdutos } from "@/lib/api"
import { createSlug } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag, Star, ArrowLeft, Truck, Shield, RefreshCw, Minus, Plus } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ProdutoPage() {
  const params = useParams()
  const slug = params.slug as string
  const [produto, setProduto] = useState<any>(null)
  const [produtosRelacionados, setProdutosRelacionados] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { adicionarAoCarrinho } = useCart()
  const [quantidade, setQuantidade] = useState(1)
  const [adicionado, setAdicionado] = useState(false)

  useEffect(() => {
    async function loadProduto() {
      try {
        const produtos = await fetchProdutos()
        const produtoEncontrado = produtos.find((p) => createSlug(p.nome) === slug)

        if (!produtoEncontrado) {
          notFound()
        }

        setProduto(produtoEncontrado)

        const relacionados = produtos
          .filter((p) => p.categoria.id === produtoEncontrado.categoria.id && p.id !== produtoEncontrado.id)
          .slice(0, 4)
        setProdutosRelacionados(relacionados)
      } catch (error) {
        console.error("Erro ao carregar produto:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProduto()
  }, [slug])

  const handleAddToCart = () => {
    if (produto && produto.stock > 0) {
      adicionarAoCarrinho(produto, quantidade)
      setAdicionado(true)
      setTimeout(() => setAdicionado(false), 2000)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p>Carregando...</p>
        </div>
        <Footer />
      </>
    )
  }

  if (!produto) {
    return notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/catalogo"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao catálogo
          </Link>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Imagem do produto */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                {produto.stock < 10 && produto.stock > 0 && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-orange-500 text-white">
                      Últimas unidades
                    </span>
                  </div>
                )}
                {produto.stock === 0 && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-500 text-white">Esgotado</span>
                  </div>
                )}
                <img
                  src={`/.jpg?height=600&width=600&query=${encodeURIComponent(produto.nome + " jewelry")}`}
                  alt={produto.nome}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Informações do produto */}
            <div className="space-y-6">
              <div>
                <Link
                  href={`/categoria/${createSlug(produto.categoria.nome)}`}
                  className="text-sm text-muted-foreground hover:text-accent"
                >
                  {produto.categoria.nome}
                </Link>
                <h1 className="text-3xl font-bold mt-2 text-balance">{produto.nome}</h1>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(12 avaliações)</span>
              </div>

              <div className="space-y-2">
                <p className="text-4xl font-bold">{formatPrice(produto.preco)}</p>
                <p className="text-sm text-muted-foreground">Stock disponível: {produto.stock} unidades</p>
              </div>

              <p className="text-muted-foreground leading-relaxed">{produto.descricao}</p>

              {produto.stock > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Quantidade:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                      disabled={quantidade <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantidade}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantidade(Math.min(produto.stock, quantidade + 1))}
                      disabled={quantidade >= produto.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button size="lg" className="flex-1" disabled={produto.stock === 0} onClick={handleAddToCart}>
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  {produto.stock === 0 ? "Esgotado" : adicionado ? "Adicionado ao carrinho!" : "Adicionar ao carrinho"}
                </Button>
                <Button size="lg" variant="outline">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              <div className="border-t pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Envio grátis</p>
                    <p className="text-sm text-muted-foreground">Para encomendas acima de 50€</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Garantia de 2 anos</p>
                    <p className="text-sm text-muted-foreground">Cobertura total do fabricante</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RefreshCw className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Devoluções em 30 dias</p>
                    <p className="text-sm text-muted-foreground">Devolução gratuita e sem complicações</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Produtos relacionados */}
          {produtosRelacionados.length > 0 && (
            <div className="border-t pt-12">
              <h2 className="text-2xl font-bold mb-6">Produtos relacionados</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {produtosRelacionados.map((p) => (
                  <Link key={p.id} href={`/produto/${createSlug(p.nome)}`} className="group">
                    <div className="aspect-square overflow-hidden rounded-lg bg-muted mb-3">
                      <img
                        src={`/.jpg?height=300&width=300&query=${encodeURIComponent(p.nome + " jewelry")}`}
                        alt={p.nome}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-accent transition-colors">
                      {p.nome}
                    </h3>
                    <p className="text-sm font-bold mt-1">{formatPrice(p.preco)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
