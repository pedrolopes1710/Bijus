import type { Categoria, Cliente, Colecao, DadosLogin, DadosRegisto, Produto, Usuario, Venda } from "./types"
import {
  MOCK_ENABLED,
  mockCategorias,
  mockColecao,
  mockColecoes,
  mockProdutos,
  mockProdutosPorCategoria,
} from "./mock-data"

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5225/api").replace(/\/$/, "")

/** Cabeçalho Authorization com o JWT guardado (para endpoints protegidos por admin). */
function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {}
  const token = window.localStorage.getItem("auth_token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function apiUrl(path: string) {
  if (!API_BASE_URL) {
    throw new Error("A API não está configurada. Defina NEXT_PUBLIC_API_URL.")
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

async function readErrorMessage(response: Response, fallback: string) {
  const data = await response.json().catch(() => null)
  return data?.message || data?.error || fallback
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
  const response = await fetch(apiUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  })

  if (!response.ok) {
    const message = await readErrorMessage(response, `Erro HTTP ${response.status}`)
    throw new Error(message)
  }

  return response.json()
}

export function resolveImageUrl(url: string | undefined | null | { url?: string }) {
  const rawUrl = typeof url === "object" && url !== null ? url.url : url

  if (!rawUrl || typeof rawUrl !== "string") return undefined
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) return rawUrl

  const apiHost = API_BASE_URL.replace(/\/api\/?$/, "")

  // Em demo (mocks) as imagens vivem em /public do frontend; com backend real são servidas pela API.
  if (rawUrl.startsWith("/uploads/")) return MOCK_ENABLED ? rawUrl : `${apiHost}${rawUrl}`

  if (rawUrl.startsWith("/")) return `${apiHost}${rawUrl}`

  return `${apiHost}/${rawUrl}`
}

export async function fetchCategorias(): Promise<Categoria[]> {
  if (MOCK_ENABLED) return mockCategorias
  try {
    return await requestJson<Categoria[]>("/categorias")
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    throw new Error("Falha ao carregar categorias. Verifique se a API está a funcionar.")
  }
}

export async function fetchProdutos(): Promise<Produto[]> {
  if (MOCK_ENABLED) return mockProdutos
  try {
    return await requestJson<Produto[]>("/produtos")
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    throw new Error("Falha ao carregar produtos. Verifique se a API está a funcionar.")
  }
}

export async function fetchProdutosPorCategoria(categoriaId: string): Promise<Produto[]> {
  if (MOCK_ENABLED) return mockProdutosPorCategoria(categoriaId)
  try {
    // O backend não filtra por query, por isso filtramos aqui para a contagem/listagem ficar correta.
    const todos = await requestJson<Produto[]>("/produtos")
    return todos.filter((produto) => produto.categoria?.id === categoriaId)
  } catch (error) {
    console.error("Erro ao buscar produtos por categoria:", error)
    throw new Error("Falha ao carregar produtos da categoria. Verifique se a API está a funcionar.")
  }
}

/**
 * Atualiza um produto (usado para decrementar stock após uma venda).
 * O PUT do backend espera o ProdutoDto completo com o mesmo Id.
 */
export async function atualizarProduto(produto: Produto): Promise<void> {
  if (MOCK_ENABLED) return
  await requestJson(`/produtos/${produto.id}`, {
    method: "PUT",
    body: JSON.stringify(produto),
  })
}

// ---------- Gestão de conteúdo (admin) ----------

export async function criarCategoria(nome: string): Promise<Categoria> {
  return requestJson<Categoria>("/categorias", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ nome }),
  })
}

export async function apagarCategoria(id: string): Promise<void> {
  const response = await fetch(apiUrl(`/categorias/${id}`), { method: "DELETE", headers: authHeaders() })
  if (!response.ok) throw new Error(await readErrorMessage(response, "Não foi possível apagar a categoria."))
}

export async function apagarProduto(id: string): Promise<void> {
  const response = await fetch(apiUrl(`/produtos/${id}`), { method: "DELETE", headers: authHeaders() })
  if (!response.ok) throw new Error(await readErrorMessage(response, "Não foi possível apagar o produto."))
}

/** Ajusta o stock de um produto (logística — admin ou super_admin). */
export async function atualizarStockProduto(id: string, stock: number): Promise<void> {
  await requestJson(`/produtos/${id}/stock`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ stock }),
  })
}

/** Lista todos os utilizadores (gestão — super_admin). */
export async function fetchUsers(): Promise<Usuario[]> {
  try {
    return await requestJson<Usuario[]>("/users")
  } catch (error) {
    console.error("Erro ao buscar utilizadores:", error)
    return []
  }
}

/** Apaga um utilizador (super_admin). */
export async function apagarUser(id: string): Promise<void> {
  const response = await fetch(apiUrl(`/users/${id}`), { method: "DELETE", headers: authHeaders() })
  if (!response.ok) throw new Error(await readErrorMessage(response, "Não foi possível apagar o utilizador."))
}

/** Apaga uma coleção (super_admin). */
export async function apagarColecao(id: string): Promise<void> {
  const response = await fetch(apiUrl(`/colecoes/${id}`), { method: "DELETE", headers: authHeaders() })
  if (!response.ok) throw new Error(await readErrorMessage(response, "Não foi possível apagar a coleção."))
}

/** Cria uma coleção (super_admin) — multipart com produtos e fotos. */
export async function criarColecao(dados: {
  nome: string
  descricao: string
  estado: string
  produtoIds: string[]
  fotos: File[]
}): Promise<Colecao> {
  const now = new Date().toISOString()
  const form = new FormData()
  form.append("NomeColecao", dados.nome)
  form.append("DescricaoColecao", dados.descricao)
  form.append("EstadoColecao", dados.estado)
  form.append("DataCriacao", now)
  form.append("DataAtualizacao", now)
  dados.produtoIds.forEach((id) => form.append("Produtos", id))
  dados.fotos.forEach((foto) => form.append("Fotos", foto))

  const response = await fetch(apiUrl("/colecoes"), { method: "POST", headers: authHeaders(), body: form })
  if (!response.ok) throw new Error(await readErrorMessage(response, "Não foi possível criar a coleção."))
  return response.json()
}

/** Muda o estado de uma encomenda (logística — admin ou super_admin). */
export async function atualizarEstadoVenda(venda: Venda, novoEstado: string): Promise<void> {
  await requestJson(`/vendas/${venda.id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ ...venda, vendaEstado: novoEstado }),
  })
}

/**
 * Cria um produto com fotos. O backend usa multipart/form-data (IFormFile[] "Fotos"),
 * por isso NÃO definimos Content-Type (o browser adiciona o boundary).
 */
export async function criarProduto(dados: {
  nome: string
  descricao: string
  preco: number
  stock: number
  categoriaId: string
  fotos: File[]
}): Promise<Produto> {
  const form = new FormData()
  form.append("Nome", dados.nome)
  form.append("Descricao", dados.descricao)
  form.append("Preco", String(dados.preco))
  form.append("Stock", String(dados.stock))
  form.append("CategoriaId", dados.categoriaId)
  dados.fotos.forEach((foto) => form.append("Fotos", foto))

  const response = await fetch(apiUrl("/produtos"), { method: "POST", headers: authHeaders(), body: form })
  if (!response.ok) throw new Error(await readErrorMessage(response, "Não foi possível criar o produto."))
  return response.json()
}

/**
 * Garante que existe um Cliente real (com GUID) para um utilizador de login social.
 * Procura por email; se não existir, cria. Devolve o GUID do cliente.
 */
export async function resolveClienteId(dados: { nome: string; email: string; morada?: string }): Promise<string | null> {
  if (MOCK_ENABLED) return null
  const email = dados.email?.trim().toLowerCase()
  if (!email) return null

  try {
    const clientes = await requestJson<Cliente[]>("/clientes").catch(() => [] as Cliente[])
    const existente = clientes.find((cliente) => cliente.email?.trim().toLowerCase() === email)
    if (existente?.id) return existente.id

    const novo = await requestJson<{ id: string }>("/clientes", {
      method: "POST",
      body: JSON.stringify({ nome: dados.nome, email: dados.email, morada: dados.morada || "" }),
    })
    return novo.id || null
  } catch (error) {
    console.error("Não foi possível resolver o cliente para login social:", error)
    return null
  }
}

export async function registarUsuario(dados: DadosRegisto): Promise<{ usuario: Usuario; token: string }> {
  try {
    const cliente = await requestJson<{ id: string }>("/clientes", {
      method: "POST",
      body: JSON.stringify({
        nome: dados.nome,
        email: dados.email,
        morada: dados.morada,
      }),
    })

    const result = await requestJson<Usuario | { usuario?: Usuario; token?: string }>("/users", {
      method: "POST",
      body: JSON.stringify({
        userName: dados.username,
        userPassword: dados.password,
        clienteId: cliente.id,
      }),
    })

    if ("usuario" in result) {
      return {
        usuario: result.usuario as Usuario,
        token: result.token || "",
      }
    }

    return {
      usuario: result as Usuario,
      token: "",
    }
  } catch (error) {
    console.error("Erro ao registar:", error)
    throw error
  }
}

export type UserRole = "super_admin" | "admin" | null

export async function loginUsuario(
  dados: DadosLogin,
): Promise<{ usuario: Usuario; token: string; isAdmin: boolean; role: UserRole }> {
  try {
    const result = await requestJson<any>("/users/login", {
      method: "POST",
      body: JSON.stringify({
        UserOrEmail: dados.username,
        userPassword: dados.password,
      }),
    })

    const tokenPayload =
      typeof result.token === "object" && result.token !== null
        ? result.token
        : typeof result.Token === "object" && result.Token !== null
          ? result.Token
          : result

    const token =
      (typeof result.token === "string" ? result.token : undefined) ||
      (typeof result.Token === "string" ? result.Token : undefined) ||
      tokenPayload.token ||
      tokenPayload.Token ||
      result.jwt ||
      result.Jwt ||
      ""

    const usuario =
      tokenPayload.user ||
      tokenPayload.User ||
      tokenPayload.usuario ||
      tokenPayload.Usuario ||
      result.usuario ||
      result.Usuario ||
      result.user ||
      result.User

    if (!usuario) {
      throw new Error("Resposta de autenticação inválida.")
    }

    const isAdmin = Boolean(result.isAdmin ?? result.IsAdmin ?? tokenPayload.isAdmin ?? tokenPayload.IsAdmin)
    const roleRaw = result.role ?? result.Role ?? tokenPayload.role ?? tokenPayload.Role ?? null
    const role: UserRole = roleRaw === "super_admin" || roleRaw === "admin" ? roleRaw : null

    return { usuario, token, isAdmin, role }
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    throw error
  }
}

export async function fetchUsuario(username: string): Promise<Usuario> {
  try {
    const users = await requestJson<Usuario[]>("/users")
    const usuario = users.find((user) => user.userName === username)

    if (!usuario) {
      throw new Error("Utilizador não encontrado")
    }

    return usuario
  } catch (error) {
    console.error("Erro ao buscar utilizador:", error)
    throw error
  }
}

export async function fetchColecoes(): Promise<Colecao[]> {
  if (MOCK_ENABLED) return mockColecoes
  try {
    return await requestJson<Colecao[]>("/colecoes")
  } catch (error) {
    console.error("Erro ao buscar coleções:", error)
    throw new Error("Falha ao carregar coleções. Verifique se a API está a funcionar.")
  }
}

export async function fetchColecao(id: string): Promise<Colecao> {
  if (MOCK_ENABLED) {
    const colecao = mockColecao(id)
    if (colecao) return colecao
  }
  try {
    return await requestJson<Colecao>(`/colecoes/${id}`)
  } catch (error) {
    console.error("Erro ao buscar coleção:", error)
    throw new Error("Falha ao carregar coleção. Verifique se a API está a funcionar.")
  }
}

export async function fetchVendas(clienteId?: string): Promise<Venda[]> {
  try {
    const query = clienteId ? `?clienteId=${encodeURIComponent(clienteId)}` : ""
    return await requestJson<Venda[]>(`/vendas${query}`)
  } catch (error) {
    console.error("Erro ao buscar encomendas:", error)
    throw new Error("Falha ao carregar encomendas. Verifique se a API está a funcionar.")
  }
}

export async function criarVenda(dados: {
  clienteId: string
  codigoRastreio?: string
  data?: string
  dataEnvio?: string
  estado?: string
  notasInternas?: string
  transportadora?: string
  total: number
  urlRastreio?: string
}): Promise<Venda> {
  return requestJson<Venda>("/vendas", {
    method: "POST",
    body: JSON.stringify({
      clienteId: dados.clienteId,
      codigoRastreio: dados.codigoRastreio,
      data: dados.data || new Date().toISOString(),
      dataEnvio: dados.dataEnvio,
      estado: dados.estado || "pendente",
      notasInternas: dados.notasInternas,
      transportadora: dados.transportadora,
      total: dados.total,
      urlRastreio: dados.urlRastreio,
    }),
  })
}

export interface VendaProdutoLinha {
  id: string
  vendaId: string
  produtoId: string
  quantidade: number
  precoUnitario: number
}

export async function fetchVendaProdutos(vendaId: string): Promise<VendaProdutoLinha[]> {
  try {
    return await requestJson<VendaProdutoLinha[]>(`/vendaProdutos?vendaId=${encodeURIComponent(vendaId)}`)
  } catch (error) {
    console.error("Erro ao buscar linhas da encomenda:", error)
    return []
  }
}

export async function atualizarCliente(cliente: Cliente): Promise<Cliente> {
  return requestJson<Cliente>(`/clientes/${cliente.id}`, {
    method: "PUT",
    body: JSON.stringify(cliente),
  })
}

export async function criarVendaProduto(dados: {
  detalhesVariante?: string
  precoUnitario: number
  produtoId: string
  quantidade: number
  vendaId: string
}) {
  return requestJson("/vendaProdutos", {
    method: "POST",
    body: JSON.stringify({
      precoUnitario: dados.precoUnitario,
      produtoId: dados.produtoId,
      quantidade: dados.quantidade,
      vendaId: dados.vendaId,
      detalhesVariante: dados.detalhesVariante,
    }),
  })
}

export async function iniciarPagamentoMbWay(vendaId: string): Promise<{ vendaId: string; sessionId: string; url: string }> {
  return requestJson("/pagamentos/stripe/checkout", {
    method: "POST",
    body: JSON.stringify({ vendaId }),
  })
}

export async function obterEstadoPagamentoStripe(sessionId: string): Promise<{ vendaId: string; estado: string; pago: boolean }> {
  return requestJson(`/pagamentos/stripe/sessoes/${encodeURIComponent(sessionId)}`)
}
