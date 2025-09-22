const API_BASE_URL = "http://localhost:5225/api"

export interface CreateActivityDto {
  nomeAtividade: string
  descricaoAtividade: string
  dataInicioAtividade: string
  dataFimAtividade: string
  orcamentoIds?: string[]
  tarefasIds?: string[]
  entregaveisIds?: string[]
  perfisIds?: string[]
}

export interface UpdateActivityDto {
  id: string
  nomeAtividade: string
  descricaoAtividade: string
  dataInicioAtividade: string
  dataFimAtividade: string
  orcamentoIds?: string[]
  tarefasIds?: string[]
  entregaveisIds?: string[]
  perfisIds?: string[]
}

export async function createActivity(data: CreateActivityDto) {
  try {
    console.log("Enviando dados para criar atividade:", data)

    const response = await fetch(`${API_BASE_URL}/Atividades`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erro na resposta da API:", errorText)
      throw new Error(`Erro ao criar atividade: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log("Atividade criada com sucesso:", result)
    return result
  } catch (error) {
    console.error("Erro ao criar atividade:", error)
    throw error
  }
}

export async function updateActivity(data: UpdateActivityDto) {
  try {
    console.log("Enviando dados para atualizar atividade:", data)

    const response = await fetch(`${API_BASE_URL}/Atividades/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erro na resposta da API:", errorText)
      throw new Error(`Erro ao atualizar atividade: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log("Atividade atualizada com sucesso:", result)
    return result
  } catch (error) {
    console.error("Erro ao atualizar atividade:", error)
    throw error
  }
}

export async function deleteActivity(id: string) {
  try {
    console.log("Excluindo atividade:", id)

    const response = await fetch(`${API_BASE_URL}/Atividades/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erro na resposta da API:", errorText)
      throw new Error(`Erro ao excluir atividade: ${response.status} - ${errorText}`)
    }

    console.log("Atividade excluída com sucesso")
    return true
  } catch (error) {
    console.error("Erro ao excluir atividade:", error)
    throw error
  }
}

export async function fetchActivityById(id: string) {
  try {
    console.log("Buscando atividade por ID:", id)

    const response = await fetch(`${API_BASE_URL}/Atividades/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erro na resposta da API:", errorText)
      throw new Error(`Erro ao buscar atividade: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log("Atividade encontrada:", result)
    return result
  } catch (error) {
    console.error("Erro ao buscar atividade:", error)
    throw error
  }
}
