import type { Rubrica, CreateRubricaDto, UpdateRubricaDto } from "./types"

// Base URL for the API
const API_BASE_URL = "http://localhost:5225/api"

// Fetch all rubricas
export async function fetchRubricas(): Promise<Rubrica[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/Rubricas`)
    if (!response.ok) {
      throw new Error(`Error fetching rubricas: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching rubricas:", error)
    throw error
  }
}

// Fetch a single rubrica by ID
export async function fetchRubrica(id: string): Promise<Rubrica> {
  try {
    const response = await fetch(`${API_BASE_URL}/Rubricas/${id}`)
    if (!response.ok) {
      throw new Error(`Error fetching rubrica: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching rubrica ${id}:`, error)
    throw error
  }
}

// Create a new rubrica
export async function createRubrica(data: CreateRubricaDto): Promise<Rubrica> {
  try {
    const response = await fetch(`${API_BASE_URL}/Rubricas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Error creating rubrica: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating rubrica:", error)
    throw error
  }
}

// Update an existing rubrica
export async function updateRubrica(id: string, data: UpdateRubricaDto): Promise<Rubrica> {
  try {
    const response = await fetch(`${API_BASE_URL}/Rubricas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Error updating rubrica: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error updating rubrica ${id}:`, error)
    throw error
  }
}

// Delete a rubrica
export async function deleteRubrica(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/Rubricas/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Error deleting rubrica: ${response.status}`)
    }
  } catch (error) {
    console.error(`Error deleting rubrica ${id}:`, error)
    throw error
  }
}
