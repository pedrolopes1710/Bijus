import type { Profile, CreateProfileDto } from "./types"

const PERFIS_URL = "http://localhost:5225/api/Perfil"

// Função para buscar todos os perfis
export async function fetchProfiles(): Promise<Profile[]> {
  try {
    const response = await fetch(PERFIS_URL)
    if (!response.ok) {
      throw new Error(`Erro ao buscar perfis: ${response.status}`)
    }

    const data = await response.json()
    console.log("Perfis recebidos da API:", data)
    return data
  } catch (error) {
    console.error("Erro ao buscar perfis:", error)
    throw error
  }
}

// Função para buscar um perfil específico
export async function fetchProfile(id: string): Promise<Profile> {
  try {
    const response = await fetch(`${PERFIS_URL}/${id}`)
    if (!response.ok) {
      throw new Error(`Erro ao buscar perfil: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Erro ao buscar perfil ${id}:`, error)
    throw error
  }
}

// Função para criar um novo perfil
export async function createProfile(profileData: CreateProfileDto): Promise<Profile> {
  try {
    if (!profileData.descricao || profileData.descricao.trim() === "") {
      throw new Error("A descrição do perfil não pode estar vazia")
    }

    if (!profileData.tipoVinculoId || profileData.tipoVinculoId.trim() === "") {
      throw new Error("O tipo de vínculo é obrigatório")
    }

    if (profileData.pms <= 0) {
      throw new Error("O valor de PMs deve ser maior que zero")
    }

    console.log("Enviando dados para API:", profileData)

    const response = await fetch(PERFIS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Resposta da API:", errorText)
      throw new Error(`Erro ao criar perfil: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao criar perfil:", error)
    throw error
  }
}

// Função para atualizar um perfil
export async function updateProfile(id: string, profileData: Partial<CreateProfileDto>): Promise<Profile> {
  try {
    const response = await fetch(`${PERFIS_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      throw new Error(`Erro ao atualizar perfil: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
    throw error
  }
}

// Função para deletar um perfil
export async function deleteProfile(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${PERFIS_URL}/${id}`, {
      method: "DELETE",
    })

    if (response.status === 404) return false
    if (!response.ok) {
      throw new Error(`Erro ao deletar perfil: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error("Erro ao deletar perfil:", error)
    throw error
  }
}
