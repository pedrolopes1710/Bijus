"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createProfile } from "../../profiles/api"
import type { CreateProfileDto } from "../../profiles/types"
import type { TipoVinculo } from "../../tipos-vinculo/types"
import { getTiposVinculo } from "../../tipos-vinculo/api"
import { toast } from "@/components/ui/use-toast"

interface CreateProfileInlineProps {
  onProfileCreated: (profileId: string) => void
  onCancel: () => void
}

export function CreateProfileInline({ onProfileCreated, onCancel }: CreateProfileInlineProps) {
  const [pms, setPms] = useState<number>(0)
  const [descricao, setDescricao] = useState("")
  const [projetoId, setProjetoId] = useState<string>("")
  const [tipoVinculoId, setTipoVinculoId] = useState("")
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
        description: "Por favor, informe um valor válido para PMs (maior que 0).",
      })
      return
    }

    if (!descricao.trim()) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, preencha a descrição do perfil.",
      })
      return
    }

    if (!tipoVinculoId) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, selecione o tipo de vínculo.",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const profileData: CreateProfileDto = {
        pms,
        descricao: descricao.trim(),
        projetoId: projetoId.trim() || null,
        tipoVinculoId,
      }

      console.log("Criando perfil com dados:", profileData)

      const newProfile = await createProfile(profileData)

      toast({
        title: "Perfil criado com sucesso!",
        description: `O perfil "${descricao}" foi criado e adicionado à atividade.`,
      })

      // Notificar componente pai com o ID do novo perfil
      onProfileCreated(newProfile.id)
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
    <Card className="border-2 border-dashed border-green-200 bg-green-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-green-700">Criar Novo Perfil</CardTitle>
        <CardDescription>Crie um novo perfil e adicione-o automaticamente a esta atividade</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informações básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="pms" className="text-sm font-medium">
              PMs *
            </label>
            <Input
              id="pms"
              type="number"
              min="1"
              placeholder="Ex: 10"
              value={pms || ""}
              onChange={(e) => setPms(Number(e.target.value) || 0)}
              className="h-8"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="tipoVinculo" className="text-sm font-medium">
              Tipo de Vínculo *
            </label>
            <Select value={tipoVinculoId} onValueChange={setTipoVinculoId} disabled={isLoadingTipos}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder={isLoadingTipos ? "Carregando..." : "Selecione o tipo"} />
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

        <div className="space-y-1">
          <label htmlFor="descricao" className="text-sm font-medium">
            Descrição *
          </label>
          <Textarea
            id="descricao"
            placeholder="Ex: Engenheiro de Software, Analista de Dados..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={2}
            className="resize-none"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="projetoId" className="text-sm font-medium">
            ID do Projeto (opcional)
          </label>
          <Input
            id="projetoId"
            placeholder="Digite o ID do projeto"
            value={projetoId}
            onChange={(e) => setProjetoId(e.target.value)}
            className="h-8"
          />
          <p className="text-xs text-muted-foreground">Deixe em branco se não for específico de um projeto</p>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={isSubmitting}>
            <X className="h-3 w-3 mr-1" />
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleCreateProfile}
            disabled={isSubmitting || isLoadingTipos}
            className="bg-green-600 hover:bg-green-700 text-black"
          >
            <Save className="h-3 w-3 mr-1" />
            {isSubmitting ? "Criando..." : "Criar Perfil"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
