"use client"

import { useState } from "react"
import { deleteTarefa } from "../api"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteTaskDialogProps {
  taskId: string
  taskName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskDeleted: () => void
}

export function DeleteTaskDialog({ taskId, taskName, open, onOpenChange, onTaskDeleted }: DeleteTaskDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDeleteTask() {
    try {
      setIsDeleting(true)
      const success = await deleteTarefa(taskId)

      if (success) {
        toast({
          title: "Tarefa excluída com sucesso!",
          description: `A tarefa "${taskName}" foi excluída.`,
        })
        onTaskDeleted()
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao excluir tarefa",
          description: "A tarefa não foi encontrada ou já foi excluída.",
        })
      }
      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error)
      toast({
        variant: "destructive",
        title: "Erro ao excluir tarefa",
        description: "Ocorreu um erro ao tentar excluir a tarefa. Verifique o console para mais detalhes.",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente a tarefa "{taskName}" e removerá seus dados
            do servidor.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDeleteTask()
            }}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
