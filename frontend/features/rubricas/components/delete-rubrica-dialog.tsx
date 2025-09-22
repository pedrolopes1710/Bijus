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
import { deleteRubrica } from "../api"

interface DeleteRubricaDialogProps {
  rubricaId: string
  rubricaName: string
  onRubricaDeleted: () => void
}

export function DeleteRubricaDialog({ rubricaId, rubricaName, onRubricaDeleted }: DeleteRubricaDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Handle deletion
  async function handleDelete() {
    try {
      setIsDeleting(true)

      await deleteRubrica(rubricaId)

      // Show success message
      toast({
        title: "Category deleted successfully!",
        description: `The category "${rubricaName}" has been deleted.`,
      })

      // Close the dialog
      setIsOpen(false)

      // Notify the parent component to update the list
      onRubricaDeleted()
    } catch (error) {
      console.error("Erro ao excluir rubrica:", error)
      toast({
        variant: "destructive",
        title: "Error deleting category",
        description: "An error occurred while deleting the category. Please try again.",
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
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the category "{rubricaName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
