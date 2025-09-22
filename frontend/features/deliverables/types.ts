export interface Entregavel {
  id: string
  nome: string
  descricao?: string
  dataEntrega?: string
  status?: string
}

export interface CreateEntregavelDto {
  nome: string
  descricao: string
  dataEntrega: string
  status: string
}
