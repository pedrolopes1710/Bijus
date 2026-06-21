import { Facebook, Instagram, Mail, MapPin, Phone, ShieldCheck, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const STORE_NAME = "Biscuit&Arte"

export function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-background">
      <div className="container mx-auto px-4 py-12 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-foreground text-sm font-black text-background">
                B
              </span>
              <span className="text-xl font-black tracking-tight">{STORE_NAME}</span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Uma loja online com curadoria, detalhes claros e uma experiência visual pensada para transformar descoberta
              em compra.
            </p>
            <div className="mt-5 flex gap-2">
              <Button variant="outline" size="icon" className="rounded-md" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-md" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-md" aria-label="Email">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <FooterColumn
            title="Comprar"
            links={[
              { href: "/catalogo", label: "Catálogo" },
              { href: "/categorias", label: "Categorias" },
              { href: "/colecoes", label: "Coleções" },
              { href: "/favoritos", label: "Favoritos" },
            ]}
          />

          <FooterColumn
            title="Apoio"
            links={[
              { href: "#", label: "Trocas e devoluções" },
              { href: "#", label: "Guia de tamanhos" },
              { href: "#", label: "Cuidados" },
              { href: "#", label: "Garantia" },
            ]}
          />

          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em]">Contacto</h4>
            <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
              <span className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-accent" />
                Lisboa, Portugal
              </span>
              <span className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-accent" />
                +351 21 123 4567
              </span>
              <span className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-accent" />
                info@biscuitarte.pt
              </span>
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
            <a href="#" className="hover:text-foreground">
              Privacidade
            </a>
            <a href="#" className="hover:text-foreground">
              Termos
            </a>
          </div>
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
