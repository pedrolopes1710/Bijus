import type { Categoria, Colecao, DadosLogin, DadosRegisto, Produto, Usuario, Venda } from "./types"

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5225/api").replace(/\/$/, "")

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
  const response = await fetch(apiUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
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
  if (rawUrl.startsWith("/uploads/")) return rawUrl

  const apiHost = API_BASE_URL.replace(/\/api\/?$/, "")
  if (rawUrl.startsWith("/")) return `${apiHost}${rawUrl}`

  return `${apiHost}/${rawUrl}`
}

export async function fetchCategorias(): Promise<Categoria[]> {
  try {
    return await requestJson<Categoria[]>("/categorias")
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    throw new Error("Falha ao carregar categorias. Verifique se a API está a funcionar.")
  }
}

export async function fetchProdutos(): Promise<Produto[]> {
  try {
    return await requestJson<Produto[]>("/produtos")
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    throw new Error("Falha ao carregar produtos. Verifique se a API está a funcionar.")
  }
}

export async function fetchProdutosPorCategoria(categoriaId: string): Promise<Produto[]> {
  try {
    return await requestJson<Produto[]>(`/produtos?categoria=${encodeURIComponent(categoriaId)}`)
  } catch (error) {
    console.error("Erro ao buscar produtos por categoria:", error)
    throw new Error("Falha ao carregar produtos da categoria. Verifique se a API está a funcionar.")
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

export async function loginUsuario(dados: DadosLogin): Promise<{ usuario: Usuario; token: string }> {
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

    return { usuario, token }
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    throw error
  }
}

export async function verificarToken(token: string): Promise<Usuario> {
  try {
    return await requestJson<Usuario>("/usuarios/verificar", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    console.error("Erro ao verificar token:", error)
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
  try {
    return await requestJson<Colecao[]>("/colecoes")
  } catch (error) {
    console.error("Erro ao buscar coleções:", error)
    throw new Error("Falha ao carregar coleções. Verifique se a API está a funcionar.")
  }
}

export async function fetchColecao(id: string): Promise<Colecao> {
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
  data?: string
  estado?: string
  total: number
}): Promise<Venda> {
  return requestJson<Venda>("/vendas", {
    method: "POST",
    body: JSON.stringify({
      clienteId: dados.clienteId,
      data: dados.data || new Date().toISOString(),
      estado: dados.estado || "pendente",
      total: dados.total,
    }),
  })
}

export async function criarVendaProduto(dados: {
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
    }),
  })
}
