"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { ItemCarrinho, Produto, ProdutoVariante, DadosEnvio, DadosPagamento } from "@/lib/types"

interface CartContextType {
  itens: ItemCarrinho[]
  adicionarAoCarrinho: (produto: Produto, quantidade?: number, variante?: ProdutoVariante) => void
  removerDoCarrinho: (chave: string) => void
  atualizarQuantidade: (chave: string, quantidade: number) => void
  limparCarrinho: () => void
  totalItens: number
  totalPreco: number
  dadosEnvio: DadosEnvio | null
  dadosPagamento: DadosPagamento | null
  setDadosEnvio: (dados: DadosEnvio) => void
  setDadosPagamento: (dados: DadosPagamento) => void
  isLoaded: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([])
  const [dadosEnvio, setDadosEnvio] = useState<DadosEnvio | null>(null)
  const [dadosPagamento, setDadosPagamento] = useState<DadosPagamento | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const carrinhoSalvo = localStorage.getItem("carrinho")
      if (carrinhoSalvo) {
        const parsed = JSON.parse(carrinhoSalvo)
        setItens(parsed)
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho do localStorage:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("carrinho", JSON.stringify(itens))
      } catch (error) {
        console.error("Erro ao salvar carrinho no localStorage:", error)
      }
    }
  }, [itens, isLoaded])

  const adicionarAoCarrinho = (produto: Produto, quantidade = 1, variante?: ProdutoVariante) => {
    setItens((itensAtuais) => {
      const chave = variante ? `${produto.id}:${variante.id}` : produto.id
      const stockDisponivel = variante?.stock ?? produto.stock
      const itemExistente = itensAtuais.find((item) => (item.chave || item.produto.id) === chave)

      if (itemExistente) {
        const novaQuantidade = itemExistente.quantidade + quantidade
        if (novaQuantidade > stockDisponivel) {
          console.warn("Quantidade excede o stock disponível")
          return itensAtuais
        }
        return itensAtuais.map((item) =>
          (item.chave || item.produto.id) === chave ? { ...item, quantidade: novaQuantidade } : item,
        )
      }

      if (quantidade > stockDisponivel) {
        console.warn("Quantidade excede o stock disponível")
        return itensAtuais
      }

      return [...itensAtuais, { produto, quantidade, chave, variante, precoUnitario: variante?.preco ?? produto.preco }]
    })
  }

  const removerDoCarrinho = (chave: string) => {
    setItens((itensAtuais) => itensAtuais.filter((item) => (item.chave || item.produto.id) !== chave))
  }

  const atualizarQuantidade = (chave: string, quantidade: number) => {
    if (quantidade <= 0) {
      removerDoCarrinho(chave)
      return
    }

    setItens((itensAtuais) =>
      itensAtuais.map((item) => {
        if ((item.chave || item.produto.id) === chave) {
          const novaQuantidade = Math.min(quantidade, item.variante?.stock ?? item.produto.stock)
          return { ...item, quantidade: novaQuantidade }
        }
        return item
      }),
    )
  }

  const limparCarrinho = () => {
    setItens([])
    setDadosEnvio(null)
    setDadosPagamento(null)
  }

  const totalItens = itens.reduce((total, item) => total + item.quantidade, 0)
  const totalPreco = itens.reduce((total, item) => total + (item.precoUnitario ?? item.produto.preco) * item.quantidade, 0)

  return (
    <CartContext.Provider
      value={{
        itens,
        adicionarAoCarrinho,
        removerDoCarrinho,
        atualizarQuantidade,
        limparCarrinho,
        totalItens,
        totalPreco,
        dadosEnvio,
        dadosPagamento,
        setDadosEnvio,
        setDadosPagamento,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart deve ser usado dentro de um CartProvider")
  }
  return context
}
