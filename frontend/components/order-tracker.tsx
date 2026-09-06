"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type React from "react"
import Link from "next/link"
import { CheckCircle2, Clock3, ExternalLink, Loader2, PackageCheck, RefreshCw, ShieldCheck, Truck, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { fetchProdutos, fetchVendaProdutos, fetchVendas } from "@/lib/api"
import type { Produto, Venda } from "@/lib/types"

const guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const trackedSteps = ["pendente", "paga", "enviada", "entregue"]

const statusMeta: Record<string, { icon: React.ReactNode; label: string; tone: string }> = {
  pendente: { icon: <Clock3 className="h-4 w-4" />, label: "Pendente", tone: "border-amber-200 bg-amber-50 text-amber-800" },
  paga: { icon: <CheckCircle2 className="h-4 w-4" />, label: "Paga", tone: "border-emerald-200 bg-emerald-50 text-emerald-800" },
  enviada: { icon: <Truck className="h-4 w-4" />, label: "Enviada", tone: "border-sky-200 bg-sky-50 text-sky-800" },
  entregue: { icon: <PackageCheck className="h-4 w-4" />, label: "Entregue", tone: "border-accent/25 bg-accent/10 text-accent" },
  cancelada: { icon: <XCircle className="h-4 w-4" />, label: "Cancelada", tone: "border-destructive/25 bg-destructive/10 text-destructive" },
}

export function OrderTracker({ clienteId }: { clienteId?: string }) {
  const [orders, setOrders] = useState<Venda[]>([])
  const [produtoMap, setProdutoMap] = useState<Record<string, Produto>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const canLoadOrders = Boolean(clienteId && guidPattern.test(clienteId))

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.vendaData).getTime() - new Date(a.vendaData).getTime()),
    [orders],
  )

  const loadOrders = useCallback(async () => {
    if (!clienteId || !canLoadOrders) return

    setIsLoading(true)
    setError("")

    try {
      const [vendas, produtos] = await Promise.all([fetchVendas(clienteId), fetchProdutos().catch(() => [] as Produto[])])
      setOrders(vendas)
      setProdutoMap(Object.fromEntries(produtos.map((p) => [p.id, p])))
    } catch (err: any) {
      setError(err.message || "Nao foi possivel carregar encomendas.")
    } finally {
      setIsLoading(false)
    }
  }, [canLoadOrders, clienteId])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  if (!canLoadOrders) {
    return (
      <div className="rounded-lg border bg-background p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-md bg-muted p-3 text-muted-foreground">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Conta ainda sem cliente associado</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Para manter o tracking fidedigno, so mostramos encomendas ligadas a um cliente real da base de dados.
            </p>
            <Button asChild className="mt-4">
              <Link href="/perfil">Ver perfil</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold">Encomendas</h2>
          <p className="mt-1 text-sm text-muted-foreground">Acompanhe o estado das suas compras.</p>
        </div>
        <Button variant="outline" onClick={loadOrders} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Atualizar
        </Button>
      </div>

      {error && <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

      {isLoading && sortedOrders.length === 0 ? (
        <div className="flex min-h-48 items-center justify-center rounded-lg border bg-background">
          <Loader2 className="h-7 w-7 animate-spin text-accent" />
        </div>
      ) : sortedOrders.length === 0 ? (
        <div className="rounded-lg border bg-background p-8 text-center">
          <PackageCheck className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Ainda nao ha encomendas</h3>
          <p className="mt-2 text-sm text-muted-foreground">Quando finalizar uma compra, o estado aparece aqui.</p>
          <Button asChild className="mt-5">
            <Link href="/catalogo">Explorar catalogo</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedOrders.map((order) => (
            <OrderCard key={order.id} order={order} produtoMap={produtoMap} />
          ))}
        </div>
      )}
    </div>
  )
}

function OrderCard({ order, produtoMap }: { order: Venda; produtoMap: Record<string, Produto> }) {
  const status = order.vendaEstado?.toLowerCase() || "pendente"
  const meta = statusMeta[status] || statusMeta.pendente
  const currentIndex = trackedSteps.indexOf(status)
  const progress = status === "cancelada" ? 100 : currentIndex >= 0 ? (currentIndex / (trackedSteps.length - 1)) * 100 : 0

  const [linhas, setLinhas] = useState<{ produtoId: string; quantidade: number; precoUnitario: number }[]>([])

  useEffect(() => {
    let ativo = true
    fetchVendaProdutos(order.id).then((items) => {
      if (ativo) setLinhas(items)
    })
    return () => {
      ativo = false
    }
  }, [order.id])

  return (
    <article className="rounded-lg border bg-background p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">Encomenda</h3>
            <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium ${meta.tone}`}>
              {meta.icon}
              {meta.label}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{formatDate(order.vendaData)}</p>
        </div>
        <p className="text-lg font-semibold">{formatCurrency(order.vendaTotal)}</p>
      </div>

      <div className="mt-5">
        <Progress value={progress} className="h-2 bg-muted" />
        <div className="mt-3 grid grid-cols-4 gap-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {trackedSteps.map((step) => (
            <span key={step} className={step === status ? "text-foreground" : ""}>
              {statusMeta[step].label}
            </span>
          ))}
        </div>
      </div>

<<<<<<< Updated upstream
      {(order.transportadora || order.urlRastreio) && (
        <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          {order.transportadora && <Info label="Transportadora" value={order.transportadora} />}
          {order.urlRastreio && (
            <Button asChild variant="outline">
              <a href={order.urlRastreio} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Rastrear encomenda
              </a>
            </Button>
          )}
        </div>
      )}
=======
      {linhas.length > 0 && (
        <div className="mt-5 border-t pt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Produtos</p>
          <ul className="grid gap-1.5 text-sm">
            {linhas.map((linha, i) => (
              <li key={i} className="flex items-center justify-between gap-3">
                <span className="truncate text-muted-foreground">
                  {produtoMap[linha.produtoId]?.nome || `Produto ${linha.produtoId.slice(0, 8)}`}
                  <span className="text-foreground"> × {linha.quantidade}</span>
                </span>
                <span className="font-medium">{formatCurrency(linha.precoUnitario * linha.quantidade)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 grid gap-3 border-t pt-4 text-sm sm:grid-cols-2">
        <Info label="Origem" value="Estado confirmado pela loja" />
        <Info label="Tracking externo" value={status === "enviada" || status === "entregue" ? "Sem codigo de transportadora configurado" : "Ainda nao aplicavel"} />
      </div>
>>>>>>> Stashed changes
    </article>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  )
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-PT", {
    currency: "EUR",
    style: "currency",
  }).format(value)
}
