"use client"

import { useEffect, useState } from "react"
import { ArrowRight, LayoutGrid } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { fetchCategorias } from "@/lib/api"
import type { Categoria } from "@/lib/types"
import { CategoryGrid } from "./category-grid"

export function Categories() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCategorias() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchCategorias()
        setCategorias(data)
      } catch (err) {
        console.error("Erro ao carregar categorias:", err)
        setError("Nao foi possivel carregar as categorias.")
        setCategorias([])
      } finally {
        setLoading(false)
      }
    }
    loadCategorias()
  }, [])

  return (
    <section className="bg-muted/45 py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-10 grid gap-6 lg:mb-14 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
              <LayoutGrid className="h-3.5 w-3.5 text-accent" />
              Explorar por desejo
            </div>
            <h2 className="text-4xl font-black leading-[0.98] tracking-normal text-balance sm:text-5xl lg:text-6xl">
              Entre pelo universo que combina consigo.
            </h2>
          </div>

          <Button variant="outline" size="lg" className="h-12 border-foreground/15 bg-background" asChild>
            <Link href="/categorias">
              Todas as categorias
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {error ? (
          <div className="rounded-lg border border-foreground/10 bg-background px-5 py-8 text-center">
            <p className="font-medium text-foreground">{error}</p>
          </div>
        ) : (
          <CategoryGrid categorias={categorias} loading={loading} />
        )}
      </div>
    </section>
  )
}
