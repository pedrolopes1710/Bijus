import { Mail, MapPin, Phone, ShieldCheck, Truck } from "lucide-react"
import Link from "next/link"

const STORE_NAME = "Biscuit&Arte"

export function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-background">
      <div className="container mx-auto px-4 py-12 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-foreground text-sm font-black text-background">
                B
              </span>
              <span className="text-xl font-black tracking-tight">{STORE_NAME}</span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Uma loja online com curadoria, detalhes claros e uma experi&ecirc;ncia visual pensada para transformar descoberta
              em compra.
            </p>
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

          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em]">Contacto</h4>
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

        <div className="mt-10 border-t border-foreground/10 pt-6 text-sm text-muted-foreground">
          <p>&copy; 2026 {STORE_NAME}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-black uppercase tracking-[0.2em]">{title}</h4>
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
