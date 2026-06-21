"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { beginSocialLogin, isSocialLoginConfigured, type SocialProvider } from "@/lib/social-auth"

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, login } = useAuth()
  const [userOrEmail, setUserOrEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null)
  const [redirectTo, setRedirectTo] = useState("/perfil")
  const [isRedirectReady, setIsRedirectReady] = useState(false)
  const socialConfigured = isSocialLoginConfigured()

  useEffect(() => {
    const redirect = new URLSearchParams(window.location.search).get("redirect")

    if (redirect?.startsWith("/") && !redirect.startsWith("//") && !redirect.startsWith("/login")) {
      setRedirectTo(redirect)
    }

    setIsRedirectReady(true)
  }, [])

  useEffect(() => {
    if (isRedirectReady && !authLoading && isAuthenticated) {
      router.replace(redirectTo)
    }
  }, [authLoading, isAuthenticated, isRedirectReady, redirectTo, router])

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setErro("")
    setIsLoading(true)

    try {
      if (!userOrEmail.trim() || !password.trim()) {
        throw new Error("Preencha o email/utilizador e a password.")
      }

      await login({
        username: userOrEmail.trim(),
        password,
      })

      router.push(redirectTo)
    } catch (error: any) {
      setErro(error.message || "Não foi possível iniciar sessão. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: SocialProvider) => {
    setErro("")
    setSocialLoading(provider)

    try {
      await beginSocialLogin(provider, redirectTo)
    } catch (error: any) {
      setErro(error.message || "Não foi possível iniciar o login social.")
      setSocialLoading(null)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
        <section className="hidden bg-foreground text-background lg:flex lg:flex-col lg:justify-between">
          <div className="p-10">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-background/80 hover:text-background">
              <ArrowLeft className="h-4 w-4" />
              Voltar à loja
            </Link>
          </div>

          <div className="px-10 pb-14">
            <div className="mb-10 inline-flex h-14 w-14 items-center justify-center rounded-full bg-background text-foreground">
              <Sparkles className="h-7 w-7" />
            </div>
            <h1 className="max-w-xl text-5xl font-bold leading-tight">Biscuit&Arte</h1>
            <p className="mt-5 max-w-md text-lg leading-8 text-background/72">
              Aceda à sua conta para guardar favoritos, acompanhar encomendas e terminar compras com mais rapidez.
            </p>
            <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-3">
              <TrustItem title="Conta segura" />
              <TrustItem title="Checkout rápido" />
              <TrustItem title="Favoritos guardados" />
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Voltar à loja
              </Link>
            </div>

            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-wide text-accent">Área de cliente</p>
              <h2 className="mt-2 text-3xl font-bold">Iniciar sessão</h2>
              <p className="mt-2 text-muted-foreground">Entre com a sua conta ou use um fornecedor externo.</p>
            </div>

            {erro && (
              <div className="mb-5 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {erro}
              </div>
            )}

            {socialConfigured && (
              <>
                <div className="grid gap-3">
                  <SocialButton
                    disabled={Boolean(socialLoading) || isLoading}
                    isLoading={socialLoading === "google"}
                    label="Continuar com Google"
                    provider="google"
                    onClick={handleSocialLogin}
                  />
                  <SocialButton
                    disabled={Boolean(socialLoading) || isLoading}
                    isLoading={socialLoading === "facebook"}
                    label="Continuar com Facebook"
                    provider="facebook"
                    onClick={handleSocialLogin}
                  />
                </div>

                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">ou</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              </>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="userOrEmail" className="text-sm font-medium">
                  Email ou nome de utilizador
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="userOrEmail"
                    type="text"
                    autoComplete="username"
                    placeholder="nome@email.com"
                    value={userOrEmail}
                    onChange={(event) => setUserOrEmail(event.target.value)}
                    disabled={isLoading || Boolean(socialLoading)}
                    className="h-11 pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={mostrarSenha ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="A sua password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={isLoading || Boolean(socialLoading)}
                    className="h-11 pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isLoading || Boolean(socialLoading)}
                    aria-label={mostrarSenha ? "Esconder password" : "Mostrar password"}
                  >
                    {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="h-11 w-full" disabled={isLoading || Boolean(socialLoading)}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    A iniciar sessão...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <p className="mt-7 text-center text-sm text-muted-foreground">
              Ainda não tem conta?{" "}
              <Link href="/registo" className="font-medium text-accent hover:underline">
                Criar conta
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

function TrustItem({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-background/15 px-3 py-2 text-sm text-background/85">
      <ShieldCheck className="h-4 w-4" />
      {title}
    </div>
  )
}

function SocialButton({
  disabled,
  isLoading,
  label,
  provider,
  onClick,
}: {
  disabled: boolean
  isLoading: boolean
  label: string
  provider: SocialProvider
  onClick: (provider: SocialProvider) => void
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-11 justify-center gap-3 bg-background"
      disabled={disabled}
      onClick={() => onClick(provider)}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ProviderIcon provider={provider} />}
      {label}
    </Button>
  )
}

function ProviderIcon({ provider }: { provider: SocialProvider }) {
  if (provider === "facebook") {
    return <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#1877F2] text-sm font-bold text-white">f</span>
  }

  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  )
}
