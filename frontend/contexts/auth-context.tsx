"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import type { DadosLogin, DadosRegisto, Usuario } from "@/lib/types"
import { fetchUsuario, loginUsuario, registarUsuario, type UserRole } from "@/lib/api"

interface AuthContextType {
  authProvider: string | null
  usuario: Usuario | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  role: UserRole
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
const ADMIN_KEY = "auth_is_admin"
const ROLE_KEY = "auth_role"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [authProvider, setAuthProvider] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [role, setRole] = useState<UserRole>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const userStr = localStorage.getItem(USER_KEY)
    const provider = localStorage.getItem(PROVIDER_KEY)

    if (token && userStr) {
      try {
        setUsuario(JSON.parse(userStr))
        setAuthProvider(provider)
        setIsAdmin(localStorage.getItem(ADMIN_KEY) === "true")
        const savedRole = localStorage.getItem(ROLE_KEY)
        setRole(savedRole === "super_admin" || savedRole === "admin" ? savedRole : null)
      } catch (error) {
        console.error("Erro ao carregar sessão:", error)
        clearSession()
      }
    }

    setIsLoading(false)
  }, [])

  const saveSession = useCallback(
    (user: Usuario, token: string, provider: string, admin = false, userRole: UserRole = null) => {
      setUsuario(user)
      setAuthProvider(provider)
      setIsAdmin(admin)
      setRole(userRole)
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      localStorage.setItem(PROVIDER_KEY, provider)
      localStorage.setItem(ADMIN_KEY, String(admin))
      localStorage.setItem(ROLE_KEY, userRole ?? "")
    },
    [],
  )

  const login = useCallback(async (dados: DadosLogin) => {
    const resultado = await loginUsuario(dados)

    if (!resultado.usuario) {
      throw new Error("Resposta do servidor inválida")
    }

    saveSession(resultado.usuario, resultado.token || "", "password", resultado.isAdmin, resultado.role)
  }, [saveSession])

  const loginExterno = useCallback((user: Usuario, token: string, provider: string) => {
    saveSession(user, token, provider, false, null)
  }, [saveSession])

  const registo = useCallback(async (dados: DadosRegisto) => {
    const resultado = await registarUsuario(dados)
    saveSession(resultado.usuario, resultado.token || "", "password", false, null)
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
    setIsAdmin(false)
    setRole(null)
    clearSession()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        authProvider,
        usuario,
        isLoading,
        isAuthenticated: Boolean(usuario),
        isAdmin,
        isSuperAdmin: role === "super_admin",
        role,
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
  localStorage.removeItem(ADMIN_KEY)
  localStorage.removeItem(ROLE_KEY)
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }

  return context
}
