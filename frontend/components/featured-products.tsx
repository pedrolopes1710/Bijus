"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { fetchProdutos } from "@/lib/api"
import type { Produto } from "@/lib/types"
import { ProductGrid } from "./product-grid"
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
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-muted px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Editado para vender
            </div>
            <h2 className="text-4xl font-black leading-[0.98] tracking-normal text-balance sm:text-5xl lg:text-6xl">
              Produtos que merecem o primeiro clique.
            </h2>
          </div>

          <Button variant="outline" size="lg" className="h-12 border-foreground/15 bg-background" asChild>
            <Link href="/catalogo">
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {error ? (
          <div className="rounded-lg border border-foreground/10 bg-muted/60 px-5 py-8 text-center">
            <p className="font-medium text-foreground">{error}</p>
            <p className="mt-2 text-sm text-muted-foreground">Tente atualizar a página dentro de instantes.</p>
          </div>
        ) : (
          <ProductGrid produtos={produtos} loading={loading} />
        )}
      </div>
    </section>
  )
}
