"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ProductGrid } from "@/components/product-grid"
import { useFavorites } from "@/contexts/favorites-context"
import { fetchProdutos } from "@/lib/api"
import type { Produto } from "@/lib/types"

export default function FavoritosPage() {
  const { favoritos } = useFavorites()
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProdutos() {
      try {
        setProdutos(await fetchProdutos())
      } finally {
        setLoading(false)
      }
    }

    loadProdutos()
  }, [])

  const produtosFavoritos = useMemo(
    () => produtos.filter((produto) => favoritos.includes(produto.id)),
    [favoritos, produtos],
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Favoritos</h1>
          <p className="mt-2 text-muted-foreground">Produtos que guardou para ver mais tarde.</p>
        </div>

        <ProductGrid produtos={produtosFavoritos} loading={loading} />

        {!loading && produtosFavoritos.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <Heart className="h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">Ainda não tem favoritos</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Guarde peças de que gosta para voltar a elas rapidamente.
            </p>
            <Button asChild className="mt-6">
              <Link href="/catalogo">Explorar catálogo</Link>
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
