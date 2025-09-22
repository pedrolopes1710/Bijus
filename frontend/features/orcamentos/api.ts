import type { Orcamento, CreatingOrcamentoDto, EditingOrcamentoDto } from "./types"
import type { CreatingDespesaDto } from "../despesas/types"

// Base URL for the API
const API_BASE_URL = "http://localhost:5225/api"

// Fetch all orcamentos with optional atividadeId filter
export async function fetchOrcamentos(atividadeId?: string): Promise<Orcamento[]> {
  try {
    let url = `${API_BASE_URL}/Orcamentos`

    // Add atividadeId query parameter if provided
    if (atividadeId) {
      url += `?atividadeId=${atividadeId}`
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Error fetching orcamentos: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching orcamentos:", error)
    throw error
  }
}

// Fetch a single orcamento by ID
export async function fetchOrcamento(id: string): Promise<Orcamento> {
  try {
    const response = await fetch(`${API_BASE_URL}/Orcamentos/${id}`)
    if (!response.ok) {
      throw new Error(`Error fetching orcamento: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching orcamento ${id}:`, error)
    throw error
  }
}

// Create a new orcamento
export async function createOrcamento(data: CreatingOrcamentoDto): Promise<Orcamento> {
  try {
    const response = await fetch(`${API_BASE_URL}/Orcamentos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Error creating orcamento: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating orcamento:", error)
    throw error
  }
}

// Update an existing orcamento
export async function updateOrcamento(id: string, data: EditingOrcamentoDto): Promise<Orcamento> {
  try {
    const response = await fetch(`${API_BASE_URL}/Orcamentos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Error updating orcamento: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error updating orcamento ${id}:`, error)
    throw error
  }
}

// Delete an orcamento
export async function deleteOrcamento(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/Orcamentos/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Error deleting orcamento: ${response.status}`)
    }
  } catch (error) {
    console.error(`Error deleting orcamento ${id}:`, error)
    throw error
  }
}

// Create a new despesa (expense) for an orcamento
export async function createDespesa(data: CreatingDespesaDto): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/Despesas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Error creating despesa: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating despesa:", error)
    throw error
  }
}
