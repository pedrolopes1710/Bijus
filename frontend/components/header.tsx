"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, Heart, LayoutDashboard, LogOut, Menu, PackageSearch, Search, ShoppingBag, User } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useFavorites } from "@/contexts/favorites-context"
import { fetchCategorias, fetchColecoes } from "@/lib/api"
import type { Categoria, Colecao } from "@/lib/types"
import { createSlug } from "@/lib/utils"

const STORE_NAME = "Biscuit&Arte"

export function Header() {
  const router = useRouter()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [colecoes, setColecoes] = useState<Colecao[]>([])
  const [loadingNavigation, setLoadingNavigation] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { totalItens, isLoaded } = useCart()
  const { favoritos } = useFavorites()
  const { usuario, isAuthenticated, isLoading: authLoading, logout } = useAuth()

  useEffect(() => {
    async function loadNavigation() {
      try {
        const [categoriasData, colecoesData] = await Promise.all([fetchCategorias(), fetchColecoes()])
        setCategorias(categoriasData)
        setColecoes(colecoesData)
      } catch (error) {
        console.error("Erro ao carregar navegacao:", error)
      } finally {
        setLoadingNavigation(false)
      }
    }

    loadNavigation()
  }, [])

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault()
    const query = searchTerm.trim()

    if (query) {
      router.push(`/catalogo?q=${encodeURIComponent(query)}`)
      setSearchTerm("")
    } else {
      router.push("/catalogo")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/92 backdrop-blur-xl supports-[backdrop-filter]:bg-background/78">
      <div className="container mx-auto px-4">
        <div className="flex h-[72px] items-center justify-between gap-3">
          <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label={`${STORE_NAME} - inicio`}>
            <span className="grid h-10 w-10 place-items-center rounded-md bg-foreground text-sm font-black text-background transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
              B
            </span>
            <span className="leading-none">
              <span className="block text-lg font-black tracking-tight text-primary sm:text-xl">{STORE_NAME}</span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground sm:block">
                Online store
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <Button variant="ghost" className="h-10 rounded-md px-3 text-foreground/72 hover:text-foreground" asChild>
              <Link href="/catalogo">Catálogo</Link>
            </Button>

            <NavigationDropdown
              href="/categorias"
              items={categorias.map((categoria) => ({
                href: `/categoria/${createSlug(categoria.nome)}`,
                label: categoria.nome,
              }))}
              loading={loadingNavigation}
              title="Categorias"
              viewAllLabel="Ver todas"
            />

            <NavigationDropdown
              href="/colecoes"
              items={colecoes.map((colecao) => ({
                href: `/colecao/${createSlug(colecao.nomeColecao)}`,
                label: colecao.nomeColecao,
              }))}
              loading={loadingNavigation}
              title="Coleções"
              viewAllLabel="Ver coleções"
            />
          </nav>

          <form onSubmit={submitSearch} className="hidden flex-1 items-center md:flex md:max-w-sm xl:max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Pesquisar produtos, coleções ou estilos"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-11 rounded-md border-foreground/10 bg-muted/55 pl-10 shadow-none transition-colors focus:bg-background"
              />
            </div>
          </form>

          <div className="flex items-center gap-1">
            {!authLoading && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Conta" className="hidden rounded-md hover:bg-muted sm:inline-flex">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 rounded-lg p-2">
                  {isAuthenticated ? (
                    <>
                      <div className="px-2 py-2">
                        <div className="flex items-center gap-3">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/12 text-sm font-bold text-accent">
                            {(usuario?.userName || "U").slice(0, 1).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{usuario?.userName}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {usuario?.clienteDto?.email || "Conta sem email"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/perfil">
                          <User className="mr-2 h-4 w-4" />
                          Meu perfil
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/encomendas">
                          <PackageSearch className="mr-2 h-4 w-4" />
                          Encomendas
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/favoritos">
                          <Heart className="mr-2 h-4 w-4" />
                          Favoritos
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/carrinho">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Carrinho
                        </Link>
                      </DropdownMenuItem>
                      {["admin", "superadmin"].includes(usuario?.role?.toLowerCase() || "") && (
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href="/backoffice">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Abrir backoffice
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Terminar sessao
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/login">Entrar</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/registo">Criar conta</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              variant="ghost"
              size="icon"
              asChild
              className="relative hidden rounded-md hover:bg-muted sm:inline-flex"
              aria-label="Favoritos"
            >
              <Link href="/favoritos">
                <Heart className="h-5 w-5" />
                {favoritos.length > 0 && <Counter value={favoritos.length} />}
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild className="relative rounded-md hover:bg-muted" aria-label="Carrinho">
              <Link href="/carrinho">
                <ShoppingBag className="h-5 w-5" />
                {isLoaded && totalItens > 0 && <Counter value={totalItens} />}
              </Link>
            </Button>

            <MobileMenu
              categorias={categorias}
              colecoes={colecoes}
              loading={loadingNavigation}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              submitSearch={submitSearch}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

function Counter({ value }: { value: number }) {
  return (
    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground shadow-lg shadow-accent/25">
      {value}
    </span>
  )
}

function NavigationDropdown({
  href,
  items,
  loading,
  title,
  viewAllLabel,
}: {
  href: string
  items: { href: string; label: string }[]
  loading: boolean
  title: string
  viewAllLabel: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 rounded-md px-3 text-foreground/72 hover:text-foreground">
          {loading ? `${title}...` : title}
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 rounded-lg border-foreground/10 p-2 shadow-2xl">
        <DropdownMenuItem asChild className="rounded-md">
          <Link href={href}>{viewAllLabel}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {items.length === 0 && !loading ? (
          <DropdownMenuItem disabled>Nenhum item disponivel</DropdownMenuItem>
        ) : (
          items.slice(0, 10).map((item) => (
            <DropdownMenuItem key={item.href} asChild className="rounded-md">
              <Link href={item.href}>{item.label}</Link>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MobileMenu({
  categorias,
  colecoes,
  loading,
  searchTerm,
  setSearchTerm,
  submitSearch,
}: {
  categorias: Categoria[]
  colecoes: Colecao[]
  loading: boolean
  searchTerm: string
  setSearchTerm: (value: string) => void
  submitSearch: (event: React.FormEvent) => void
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-md lg:hidden" aria-label="Abrir menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto px-0">
        <SheetHeader className="px-5 text-left">
          <SheetTitle>{STORE_NAME}</SheetTitle>
        </SheetHeader>

        <div className="px-5">
          <form onSubmit={submitSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar produtos..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="h-11 pl-10"
            />
          </form>
        </div>

        <div className="grid gap-6 px-5 pb-8 pt-2">
          <MobileLink href="/catalogo" label="Catálogo" />
          <MobileSection
            href="/categorias"
            items={categorias.map((categoria) => ({
              href: `/categoria/${createSlug(categoria.nome)}`,
              label: categoria.nome,
            }))}
            loading={loading}
            title="Categorias"
          />
          <MobileSection
            href="/colecoes"
            items={colecoes.map((colecao) => ({
              href: `/colecao/${createSlug(colecao.nomeColecao)}`,
              label: colecao.nomeColecao,
            }))}
            loading={loading}
            title="Coleções"
          />
          <MobileLink href="/favoritos" label="Favoritos" />
          <MobileLink href="/encomendas" label="Encomendas" />
          <MobileLink href="/carrinho" label="Carrinho" />
        </div>
      </SheetContent>
    </Sheet>
  )
}

function MobileLink({ href, label }: { href: string; label: string }) {
  return (
    <SheetClose asChild>
      <Link href={href} className="text-base font-semibold text-foreground">
        {label}
      </Link>
    </SheetClose>
  )
}

function MobileSection({
  href,
  items,
  loading,
  title,
}: {
  href: string
  items: { href: string; label: string }[]
  loading: boolean
  title: string
}) {
  return (
    <div className="space-y-3">
      <MobileLink href={href} label={title} />
      <div className="grid gap-2 border-l border-foreground/12 pl-4">
        {loading ? (
          <span className="text-sm text-muted-foreground">A carregar...</span>
        ) : (
          items.slice(0, 8).map((item) => (
            <SheetClose asChild key={item.href}>
              <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground">
                {item.label}
              </Link>
            </SheetClose>
          ))
        )}
      </div>
    </div>
  )
}

export default Header
