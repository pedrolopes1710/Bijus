"use client"

import { CategoryCard } from "./category-card"
import type { Categoria } from "@/lib/types"

interface CategoryGridProps {
  categorias: Categoria[]
  loading?: boolean
}

export function CategoryGrid({ categorias, loading }: CategoryGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-muted rounded-t-lg"></div>
            <div className="p-4 text-center">
              <div className="h-6 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-20 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {categorias.map((categoria) => (
        <CategoryCard key={categoria.id} categoria={categoria} />
      ))}
    </div>
  )
}
