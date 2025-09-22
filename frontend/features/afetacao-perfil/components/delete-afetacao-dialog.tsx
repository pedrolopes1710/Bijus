"use client"

import { useState } from "react"
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
import { toast } from "@/components/ui/use-toast"
import { deleteAfetacaoPerfil } from "../api"
import type { AfetacaoPerfil } from "../types"
import { Loader2 } from "lucide-react"

interface DeleteAfetacaoDialogProps {
  afetacao: AfetacaoPerfil | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteAfetacaoDialog({ afetacao, open, onOpenChange, onSuccess }: DeleteAfetacaoDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!afetacao) return

    try {
      setIsDeleting(true)
      await deleteAfetacaoPerfil(afetacao.id)

      toast({
        title: "Afetação deletada com sucesso!",
        description: "A afetação de perfil foi removida.",
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao deletar afetação:", error)
      toast({
        variant: "destructive",
        title: "Erro ao deletar",
        description: "Ocorreu um erro ao tentar deletar a afetação.",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar esta afetação de perfil?
            {afetacao && (
              <div className="mt-2 p-2 bg-muted rounded-md">
                <strong>Pessoa:</strong> {afetacao.pessoaDto.nome}
                <br />
                <strong>Perfil:</strong> {afetacao.perfilDto.descricao}
                <br />
                <strong>Duração:</strong> {afetacao.duracaoMes} meses
                <br />
                <strong>PMs Aprovados:</strong> {afetacao.pMsAprovados}
              </div>
            )}
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
