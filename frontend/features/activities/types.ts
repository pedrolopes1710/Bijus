export interface CreateActivityDto {
  nomeAtividade: string
  descricaoAtividade: string
  dataInicioAtividade: string
  dataFimAtividade: string
  orcamentoIds?: string[]
  tarefasIds?: string[]
  entregaveisIds?: string[]
  perfisIds?: string[]
}

export interface UpdateActivityDto {
  id: string
  nomeAtividade: string
  descricaoAtividade: string
  dataInicioAtividade: string
  dataFimAtividade: string
  orcamentoIds?: string[]
  tarefasIds?: string[]
  entregaveisIds?: string[]
  perfisIds?: string[]
}

export interface Activity {
  id: string
  name: string
  description: string
  dataInicio: string
  dataFim: string
  tasks: Task[]
  orcamentoIds?: string[]
  tarefasIds?: string[]
  entregaveisIds?: string[]
  perfisIds?: string[]
}

export interface Task {
  id: string | number
  title: string
  description: string
  descricao: string
  status: string
  project: string
  assignee: {
    name: string
    avatar?: string
  }
}
