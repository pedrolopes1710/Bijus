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
  fotos?: FotoProduto[]
}

export interface FotoProduto {
  id: string
  urlProduto: string
  produtoId: string
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

export interface Cliente {
  id: string
  nome: string
  email: string
  morada: string
}

export interface Usuario {
  id: string
  userName: string
  userPassword?: string // Opcional, não deve ser exposto no frontend
  clienteDto: Cliente
}

export interface DadosRegisto {
  // Dados do cliente
  nome: string
  email: string
  morada: string
  // Dados do usuário
  username: string
  password: string
}

export interface DadosLogin {
  username: string
  password: string
}
export interface FotoColecao {
  id: string
  urlColecao: string
  colecaoId: string
}

export interface Colecao {
  id: string
  dataAtualizacao: string
  dataCriacao: string
  estadoColecao: string
  nomeColecao: string
  descricaoColecao: string
  produto: Produto[]
  fotos: FotoColecao[]
}