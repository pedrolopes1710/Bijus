// types.ts

export interface Projeto {
    id: number
    nome: string
    descricao: string
    status?: "Not Started" | "In Progress" | "Completed" | "On Hold"
    progresso?: number
    membros?: number
    tarefas?: {
        total: number
        concluídas: number
    }
    prazo?: string // Data no formato ISO ou string
}
