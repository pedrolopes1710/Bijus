"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Usuario, DadosRegisto, DadosLogin } from "@/lib/types"
import { registarUsuario, loginUsuario, fetchUsuario } from "@/lib/api"

interface AuthContextType {
  usuario: Usuario | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (dados: DadosLogin) => Promise<void>
  registo: (dados: DadosRegisto) => Promise<void>
  logout: () => void
  recarregarUsuario: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    const userStr = localStorage.getItem("auth_user")
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        setUsuario(user)
      } catch (error) {
        console.error("[v0] Erro ao carregar usuário:", error)
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (dados: DadosLogin) => {
    try {
      const resultado = await loginUsuario(dados)
      console.log("[v0] Login resultado:", resultado)

      const tokenStr = resultado.token || ""
      const userObj = resultado.usuario

      if (!userObj) throw new Error("Resposta do servidor inválida")

      setUsuario(userObj)
      localStorage.setItem("auth_token", tokenStr)
      localStorage.setItem("auth_user", JSON.stringify(userObj))
    } catch (error) {
      throw error
    }
  }

  const registo = async (dados: DadosRegisto) => {
    try {
      const resultado = await registarUsuario(dados)

      // registarUsuario retorna: { usuario, token }
      const user = resultado.usuario || resultado
      const token = resultado.token || ""

      setUsuario(user)
      localStorage.setItem("auth_token", token)
      localStorage.setItem("auth_user", JSON.stringify(user))
    } catch (error) {
      throw error
    }
  }

  const recarregarUsuario = async () => {
    if (!usuario?.userName) {
      throw new Error("Nenhum utilizador autenticado")
    }
    
    try {
      const usuarioAtualizado = await fetchUsuario(usuario.userName)
      setUsuario(usuarioAtualizado)
      localStorage.setItem("auth_user", JSON.stringify(usuarioAtualizado))
    } catch (error) {
      console.error("[v0] Erro ao recarregar utilizador:", error)
      throw error
    }
  }

  const logout = () => {
    setUsuario(null)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isLoading,
        isAuthenticated: !!usuario,
        login,
        registo,
        logout,
        recarregarUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}