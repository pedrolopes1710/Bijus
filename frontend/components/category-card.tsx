"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { BorderBeam } from "./border-beam"
import type { Categoria } from "@/lib/types"
import { createSlug } from "@/lib/utils"
import { fetchProdutosPorCategoria, resolveImageUrl } from "@/lib/api"

interface CategoryCardProps {
  categoria: Categoria
  featured?: boolean
  imageUrl?: string
}

const categoryImages: Record<string, string> = {
  "Quadros artesanais": "/uploads/produtos/feira-quadro-amigos.jpeg",
  Canecas: "/uploads/produtos/feira-caneca-02.jpeg",
  "Louça artesanal": "/uploads/produtos/feira-taca-uvas-01.jpeg",
  Ímanes: "/uploads/produtos/feira-iman-placa-01.jpeg",
  Brincos: "/uploads/produtos/feira-brincos-uvas-01.jpeg",
  "Porta-chaves": "/uploads/produtos/feira-porta-chaves-01.jpeg",
  "Acessórios de vinho": "/uploads/produtos/feira-saca-rolhas-cabo-01.jpeg",
  Decoração: "/uploads/produtos/feira-garrafa-decorativa.jpeg",
}

const FALLBACK_IMAGE = "/uploads/produtos/feira-caneca-02.jpeg"

export function CategoryCard({ categoria, featured = false, imageUrl }: CategoryCardProps) {
  const defaultImage = categoryImages[categoria.nome] || FALLBACK_IMAGE
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(imageUrl || defaultImage)
  const [productCount, setProductCount] = useState<number | null>(null)
  const requestRef = useRef(0)

  useEffect(() => {
    const requestId = ++requestRef.current
    setPhotoUrl(imageUrl || defaultImage)

    if (imageUrl) return

    ;(async () => {
      try {
        const produtos = await fetchProdutosPorCategoria(categoria.id)

        if (requestRef.current !== requestId) return

        setProductCount(produtos.length)
        const productWithPhoto = produtos.find((produto) => produto.categoria?.id === categoria.id && produto.fotos?.length)
        const url = productWithPhoto?.fotos?.[0]?.urlProduto

        setPhotoUrl(resolveImageUrl(url) || defaultImage)
      } catch (err) {
        console.error("Erro ao carregar imagem da categoria:", err)
      }
    })()
  }, [categoria.id, categoria.nome, imageUrl, defaultImage])

  return (
    <Link
      href={`/categoria/${createSlug(categoria.nome)}`}
      className="group relative block h-full min-h-[280px] overflow-hidden rounded-2xl bg-foreground text-background shadow-soft ring-1 ring-foreground/5 transition duration-500 hover:-translate-y-1.5 hover:shadow-lift"
    >
      <img
        src={photoUrl || defaultImage}
        alt={categoria.nome}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.08]"
        onError={(event) => {
          event.currentTarget.src = defaultImage
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/.05)_0%,rgb(0_0_0/.14)_42%,rgb(0_0_0/.8)_100%)] transition duration-500 group-hover:bg-[linear-gradient(180deg,rgb(0_0_0/0)_0%,rgb(0_0_0/.1)_38%,rgb(0_0_0/.86)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-background/20 bg-background/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-background/88 backdrop-blur-md">
          <span className="text-gold">✦</span>
          {productCount === null ? "Seleção" : `${productCount} peças`}
        </div>
        <h3
          className={`${featured ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"} font-display font-semibold leading-[0.98] tracking-[-0.01em]`}
        >
          {categoria.nome}
        </h3>
        <span className="mt-4 inline-flex translate-y-1 items-center gap-2 text-sm font-semibold text-background/80 opacity-90 transition group-hover:translate-y-0 group-hover:text-background">
          Ver seleção
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
        </span>
      </div>
      {featured && <BorderBeam />}
    </Link>
  )
}
