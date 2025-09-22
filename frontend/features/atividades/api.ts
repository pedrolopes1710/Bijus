import type { Atividade } from "./types"

// Base URL for the API
const API_BASE_URL = "http://localhost:5225/api"

// Fetch all atividades
export async function fetchAtividades(): Promise<Atividade[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/Atividades`)
    if (!response.ok) {
      throw new Error(`Error fetching atividades: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching atividades:", error)
    throw error
  }
}

// Fetch a single atividade by ID
export async function fetchAtividade(id: string): Promise<Atividade> {
  try {
    const response = await fetch(`${API_BASE_URL}/Atividades/${id}`)
    if (!response.ok) {
      throw new Error(`Error fetching atividade: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching atividade ${id}:`, error)
    throw error
  }
}
