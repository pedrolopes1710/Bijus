export interface Despesa {
  id: string
  descricao: string
  valor: number
  orcamentoId?: string
}

export interface CreatingDespesaDto {
  descricao: string
  valor: number
  orcamentoId: string
}

// Interface para edição de despesas, correspondente ao DTO do backend
export interface EditingDespesaDto {
  descricao?: string
  valor?: number
}

// Interface para resposta da API após exclusão
export interface DeleteDespesaResponse {
  success: boolean
  message?: string
}
