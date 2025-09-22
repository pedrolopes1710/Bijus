"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { fetchActivityById, updateActivity } from "../api"

interface EditActivityDialogProps {
  activityId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onActivityUpdated: () => void
}

export function EditActivityDialog({ activityId, open, onOpenChange, onActivityUpdated }: EditActivityDialogProps) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Estados do formulário
  const [nomeAtividade, setNomeAtividade] = useState("")
  const [descricaoAtividade, setDescricaoAtividade] = useState("")
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined)
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined)

  // Carregar dados da atividade quando o diálogo abrir
  useEffect(() => {
    if (open && activityId) {
      loadActivityData()
    }
  }, [open, activityId])

  const loadActivityData = async () => {
    if (!activityId) return

    try {
      setLoading(true)
      const activity = await fetchActivityById(activityId)

      setNomeAtividade(activity.nomeAtividade || "")
      setDescricaoAtividade(activity.descricaoAtividade || "")
      setDataInicio(activity.dataInicioAtividade ? new Date(activity.dataInicioAtividade) : undefined)
      setDataFim(activity.dataFimAtividade ? new Date(activity.dataFimAtividade) : undefined)
    } catch (error) {
      console.error("Erro ao carregar atividade:", error)
      toast({
        variant: "destructive",
        title: "Erro ao carregar atividade",
        description: "Não foi possível carregar os dados da atividade.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    // Validações
    if (!nomeAtividade.trim()) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, preencha o nome da atividade.",
      })
      return
    }

    if (!descricaoAtividade.trim()) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, preencha a descrição da atividade.",
      })
      return
    }

    if (!dataInicio) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, selecione a data de início.",
      })
      return
    }

    if (!dataFim) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, selecione a data de fim.",
      })
      return
    }

    if (dataFim < dataInicio) {
      toast({
        variant: "destructive",
        title: "Data inválida",
        description: "A data de fim deve ser posterior à data de início.",
      })
      return
    }

    if (!activityId) return

    try {
      setSaving(true)

      await updateActivity({
        id: activityId,
        nomeAtividade: nomeAtividade.trim(),
        descricaoAtividade: descricaoAtividade.trim(),
        dataInicioAtividade: dataInicio.toISOString(),
        dataFimAtividade: dataFim.toISOString(),
      })

      toast({
        title: "Atividade atualizada!",
        description: "A atividade foi atualizada com sucesso.",
      })

      onActivityUpdated()
      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao atualizar atividade:", error)
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a atividade. Tente novamente.",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Atividade</DialogTitle>
          <DialogDescription>Edite as informações básicas da atividade.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            {/* Nome da Atividade */}
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome da Atividade *</Label>
              <Input
                id="nome"
                value={nomeAtividade}
                onChange={(e) => setNomeAtividade(e.target.value)}
                placeholder="Digite o nome da atividade"
              />
            </div>

            {/* Descrição */}
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                value={descricaoAtividade}
                onChange={(e) => setDescricaoAtividade(e.target.value)}
                placeholder="Digite a descrição da atividade"
                rows={3}
              />
            </div>

            {/* Data de Início */}
            <div className="grid gap-2">
              <Label>Data de Início *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !dataInicio && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataInicio ? format(dataInicio, "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dataInicio} onSelect={setDataInicio} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Data de Fim */}
            <div className="grid gap-2">
              <Label>Data de Fim *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !dataFim && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataFim ? format(dataFim, "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dataFim} onSelect={setDataFim} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading || saving}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
