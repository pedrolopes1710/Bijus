import { Facebook, Instagram, Mail, MapPin, Phone, ShieldCheck, Truck } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const STORE_NAME = "Biscuit&Arte"

export function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-background">
      <div className="container mx-auto px-4 py-12 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-3">
              <span className="relative grid h-11 w-11 place-items-center rounded-full bg-foreground font-display text-lg font-semibold italic text-background">
                <span className="absolute inset-[3px] rounded-full border border-background/25" />
                B
              </span>
              <span className="font-display text-2xl font-semibold tracking-tight">{STORE_NAME}</span>
            </Link>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              Peças feitas à mão, com curadoria e detalhe. Uma experiência de compra pensada para transformar
              descoberta em desejo.
            </p>
            <div className="mt-6 flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full transition hover:border-accent/40 hover:text-accent" aria-label="Facebook" asChild>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full transition hover:border-accent/40 hover:text-accent" aria-label="Instagram" asChild>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full transition hover:border-accent/40 hover:text-accent" aria-label="Email" asChild>
                <a href="mailto:info@biscuitarte.pt">
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <FooterColumn
            title="Comprar"
            links={[
              { href: "/catalogo", label: "Cat\u00e1logo" },
              { href: "/categorias", label: "Categorias" },
              { href: "/colecoes", label: "Cole\u00e7\u00f5es" },
              { href: "/favoritos", label: "Favoritos" },
            ]}
          />

          <FooterColumn
            title="Apoio"
            links={[
              { href: "/ajuda#trocas", label: "Trocas e devoluções" },
              { href: "/ajuda#tamanhos", label: "Guia de tamanhos" },
              { href: "/ajuda#cuidados", label: "Cuidados" },
              { href: "/ajuda#garantia", label: "Garantia" },
            ]}
          />

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.26em] text-muted-foreground">Contacto</h4>
            <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
              <span className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-accent" />
                Castelo de Paiva, Portugal
              </span>
              <a href="tel:+351918172468" className="flex items-center gap-3 transition hover:text-foreground">
                <Phone className="h-4 w-4 text-accent" />
                +351 918 172 468
              </a>
              <a href="mailto:info@biscuitarte.shop" className="flex items-center gap-3 transition hover:text-foreground">
                <Mail className="h-4 w-4 text-accent" />
                info@biscuitarte.shop
              </a>
            </div>

            <div className="mt-6 grid gap-2 text-xs font-bold uppercase tracking-[0.18em] text-foreground">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" />
                Compra segura
              </span>
              <span className="inline-flex items-center gap-2">
                <Truck className="h-4 w-4 text-accent" />
                Entrega cuidada
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-foreground/10 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {STORE_NAME}. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link href="/ajuda#privacidade" className="hover:text-foreground">
              Privacidade
            </Link>
            <Link href="/ajuda#termos" className="hover:text-foreground">
              Termos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h4 className="text-[11px] font-bold uppercase tracking-[0.26em] text-muted-foreground">{title}</h4>
      <ul className="mt-4 grid gap-2 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-muted-foreground transition hover:text-foreground">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Footer
