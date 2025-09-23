"use client"

import { useState, useEffect } from "react"
import { fetchCategorias, fetchProdutos } from "@/lib/api"
import type { Categoria } from "@/lib/types"
import { createSlug } from "@/lib/utils"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

interface CategoriaComContagem extends Categoria {
  produtoCount: number
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<CategoriaComContagem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [categoriasData, produtosData] = await Promise.all([fetchCategorias(), fetchProdutos()])

        // Contar produtos por categoria
        const categoriasComContagem = categoriasData.map((categoria) => ({
          ...categoria,
          produtoCount: produtosData.filter((produto) => produto.categoria.id === categoria.id).length,
        }))

        setCategorias(categoriasComContagem)
      } catch (error) {
        console.error("Erro ao carregar categorias:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded w-96 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-balance">Nossas Categorias</h1>
          <p className="text-lg text-muted-foreground text-pretty">Explore nossa coleção organizada por categorias</p>
        </div>

        {categorias.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorias.map((categoria) => (
              <div
                key={categoria.id}
                className="group relative overflow-hidden rounded-lg border bg-card hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">{categoria.nome.charAt(0).toUpperCase()}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{categoria.nome}</h3>
                    <p className="text-sm text-muted-foreground">
                      {categoria.produtoCount} {categoria.produtoCount === 1 ? "produto" : "produtos"}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <Link
                    href={`/categoria/${createSlug(categoria.nome)}`}
                    className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Ver Produtos
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma categoria disponível no momento.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
