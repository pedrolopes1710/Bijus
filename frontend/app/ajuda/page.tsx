import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, MapPin, Phone, RefreshCw, Ruler, ShieldCheck, Sparkles } from "lucide-react"

export const metadata = {
  title: "Ajuda & Informações — Biscuit&Arte",
  description: "Trocas e devoluções, guia de tamanhos, cuidados, garantia, privacidade e termos.",
}

const SECOES = [
  {
    id: "trocas",
    icon: RefreshCw,
    titulo: "Trocas e devoluções",
    corpo: [
      "Aceitamos trocas e devoluções até 14 dias após a receção, desde que a peça esteja intacta e na embalagem original.",
      "Por serem feitas à mão, as peças personalizadas ou por encomenda não são elegíveis para devolução, salvo defeito de fabrico.",
      "Para iniciar uma troca, contacte-nos por email com o número da encomenda.",
    ],
  },
  {
    id: "tamanhos",
    icon: Ruler,
    titulo: "Guia de tamanhos",
    corpo: [
      "Cada peça em biscuit indica as dimensões aproximadas (altura × largura) na respetiva página de produto.",
      "As figuras são modeladas à mão, pelo que podem existir variações mínimas de milímetros entre exemplares.",
      "Se precisar de uma dimensão específica, fale connosco antes de comprar — muitas peças podem ser adaptadas.",
    ],
  },
  {
    id: "cuidados",
    icon: Sparkles,
    titulo: "Cuidados",
    corpo: [
      "As peças em biscuit são delicadas: evite quedas, humidade excessiva e exposição prolongada ao sol direto.",
      "Limpe apenas com um pano seco e macio. Não utilize água nem produtos de limpeza.",
      "Guarde em local seco e arejado para preservar as cores e o acabamento.",
    ],
  },
  {
    id: "garantia",
    icon: ShieldCheck,
    titulo: "Garantia",
    corpo: [
      "Todas as peças têm garantia contra defeitos de fabrico. Se algo não estiver bem, resolvemos.",
      "Danos resultantes de uso indevido, quedas ou desgaste natural não estão cobertos.",
    ],
  },
  {
    id: "privacidade",
    icon: ShieldCheck,
    titulo: "Privacidade",
    corpo: [
      "Recolhemos apenas os dados necessários para processar encomendas e comunicar consigo (nome, contacto, morada e email).",
      "Não partilhamos os seus dados com terceiros para fins de marketing.",
      "Pode pedir a consulta, correção ou eliminação dos seus dados a qualquer momento através do nosso email.",
    ],
  },
  {
    id: "termos",
    icon: RefreshCw,
    titulo: "Termos e condições",
    corpo: [
      "Ao efetuar uma compra concorda com os prazos de produção e envio indicados em cada peça.",
      "Os preços incluem IVA à taxa em vigor. O envio é calculado no checkout.",
      "As imagens são ilustrativas; por serem artesanais, podem existir ligeiras variações face ao produto final.",
    ],
  },
]

export default function AjudaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 sm:py-16">
        <header className="mx-auto max-w-2xl text-center">
          <span className="eyebrow mx-auto mb-5 text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            Ajuda &amp; Informações
          </span>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl">
            Tudo o que precisa de saber
          </h1>
          <p className="mt-4 text-muted-foreground">
            Trocas, cuidados, garantia e as políticas da loja — reunidas num só sítio.
          </p>
        </header>

        <div className="mx-auto mt-12 grid max-w-3xl gap-6">
          {SECOES.map((secao) => {
            const Icon = secao.icon
            return (
              <section
                key={secao.id}
                id={secao.id}
                className="scroll-mt-28 rounded-2xl border border-foreground/[0.08] bg-card p-6 shadow-soft sm:p-8"
              >
                <h2 className="flex items-center gap-3 font-display text-2xl font-semibold tracking-tight">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  {secao.titulo}
                </h2>
                <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                  {secao.corpo.map((paragrafo, i) => (
                    <p key={i}>{paragrafo}</p>
                  ))}
                </div>
              </section>
            )
          })}

          <section
            id="contacto"
            className="scroll-mt-28 rounded-2xl border border-foreground/[0.08] bg-foreground p-6 text-background shadow-soft sm:p-8"
          >
            <h2 className="font-display text-2xl font-semibold tracking-tight">Ainda com dúvidas?</h2>
            <p className="mt-3 text-sm text-background/70">Fale connosco — respondemos rapidamente.</p>
            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
              <a href="mailto:info@biscuitarte.pt" className="inline-flex items-center gap-2 text-background/85 hover:text-background">
                <Mail className="h-4 w-4 text-accent" />
                info@biscuitarte.pt
              </a>
              <span className="inline-flex items-center gap-2 text-background/85">
                <Phone className="h-4 w-4 text-accent" />
                +351 21 123 4567
              </span>
              <span className="inline-flex items-center gap-2 text-background/85">
                <MapPin className="h-4 w-4 text-accent" />
                Lisboa, Portugal
              </span>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
