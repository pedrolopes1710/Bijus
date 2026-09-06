import type { Categoria, Colecao, Produto } from "./types"

/**
 * Dados de demonstração para visualizar o site sem backend/base de dados.
 * Ativa com a variável de ambiente NEXT_PUBLIC_USE_MOCKS=1 (ver lib/api.ts).
 * As imagens referenciadas existem em frontend/public/uploads/.
 */

export const MOCK_ENABLED = process.env.NEXT_PUBLIC_USE_MOCKS === "1"

const PROD_IMG = (name: string) => `/uploads/produtos/${name}`
const COL_IMG = (name: string) => `/uploads/colecoes/${name}`

const CATEGORIAS: Categoria[] = [
  { id: "cat-grandes", nome: "Bonecos Grandes" },
  { id: "cat-pequenos", nome: "Bonecos Pequenos" },
  { id: "cat-miniaturas", nome: "Miniaturas" },
  { id: "cat-mesa", nome: "Presença de Mesa" },
  { id: "cat-natal", nome: "Edição Natal" },
]

const catById = (id: string) => CATEGORIAS.find((c) => c.id === id)!

interface Seed {
  id: string
  nome: string
  descricao: string
  preco: number
  stock: number
  categoriaId: string
  imagens: string[]
}

const SEED: Seed[] = [
  {
    id: "p01",
    nome: "Bailarina em Ponta",
    descricao: "Figura em biscuit modelada e pintada à mão, com saia em tons de rosa e acabamento acetinado.",
    preco: 48,
    stock: 4,
    categoriaId: "cat-grandes",
    imagens: ["817e3d0d-0a06-4c17-aba4-28642e7182c9.jpg", "9e6003a0-335c-4055-bc79-e9a1355bb8f5.jpg"],
  },
  {
    id: "p02",
    nome: "Casal dos Noivos",
    descricao: "Topo de bolo personalizável, peça única feita por encomenda com traços delicados.",
    preco: 62,
    stock: 2,
    categoriaId: "cat-grandes",
    imagens: ["ce1ff1aa-d82f-4d32-a5d6-9b55d93fcbf0.jpg"],
  },
  {
    id: "p03",
    nome: "Anjo da Guarda",
    descricao: "Anjinho em biscuit branco com asas texturadas — lembrança perfeita para batizados.",
    preco: 18,
    stock: 24,
    categoriaId: "cat-pequenos",
    imagens: ["43a5c739-c919-4161-bce8-d7652f04e7f0.jpg"],
  },
  {
    id: "p04",
    nome: "Ursinho Dorminhoco",
    descricao: "Pequeno urso em tons pastel, ideal para decoração de quarto de bebé.",
    preco: 22,
    stock: 15,
    categoriaId: "cat-pequenos",
    imagens: ["dbeaf574-2b13-4a61-a44d-a64e189e2303.jpg"],
  },
  {
    id: "p05",
    nome: "Menina com Balões",
    descricao: "Cena romântica modelada ao detalhe, com balões coloridos em suspensão.",
    preco: 39,
    stock: 6,
    categoriaId: "cat-grandes",
    imagens: ["70eda05a-b11b-4a9b-af67-6d84c82d3171.jpg", "7566d169-f805-4d34-92f2-97cf5d422259.jpg"],
  },
  {
    id: "p06",
    nome: "Miniatura Gatinho",
    descricao: "Gatinho miniatura pintado à mão — cabe na palma da mão e enche qualquer prateleira.",
    preco: 12,
    stock: 30,
    categoriaId: "cat-miniaturas",
    imagens: ["facb8168-a45f-4474-9904-1128fa11cd86.jpg"],
  },
  {
    id: "p07",
    nome: "Coelhinho da Sorte",
    descricao: "Coelho em biscuit com laço, acabamento fosco e olhinhos pintados a pincel fino.",
    preco: 14,
    stock: 0,
    categoriaId: "cat-miniaturas",
    imagens: ["2733f3aa-e31b-49f4-8444-17a51880f676.jpg"],
  },
  {
    id: "p08",
    nome: "Trio de Passarinhos",
    descricao: "Conjunto de três aves delicadas para compor um centro de mesa primaveril.",
    preco: 28,
    stock: 9,
    categoriaId: "cat-mesa",
    imagens: ["4fd38bb5-da9a-48e6-a86a-b8f59b4e470f.jpeg"],
  },
  {
    id: "p09",
    nome: "Vaso de Rosas",
    descricao: "Arranjo floral inteiramente modelado em biscuit, pétala a pétala. Não murcha nunca.",
    preco: 54,
    stock: 3,
    categoriaId: "cat-mesa",
    imagens: ["a990430f-662e-4720-b2c9-4364bbb9747d.jpeg"],
  },
  {
    id: "p10",
    nome: "Pai Natal Clássico",
    descricao: "Pai Natal tradicional com saco de prendas, pintado em vermelho profundo e branco neve.",
    preco: 34,
    stock: 11,
    categoriaId: "cat-natal",
    imagens: ["73ae3ecd-c9fd-457d-8243-a8c245185d84.jpeg"],
  },
  {
    id: "p11",
    nome: "Boneco de Neve",
    descricao: "Boneco de neve sorridente com cachecol — a peça mais querida da coleção de inverno.",
    preco: 20,
    stock: 7,
    categoriaId: "cat-natal",
    imagens: ["5bedb1cc-aea0-4c27-9d17-97e6de172260.jpg"],
  },
  {
    id: "p12",
    nome: "Presépio Miniatura",
    descricao: "Presépio completo em escala reduzida, cada figura modelada individualmente à mão.",
    preco: 45,
    stock: 5,
    categoriaId: "cat-natal",
    imagens: ["b804a353-49ba-431e-8263-927432215a9e.jpg"],
  },
]

export const mockProdutos: Produto[] = SEED.map((s) => ({
  id: s.id,
  nome: s.nome,
  descricao: s.descricao,
  preco: s.preco,
  stock: s.stock,
  categoria: catById(s.categoriaId),
  fotos: s.imagens.map((img, i) => ({
    id: `${s.id}-foto-${i}`,
    urlProduto: PROD_IMG(img),
    produtoId: s.id,
  })),
}))

export const mockCategorias: Categoria[] = CATEGORIAS

export function mockProdutosPorCategoria(categoriaId: string): Produto[] {
  return mockProdutos.filter((p) => p.categoria?.id === categoriaId)
}

const produtosDe = (ids: string[]) => mockProdutos.filter((p) => ids.includes(p.id))

export const mockColecoes: Colecao[] = [
  {
    id: "col-natal",
    nomeColecao: "Coleção de Natal",
    descricaoColecao: "Peças de época feitas à mão para aquecer a casa nas festas.",
    estadoColecao: "ativa",
    dataCriacao: "2025-12-01T00:00:00Z",
    dataAtualizacao: "2025-12-01T00:00:00Z",
    produto: produtosDe(["p10", "p11", "p12"]),
    fotos: [
      { id: "fc-n1", urlColecao: COL_IMG("bd2c0805-eac1-4f33-93b0-b905dc325d6c.jpg"), colecaoId: "col-natal" },
      { id: "fc-n2", urlColecao: COL_IMG("c328f056-8a6f-446c-8967-476ed4887e56.jpg"), colecaoId: "col-natal" },
    ],
  },
  {
    id: "col-romantica",
    nomeColecao: "Momentos Românticos",
    descricaoColecao: "Topos de bolo e figuras para casamentos, noivados e datas especiais.",
    estadoColecao: "ativa",
    dataCriacao: "2025-06-15T00:00:00Z",
    dataAtualizacao: "2025-06-15T00:00:00Z",
    produto: produtosDe(["p01", "p02", "p05"]),
    fotos: [
      { id: "fc-r1", urlColecao: COL_IMG("367ee303-b091-4383-9717-c1eeb0cdb7e9.jpg"), colecaoId: "col-romantica" },
      { id: "fc-r2", urlColecao: COL_IMG("97e01afc-4595-465b-97e8-908cf8a5b7fd.jpg"), colecaoId: "col-romantica" },
    ],
  },
  {
    id: "col-mesa",
    nomeColecao: "Presença de Mesa",
    descricaoColecao: "Arranjos e conjuntos que dão vida a qualquer centro de mesa.",
    estadoColecao: "ativa",
    dataCriacao: "2025-03-10T00:00:00Z",
    dataAtualizacao: "2025-03-10T00:00:00Z",
    produto: produtosDe(["p08", "p09", "p06"]),
    fotos: [
      { id: "fc-m1", urlColecao: COL_IMG("3dba179e-4148-4dd7-a8a9-b9077fbbcc0d.jpg"), colecaoId: "col-mesa" },
      { id: "fc-m2", urlColecao: COL_IMG("521f0b1b-03dd-4a30-a46b-046d3e52c825.jpg"), colecaoId: "col-mesa" },
    ],
  },
]

export function mockColecao(id: string): Colecao | undefined {
  return mockColecoes.find((c) => c.id === id)
}
