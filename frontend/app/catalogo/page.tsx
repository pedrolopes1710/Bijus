"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { fetchProdutos } from "@/lib/api"
import type { Produto } from "@/lib/types"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"

export default function CatalogoPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [filteredProdutos, setFilteredProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function loadProdutos() {
      try {
        console.log("[v0] Carregando todos os produtos...")
        const produtosData = await fetchProdutos()
        console.log("[v0] Produtos carregados:", produtosData.length)
        setProdutos(produtosData)
        setFilteredProdutos(produtosData)
      } catch (error) {
        console.error("[v0] Erro ao carregar produtos:", error)
      } finally {
        setLoading(false)
      }
    }
    loadProdutos()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = produtos.filter(
        (produto) =>
          produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          produto.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
          produto.categoria.nome.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredProdutos(filtered)
    } else {
      setFilteredProdutos(produtos)
    }
  }, [produtos, searchTerm])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-balance">Catálogo Completo</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Descubra toda a nossa coleção de joias e bijuterias
          </p>
        </div>

        {/* Barra de busca */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar em todo o catálogo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Estatísticas */}
        {!loading && (
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground">
              {filteredProdutos.length} {filteredProdutos.length === 1 ? "produto encontrado" : "produtos encontrados"}
              {searchTerm && ` para "${searchTerm}"`}
            </p>
          </div>
        )}

        <ProductGrid produtos={filteredProdutos} loading={loading} />

        {!loading && filteredProdutos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm ? "Nenhum produto encontrado para sua busca." : "Nenhum produto disponível no momento."}
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
