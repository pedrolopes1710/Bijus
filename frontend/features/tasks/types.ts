export interface Assignee {
  name: string
  avatar: string
}

export interface Task {
  id: string | number
  title: string
  descricao: string
  project: string
  status: "In Progress" | "Not Started" | "Completed"
  dataInicio: string
  dataFim: string
  assignee: Assignee
  atividadeId?: string
}

export interface Activity {
  id: string
  name: string
  description: string
  dataInicio: string
  dataFim: string
  tasks: Task[]
  progress: number
}
