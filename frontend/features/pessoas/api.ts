import type {
  Pessoa,
  CreatingPessoaDto,
  CreatingContratoDto,
  ContratoDto,
  EditingPessoaDto,
  EditingContratoDto,
} from "./types"

const PESSOAS_URL = "http://localhost:5225/api/pessoas"

// Função para buscar todas as pessoas
export async function fetchPessoas(): Promise<Pessoa[]> {
  try {
    const response = await fetch(PESSOAS_URL)
    if (!response.ok) {
      throw new Error(`Erro ao buscar pessoas: ${response.status}`)
    }
    const data = await response.json()
    console.log("Fetched pessoas data:", data) // Debug log
    return data
  } catch (error) {
    console.error("Erro ao buscar pessoas:", error)
    throw error
  }
}

// Função para buscar uma pessoa específica
export async function fetchPessoa(id: string): Promise<Pessoa> {
  try {
    const response = await fetch(`${PESSOAS_URL}/${id}`)
    if (!response.ok) {
      throw new Error(`Erro ao buscar pessoa: ${response.status}`)
    }
    const data = await response.json()
    console.log("Fetched pessoa data:", data) // Debug log
    return data
  } catch (error) {
    console.error(`Erro ao buscar pessoa ${id}:`, error)
    throw error
  }
}

// Função para criar um novo contrato
export async function createContrato(contratoData: CreatingContratoDto): Promise<ContratoDto> {
  try {
    const response = await fetch("http://localhost:5225/api/contratos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contratoData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Resposta da API de contratos:", errorText)
      throw new Error(`Erro ao criar contrato: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao criar contrato:", error)
    throw error
  }
}

// Função para editar um contrato
export async function updateContrato(contratoData: EditingContratoDto): Promise<ContratoDto> {
  try {
    const response = await fetch(`http://localhost:5225/api/contratos/${contratoData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contratoData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Resposta da API de contratos:", errorText)
      throw new Error(`Erro ao editar contrato: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao editar contrato:", error)
    throw error
  }
}

// Função para ativar/desativar contrato
export async function toggleContratoStatus(contratoId: string, ativar: boolean): Promise<ContratoDto> {
  try {
    const endpoint = ativar
      ? `http://localhost:5225/api/contratos/${contratoId}/ativar`
      : `http://localhost:5225/api/contratos/${contratoId}/desativar`
    const method = ativar ? "POST" : "DELETE"

    const response = await fetch(endpoint, {
      method: method,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Resposta da API de contratos:", errorText)
      throw new Error(`Erro ao ${ativar ? "ativar" : "desativar"} contrato: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Erro ao ${ativar ? "ativar" : "desativar"} contrato:`, error)
    throw error
  }
}

// Função para criar uma nova pessoa (SEM o campo ativo)
export async function createPessoa(pessoaData: CreatingPessoaDto): Promise<Pessoa> {
  try {
    const response = await fetch(PESSOAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pessoaData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Resposta da API:", errorText)
      throw new Error(`Erro ao criar pessoa: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao criar pessoa:", error)
    throw error
  }
}

// Função para editar uma pessoa
export async function updatePessoa(pessoaData: EditingPessoaDto): Promise<Pessoa> {
  try {
    const response = await fetch(`${PESSOAS_URL}/${pessoaData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pessoaData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Resposta da API:", errorText)
      throw new Error(`Erro ao editar pessoa: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao editar pessoa:", error)
    throw error
  }
}

// Função para buscar todos os contratos
export async function fetchContratos(): Promise<ContratoDto[]> {
  try {
    const response = await fetch("http://localhost:5225/api/contratos")
    if (!response.ok) {
      throw new Error(`Erro ao buscar contratos: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Erro ao buscar contratos:", error)
    throw error
  }
}

// Função para associar contrato a uma pessoa
export async function associarContrato(pessoaId: string, contratoId: string): Promise<Pessoa> {
  try {
    const response = await fetch(`${PESSOAS_URL}/${pessoaId}/associarContrato/${contratoId}`, {
      method: "PUT",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Resposta da API:", errorText)
      throw new Error(`Erro ao associar contrato: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao associar contrato:", error)
    throw error
  }
}

// Função para remover contrato de uma pessoa (agora desativa o contrato para histórico)
export async function removerContrato(pessoaId: string): Promise<Pessoa> {
  try {
    // Primeiro buscar a pessoa para obter o ID do contrato
    const pessoa = await fetchPessoa(pessoaId)

    // Se tem contrato, desativá-lo primeiro
    if (pessoa.contrato?.id) {
      await toggleContratoStatus(pessoa.contrato.id, false)
    }

    const response = await fetch(`${PESSOAS_URL}/${pessoaId}/desassociarContrato`, {
      method: "PUT",
    })

    if (!response.ok) {
      throw new Error(`Erro ao remover contrato: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao remover contrato:", error)
    throw error
  }
}

// Função para deletar uma pessoa (agora desativa o contrato se existir)
export async function deletePessoa(id: string): Promise<boolean> {
  try {
    // Primeiro buscar a pessoa para ver se tem contrato
    const pessoa = await fetchPessoa(id)

    // Se a pessoa tem contrato, desativar o contrato primeiro (para histórico)
    if (pessoa.contrato?.id) {
      await toggleContratoStatus(pessoa.contrato.id, false)
    }

    const response = await fetch(`${PESSOAS_URL}/${id}`, {
      method: "DELETE",
    })

    if (response.status === 404) return false
    if (!response.ok) {
      throw new Error(`Erro ao deletar pessoa: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error("Erro ao deletar pessoa:", error)
    throw error
  }
}

// Função para ativar/desativar pessoa
export async function togglePessoaStatus(id: string, ativar: boolean): Promise<Pessoa> {
  try {
    // Primeiro buscar a pessoa para obter o contrato
    const pessoa = await fetchPessoa(id)

    // Se a pessoa tem contrato, alterar o status do contrato primeiro
    if (pessoa.contrato?.id) {
      try {
        await toggleContratoStatus(pessoa.contrato.id, ativar)
      } catch (error) {
        console.warn("Erro ao alterar status do contrato:", error)
        // Não falhar a operação se o contrato não conseguir ser alterado
      }
    }

    // Agora alterar o status da pessoa
    const endpoint = ativar ? `${PESSOAS_URL}/${id}/reativar` : `${PESSOAS_URL}/${id}/desativar`
    const method = ativar ? "PUT" : "DELETE"

    const response = await fetch(endpoint, {
      method: method,
    })

    if (!response.ok) {
      throw new Error(`Erro ao ${ativar ? "ativar" : "desativar"} pessoa: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Erro ao ${ativar ? "ativar" : "desativar"} pessoa:`, error)
    throw error
  }
}

// Função para associar projetos
export async function associarProjetos(pessoaId: string, projetosIds: string[]): Promise<Pessoa> {
  try {
    const response = await fetch(`${PESSOAS_URL}/${pessoaId}/associarProjetos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projetosIds),
    })

    if (!response.ok) {
      throw new Error(`Erro ao associar projetos: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao associar projetos:", error)
    throw error
  }
}

// Função para desassociar projetos
export async function desassociarProjetos(pessoaId: string, projetosIds: string[]): Promise<Pessoa> {
  try {
    const response = await fetch(`${PESSOAS_URL}/${pessoaId}/desassociarProjetos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projetosIds),
    })

    if (!response.ok) {
      throw new Error(`Erro ao desassociar projetos: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao desassociar projetos:", error)
    throw error
  }
}

// Função para buscar todos os projetos (para o seletor)
export async function fetchProjetos(): Promise<any[]> {
  try {
    const response = await fetch("http://localhost:5225/api/projetos")
    if (!response.ok) {
      throw new Error(`Erro ao buscar projetos: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Erro ao buscar projetos:", error)
    throw error
  }
}
