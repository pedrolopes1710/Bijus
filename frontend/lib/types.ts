export interface Categoria {
  id: string
  nome: string
}

export interface Produto {
  id: string
  nome: string
  descricao: string
  preco: number
  stock: number
  categoria: Categoria
}

export interface ApiResponse<T> {
  data: T
  error?: string
}
