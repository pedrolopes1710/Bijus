"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { updateTaskStatus, AVAILABLE_STATUSES } from "../api"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

interface TaskStatusUpdateProps {
  taskId: string
  currentStatus: string
  onStatusUpdated: () => void
}

export function TaskStatusUpdate({ taskId, currentStatus, onStatusUpdated }: TaskStatusUpdateProps) {
  const [open, setOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Mapear o status para um formato mais legível
  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ")
  }

  // Obter a cor do badge com base no status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "A_Decorrer":
        return "bg-blue-500/20 text-blue-700 hover:bg-blue-500/30"
      case "Por_Comecar":
        return "bg-slate-500/20 text-slate-700 hover:bg-slate-500/30"
      case "Terminado":
        return "bg-green-500/20 text-green-700 hover:bg-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-700 hover:bg-gray-500/30"
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) {
      setOpen(false)
      return
    }

    try {
      setIsUpdating(true)
      console.log(`Atualizando status da tarefa ${taskId} para ${newStatus}`)
      await updateTaskStatus(taskId, newStatus)
      toast({
        title: "Status atualizado",
        description: `Status da tarefa alterado para ${formatStatus(newStatus)}.`,
      })
      onStatusUpdated()
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da tarefa.",
      })
    } finally {
      setIsUpdating(false)
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", getStatusColor(currentStatus))}
          disabled={isUpdating}
        >
          {formatStatus(currentStatus)}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar status..." />
          <CommandList>
            <CommandEmpty>Nenhum status encontrado.</CommandEmpty>
            <CommandGroup>
              {AVAILABLE_STATUSES.map((status) => (
                <CommandItem key={status} value={status} onSelect={() => handleStatusChange(status)}>
                  <Check className={cn("mr-2 h-4 w-4", status === currentStatus ? "opacity-100" : "opacity-0")} />
                  <Badge variant="outline" className={cn("mr-2", getStatusColor(status))}>
                    {formatStatus(status)}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
