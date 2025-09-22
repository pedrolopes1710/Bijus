"use client"

import { ProductCard } from "./product-card"
import type { Produto } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"

interface ProductGridProps {
  produtos: Produto[]
  loading?: boolean
  onAddToCart?: (produto: Produto) => void
  onToggleFavorite?: (produto: Produto) => void
  columns?: "default" | "wide"
}

export function ProductGrid({
  produtos,
  loading,
  onAddToCart,
  onToggleFavorite,
  columns = "default",
}: ProductGridProps) {
  const gridClasses =
    columns === "wide"
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"

  if (loading) {
    return (
      <div className={gridClasses}>
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-0">
              <div className="aspect-square bg-muted rounded-t-lg"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-5 bg-muted rounded"></div>
                <div className="h-6 bg-muted rounded w-24"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={gridClasses}>
      {produtos.map((produto) => (
        <ProductCard key={produto.id} produto={produto} onAddToCart={onAddToCart} onToggleFavorite={onToggleFavorite} />
      ))}
    </div>
  )
}
