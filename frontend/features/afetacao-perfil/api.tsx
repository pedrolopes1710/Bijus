import type { AfetacaoPerfil, CreateAfetacaoPerfilDto, UpdateAfetacaoPerfilDto, Pessoa, Perfil } from "./types"

const AFETACAO_PERFIL_URL = "http://localhost:5225/api/AfetacaoPerfil"
const PESSOAS_URL = "http://localhost:5225/api/Pessoas"
const PERFIS_URL = "http://localhost:5225/api/Perfil"

// Função para buscar todas as afetações de perfil
export async function fetchAfetacoesPerfil(): Promise<AfetacaoPerfil[]> {
  try {
    const response = await fetch(AFETACAO_PERFIL_URL)
    if (!response.ok) {
      throw new Error(`Erro ao buscar afetações de perfil: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Erro ao buscar afetações de perfil:", error)
    throw error
  }
}

// Função para buscar uma afetação de perfil específica
export async function fetchAfetacaoPerfil(id: string): Promise<AfetacaoPerfil> {
  try {
    const response = await fetch(`${AFETACAO_PERFIL_URL}/${id}`)
    if (!response.ok) {
      throw new Error(`Erro ao buscar afetação de perfil: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Erro ao buscar afetação de perfil ${id}:`, error)
    throw error
  }
}

// Função para criar uma nova afetação de perfil
export async function createAfetacaoPerfil(data: CreateAfetacaoPerfilDto): Promise<AfetacaoPerfil> {
  try {
    // Validar campos obrigatórios
    if (!data.perfilId || data.perfilId.trim() === "") {
      throw new Error("O ID do perfil é obrigatório")
    }

    if (!data.pessoaId || data.pessoaId.trim() === "") {
      throw new Error("O ID da pessoa é obrigatório")
    }

    if (data.duracaoMes <= 0) {
      throw new Error("A duração em meses deve ser maior que zero")
    }

    if (data.pMsAprovados <= 0) {
      throw new Error("Os PMs aprovados devem ser maior que zero")
    }

    console.log("Enviando dados para API:", data)

    const response = await fetch(AFETACAO_PERFIL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Resposta da API:", errorText)
      throw new Error(`Erro ao criar afetação de perfil: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao criar afetação de perfil:", error)
    throw error
  }
}

// Função para atualizar uma afetação de perfil
export async function updateAfetacaoPerfil(data: UpdateAfetacaoPerfilDto): Promise<AfetacaoPerfil> {
  try {
    // Validar campos obrigatórios
    if (!data.id || data.id.trim() === "") {
      throw new Error("O ID da afetação é obrigatório")
    }

    if (!data.perfilId || data.perfilId.trim() === "") {
      throw new Error("O ID do perfil é obrigatório")
    }

    if (data.duracaoMes <= 0) {
      throw new Error("A duração em meses deve ser maior que zero")
    }

    if (data.pMsAprovados <= 0) {
      throw new Error("Os PMs aprovados devem ser maior que zero")
    }

    // Preparar o body conforme o formato correto da API
    const updatePayload = {
      id: data.id,
      duracaoMes: data.duracaoMes,
      pMsAprovados: data.pMsAprovados,
      perfilId: data.perfilId,
      // Note: pessoaId não está incluído no PUT conforme o exemplo fornecido
    }

    console.log("Atualizando dados na API:", updatePayload)

    const response = await fetch(`${AFETACAO_PERFIL_URL}/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatePayload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Resposta da API:", errorText)
      throw new Error(`Erro ao atualizar afetação de perfil: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao atualizar afetação de perfil:", error)
    throw error
  }
}

// Função para deletar uma afetação de perfil
export async function deleteAfetacaoPerfil(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${AFETACAO_PERFIL_URL}/${id}`, {
      method: "DELETE",
    })

    if (response.status === 404) return false
    if (!response.ok) {
      throw new Error(`Erro ao deletar afetação de perfil: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error("Erro ao deletar afetação de perfil:", error)
    throw error
  }
}

// Função para buscar todas as pessoas
export async function fetchPessoas(): Promise<Pessoa[]> {
  try {
    const response = await fetch(PESSOAS_URL)
    if (!response.ok) {
      throw new Error(`Erro ao buscar pessoas: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Erro ao buscar pessoas:", error)
    throw error
  }
}

// Função para buscar todos os perfis
export async function fetchPerfis(): Promise<Perfil[]> {
  try {
    const response = await fetch(PERFIS_URL)
    if (!response.ok) {
      throw new Error(`Erro ao buscar perfis: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Erro ao buscar perfis:", error)
    throw error
  }
}
