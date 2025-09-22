import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export function Newsletter() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto border-0 bg-card/80 backdrop-blur">
          <CardContent className="p-8 lg:p-12">
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold">Fique por Dentro das Novidades</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Receba em primeira mão informações sobre novas coleções, promoções exclusivas e dicas de estilo
                  diretamente no seu email.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Seu melhor email"
                  className="flex-1 bg-background border-border focus:border-accent"
                />
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Inscrever-se</Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Ao inscrever-se, você concorda com nossa política de privacidade. Você pode cancelar a inscrição a
                qualquer momento.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
