import type { Categoria, Produto } from "./types"

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
