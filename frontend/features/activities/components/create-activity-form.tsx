"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { createActivity } from "../api"
import type { CreateActivityDto } from "../types"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { fetchTasks } from "../../tasks/api"
import { fetchDeliverables } from "../../deliverables/api"
import { fetchProfiles } from "../../profiles/api"
import type { ApiTask } from "../../tasks/api"
import type { Deliverable } from "../../deliverables/types"
import type { Profile } from "../../profiles/types"
import { Search } from "lucide-react"

interface CreateActivityFormProps {
  onActivityCreated: () => void
  onCancel: () => void
}

export function CreateActivityForm({ onActivityCreated, onCancel }: CreateActivityFormProps) {
  const [nomeAtividade, setNomeAtividade] = useState("")
  const [descricaoAtividade, setDescricaoAtividade] = useState("")
  const [dataInicio, setDataInicio] = useState<Date | undefined>(new Date())
  const [dataFim, setDataFim] = useState<Date | undefined>(new Date())
  const [orcamentoId, setOrcamentoId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados para as listas de seleção múltipla
  const [tarefasIds, setTarefasIds] = useState<string[]>([])
  const [entregaveisIds, setEntregaveisIds] = useState<string[]>([])
  const [perfisIds, setPerfisIds] = useState<string[]>([])

  // Estados para os dados das listas
  const [tarefas, setTarefas] = useState<ApiTask[]>([])
  const [entregaveis, setEntregaveis] = useState<Deliverable[]>([])
  const [perfis, setPerfis] = useState<Profile[]>([])

  // Estados para busca
  const [tarefasSearch, setTarefasSearch] = useState("")
  const [entregaveisSearch, setEntregaveisSearch] = useState("")
  const [perfisSearch, setPerfisSearch] = useState("")

  // Estados para indicar carregamento
  const [loadingTarefas, setLoadingTarefas] = useState(false)
  const [loadingEntregaveis, setLoadingEntregaveis] = useState(false)
  const [loadingPerfis, setLoadingPerfis] = useState(false)

  // Buscar dados para os selects
  useEffect(() => {
    async function loadData() {
      try {
        // Carregar tarefas
        setLoadingTarefas(true)
        const tarefasData = await fetchTasks()
        setTarefas(tarefasData)
        setLoadingTarefas(false)

        // Carregar entregáveis
        setLoadingEntregaveis(true)
        try {
          const entregaveisData = await fetchDeliverables()
          setEntregaveis(entregaveisData)
        } catch (error) {
          console.error("Erro ao carregar entregáveis:", error)
        }
        setLoadingEntregaveis(false)

        // Carregar perfis
        setLoadingPerfis(true)
        try {
          const perfisData = await fetchProfiles()
          setPerfis(perfisData)
        } catch (error) {
          console.error("Erro ao carregar perfis:", error)
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
  }, [])

  // Função para lidar com o envio do formulário
  async function handleCreateActivity() {
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

    // Verificar se a data de fim é posterior à data de início
    if (dataFim < dataInicio) {
      toast({
        variant: "destructive",
        title: "Data inválida",
        description: "A data de fim deve ser posterior à data de início.",
      })
      return
    }

    // Validar campos obrigatórios de seleção múltipla
    if (!orcamentoId.trim()) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, preencha o ID do orçamento.",
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

      // Preparar os dados para envio
      const activityData: CreateActivityDto = {
        nomeAtividade,
        descricaoAtividade,
        dataInicioAtividade: dataInicio.toISOString(),
        dataFimAtividade: dataFim.toISOString(),
        orcamentoId: orcamentoId.trim(),
        tarefasIds,
        entregaveisIds,
        perfisIds,
      }

      // Criar a atividade
      await createActivity(activityData)

      toast({
        title: "Atividade criada com sucesso!",
        description: `A atividade "${nomeAtividade}" foi criada.`,
      })

      // Limpar formulário
      setNomeAtividade("")
      setDescricaoAtividade("")
      setDataInicio(new Date())
      setDataFim(new Date())
      setOrcamentoId("")
      setTarefasIds([])
      setEntregaveisIds([])
      setPerfisIds([])

      // Notificar componente pai
      onActivityCreated()
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

  // Funções para selecionar/desselecionar todos
  const selectAllTarefas = () => {
    const filteredTarefas = tarefas
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
      .filter((perfil) => perfil.nome?.toLowerCase().includes(perfisSearch.toLowerCase()))
      .map((perfil) => perfil.id)
    setPerfisIds(filteredPerfis)
  }

  const deselectAllPerfis = () => {
    setPerfisIds([])
  }

  // Filtrar itens com base na busca
  const filteredTarefas = tarefas.filter((tarefa) => tarefa.nome?.toLowerCase().includes(tarefasSearch.toLowerCase()))

  const filteredEntregaveis = entregaveis.filter((entregavel) =>
    entregavel.nome?.toLowerCase().includes(entregaveisSearch.toLowerCase()),
  )

  const filteredPerfis = perfis.filter((perfil) => perfil.nome?.toLowerCase().includes(perfisSearch.toLowerCase()))

  return (
    <div className="flex flex-col h-full max-h-[90vh]">
      <div className="p-4 border-b bg-background sticky top-0 z-10">
        <h2 className="text-lg font-semibold">Criar Nova Atividade</h2>
      </div>

      <div className="overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            <label htmlFor="orcamentoId" className="text-sm font-medium">
              ID do Orçamento *
            </label>
            <Input
              id="orcamentoId"
              placeholder="Digite o ID do orçamento"
              value={orcamentoId}
              onChange={(e) => setOrcamentoId(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="space-y-2">
            <label htmlFor="descricaoAtividade" className="text-sm font-medium">
              Descrição *
            </label>
            <Textarea
              id="descricaoAtividade"
              placeholder="Descreva os detalhes da atividade"
              value={descricaoAtividade}
              onChange={(e) => setDescricaoAtividade(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <label htmlFor="dataInicio" className="text-sm font-medium">
              Data de Início *
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !dataInicio && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataInicio ? format(dataInicio, "PPP") : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dataInicio} onSelect={setDataInicio} initialFocus />
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
                  className={cn("w-full justify-start text-left font-normal", !dataFim && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataFim ? format(dataFim, "PPP") : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dataFim} onSelect={setDataFim} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Três colunas lado a lado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Seção de Tarefas */}
          <div className="border rounded-md">
            <div className="p-2 bg-muted rounded-t-md flex justify-between items-center">
              <h3 className="text-sm font-medium">
                Tarefas * <span className="text-xs text-muted-foreground">({tarefasIds.length})</span>
              </h3>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={selectAllTarefas}
                  className="h-6 text-xs px-2"
                  disabled={loadingTarefas}
                >
                  Todos
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={deselectAllTarefas}
                  className="h-6 text-xs px-2"
                  disabled={tarefasIds.length === 0}
                >
                  Limpar
                </Button>
              </div>
            </div>
            <div className="p-2">
              <div className="relative mb-2">
                <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                <Input
                  placeholder="Buscar tarefas..."
                  value={tarefasSearch}
                  onChange={(e) => setTarefasSearch(e.target.value)}
                  className="pl-7 h-8 text-xs"
                />
              </div>
              <div style={{ height: "180px", overflowY: "auto" }} className="pr-1">
                {loadingTarefas ? (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    Carregando...
                  </div>
                ) : filteredTarefas.length > 0 ? (
                  filteredTarefas.map((tarefa) => (
                    <div key={tarefa.id} className="flex items-center space-x-2 py-1">
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
                      <label htmlFor={`tarefa-${tarefa.id}`} className="text-xs leading-none cursor-pointer truncate">
                        {tarefa.nome || `Tarefa ${tarefa.id.substring(0, 8)}...`}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    Nenhuma tarefa encontrada.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Seção de Entregáveis */}
          <div className="border rounded-md">
            <div className="p-2 bg-muted rounded-t-md flex justify-between items-center">
              <h3 className="text-sm font-medium">
                Entregáveis * <span className="text-xs text-muted-foreground">({entregaveisIds.length})</span>
              </h3>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={selectAllEntregaveis}
                  className="h-6 text-xs px-2"
                  disabled={loadingEntregaveis}
                >
                  Todos
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={deselectAllEntregaveis}
                  className="h-6 text-xs px-2"
                  disabled={entregaveisIds.length === 0}
                >
                  Limpar
                </Button>
              </div>
            </div>
            <div className="p-2">
              <div className="relative mb-2">
                <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                <Input
                  placeholder="Buscar entregáveis..."
                  value={entregaveisSearch}
                  onChange={(e) => setEntregaveisSearch(e.target.value)}
                  className="pl-7 h-8 text-xs"
                />
              </div>
              <div style={{ height: "180px", overflowY: "auto" }} className="pr-1">
                {loadingEntregaveis ? (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    Carregando...
                  </div>
                ) : filteredEntregaveis.length > 0 ? (
                  filteredEntregaveis.map((entregavel) => (
                    <div key={entregavel.id} className="flex items-center space-x-2 py-1">
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
                        className="text-xs leading-none cursor-pointer truncate"
                      >
                        {entregavel.nome || `Entregável ${entregavel.id.substring(0, 8)}...`}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    Nenhum entregável encontrado.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Seção de Perfis */}
          <div className="border rounded-md">
            <div className="p-2 bg-muted rounded-t-md flex justify-between items-center">
              <h3 className="text-sm font-medium">
                Perfis * <span className="text-xs text-muted-foreground">({perfisIds.length})</span>
              </h3>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={selectAllPerfis}
                  className="h-6 text-xs px-2"
                  disabled={loadingPerfis}
                >
                  Todos
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={deselectAllPerfis}
                  className="h-6 text-xs px-2"
                  disabled={perfisIds.length === 0}
                >
                  Limpar
                </Button>
              </div>
            </div>
            <div className="p-2">
              <div className="relative mb-2">
                <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                <Input
                  placeholder="Buscar perfis..."
                  value={perfisSearch}
                  onChange={(e) => setPerfisSearch(e.target.value)}
                  className="pl-7 h-8 text-xs"
                />
              </div>
              <div style={{ height: "180px", overflowY: "auto" }} className="pr-1">
                {loadingPerfis ? (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    Carregando...
                  </div>
                ) : filteredPerfis.length > 0 ? (
                  filteredPerfis.map((perfil) => (
                    <div key={perfil.id} className="flex items-center space-x-2 py-1">
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
                      <label htmlFor={`perfil-${perfil.id}`} className="text-xs leading-none cursor-pointer truncate">
                        {perfil.nome || `Perfil ${perfil.id.substring(0, 8)}...`}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    Nenhum perfil encontrado.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t bg-background sticky bottom-0 flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button onClick={handleCreateActivity} disabled={isSubmitting}>
          {isSubmitting ? "Criando..." : "Criar Atividade"}
        </Button>
      </div>
    </div>
  )
}
