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

export interface ItemCarrinho {
  produto: Produto
  quantidade: number
}

export interface DadosEnvio {
  nome: string
  email: string
  telefone: string
  endereco: string
  cidade: string
  estado: string
  cep: string
}

export interface DadosPagamento {
  metodo: "cartao" | "mbway" | "transferencia"
  numeroCartao?: string
  nomeCartao?: string
  validadeCartao?: string
  cvv?: string
  numeroMbway?: string
}
