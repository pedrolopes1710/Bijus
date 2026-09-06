"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal } from "lucide-react"
import { fetchCategorias, fetchProdutos } from "@/lib/api"
import type { Categoria, Produto } from "@/lib/types"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { useSearchParams } from "next/navigation"

type Ordenacao = "relevancia" | "preco-asc" | "preco-desc" | "nome"

export default function CatalogoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<CatalogoFallback />}>
        <CatalogoConteudo />
      </Suspense>
      <Footer />
    </div>
  )
}

function CatalogoFallback() {
  return (
    <main className="container mx-auto px-4 py-12 sm:py-16">
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    </main>
  )
}

function CatalogoConteudo() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaId, setCategoriaId] = useState<string>("todas")
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("relevancia")
  const [soDisponiveis, setSoDisponiveis] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "")
  }, [searchParams])

  useEffect(() => {
    async function loadData() {
      try {
        const [produtosData, categoriasData] = await Promise.all([
          fetchProdutos(),
          fetchCategorias().catch(() => [] as Categoria[]),
        ])
        setProdutos(produtosData)
        setCategorias(categoriasData)
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredProdutos = useMemo(() => {
    let lista = [...produtos]

    if (categoriaId !== "todas") {
      lista = lista.filter((produto) => produto.categoria?.id === categoriaId)
    }

    if (soDisponiveis) {
      lista = lista.filter((produto) => produto.stock > 0)
    }

    const termo = searchTerm.trim().toLowerCase()
    if (termo) {
      lista = lista.filter(
        (produto) =>
          produto.nome.toLowerCase().includes(termo) ||
          produto.descricao.toLowerCase().includes(termo) ||
          produto.categoria.nome.toLowerCase().includes(termo),
      )
    }

    switch (ordenacao) {
      case "preco-asc":
        lista.sort((a, b) => a.preco - b.preco)
        break
      case "preco-desc":
        lista.sort((a, b) => b.preco - a.preco)
        break
      case "nome":
        lista.sort((a, b) => a.nome.localeCompare(b.nome, "pt"))
        break
    }

    return lista
  }, [produtos, categoriaId, soDisponiveis, searchTerm, ordenacao])

  const selectClasses =
    "h-11 rounded-full border border-foreground/10 bg-card px-4 text-sm font-medium text-foreground outline-none transition focus:ring-2 focus:ring-accent/25"

  return (
      <main className="container mx-auto px-4 py-12 sm:py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="eyebrow mx-auto mb-5 text-accent">
            <Search className="h-3.5 w-3.5" />
            Catálogo
          </span>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-balance sm:text-5xl">
            Todas as peças, num só lugar
          </h1>
          <p className="mt-4 text-muted-foreground text-pretty">
            Explore a coleção completa de peças feitas à mão em biscuit.
          </p>
        </div>

        {/* Barra de busca */}
        <div className="mx-auto mb-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar em todo o catálogo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 rounded-full pl-11"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="mx-auto mb-8 flex max-w-3xl flex-wrap items-center justify-center gap-3">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            Filtrar
          </span>

          <select className={selectClasses} value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
            <option value="todas">Todas as categorias</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>

          <select className={selectClasses} value={ordenacao} onChange={(e) => setOrdenacao(e.target.value as Ordenacao)}>
            <option value="relevancia">Ordenar: Relevância</option>
            <option value="preco-asc">Preço: menor primeiro</option>
            <option value="preco-desc">Preço: maior primeiro</option>
            <option value="nome">Nome (A–Z)</option>
          </select>

          <button
            type="button"
            onClick={() => setSoDisponiveis((v) => !v)}
            className={`h-11 rounded-full border px-4 text-sm font-medium transition ${
              soDisponiveis
                ? "border-accent bg-accent text-accent-foreground"
                : "border-foreground/10 bg-card text-foreground hover:border-accent/40"
            }`}
          >
            Só disponíveis
          </button>
        </div>

        {!loading && (
          <div className="mb-8 text-center">
            <p className="text-sm text-muted-foreground">
              {filteredProdutos.length} {filteredProdutos.length === 1 ? "peça encontrada" : "peças encontradas"}
              {searchTerm && ` para "${searchTerm}"`}
            </p>
          </div>
        )}

        <ProductGrid produtos={filteredProdutos} loading={loading} />

        {!loading && filteredProdutos.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              {searchTerm || categoriaId !== "todas" || soDisponiveis
                ? "Nenhuma peça corresponde aos filtros escolhidos."
                : "Nenhuma peça disponível no momento."}
            </p>
          </div>
        )}
      </main>
  )
}
