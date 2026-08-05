"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string | string[]
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading, usuario } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const currentPath = `${window.location.pathname}${window.location.search}`
      const loginPath = window.location.pathname.startsWith("/backoffice") ? "/backoffice/login" : "/login"
      router.push(`${loginPath}?redirect=${encodeURIComponent(currentPath)}`)
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-muted-foreground">A verificar autenticação...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const requiredRoles = requiredRole ? (Array.isArray(requiredRole) ? requiredRole : [requiredRole]) : []
  const hasRequiredRole = requiredRoles.length === 0 || requiredRoles.some((role) => role.toLowerCase() === usuario?.role?.toLowerCase())

  if (!hasRequiredRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md rounded-md border bg-card p-6 text-center shadow-sm">
          <h1 className="text-xl font-semibold">Sem permissao</h1>
          <p className="mt-2 text-sm text-muted-foreground">Esta area esta reservada a utilizadores com permissao de backoffice.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
