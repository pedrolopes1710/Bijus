import type {
  TabelaAfetacoesDto,
  PessoaDto,
  CreatingBulkCargaMensalDto,
  CreatingAfetacaoMensalDto,
  EditingAfetacaoMensalDto,
  EditingCargaMensalDto,
} from "./types"

// Configuração da base URL da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5225"

// Função para buscar a lista de pessoas (simplificada)
export async function getPessoas(): Promise<PessoaDto[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pessoas`)
    if (!response.ok) {
      throw new Error(`Failed to fetch pessoas: ${response.status} ${response.statusText}`)
    }
    const pessoas: PessoaDto[] = await response.json()
    return pessoas
  } catch (error) {
    console.error("Error fetching pessoas:", error)
    throw error
  }
}

// Função para buscar a tabela de afetações de uma pessoa
export async function getTabelaAfetacoes(pessoaId: string): Promise<TabelaAfetacoesDto> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tabelaafetacoes/${pessoaId}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch tabela afetacoes: ${response.status} ${response.statusText}`)
    }
    const data: TabelaAfetacoesDto = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching tabela afetacoes:", error)
    throw error
  }
}

// Função para criar cargas mensais em bulk
export async function createCargasMensaisBulk(dto: CreatingBulkCargaMensalDto): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cargasmensais/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        JornadaDiaria: dto.jornadaDiaria,
        DiasUteisTrabalhaveis: dto.diasUteisTrabalhaveis,
        FeriasBaixasLicencasFaltas: dto.feriasBaixasLicencasFaltas,
        MesAnoInicio: dto.mesAnoInicio,
        MesAnoFim: dto.mesAnoFim,
        SalarioBase: dto.salarioBase,
        TaxaSocialUnica: dto.taxaSocialUnica,
        PessoaId: dto.pessoaId,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create cargas mensais: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.error("Error creating cargas mensais:", error)
    throw error
  }
}

// Função para criar uma afetação mensal
export async function createAfetacaoMensal(dto: CreatingAfetacaoMensalDto): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/afetacaomensais`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        PMs: dto.pMs,
        AfetacaoPerfilId: dto.afetacaoPerfilId,
        MesAno: dto.mesAno,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create afetacao mensal: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.error("Error creating afetacao mensal:", error)
    throw error
  }
}

// Função para atualizar uma afetação mensal
export async function updateAfetacaoMensal(id: string, dto: EditingAfetacaoMensalDto): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/afetacaomensais/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        PMs: dto.pMs,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to update afetacao mensal: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.error("Error updating afetacao mensal:", error)
    throw error
  }
}

// Função para atualizar uma carga mensal
export async function updateCargaMensal(id: string, dto: EditingCargaMensalDto): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cargasmensais/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        JornadaDiaria: dto.jornadaDiaria,
        DiasUteisTrabalhaveis: dto.diasUteisTrabalhaveis,
        FeriasBaixasLicencasFaltas: dto.feriasBaixasLicencasFaltas,
        SalarioBase: dto.salarioBase,
        TaxaSocialUnica: dto.taxaSocialUnica,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to update carga mensal: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.error("Error updating carga mensal:", error)
    throw error
  }
}
