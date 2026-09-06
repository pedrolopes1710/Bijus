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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[300px]">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`animate-pulse rounded-2xl bg-muted ${i === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}
          >
            <div className="h-full min-h-[280px] rounded-2xl bg-muted"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[300px]">
      {categorias.map((categoria, index) => (
        <div key={categoria.id} className={index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}>
          <CategoryCard categoria={categoria} featured={index === 0} />
        </div>
      ))}
    </div>
  )
}
