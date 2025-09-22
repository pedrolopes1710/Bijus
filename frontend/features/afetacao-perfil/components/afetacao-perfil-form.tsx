"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { createAfetacaoPerfil, updateAfetacaoPerfil, fetchPessoas, fetchPerfis } from "../api"
import type { CreateAfetacaoPerfilDto, UpdateAfetacaoPerfilDto, AfetacaoPerfil, Pessoa, Perfil } from "../types"
import { Loader2 } from "lucide-react"

interface AfetacaoPerfilFormProps {
  afetacao?: AfetacaoPerfil
  onSuccess: () => void
  onCancel: () => void
}

export function AfetacaoPerfilForm({ afetacao, onSuccess, onCancel }: AfetacaoPerfilFormProps) {
  const [duracaoMes, setDuracaoMes] = useState(afetacao?.duracaoMes || 1)
  const [pMsAprovados, setPMsAprovados] = useState(afetacao?.pMsAprovados || 0)
  const [perfilId, setPerfilId] = useState(afetacao?.perfilDto.id || "")
  const [pessoaId, setPessoaId] = useState(afetacao?.pessoaDto.id || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados para as listas
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [perfis, setPerfis] = useState<Perfil[]>([])
  const [loadingPessoas, setLoadingPessoas] = useState(false)
  const [loadingPerfis, setLoadingPerfis] = useState(false)

  const isEditing = !!afetacao

  // Carregar pessoas e perfis
  useEffect(() => {
    async function loadData() {
      try {
        // Carregar pessoas
        setLoadingPessoas(true)
        const pessoasData = await fetchPessoas()
        setPessoas(pessoasData)
        setLoadingPessoas(false)

        // Carregar perfis
        setLoadingPerfis(true)
        const perfisData = await fetchPerfis()
        setPerfis(perfisData)
        setLoadingPerfis(false)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar as pessoas ou perfis.",
        })
      }
    }

    loadData()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Validações
    if (!perfilId) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, selecione um perfil.",
      })
      return
    }

    if (!pessoaId && !isEditing) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, selecione uma pessoa.",
      })
      return
    }

    if (duracaoMes <= 0) {
      toast({
        variant: "destructive",
        title: "Valor inválido",
        description: "A duração em meses deve ser maior que zero.",
      })
      return
    }

    if (pMsAprovados <= 0) {
      toast({
        variant: "destructive",
        title: "Valor inválido",
        description: "Os PMs aprovados devem ser maior que zero.",
      })
      return
    }

    try {
      setIsSubmitting(true)

      if (isEditing) {
        const updateData: UpdateAfetacaoPerfilDto = {
          id: afetacao.id,
          duracaoMes,
          pMsAprovados,
          perfilId,
          pessoaId, // Mantemos no tipo, mas a API não usa no PUT
        }
        await updateAfetacaoPerfil(updateData)
        toast({
          title: "Afetação atualizada com sucesso!",
          description: "A afetação de perfil foi atualizada.",
        })
      } else {
        const createData: CreateAfetacaoPerfilDto = {
          duracaoMes,
          pMsAprovados,
          perfilId,
          pessoaId,
        }
        await createAfetacaoPerfil(createData)
        toast({
          title: "Afetação criada com sucesso!",
          description: "A nova afetação de perfil foi criada.",
        })
      }

      onSuccess()
    } catch (error) {
      console.error("Erro ao salvar afetação:", error)
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao salvar a afetação.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Afetação de Perfil" : "Nova Afetação de Perfil"}</CardTitle>
        <CardDescription>
          {isEditing ? "Atualize os dados da afetação de perfil" : "Preencha os dados para criar uma nova afetação"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pessoa">Pessoa *</Label>
              {isEditing ? (
                <div className="p-2 bg-muted rounded-md">
                  <div className="font-medium">{afetacao?.pessoaDto.nome}</div>
                  <div className="text-sm text-muted-foreground">{afetacao?.pessoaDto.email}</div>
                </div>
              ) : (
                <Select value={pessoaId} onValueChange={setPessoaId} disabled={loadingPessoas}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingPessoas ? "Carregando pessoas..." : "Selecione uma pessoa"} />
                  </SelectTrigger>
                  <SelectContent>
                    {pessoas.map((pessoa) => (
                      <SelectItem key={pessoa.id} value={pessoa.id}>
                        {pessoa.nome} ({pessoa.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {isEditing && (
                <p className="text-xs text-muted-foreground">A pessoa não pode ser alterada durante a edição</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="perfil">Perfil *</Label>
              <Select value={perfilId} onValueChange={setPerfilId} disabled={loadingPerfis}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingPerfis ? "Carregando perfis..." : "Selecione um perfil"} />
                </SelectTrigger>
                <SelectContent>
                  {perfis.map((perfil) => (
                    <SelectItem key={perfil.id} value={perfil.id}>
                      {perfil.descricao} ({perfil.pMs} PMs)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duracaoMes">Duração (meses) *</Label>
              <Input
                id="duracaoMes"
                type="number"
                min="1"
                step="1"
                value={duracaoMes}
                onChange={(e) => setDuracaoMes(Number(e.target.value))}
                placeholder="Ex: 6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pMsAprovados">PMs Aprovados *</Label>
              <Input
                id="pMsAprovados"
                type="number"
                min="0.1"
                step="0.1"
                value={pMsAprovados}
                onChange={(e) => setPMsAprovados(Number(e.target.value))}
                placeholder="Ex: 3.5"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
