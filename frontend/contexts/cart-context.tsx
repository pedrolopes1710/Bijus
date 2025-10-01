"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { ItemCarrinho, Produto, DadosEnvio, DadosPagamento } from "@/lib/types"

interface CartContextType {
  itens: ItemCarrinho[]
  adicionarAoCarrinho: (produto: Produto, quantidade?: number) => void
  removerDoCarrinho: (produtoId: string) => void
  atualizarQuantidade: (produtoId: string, quantidade: number) => void
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

  const adicionarAoCarrinho = (produto: Produto, quantidade = 1) => {
    setItens((itensAtuais) => {
      const itemExistente = itensAtuais.find((item) => item.produto.id === produto.id)

      if (itemExistente) {
        const novaQuantidade = itemExistente.quantidade + quantidade
        if (novaQuantidade > produto.stock) {
          console.warn("Quantidade excede o stock disponível")
          return itensAtuais
        }
        return itensAtuais.map((item) =>
          item.produto.id === produto.id ? { ...item, quantidade: novaQuantidade } : item,
        )
      }

      if (quantidade > produto.stock) {
        console.warn("Quantidade excede o stock disponível")
        return itensAtuais
      }

      return [...itensAtuais, { produto, quantidade }]
    })
  }

  const removerDoCarrinho = (produtoId: string) => {
    setItens((itensAtuais) => itensAtuais.filter((item) => item.produto.id !== produtoId))
  }

  const atualizarQuantidade = (produtoId: string, quantidade: number) => {
    if (quantidade <= 0) {
      removerDoCarrinho(produtoId)
      return
    }

    setItens((itensAtuais) =>
      itensAtuais.map((item) => {
        if (item.produto.id === produtoId) {
          const novaQuantidade = Math.min(quantidade, item.produto.stock)
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
  const totalPreco = itens.reduce((total, item) => total + item.produto.preco * item.quantidade, 0)

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
