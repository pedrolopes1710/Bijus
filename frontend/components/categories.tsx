"use client"

import { useEffect, useState } from "react"
import { ArrowRight, LayoutGrid } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { fetchCategorias } from "@/lib/api"
import type { Categoria } from "@/lib/types"
import { CategoryGrid } from "./category-grid"
import { Reveal } from "./reveal"

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
        <Reveal className="mb-10 grid gap-6 lg:mb-14 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <span className="eyebrow mb-5 text-accent">
              <LayoutGrid className="h-3.5 w-3.5" />
              Explorar por desejo
            </span>
            <h2 className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.02em] text-balance sm:text-5xl lg:text-6xl">
              Entre no <span className="accent-italic text-shimmer">universo</span> que é a sua cara.
            </h2>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="h-12 shrink-0 rounded-full border-foreground/15 bg-card px-6 transition hover:border-accent/40 hover:text-accent"
            asChild
          >
            <Link href="/categorias">
              Todas as categorias
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Reveal>

        {error ? (
          <div className="rounded-2xl border border-foreground/[0.08] bg-card px-5 py-12 text-center shadow-soft">
            <p className="font-display text-lg font-semibold text-foreground">{error}</p>
          </div>
        ) : (
          <Reveal delay={120}>
            <CategoryGrid categorias={categorias} loading={loading} />
          </Reveal>
        )}
      </div>
    </section>
  )
}
