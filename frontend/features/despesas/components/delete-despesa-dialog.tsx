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
import { deleteDespesa } from "../api"
import type { Despesa } from "../types"

interface DeleteDespesaDialogProps {
  despesa: Despesa
  onDespesaDeleted: () => void
}

export function DeleteDespesaDialog({ despesa, onDespesaDeleted }: DeleteDespesaDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Handle deletion
  async function handleDelete() {
    try {
      setIsDeleting(true)

      const result = await deleteDespesa(despesa.id)

      if (result.success) {
        // Show success message
        toast({
          title: "Expense deleted successfully!",
          description: `The expense "${despesa.descricao}" has been deleted.`,
        })

        // Close the dialog
        setIsOpen(false)

        // Notify the parent component to update the list
        onDespesaDeleted()
      } else {
        throw new Error(result.message || "Failed to delete expense")
      }
    } catch (error) {
      console.error("Error deleting expense:", error)
      toast({
        variant: "destructive",
        title: "Error deleting expense",
        description: "An error occurred while deleting the expense. Please try again.",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="sr-only">Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Expense</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the expense "{despesa.descricao}" with the amount of{" "}
            {despesa.valor.toLocaleString("pt-PT", {
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
            {isDeleting ? "Deleting..." : "Delete Expense"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
