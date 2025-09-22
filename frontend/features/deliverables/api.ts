import type { Entregavel, CreateEntregavelDto } from "./types"

const ENTREGAVEIS_URL = "http://localhost:5225/api/Entregaveis"

export async function createEntregavel(dto: CreateEntregavelDto): Promise<Entregavel> {
  try {
    const response = await fetch(ENTREGAVEIS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erro ao criar entregável:", errorText)
      throw new Error(`Erro ao criar entregável: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao criar entregável:", error)
    throw error
  }
}

export async function fetchEntregaveis(): Promise<Entregavel[]> {
  try {
    const response = await fetch(ENTREGAVEIS_URL)
    if (!response.ok) {
      throw new Error(`Erro ao buscar entregáveis: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Erro ao buscar entregáveis:", error)
    throw error
  }
}
