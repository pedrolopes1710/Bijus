"use client"

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useState,useRef} from "react"
import type { Categoria, Produto } from "@/lib/types"
import { createSlug } from "@/lib/utils"
import { fetchProdutosPorCategoria, resolveImageUrl } from "@/lib/api"

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
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(imageUrl || defaultImage)

  const requestRef = useRef(0)
useEffect(() => {
  const requestId = ++requestRef.current

  // reset imediato
  setPhotoUrl(imageUrl || defaultImage)

  if (imageUrl) return

  ;(async () => {
    try {
      const produtos = await fetchProdutosPorCategoria(categoria.id)

      if (requestRef.current !== requestId) return

      // Ensure we only consider products that actually belong to this category
      const produtosDaCategoria = produtos.filter((p) => p.categoria?.id === categoria.id)

      // pick first product in the category that has photos
      const withPhoto = produtosDaCategoria.find((p) => p.fotos && p.fotos.length > 0)

      if (withPhoto) {
        setPhotoUrl(resolveImageUrl(withPhoto.fotos![0].urlProduto?.url) || defaultImage)
        return
      }

      // fallback: if none with photos but there are products in category, use first product's placeholder
      if (produtosDaCategoria.length > 0) {
        // try to use first product's photo if present, otherwise keep defaultImage
        const first = produtosDaCategoria[0]
        if (first.fotos && first.fotos.length > 0) {
          setPhotoUrl(resolveImageUrl(first.fotos[0].urlProduto?.url) || defaultImage)
        }
      }
    } catch (err) {
      console.error("CategoryCard error:", err)
    }
  })()
}, [categoria.id, imageUrl, defaultImage])



  return (
    <Link href={`/categoria/${createSlug(categoria.nome)}`}>
      <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur">
        <CardContent className="p-0">
          <div className="aspect-square overflow-hidden rounded-t-lg">
            <img
              src={photoUrl}
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
