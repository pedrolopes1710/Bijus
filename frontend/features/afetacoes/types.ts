export interface PessoaDto {
  id: string
  nome: string
  email: string
  pessoaCienciaId: string
  pessoaUltimoPedPagam: string
  ativo: boolean
  contrato?: ContratoDto
  projetos: ProjetoDTO[]
  cargasMensais: CargaMensalDto[]
}

export interface ContratoDto {
  id: string
  tipo: string
  salario: number
  dataInicio: string
  dataFim?: string
  ativo: boolean
}

export interface ProjetoDTO {
  id: string
}

export interface CargaMensalDto {
  id: string
  jornadaDiaria: number
  diasUteisTrabalhaveis: number
  feriasBaixasLicencasFaltas: number
  mesAno: string
  salarioBase: number
  taxaSocialUnica: number
}

export interface CreatingCargaMensalDto {
  jornadaDiaria: number
  diasUteisTrabalhaveis: number
  feriasBaixasLicencasFaltas: number
  mesAno: string
  salarioBase: number
  taxaSocialUnica: number
  pessoaId: string
}

export interface PerfilDto {
  id: string
  pMs: number
  descricao: string
}

export interface AfetacaoPerfilDto {
  id: string
  duracaoMes: number
  pMsAprovados: number
  perfilDto: PerfilDto
}

export interface AfetacaoMensalDto {
  id: string
  pMs: number
  afetacaoPerfil: AfetacaoPerfilDto
  cargaMensal: CargaMensalDto
}

export interface TabelaAfetacoesDto {
  pessoa: PessoaDto
  afetacoesMensais: AfetacaoMensalDto[]
  afetacoesPerfis: AfetacaoPerfilDto[]
  perfis: PerfilDto[]
  cargasMensais: CargaMensalDto[]
}

export interface PessoaListItem {
  id: string
  nome: string
  email: string
}

// DTO para o backend (seguindo o formato do seu DTO)
export interface CreatingBulkCargaMensalDto {
  jornadaDiaria: number
  diasUteisTrabalhaveis: number
  feriasBaixasLicencasFaltas: number
  mesAnoInicio: string // Será convertido para DateTime no backend
  mesAnoFim: string // Será convertido para DateTime no backend
  salarioBase: number
  taxaSocialUnica: number
  pessoaId: string
}

// DTOs para afetações mensais
export interface CreatingAfetacaoMensalDto {
  pMs: number
  afetacaoPerfilId: string
  mesAno: string
}

export interface EditingAfetacaoMensalDto {
  pMs: number
}

// DTO para editar carga mensal
export interface EditingCargaMensalDto {
  jornadaDiaria: number
  diasUteisTrabalhaveis: number
  feriasBaixasLicencasFaltas: number
  salarioBase: number
  taxaSocialUnica: number
}
