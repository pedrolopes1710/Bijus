import type { Rubrica } from "../rubricas/types"

export interface Despesa {
  id: string
  descricao: string
  valor: number
  cargaMensal?: any // ignored
}

export interface Orcamento {
  id: string
  gastoPlaneado: number
  rubrica: Rubrica
  despesas?: Despesa[]
}

export interface CreatingOrcamentoDto {
  gastoPlaneado: number
  rubricaId: string
}

export interface EditingOrcamentoDto {
  gastoPlaneado?: number
  rubricaId?: string
  despesaId?: string
}
