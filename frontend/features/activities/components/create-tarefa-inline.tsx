"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { createTarefa } from "../../tasks/api"
import type { CreateTarefaDto } from "../../tasks/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AVAILABLE_STATUSES } from "../../tasks/api"

interface CreateTarefaInlineProps {
  onTarefaCreated: (tarefaId: string) => void
  onCancel: () => void
}

export function CreateTarefaInline({ onTarefaCreated, onCancel }: CreateTarefaInlineProps) {
  const [nome, setNome] = useState("")
  const [descricao, setDescricaoTarefa] = useState("")
  const [status, setStatus] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleCreateTarefa() {
    // Validações
    if (!nome.trim()) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, preencha o nome da tarefa.",
      })
      return
    }

    if (!descricao.trim()) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, preencha a descrição da tarefa.",
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

      const dto: CreateTarefaDto = {
        nome,
        descricao,
        status,
      }

      const tarefa = await createTarefa(dto)

      toast({
        title: "Tarefa criada!",
        description: `A tarefa "${nome}" foi criada com sucesso.`,
      })

      // Limpar formulário
      setNome("")
      setDescricaoTarefa("")
      setStatus("")

      // Notificar componente pai
      onTarefaCreated(tarefa.id)
    } catch (error) {
      console.error("Erro ao criar tarefa:", error)
      toast({
        variant: "destructive",
        title: "Erro ao criar tarefa",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="border rounded-md p-3 bg-muted/50 space-y-3">
      <h4 className="text-sm font-medium">Criar Nova Tarefa</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium">Nome *</label>
          <Input placeholder="Nome da tarefa" value={nome} onChange={(e) => setNome(e.target.value)} className="h-8" />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium">Status *</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_STATUSES.map((statusOption) => (
                <SelectItem key={statusOption} value={statusOption}>
                  {statusOption.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium">Descrição *</label>
        <Textarea
          placeholder="Descrição da tarefa"
          value={descricao}
          onChange={(e) => setDescricaoTarefa(e.target.value)}
          rows={2}
          className="text-xs"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          size="sm"
          onClick={handleCreateTarefa}
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700 text-black"
        >
          {isSubmitting ? "Criando..." : "Criar Tarefa"}
        </Button>
      </div>
    </div>
  )
}
