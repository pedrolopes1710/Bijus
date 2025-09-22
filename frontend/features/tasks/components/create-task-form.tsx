"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createTarefa, fetchActivities, AVAILABLE_STATUSES } from "../api"
import type { ApiActivity } from "../api"
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"

interface CreateTaskFormProps {
  onTaskCreated: () => void
  onCancel?: () => void
}

export function CreateTaskForm({ onTaskCreated, onCancel }: CreateTaskFormProps) {
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [status, setStatus] = useState("")
  const [atividadeId, setAtividadeId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activities, setActivities] = useState<ApiActivity[]>([])
  const [statuses, setStatuses] = useState<string[]>([])
  const [loadingActivities, setLoadingActivities] = useState(false)
  const [loadingStatuses, setLoadingStatuses] = useState(false)

  // Buscar atividades e status disponíveis
  useEffect(() => {
    async function loadData() {
      try {
        setLoadingActivities(true)
        setLoadingStatuses(true)

        // Buscar atividades
        const activitiesData = await fetchActivities()
        setActivities(activitiesData)

        // Buscar status disponíveis
        setStatuses(AVAILABLE_STATUSES)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar as atividades ou status.",
        })
      } finally {
        setLoadingActivities(false)
        setLoadingStatuses(false)
      }
    }

    loadData()
  }, [])

  async function handleCreateTask() {
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
        description: "A descrição da tarefa não pode estar vazia.",
      })
      return
    }

    if (!status) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, selecione um status.",
      })
      return
    }

    try {
      setIsSubmitting(true)

      await createTarefa({
        nome,
        descricao: descricao, // Usando descricao para enviar
        status,
        atividadeId: atividadeId || undefined,
      })

      toast({
        title: "Tarefa criada com sucesso!",
        description: `A tarefa "${nome}" foi criada.`,
      })

      // Limpar o formulário
      setNome("")
      setDescricao("")
      setStatus("")
      setAtividadeId("")

      // Notificar o componente pai
      onTaskCreated()
    } catch (error) {
      console.error("Erro ao criar tarefa:", error)
      toast({
        variant: "destructive",
        title: "Erro ao criar tarefa",
        description: "Ocorreu um erro ao tentar criar a tarefa. Verifique o console para mais detalhes.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-md p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">🆕 Criar Nova Tarefa</h2>
      <Input placeholder="Nome da Tarefa" value={nome} onChange={(e) => setNome(e.target.value)} className="mb-3" />
      <Textarea
        placeholder="Descrição da Tarefa"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        className="mb-3"
        rows={3}
      />
      <div className="mb-3">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={loadingStatuses ? "Carregando status..." : "Escolha o Status"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              {statuses.map((statusOption) => (
                <SelectItem key={statusOption} value={statusOption}>
                  {statusOption.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="mb-6">
        <Select value={atividadeId} onValueChange={setAtividadeId}>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={loadingActivities ? "Carregando atividades..." : "Escolha a Atividade (opcional)"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Atividades</SelectLabel>
              {activities.map((activity) => (
                <SelectItem key={activity.id} value={activity.id}>
                  {activity.nomeAtividade}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
        )}
        <Button onClick={handleCreateTask} disabled={isSubmitting}>
          {isSubmitting ? "Criando..." : "Criar"}
        </Button>
      </div>
    </Card>
  )
}
