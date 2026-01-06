"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { fetchColecoes } from "@/lib/api"
import type { Colecao } from "@/lib/types"
import Link from "next/link"
import { createSlug } from "@/lib/utils"

export function Hero() {
  const [colecao, setColecao] = useState<Colecao | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadColecao() {
      try {
        const colecoes = await fetchColecoes()
        const colecaoMaisRecente = colecoes.sort(
          (a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime(),
        )[0]

        setColecao(colecaoMaisRecente)
      } catch (error) {
        console.error("Erro ao carregar coleção:", error)
      } finally {
        setLoading(false)
      }
    }

    loadColecao()
  }, [])

  useEffect(() => {
    if (!colecao?.fotos || colecao.fotos.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % colecao.fotos.length)
    }, 5000) // Mudar a cada 5 segundos

    return () => clearInterval(interval)
  }, [colecao])

  const nextImage = () => {
    if (colecao?.fotos) {
      setCurrentImageIndex((prev) => (prev + 1) % colecao.fotos.length)
    }
  }

  const prevImage = () => {
    if (colecao?.fotos) {
      setCurrentImageIndex((prev) => (prev - 1 + colecao.fotos.length) % colecao.fotos.length)
    }
  }

  return (
    <section className="relative bg-gradient-to-r from-muted/30 to-background py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              {!loading && colecao ? (
                <>
                  <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                    Descubra a Nossa
                    <span className="text-accent block">{colecao.nomeColecao}</span>
                  </h1>
                  <p className="text-lg text-muted-foreground text-pretty max-w-md">
                    Peças exclusivas que combinam elegância e sofisticação. Cada peça conta uma história única e foi
                    criada para tornar seus momentos ainda mais especiais.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                    Joias Únicas para
                    <span className="text-accent block">Momentos Especiais</span>
                  </h1>
                  <p className="text-lg text-muted-foreground text-pretty max-w-md">
                    Descubra nossa coleção exclusiva de joias e bijuterias artesanais, criadas com paixão e dedicação
                    para realçar sua beleza natural.
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {colecao ? (
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                  <Link href={`/colecao/${createSlug(colecao.nomeColecao)}`}>
                    Explorar Coleção
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                  <Link href="/catalogo">
                    Ver Catálogo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button
                variant="outline"
                size="lg"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                asChild
              >
                <Link href="/colecoes">Ver Todas as Coleções</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted/50">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                </div>
              ) : colecao?.fotos && colecao.fotos.length > 0 ? (
                <>
                  <img
                    src={colecao.fotos[currentImageIndex].urlColecao.url || "/placeholder.svg"}
                    alt={`${colecao.nomeColecao} - Imagem ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-500"
                  />

                  {/* Controles do carousel */}
                  {colecao.fotos.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full transition-colors"
                        aria-label="Imagem anterior"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full transition-colors"
                        aria-label="Próxima imagem"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>

                      {/* Indicadores */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {colecao.fotos.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentImageIndex ? "bg-accent w-6" : "bg-background/50"
                            }`}
                            aria-label={`Ir para imagem ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <img
                  src="/elegant-jewelry-collection-display-with-rings-neck.jpg"
                  alt="Coleção de joias elegantes"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Badge de informação */}
            <div className="absolute -bottom-6 -left-6 bg-card border rounded-xl p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="text-accent font-bold">✨</span>
                </div>
                <div>
                  {colecao ? (
                    <>
                      <p className="font-semibold text-sm">{colecao.produto.length} Produtos</p>
                      <p className="text-xs text-muted-foreground">Nesta coleção</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-sm">Qualidade Premium</p>
                      <p className="text-xs text-muted-foreground">Materiais selecionados</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
