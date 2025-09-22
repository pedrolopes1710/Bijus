"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createProfile } from "../api"
import type { CreateProfileDto } from "../types"
import type { TipoVinculo } from "../../tipos-vinculo/types"
import { getTiposVinculo } from "../../tipos-vinculo/api"
import { toast } from "@/components/ui/use-toast"

interface CreateProfileFormProps {
  onProfileCreated: () => void
  onCancel: () => void
}

export function CreateProfileForm({ onProfileCreated, onCancel }: CreateProfileFormProps) {
  const [pms, setPms] = useState<number>(0)
  const [descricao, setDescricao] = useState("")
  const [projetoId, setProjetoId] = useState<string>("")
  const [tipoVinculoId, setTipoVinculoId] = useState<string>("")
  const [tiposVinculo, setTiposVinculo] = useState<TipoVinculo[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingTipos, setIsLoadingTipos] = useState(true)

  // Carregar tipos de vínculo ao montar o componente
  useEffect(() => {
    async function loadTiposVinculo() {
      try {
        setIsLoadingTipos(true)
        const tipos = await getTiposVinculo()
        setTiposVinculo(tipos)
      } catch (error) {
        console.error("Erro ao carregar tipos de vínculo:", error)
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os tipos de vínculo.",
        })
      } finally {
        setIsLoadingTipos(false)
      }
    }

    loadTiposVinculo()
  }, [])

  async function handleCreateProfile() {
    // Validar campos obrigatórios
    if (!pms || pms <= 0) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, informe um valor válido para PMs.",
      })
      return
    }

    if (!descricao.trim()) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "A descrição do perfil não pode estar vazia.",
      })
      return
    }

    if (!tipoVinculoId) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, selecione um tipo de vínculo.",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const profileData: CreateProfileDto = {
        pms,
        descricao,
        projetoId: projetoId || null,
        tipoVinculoId,
      }

      await createProfile(profileData)

      toast({
        title: "Perfil criado com sucesso!",
        description: `O perfil com ${pms} PMs foi criado.`,
      })

      // Limpar formulário
      setPms(0)
      setDescricao("")
      setProjetoId("")
      setTipoVinculoId("")

      // Notificar componente pai
      onProfileCreated()
    } catch (error) {
      console.error("Erro ao criar perfil:", error)
      toast({
        variant: "destructive",
        title: "Erro ao criar perfil",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao tentar criar o perfil.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Criar Novo Perfil</CardTitle>
        <CardDescription>Preencha as informações para criar um novo perfil</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informações básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="pms" className="text-sm font-medium">
              PMs *
            </label>
            <Input
              id="pms"
              type="number"
              placeholder="Ex: 40"
              value={pms || ""}
              onChange={(e) => setPms(e.target.value ? Number(e.target.value) : 0)}
              min="1"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tipoVinculo" className="text-sm font-medium">
              Tipo de Vínculo *
            </label>
            <Select value={tipoVinculoId} onValueChange={setTipoVinculoId} disabled={isLoadingTipos}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingTipos ? "Carregando..." : "Selecione o tipo de vínculo"} />
              </SelectTrigger>
              <SelectContent>
                {tiposVinculo.map((tipo) => (
                  <SelectItem key={tipo.id} value={tipo.id}>
                    {tipo.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="descricao" className="text-sm font-medium">
            Descrição *
          </label>
          <Textarea
            id="descricao"
            placeholder="Descreva as responsabilidades e características deste perfil..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="projetoId" className="text-sm font-medium">
            ID do Projeto (opcional)
          </label>
          <Input
            id="projetoId"
            placeholder="Ex: proj-123"
            value={projetoId}
            onChange={(e) => setProjetoId(e.target.value)}
          />
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleCreateProfile} disabled={isSubmitting || isLoadingTipos}>
            {isSubmitting ? "Criando..." : "Criar Perfil"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
