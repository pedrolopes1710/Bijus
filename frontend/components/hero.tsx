import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-muted/30 to-background py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                Joias Únicas para
                <span className="text-accent block">Momentos Especiais</span>
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-md">
                Descubra nossa coleção exclusiva de joias e bijuterias artesanais, criadas com paixão e dedicação para
                realçar sua beleza natural.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Ver Coleção
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
              >
                Sobre Nós
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted/50">
              <img
                src="/elegant-jewelry-collection-display-with-rings-neck.jpg"
                alt="Coleção de joias elegantes"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card border rounded-xl p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="text-accent font-bold">✨</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Qualidade Premium</p>
                  <p className="text-xs text-muted-foreground">Materiais selecionados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
