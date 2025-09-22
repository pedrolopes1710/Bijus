import type { Activity, Task } from "./types"

// Interface para os dados da API de tarefas
export interface ApiTask {
  id: string
  nome: string
  status: string
  descricao?: string // Campo pode estar presente como descricao
  description?: string // Ou como description
  atividadeId: string
}

// Interface para os dados da API de atividades
export interface ApiActivity {
  id: string
  nomeAtividade: string
  descricaoAtividade: string
  dataInicioAtividade: string
  dataFimAtividade: string
  progress: number
}

// Interface para criar uma tarefa
export interface CreateTarefaDto {
  nome: string
  descricao: string // A API espera receber descricao
  status: string
  atividadeId?: string
}

// Interface para atualizar uma tarefa
export interface UpdateTarefaDto {
  id: string
  nome: string
  descricao: string // A API espera receber descricao
  status: string
  atividadeId?: string
}

// Interface para atualizar apenas o status de uma tarefa
export interface UpdateTaskStatusDto {
  id: string
  status: string
}

const TAREFAS_URL = "http://localhost:5225/api/Tarefas"
const ATIVIDADES_URL = "http://localhost:5225/api/Atividades"

// Status disponíveis na API
export const AVAILABLE_STATUSES = ["Terminado", "Por_Comecar", "A_Decorrer"]

// Função para mapear o status da API para o formato da aplicação
function mapStatus(apiStatus: string): "In Progress" | "Not Started" | "Completed" {
  const statusMap: Record<string, "In Progress" | "Not Started" | "Completed"> = {
    Por_Começar: "Not Started",
    Por_Comecar: "Not Started",
    A_Decorrer: "In Progress",
    Terminado: "Completed",
  }

  return statusMap[apiStatus] || "Not Started"
}

// Função para buscar todas as tarefas
export async function fetchTasks(): Promise<ApiTask[]> {
  try {
    const response = await fetch(TAREFAS_URL)
    if (!response.ok) {
      throw new Error(`Erro ao buscar tarefas: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error)
    throw error
  }
}

// Função para buscar todos os status disponíveis
export async function fetchAvailableStatuses(): Promise<string[]> {
  return AVAILABLE_STATUSES
}

// Função para buscar todas as atividades
export async function fetchActivities(): Promise<ApiActivity[]> {
  try {
    const response = await fetch(ATIVIDADES_URL)
    if (!response.ok) {
      throw new Error(`Erro ao buscar atividades: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Erro ao buscar atividades:", error)
    throw error
  }
}

// Função para buscar os detalhes de uma atividade
export async function fetchActivity(id: string): Promise<ApiActivity | null> {
  try {
    const response = await fetch(`${ATIVIDADES_URL}/${id}`)
    if (!response.ok) {
      throw new Error(`Erro ao buscar atividade: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Erro ao buscar atividade ${id}:`, error)
    return null
  }
}

// Função para criar uma nova tarefa
export async function createTarefa(taskData: CreateTarefaDto): Promise<ApiTask> {
  try {
    console.log("Enviando dados para API:", taskData)

    const response = await fetch(TAREFAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Resposta da API:", errorText)
      throw new Error(`Erro ao criar tarefa: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao criar tarefa:", error)
    throw error
  }
}

// Função para atualizar uma tarefa existente
export async function updateTask(dto: UpdateTarefaDto): Promise<ApiTask> {
  try {
    // Verificar se a descrição está vazia
    if (!dto.descricao || dto.descricao.trim() === "") {
      throw new Error("A descrição não pode estar vazia")
    }

    console.log("Enviando dados para API (atualização):", dto)

    const response = await fetch(`${TAREFAS_URL}/${dto.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Resposta da API:", errorText)
      throw new Error(`Erro ao atualizar tarefa: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error)
    throw error
  }
}

// Função para atualizar apenas o status de uma tarefa
export async function updateTaskStatus(taskId: string, newStatus: string): Promise<ApiTask> {
  try {
    console.log(`Buscando tarefa ${taskId} para atualizar status para ${newStatus}`)

    // Primeiro, buscar a tarefa atual para obter todos os dados
    const response = await fetch(`${TAREFAS_URL}/${taskId}`)
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Erro ao buscar tarefa ${taskId}:`, errorText)
      throw new Error(`Erro ao buscar tarefa: ${response.status}`)
    }

    const currentTask = await response.json()
    console.log("Tarefa atual:", currentTask)

    // Determinar qual campo de descrição usar
    const descricao = currentTask.descricao || currentTask.description || ""

    // Atualizar apenas o status, mantendo os outros campos inalterados
    const updateData = {
      id: taskId,
      nome: currentTask.nome,
      descricao: descricao,
      status: newStatus,
      atividadeId: currentTask.atividadeId || null,
    }

    console.log("Dados para atualização de status:", updateData)

    // Enviar a atualização
    const updateResponse = await fetch(`${TAREFAS_URL}/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      console.error("Resposta da API (erro):", errorText)
      throw new Error(`Erro ao atualizar status da tarefa: ${updateResponse.status}`)
    }

    const updatedTask = await updateResponse.json()
    console.log("Tarefa atualizada com sucesso:", updatedTask)
    return updatedTask
  } catch (error) {
    console.error("Erro ao atualizar status da tarefa:", error)
    throw error
  }
}

// Função para mapear uma tarefa da API para o formato da aplicação
export function mapApiTaskToTask(apiTask: ApiTask): Task {
  // Determinar qual campo de descrição usar
  const description = apiTask.description || apiTask.descricao || ""

  return {
    id: apiTask.id,
    title: apiTask.nome,
    descricao: description,
    project: "Projeto Padrão",
    status: mapStatus(apiTask.status),
    dataInicio: new Date().toISOString(),
    dataFim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    assignee: {
      name: "Não atribuído",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    atividadeId: apiTask.atividadeId,
  }
}

// Função para agrupar tarefas por atividade
export async function groupTasksByActivity(apiTasks: ApiTask[]): Promise<Activity[]> {
  // Extrair IDs únicos de atividades
  const activityIds = [...new Set(apiTasks.map((task) => task.atividadeId))].filter(Boolean)

  // Criar um mapa para armazenar atividades
  const activitiesMap = new Map<string, Activity>()

  // Buscar detalhes de cada atividade
  for (const activityId of activityIds) {
    const activityData = await fetchActivity(activityId)

    if (activityData) {
      activitiesMap.set(activityId, {
        id: activityData.id,
        name: activityData.nomeAtividade,
        description: activityData.descricaoAtividade,
        dataInicio: activityData.dataInicioAtividade,
        dataFim: activityData.dataFimAtividade,
        tasks: [],
        progress: activityData.progress,
      })
    } else {
      // Criar uma atividade padrão se não conseguirmos buscar os detalhes
      activitiesMap.set(activityId, {
        id: activityId,
        name: `Atividade ${activityId.substring(0, 8)}...`,
        description: "Detalhes não disponíveis",
        dataInicio: new Date().toISOString(),
        dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        tasks: [],
        progress: 0,
      })
    }
  }

  // Criar uma atividade "Sem atividade" para tarefas sem atividadeId
  const noActivityId = "no-activity"
  activitiesMap.set(noActivityId, {
    id: noActivityId,
    name: "Tarefas sem atividade",
    description: "Tarefas que não estão associadas a nenhuma atividade",
    dataInicio: new Date().toISOString(),
    dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    tasks: [],
    progress: 0,
  })

  // Mapear e agrupar as tarefas por atividade
  for (const apiTask of apiTasks) {
    const task = mapApiTaskToTask(apiTask)
    const activityId = apiTask.atividadeId || noActivityId

    if (activitiesMap.has(activityId)) {
      const activity = activitiesMap.get(activityId)!

      // Atualizar as datas da tarefa com as datas da atividade
      task.dataInicio = activity.dataInicio
      task.dataFim = activity.dataFim

      activity.tasks.push(task)
    } else {
      // Se por algum motivo a atividade não estiver no mapa, adicionar à categoria "Sem atividade"
      const noActivity = activitiesMap.get(noActivityId)!
      noActivity.tasks.push(task)
    }
  }

  // Converter o mapa em um array de atividades
  return Array.from(activitiesMap.values())
}

// Função para buscar tarefas e agrupá-las por atividade
export async function fetchTasksGroupedByActivity(): Promise<Activity[]> {
  try {
    const tasks = await fetchTasks()
    return await groupTasksByActivity(tasks)
  } catch (error) {
    console.error("Erro ao buscar e agrupar tarefas:", error)
    throw error
  }
}

// Deletar uma tarefa
export async function deleteTarefa(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${TAREFAS_URL}/${id}`, {
      method: "DELETE",
    })

    if (response.status === 404) return false
    if (!response.ok) {
      throw new Error(`Erro ao deletar tarefa: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error)
    throw error
  }
}
