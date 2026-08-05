"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, ShoppingBag, Sparkles, Truck } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { fetchColecoes, fetchProdutos, resolveImageUrl } from "@/lib/api"
import type { Colecao, Produto } from "@/lib/types"
import Link from "next/link"
import { createSlug } from "@/lib/utils"

const FALLBACK_IMAGE = "/uploads/produtos/feira-caneca-02.jpeg"

export function Hero() {
  const [colecao, setColecao] = useState<Colecao | null>(null)
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadShowcase() {
      try {
        const [colecoesData, produtosData] = await Promise.all([
          fetchColecoes().catch(() => [] as Colecao[]),
          fetchProdutos().catch(() => [] as Produto[]),
        ])

        const colecaoMaisRecente = [...colecoesData].sort(
          (a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime(),
        )[0]

        setColecao(colecaoMaisRecente || null)
        setProdutos(produtosData.slice(0, 6))
      } finally {
        setLoading(false)
      }
    }

    loadShowcase()
  }, [])

  const heroImages = useMemo(() => {
    const collectionImages = colecao?.fotos?.map((foto) => resolveImageUrl(foto.urlColecao)).filter(Boolean) || []
    const productImages = produtos
      .map((produto) => resolveImageUrl(produto.fotos?.[0]?.urlProduto))
      .filter(Boolean)

    return [...collectionImages, ...productImages]
  }, [colecao, produtos])

  useEffect(() => {
    if (heroImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 6200)

    return () => clearInterval(interval)
  }, [heroImages.length])

  const carouselImages = heroImages.length > 0 ? heroImages : [FALLBACK_IMAGE]
  const activeImageIndex = currentImageIndex % carouselImages.length
  const featuredProducts = produtos.slice(0, 4)
  const collectionHref = colecao ? `/colecao/${createSlug(colecao.nomeColecao)}` : "/catalogo"
  const heroTitle = colecao?.nomeColecao || "A seleção que faz parar o scroll"
  const productCount = colecao?.produto?.length || produtos.length

  const nextImage = () => {
    if (heroImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }
  }

  const prevImage = () => {
    if (heroImages.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
    }
  }

  return (
    <>
      <section className="relative isolate overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0">
          {carouselImages.map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt={colecao ? colecao.nomeColecao : "Montra de produtos em destaque"}
              className={`hero-carousel-image ${index === activeImageIndex ? "hero-carousel-image-active" : ""}`}
              onError={(event) => {
                event.currentTarget.src = FALLBACK_IMAGE
              }}
            />
          ))}
          {carouselImages.length > 1 && (
            <div
              key={`wash-${activeImageIndex}`}
              className="hero-carousel-wash pointer-events-none absolute inset-y-0 left-[-20%] z-[1] w-[54%] bg-gradient-to-r from-transparent via-background/22 to-transparent"
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(0_0_0/.78)_0%,rgb(0_0_0/.58)_42%,rgb(0_0_0/.24)_70%,rgb(0_0_0/.52)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-foreground to-transparent" />
          {carouselImages.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-px bg-background/15">
              <div
                key={activeImageIndex}
                className="h-full origin-left animate-[hero-progress_6.2s_linear_forwards] bg-background/70"
              />
            </div>
          )}
        </div>

        <div className="container relative mx-auto px-4">
          <div className="flex min-h-[calc(100svh-12rem)] flex-col justify-end pb-7 pt-16 sm:min-h-[calc(100svh-10rem)] lg:pt-20">
            <div className="max-w-4xl pb-8">
              <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-background/18 bg-background/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-background/86 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                Nova montra
              </div>

              <h1 className="animate-fade-up-delay-1 text-shadow-hero mt-5 max-w-[22rem] break-words text-4xl font-black leading-[0.95] tracking-normal text-balance sm:max-w-4xl sm:text-6xl lg:text-8xl">
                {heroTitle}
              </h1>

              <p className="animate-fade-up-delay-2 mt-6 max-w-[21rem] text-base leading-7 text-background/78 sm:max-w-2xl sm:text-lg lg:text-xl">
                Uma seleção visual, rápida e pensada para transformar descoberta em desejo: produtos fortes, detalhes
                claros e um percurso até ao carrinho sem fricção.
              </p>

              <div className="animate-fade-up-delay-2 mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="commerce-sheen relative h-12 w-full overflow-hidden bg-background text-foreground hover:bg-background/92 sm:w-auto"
                  asChild
                >
                  <Link href={collectionHref}>
                    Explorar destaque
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 border-background/40 bg-background/8 text-background backdrop-blur-md hover:bg-background hover:text-foreground"
                  asChild
                >
                  <Link href="/catalogo">
                    <ShoppingBag className="h-4 w-4" />
                    Ver catálogo
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-3 border-t border-background/16 pt-5 sm:grid-cols-3 lg:max-w-4xl">
              <HeroSignal icon={<ShieldCheck className="h-4 w-4" />} title="Compra protegida" text="Fluxo claro do produto ao carrinho" />
              <HeroSignal icon={<Truck className="h-4 w-4" />} title="Entrega preparada" text="Informação essencial sempre visível" />
              <HeroSignal
                icon={<Sparkles className="h-4 w-4" />}
                title={loading ? "A carregar..." : `${productCount || "Novos"} produtos`}
                text="Seleção pronta para descoberta"
              />
            </div>
          </div>
        </div>

        {heroImages.length > 1 && (
          <div className="absolute bottom-8 right-4 z-10 hidden items-center gap-2 lg:flex">
            <button
              onClick={prevImage}
              className="grid h-10 w-10 place-items-center rounded-md border border-background/20 bg-background/12 text-background backdrop-blur-md transition hover:bg-background hover:text-foreground"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="grid h-10 w-10 place-items-center rounded-md border border-background/20 bg-background/12 text-background backdrop-blur-md transition hover:bg-background hover:text-foreground"
              aria-label="Proxima imagem"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {featuredProducts.length > 0 && (
          <div className="absolute bottom-8 right-28 z-10 hidden w-[420px] grid-cols-2 gap-3 xl:grid">
            {featuredProducts.map((produto) => (
              <Link
                key={produto.id}
                href={`/produto/${createSlug(produto.nome)}`}
                className="group grid grid-cols-[64px_1fr] gap-3 rounded-lg border border-background/14 bg-background/12 p-2 text-background shadow-2xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-background hover:text-foreground"
              >
                <img
                  src={resolveImageUrl(produto.fotos?.[0]?.urlProduto) || FALLBACK_IMAGE}
                  alt={produto.nome}
                  className="h-16 w-16 rounded-md object-cover"
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_IMAGE
                  }}
                />
                <span className="min-w-0 self-center">
                  <span className="block truncate text-sm font-bold">{produto.nome}</span>
                  <span className="mt-1 block text-xs text-current/68">
                    {new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(produto.preco)}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="overflow-hidden border-y border-foreground/10 bg-background">
        <div className="animate-marquee-left flex w-max gap-8 py-3 text-[11px] font-bold uppercase tracking-[0.26em] text-muted-foreground">
          {[...Array(2)].map((_, group) => (
            <div key={group} className="flex items-center gap-8">
              <span>Produto em foco</span>
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span>Compra sem ruído</span>
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span>Categorias em movimento</span>
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span>Achados que surpreendem</span>
              <span className="h-1 w-1 rounded-full bg-accent" />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function HeroSignal({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-background/14 bg-background/10 p-4 text-background backdrop-blur-md">
      <div className="flex items-center gap-2 text-sm font-bold">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-background text-foreground">{icon}</span>
        {title}
      </div>
      <p className="mt-2 text-xs leading-5 text-background/68">{text}</p>
    </div>
  )
}
