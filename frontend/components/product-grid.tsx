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
      ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"

  if (loading) {
    return (
      <div className={gridClasses}>
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse overflow-hidden rounded-lg border-foreground/10 bg-card">
            <CardContent className="p-0">
              <div className="aspect-[4/5] bg-muted"></div>
              <div className="p-4 space-y-3">
                <div className="h-3 w-20 rounded bg-muted"></div>
                <div className="h-5 rounded bg-muted"></div>
                <div className="h-4 w-28 rounded bg-muted"></div>
                <div className="h-9 rounded bg-muted"></div>
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
