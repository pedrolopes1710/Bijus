"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Usuario, DadosRegistro, DadosLogin } from "@/lib/types"
import { registrarUsuario, loginUsuario, verificarToken } from "@/lib/api"
import { hashPassword } from "@/lib/crypto"

interface AuthContextType {
  usuario: Usuario | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (dados: DadosLogin) => Promise<void>
  registro: (dados: DadosRegistro) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há token salvo
    const token = localStorage.getItem("auth_token")
    if (token) {
      verificarToken(token)
        .then((user) => {
          setUsuario(user)
        })
        .catch(() => {
          localStorage.removeItem("auth_token")
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (dados: DadosLogin) => {
    try {
      // Hash da senha antes de enviar
      const senhaHash = await hashPassword(dados.senha)
      const resultado = await loginUsuario({ ...dados, senha: senhaHash })

      setUsuario(resultado.usuario)
      localStorage.setItem("auth_token", resultado.token)
    } catch (error) {
      throw error
    }
  }

  const registro = async (dados: DadosRegistro) => {
    try {
      // Hash da senha antes de enviar
      const senhaHash = await hashPassword(dados.senha)
      const usuario = await registrarUsuario({ ...dados, senha: senhaHash })

      // Após registro, fazer login automaticamente
      await login({ email: dados.email, senha: dados.senha })
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUsuario(null)
    localStorage.removeItem("auth_token")
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isLoading,
        isAuthenticated: !!usuario,
        login,
        registro,
        logout,
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
