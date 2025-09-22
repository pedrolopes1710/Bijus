"use client"

import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowUpDown,
  Calendar,
  ChevronDown,
  Filter,
  Plus,
  Search,
  ArrowLeft,
  CalendarIcon,
  Layers,
  Pencil,
  Trash,
  CheckCircle,
  Play,
  MoreHorizontal,
} from "lucide-react"
import type { Activity } from "./types"
import { fetchTasksGroupedByActivity, fetchTasks, updateTaskStatus } from "./api"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { Progress } from "@/components/ui/progress"
import { CreateTaskForm } from "./components/create-task-form"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { createActivity, deleteActivity } from "../activities/api"
import type { CreateActivityDto } from "../activities/types"
import { fetchEntregaveis } from "../deliverables/api"
import { fetchProfiles } from "../profiles/api"
import type { ApiTask } from "../tasks/api"
import type { Entregavel } from "../deliverables/types"
import type { Profile } from "../profiles/types"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { EditTaskDialog } from "./components/edit-task-dialog"
import { DeleteTaskDialog } from "./components/delete-task-dialog"
import { useRouter } from "next/navigation"
import { CreateTarefaInline } from "../activities/components/create-tarefa-inline"
import { CreateEntregavelInline } from "../activities/components/create-entregavel-inline"
import { CreateProfileInline } from "../activities/components/create-profile-inline"
import { CreateOrcamentoDialog } from "../orcamentos/components/create-orcamento-dialog"
import { EditActivityDialog } from "../activities/components/edit-activity-dialog"

export default function TasksPage() {
  const router = useRouter()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [tarefas, setTarefas] = useState<any[]>([])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [isCreatingActivity, setIsCreatingActivity] = useState(false)
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)

  // Estados para edição e exclusão de tarefas
  const [editingTask, setEditingTask] = useState<ApiTask | null>(null)
  const [showEditTaskDialog, setShowEditTaskDialog] = useState(false)
  const [deletingTask, setDeletingTask] = useState<{ id: string; name: string } | null>(null)
  const [showDeleteTaskDialog, setShowDeleteTaskDialog] = useState(false)

  // Estados para edição e exclusão de atividades
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [showEditActivityDialog, setShowEditActivityDialog] = useState(false)
  const [showDeleteActivityDialog, setShowDeleteActivityDialog] = useState(false)
  const [deletingActivity, setDeletingActivity] = useState<{ id: string; name: string } | null>(null)

  // Estados para o formulário de criação de atividade
  const [nomeAtividade, setNomeAtividade] = useState("")
  const [descricaoAtividade, setDescricaoAtividade] = useState("")
  const [dataInicio, setDataInicio] = useState<Date | undefined>(new Date())
  const [dataFim, setDataFim] = useState<Date | undefined>(new Date())
  const [orcamentoIds, setOrcamentoIds] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados para as listas de seleção múltipla (apenas para criação)
  const [tarefasIds, setTarefasIds] = useState<string[]>([])
  const [entregaveisIds, setEntregaveisIds] = useState<string[]>([])
  const [perfisIds, setPerfisIds] = useState<string[]>([])

  // Estados para os dados das listas (apenas para criação)
  const [activityTarefas, setActivityTarefas] = useState<ApiTask[]>([])
  const [entregaveis, setEntregaveis] = useState<Entregavel[]>([])
  const [perfis, setPerfis] = useState<Profile[]>([])

  // Estados para busca (apenas para criação)
  const [tarefasSearch, setTarefasSearch] = useState("")
  const [entregaveisSearch, setEntregaveisSearch] = useState("")
  const [perfisSearch, setPerfisSearch] = useState("")

  // Estados para indicar carregamento (apenas para criação)
  const [loadingTarefas, setLoadingTarefas] = useState(false)
  const [loadingEntregaveis, setLoadingEntregaveis] = useState(false)
  const [loadingPerfis, setLoadingPerfis] = useState(false)

  // Estados para controlar a criação inline (apenas para criação)
  const [showCreateTarefa, setShowCreateTarefa] = useState(false)
  const [showCreateEntregavel, setShowCreateEntregavel] = useState(false)
  const [showCreatePerfil, setShowCreatePerfil] = useState(false)

  // Função para carregar os dados da API
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Buscar tarefas agrupadas por atividade usando a função da API
      const groupedActivities = await fetchTasksGroupedByActivity()
      console.log("Atividades agrupadas:", groupedActivities)

      setActivities(groupedActivities)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Não foi possível carregar as tarefas. Verifique se a API está em execução.")
    } finally {
      setLoading(false)
    }
  }

  // Carregar dados quando o componente montar
  useEffect(() => {
    async function loadTarefa() {
      try {
        const data = await fetchTasks()
        setTarefas(data)
        console.log("Tarefas:", data)
      } catch (err) {
        setError("Erro ao carregar projetos.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadTarefa()
    fetchData()
  }, [])

  // Carregar dados para os selects quando estiver no modo de criação de atividade
  useEffect(() => {
    if (!isCreatingActivity) return

    async function loadData() {
      try {
        // Carregar tarefas
        setLoadingTarefas(true)
        const tarefasData = await fetchTasks()
        setActivityTarefas(tarefasData)
        setLoadingTarefas(false)

        // Carregar entregáveis
        setLoadingEntregaveis(true)
        try {
          const entregaveisData = await fetchEntregaveis()
          setEntregaveis(entregaveisData)
        } catch (error) {
          console.error("Erro ao carregar entregáveis:", error)
          setEntregaveis([])
        }
        setLoadingEntregaveis(false)

        // Carregar perfis
        setLoadingPerfis(true)
        try {
          const perfisData = await fetchProfiles()
          setPerfis(perfisData)
        } catch (error) {
          console.error("Erro ao carregar perfis:", error)
          setPerfis([])
        }
        setLoadingPerfis(false)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Ocorreu um erro ao carregar os dados necessários.",
        })
      }
    }

    loadData()
  }, [isCreatingActivity])

  // Filtrar atividades e tarefas com base no termo de pesquisa
  const filteredActivities = activities
    .map((activity) => ({
      ...activity,
      tasks: activity.tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((activity) => activity.tasks.length > 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-500/20 text-blue-700 hover:bg-blue-500/30"
      case "Not Started":
        return "bg-slate-500/20 text-slate-700 hover:bg-slate-500/30"
      case "Completed":
        return "bg-green-500/20 text-green-700 hover:bg-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-700 hover:bg-gray-500/30"
    }
  }

  // Componente de carregamento
  const LoadingSkeleton = () => (
    <>
      {[1, 2, 3].map((i) => (
        <Card key={i} className="mb-6">
          <CardHeader className="bg-muted/50 py-3">
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="p-4">
            {[1, 2].map((j) => (
              <div key={j} className="flex items-start gap-4 py-4 border-b last:border-0">
                <Skeleton className="h-4 w-4 rounded-sm mt-1" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-full max-w-md" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </>
  )

  // Função para lidar com a criação de uma nova tarefa
  const handleTaskCreated = () => {
    fetchData()
    setShowTaskForm(false)
  }

  // Função para lidar com a atualização de uma tarefa
  const handleTaskUpdated = () => {
    fetchData()
    setShowEditTaskDialog(false)
    setEditingTask(null)
  }

  // Função para lidar com a exclusão de uma tarefa
  const handleTaskDeleted = () => {
    fetchData()
    setShowDeleteTaskDialog(false)
    setDeletingTask(null)
  }

  // Função para atualizar o status de uma tarefa
  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    try {
      setUpdatingTaskId(taskId)
      console.log(`Atualizando status da tarefa ${taskId} para ${newStatus}`)
      await updateTaskStatus(taskId, newStatus)
      toast({
        title: "Status atualizado",
        description: `Status da tarefa alterado para ${newStatus.replace(/_/g, " ")}.`,
      })
      fetchData()
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da tarefa.",
      })
    } finally {
      setUpdatingTaskId(null)
    }
  }

  // Funções para edição de atividades
  const handleEditActivity = async (activity: Activity) => {
    setEditingActivity(activity)
    setShowEditActivityDialog(true)
  }

  const handleEditActivityClose = () => {
    setShowEditActivityDialog(false)
    setEditingActivity(null)
  }

  const handleActivityUpdated = () => {
    fetchData()
    handleEditActivityClose()
  }

  const handleDeleteActivity = (activity: Activity) => {
    setDeletingActivity({ id: activity.id, name: activity.name })
    setShowDeleteActivityDialog(true)
  }

  const confirmDeleteActivity = async () => {
    if (!deletingActivity) return

    try {
      await deleteActivity(deletingActivity.id)
      toast({
        title: "Atividade excluída",
        description: `A atividade "${deletingActivity.name}" foi excluída com sucesso.`,
      })

      fetchData()
      setShowDeleteActivityDialog(false)
      setDeletingActivity(null)
    } catch (error) {
      console.error("Erro ao excluir atividade:", error)
      toast({
        variant: "destructive",
        title: "Erro ao excluir atividade",
        description: "Não foi possível excluir a atividade.",
      })
    }
  }

  // Funções para selecionar/desselecionar todos (apenas para criação)
  const selectAllTarefas = () => {
    const filteredTarefas = activityTarefas
      .filter((tarefa) => tarefa.nome?.toLowerCase().includes(tarefasSearch.toLowerCase()))
      .map((tarefa) => tarefa.id)
    setTarefasIds(filteredTarefas)
  }

  const deselectAllTarefas = () => {
    setTarefasIds([])
  }

  const selectAllEntregaveis = () => {
    const filteredEntregaveis = entregaveis
      .filter((entregavel) => entregavel.nome?.toLowerCase().includes(entregaveisSearch.toLowerCase()))
      .map((entregavel) => entregavel.id)
    setEntregaveisIds(filteredEntregaveis)
  }

  const deselectAllEntregaveis = () => {
    setEntregaveisIds([])
  }

  const selectAllPerfis = () => {
    const filteredPerfis = perfis
      .filter((perfil) => perfil.descricao?.toLowerCase().includes(perfisSearch.toLowerCase()))
      .map((perfil) => perfil.id)
    setPerfisIds(filteredPerfis)
  }

  const deselectAllPerfis = () => {
    setPerfisIds([])
  }

  // Filtrar itens com base na busca (apenas para criação)
  const filteredTarefas = activityTarefas.filter((tarefa) =>
    tarefa.nome?.toLowerCase().includes(tarefasSearch.toLowerCase()),
  )

  const filteredEntregaveis = entregaveis.filter((entregavel) =>
    entregavel.nome?.toLowerCase().includes(entregaveisSearch.toLowerCase()),
  )

  const filteredPerfis = perfis.filter((perfil) => perfil.descricao?.toLowerCase().includes(perfisSearch.toLowerCase()))

  // Função para lidar com a criação de tarefa inline (apenas para criação)
  const handleTarefaCreatedInline = async (tarefaId: string) => {
    setTarefasIds([...tarefasIds, tarefaId])
    try {
      const tarefasData = await fetchTasks()
      setActivityTarefas(tarefasData)
    } catch (error) {
      console.error("Erro ao recarregar tarefas:", error)
    }
    setShowCreateTarefa(false)
  }

  // Função para lidar com a criação de entregável inline (apenas para criação)
  const handleEntregavelCreatedInline = async (entregavelId: string) => {
    setEntregaveisIds([...entregaveisIds, entregavelId])
    try {
      const entregaveisData = await fetchEntregaveis()
      setEntregaveis(entregaveisData)
    } catch (error) {
      console.error("Erro ao recarregar entregáveis:", error)
    }
    setShowCreateEntregavel(false)
  }

  // Função para lidar com a criação de perfil inline (apenas para criação)
  const handlePerfilCreatedInline = async (perfilId: string) => {
    setPerfisIds([...perfisIds, perfilId])
    try {
      const perfisData = await fetchProfiles()
      setPerfis(perfisData)
    } catch (error) {
      console.error("Erro ao recarregar perfis:", error)
    }
    setShowCreatePerfil(false)
  }

  // Função para lidar com a criação de orçamento (apenas para criação)
  const handleOrcamentoCriado = (orcamentoId: string) => {
    setOrcamentoIds([...orcamentoIds, orcamentoId])
    toast({
      title: "Orçamento criado com sucesso!",
      description: "O orçamento foi criado e adicionado à atividade.",
    })
  }

  // Função para lidar com o envio do formulário de atividade (apenas para criação)
  async function handleSubmitActivity() {
    // Validar campos obrigatórios
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
        description: "A descrição da atividade não pode estar vazia.",
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

    // Validar campos obrigatórios de seleção múltipla
    if (orcamentoIds.length === 0) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, preencha pelo menos um ID de orçamento.",
      })
      return
    }

    if (tarefasIds.length === 0) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, selecione pelo menos uma tarefa.",
      })
      return
    }

    if (entregaveisIds.length === 0) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, selecione pelo menos um entregável.",
      })
      return
    }

    if (perfisIds.length === 0) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, selecione pelo menos um perfil.",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Criar nova atividade
      const activityData: CreateActivityDto = {
        nomeAtividade,
        descricaoAtividade,
        dataInicioAtividade: dataInicio.toISOString(),
        dataFimAtividade: dataFim.toISOString(),
        entregaveisIds: entregaveisIds.length > 0 ? entregaveisIds : [],
        perfisIds: perfisIds.length > 0 ? perfisIds : [],
        tarefasIds: tarefasIds.length > 0 ? tarefasIds : [],
      }

      if (orcamentoIds.length > 0) {
        activityData.orcamentoIds = orcamentoIds
      }

      await createActivity(activityData)

      toast({
        title: "Atividade criada com sucesso!",
        description: `A atividade "${nomeAtividade}" foi criada.`,
      })

      // Limpar formulário e voltar para a lista
      resetForm()
      setIsCreatingActivity(false)

      // Recarregar os dados
      fetchData()

      router.push("/tasks")
    } catch (error) {
      console.error("Erro ao criar atividade:", error)
      toast({
        variant: "destructive",
        title: "Erro ao criar atividade",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao tentar criar a atividade.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para limpar o formulário (apenas para criação)
  function resetForm() {
    setNomeAtividade("")
    setDescricaoAtividade("")
    setDataInicio(new Date())
    setDataFim(new Date())
    setOrcamentoIds([])
    setTarefasIds([])
    setEntregaveisIds([])
    setPerfisIds([])
    setTarefasSearch("")
    setEntregaveisSearch("")
    setPerfisSearch("")
    setShowCreateTarefa(false)
    setShowCreateEntregavel(false)
    setShowCreatePerfil(false)
  }

  // Função para cancelar criação
  const handleCancelForm = () => {
    resetForm()
    setIsCreatingActivity(false)
  }

  // Função para abrir o diálogo de edição de tarefa
  const handleEditTask = (task: ApiTask) => {
    setEditingTask(task)
    setShowEditTaskDialog(true)
  }

  // Função para abrir o diálogo de exclusão de tarefa
  const handleDeleteTask = (id: string, name: string) => {
    setDeletingTask({ id, name })
    setShowDeleteTaskDialog(true)
  }

  // Função para navegar para a página de atividades
  const handleViewActivity = (activityId: string) => {
    if (activityId === "no-activity") return
    router.push("/tasks")
  }

  // Renderizar o formulário de criação de atividade
  if (isCreatingActivity) {
    return (
      <div className="space-y-6">
        <Toaster />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleCancelForm}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Nova Atividade</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancelForm} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitActivity} disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar Atividade"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna 1: Informações básicas */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Preencha os dados principais da atividade</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="nomeAtividade" className="text-sm font-medium">
                    Nome da Atividade *
                  </label>
                  <Input
                    id="nomeAtividade"
                    placeholder="Digite o nome da atividade"
                    value={nomeAtividade}
                    onChange={(e) => setNomeAtividade(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="descricaoAtividade" className="text-sm font-medium">
                    Descrição *
                  </label>
                  <Textarea
                    id="descricaoAtividade"
                    placeholder="Descreva os detalhes da atividade"
                    value={descricaoAtividade}
                    onChange={(e) => setDescricaoAtividade(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="dataInicio" className="text-sm font-medium">
                    Data de Início *
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dataInicio && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataInicio ? format(dataInicio, "PPP") : <span>Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent mode="single" selected={dataInicio} onSelect={setDataInicio} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label htmlFor="dataFim" className="text-sm font-medium">
                    Data de Fim *
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dataFim && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataFim ? format(dataFim, "PPP") : <span>Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent mode="single" selected={dataFim} onSelect={setDataFim} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="orcamentoIds" className="text-sm font-medium">
                      IDs dos Orçamentos *
                    </label>
                    <CreateOrcamentoDialog onOrcamentoCriado={handleOrcamentoCriado} />
                  </div>
                  <Input
                    id="orcamentoId"
                    placeholder="Digite os IDs dos orçamentos separados por vírgula"
                    value={orcamentoIds.join(", ")}
                    onChange={(e) => {
                      const ids = e.target.value
                        .split(",")
                        .map((id) => id.trim())
                        .filter((id) => id.length > 0)
                      setOrcamentoIds(ids)
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Exemplo: 44A0B6BA-8EA5-48C3-B674-F00273DA06F8, 78FF5629-35G2-5B9B-AB14-106EBD6DC0G0
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card de Entregáveis */}
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Entregáveis *</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{entregaveisIds.length} selecionados</Badge>
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={() => setShowCreateEntregavel(!showCreateEntregavel)}
                      className="h-7 text-xs bg-green-600 hover:bg-green-700 text-black"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Criar Entregável
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={selectAllEntregaveis}
                    disabled={loadingEntregaveis || filteredEntregaveis.length === 0}
                    className="h-8 text-xs bg-transparent"
                  >
                    Selecionar Todos
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={deselectAllEntregaveis}
                    disabled={entregaveisIds.length === 0}
                    className="h-8 text-xs bg-transparent"
                  >
                    Limpar
                  </Button>
                </div>
                {showCreateEntregavel && (
                  <CreateEntregavelInline
                    onEntregavelCreated={handleEntregavelCreatedInline}
                    onCancel={() => setShowCreateEntregavel(false)}
                  />
                )}
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar entregáveis..."
                    value={entregaveisSearch}
                    onChange={(e) => setEntregaveisSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] overflow-y-auto pr-2">
                  {loadingEntregaveis ? (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                      Carregando entregáveis...
                    </div>
                  ) : filteredEntregaveis.length > 0 ? (
                    <div className="space-y-2">
                      {filteredEntregaveis.map((entregavel) => (
                        <div
                          key={entregavel.id}
                          className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            id={`entregavel-${entregavel.id}`}
                            checked={entregaveisIds.includes(entregavel.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setEntregaveisIds([...entregaveisIds, entregavel.id])
                              } else {
                                setEntregaveisIds(entregaveisIds.filter((id) => id !== entregavel.id))
                              }
                            }}
                          />
                          <label
                            htmlFor={`entregavel-${entregavel.id}`}
                            className="text-sm leading-none cursor-pointer flex-1"
                          >
                            {entregavel.nome || `Entregável ${entregavel.id.substring(0, 8)}...`}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                      Nenhum entregável encontrado.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna 2: Tarefas */}
          <div>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Tarefas *</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{tarefasIds.length} selecionadas</Badge>
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={() => setShowCreateTarefa(!showCreateTarefa)}
                      className="h-7 text-xs bg-green-600 hover:bg-green-700 text-black"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Criar Tarefa
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={selectAllTarefas}
                    disabled={loadingTarefas || filteredTarefas.length === 0}
                    className="h-8 text-xs bg-transparent"
                  >
                    Selecionar Todos
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={deselectAllTarefas}
                    disabled={tarefasIds.length === 0}
                    className="h-8 text-xs bg-transparent"
                  >
                    Limpar
                  </Button>
                </div>
                {showCreateTarefa && (
                  <CreateTarefaInline
                    onTarefaCreated={handleTarefaCreatedInline}
                    onCancel={() => setShowCreateTarefa(false)}
                  />
                )}
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar tarefas..."
                    value={tarefasSearch}
                    onChange={(e) => setTarefasSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] overflow-y-auto pr-2">
                  {loadingTarefas ? (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                      Carregando tarefas...
                    </div>
                  ) : filteredTarefas.length > 0 ? (
                    <div className="space-y-2">
                      {filteredTarefas.map((tarefa) => (
                        <div
                          key={tarefa.id}
                          className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            id={`tarefa-${tarefa.id}`}
                            checked={tarefasIds.includes(tarefa.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setTarefasIds([...tarefasIds, tarefa.id])
                              } else {
                                setTarefasIds(tarefasIds.filter((id) => id !== tarefa.id))
                              }
                            }}
                          />
                          <label htmlFor={`tarefa-${tarefa.id}`} className="text-sm leading-none cursor-pointer flex-1">
                            {tarefa.nome || `Tarefa ${tarefa.id.substring(0, 8)}...`}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                      Nenhuma tarefa encontrada.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna 3: Perfis */}
          <div>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Perfis *</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{perfisIds.length} selecionados</Badge>
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={() => setShowCreatePerfil(!showCreatePerfil)}
                      className="h-7 text-xs bg-green-600 hover:bg-green-700 text-black"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Criar Perfil
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={selectAllPerfis}
                    disabled={loadingPerfis || filteredPerfis.length === 0}
                    className="h-8 text-xs bg-transparent"
                  >
                    Selecionar Todos
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={deselectAllPerfis}
                    disabled={perfisIds.length === 0}
                    className="h-8 text-xs bg-transparent"
                  >
                    Limpar
                  </Button>
                </div>
                {showCreatePerfil && (
                  <CreateProfileInline
                    onProfileCreated={handlePerfilCreatedInline}
                    onCancel={() => setShowCreatePerfil(false)}
                  />
                )}
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar Perfis..."
                    value={perfisSearch}
                    onChange={(e) => setPerfisSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] overflow-y-auto pr-2">
                  {loadingPerfis ? (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                      Carregando perfis...
                    </div>
                  ) : filteredPerfis.length > 0 ? (
                    <div className="space-y-2">
                      {filteredPerfis.map((perfil) => (
                        <div
                          key={perfil.id}
                          className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            id={`perfil-${perfil.id}`}
                            checked={perfisIds.includes(perfil.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setPerfisIds([...perfisIds, perfil.id])
                              } else {
                                setPerfisIds(perfisIds.filter((id) => id !== perfil.id))
                              }
                            }}
                          />
                          <label htmlFor={`perfil-${perfil.id}`} className="text-sm leading-none cursor-pointer flex-1">
                            {perfil.descricao || `Perfil ${perfil.id.substring(0, 8)}...`}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                      Nenhum perfil encontrado.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">Manage and track all your tasks</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center w-full max-w-sm gap-2">
          <Search className="h-4 w-4 text-muted-foreground absolute ml-3 pointer-events-none" />
          <Input
            placeholder="Search tasks..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuCheckboxItem checked>In Progress</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Not Started</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Completed</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Activity</DropdownMenuLabel>
              {activities.map((activity) => (
                <DropdownMenuCheckboxItem key={activity.id} checked>
                  {activity.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Due Date (Ascending)</DropdownMenuItem>
              <DropdownMenuItem>Due Date (Descending)</DropdownMenuItem>
              <DropdownMenuItem>Activity</DropdownMenuItem>
              <DropdownMenuItem>Project</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={() => setIsCreatingActivity(true)}
            className="flex items-center gap-1 bg-green-600 text-white hover:bg-green-700"
          >
            <Layers className="w-4 h-4 mr-1" />
            Nova Atividade
          </Button>
        </div>
      </div>

      <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nova Tarefa</DialogTitle>
          </DialogHeader>
          <CreateTaskForm onTaskCreated={handleTaskCreated} onCancel={() => setShowTaskForm(false)} />
        </DialogContent>
      </Dialog>

      {/* Diálogo de edição de tarefa */}
      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          open={showEditTaskDialog}
          onOpenChange={setShowEditTaskDialog}
          onTaskUpdated={handleTaskUpdated}
        />
      )}

      {/* Diálogo de exclusão de tarefa */}
      {deletingTask && (
        <DeleteTaskDialog
          taskId={deletingTask.id}
          taskName={deletingTask.name}
          open={showDeleteTaskDialog}
          onOpenChange={setShowDeleteTaskDialog}
          onTaskDeleted={handleTaskDeleted}
        />
      )}

      {/* Diálogo de edição de atividade */}
      <EditActivityDialog
        activityId={editingActivity?.id || null}
        open={showEditActivityDialog}
        onOpenChange={setShowEditActivityDialog}
        onActivityUpdated={handleActivityUpdated}
      />

      {/* Diálogo de confirmação de exclusão de atividade */}
      <Dialog open={showDeleteActivityDialog} onOpenChange={setShowDeleteActivityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja excluir a atividade "{deletingActivity?.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteActivityDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteActivity}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            {error}
            <Button variant="outline" size="sm" onClick={fetchData} className="ml-2 bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="my">My Tasks</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <LoadingSkeleton />
          ) : filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <Card key={activity.id} className="mb-6">
                <CardHeader className="bg-muted/50 py-3">
                  <CardTitle className="text-lg flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "cursor-pointer hover:underline",
                            activity.id === "no-activity" ? "text-muted-foreground" : "",
                          )}
                          onClick={() => handleViewActivity(activity.id)}
                        >
                          {activity.name}
                        </span>
                        {/* Dropdown menu para ações da atividade */}
                        {activity.id !== "no-activity" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Abrir menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditActivity(activity)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteActivity(activity)} className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                    </div>
                    <div className="flex flex-col md:items-end gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col md:items-end text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {new Date(activity.dataInicio).toLocaleDateString()} -{" "}
                              {new Date(activity.dataFim).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {activity.tasks.length} tasks
                        </Badge>
                      </div>

                      {/* Barra de progresso */}
                      <div className="w-full md:w-48 flex flex-col gap-1">
                        {(() => {
                          const completedTasks = activity.tasks.filter((task) => task.status === "Completed").length
                          const progressPercentage =
                            activity.tasks.length > 0 ? Math.round((completedTasks / activity.tasks.length) * 100) : 0

                          return (
                            <>
                              <div className="flex items-center justify-between text-xs">
                                <span>Progresso</span>
                                <span>{progressPercentage}%</span>
                              </div>
                              <Progress value={progressPercentage} className="h-2" />
                              <div className="text-xs text-muted-foreground text-right">
                                {completedTasks}/{activity.tasks.length} concluídas
                              </div>
                            </>
                          )
                        })()}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {activity.tasks.map((task) => (
                      <div key={task.id} className="flex items-start p-4 hover:bg-muted/50">
                        <Checkbox id={`task-${task.id}`} className="mt-1 mr-4" />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="font-medium">{task.title}</div>
                              <div className="text-sm text-muted-foreground">{task.project}</div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">{task.descricao}</p>
                          <div className="flex items-center justify-between mt-4">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                              <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-2">
                              {/* Botões de Status */}
                              {task.status !== "Completed" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-green-500/20 text-green-700 hover:bg-green-500/30 border-green-300"
                                  onClick={() => handleUpdateStatus(task.id.toString(), "Terminado")}
                                  disabled={updatingTaskId === task.id.toString()}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Terminado
                                </Button>
                              )}
                              {task.status !== "In Progress" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30 border-blue-300"
                                  onClick={() => handleUpdateStatus(task.id.toString(), "A_Decorrer")}
                                  disabled={updatingTaskId === task.id.toString()}
                                >
                                  <Play className="h-4 w-4 mr-1" />A Decorrer
                                </Button>
                              )}
                              {/* Botões de Ação */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Encontrar a tarefa original na lista de tarefas
                                  const originalTask = tarefas.find((t) => t.id === task.id)
                                  if (originalTask) {
                                    handleEditTask(originalTask)
                                  }
                                }}
                              >
                                <Pencil className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:bg-red-50 border-red-300 bg-transparent"
                                onClick={() => handleDeleteTask(task.id.toString(), task.title)}
                              >
                                <Trash className="h-4 w-4 mr-1" />
                                Excluir
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                {searchTerm ? "Nenhuma tarefa encontrada para a pesquisa." : "Nenhuma tarefa disponível."}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="my" className="space-y-4">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Filtered view of tasks assigned to you would appear here.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Filtered view of upcoming tasks would appear here.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Filtered view of completed tasks would appear here.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
