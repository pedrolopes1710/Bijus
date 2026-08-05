"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { fetchProdutos } from "@/lib/api"
import { createSlug } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag, ArrowLeft, Truck, Shield, RefreshCw, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import { resolveImageUrl } from "@/lib/api"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useFavorites } from "@/contexts/favorites-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface ProdutoClientProps {
  slug: string
}

export default function ProdutoClient({ slug }: ProdutoClientProps) {
  const [produto, setProduto] = useState<any>(null)
  const [produtosRelacionados, setProdutosRelacionados] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { adicionarAoCarrinho } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [quantidade, setQuantidade] = useState(1)
  const [adicionado, setAdicionado] = useState(false)
  const [selecoes, setSelecoes] = useState<Record<string, string>>({})
  
  useEffect(() => {
    async function loadProduto() {
      try {
        const produtos = await fetchProdutos()
        const produtoEncontrado = produtos.find((p) => createSlug(p.nome) === slug)

        if (!produtoEncontrado) {
          notFound()
        }

        setProduto(produtoEncontrado)
        setSelecoes(Object.fromEntries((produtoEncontrado.opcoes || []).map((opcao) => [opcao.nome, opcao.valores?.[0]?.valor || ""])))

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
    if (produto && stockDisponivel > 0) {
      adicionarAoCarrinho(produto, quantidade, varianteSelecionada)
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

  const varianteSelecionada = (produto.variantes || []).find((variante: any) =>
    variante.ativa !== false && Object.entries(selecoes).every(([nome, valor]) => variante.valores?.[nome] === valor),
  )
  const temVariantes = (produto.opcoes || []).length > 0
  const stockDisponivel = temVariantes ? (varianteSelecionada?.stock ?? 0) : produto.stock
  const precoAtual = varianteSelecionada?.preco ?? produto.preco

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
                {stockDisponivel < 10 && stockDisponivel > 0 && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-orange-500 text-white">
                      Últimas unidades
                    </span>
                  </div>
                )}
                {stockDisponivel === 0 && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-500 text-white">Esgotado</span>
                  </div>
                )}
                {/* Embla slider for product photos */}
                {produto?.fotos && produto.fotos.length > 0 ? (
                  <EmblaSlider fotos={produto.fotos} />
                ) : (
                  <img
                    src="/placeholder.svg"
                    alt={produto.nome}
                    className="w-full h-full object-cover"
                  />
                )}
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

              <div className="space-y-2">
                <p className="text-4xl font-bold">{formatPrice(precoAtual)}</p>
                <p className="text-sm text-muted-foreground">Stock disponível: {stockDisponivel} unidades</p>
              </div>

              <p className="text-muted-foreground leading-relaxed">{produto.descricao}</p>

              {(produto.opcoes || []).map((opcao: any) => (
                <div key={opcao.nome} className="space-y-2">
                  <p className="text-sm font-medium">{opcao.nome}: <span className="text-muted-foreground">{selecoes[opcao.nome]}</span></p>
                  <div className="flex flex-wrap gap-2">
                    {(opcao.valores || []).map((item: any) => {
                      const active = selecoes[opcao.nome] === item.valor
                      return (
                        <button key={item.valor} type="button" aria-pressed={active}
                          onClick={() => { setSelecoes((current) => ({ ...current, [opcao.nome]: item.valor })); setQuantidade(1) }}
                          className={`flex min-h-10 items-center gap-2 rounded-md border px-3 text-sm transition-colors ${active ? "border-foreground bg-foreground text-background" : "hover:border-foreground/50"}`}>
                          {item.corHex && <span className="h-5 w-5 rounded-full border border-black/10" style={{ backgroundColor: item.corHex }} />}
                          {item.valor}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {temVariantes && !varianteSelecionada && <p className="text-sm text-destructive">Esta combinação não está disponível.</p>}

              {stockDisponivel > 0 && (
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
                      onClick={() => setQuantidade(Math.min(stockDisponivel, quantidade + 1))}
                      disabled={quantidade >= stockDisponivel}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button size="lg" className="flex-1" disabled={stockDisponivel === 0 || (temVariantes && !varianteSelecionada)} onClick={handleAddToCart}>
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  {stockDisponivel === 0 ? "Esgotado" : adicionado ? "Adicionado ao carrinho!" : "Adicionar ao carrinho"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => toggleFavorite(produto)}
                  aria-label={isFavorite(produto.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                  <Heart className={`h-5 w-5 ${isFavorite(produto.id) ? "fill-accent text-accent" : ""}`} />
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
                        src={resolveImageUrl(p.fotos?.[0]?.urlProduto) || "/placeholder.svg"}
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

// Embla slider component (small, self-contained)
function EmblaSlider({ fotos }: { fotos: any[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev()
  const scrollNext = () => emblaApi && emblaApi.scrollNext()

  return (
    <div className="relative w-full h-full">
      <div className="overflow-hidden h-full" ref={emblaRef as any}>
        <div className="flex h-full">
          {fotos.map((f) => (
            <div key={f.id} className="flex-[0_0_100%] h-full">
              <img
                src={resolveImageUrl(f.urlProduto) || ""}
                alt="produto"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg" }}
              />
            </div>
          ))}
        </div>
      </div>

      {fotos.length > 1 && (
        <>
          <button
            aria-label="Imagem anterior"
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            aria-label="Imagem seguinte"
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  )
}
