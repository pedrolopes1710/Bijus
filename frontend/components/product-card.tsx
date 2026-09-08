"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, ShoppingBag } from "lucide-react"
import type { Produto } from "@/lib/types"
import { resolveImageUrl } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createSlug } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { useFavorites } from "@/contexts/favorites-context"
import { useRef, useState } from "react"
import { startViewTransition } from "@/lib/view-transition"

interface ProductCardProps {
  produto: Produto
  onAddToCart?: (produto: Produto) => void
  onToggleFavorite?: (produto: Produto) => void
}

const FALLBACK_IMAGE = "/uploads/produtos/feira-caneca-02.jpeg"

export function ProductCard({ produto, onAddToCart, onToggleFavorite }: ProductCardProps) {
  const { adicionarAoCarrinho } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [adicionado, setAdicionado] = useState(false)
  const isFavorito = isFavorite(produto.id)
  const href = `/produto/${createSlug(produto.nome)}`
  const router = useRouter()
  const mediaRef = useRef<HTMLDivElement>(null)

  const openProduct = (event: React.MouseEvent) => {
    // Deixa passar cliques com modificador / botão do meio (abrir noutro separador)
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) return
    event.preventDefault()
    if (mediaRef.current) mediaRef.current.style.viewTransitionName = "product-media"
    startViewTransition(
      () => router.push(href),
      () => {
        if (mediaRef.current) mediaRef.current.style.viewTransitionName = ""
      },
    )
  }

  // Tilt 3D: inclina o cartão e move o brilho consoante o cursor.
  const handleTiltMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) return
    const el = event.currentTarget
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    const max = 5.5
    el.style.setProperty("--tilt-y", `${(px - 0.5) * max * 2}deg`)
    el.style.setProperty("--tilt-x", `${(0.5 - py) * max * 2}deg`)
    el.style.setProperty("--glare-x", `${px * 100}%`)
    el.style.setProperty("--glare-y", `${py * 100}%`)
  }

  const handleTiltEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.classList.add("tilt-active")
  }

  const handleTiltLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = event.currentTarget
    el.classList.remove("tilt-active")
    el.style.setProperty("--tilt-x", "0deg")
    el.style.setProperty("--tilt-y", "0deg")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if ((produto.opcoes || []).length > 0) {
      window.location.href = href
      return
    }
    if (produto.stock > 0) {
      adicionarAoCarrinho(produto)
      onAddToCart?.(produto)
      setAdicionado(true)
      setTimeout(() => setAdicionado(false), 1800)
    }
  }

  const handleToggleFavorite = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    toggleFavorite(produto)
    onToggleFavorite?.(produto)
  }

  const imageUrl = resolveImageUrl(produto.fotos?.[0]?.urlProduto) || FALLBACK_IMAGE
  const stockLabel = produto.stock === 0 ? "Esgotado" : produto.stock < 10 ? "Ultimas unidades" : "Em stock"

  return (
    <Card
      className="tilt group relative overflow-hidden rounded-2xl border border-foreground/[0.08] bg-card shadow-soft transition-[box-shadow,border-color] duration-500 hover:border-accent/25 hover:shadow-lift"
      onMouseMove={handleTiltMove}
      onMouseEnter={handleTiltEnter}
      onMouseLeave={handleTiltLeave}
    >
      <span className="tilt-glare" />
      <CardContent className="p-0">
        <div ref={mediaRef} className="relative aspect-[4/5] overflow-hidden bg-muted">
          <Link href={href} aria-label={`Ver ${produto.nome}`} className="block h-full" onClick={openProduct}>
            <img
              src={imageUrl}
              alt={produto.nome}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.07]"
              onError={(event) => {
                event.currentTarget.src = FALLBACK_IMAGE
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-foreground/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </Link>

          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] shadow-sm backdrop-blur ${
                produto.stock === 0
                  ? "bg-foreground/85 text-background"
                  : produto.stock < 10
                    ? "bg-accent text-accent-foreground"
                    : "bg-card/92 text-foreground"
              }`}
            >
              {stockLabel}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 z-10 rounded-full bg-card/90 text-foreground shadow-sm backdrop-blur transition hover:scale-110 hover:bg-card"
            onClick={handleToggleFavorite}
            aria-label={isFavorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart className={`h-4 w-4 transition ${isFavorito ? "scale-110 fill-accent text-accent" : ""}`} />
          </Button>

          {/* Em ecrãs de toque não há hover: o botão fica sempre visível, senão
              era impossível adicionar ao carrinho a partir da listagem. A partir
              de `sm` volta a surgir com o hover, como no desenho original. */}
          <Button
            size="sm"
            disabled={produto.stock === 0}
            className="absolute bottom-3 left-3 right-3 z-10 h-11 translate-y-0 rounded-full bg-card text-foreground opacity-100 shadow-xl transition duration-300 hover:bg-card/92 disabled:opacity-70 sm:h-10 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-4 w-4" />
            {produto.stock === 0
              ? "Esgotado"
              : (produto.opcoes || []).length > 0
                ? "Escolher opções"
                : adicionado
                  ? "Adicionado ✓"
                  : "Adicionar"}
          </Button>
        </div>

        <div className="space-y-2.5 p-3 sm:space-y-3.5 sm:p-5">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground sm:gap-3 sm:text-[10px] sm:tracking-[0.22em]">
              <span className="truncate">{produto.categoria?.nome || "Produto"}</span>
              <span className={produto.stock > 0 ? "text-muted-foreground" : "text-accent"}>
                {produto.stock > 0 ? `${produto.stock} disp.` : "Esgotado"}
              </span>
            </div>

            <Link href={href} className="group/title block" onClick={openProduct}>
              <h3 className="line-clamp-2 min-h-[2.75rem] font-display text-[0.95rem] font-semibold leading-[1.15] tracking-[-0.01em] transition-colors group-hover/title:text-accent sm:min-h-[2.75rem] sm:text-lg">
                {produto.nome}
              </h3>
            </Link>

            <p className="hidden min-h-[2.5rem] text-sm leading-5 text-muted-foreground line-clamp-2 sm:block">{produto.descricao}</p>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-foreground/[0.08] pt-3.5">
            <span className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{formatPrice(produto.preco)}</span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-accent transition hover:bg-accent hover:text-accent-foreground"
              asChild
            >
              <Link href={href} aria-label={`Abrir ${produto.nome}`} onClick={openProduct}>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
