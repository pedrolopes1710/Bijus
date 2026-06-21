"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import type { DadosLogin, DadosRegisto, Usuario } from "@/lib/types"
import { fetchUsuario, loginUsuario, registarUsuario } from "@/lib/api"

interface AuthContextType {
  authProvider: string | null
  usuario: Usuario | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (dados: DadosLogin) => Promise<void>
  loginExterno: (usuario: Usuario, token: string, provider: string) => void
  registo: (dados: DadosRegisto) => Promise<void>
  logout: () => void
  recarregarUsuario: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = "auth_token"
const USER_KEY = "auth_user"
const PROVIDER_KEY = "auth_provider"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [authProvider, setAuthProvider] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const userStr = localStorage.getItem(USER_KEY)
    const provider = localStorage.getItem(PROVIDER_KEY)

    if (token && userStr) {
      try {
        setUsuario(JSON.parse(userStr))
        setAuthProvider(provider)
      } catch (error) {
        console.error("Erro ao carregar sessão:", error)
        clearSession()
      }
    }

    setIsLoading(false)
  }, [])

  const saveSession = useCallback((user: Usuario, token: string, provider: string) => {
    setUsuario(user)
    setAuthProvider(provider)
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    localStorage.setItem(PROVIDER_KEY, provider)
  }, [])

  const login = useCallback(async (dados: DadosLogin) => {
    const resultado = await loginUsuario(dados)

    if (!resultado.usuario) {
      throw new Error("Resposta do servidor inválida")
    }

    saveSession(resultado.usuario, resultado.token || "", "password")
  }, [saveSession])

  const loginExterno = useCallback((user: Usuario, token: string, provider: string) => {
    saveSession(user, token, provider)
  }, [saveSession])

  const registo = useCallback(async (dados: DadosRegisto) => {
    const resultado = await registarUsuario(dados)
    saveSession(resultado.usuario, resultado.token || "", "password")
  }, [saveSession])

  const recarregarUsuario = useCallback(async () => {
    if (!usuario?.userName) {
      throw new Error("Nenhum utilizador autenticado")
    }

    const usuarioAtualizado = await fetchUsuario(usuario.userName)
    setUsuario(usuarioAtualizado)
    localStorage.setItem(USER_KEY, JSON.stringify(usuarioAtualizado))
  }, [usuario?.userName])

  const logout = useCallback(() => {
    setUsuario(null)
    setAuthProvider(null)
    clearSession()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        authProvider,
        usuario,
        isLoading,
        isAuthenticated: Boolean(usuario),
        login,
        loginExterno,
        registo,
        logout,
        recarregarUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(PROVIDER_KEY)
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }

  return context
}
