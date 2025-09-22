// Atualizar a interface Profile para corresponder ao formato real da API
export interface Profile {
  id: string
  pms?: number
  descricao?: string
  projetoId?: string | null
  tipoVinculoId?: string
  // Manter campos antigos para compatibilidade se necessário
  nome?: string
  ativo?: boolean
  competencias?: string[]
  nivel?: string
  departamento?: string
}

export interface CreateProfileDto {
  pms: number
  descricao: string
  projetoId?: string | null
  tipoVinculoId: string
}

export interface TipoVinculo {
  id: string
  nome: string
}
