"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  Boxes,
  FolderTree,
  Image,
  Loader2,
  Package,
  Palette,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  ShoppingCart,
  SlidersHorizontal,
  Store,
  Trash2,
  Truck,
  Users,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProtectedRoute } from "@/components/protected-route"
import { API_BASE_URL, resolveImageUrl } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

type ResourceKey =
  | "dashboard"
  | "produtos"
  | "gruposVariantes"
  | "categorias"
  | "colecoes"
  | "vendas"
  | "vendaProdutos"
  | "clientes"
  | "users"
  | "fotoProdutos"
  | "fotoColecoes"
  | "carrinhos"
  | "itensCarrinho"

type FieldType = "text" | "number" | "textarea" | "select" | "datetime-local" | "password" | "file" | "variants"

interface FieldConfig {
  accept?: string
  createOnly?: boolean
  key: string
  label: string
  multiple?: boolean
  options?: () => { label: string; value: string }[]
  required?: boolean
  type?: FieldType
}

interface ResourceConfig {
  columns: { key: string; label: string; render?: (item: any) => React.ReactNode }[]
  createPayload?: (form: Record<string, string>) => BodyInit | object
  createEndpoint?: string
  endpoint: string
  fields: FieldConfig[]
  formData?: boolean
  icon: React.ReactNode
  key: ResourceKey
  title: string
  toForm: (item: any) => Record<string, string>
  updateEndpoint?: (item: any) => string
  updatePayload?: (form: Record<string, string>, item: any) => BodyInit | object
  canCreate?: boolean
}

const emptyData: Record<string, any[]> = {
  carrinhos: [],
  categorias: [],
  clientes: [],
  colecoes: [],
  fotoColecoes: [],
  fotoProdutos: [],
  itensCarrinho: [],
  produtos: [],
  gruposVariantes: [],
  users: [],
  vendaProdutos: [],
  vendas: [],
}

export default function BackofficePage() {
  const { usuario } = useAuth()
  const isSuperadmin = usuario?.role?.toLowerCase() === "superadmin"
  const [active, setActive] = useState<ResourceKey>("dashboard")
  const [data, setData] = useState<Record<string, any[]>>(emptyData)
  const [editing, setEditing] = useState<any | null>(null)
  const [form, setForm] = useState<Record<string, string>>({})
  const [files, setFiles] = useState<Record<string, File[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const categoryOptions = () =>
    data.categorias.map((categoria) => ({
      label: categoria.nome,
      value: categoria.id,
    }))

  const clientOptions = () =>
    data.clientes.map((cliente) => ({
      label: `${cliente.nome} (${cliente.email})`,
      value: cliente.id,
    }))

  const productOptions = () =>
    data.produtos.map((produto) => ({
      label: produto.nome,
      value: produto.id,
    }))

  const variantGroupOptions = () => [
    { label: "Sem escolhas", value: "" },
    ...data.gruposVariantes.map((grupo) => ({ label: grupo.nome, value: grupo.id })),
  ]

  const orderOptions = () =>
    data.vendas.map((venda) => ({
      label: `${formatDate(venda.vendaData)} - ${formatCurrency(venda.vendaTotal)}`,
      value: venda.id,
    }))

  const resources = useMemo<ResourceConfig[]>(
    () => [
      {
        key: "produtos",
        title: "Produtos",
        endpoint: "/produtos",
        icon: <Package className="h-4 w-4" />,
        formData: true,
        fields: [
          { key: "nome", label: "Nome", required: true },
          { key: "descricao", label: "Descrição", required: true, type: "textarea" },
          { key: "preco", label: "Preço", required: true, type: "number" },
          { key: "stock", label: "Stock", required: true, type: "number" },
          { key: "categoriaId", label: "Categoria", options: categoryOptions, required: true, type: "select" },
          { key: "grupoVariantesId", label: "Características disponíveis", options: variantGroupOptions, type: "select" },
          { key: "fotos", label: "Imagens", accept: "image/*", createOnly: true, multiple: true, type: "file" },
        ],
        columns: [
          { key: "fotos", label: "Imagem", render: (item) => <ImagePreview url={normalizeUrl(item.fotos?.[0]?.urlProduto)} /> },
          { key: "nome", label: "Produto" },
          { key: "preco", label: "Preço", render: (item) => formatCurrency(item.preco) },
          { key: "stock", label: "Stock" },
          { key: "categoria", label: "Categoria", render: (item) => item.categoria?.nome || "-" },
          { key: "grupoVariantes", label: "Variantes", render: (item) => item.grupoVariantes?.nome || "-" },
        ],
        toForm: (item) => ({
          categoriaId: item.categoria?.id || "",
          descricao: item.descricao || "",
          nome: item.nome || "",
          preco: String(item.preco ?? ""),
          stock: String(item.stock ?? ""),
          grupoVariantesId: item.grupoVariantesId || "",
        }),
        createPayload: (form) => toFormData({
          CategoriaId: form.categoriaId,
          Descricao: form.descricao,
          Fotos: files.fotos || [],
          Nome: form.nome,
          Preco: form.preco,
          Stock: form.stock,
          GrupoVariantesId: form.grupoVariantesId,
        }),
        updatePayload: (form, item) => ({
          id: item.id,
          categoria: findById(data.categorias, form.categoriaId),
          descricao: form.descricao,
          fotos: item.fotos || [],
          nome: form.nome,
          preco: Number(form.preco),
          stock: Number(form.stock),
          grupoVariantesId: form.grupoVariantesId || null,
        }),
      },
      {
        key: "gruposVariantes",
        title: "Características dos produtos",
        endpoint: "/gruposVariantes",
        icon: <SlidersHorizontal className="h-4 w-4" />,
        fields: [
          { key: "nome", label: "Nome do grupo", required: true },
          { key: "configuracaoVariantes", label: "Escolhas do cliente", type: "variants" },
        ],
        columns: [
          { key: "nome", label: "Grupo" },
          { key: "opcoes", label: "Características", render: (item) => item.opcoes?.length || 0 },
          { key: "variantes", label: "Combinações", render: (item) => item.variantes?.length || 0 },
        ],
        toForm: (item) => ({
          nome: item.nome || "",
          configuracaoVariantes: JSON.stringify({ opcoes: item.opcoes || [], variantes: item.variantes || [] }),
        }),
        createPayload: (form) => ({ nome: form.nome, ...parseVariantConfiguration(form.configuracaoVariantes) }),
        updatePayload: (form, item) => ({ id: item.id, nome: form.nome, ...parseVariantConfiguration(form.configuracaoVariantes) }),
      },
      {
        key: "categorias",
        title: "Categorias",
        endpoint: "/categorias",
        icon: <FolderTree className="h-4 w-4" />,
        fields: [{ key: "nome", label: "Nome", required: true }],
        columns: [{ key: "nome", label: "Categoria" }],
        toForm: (item) => ({ nome: item.nome || "" }),
        createPayload: (form) => ({ nome: form.nome }),
        updatePayload: (form, item) => ({ id: item.id, nome: form.nome }),
      },
      {
        key: "colecoes",
        title: "Coleções",
        endpoint: "/colecoes",
        icon: <Boxes className="h-4 w-4" />,
        formData: true,
        fields: [
          { key: "nomeColecao", label: "Nome", required: true },
          { key: "descricaoColecao", label: "Descrição", required: true, type: "textarea" },
          {
            key: "estadoColecao",
            label: "Estado",
            options: () => [
              { label: "Ativa", value: "ativa" },
              { label: "Inativa", value: "inativa" },
            ],
            required: true,
            type: "select",
          },
          { key: "fotos", label: "Imagens", accept: "image/*", createOnly: true, multiple: true, type: "file" },
        ],
        columns: [
          { key: "nomeColecao", label: "Coleção" },
          { key: "fotos", label: "Imagem", render: (item) => <ImagePreview url={normalizeUrl(item.fotos?.[0]?.urlColecao)} /> },
          { key: "estadoColecao", label: "Estado", render: (item) => <StatusBadge value={item.estadoColecao} /> },
          { key: "produto", label: "Produtos", render: (item) => item.produto?.length || 0 },
        ],
        toForm: (item) => ({
          descricaoColecao: item.descricaoColecao || "",
          estadoColecao: item.estadoColecao || "ativa",
          nomeColecao: item.nomeColecao || "",
        }),
        createPayload: (form) => toFormData({
          DataAtualizacao: new Date().toISOString(),
          DataCriacao: new Date().toISOString(),
          DescricaoColecao: form.descricaoColecao,
          EstadoColecao: form.estadoColecao,
          Fotos: files.fotos || [],
          NomeColecao: form.nomeColecao,
        }),
        updatePayload: (form, item) => ({
          ...item,
          descricaoColecao: form.descricaoColecao,
          estadoColecao: form.estadoColecao,
          nomeColecao: form.nomeColecao,
        }),
      },
      {
        key: "vendas",
        title: "Encomendas",
        endpoint: "/vendas",
        icon: <Truck className="h-4 w-4" />,
        fields: [
          { key: "clienteId", label: "Cliente", options: clientOptions, required: true, type: "select" },
          { key: "vendaData", label: "Data", required: true, type: "datetime-local" },
          {
            key: "vendaEstado",
            label: "Estado",
            options: () => [
              { label: "Pendente", value: "pendente" },
              { label: "Paga", value: "paga" },
              { label: "Enviada", value: "enviada" },
              { label: "Entregue", value: "entregue" },
              { label: "Cancelada", value: "cancelada" },
            ],
            required: true,
            type: "select",
          },
          { key: "vendaTotal", label: "Total", required: true, type: "number" },
          { key: "transportadora", label: "Transportadora" },
          { key: "codigoRastreio", label: "Código de rastreio" },
          { key: "urlRastreio", label: "Link da transportadora" },
          { key: "dataEnvio", label: "Data de envio", type: "datetime-local" },
          { key: "notasInternas", label: "Notas internas", type: "textarea" },
        ],
        columns: [
          { key: "cliente", label: "Cliente", render: (item) => item.cliente?.nome || "-" },
          { key: "vendaEstado", label: "Estado", render: (item) => <StatusBadge value={item.vendaEstado} /> },
          { key: "pagamentoEstado", label: "Pagamento", render: (item) => <StatusBadge value={item.pagamentoEstado || "não iniciado"} /> },
          { key: "vendaTotal", label: "Total", render: (item) => formatCurrency(item.vendaTotal) },
          { key: "transportadora", label: "Transportadora", render: (item) => item.transportadora || "-" },
        ],
        toForm: (item) => ({
          clienteId: item.cliente?.id || "",
          codigoRastreio: item.codigoRastreio || "",
          dataEnvio: toDateInput(item.dataEnvio),
          notasInternas: item.notasInternas || "",
          transportadora: item.transportadora || "",
          urlRastreio: item.urlRastreio || "",
          vendaData: toDateInput(item.vendaData),
          vendaEstado: item.vendaEstado || "pendente",
          vendaTotal: String(item.vendaTotal ?? ""),
        }),
        createPayload: (form) => ({
          clienteId: form.clienteId,
          codigoRastreio: form.codigoRastreio || null,
          data: fromDateInput(form.vendaData),
          dataEnvio: form.dataEnvio ? fromDateInput(form.dataEnvio) : null,
          estado: form.vendaEstado,
          notasInternas: form.notasInternas || null,
          transportadora: form.transportadora || null,
          total: Number(form.vendaTotal),
          urlRastreio: form.urlRastreio || null,
        }),
        updatePayload: (form, item) => ({
          ...item,
          cliente: findById(data.clientes, form.clienteId),
          codigoRastreio: form.codigoRastreio || null,
          dataEnvio: form.dataEnvio ? fromDateInput(form.dataEnvio) : null,
          notasInternas: form.notasInternas || null,
          transportadora: form.transportadora || null,
          urlRastreio: form.urlRastreio || null,
          vendaData: fromDateInput(form.vendaData),
          vendaEstado: form.vendaEstado,
          vendaTotal: Number(form.vendaTotal),
        }),
      },
      {
        key: "vendaProdutos",
        title: "Linhas de encomenda",
        endpoint: "/vendaProdutos",
        icon: <ShoppingCart className="h-4 w-4" />,
        fields: [
          { key: "vendaId", label: "Encomenda", options: orderOptions, required: true, type: "select" },
          { key: "produtoId", label: "Produto", options: productOptions, required: true, type: "select" },
          { key: "quantidade", label: "Quantidade", required: true, type: "number" },
          { key: "precoUnitario", label: "Preço unitário", required: true, type: "number" },
        ],
        columns: [
          { key: "vendaId", label: "Encomenda", render: (item) => orderOptions().find((order) => order.value === item.vendaId)?.label || "Encomenda" },
          { key: "produtoId", label: "Produto", render: (item) => findById(data.produtos, item.produtoId)?.nome || "Produto removido" },
          { key: "quantidade", label: "Qtd." },
          { key: "precoUnitario", label: "Preço", render: (item) => formatCurrency(Number(item.precoUnitario)) },
        ],
        toForm: (item) => ({
          precoUnitario: String(item.precoUnitario ?? ""),
          produtoId: item.produtoId || "",
          quantidade: String(item.quantidade ?? ""),
          vendaId: item.vendaId || "",
        }),
        createPayload: (form) => ({
          precoUnitario: Number(form.precoUnitario),
          produtoId: form.produtoId,
          quantidade: Number(form.quantidade),
          vendaId: form.vendaId,
        }),
        updatePayload: (form, item) => ({
          id: item.id,
          precoUnitario: Number(form.precoUnitario),
          produtoId: form.produtoId,
          quantidade: Number(form.quantidade),
          vendaId: form.vendaId,
        }),
      },
      {
        key: "clientes",
        title: "Clientes",
        endpoint: "/clientes",
        icon: <Users className="h-4 w-4" />,
        fields: [
          { key: "nome", label: "Nome", required: true },
          { key: "email", label: "Email", required: true },
          { key: "morada", label: "Morada", required: true },
        ],
        columns: [
          { key: "nome", label: "Cliente" },
          { key: "email", label: "Email" },
          { key: "morada", label: "Morada" },
        ],
        toForm: (item) => ({ email: item.email || "", morada: item.morada || "", nome: item.nome || "" }),
        createPayload: (form) => ({ email: form.email, morada: form.morada, nome: form.nome }),
        updatePayload: (form, item) => ({ id: item.id, email: form.email, morada: form.morada, nome: form.nome }),
      },
      {
        key: "users",
        title: "Utilizadores",
        endpoint: "/users",
        createEndpoint: "/users/admin",
        icon: <Users className="h-4 w-4" />,
        fields: [
          { key: "userName", label: "Username", required: true },
          { key: "userPassword", label: "Password", createOnly: true, required: true, type: "password" },
          { key: "clienteId", label: "Cliente", options: clientOptions, required: true, type: "select" },
          {
            key: "role",
            label: "Permissao",
            options: () => [
              { label: "Cliente", value: "cliente" },
              { label: "Backoffice", value: "admin" },
              { label: "Superadministrador", value: "superadmin" },
            ],
            required: true,
            type: "select",
          },
        ],
        columns: [
          { key: "userName", label: "Username" },
          { key: "role", label: "Permissao", render: (item) => <StatusBadge value={item.role || "cliente"} /> },
          { key: "clienteDto", label: "Cliente", render: (item) => item.clienteDto?.nome || "-" },
          { key: "email", label: "Email", render: (item) => item.clienteDto?.email || "-" },
        ],
        toForm: (item) => ({
          clienteId: item.clienteDto?.id || "",
          role: item.role || "cliente",
          userName: item.userName || "",
          userPassword: "",
        }),
        updateEndpoint: (item) => `/users/${item.id}`,
        createPayload: (form) => ({
          clienteId: form.clienteId,
          role: form.role || "cliente",
          userName: form.userName,
          userPassword: form.userPassword,
        }),
        updatePayload: (form, item) => ({
          id: item.id,
          clienteDto: findById(data.clientes, form.clienteId),
          role: form.role || "cliente",
          userName: form.userName,
        }),
      },
      {
        key: "fotoProdutos",
        title: "Fotos de produto",
        endpoint: "/fotoProdutos",
        icon: <Image className="h-4 w-4" />,
        formData: true,
        fields: [
          { key: "produtoId", label: "Produto", options: productOptions, required: true, type: "select" },
          { key: "foto", label: "Imagem", accept: "image/*", required: true, type: "file" },
        ],
        columns: [
          { key: "produtoId", label: "Produto", render: (item) => findById(data.produtos, item.produtoId)?.nome || "Produto removido" },
          { key: "urlProduto", label: "Imagem", render: (item) => <ImagePreview url={normalizeUrl(item.urlProduto)} /> },
        ],
        toForm: (item) => ({ foto: "", produtoId: item.produtoId || "" }),
        createPayload: (form) => toFormData({
          Foto: files.foto || [],
          ProdutoId: form.produtoId,
        }),
        updateEndpoint: (item) => `/fotoProdutos/${item.id}/upload`,
        updatePayload: (form) => toFormData({
          Foto: files.foto || [],
          ProdutoId: form.produtoId,
        }),
      },
      {
        key: "fotoColecoes",
        title: "Fotos de coleção",
        endpoint: "/fotoColecoes",
        icon: <Image className="h-4 w-4" />,
        formData: true,
        fields: [
          { key: "colecaoId", label: "Coleção", options: () => data.colecoes.map((c) => ({ label: c.nomeColecao, value: c.id })), required: true, type: "select" },
          { key: "foto", label: "Imagem", accept: "image/*", required: true, type: "file" },
        ],
        columns: [
          { key: "colecaoId", label: "Coleção", render: (item) => findById(data.colecoes, item.colecaoId)?.nomeColecao || "Coleção removida" },
          { key: "urlColecao", label: "Imagem", render: (item) => <ImagePreview url={normalizeUrl(item.urlColecao)} /> },
        ],
        toForm: (item) => ({ colecaoId: item.colecaoId || "", foto: "" }),
        createPayload: (form) => toFormData({
          ColecaoId: form.colecaoId,
          Foto: files.foto || [],
        }),
        updateEndpoint: (item) => `/fotoColecoes/${item.id}/upload`,
        updatePayload: (form) => toFormData({
          ColecaoId: form.colecaoId,
          Foto: files.foto || [],
        }),
      },
      {
        key: "carrinhos",
        title: "Carrinhos",
        endpoint: "/carrinhos",
        icon: <ShoppingCart className="h-4 w-4" />,
        fields: [{ key: "clienteId", label: "Cliente", options: clientOptions, required: true, type: "select" }],
        columns: [
          { key: "cliente", label: "Cliente", render: (item) => item.cliente?.nome || findById(data.clientes, item.clienteId)?.nome || "-" },
          { key: "itens", label: "Itens", render: (item) => item.itens?.length || 0 },
        ],
        toForm: (item) => ({ clienteId: item.cliente?.id || item.clienteId || "" }),
        createPayload: (form) => ({ clienteId: form.clienteId }),
        updatePayload: (form, item) => ({ ...item, clienteId: form.clienteId }),
      },
      {
        key: "itensCarrinho",
        title: "Itens de carrinho",
        endpoint: "/itensCarrinho",
        icon: <ShoppingCart className="h-4 w-4" />,
        fields: [
          { key: "carrinhoId", label: "Carrinho", options: () => data.carrinhos.map((c) => ({ label: c.cliente?.nome || findById(data.clientes, c.clienteId)?.nome || "Carrinho sem cliente", value: c.id })), required: true, type: "select" },
          { key: "produtoId", label: "Produto", options: productOptions, required: true, type: "select" },
          { key: "quantidade", label: "Quantidade", required: true, type: "number" },
        ],
        columns: [
          { key: "carrinhoId", label: "Carrinho", render: (item) => {
            const carrinho = findById(data.carrinhos, item.carrinhoId)
            return carrinho?.cliente?.nome || findById(data.clientes, carrinho?.clienteId)?.nome || "Carrinho"
          } },
          { key: "produto", label: "Produto", render: (item) => item.produto?.nome || findById(data.produtos, item.produtoId)?.nome || "-" },
          { key: "quantidade", label: "Qtd." },
        ],
        toForm: (item) => ({
          carrinhoId: item.carrinhoId || "",
          produtoId: item.produto?.id || item.produtoId || "",
          quantidade: String(item.quantidade ?? ""),
        }),
        createPayload: (form) => ({ carrinhoId: form.carrinhoId, produtoId: form.produtoId, quantidade: Number(form.quantidade) }),
        updatePayload: (form, item) => ({ ...item, carrinhoId: form.carrinhoId, produtoId: form.produtoId, quantidade: Number(form.quantidade) }),
      },
    ],
    [data, files],
  )

  const visibleResources = resources.filter((resource) => resource.key !== "users" || isSuperadmin)

  const activeConfig = resources.find((resource) => resource.key === active)

  const loadAll = async () => {
    setIsLoading(true)
    setError("")

    try {
      const entries = await Promise.all(
        Object.keys(emptyData).map(async (key) => {
          const endpoint = resources.find((resource) => resource.key === key)?.endpoint || `/${key}`
          const value = await api(endpoint).catch(() => [])
          return [key, Array.isArray(value) ? value : []]
        }),
      )

      setData(Object.fromEntries(entries))
    } catch (err: any) {
      setError(err.message || "Não foi possível carregar o backoffice.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const dashboard = useMemo(() => {
    const totalVendas = data.vendas.reduce((total, venda) => total + Number(venda.vendaTotal || 0), 0)
    const vendasPorEstado = data.vendas.reduce<Record<string, number>>((acc, venda) => {
      const status = venda.vendaEstado || "pendente"
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    return { totalVendas, vendasPorEstado }
  }, [data.vendas])

  const openCreate = (resource: ResourceConfig) => {
    setEditing(null)
    setForm(Object.fromEntries(resource.fields.map((field) => [field.key, defaultFieldValue(field)])))
    setFiles({})
    setActive(resource.key)
  }

  const openEdit = (resource: ResourceConfig, item: any) => {
    setEditing(item)
    setForm(resource.toForm(item))
    setFiles({})
    setActive(resource.key)
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!activeConfig) return

    setIsSaving(true)
    setError("")

    try {
      const payload = editing
        ? activeConfig.updatePayload?.(form, editing) || { ...editing, ...form }
        : activeConfig.createPayload?.(form) || form
      const isFormData = payload instanceof FormData
      const endpoint = editing && activeConfig.updateEndpoint
        ? activeConfig.updateEndpoint(editing)
        : editing
          ? `${activeConfig.endpoint}/${editing.id}`
          : activeConfig.createEndpoint || activeConfig.endpoint

      await api(endpoint, {
        body: isFormData ? payload as BodyInit : JSON.stringify(payload),
        formData: isFormData,
        method: editing ? "PUT" : "POST",
      })

      setEditing(null)
      setForm({})
      setFiles({})
      await loadAll()
    } catch (err: any) {
      setError(err.message || "Não foi possível gravar.")
    } finally {
      setIsSaving(false)
    }
  }

  const remove = async (resource: ResourceConfig, item: any) => {
    if (!confirm("Apagar este registo?")) return

    setError("")

    try {
      await api(`${resource.endpoint}/${item.id}`, { method: "DELETE" })
      await loadAll()
    } catch (err: any) {
      setError(err.message || "Não foi possível apagar.")
    }
  }

  return (
    <ProtectedRoute requiredRole={["admin", "superadmin"]}>
      <main className="min-h-screen bg-background">
        <div className="border-b bg-background">
          <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4">
            <div>
              <h1 className="text-lg font-semibold">Backoffice</h1>
              <p className="text-xs text-muted-foreground">Gestão operacional da loja</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/">
                  <Store className="mr-2 h-4 w-4" />
                  Ver loja
                </Link>
              </Button>
              <Button variant="outline" onClick={loadAll} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Atualizar
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-[1600px] gap-5 px-4 py-5 lg:grid-cols-[240px_1fr]">
          <aside className="h-fit rounded-md border bg-card">
            <nav className="grid p-2">
              <NavButton active={active === "dashboard"} icon={<BarChart3 className="h-4 w-4" />} label="Dashboard" onClick={() => setActive("dashboard")} />
              {visibleResources.map((resource) => (
                <NavButton
                  key={resource.key}
                  active={active === resource.key}
                  icon={resource.icon}
                  label={resource.title}
                  onClick={() => {
                    setActive(resource.key)
                    setEditing(null)
                    setForm({})
                    setFiles({})
                  }}
                />
              ))}
            </nav>
          </aside>

          <section className="min-w-0">
            {error && <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

            {active === "dashboard" ? (
              <Dashboard data={data} dashboard={dashboard} />
            ) : activeConfig ? (
              <ResourcePanel
                config={activeConfig}
                editing={editing}
                files={files}
                form={form}
                isLoading={isLoading}
                isSaving={isSaving}
                items={data[activeConfig.key] || []}
                onCancel={() => {
                  setEditing(null)
                  setForm({})
                  setFiles({})
                }}
                onChange={(key, value) => setForm((current) => ({ ...current, [key]: value }))}
                onFilesChange={(key, value) => setFiles((current) => ({ ...current, [key]: value }))}
                onCreate={() => openCreate(activeConfig)}
                onEdit={(item) => openEdit(activeConfig, item)}
                onRemove={(item) => remove(activeConfig, item)}
                onSubmit={submit}
              />
            ) : null}
          </section>
        </div>
      </main>
    </ProtectedRoute>
  )
}

function ResourcePanel({
  config,
  editing,
  files,
  form,
  isLoading,
  isSaving,
  items,
  onCancel,
  onChange,
  onFilesChange,
  onCreate,
  onEdit,
  onRemove,
  onSubmit,
}: {
  config: ResourceConfig
  editing: any | null
  files: Record<string, File[]>
  form: Record<string, string>
  isLoading: boolean
  isSaving: boolean
  items: any[]
  onCancel: () => void
  onChange: (key: string, value: string) => void
  onFilesChange: (key: string, value: File[]) => void
  onCreate: () => void
  onEdit: (item: any) => void
  onRemove: (item: any) => void
  onSubmit: (event: React.FormEvent) => void
}) {
  const canCreate = config.canCreate !== false
  const visibleFields = config.fields.filter((field) => !field.createOnly || !editing)

  return (
    <div className="grid gap-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold">{config.title}</h2>
          <p className="text-sm text-muted-foreground">{items.length} registos</p>
        </div>
        {canCreate && (
          <Button onClick={onCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Novo
          </Button>
        )}
      </div>

      {(editing || Object.keys(form).length > 0) && (
        <form onSubmit={onSubmit} className="rounded-md border bg-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">{editing ? "Editar" : "Criar"}</h3>
            <Button aria-label="Fechar formulário" title="Fechar formulário" type="button" variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {visibleFields.map((field) => (
              <Field
                key={field.key}
                field={field}
                files={files[field.key] || []}
                value={form[field.key] || ""}
                onChange={(value) => onChange(field.key, value)}
                onFilesChange={(value) => onFilesChange(field.key, value)}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Guardar
            </Button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-md border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                {config.columns.map((column) => (
                  <th key={column.key} className="px-3 py-2 text-left font-medium">
                    {column.label}
                  </th>
                ))}
                <th className="w-28 px-3 py-2 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="px-3 py-10 text-center text-muted-foreground" colSpan={config.columns.length + 1}>
                    A carregar...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="px-3 py-10 text-center text-muted-foreground" colSpan={config.columns.length + 1}>
                    Sem registos
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    {config.columns.map((column) => (
                      <td key={column.key} className="max-w-[280px] truncate px-3 py-2">
                        {column.render ? column.render(item) : String(item[column.key] ?? "-")}
                      </td>
                    ))}
                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-1">
                        <Button aria-label="Editar" title="Editar" variant="ghost" size="icon" onClick={() => onEdit(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button aria-label="Eliminar" title="Eliminar" variant="ghost" size="icon" className="text-destructive" onClick={() => onRemove(item)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Dashboard({ data, dashboard }: { data: Record<string, any[]>; dashboard: { totalVendas: number; vendasPorEstado: Record<string, number> } }) {
  const recentOrders = [...data.vendas]
    .sort((a, b) => new Date(b.vendaData).getTime() - new Date(a.vendaData).getTime())
    .slice(0, 8)

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Vendas, catálogo e atividade operacional</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Vendas" value={formatCurrency(dashboard.totalVendas)} />
        <Metric label="Encomendas" value={String(data.vendas.length)} />
        <Metric label="Produtos" value={String(data.produtos.length)} />
        <Metric label="Clientes" value={String(data.clientes.length)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <div className="rounded-md border bg-card p-4">
          <h3 className="mb-3 font-semibold">Estados de encomenda</h3>
          <div className="grid gap-2">
            {["pendente", "paga", "enviada", "entregue", "cancelada"].map((status) => (
              <div key={status} className="flex items-center justify-between rounded-md bg-muted/45 px-3 py-2">
                <StatusBadge value={status} />
                <span className="font-semibold">{dashboard.vendasPorEstado[status] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border bg-card p-4">
          <h3 className="mb-3 font-semibold">Encomendas recentes</h3>
          <div className="grid gap-2">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem encomendas</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-md bg-muted/45 px-3 py-2 text-sm">
                  <span className="truncate">{order.cliente?.nome || "Cliente"}</span>
                  <StatusBadge value={order.vendaEstado} />
                  <span className="font-semibold">{formatCurrency(order.vendaTotal)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({
  field,
  files,
  onChange,
  onFilesChange,
  value,
}: {
  field: FieldConfig
  files: File[]
  onChange: (value: string) => void
  onFilesChange: (value: File[]) => void
  value: string
}) {
  const isWide = field.type === "textarea" || field.type === "file" || field.type === "variants"

  if (field.type === "variants") {
    return (
      <div className="grid gap-1 md:col-span-2 xl:col-span-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{field.label}</span>
        <VariantConfigurator value={value} onChange={onChange} />
      </div>
    )
  }

  return (
    <label className={isWide ? "grid gap-1 md:col-span-2 xl:col-span-3" : "grid gap-1"}>
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{field.label}</span>
      {field.type === "textarea" ? (
        <textarea
          className="min-h-24 rounded-md border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-ring"
          required={field.required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : field.type === "select" ? (
        <select
          className="h-10 rounded-md border bg-background px-3 text-sm outline-none transition-colors focus:border-ring"
          required={field.required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Selecionar</option>
          {field.options?.().map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : field.type === "file" ? (
        <div className="grid gap-2">
          <Input
            accept={field.accept}
            multiple={field.multiple}
            required={field.required && files.length === 0}
            type="file"
            onChange={(event) => onFilesChange(Array.from(event.target.files || []))}
          />
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {files.map((file) => (
                <Badge key={`${file.name}-${file.size}`} variant="secondary">
                  {file.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Input
          required={field.required}
          step={field.type === "number" ? "0.01" : undefined}
          type={field.type || "text"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  )
}

function VariantConfigurator({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const config = parseVariantConfiguration(value)
  const commit = (next: { opcoes: any[]; variantes: any[] }) => onChange(JSON.stringify(next))

  const updateOptionName = (index: number, nome: string) => commit({
    opcoes: config.opcoes.map((option: any, optionIndex: number) => optionIndex === index ? { ...option, nome } : option),
    variantes: [],
  })

  const updateValue = (optionIndex: number, valueIndex: number, changes: Record<string, unknown>) => commit({
    opcoes: config.opcoes.map((option: any, currentOption: number) => currentOption === optionIndex
      ? { ...option, valores: option.valores.map((item: any, currentValue: number) => currentValue === valueIndex ? { ...item, ...changes } : item) }
      : option),
    variantes: [],
  })

  const addValue = (optionIndex: number) => commit({
    opcoes: config.opcoes.map((option: any, current: number) => current === optionIndex
      ? { ...option, valores: [...option.valores, { valor: "", corHex: null }] }
      : option),
    variantes: [],
  })

  const removeValue = (optionIndex: number, valueIndex: number) => commit({
    opcoes: config.opcoes.map((option: any, current: number) => current === optionIndex
      ? { ...option, valores: option.valores.filter((_: any, index: number) => index !== valueIndex) }
      : option),
    variantes: [],
  })

  const generateVariants = () => {
    const validOptions = config.opcoes
      .map((option: any) => ({ ...option, nome: option.nome.trim(), valores: option.valores.filter((item: any) => item.valor.trim()) }))
      .filter((option: any) => option.nome && option.valores.length)
    const combinations: Record<string, string>[] = validOptions.reduce((current: Record<string, string>[], option: any) =>
      current.flatMap((combination) => option.valores.map((item: any) => ({ ...combination, [option.nome.trim()]: item.valor }))), [{}])
    const variantes = combinations.map((valores) => {
      const existing = config.variantes.find((variant: any) => JSON.stringify(variant.valores) === JSON.stringify(valores))
      return existing || { id: crypto.randomUUID(), sku: "", valores, preco: null, stock: 0, ativa: true }
    })
    commit({ opcoes: validOptions, variantes })
  }

  const updateVariant = (index: number, key: string, raw: string | boolean) => {
    const variantes = config.variantes.map((variant: any, variantIndex: number) => variantIndex === index
      ? { ...variant, [key]: key === "stock" ? Number(raw) : key === "preco" ? (raw === "" ? null : Number(raw)) : raw }
      : variant)
    commit({ opcoes: config.opcoes, variantes })
  }

  return (
    <div className="grid gap-5 rounded-md border bg-background p-4 normal-case tracking-normal">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Características do produto</p>
          <p className="text-xs text-muted-foreground">Cor, tamanho, modelo ou outra escolha disponível para o cliente.</p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={() => commit({ opcoes: [...config.opcoes, { nome: "", valores: [{ valor: "", corHex: null }] }], variantes: [] })}>
          <Plus className="mr-2 h-4 w-4" /> Nova característica
        </Button>
      </div>

      {config.opcoes.length === 0 && (
        <div className="border-y border-dashed py-8 text-center text-sm text-muted-foreground">Este conjunto ainda não tem características.</div>
      )}

      <div className="divide-y">
        {config.opcoes.map((option: any, optionIndex: number) => (
          <section key={optionIndex} className="grid gap-3 py-4 first:pt-0 last:pb-0">
            <div className="flex items-center gap-2">
              <Input className="max-w-sm font-medium" placeholder="Ex.: Cor" value={option.nome} onChange={(event) => updateOptionName(optionIndex, event.target.value)} />
              <Button aria-label="Eliminar característica" title="Eliminar característica" type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => commit({ opcoes: config.opcoes.filter((_: any, index: number) => index !== optionIndex), variantes: [] })}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-2 pl-0 sm:pl-4">
              <span className="text-xs font-medium text-muted-foreground">Escolhas disponíveis</span>
              {option.valores.map((item: any, valueIndex: number) => (
                <div key={valueIndex} className="flex flex-wrap items-center gap-2">
                  <Input className="min-w-44 flex-1" placeholder="Ex.: Rosa" value={item.valor} onChange={(event) => updateValue(optionIndex, valueIndex, { valor: event.target.value })} />
                  {item.corHex && (
                    <label className="flex h-10 w-12 cursor-pointer items-center justify-center rounded-md border bg-background" title="Escolher cor">
                      <span className="h-6 w-6 rounded-full border" style={{ backgroundColor: item.corHex }} />
                      <input className="sr-only" type="color" value={item.corHex} onChange={(event) => updateValue(optionIndex, valueIndex, { corHex: event.target.value })} />
                    </label>
                  )}
                  <Button aria-label={item.corHex ? "Remover cor" : "Associar uma cor"} title={item.corHex ? "Remover cor" : "Associar uma cor"} type="button" variant="ghost" size="icon" onClick={() => updateValue(optionIndex, valueIndex, { corHex: item.corHex ? null : "#c46782" })}>
                    <Palette className="h-4 w-4" />
                  </Button>
                  <Button aria-label="Eliminar escolha" title="Eliminar escolha" type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeValue(optionIndex, valueIndex)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button className="w-fit" type="button" size="sm" variant="ghost" onClick={() => addValue(optionIndex)}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar escolha
              </Button>
            </div>
          </section>
        ))}
      </div>

      {config.opcoes.length > 0 && (
        <div className="flex items-center justify-between gap-3 border-t pt-4">
          <span className="text-sm font-medium">Combinações de venda</span>
          <Button type="button" size="sm" onClick={generateVariants}><RefreshCw className="mr-2 h-4 w-4" /> Criar combinações</Button>
        </div>
      )}

      {config.variantes.length > 0 && (
        <div className="grid gap-2">
          <div className="hidden grid-cols-[1.25fr_1fr_120px_100px_90px] gap-2 px-2 text-xs text-muted-foreground md:grid">
            <span>Combinação</span><span>Referência interna</span><span>Preço final</span><span>Stock</span><span>Disponível</span>
          </div>
          {config.variantes.map((variant: any, index: number) => (
            <div key={variant.id || index} className="grid items-center gap-2 border-t px-2 py-3 first:border-0 md:grid-cols-[1.25fr_1fr_120px_100px_90px]">
              <span className="text-sm font-medium">{Object.values(variant.valores).join(" / ")}</span>
              <Input placeholder="Opcional" value={variant.sku || ""} onChange={(event) => updateVariant(index, "sku", event.target.value)} />
              <Input type="number" min="0" step="0.01" placeholder="Preço base" value={variant.preco ?? ""} onChange={(event) => updateVariant(index, "preco", event.target.value)} />
              <Input type="number" min="0" step="1" value={variant.stock ?? 0} onChange={(event) => updateVariant(index, "stock", event.target.value)} />
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input className="h-5 w-5 accent-primary" type="checkbox" checked={variant.ativa !== false} onChange={(event) => updateVariant(index, "ativa", event.target.checked)} />
                {variant.ativa !== false ? "Sim" : "Não"}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function NavButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      className={`flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  )
}

function StatusBadge({ value }: { value: string }) {
  const status = value?.toLowerCase?.() || "pendente"
  const classes: Record<string, string> = {
    cancelada: "border-destructive/25 bg-destructive/10 text-destructive",
    entregue: "border-accent/25 bg-accent/10 text-accent",
    enviada: "border-sky-200 bg-sky-50 text-sky-800",
    paga: "border-emerald-200 bg-emerald-50 text-emerald-800",
    pendente: "border-amber-200 bg-amber-50 text-amber-800",
    admin: "border-indigo-200 bg-indigo-50 text-indigo-800",
    superadmin: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800",
    cliente: "border-zinc-200 bg-zinc-50 text-zinc-800",
  }

  return (
    <Badge variant="outline" className={classes[status] || ""}>
      {status}
    </Badge>
  )
}

function ImagePreview({ url }: { url: string }) {
  const src = resolveImageUrl(url)

  return (
    <div className="flex items-center">
      <div className="h-12 w-12 overflow-hidden rounded-md border bg-muted">
        {src ? (
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>
    </div>
  )
}

async function api(path: string, init?: RequestInit & { formData?: boolean }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
  const headers = new Headers(init?.headers)

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  if (!init?.formData) {
    headers.set("Content-Type", "application/json")
  }

  const { formData, ...requestInit } = init || {}

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestInit,
    headers,
  })

  if (response.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
    localStorage.removeItem("auth_provider")
    window.location.assign("/backoffice/login?expired=1")
    throw new Error("A sessão expirou. Inicie sessão novamente.")
  }

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message || error?.Message || error?.error || `Erro HTTP ${response.status}`)
  }

  if (response.status === 204) return null
  return response.json().catch(() => null)
}

function toFormData(values: Record<string, string | File[]>) {
  const formData = new FormData()
  Object.entries(values).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((file) => formData.append(key, file))
    } else if (value !== undefined && value !== null) {
      formData.append(key, value)
    }
  })
  return formData
}

function parseVariantConfiguration(value?: string) {
  if (!value) return { opcoes: [], variantes: [] }
  try {
    const parsed = JSON.parse(value)
    return { opcoes: Array.isArray(parsed.opcoes) ? parsed.opcoes : [], variantes: Array.isArray(parsed.variantes) ? parsed.variantes : [] }
  } catch {
    return { opcoes: [], variantes: [] }
  }
}

function defaultFieldValue(field: FieldConfig) {
  if (field.type === "datetime-local") return toDateInput(new Date().toISOString())
  return field.options?.()[0]?.value || ""
}

function findById(items: any[], id: string) {
  return items.find((item) => item.id === id) || null
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-PT", { currency: "EUR", style: "currency" }).format(Number(value || 0))
}

function formatDate(value: string) {
  if (!value) return "-"
  return new Intl.DateTimeFormat("pt-PT", { dateStyle: "short", timeStyle: "short" }).format(new Date(value))
}

function fromDateInput(value: string) {
  return value ? new Date(value).toISOString() : new Date().toISOString()
}

function normalizeUrl(value: any) {
  if (!value) return ""
  if (typeof value === "object") return value.url || ""
  return String(value)
}

function toDateInput(value?: string | Date | null) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}
