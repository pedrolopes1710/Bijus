"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { updateTask } from "../api"
import type { ApiTask, CreateTarefaDto } from "../api"

interface EditTaskDialogProps {
  task: ApiTask
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskUpdated: () => void
}

export function EditTaskDialog({ task, open, onOpenChange, onTaskUpdated }: EditTaskDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<CreateTarefaDto>>({
    nome: "",
    descricao: "",
  })

  // Preencher o formulário com os dados da tarefa quando o diálogo abrir
  useEffect(() => {
    if (task && open) {
      setFormData({
        nome: task.nome || "",
        descricao: task.descricao || "",
      })
    }
  }, [task, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome?.trim()) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, preencha o nome da tarefa.",
      })
      return
    }

    if (!formData.descricao?.trim()) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, preencha a descrição da tarefa.",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const updateData: Partial<CreateTarefaDto> = {
        nome: formData.nome,
        descricao: formData.descricao,
      }

      await updateTask(task.id, updateData)

      toast({
        title: "Tarefa atualizada",
        description: "A tarefa foi atualizada com sucesso.",
      })

      onTaskUpdated()
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error)
      toast({
        variant: "destructive",
        title: "Erro ao atualizar tarefa",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar a tarefa.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Tarefa *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Digite o nome da tarefa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricaoTarefa">Descrição *</Label>
              <Textarea
                id="descricaoTarefa"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descreva os detalhes da tarefa"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
