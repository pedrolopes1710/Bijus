"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag, Star } from "lucide-react"
import type { Produto } from "@/lib/types"
import Link from "next/link"
import { createSlug } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"

interface ProductCardProps {
  produto: Produto
  onToggleFavorite?: (produto: Produto) => void
}

export function ProductCard({ produto, onToggleFavorite }: ProductCardProps) {
  const { adicionarAoCarrinho } = useCart()
  const [adicionado, setAdicionado] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (produto.stock > 0) {
      adicionarAoCarrinho(produto)
      setAdicionado(true)
      setTimeout(() => setAdicionado(false), 2000)
    }
  }

  return (
    <Link href={`/produto/${createSlug(produto.nome)}`}>
      <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-card">
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden rounded-t-lg">
            {produto.stock < 10 && produto.stock > 0 && (
              <div className="absolute top-3 left-3 z-10">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-500 text-white">
                  Últimas unidades
                </span>
              </div>
            )}
            {produto.stock === 0 && (
              <div className="absolute top-3 left-3 z-10">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">Esgotado</span>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 z-10 bg-background/80 hover:bg-background"
              onClick={(e) => {
                e.preventDefault()
                onToggleFavorite?.(produto)
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>

            <img
              src={`/.jpg?key=zqczz&height=400&width=400&query=${encodeURIComponent(produto.nome + " jewelry")}`}
              alt={produto.nome}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <Button
                size="sm"
                disabled={produto.stock === 0}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-accent hover:bg-accent/90 disabled:opacity-50"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {produto.stock === 0 ? "Esgotado" : adicionado ? "Adicionado!" : "Adicionar"}
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">4.5 (12)</span>
            </div>

            <div>
              <h3 className="font-semibold text-sm group-hover:text-accent transition-colors line-clamp-2">
                {produto.nome}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{produto.descricao}</p>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">{formatPrice(produto.preco)}</span>
              <span className="text-xs text-muted-foreground">Stock: {produto.stock}</span>
            </div>

            <div className="text-xs text-muted-foreground">Categoria: {produto.categoria.nome}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
