export interface Contrato {
  id: string
  tipo: string
  salario: number
  dataInicio: string
  dataFim: string
  ativo: boolean
}

// DTO para criar contrato (baseado no teu backend)
export interface CreatingContratoDto {
  tipo: string
  salario: number
  dataInicio: string
  dataFim: string
}

// DTO para editar contrato
export interface EditingContratoDto {
  id: string
  tipo: string
  salario: number
  dataInicio: string
  dataFim: string
  ativo: boolean
}

// DTO que a API de contrato retorna
export interface ContratoDto {
  id: string
  tipo: string
  salario: number
  dataInicio: string
  dataFim: string
  ativo: boolean
}

export interface Projeto {
  id: string
  nome: string
  descricao?: string
}

export interface Pessoa {
  id: string
  nome: string
  email: string
  pessoaCienciaId: string
  pessoaUltimoPedPagam: string
  ativo: boolean
  contrato: Contrato
  projetos: Projeto[]
  cargasMensais: any[]
}

// DTO para criar pessoa (sem o campo ativo - a API cria por defeito)
export interface CreatingPessoaDto {
  nome: string
  email: string
  pessoaCienciaId: string
  pessoaUltimoPedPagam: string
  contratoId: string
}

// DTO para editar pessoa
export interface EditingPessoaDto {
  id: string
  nome: string
  email: string
  pessoaUltimoPedPagam: string
}

// DTO para associar projetos
export interface AssociarProjetoDto {
  pessoaId: string
  projetosIds: string[]
}

export interface CreatePessoaDto {
  nome: string
  email: string
  pessoaCienciaId: string
  pessoaUltimoPedPagam: string
  ativo: boolean
  contratoId: string
}
