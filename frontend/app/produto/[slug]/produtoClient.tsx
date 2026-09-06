"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { fetchProdutos } from "@/lib/api"
import { createSlug } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag, ArrowLeft, Truck, Sparkles, RefreshCw, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react"
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
        <div className="flex min-h-[60vh] items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
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
<<<<<<< Updated upstream
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                {stockDisponivel < 10 && stockDisponivel > 0 && (
=======
              <div
                className="relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-soft"
                style={{ viewTransitionName: "product-media" }}
              >
                {produto.stock < 10 && produto.stock > 0 && (
>>>>>>> Stashed changes
                  <div className="absolute top-4 left-4 z-10">
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-accent-foreground shadow-sm">
                      Últimas unidades
                    </span>
                  </div>
                )}
                {stockDisponivel === 0 && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="rounded-full bg-foreground/85 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-background shadow-sm backdrop-blur">
                      Esgotado
                    </span>
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
                  className="eyebrow text-accent hover:opacity-80"
                >
                  {produto.categoria.nome}
                </Link>
                <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-balance sm:text-5xl">
                  {produto.nome}
                </h1>
              </div>

<<<<<<< Updated upstream
              <div className="space-y-2">
                <p className="text-4xl font-bold">{formatPrice(precoAtual)}</p>
                <p className="text-sm text-muted-foreground">Stock disponível: {stockDisponivel} unidades</p>
=======
              <div className="space-y-1">
                <p className="font-display text-4xl font-semibold tracking-tight">{formatPrice(produto.preco)}</p>
                <p className="text-sm text-muted-foreground">
                  {produto.stock > 0 ? `${produto.stock} unidades disponíveis` : "De momento esgotado"}
                </p>
>>>>>>> Stashed changes
              </div>

              <p className="leading-relaxed text-muted-foreground">{produto.descricao}</p>

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

              <div className="grid gap-4 border-t border-foreground/[0.08] pt-6">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Feito à mão</p>
                    <p className="text-sm text-muted-foreground">Peça modelada e pintada uma a uma</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                    <Truck className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Envio cuidado em 48h</p>
                    <p className="text-sm text-muted-foreground">Embalagem protegida para peças delicadas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                    <RefreshCw className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Devoluções em 14 dias</p>
                    <p className="text-sm text-muted-foreground">Salvo peças personalizadas por encomenda</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Produtos relacionados */}
          {produtosRelacionados.length > 0 && (
            <div className="border-t border-foreground/[0.08] pt-12">
              <h2 className="mb-8 font-display text-3xl font-semibold tracking-tight">
                Também vai <span className="accent-italic">gostar</span>
              </h2>
              <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                {produtosRelacionados.map((p) => (
                  <Link key={p.id} href={`/produto/${createSlug(p.nome)}`} className="group">
                    <div className="mb-3 aspect-square overflow-hidden rounded-2xl bg-muted shadow-soft">
                      <img
                        src={resolveImageUrl(p.fotos?.[0]?.urlProduto) || "/placeholder.svg"}
                        alt={p.nome}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                      />
                    </div>
                    <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug transition-colors group-hover:text-accent">
                      {p.nome}
                    </h3>
                    <p className="mt-1 font-display text-lg font-semibold">{formatPrice(p.preco)}</p>
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
            className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-card/85 text-foreground shadow-md backdrop-blur transition hover:bg-card"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            aria-label="Imagem seguinte"
            onClick={scrollNext}
            className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-card/85 text-foreground shadow-md backdrop-blur transition hover:bg-card"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  )
}
