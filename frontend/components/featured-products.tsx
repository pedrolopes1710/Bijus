"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { fetchProdutos } from "@/lib/api"
import type { Produto } from "@/lib/types"
import { ProductGrid } from "./product-grid"

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
        setError("Erro ao carregar produtos")
        setProdutos([])
      } finally {
        setLoading(false)
      }
    }
    loadProdutos()
  }, [])

  const handleAddToCart = (produto: Produto) => {
    console.log("[v0] Adding to cart:", produto.nome)
    // TODO: Implementar lógica do carrinho
  }

  const handleToggleFavorite = (produto: Produto) => {
    console.log("[v0] Toggling favorite:", produto.nome)
    // TODO: Implementar lógica de favoritos
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Produtos em Destaque</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Descubra as peças mais populares da nossa coleção, escolhidas especialmente para você
          </p>
        </div>

        {error ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Configure a variável NEXT_PUBLIC_API_URL nas configurações do projeto
            </p>
          </div>
        ) : (
          <>
            <ProductGrid
              produtos={produtos}
              loading={loading}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
            />

            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
              >
                Ver Todos os Produtos
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
