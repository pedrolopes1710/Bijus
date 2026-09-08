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
  // Duas colunas já em telemóvel: com uma só, cada peça ocupava quase um ecrã
  // inteiro e o catálogo passava dos 9000px de scroll. Duas é o padrão em
  // e-commerce móvel e deixa comparar peças lado a lado.
  const gridClasses =
    columns === "wide"
      ? "grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4"
      : "grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"

  if (loading) {
    return (
      <div className={gridClasses}>
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse overflow-hidden rounded-2xl border-foreground/[0.08] bg-card shadow-soft">
            <CardContent className="p-0">
              <div className="aspect-[4/5] bg-muted"></div>
              <div className="space-y-3 p-5">
                <div className="h-3 w-20 rounded-full bg-muted"></div>
                <div className="h-5 rounded-full bg-muted"></div>
                <div className="h-4 w-28 rounded-full bg-muted"></div>
                <div className="h-9 rounded-full bg-muted"></div>
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
