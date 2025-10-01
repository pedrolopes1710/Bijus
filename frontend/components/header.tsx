"use client"

import { Search, ShoppingBag, User, Heart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { fetchCategorias } from "@/lib/api"
import type { Categoria } from "@/lib/types"
import { createSlug } from "@/lib/utils"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"

export function Header() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { totalItens, isLoaded } = useCart()

  useEffect(() => {
    async function loadCategorias() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchCategorias()
        setCategorias(data)
      } catch (err) {
        console.error("Erro ao carregar categorias:", err)
        setError("Erro ao carregar categorias")
        setCategorias([]) // Set empty array on error
      } finally {
        setLoading(false)
      }
    }
    loadCategorias()
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <h1 className="text-2xl font-bold text-primary cursor-pointer">BijouxVera</h1>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/catalogo">
              <Button variant="ghost" className="text-foreground hover:text-accent">
                Catálogo
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-accent">
                  Categorias {loading && "(...)"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/categorias" className="w-full">
                    Ver Todas as Categorias
                  </Link>
                </DropdownMenuItem>
                {error ? (
                  <DropdownMenuItem disabled>Erro ao carregar categorias</DropdownMenuItem>
                ) : categorias.length === 0 && !loading ? (
                  <DropdownMenuItem disabled>Nenhuma categoria disponível</DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                      ─────────────
                    </DropdownMenuItem>
                    {categorias.map((categoria) => (
                      <DropdownMenuItem key={categoria.id}>
                        <Link href={`/categoria/${createSlug(categoria.nome)}`} className="w-full">
                          {categoria.nome}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" className="text-foreground hover:text-accent">
              Coleções
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-accent">
              Sobre
            </Button>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Pesquisar produtos..."
                className="pl-10 bg-muted/50 border-border focus:border-accent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-foreground hover:text-accent">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground hover:text-accent">
              <Heart className="h-5 w-5" />
            </Button>
            <Link href="/carrinho">
              <Button variant="ghost" size="icon" className="text-foreground hover:text-accent relative">
                <ShoppingBag className="h-5 w-5" />
                {isLoaded && totalItens > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItens}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
