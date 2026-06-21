"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type { Produto } from "@/lib/types"

interface FavoritesContextType {
  favoritos: string[]
  isFavorite: (produtoId: string) => boolean
  toggleFavorite: (produto: Produto) => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)
const STORAGE_KEY = "favoritos"

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoritos, setFavoritos] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setFavoritos(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos))
    }
  }, [favoritos, isLoaded])

  const value = useMemo<FavoritesContextType>(
    () => ({
      favoritos,
      isFavorite: (produtoId: string) => favoritos.includes(produtoId),
      toggleFavorite: (produto: Produto) => {
        setFavoritos((current) =>
          current.includes(produto.id) ? current.filter((id) => id !== produto.id) : [...current, produto.id],
        )
      },
    }),
    [favoritos],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)

  if (context === undefined) {
    throw new Error("useFavorites deve ser usado dentro de um FavoritesProvider")
  }

  return context
}
