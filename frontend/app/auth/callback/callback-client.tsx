"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { completeSocialLogin } from "@/lib/social-auth"

export function AuthCallbackClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { loginExterno } = useAuth()
  const [error, setError] = useState("")

  useEffect(() => {
    async function finishLogin() {
      const code = searchParams.get("code")
      const state = searchParams.get("state")
      const authError = searchParams.get("error_description") || searchParams.get("error")

      if (authError) {
        setError(authError)
        return
      }

      if (!code || !state) {
        setError("O pedido de autenticação não devolveu os dados necessários.")
        return
      }

      try {
        const result = await completeSocialLogin(code, state)
        loginExterno(result.usuario, result.token, result.provider)
        router.replace(result.returnTo || "/perfil")
      } catch (err: any) {
        setError(err.message || "Não foi possível concluir o login social.")
      }
    }

    finishLogin()
  }, [loginExterno, router, searchParams])

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold">Não foi possível iniciar sessão</h1>
          <p className="mt-3 text-muted-foreground">{error}</p>
          <Button asChild className="mt-6">
            <Link href="/login">Voltar ao login</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" />
        <h1 className="mt-4 text-xl font-semibold">A concluir autenticação...</h1>
        <p className="mt-2 text-sm text-muted-foreground">Estamos a validar a sua conta.</p>
      </div>
    </main>
  )
}
