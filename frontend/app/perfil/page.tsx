"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
<<<<<<< Updated upstream
import { Heart, Loader2, LogOut, Package, User } from "lucide-react"
=======
import { Check, Heart, Loader2, LogOut, Package, Pencil, RefreshCw, User, X } from "lucide-react"
>>>>>>> Stashed changes
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { OrderTracker } from "@/components/order-tracker"
import { useAuth } from "@/contexts/auth-context"
import { useFavorites } from "@/contexts/favorites-context"
import { atualizarCliente } from "@/lib/api"

type PerfilTab = "dados" | "encomendas" | "favoritos"

export default function PerfilPage() {
  const { usuario, isAuthenticated, isLoading, logout } = useAuth()
  const { favoritos } = useFavorites()
  const router = useRouter()
  const [erro, setErro] = useState("")
  const [active, setActive] = useState<PerfilTab>("dados")
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ nome: "", email: "", morada: "" })

  const guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const iniciarEdicao = () => {
    setErro("")
    setForm({
      nome: usuario?.clienteDto?.nome || "",
      email: usuario?.clienteDto?.email || "",
      morada: usuario?.clienteDto?.morada || "",
    })
    setEditing(true)
  }

  const guardarDados = async (event: React.FormEvent) => {
    event.preventDefault()
    const clienteId = usuario?.clienteDto?.id
    if (!clienteId) return
    setSaving(true)
    setErro("")
    try {
      await atualizarCliente({ id: clienteId, nome: form.nome, email: form.email, morada: form.morada })
      await recarregarUsuario()
      setEditing(false)
    } catch (err) {
      console.error("Erro ao guardar dados:", err)
      setErro("Não foi possível guardar as alterações.")
    } finally {
      setSaving(false)
    }
  }

  const podeEditar = Boolean(usuario?.clienteDto?.id && guidPattern.test(usuario.clienteDto.id))

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!isAuthenticated || !usuario) {
    return null
  }

  const cliente = usuario.clienteDto

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-accent">Área de cliente</p>
            <h1 className="mt-2 text-3xl font-bold">Meu perfil</h1>
            <p className="mt-2 text-muted-foreground">Gerir dados, favoritos e encomendas.</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Terminar sessão
          </Button>
        </div>

        {erro && <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{erro}</div>}

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-lg border bg-card/40 p-3">
            <nav className="grid gap-1">
              <TabButton active={active === "dados"} icon={<User className="h-4 w-4" />} label="Dados da conta" onClick={() => setActive("dados")} />
              <TabButton active={active === "encomendas"} icon={<Package className="h-4 w-4" />} label="Encomendas" onClick={() => setActive("encomendas")} />
              <TabButton active={active === "favoritos"} icon={<Heart className="h-4 w-4" />} label="Favoritos" onClick={() => setActive("favoritos")} />
            </nav>
          </aside>

          <section className="rounded-lg border bg-card/40 p-6">
            {active === "dados" && (
              <div>
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <User className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{usuario.userName}</h2>
                    <p className="text-sm text-muted-foreground">{cliente?.email || "Conta de cliente"}</p>
                  </div>
                </div>

<<<<<<< Updated upstream
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoItem label="Nome" value={cliente?.nome || usuario.userName} />
                  <InfoItem label="Email" value={cliente?.email || "Sem email associado"} />
                  <InfoItem label="Morada" value={cliente?.morada || "Sem morada guardada"} />
                </div>
=======
                {editing ? (
                  <form onSubmit={guardarDados} className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="perfil-nome">Nome</Label>
                      <Input
                        id="perfil-nome"
                        required
                        value={form.nome}
                        onChange={(e) => setForm({ ...form, nome: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="perfil-email">Email</Label>
                      <Input
                        id="perfil-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="perfil-morada">Morada</Label>
                      <Input
                        id="perfil-morada"
                        value={form.morada}
                        onChange={(e) => setForm({ ...form, morada: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-3 sm:col-span-2">
                      <Button type="submit" disabled={saving}>
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                        Guardar
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setEditing(false)} disabled={saving}>
                        <X className="mr-2 h-4 w-4" />
                        Cancelar
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <InfoItem label="Nome" value={cliente?.nome || usuario.userName} />
                      <InfoItem label="Email" value={cliente?.email || "Sem email associado"} />
                      <InfoItem label="Morada" value={cliente?.morada || "Sem morada guardada"} />
                      <InfoItem label="ID da conta" value={usuario.id} mono />
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      {podeEditar && (
                        <Button onClick={iniciarEdicao}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar dados
                        </Button>
                      )}
                      {authProvider === "password" && (
                        <Button variant="outline" onClick={handleRecarregar} disabled={isRefreshing}>
                          {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                          Recarregar dados
                        </Button>
                      )}
                    </div>
                  </>
                )}
>>>>>>> Stashed changes
              </div>
            )}

            {active === "encomendas" && <OrderTracker clienteId={cliente?.id} />}

            {active === "favoritos" && (
              <EmptyState
                icon={<Heart className="h-10 w-10" />}
                title={`${favoritos.length} ${favoritos.length === 1 ? "produto guardado" : "produtos guardados"}`}
                description="Veja e organize os produtos que marcou como favoritos."
                action={<Button asChild><Link href="/favoritos">Abrir favoritos</Link></Button>}
              />
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function TabButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
        active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </button>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 break-words text-sm font-medium">{value}</p>
    </div>
  )
}

function EmptyState({
  action,
  description,
  icon,
  title,
}: {
  action: React.ReactNode
  description: string
  icon: React.ReactNode
  title: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="text-muted-foreground">{icon}</div>
      <h2 className="mt-4 text-xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      <div className="mt-6">{action}</div>
    </div>
  )
}
