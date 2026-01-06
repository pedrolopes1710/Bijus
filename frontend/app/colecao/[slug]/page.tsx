'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { fetchColecoes, fetchProdutos, resolveImageUrl } from "@/lib/api"
import type { Colecao, Produto } from "@/lib/types"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { createSlug } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Package, ChevronLeft, ChevronRight } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export default function ColecaoPage(): JSX.Element {
  const params = useParams()
  const colecaoSlug = (params as any)?.slug as string
  const router = useRouter()
  const { adicionarItem } = useCart?.() ?? { adicionarItem: () => {} }

  const [colecao, setColecao] = useState<Colecao | null>(null)
  const [loading, setLoading] = useState(true)
  const [imagemAtual, setImagemAtual] = useState(0)

  useEffect(() => {
    async function loadData() {
      try {
        const colecoesData = await fetchColecoes()
        const colecaoAtual = colecoesData.find((col) => createSlug(col.nomeColecao) === colecaoSlug)
        if (!colecaoAtual) {
          setColecao(null)
          return
        }

        // Se os produtos da coleção não trazem fotos, buscar detalhes completos dos produtos
        if (colecaoAtual.produto && colecaoAtual.produto.length > 0) {
          try {
            const allProdutos = await fetchProdutos()
            const produtosComFotos = colecaoAtual.produto.map(p => {
              const detalhado = allProdutos.find(ap => ap.id === p.id)
              return detalhado ?? p
            })
            colecaoAtual.produto = produtosComFotos
          } catch (err) {
            // se falhar ao buscar produtos completos, continuamos com os dados originais
            console.warn("[v0] Não foi possível obter produtos detalhados:", err)
          }
        }

        setColecao(colecaoAtual || null)
      } catch (error) {
        console.error("Erro ao carregar coleção:", error)
      } finally {
        setLoading(false)
      }
    }
    if (colecaoSlug) loadData()
  }, [colecaoSlug])

  useEffect(() => {
    if (!colecao?.fotos || colecao.fotos.length <= 1) return
    const intervalo = setInterval(() => {
      setImagemAtual((prev) => (prev + 1) % colecao.fotos.length)
    }, 5000)
    return () => clearInterval(intervalo)
  }, [colecao?.fotos])

  const handleAddToCart = (produto: Produto) => adicionarItem(produto)

  const handleToggleFavorite = (produto: Produto) => {
    console.log("[v0] Toggling favorite:", produto.nome)
  }

  const proximaImagem = () => {
    if (colecao?.fotos) setImagemAtual((prev) => (prev + 1) % colecao.fotos.length)
  }

  const imagemAnterior = () => {
    if (colecao?.fotos) setImagemAtual((prev) => (prev - 1 + colecao.fotos.length) % colecao.fotos.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mb-4"></div>
            <div className="h-96 bg-muted rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!colecao) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Coleção não encontrada</h1>
            <p className="text-muted-foreground mb-6">A coleção que você está procurando não existe.</p>
            <Button onClick={() => router.push('/colecoes')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar às Coleções
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const dataFormatada = new Date(colecao.dataCriacao).toLocaleDateString("pt-PT")
  const imagemPrincipal = colecao.fotos?.[imagemAtual]?.urlColecao
    ? resolveImageUrl(colecao.fotos[imagemAtual].urlColecao)
    : "/placeholder.svg"
  const temMultiplasImagens = (colecao.fotos?.length ?? 0) > 1

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Início</Link>
          <span>/</span>
          <Link href="/colecoes" className="hover:text-foreground">Coleções</Link>
          <span>/</span>
          <span className="text-foreground">{colecao.nomeColecao}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-muted group">
              {colecao.fotos && colecao.fotos.length > 0 ? (
                <>
                  <img
                    key={imagemAtual}
                    src={imagemPrincipal}
                    alt={colecao.nomeColecao}
                    className="w-full h-full object-cover transition-opacity duration-500"
                  />
                  {temMultiplasImagens && (
                    <>
                      <button onClick={imagemAnterior} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100">
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button onClick={proximaImagem} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100">
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {colecao.fotos.map((_, index) => (
                          <button key={index} onClick={() => setImagemAtual(index)} className={`h-2 rounded-full transition-all ${index === imagemAtual ? "bg-accent w-8" : "bg-white/50 w-2"}`} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-muted-foreground" />
                </div>
              )}
            </div>

            {colecao.fotos && colecao.fotos.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {colecao.fotos.map((foto, index) => (
                  <button key={foto.id} onClick={() => setImagemAtual(index)} className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${imagemAtual === index ? "border-accent" : "border-transparent hover:border-muted"}`}>
                    <img src={resolveImageUrl(foto.urlColecao?.url) || "/placeholder.svg"} alt={`${colecao.nomeColecao} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-4xl font-bold text-balance">{colecao.nomeColecao}</h1>
                {colecao.estadoColecao === "ativa" && <span className="bg-green-500/20 text-green-700 text-xs px-2 py-1 rounded-full">Ativa</span>}
              </div>
              <p className="text-lg text-muted-foreground text-pretty">{colecao.descricaoColecao}</p>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground border-y py-4">
              <div className="flex items-center gap-2"><Package className="w-5 h-5" /><span>{colecao.produto?.length ?? 0} {(colecao.produto?.length ?? 0) === 1 ? "produto" : "produtos"}</span></div>
              <div className="flex items-center gap-2"><Calendar className="w-5 h-5" /><span>Criada em {dataFormatada}</span></div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Sobre esta coleção:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Coleção exclusiva de joias selecionadas</li>
                <li>• Peças únicas e de alta qualidade</li>
                <li>• Envio grátis para Portugal continental</li>
                <li>• Garantia de autenticidade</li>
              </ul>
            </div>

            <Link href="/colecoes">
              <Button variant="outline" className="w-full bg-transparent"><ArrowLeft className="mr-2 h-4 w-4" />Ver Todas as Coleções</Button>
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Produtos desta Coleção</h2>
          {colecao.produto && colecao.produto.length > 0 ? (
            <ProductGrid produtos={colecao.produto} loading={false} onAddToCart={handleAddToCart} onToggleFavorite={handleToggleFavorite} />
          ) : (
            <div className="text-center py-12 bg-muted rounded-lg"><p className="text-muted-foreground">Nenhum produto disponível nesta coleção no momento.</p></div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}