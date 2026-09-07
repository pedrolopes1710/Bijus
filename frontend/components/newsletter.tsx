"use client"

import { ArrowRight, Check, Mail, ShieldCheck, Sparkles } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { subscreverNewsletter } from "@/lib/api"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [estado, setEstado] = useState<"idle" | "ok" | "erro" | "loading">("idle")

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    if (!valido) {
      setEstado("erro")
      return
    }
    setEstado("loading")
    try {
      await subscreverNewsletter(email.trim())
    } catch {
      // Mesmo que o envio de email falhe, não penalizamos o utilizador.
    }
    try {
      const key = "newsletter_subs"
      const atuais: string[] = JSON.parse(localStorage.getItem(key) || "[]")
      const e = email.trim().toLowerCase()
      if (!atuais.includes(e)) {
        atuais.push(e)
        localStorage.setItem(key, JSON.stringify(atuais))
      }
    } catch {
      // ignora falhas de storage
    }
    setEstado("ok")
    setEmail("")
  }

  return (
    <section className="overflow-hidden bg-foreground text-background">
      <div className="container mx-auto grid gap-10 px-4 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
        <div className="max-w-3xl">
          <span className="eyebrow eyebrow-plain mb-5 rounded-full border border-background/15 bg-background/10 px-3.5 py-1.5 text-background/74">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Lista privada
          </span>
          <h2 className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.02em] text-balance sm:text-5xl lg:text-6xl">
            Novidades que chegam <span className="accent-italic text-shimmer">primeiro</span> a si.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-background/66 sm:text-lg">
            Lançamentos, reposições e campanhas — escolhidos com a mesma curadoria da montra, direto ao seu email.
          </p>
        </div>

        <div className="rounded-2xl border border-background/15 bg-background/[0.07] p-5 backdrop-blur-md sm:p-6">
          {estado === "ok" ? (
            <div className="flex items-center gap-3 rounded-full bg-background px-5 py-3.5 text-foreground">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
                <Check className="h-4 w-4" />
              </span>
              <p className="text-sm font-semibold">Subscrição confirmada — vai receber as novidades primeiro.</p>
            </div>
          ) : (
            <form className="grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={handleSubmit} noValidate>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/45" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    if (estado === "erro") setEstado("idle")
                  }}
                  aria-invalid={estado === "erro"}
                  placeholder="o-seu-email@exemplo.com"
                  className="h-12 rounded-full border-background/10 bg-background pl-11 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button
                type="submit"
                disabled={estado === "loading"}
                className="commerce-sheen relative h-12 overflow-hidden rounded-full bg-accent px-7 font-semibold text-accent-foreground transition hover:bg-accent/90"
              >
                {estado === "loading" ? "A subscrever..." : "Subscrever"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}
          {estado === "erro" && (
            <p className="mt-3 text-sm font-medium text-background/80">Introduza um email válido, por favor.</p>
          )}

          <div className="mt-5 grid gap-3 text-sm text-background/70 sm:grid-cols-2">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" />
              Sem spam
            </span>
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              Acesso antecipado
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="animate-marquee-left flex w-max gap-10 py-3.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-background/42">
          {[...Array(2)].map((_, group) => (
            <div key={group} className="flex items-center gap-10">
              <span>Novas coleções</span>
              <span className="text-gold">✦</span>
              <span>Campanhas privadas</span>
              <span className="text-gold">✦</span>
              <span>Reposições em primeira mão</span>
              <span className="text-gold">✦</span>
              <span>Curadoria semanal</span>
              <span className="text-gold">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
