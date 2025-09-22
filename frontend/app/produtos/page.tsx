"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { fetchProdutos, fetchCategorias } from "@/lib/api"
import type { Produto, Categoria } from "@/lib/types"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [filteredProdutos, setFilteredProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const searchParams = useSearchParams()

  useEffect(() => {
    async function loadData() {
      const [produtosData, categoriasData] = await Promise.all([fetchProdutos(), fetchCategorias()])
      setProdutos(produtosData)
      setCategorias(categoriasData)
      setFilteredProdutos(produtosData)

      const categoriaParam = searchParams.get("categoria")
      if (categoriaParam) {
        setSelectedCategory(categoriaParam)
      }

      setLoading(false)
    }
    loadData()
  }, [searchParams])

  useEffect(() => {
    let filtered = produtos

    // Filtrar por categoria
    if (selectedCategory !== "all") {
      filtered = filtered.filter((produto) => produto.categoria.id === selectedCategory)
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (produto) =>
          produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          produto.descricao.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredProdutos(filtered)
  }, [produtos, selectedCategory, searchTerm])

  const handleAddToCart = (produto: Produto) => {
    console.log("[v0] Adding to cart:", produto.nome)
    // TODO: Implementar lógica do carrinho
  }

  const handleToggleFavorite = (produto: Produto) => {
    console.log("[v0] Toggling favorite:", produto.nome)
    // TODO: Implementar lógica de favoritos
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Todos os Produtos</h1>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categorias.map((categoria) => (
                <SelectItem key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ProductGrid
          produtos={filteredProdutos}
          loading={loading}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
        />

        {!loading && filteredProdutos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum produto encontrado.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
