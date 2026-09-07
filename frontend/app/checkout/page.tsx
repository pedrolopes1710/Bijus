"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Smartphone, Check, MailWarning } from 'lucide-react'
import { criarVenda, criarVendaProduto, iniciarPagamento } from "@/lib/api"
import { StripeEmbeddedCheckout } from "@/components/stripe-embedded-checkout"
import { DISTRITOS, DISTRITOS_CONCELHOS } from "@/lib/distritos-concelhos"
import type { DadosEnvio, DadosPagamento } from "@/lib/types"

/** Formata o input para código postal português: 0000-000 */
function formatarCodigoPostal(valor: string) {
  const digitos = valor.replace(/\D/g, "").slice(0, 7)
  return digitos.length > 4 ? `${digitos.slice(0, 4)}-${digitos.slice(4)}` : digitos
}

const guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default function CheckoutPage() {
  const router = useRouter()
  const { itens, totalPreco, setDadosEnvio, setDadosPagamento, isLoaded } = useCart()
  const { usuario, contaConfirmada, reenviarConfirmacao } = useAuth()
  const [etapa, setEtapa] = useState<"envio" | "pagamento" | "confirmacao">("envio")
  const [metodoPagamento] = useState<"mbway">("mbway")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkoutError, setCheckoutError] = useState("")
  const [reenvio, setReenvio] = useState<"idle" | "loading" | "ok" | "erro">("idle")
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [envioErro, setEnvioErro] = useState("")

  const [dadosEnvioForm, setDadosEnvioForm] = useState<DadosEnvio>({
    nome: usuario?.clienteDto?.nome || "",
    email: usuario?.clienteDto?.email || "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
  })

  const [dadosPagamentoForm, setDadosPagamentoForm] = useState<DadosPagamento>({
    metodo: "mbway",
    numeroCartao: "",
    nomeCartao: "",
    validadeCartao: "",
    cvv: "",
    numeroMbway: "",
  })

  useEffect(() => {
    if (isLoaded && itens.length === 0) {
      router.push("/carrinho")
    }
  }, [itens.length, isLoaded, router])

  useEffect(() => {
    if (!usuario?.clienteDto) return

    setDadosEnvioForm((current) => ({
      ...current,
      nome: current.nome || usuario.clienteDto.nome || "",
      email: current.email || usuario.clienteDto.email || "",
      endereco: current.endereco || usuario.clienteDto.morada || "",
    }))
  }, [usuario])

  if (!isLoaded) {
    return (
      <ProtectedRoute>
        <Header />
        <main className="min-h-screen bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center py-16">
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          </div>
        </main>
        <Footer />
      </ProtectedRoute>
    )
  }

  if (itens.length === 0) {
    return null
  }

  // Conta por confirmar: bloquear a finalização da compra até confirmar o email.
  if (!contaConfirmada) {
    const handleReenviar = async () => {
      setReenvio("loading")
      try {
        await reenviarConfirmacao()
        setReenvio("ok")
      } catch {
        setReenvio("erro")
      }
    }

    return (
      <ProtectedRoute>
        <Header />
        <main className="min-h-screen bg-muted/30 py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="p-8 text-center">
              <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-accent/15 text-accent">
                <MailWarning className="h-8 w-8" />
              </span>
              <h1 className="font-display text-3xl font-semibold tracking-[-0.02em]">Confirma a tua conta</h1>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                Para finalizar a compra precisas de confirmar o teu email. Enviámos um link
                {usuario?.clienteDto?.email ? <> para <strong>{usuario.clienteDto.email}</strong></> : null}. Verifica
                também a pasta de spam.
              </p>

              {reenvio === "ok" && (
                <p className="mt-5 rounded-md border border-accent/30 bg-accent/10 p-3 text-sm text-foreground">
                  Email reenviado. Verifica a tua caixa de entrada e clica no link.
                </p>
              )}
              {reenvio === "erro" && (
                <p className="mt-5 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  Não foi possível reenviar agora. Tenta novamente daqui a pouco.
                </p>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button onClick={handleReenviar} disabled={reenvio === "loading"}>
                  {reenvio === "loading" ? "A reenviar…" : "Reenviar email de confirmação"}
                </Button>
                <Button variant="outline" onClick={() => router.push("/carrinho")}>
                  Voltar ao carrinho
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Já confirmaste?{" "}
                <button className="font-medium text-primary hover:underline" onClick={() => window.location.reload()}>
                  Atualizar
                </button>{" "}
                depois de iniciares sessão novamente.
              </p>
            </Card>
          </div>
        </main>
        <Footer />
      </ProtectedRoute>
    )
  }

  const concelhosDisponiveis = dadosEnvioForm.estado ? DISTRITOS_CONCELHOS[dadosEnvioForm.estado] ?? [] : []

  const handleEnvioSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEnvioErro("")

    if (!dadosEnvioForm.estado) {
      setEnvioErro("Selecione o distrito.")
      return
    }
    if (!dadosEnvioForm.cidade) {
      setEnvioErro("Selecione o concelho.")
      return
    }
    if (!/^\d{4}-\d{3}$/.test(dadosEnvioForm.cep)) {
      setEnvioErro("Código postal inválido. Use o formato 0000-000.")
      return
    }

    setDadosEnvio(dadosEnvioForm)
    setEtapa("pagamento")
  }

  const handlePagamentoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setDadosPagamento({ ...dadosPagamentoForm, metodo: metodoPagamento })
    setEtapa("confirmacao")
  }

  const handleFinalizarPedido = async () => {
    setIsSubmitting(true)
    setCheckoutError("")

    try {
      const clienteId = usuario?.clienteDto?.id

      if (!clienteId || !guidPattern.test(clienteId)) {
        throw new Error("A conta ainda nao tem um cliente valido associado para criar encomendas.")
      }

      const venda = await criarVenda({
        clienteId,
        estado: "pendente",
        total: totalPreco,
      })

      // Cria as linhas da venda. O backend decrementa o stock de cada produto automaticamente.
      await Promise.all(
        itens.map((item) =>
          criarVendaProduto({
            precoUnitario: item.precoUnitario ?? item.produto.preco,
            produtoId: item.produto.id,
            quantidade: item.quantidade,
            vendaId: venda.id,
            detalhesVariante: item.variante ? JSON.stringify(item.variante.valores) : undefined,
          }),
        ),
      )

      sessionStorage.setItem(
        "ultimo_pedido",
        JSON.stringify({
          data: venda.vendaData,
          estado: venda.vendaEstado,
          id: venda.id,
          itens: itens.map((item) => ({
            id: item.produto.id,
            nome: item.produto.nome,
            preco: item.precoUnitario ?? item.produto.preco,
            quantidade: item.quantidade,
            variante: item.variante?.valores,
          })),
          metodoPagamento,
          total: totalPreco,
        }),
      )
      const checkout = await iniciarPagamento(venda.id)
      if (checkout.clientSecret) {
        // Embedded Checkout: mostra o formulário da Stripe dentro desta página.
        setClientSecret(checkout.clientSecret)
      } else if (checkout.url) {
        // Fallback (caso o embedded não esteja disponível): redireciona.
        window.location.assign(checkout.url)
      } else {
        throw new Error("Nao foi possivel iniciar o pagamento.")
      }
    } catch (err: any) {
      setCheckoutError(err.message || "Nao foi possivel criar a encomenda.")
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute>
      <Header />
      <main className="min-h-screen bg-muted/30 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="mb-8 font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">Finalizar compra</h1>

          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${etapa === "envio" ? "text-foreground" : "text-muted-foreground"}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${etapa !== "envio" ? "bg-accent text-white" : "bg-foreground text-white"}`}
                >
                  {etapa !== "envio" ? <Check className="h-5 w-5" /> : "1"}
                </div>
                <span className="font-medium hidden sm:inline">Envio</span>
              </div>
              <div className="w-16 h-0.5 bg-border" />
              <div
                className={`flex items-center gap-2 ${etapa === "pagamento" ? "text-foreground" : "text-muted-foreground"}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${etapa === "confirmacao" ? "bg-accent text-white" : etapa === "pagamento" ? "bg-foreground text-white" : "bg-border"}`}
                >
                  {etapa === "confirmacao" ? <Check className="h-5 w-5" /> : "2"}
                </div>
                <span className="font-medium hidden sm:inline">Pagamento</span>
              </div>
              <div className="w-16 h-0.5 bg-border" />
              <div
                className={`flex items-center gap-2 ${etapa === "confirmacao" ? "text-foreground" : "text-muted-foreground"}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${etapa === "confirmacao" ? "bg-foreground text-white" : "bg-border"}`}
                >
                  3
                </div>
                <span className="font-medium hidden sm:inline">Confirmação</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {etapa === "envio" && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Dados de Envio</h2>
                  <form onSubmit={handleEnvioSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo</Label>
                        <Input
                          id="nome"
                          required
                          value={dadosEnvioForm.nome}
                          onChange={(e) => setDadosEnvioForm({ ...dadosEnvioForm, nome: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={dadosEnvioForm.email}
                          onChange={(e) => setDadosEnvioForm({ ...dadosEnvioForm, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        type="tel"
                        required
                        value={dadosEnvioForm.telefone}
                        onChange={(e) => setDadosEnvioForm({ ...dadosEnvioForm, telefone: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input
                        id="endereco"
                        required
                        value={dadosEnvioForm.endereco}
                        onChange={(e) => setDadosEnvioForm({ ...dadosEnvioForm, endereco: e.target.value })}
                      />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="distrito">Distrito</Label>
                        <select
                          id="distrito"
                          required
                          value={dadosEnvioForm.estado}
                          onChange={(e) =>
                            setDadosEnvioForm({ ...dadosEnvioForm, estado: e.target.value, cidade: "" })
                          }
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="" disabled>
                            Selecione…
                          </option>
                          {DISTRITOS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="concelho">Concelho</Label>
                        <select
                          id="concelho"
                          required
                          disabled={!dadosEnvioForm.estado}
                          value={dadosEnvioForm.cidade}
                          onChange={(e) => setDadosEnvioForm({ ...dadosEnvioForm, cidade: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="" disabled>
                            {dadosEnvioForm.estado ? "Selecione…" : "Escolha o distrito primeiro"}
                          </option>
                          {concelhosDisponiveis.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cep">Código Postal</Label>
                        <Input
                          id="cep"
                          required
                          inputMode="numeric"
                          placeholder="0000-000"
                          pattern="\d{4}-\d{3}"
                          title="Formato: 0000-000"
                          maxLength={8}
                          value={dadosEnvioForm.cep}
                          onChange={(e) =>
                            setDadosEnvioForm({ ...dadosEnvioForm, cep: formatarCodigoPostal(e.target.value) })
                          }
                        />
                      </div>
                    </div>

                    {envioErro && (
                      <p className="text-sm font-medium text-destructive">{envioErro}</p>
                    )}

                    <Button type="submit" size="lg" className="w-full">
                      Continuar para Pagamento
                    </Button>
                  </form>
                </Card>
              )}

              {etapa === "pagamento" && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Método de Pagamento</h2>
                  <form onSubmit={handlePagamentoSubmit} className="space-y-6">
                    <div className="flex items-start gap-3 border rounded-lg p-4">
                      <Smartphone className="mt-0.5 h-5 w-5 text-accent" />
                      <div>
                        <p className="font-medium">Pagamento seguro via Stripe</p>
                        <p className="text-sm text-muted-foreground">
                          MB WAY, Multibanco, cartão e outros métodos disponíveis.
                        </p>
                      </div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Será encaminhado para a página segura da Stripe, onde escolhe o método que preferir e confirma o pagamento.
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="flex-1 bg-transparent"
                        onClick={() => setEtapa("envio")}
                      >
                        Voltar
                      </Button>
                      <Button type="submit" size="lg" className="flex-1">
                        Continuar
                      </Button>
                    </div>
                  </form>
                </Card>
              )}

              {etapa === "confirmacao" && clientSecret && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Pagamento</h2>
                  <StripeEmbeddedCheckout clientSecret={clientSecret} />
                </Card>
              )}

              {etapa === "confirmacao" && !clientSecret && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Confirmar Pedido</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Dados de Envio</h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{dadosEnvioForm.nome}</p>
                        <p>{dadosEnvioForm.email}</p>
                        <p>{dadosEnvioForm.telefone}</p>
                        <p>{dadosEnvioForm.endereco}</p>
                        <p>
                          {dadosEnvioForm.cidade}, {dadosEnvioForm.estado} {dadosEnvioForm.cep}
                        </p>
                      </div>
                      <Button variant="link" className="p-0 h-auto" onClick={() => setEtapa("envio")}>
                        Editar
                      </Button>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Método de Pagamento</h3>
                      <p className="text-sm text-muted-foreground">Pagamento seguro via Stripe (MB WAY, Multibanco, cartão e mais)</p>
                      <Button variant="link" className="p-0 h-auto" onClick={() => setEtapa("pagamento")}>
                        Editar
                      </Button>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Produtos</h3>
                      <div className="space-y-2">
                        {itens.map((item) => (
                          <div key={item.chave || item.produto.id} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {item.produto.nome} x {item.quantidade}
                            </span>
                            <span className="font-medium">{(item.produto.preco * item.quantidade).toFixed(2)}€</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {checkoutError && (
                      <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                        {checkoutError}
                      </div>
                    )}

                    <Button size="lg" className="w-full" onClick={handleFinalizarPedido} disabled={isSubmitting}>
                      {isSubmitting ? "A iniciar pagamento..." : "Ir para pagamento seguro"}
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Resumo</h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{totalPreco.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Envio</span>
                    <span className="text-accent font-medium">Grátis</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>{totalPreco.toFixed(2)}€</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </ProtectedRoute>
  )
}
