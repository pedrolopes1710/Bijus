"use client"

import { useState } from "react"
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
import { Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { deleteOrcamento } from "../api"
import type { Orcamento } from "../types"

interface DeleteOrcamentoDialogProps {
  orcamento: Orcamento
  onOrcamentoExcluido: () => void
}

export function DeleteOrcamentoDialog({ orcamento, onOrcamentoExcluido }: DeleteOrcamentoDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Handle deletion
  async function handleDelete() {
    try {
      setIsDeleting(true)

      await deleteOrcamento(orcamento.id)

      // Show success message
      toast({
        title: "Budget deleted successfully!",
        description: `The budget for category "${orcamento.rubrica.nome}" has been deleted.`,
      })

      // Close the dialog
      setIsOpen(false)

      // Notify the parent component to update the list
      onOrcamentoExcluido()
    } catch (error) {
      console.error("Erro ao excluir orçamento:", error)
      toast({
        variant: "destructive",
        title: "Error deleting budget",
        description: "An error occurred while deleting the budget. Please try again.",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-100">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Excluir</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Budget</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the budget for category "{orcamento.rubrica.nome}" with the amount of{" "}
            {orcamento.gastoPlaneado.toLocaleString("en-US", {
              style: "currency",
              currency: "EUR",
            })}
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Budget"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
