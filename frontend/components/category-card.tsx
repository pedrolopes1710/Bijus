"use client"

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import type { Categoria } from "@/lib/types"
import { createSlug } from "@/lib/utils"

interface CategoryCardProps {
  categoria: Categoria
  imageUrl?: string
}

const categoryImages: Record<string, string> = {
  Aneis: "/elegant-gold-and-silver-rings-collection.jpg",
  "Pulseira Bijou": "/stylish-bracelets-and-bangles-collection.jpg",
  Colares: "/beautiful-necklaces-and-pendants-collection.jpg",
  Brincos: "/elegant-earrings-collection-gold-and-silver.jpg",
}

export function CategoryCard({ categoria, imageUrl }: CategoryCardProps) {
  const defaultImage = categoryImages[categoria.nome] || "/jewelry-category.png"

  return (
    <Link href={`/categoria/${createSlug(categoria.nome)}`}>
      <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur">
        <CardContent className="p-0">
          <div className="aspect-square overflow-hidden rounded-t-lg">
            <img
              src={imageUrl || defaultImage}
              alt={categoria.nome}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4 text-center">
            <h3 className="font-semibold text-lg mb-1">{categoria.nome}</h3>
            <p className="text-sm text-muted-foreground">Ver produtos</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
