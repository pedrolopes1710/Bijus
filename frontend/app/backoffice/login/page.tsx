"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"

export default function BackofficeLoginPage() {
  const router = useRouter()
  const { login, logout, usuario, isAuthenticated, isLoading: authLoading } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && isAuthenticated && ["admin", "superadmin"].includes(usuario?.role?.toLowerCase() || "")) {
      router.replace("/backoffice")
    }
  }, [authLoading, isAuthenticated, router, usuario?.role])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login({ username: username.trim(), password })
      const storedUser = JSON.parse(localStorage.getItem("auth_user") || "null")
      if (!["admin", "superadmin"].includes(storedUser?.role?.toLowerCase() || "")) {
        logout()
        throw new Error("Esta conta não tem permissão para aceder ao backoffice.")
      }
      router.replace("/backoffice")
    } catch (err: any) {
      setError(err.message || "Não foi possível iniciar sessão.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-muted/35 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border bg-background p-6 shadow-xl shadow-foreground/5 sm:p-8">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar à loja
        </Link>
        <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-md bg-foreground text-background">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-semibold">Acesso ao backoffice</h1>
        <p className="mt-2 text-sm text-muted-foreground">Gestão reservada à equipa da Biscuit&Arte.</p>

        <form onSubmit={submit} className="mt-7 grid gap-4">
          <label className="grid gap-1.5 text-sm font-medium">
            Utilizador ou email
            <Input autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Password
            <div className="relative">
              <Input className="pr-11" autoComplete="current-password" required type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} />
              <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar password" : "Mostrar password"}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </label>
          {error && <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <Button type="submit" className="mt-2" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Entrar
          </Button>
        </form>
      </section>
    </main>
  )
}
