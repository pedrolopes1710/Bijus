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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Smartphone, Building2, Check } from 'lucide-react'
import type { DadosEnvio, DadosPagamento } from "@/lib/types"

export default function CheckoutPage() {
  const router = useRouter()
  const { itens, totalPreco, setDadosEnvio, setDadosPagamento, limparCarrinho, isLoaded } = useCart()
  const { usuario } = useAuth()
  const [etapa, setEtapa] = useState<"envio" | "pagamento" | "confirmacao">("envio")
  const [metodoPagamento, setMetodoPagamento] = useState<"cartao" | "mbway" | "transferencia">("cartao")

  const [dadosEnvioForm, setDadosEnvioForm] = useState<DadosEnvio>({
    nome: usuario?.nome || "",
    email: usuario?.email || "",
    telefone: usuario?.telefone || "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
  })

  const [dadosPagamentoForm, setDadosPagamentoForm] = useState<DadosPagamento>({
    metodo: "cartao",
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

  if (!isLoaded) {
    return (
      <ProtectedRoute>
        <Header />
        <main className="min-h-screen bg-neutral-50 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center py-16">
              <p className="text-neutral-600">Carregando...</p>
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

  const handleEnvioSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setDadosEnvio(dadosEnvioForm)
    setEtapa("pagamento")
  }

  const handlePagamentoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setDadosPagamento({ ...dadosPagamentoForm, metodo: metodoPagamento })
    setEtapa("confirmacao")
  }

  const handleFinalizarPedido = () => {
    console.log("[v0] Finalizando pedido com dados:", {
      itens,
      dadosEnvio: dadosEnvioForm,
      dadosPagamento: { ...dadosPagamentoForm, metodo: metodoPagamento },
      total: totalPreco,
    })
    limparCarrinho()
    router.push("/pedido-confirmado")
  }

  return (
    <ProtectedRoute>
      <Header />
      <main className="min-h-screen bg-neutral-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-4xl font-bold mb-8">Finalizar Compra</h1>

          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${etapa === "envio" ? "text-neutral-900" : "text-neutral-400"}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${etapa !== "envio" ? "bg-green-600 text-white" : "bg-neutral-900 text-white"}`}
                >
                  {etapa !== "envio" ? <Check className="h-5 w-5" /> : "1"}
                </div>
                <span className="font-medium hidden sm:inline">Envio</span>
              </div>
              <div className="w-16 h-0.5 bg-neutral-300" />
              <div
                className={`flex items-center gap-2 ${etapa === "pagamento" ? "text-neutral-900" : "text-neutral-400"}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${etapa === "confirmacao" ? "bg-green-600 text-white" : etapa === "pagamento" ? "bg-neutral-900 text-white" : "bg-neutral-300"}`}
                >
                  {etapa === "confirmacao" ? <Check className="h-5 w-5" /> : "2"}
                </div>
                <span className="font-medium hidden sm:inline">Pagamento</span>
              </div>
              <div className="w-16 h-0.5 bg-neutral-300" />
              <div
                className={`flex items-center gap-2 ${etapa === "confirmacao" ? "text-neutral-900" : "text-neutral-400"}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${etapa === "confirmacao" ? "bg-neutral-900 text-white" : "bg-neutral-300"}`}
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
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input
                          id="cidade"
                          required
                          value={dadosEnvioForm.cidade}
                          onChange={(e) => setDadosEnvioForm({ ...dadosEnvioForm, cidade: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estado">Estado/Distrito</Label>
                        <Input
                          id="estado"
                          required
                          value={dadosEnvioForm.estado}
                          onChange={(e) => setDadosEnvioForm({ ...dadosEnvioForm, estado: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cep">Código Postal</Label>
                        <Input
                          id="cep"
                          required
                          value={dadosEnvioForm.cep}
                          onChange={(e) => setDadosEnvioForm({ ...dadosEnvioForm, cep: e.target.value })}
                        />
                      </div>
                    </div>

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
                    <RadioGroup value={metodoPagamento} onValueChange={(value: any) => setMetodoPagamento(value)}>
                      <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-neutral-50">
                        <RadioGroupItem value="cartao" id="cartao" />
                        <Label htmlFor="cartao" className="flex items-center gap-2 cursor-pointer flex-1">
                          <CreditCard className="h-5 w-5" />
                          <span>Cartão de Crédito/Débito</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-neutral-50">
                        <RadioGroupItem value="mbway" id="mbway" />
                        <Label htmlFor="mbway" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Smartphone className="h-5 w-5" />
                          <span>MB WAY</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-neutral-50">
                        <RadioGroupItem value="transferencia" id="transferencia" />
                        <Label htmlFor="transferencia" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Building2 className="h-5 w-5" />
                          <span>Transferência Bancária</span>
                        </Label>
                      </div>
                    </RadioGroup>

                    {metodoPagamento === "cartao" && (
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="numeroCartao">Número do Cartão</Label>
                          <Input
                            id="numeroCartao"
                            placeholder="1234 5678 9012 3456"
                            required
                            value={dadosPagamentoForm.numeroCartao}
                            onChange={(e) =>
                              setDadosPagamentoForm({ ...dadosPagamentoForm, numeroCartao: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nomeCartao">Nome no Cartão</Label>
                          <Input
                            id="nomeCartao"
                            required
                            value={dadosPagamentoForm.nomeCartao}
                            onChange={(e) =>
                              setDadosPagamentoForm({ ...dadosPagamentoForm, nomeCartao: e.target.value })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="validade">Validade</Label>
                            <Input
                              id="validade"
                              placeholder="MM/AA"
                              required
                              value={dadosPagamentoForm.validadeCartao}
                              onChange={(e) =>
                                setDadosPagamentoForm({ ...dadosPagamentoForm, validadeCartao: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              required
                              value={dadosPagamentoForm.cvv}
                              onChange={(e) => setDadosPagamentoForm({ ...dadosPagamentoForm, cvv: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {metodoPagamento === "mbway" && (
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="numeroMbway">Número de Telemóvel</Label>
                          <Input
                            id="numeroMbway"
                            placeholder="+351 912 345 678"
                            required
                            value={dadosPagamentoForm.numeroMbway}
                            onChange={(e) =>
                              setDadosPagamentoForm({ ...dadosPagamentoForm, numeroMbway: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    )}

                    {metodoPagamento === "transferencia" && (
                      <div className="bg-neutral-100 p-4 rounded-lg">
                        <p className="text-sm text-neutral-600">
                          Após confirmar o pedido, receberá os dados bancários por email para efetuar a transferência.
                        </p>
                      </div>
                    )}

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

              {etapa === "confirmacao" && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Confirmar Pedido</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Dados de Envio</h3>
                      <div className="text-sm text-neutral-600 space-y-1">
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
                      <p className="text-sm text-neutral-600">
                        {metodoPagamento === "cartao" && "Cartão de Crédito/Débito"}
                        {metodoPagamento === "mbway" && "MB WAY"}
                        {metodoPagamento === "transferencia" && "Transferência Bancária"}
                      </p>
                      <Button variant="link" className="p-0 h-auto" onClick={() => setEtapa("pagamento")}>
                        Editar
                      </Button>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Produtos</h3>
                      <div className="space-y-2">
                        {itens.map((item) => (
                          <div key={item.produto.id} className="flex justify-between text-sm">
                            <span className="text-neutral-600">
                              {item.produto.nome} x {item.quantidade}
                            </span>
                            <span className="font-medium">{(item.produto.preco * item.quantidade).toFixed(2)}€</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button size="lg" className="w-full" onClick={handleFinalizarPedido}>
                      Confirmar e Finalizar Pedido
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Resumo</h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span>{totalPreco.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Envio</span>
                    <span className="text-green-600 font-medium">Grátis</span>
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
