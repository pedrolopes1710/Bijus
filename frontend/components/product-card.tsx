"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, ShoppingBag } from "lucide-react"
import type { Produto } from "@/lib/types"
import { resolveImageUrl } from "@/lib/api"
import Link from "next/link"
import { createSlug } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { useFavorites } from "@/contexts/favorites-context"
import { useState } from "react"

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
    <Card className="group overflow-hidden rounded-lg border border-foreground/10 bg-card shadow-sm transition duration-500 hover:-translate-y-1 hover:border-foreground/18 hover:shadow-2xl hover:shadow-foreground/10">
      <CardContent className="p-0">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <Link href={href} aria-label={`Ver ${produto.nome}`} className="block h-full">
            <img
              src={imageUrl}
              alt={produto.nome}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              onError={(event) => {
                event.currentTarget.src = FALLBACK_IMAGE
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/46 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </Link>

          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
            <span className="rounded-full bg-background/92 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-foreground shadow-sm backdrop-blur">
              {stockLabel}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 z-10 rounded-md bg-background/90 text-foreground shadow-sm backdrop-blur hover:bg-background"
            onClick={handleToggleFavorite}
            aria-label={isFavorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart className={`h-4 w-4 ${isFavorito ? "fill-accent text-accent" : ""}`} />
          </Button>

          <Button
            size="sm"
            disabled={produto.stock === 0}
            className="absolute bottom-3 left-3 right-3 z-10 h-10 translate-y-3 bg-background text-foreground opacity-0 shadow-xl transition duration-300 hover:bg-background/92 disabled:opacity-70 group-hover:translate-y-0 group-hover:opacity-100"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-4 w-4" />
            {produto.stock === 0 ? "Esgotado" : (produto.opcoes || []).length > 0 ? "Escolher opções" : adicionado ? "Adicionado" : "Adicionar"}
          </Button>
        </div>

        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              <span className="truncate">{produto.categoria?.nome || "Produto"}</span>
              <span>{produto.stock > 0 ? `${produto.stock} disp.` : "0 disp."}</span>
            </div>

            <Link href={href} className="group/title block">
              <h3 className="line-clamp-2 min-h-[2.5rem] text-base font-black leading-5 transition-colors group-hover/title:text-accent">
                {produto.nome}
              </h3>
            </Link>

            <p className="line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-muted-foreground">{produto.descricao}</p>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-foreground/10 pt-4">
            <span className="text-xl font-black tracking-tight">{formatPrice(produto.preco)}</span>
            <Button variant="ghost" size="icon" className="rounded-md hover:bg-muted" asChild>
              <Link href={href} aria-label={`Abrir ${produto.nome}`}>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
