import type { Categoria, Produto, DadosRegisto, DadosLogin, Utilizador } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5225/api"

export async function fetchCategorias(): Promise<Categoria[]> {
  try {
    console.log("[v0] Fetching categorias from:", `${API_BASE_URL}/categorias`)
    const response = await fetch(`${API_BASE_URL}/categorias`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Categorias fetched successfully:", data.length, "items")
    return data
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    throw new Error("Falha ao carregar categorias. Verifique se a API está funcionando.")
  }
}

export async function fetchProdutos(): Promise<Produto[]> {
  try {
    console.log("[v0] Fetching produtos from:", `${API_BASE_URL}/produtos`)
    const response = await fetch(`${API_BASE_URL}/produtos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Produtos fetched successfully:", data.length, "items")
    return data
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    throw new Error("Falha ao carregar produtos. Verifique se a API está funcionando.")
  }
}

export async function fetchProdutosPorCategoria(categoriaId: string): Promise<Produto[]> {
  try {
    console.log("[v0] Fetching produtos by categoria:", categoriaId)
    const response = await fetch(`${API_BASE_URL}/produtos?categoria=${categoriaId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Produtos by categoria fetched successfully:", data.length, "items")
    return data
  } catch (error) {
    console.error("Erro ao buscar produtos por categoria:", error)
    throw new Error("Falha ao carregar produtos da categoria. Verifique se a API está funcionando.")
  }
}

export async function registarUtiluzador(dados: DadosRegisto): Promise<Utilizador> {
  try {
    console.log("[v0] Registrando usuário:", dados.email)
    const response = await fetch(`${API_BASE_URL}/usuarios/registro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Erro ao registrar usuário")
    }

    const usuario = await response.json()
    console.log("[v0] Usuário registrado com sucesso:", usuario.id)
    return usuario
  } catch (error) {
    console.error("Erro ao registrar usuário:", error)
    throw error
  }
}

export async function loginUtilizador(dados: DadosLogin): Promise<{ utilizador: Utilizador; token: string }> {
  try {
    console.log("[v0] Login:", dados.email)
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Credenciais inválidas")
    }

    const result = await response.json()
    console.log("[v0] Login bem-sucedido:", result.utilizador.id)
    return result
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    throw error
  }
}

export async function verificarToken(token: string): Promise<Utilizador> {
  try {
    console.log("[v0] Verificando token")
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Token inválido")
    }

    const usuario = await response.json()
    console.log("[v0] Token válido:", usuario.id)
    return usuario
  } catch (error) {
    console.error("Erro ao verificar token:", error)
    throw error
  }
}
