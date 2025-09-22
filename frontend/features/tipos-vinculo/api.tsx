import type { TipoVinculo } from "./types"

const API_BASE_URL = "http://localhost:5225/api/TiposVinculo"

export async function getTiposVinculo(): Promise<TipoVinculo[]> {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Erro ao buscar tipos de vínculo: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao buscar tipos de vínculo:", error)
    throw error
  }
}
