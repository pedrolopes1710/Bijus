"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { fetchProdutos } from "@/lib/api"
import type { Produto } from "@/lib/types"
import { ProductGrid } from "./product-grid"
import { Reveal } from "./reveal"
import Link from "next/link"

export function FeaturedProducts() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProdutos() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProdutos()
        setProdutos(data.slice(0, 8))
      } catch (err) {
        console.error("Erro ao carregar produtos:", err)
        setError("Nao foi possivel carregar os produtos em destaque.")
        setProdutos([])
      } finally {
        setLoading(false)
      }
    }
    loadProdutos()
  }, [])

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <Reveal className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow mb-5 text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              Escolhidos a dedo
            </span>
            <h2 className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.02em] text-balance sm:text-5xl lg:text-6xl">
              Peças que merecem o <span className="accent-italic text-shimmer">primeiro olhar</span>.
            </h2>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="h-12 shrink-0 rounded-full border-foreground/15 bg-card px-6 transition hover:border-accent/40 hover:text-accent"
            asChild
          >
            <Link href="/catalogo">
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Reveal>

        {error ? (
          <div className="rounded-2xl border border-foreground/[0.08] bg-card px-5 py-12 text-center shadow-soft">
            <p className="font-display text-lg font-semibold text-foreground">{error}</p>
            <p className="mt-2 text-sm text-muted-foreground">Tente atualizar a página dentro de instantes.</p>
          </div>
        ) : (
          <Reveal delay={120}>
            <ProductGrid produtos={produtos} loading={loading} />
          </Reveal>
        )}
      </div>
    </section>
  )
}
