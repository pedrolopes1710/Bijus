"use client"

import { useEffect, useState } from "react"
import { fetchCategorias } from "@/lib/api"
import type { Categoria } from "@/lib/types"
import { CategoryGrid } from "./category-grid"

export function Categories() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCategorias() {
      const data = await fetchCategorias()
      setCategorias(data)
      setLoading(false)
    }
    loadCategorias()
  }, [])

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Nossas Categorias</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore nossa ampla seleção de joias e bijuterias organizadas por categoria
          </p>
        </div>

        <CategoryGrid categorias={categorias} loading={loading} />
      </div>
    </section>
  )
}
