"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { reenviarConfirmacao } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, MailCheck, Loader2, XCircle } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

type Estado = "pendente" | "a-confirmar" | "sucesso" | "erro"

function ConfirmarContaInner() {
  const router = useRouter()
  const params = useSearchParams()
  const { confirmarConta } = useAuth()

  const token = params.get("token")
  const emailParam = params.get("email") || ""

  const [estado, setEstado] = useState<Estado>(token ? "a-confirmar" : "pendente")
  const [mensagem, setMensagem] = useState("")
  const [reenvioEstado, setReenvioEstado] = useState<"idle" | "loading" | "ok" | "erro">("idle")
  const tentou = useRef(false)

  useEffect(() => {
    if (!token || tentou.current) return
    tentou.current = true
    ;(async () => {
      try {
        await confirmarConta(token)
        setEstado("sucesso")
      } catch (error) {
        setEstado("erro")
        setMensagem(error instanceof Error ? error.message : "Não foi possível confirmar a conta.")
      }
    })()
  }, [token, confirmarConta])

  const handleReenviar = async () => {
    if (!emailParam) return
    setReenvioEstado("loading")
    try {
      await reenviarConfirmacao(emailParam)
      setReenvioEstado("ok")
    } catch {
      setReenvioEstado("erro")
    }
  }

  return (
    <main className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-md mx-auto">
        <Card>
          {estado === "a-confirmar" && (
            <>
              <CardHeader className="items-center text-center">
                <Loader2 className="h-12 w-12 animate-spin text-accent" />
                <CardTitle className="mt-4 text-2xl">A confirmar a tua conta…</CardTitle>
                <CardDescription>Só um momento.</CardDescription>
              </CardHeader>
            </>
          )}

          {estado === "sucesso" && (
            <>
              <CardHeader className="items-center text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-accent/15 text-accent">
                  <CheckCircle2 className="h-8 w-8" />
                </span>
                <CardTitle className="mt-4 text-2xl">Conta confirmada!</CardTitle>
                <CardDescription>
                  A tua conta está ativa. Já podes finalizar as tuas compras.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => router.push("/carrinho")}>
                  Ir para o carrinho
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push("/catalogo")}>
                  Continuar a ver produtos
                </Button>
              </CardContent>
            </>
          )}

          {estado === "erro" && (
            <>
              <CardHeader className="items-center text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-destructive/15 text-destructive">
                  <XCircle className="h-8 w-8" />
                </span>
                <CardTitle className="mt-4 text-2xl">Não foi possível confirmar</CardTitle>
                <CardDescription>{mensagem}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  O link pode ter expirado. Inicia sessão e pede um novo email de confirmação a partir do teu perfil,
                  ou tenta novamente.
                </p>
                <Button className="w-full" onClick={() => router.push("/login")}>
                  Ir para o login
                </Button>
              </CardContent>
            </>
          )}

          {estado === "pendente" && (
            <>
              <CardHeader className="items-center text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-accent/15 text-accent">
                  <MailCheck className="h-8 w-8" />
                </span>
                <CardTitle className="mt-4 text-2xl">Confirma o teu email</CardTitle>
                <CardDescription>
                  Enviámos um email de confirmação{emailParam ? <> para <strong>{emailParam}</strong></> : null}. Clica
                  no link para ativar a conta e poderes finalizar compras.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Não recebeste? Verifica a pasta de spam ou reenvia o email.
                </p>

                {reenvioEstado === "ok" && (
                  <Alert>
                    <AlertDescription>Email reenviado. Verifica a tua caixa de entrada.</AlertDescription>
                  </Alert>
                )}
                {reenvioEstado === "erro" && (
                  <Alert variant="destructive">
                    <AlertDescription>Não foi possível reenviar. Tenta novamente daqui a pouco.</AlertDescription>
                  </Alert>
                )}

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleReenviar}
                  disabled={!emailParam || reenvioEstado === "loading"}
                >
                  {reenvioEstado === "loading" ? "A reenviar…" : "Reenviar email de confirmação"}
                </Button>

                <div className="text-center text-sm">
                  <Link href="/" className="text-primary hover:underline font-medium">
                    Voltar ao início
                  </Link>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </main>
  )
}

export default function ConfirmarContaPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <main className="min-h-screen bg-background py-16 px-4">
            <div className="max-w-md mx-auto flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </main>
        }
      >
        <ConfirmarContaInner />
      </Suspense>
      <Footer />
    </>
  )
}
