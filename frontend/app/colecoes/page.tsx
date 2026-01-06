"use client"

import { useState, useEffect } from "react"
import { fetchColecoes, resolveImageUrl } from "@/lib/api"
import type { Colecao } from "@/lib/types"
import { createSlug } from "@/lib/utils"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Calendar, Package } from "lucide-react"

export default function ColecoesPage() {
  const [colecoes, setColecoes] = useState<Colecao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const colecoesData = await fetchColecoes()
        setColecoes(colecoesData)
      } catch (error) {
        console.error("Erro ao carregar coleções:", error)
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
                  <div key={i} className="h-96 bg-muted rounded-lg"></div>
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
          <h1 className="text-4xl font-bold mb-4 text-balance">Nossas Coleções</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Descubra nossas coleções exclusivas de joias cuidadosamente selecionadas
          </p>
        </div>

        {colecoes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colecoes.map((colecao) => {
              const imagemPrincipal =
                colecao.fotos && colecao.fotos.length > 0 ? colecao.fotos[0]?.urlColecao : null
              const dataFormatada = new Date(colecao.dataCriacao).toLocaleDateString("pt-PT")

              return (
                <div
                  key={colecao.id}
                  className="group relative overflow-hidden rounded-lg border bg-card hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                    {imagemPrincipal ? (
                      <img
                        src={resolveImageUrl(imagemPrincipal) || "/placeholder.svg"}
                        alt={colecao.nomeColecao}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                        <Package className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                    {colecao.estadoColecao === "ativa" && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Ativa
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-balance">{colecao.nomeColecao}</h3>
                    <p className="text-sm text-muted-foreground mb-4 text-pretty line-clamp-2">
                      {colecao.descricaoColecao}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        <span>
                          {colecao.produto.length} {colecao.produto.length === 1 ? "produto" : "produtos"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{dataFormatada}</span>
                      </div>
                    </div>

                    <Link
                      href={`/colecao/${createSlug(colecao.nomeColecao)}`}
                      className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Ver Coleção
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma coleção disponível no momento.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
