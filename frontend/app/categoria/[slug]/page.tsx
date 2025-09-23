"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchProdutos, fetchCategorias } from "@/lib/api"
import type { Produto, Categoria } from "@/lib/types"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { createSlug } from "@/lib/utils"
import Link from "next/link"

export default function CategoriaPage() {
  const params = useParams()
  const categoriaSlug = params.slug as string

  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categoria, setCategoria] = useState<Categoria | null>(null)
  const [filteredProdutos, setFilteredProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function loadData() {
      try {
        const [produtosData, categoriasData] = await Promise.all([fetchProdutos(), fetchCategorias()])

        const categoriaAtual = categoriasData.find((cat) => createSlug(cat.nome) === categoriaSlug)
        setCategoria(categoriaAtual || null)

        if (categoriaAtual) {
          const produtosDaCategoria = produtosData.filter((produto) => produto.categoria.id === categoriaAtual.id)
          setProdutos(produtosDaCategoria)
          setFilteredProdutos(produtosDaCategoria)
        }
      } catch (error) {
        console.error("Erro ao carregar dados da categoria:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [categoriaSlug])

  useEffect(() => {
    if (searchTerm) {
      const filtered = produtos.filter(
        (produto) =>
          produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          produto.descricao.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredProdutos(filtered)
    } else {
      setFilteredProdutos(produtos)
    }
  }, [produtos, searchTerm])

  const handleAddToCart = (produto: Produto) => {
    console.log("[v0] Adding to cart:", produto.nome)
    // TODO: Implementar lógica do carrinho
  }

  const handleToggleFavorite = (produto: Produto) => {
    console.log("[v0] Toggling favorite:", produto.nome)
    // TODO: Implementar lógica de favoritos
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mb-4"></div>
            <div className="h-4 bg-muted rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!categoria && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Categoria não encontrada</h1>
            <p className="text-muted-foreground mb-6">A categoria que você está procurando não existe.</p>
            <Link href="/categorias">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar às Categorias
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground">
              Início
            </Link>
            <span>/</span>
            <Link href="/categorias" className="hover:text-foreground">
              Categorias
            </Link>
            <span>/</span>
            <span className="text-foreground">{categoria?.nome}</span>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-balance">{categoria?.nome}</h1>
              <p className="text-lg text-muted-foreground">
                {produtos.length} {produtos.length === 1 ? "produto disponível" : "produtos disponíveis"}
              </p>
            </div>
            <Link href="/categorias">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Todas as Categorias
              </Button>
            </Link>
          </div>
        </div>

        {produtos.length > 0 && categoria && (
          <div className="max-w-md mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={`Buscar em ${categoria.nome}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {searchTerm && categoria && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredProdutos.length} {filteredProdutos.length === 1 ? "produto encontrado" : "produtos encontrados"}
              {` para "${searchTerm}" em ${categoria.nome}`}
            </p>
          </div>
        )}

        <ProductGrid
          produtos={filteredProdutos}
          loading={false}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
        />

        {produtos.length === 0 && !loading && categoria && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Nenhum produto disponível nesta categoria no momento.</p>
            <Link href="/categorias">
              <Button>Ver Outras Categorias</Button>
            </Link>
          </div>
        )}

        {produtos.length > 0 && filteredProdutos.length === 0 && searchTerm && categoria && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Nenhum produto encontrado para "{searchTerm}" em {categoria.nome}.
            </p>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Limpar Busca
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
