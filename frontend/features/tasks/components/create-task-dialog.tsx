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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "@/components/ui/use-toast"
import { fetchActivities, createTarefa } from "../api"
import type { ApiActivity } from "../api"

// Definir o esquema de validação do formulário
const formSchema = z.object({
  nome: z.string().min(3, {
    message: "O nome da tarefa deve ter pelo menos 3 caracteres.",
  }),
  descricao: z
    .string()
    .min(5, {
      message: "A descrição deve ter pelo menos 5 caracteres.",
    })
    .nonempty("A descrição não pode estar vazia."),
  status: z.string({
    required_error: "Por favor selecione um status.",
  }),
  atividadeId: z.string({
    required_error: "Por favor selecione uma atividade.",
  }),
})

type FormValues = z.infer<typeof formSchema>

interface CreateTaskDialogProps {
  onTaskCreated: () => void
}

export function CreateTaskDialog({ onTaskCreated }: CreateTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activities, setActivities] = useState<ApiActivity[]>([])
  const [loadingActivities, setLoadingActivities] = useState(false)

  // Buscar atividades disponíveis
  useEffect(() => {
    async function loadActivities() {
      try {
        setLoadingActivities(true)
        const data = await fetchActivities()
        setActivities(data)
      } catch (error) {
        console.error("Erro ao buscar atividades:", error)
        toast({
          variant: "destructive",
          title: "Erro ao carregar atividades",
          description: "Não foi possível carregar a lista de atividades.",
        })
      } finally {
        setLoadingActivities(false)
      }
    }

    if (isOpen) {
      loadActivities()
    }
  }, [isOpen])

  // Inicializar o formulário com react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      status: "Por_Comecar",
      atividadeId: "",
    },
  })

  // Função para lidar com o envio do formulário
  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true)

      await createTarefa(values)

      // Exibir mensagem de sucesso
      toast({
        title: "Tarefa criada com sucesso!",
        description: `A tarefa "${values.nome}" foi criada.`,
      })

      // Resetar o formulário
      form.reset()

      // Fechar o diálogo
      setIsOpen(false)

      // Notificar o componente pai para atualizar a lista de tarefas
      onTaskCreated()
    } catch (error) {
      console.error("Erro ao criar tarefa:", error)
      toast({
        variant: "destructive",
        title: "Erro ao criar tarefa",
        description: "Ocorreu um erro ao tentar criar a tarefa. Tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Tarefa</DialogTitle>
          <DialogDescription>Preencha os campos abaixo para criar uma nova tarefa.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Tarefa</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome da tarefa" {...field} />
                  </FormControl>
                  <FormDescription>Nome que identifica a tarefa.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva os detalhes da tarefa" className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>Detalhes sobre o que precisa ser feito.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Por_Comecar">Por Começar</SelectItem>
                      <SelectItem value="A_Decorrer">Em Progresso</SelectItem>
                      <SelectItem value="Terminado">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Estado atual da tarefa.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="atividadeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Atividade</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={loadingActivities ? "Carregando atividades..." : "Selecione uma atividade"}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activities.map((activity) => (
                        <SelectItem key={activity.id} value={activity.id}>
                          {activity.nomeAtividade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Atividade à qual esta tarefa pertence.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Criando..." : "Criar Tarefa"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
