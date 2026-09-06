"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, Plus, Trash2, LayoutGrid, Package, Lock, ClipboardList, Boxes, Check, Images, Users } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import {
  apagarCategoria,
  apagarColecao,
  apagarProduto,
  apagarUser,
  atualizarEstadoVenda,
  atualizarStockProduto,
  criarCategoria,
  criarColecao,
  criarProduto,
  fetchCategorias,
  fetchColecoes,
  fetchProdutos,
  fetchUsers,
  fetchVendaProdutos,
  fetchVendas,
  resolveImageUrl,
} from "@/lib/api"
import { MOCK_ENABLED } from "@/lib/mock-data"
import type { Categoria, Colecao, Produto, Usuario, Venda } from "@/lib/types"

type AdminTab = "encomendas" | "stock" | "produtos" | "categorias" | "colecoes" | "utilizadores"

const eur = (n: number) => new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n)
const ESTADOS = ["pendente", "paga", "enviada", "entregue", "cancelada"]
const inputClass = "h-10 w-full rounded-lg border border-foreground/10 bg-card px-3.5 text-sm outline-none focus:ring-2 focus:ring-accent/25"

export default function AdminPage() {
  const { isAuthenticated, isAdmin, isSuperAdmin, role, isLoading } = useAuth()
  const [tab, setTab] = useState<AdminTab>("encomendas")

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-accent/10 text-accent">
            <Lock className="h-6 w-6" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold">
            {isAuthenticated ? "Sem permissões" : "Área reservada"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isAuthenticated
              ? "A sua conta não tem acesso de gestão."
              : "Inicie sessão com uma conta de gestão para continuar."}
          </p>
          {!isAuthenticated && (
            <Button asChild className="mt-6">
              <Link href="/login?redirect=/admin">Entrar</Link>
            </Button>
          )}
        </main>
        <Footer />
      </div>
    )
  }

  const allTabs: { id: AdminTab; label: string; icon: React.ReactNode; super?: boolean }[] = [
    { id: "encomendas", label: "Encomendas", icon: <ClipboardList className="h-4 w-4" /> },
    { id: "stock", label: "Stock", icon: <Boxes className="h-4 w-4" /> },
    { id: "produtos", label: "Produtos", icon: <Package className="h-4 w-4" />, super: true },
    { id: "categorias", label: "Categorias", icon: <LayoutGrid className="h-4 w-4" />, super: true },
    { id: "colecoes", label: "Coleções", icon: <Images className="h-4 w-4" />, super: true },
    { id: "utilizadores", label: "Utilizadores", icon: <Users className="h-4 w-4" />, super: true },
  ]
  const tabs = allTabs.filter((t) => !t.super || isSuperAdmin)

  const activeTab = tabs.some((t) => t.id === tab) ? tab : "encomendas"

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow text-accent">Backoffice</span>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.02em]">
              {isSuperAdmin ? "Gestão completa" : "Gestão de logística"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isSuperAdmin
                ? "Gere encomendas, stock, produtos e categorias."
                : "Acompanha encomendas e ajusta o stock da loja."}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-accent">
            {role === "super_admin" ? "Super admin" : "Admin · Logística"}
          </span>
        </div>

        {MOCK_ENABLED && (
          <div className="mb-6 rounded-2xl border border-accent/25 bg-accent/[0.06] p-4 text-sm">
            Modo demonstração — liga o backend real (sem <code className="rounded bg-muted px-1.5 py-0.5 text-xs">NEXT_PUBLIC_USE_MOCKS</code>) para gerir dados a sério.
          </div>
        )}

        <div className="mb-8 inline-flex flex-wrap gap-1 rounded-full border border-foreground/10 bg-card p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === t.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "encomendas" && <EncomendasAdmin />}
        {activeTab === "stock" && <StockAdmin />}
        {activeTab === "produtos" && isSuperAdmin && <ProdutosAdmin />}
        {activeTab === "categorias" && isSuperAdmin && <CategoriasAdmin />}
        {activeTab === "colecoes" && isSuperAdmin && <ColecoesAdmin />}
        {activeTab === "utilizadores" && isSuperAdmin && <UtilizadoresAdmin />}
      </main>
      <Footer />
    </div>
  )
}

/* ---------------- Encomendas (logística) ---------------- */
function EncomendasAdmin() {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [produtoMap, setProdutoMap] = useState<Record<string, Produto>>({})
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState("")

  const carregar = async () => {
    setLoading(true)
    const [v, p] = await Promise.all([fetchVendas().catch(() => []), fetchProdutos().catch(() => [])])
    v.sort((a, b) => new Date(b.vendaData).getTime() - new Date(a.vendaData).getTime())
    setVendas(v)
    setProdutoMap(Object.fromEntries(p.map((x) => [x.id, x])))
    setLoading(false)
  }
  useEffect(() => {
    carregar()
  }, [])

  const mudarEstado = async (venda: Venda, estado: string) => {
    setErro("")
    try {
      await atualizarEstadoVenda(venda, estado)
      setVendas((cur) => cur.map((x) => (x.id === venda.id ? { ...x, vendaEstado: estado } : x)))
    } catch (e: any) {
      setErro(e.message || "Erro ao atualizar estado.")
    }
  }

  if (loading) return <Loader2 className="h-6 w-6 animate-spin text-accent" />

  return (
    <div className="space-y-4">
      {erro && <p className="text-sm text-destructive">{erro}</p>}
      {vendas.length === 0 && <p className="text-sm text-muted-foreground">Ainda não há encomendas.</p>}
      {vendas.map((venda) => (
        <EncomendaCard key={venda.id} venda={venda} produtoMap={produtoMap} onMudarEstado={mudarEstado} />
      ))}
    </div>
  )
}

function EncomendaCard({
  venda,
  produtoMap,
  onMudarEstado,
}: {
  venda: Venda
  produtoMap: Record<string, Produto>
  onMudarEstado: (v: Venda, estado: string) => void
}) {
  const [linhas, setLinhas] = useState<{ produtoId: string; quantidade: number; precoUnitario: number }[]>([])
  useEffect(() => {
    let on = true
    fetchVendaProdutos(venda.id).then((l) => on && setLinhas(l))
    return () => {
      on = false
    }
  }, [venda.id])

  return (
    <div className="rounded-2xl border border-foreground/[0.08] bg-card p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-display text-lg font-semibold">Encomenda #{venda.id.slice(0, 8).toUpperCase()}</p>
          <p className="text-sm text-muted-foreground">
            {venda.cliente?.nome || "Cliente"} ·{" "}
            {new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium", timeStyle: "short" }).format(new Date(venda.vendaData))}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-display text-lg font-semibold">{eur(venda.vendaTotal)}</span>
          <select
            className={`${inputClass} w-40`}
            value={venda.vendaEstado?.toLowerCase() || "pendente"}
            onChange={(e) => onMudarEstado(venda, e.target.value)}
          >
            {ESTADOS.map((e) => (
              <option key={e} value={e}>
                {e[0].toUpperCase() + e.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      {linhas.length > 0 && (
        <ul className="mt-4 grid gap-1.5 border-t border-foreground/[0.06] pt-4 text-sm">
          {linhas.map((l, i) => (
            <li key={i} className="flex justify-between gap-3">
              <span className="text-muted-foreground">
                {produtoMap[l.produtoId]?.nome || `Produto ${l.produtoId.slice(0, 8)}`}
                <span className="text-foreground"> × {l.quantidade}</span>
              </span>
              <span className="font-medium">{eur(l.precoUnitario * l.quantidade)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ---------------- Stock (logística) ---------------- */
function StockAdmin() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [valores, setValores] = useState<Record<string, string>>({})
  const [aGuardar, setAGuardar] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState("")

  const carregar = async () => {
    setLoading(true)
    const p = await fetchProdutos().catch(() => [])
    setProdutos(p)
    setValores(Object.fromEntries(p.map((x) => [x.id, String(x.stock)])))
    setLoading(false)
  }
  useEffect(() => {
    carregar()
  }, [])

  const guardar = async (produto: Produto) => {
    const novo = parseInt(valores[produto.id], 10)
    if (Number.isNaN(novo) || novo < 0) return
    setAGuardar(produto.id)
    setErro("")
    try {
      await atualizarStockProduto(produto.id, novo)
      setProdutos((cur) => cur.map((x) => (x.id === produto.id ? { ...x, stock: novo } : x)))
    } catch (e: any) {
      setErro(e.message || "Erro ao guardar stock.")
    } finally {
      setAGuardar(null)
    }
  }

  if (loading) return <Loader2 className="h-6 w-6 animate-spin text-accent" />

  return (
    <div className="rounded-2xl border border-foreground/[0.08] bg-card p-4 shadow-soft sm:p-6">
      {erro && <p className="mb-3 text-sm text-destructive">{erro}</p>}
      <ul className="divide-y divide-foreground/[0.06]">
        {produtos.map((produto) => {
          const alterado = valores[produto.id] !== String(produto.stock)
          return (
            <li key={produto.id} className="flex items-center gap-4 py-3">
              <img
                src={resolveImageUrl(produto.fotos?.[0]?.urlProduto) || "/placeholder.svg"}
                alt={produto.nome}
                className="h-12 w-12 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{produto.nome}</p>
                <p className="text-xs text-muted-foreground">{produto.categoria?.nome}</p>
              </div>
              <input
                type="number"
                min="0"
                className="h-10 w-24 rounded-lg border border-foreground/10 bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-accent/25"
                value={valores[produto.id] ?? ""}
                onChange={(e) => setValores((v) => ({ ...v, [produto.id]: e.target.value }))}
              />
              <Button size="sm" disabled={!alterado || aGuardar === produto.id} onClick={() => guardar(produto)}>
                {aGuardar === produto.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Guardar
              </Button>
            </li>
          )
        })}
        {produtos.length === 0 && <li className="py-3 text-sm text-muted-foreground">Sem produtos.</li>}
      </ul>
    </div>
  )
}

/* ---------------- Categorias (super_admin) ---------------- */
function CategoriasAdmin() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [nome, setNome] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [erro, setErro] = useState("")

  const carregar = async () => {
    setLoading(true)
    setCategorias(await fetchCategorias().catch(() => []))
    setLoading(false)
  }
  useEffect(() => {
    carregar()
  }, [])

  const adicionar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim()) return
    setSaving(true)
    setErro("")
    try {
      await criarCategoria(nome.trim())
      setNome("")
      await carregar()
    } catch (err: any) {
      setErro(err.message || "Erro ao criar categoria.")
    } finally {
      setSaving(false)
    }
  }

  const remover = async (id: string) => {
    if (!confirm("Apagar esta categoria?")) return
    try {
      await apagarCategoria(id)
      await carregar()
    } catch (err: any) {
      setErro(err.message || "Erro ao apagar categoria.")
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <form onSubmit={adicionar} className="h-fit rounded-2xl border border-foreground/[0.08] bg-card p-6 shadow-soft">
        <h2 className="font-display text-xl font-semibold">Nova categoria</h2>
        <div className="mt-4 space-y-2">
          <Label htmlFor="cat-nome">Nome</Label>
          <Input id="cat-nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Miniaturas" required />
        </div>
        <Button type="submit" className="mt-4 w-full" disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Adicionar
        </Button>
        {erro && <p className="mt-3 text-sm text-destructive">{erro}</p>}
      </form>

      <div className="rounded-2xl border border-foreground/[0.08] bg-card p-6 shadow-soft">
        <h2 className="mb-4 font-display text-xl font-semibold">Categorias ({categorias.length})</h2>
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        ) : (
          <ul className="divide-y divide-foreground/[0.06]">
            {categorias.map((categoria) => (
              <li key={categoria.id} className="flex items-center justify-between py-3">
                <span className="font-medium">{categoria.nome}</span>
                <Button variant="ghost" size="icon" onClick={() => remover(categoria.id)} aria-label="Apagar">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
            {categorias.length === 0 && <li className="py-3 text-sm text-muted-foreground">Sem categorias.</li>}
          </ul>
        )}
      </div>
    </div>
  )
}

/* ---------------- Produtos (super_admin) ---------------- */
function ProdutosAdmin() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [erro, setErro] = useState("")
  const [form, setForm] = useState({ nome: "", descricao: "", preco: "", stock: "", categoriaId: "" })
  const [fotos, setFotos] = useState<File[]>([])

  const carregar = async () => {
    setLoading(true)
    const [p, c] = await Promise.all([fetchProdutos().catch(() => []), fetchCategorias().catch(() => [])])
    setProdutos(p)
    setCategorias(c)
    setForm((f) => ({ ...f, categoriaId: f.categoriaId || c[0]?.id || "" }))
    setLoading(false)
  }
  useEffect(() => {
    carregar()
  }, [])

  const criar = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErro("")
    try {
      await criarProduto({
        nome: form.nome,
        descricao: form.descricao,
        preco: Number(form.preco),
        stock: Number(form.stock),
        categoriaId: form.categoriaId,
        fotos,
      })
      setForm({ nome: "", descricao: "", preco: "", stock: "", categoriaId: categorias[0]?.id || "" })
      setFotos([])
      await carregar()
    } catch (err: any) {
      setErro(err.message || "Erro ao criar produto.")
    } finally {
      setSaving(false)
    }
  }

  const remover = async (id: string) => {
    if (!confirm("Apagar este produto?")) return
    try {
      await apagarProduto(id)
      await carregar()
    } catch (err: any) {
      setErro(err.message || "Erro ao apagar produto.")
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <form onSubmit={criar} className="h-fit space-y-4 rounded-2xl border border-foreground/[0.08] bg-card p-6 shadow-soft">
        <h2 className="font-display text-xl font-semibold">Novo produto</h2>
        <div className="space-y-2">
          <Label htmlFor="p-nome">Nome</Label>
          <Input id="p-nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="p-desc">Descrição</Label>
          <textarea
            id="p-desc"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            rows={3}
            className={`${inputClass} h-auto py-2`}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="p-preco">Preço (€)</Label>
            <Input id="p-preco" type="number" step="0.01" min="0" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-stock">Stock</Label>
            <Input id="p-stock" type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="p-cat">Categoria</Label>
          <select id="p-cat" value={form.categoriaId} onChange={(e) => setForm({ ...form, categoriaId: e.target.value })} className={inputClass} required>
            <option value="" disabled>
              Escolher…
            </option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="p-fotos">Fotos</Label>
          <input
            id="p-fotos"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFotos(Array.from(e.target.files || []))}
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-sm file:font-semibold file:text-background"
          />
        </div>
        <Button type="submit" className="w-full" disabled={saving || !form.categoriaId}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Criar produto
        </Button>
        {erro && <p className="text-sm text-destructive">{erro}</p>}
      </form>

      <div className="rounded-2xl border border-foreground/[0.08] bg-card p-6 shadow-soft">
        <h2 className="mb-4 font-display text-xl font-semibold">Produtos ({produtos.length})</h2>
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        ) : (
          <ul className="divide-y divide-foreground/[0.06]">
            {produtos.map((produto) => (
              <li key={produto.id} className="flex items-center gap-4 py-3">
                <img
                  src={resolveImageUrl(produto.fotos?.[0]?.urlProduto) || "/placeholder.svg"}
                  alt={produto.nome}
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{produto.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {produto.categoria?.nome} · {produto.stock} em stock
                  </p>
                </div>
                <span className="font-display font-semibold">{eur(produto.preco)}</span>
                <Button variant="ghost" size="icon" onClick={() => remover(produto.id)} aria-label="Apagar">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
            {produtos.length === 0 && <li className="py-3 text-sm text-muted-foreground">Sem produtos.</li>}
          </ul>
        )}
      </div>
    </div>
  )
}

/* ---------------- Coleções (super_admin) ---------------- */
function ColecoesAdmin() {
  const [colecoes, setColecoes] = useState<Colecao[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [erro, setErro] = useState("")
  const [form, setForm] = useState({ nome: "", descricao: "", estado: "ativa" })
  const [produtoIds, setProdutoIds] = useState<string[]>([])
  const [fotos, setFotos] = useState<File[]>([])

  const carregar = async () => {
    setLoading(true)
    const [c, p] = await Promise.all([fetchColecoes().catch(() => []), fetchProdutos().catch(() => [])])
    setColecoes(c)
    setProdutos(p)
    setLoading(false)
  }
  useEffect(() => {
    carregar()
  }, [])

  const toggleProduto = (id: string) =>
    setProdutoIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))

  const criar = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErro("")
    try {
      await criarColecao({ nome: form.nome, descricao: form.descricao, estado: form.estado, produtoIds, fotos })
      setForm({ nome: "", descricao: "", estado: "ativa" })
      setProdutoIds([])
      setFotos([])
      await carregar()
    } catch (err: any) {
      setErro(err.message || "Erro ao criar coleção.")
    } finally {
      setSaving(false)
    }
  }

  const remover = async (id: string) => {
    if (!confirm("Apagar esta coleção?")) return
    try {
      await apagarColecao(id)
      await carregar()
    } catch (err: any) {
      setErro(err.message || "Erro ao apagar coleção.")
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <form onSubmit={criar} className="h-fit space-y-4 rounded-2xl border border-foreground/[0.08] bg-card p-6 shadow-soft">
        <h2 className="font-display text-xl font-semibold">Nova coleção</h2>
        <div className="space-y-2">
          <Label htmlFor="c-nome">Nome</Label>
          <Input id="c-nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="c-desc">Descrição</Label>
          <textarea
            id="c-desc"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            rows={2}
            className={`${inputClass} h-auto py-2`}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="c-estado">Estado</Label>
          <select id="c-estado" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} className={inputClass}>
            <option value="ativa">Ativa</option>
            <option value="inativa">Inativa</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Produtos ({produtoIds.length})</Label>
          <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-foreground/10 p-2">
            {produtos.map((p) => (
              <label key={p.id} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-muted">
                <input type="checkbox" checked={produtoIds.includes(p.id)} onChange={() => toggleProduto(p.id)} />
                <span className="truncate">{p.nome}</span>
              </label>
            ))}
            {produtos.length === 0 && <p className="px-2 py-1 text-sm text-muted-foreground">Sem produtos.</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="c-fotos">Fotos</Label>
          <input
            id="c-fotos"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFotos(Array.from(e.target.files || []))}
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-sm file:font-semibold file:text-background"
          />
        </div>
        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Criar coleção
        </Button>
        {erro && <p className="text-sm text-destructive">{erro}</p>}
      </form>

      <div className="rounded-2xl border border-foreground/[0.08] bg-card p-6 shadow-soft">
        <h2 className="mb-4 font-display text-xl font-semibold">Coleções ({colecoes.length})</h2>
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        ) : (
          <ul className="divide-y divide-foreground/[0.06]">
            {colecoes.map((colecao) => (
              <li key={colecao.id} className="flex items-center gap-4 py-3">
                <img
                  src={resolveImageUrl(colecao.fotos?.[0]?.urlColecao) || "/placeholder.svg"}
                  alt={colecao.nomeColecao}
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{colecao.nomeColecao}</p>
                  <p className="text-xs text-muted-foreground">
                    {colecao.estadoColecao} · {colecao.produto?.length || 0} produtos
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => remover(colecao.id)} aria-label="Apagar">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
            {colecoes.length === 0 && <li className="py-3 text-sm text-muted-foreground">Sem coleções.</li>}
          </ul>
        )}
      </div>
    </div>
  )
}

/* ---------------- Utilizadores (super_admin) ---------------- */
function UtilizadoresAdmin() {
  const { usuario } = useAuth()
  const [users, setUsers] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState("")

  const carregar = async () => {
    setLoading(true)
    setUsers(await fetchUsers())
    setLoading(false)
  }
  useEffect(() => {
    carregar()
  }, [])

  const remover = async (id: string) => {
    if (!confirm("Apagar este utilizador?")) return
    setErro("")
    try {
      await apagarUser(id)
      await carregar()
    } catch (err: any) {
      setErro(err.message || "Erro ao apagar utilizador.")
    }
  }

  return (
    <div className="rounded-2xl border border-foreground/[0.08] bg-card p-4 shadow-soft sm:p-6">
      {erro && <p className="mb-3 text-sm text-destructive">{erro}</p>}
      <h2 className="mb-4 font-display text-xl font-semibold">Utilizadores ({users.length})</h2>
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      ) : (
        <ul className="divide-y divide-foreground/[0.06]">
          {users.map((u) => (
            <li key={u.id} className="flex items-center gap-4 py-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                {(u.userName || "U").slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{u.userName}</p>
                <p className="truncate text-xs text-muted-foreground">{u.clienteDto?.email || "Sem email"}</p>
              </div>
              {u.id === usuario?.id ? (
                <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">Você</span>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => remover(u.id)} aria-label="Apagar">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </li>
          ))}
          {users.length === 0 && <li className="py-3 text-sm text-muted-foreground">Sem utilizadores.</li>}
        </ul>
      )}
    </div>
  )
}
