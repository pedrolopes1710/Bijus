"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { createEntregavel } from "../../deliverables/api"
import type { CreateEntregavelDto } from "../../deliverables/types"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreateEntregavelInlineProps {
  onEntregavelCreated: (entregavelId: string) => void
  onCancel: () => void
}

const STATUS_OPTIONS = [
  { value: "Pendente", label: "Pendente" },
  { value: "Em_Andamento", label: "Em Andamento" },
  { value: "Concluido", label: "Concluído" },
  { value: "Cancelado", label: "Cancelado" },
]

export function CreateEntregavelInline({ onEntregavelCreated, onCancel }: CreateEntregavelInlineProps) {
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [dataEntrega, setDataEntrega] = useState<Date | undefined>(new Date())
  const [status, setStatus] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleCreateEntregavel() {
    // Validações
    if (!nome.trim()) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, preencha o nome do entregável.",
      })
      return
    }

    if (!descricao.trim()) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, preencha a descrição.",
      })
      return
    }

    if (!dataEntrega) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, selecione a data de entrega.",
      })
      return
    }

    if (!status) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, selecione o status.",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const dto: CreateEntregavelDto = {
        nome,
        descricao,
        dataEntrega: dataEntrega.toISOString(),
        status,
      }

      const entregavel = await createEntregavel(dto)

      toast({
        title: "Entregável criado!",
        description: `O entregável "${nome}" foi criado com sucesso.`,
      })

      // Limpar formulário
      setNome("")
      setDescricao("")
      setDataEntrega(new Date())
      setStatus("")

      // Notificar componente pai
      onEntregavelCreated(entregavel.id)
    } catch (error) {
      console.error("Erro ao criar entregável:", error)
      toast({
        variant: "destructive",
        title: "Erro ao criar entregável",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="border rounded-md p-3 bg-muted/50 space-y-3">
      <h4 className="text-sm font-medium">Criar Novo Entregável</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium">Nome *</label>
          <Input
            placeholder="Nome do entregável"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="h-8"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium">Status *</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium">Descrição *</label>
        <Textarea
          placeholder="Descrição do entregável"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={2}
          className="text-xs"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium">Data de Entrega *</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal h-8", !dataEntrega && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-3 w-3" />
              {dataEntrega ? format(dataEntrega, "PPP") : <span>Selecione uma data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={dataEntrega} onSelect={setDataEntrega} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          size="sm"
          onClick={handleCreateEntregavel}
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700 text-black"
        >
          {isSubmitting ? "Criando..." : "Criar Entregável"}
        </Button>
      </div>
    </div>
  )
}
