
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import {
  User,
  Mail,
  MapPin,
  LogOut,
  Edit2,
  Loader2,
  ArrowLeft,
  ShoppingCart,
  Heart,
  List
} from "lucide-react"

export default function PerfilPage() {
  const { usuario, isAuthenticated, isLoading, logout, recarregarUsuario } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [erro, setErro] = useState("")
  const [active, setActive] = useState<"dashboard"|"dados" | "encomendas" | "wishlist">("dashboard")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [mounted, isLoading, isAuthenticated, router])

  const handleRecarregar = async () => {
    setIsRefreshing(true)
    setErro("")
    try {
      await recarregarUsuario()
    } catch (err: any) {
      console.error("[v0] Erro ao recarregar perfil:", err)
      setErro("Erro ao recarregar perfil. Tente novamente.")
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!isAuthenticated || !usuario) {
    return null
  }

  const cliente = usuario.clienteDto
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header com voltar */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <div className="w-[80px]" /> {/* Spacer para centrar título */}
        </div>

        {erro && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {erro}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-12">
            {/* Left menu */}
            <aside className="col-span-12 md:col-span-3 border-r hidden md:block">
              <nav className="p-6">
                <ul className="space-y-2">
                  <li>
                    <button
                      className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md ${
                        active === "encomendas" ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setActive("encomendas")}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Encomendas</span>
                    </button>
                  </li>

                  <li>
                    <button
                      className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md ${
                        active === "dados" ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setActive("dados")}
                    >
                      <User className="h-5 w-5" />
                      <span>Dados do cliente</span>
                    </button>
                  </li>

                  <li>
                    <button
                      className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md ${
                        active === "wishlist" ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setActive("wishlist")}
                    >
                      <Heart className="h-5 w-5" />
                      <span>Wishlist</span>
                    </button>
                  </li>
                </ul>

                <div className="mt-6 border-t pt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-red-600 hover:text-red-800"
                  >
                    <LogOut className="h-4 w-4" />
                    Terminar sessão
                  </button>
                </div>
              </nav>
            </aside>

            {/* Main content */}
            <main className="col-span-12 md:col-span-9 p-6">
              {/* top card area (user header) */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6 rounded-md mb-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{usuario.userName}</h2>
                    {cliente && <p className="text-purple-100">{cliente.nome}</p>}
                  </div>
                </div>
              </div>

            {active === "dashboard" && (
                <section>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <List className="h-2 w-2 mr-2 text-purple-600" />
                    Olá, {cliente.nome}!
                  </h3>

                  <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                    <div>
                      <p className="text-sm text-gray-600">Ultimas Encomendas</p>
                      <p className="text-base font-medium"></p>
                    </div>

                    {cliente && (
                      <><div>
                            <p className="text-sm text-gray-600">Morada</p>
                            <p className="text-base font-medium">{cliente.morada}</p>
                          </div>
                      </>
                    )}
                  </div>
                </section>
              )}

              {/* dynamic content */}
              {active === "dados" && (
                <section>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <List className="h-5 w-5 mr-2 text-purple-600" />
                    Dados do Cliente
                  </h3>

                  <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                    <div>
                      <p className="text-sm text-gray-600">Nome de utilizador</p>
                      <p className="text-base font-medium">{usuario.userName}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">ID da Conta</p>
                      <p className="text-base font-medium font-mono text-gray-500">{usuario.id}</p>
                    </div>

                    {cliente && (
                      <>
                        <div>
                          <p className="text-sm text-gray-600">Nome Completo</p>
                          <p className="text-base font-medium">{cliente.nome}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="text-base font-medium">{cliente.email}</p>
                        </div>

                        {cliente.morada && (
                          <div>
                            <p className="text-sm text-gray-600">Morada</p>
                            <p className="text-base font-medium">{cliente.morada}</p>
                          </div>
                        )}
                      </>
                    )}

                    <div className="flex gap-3 pt-4 border-t">
                      <Button onClick={handleRecarregar} variant="outline" className="flex-1" disabled={isRefreshing}>
                        {isRefreshing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            A recarregar...
                          </>
                        ) : (
                          <>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Recarregar Dados
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </section>
              )}

              {active === "encomendas" && (
                <section>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2 text-purple-600" />
                    Encomendas
                  </h3>

                  <div className="bg-gray-50 rounded-lg p-6">
                    {/* Placeholder — substitui por lista real de encomendas */}
                    <p className="text-sm text-gray-600 mb-4">Aqui vão aparecer as suas encomendas.</p>
                    <ul className="space-y-3">
                      <li className="p-4 bg-white rounded shadow-sm">Encomenda #12345 — Concluída</li>
                      <li className="p-4 bg-white rounded shadow-sm">Encomenda #12346 — Em trânsito</li>
                    </ul>
                  </div>
                </section>
              )}

              {active === "wishlist" && (
                <section>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-purple-600" />
                    Wishlist
                  </h3>

                  <div className="bg-gray-50 rounded-lg p-6">
                    {/* Placeholder — substitui por wishlist real */}
                    <p className="text-sm text-gray-600 mb-4">Os produtos que marcou como favoritos aparecerão aqui.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded shadow-sm">Produto favorito 1</div>
                      <div className="p-4 bg-white rounded shadow-sm">Produto favorito 2</div>
                    </div>
                  </div>
                </section>
              )}
            </main>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>Última atualização: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}
