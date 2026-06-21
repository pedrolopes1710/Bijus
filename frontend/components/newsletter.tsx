import { ArrowRight, Mail, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  return (
    <section className="overflow-hidden bg-foreground text-background">
      <div className="container mx-auto grid gap-10 px-4 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-background/15 bg-background/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-background/74">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Drop privado
          </div>
          <h2 className="text-4xl font-black leading-[0.98] tracking-normal text-balance sm:text-5xl lg:text-7xl">
            Novidades que chegam antes ao seu email.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-background/68 sm:text-lg">
            Receba lançamentos, reposições e campanhas escolhidas com a mesma curadoria da montra.
          </p>
        </div>

        <div className="rounded-lg border border-background/15 bg-background/10 p-4 backdrop-blur-md sm:p-5">
          <form className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/45" />
              <Input
                type="email"
                placeholder="o-seu-email@exemplo.com"
                className="h-12 border-background/10 bg-background pl-10 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button className="commerce-sheen relative h-12 overflow-hidden bg-accent text-accent-foreground hover:bg-accent/90">
              Receber
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

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
        <div className="animate-marquee-left flex w-max gap-8 py-3 text-[11px] font-bold uppercase tracking-[0.26em] text-background/42">
          {[...Array(2)].map((_, group) => (
            <div key={group} className="flex items-center gap-8">
              <span>Novas coleções</span>
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span>Campanhas privadas</span>
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span>Reposições em primeira mão</span>
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span>Curadoria semanal</span>
              <span className="h-1 w-1 rounded-full bg-accent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
