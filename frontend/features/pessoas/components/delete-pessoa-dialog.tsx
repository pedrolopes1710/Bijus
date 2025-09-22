"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Trash2 } from "lucide-react"
import { deletePessoa } from "../api"
import type { Pessoa } from "../types"

interface DeletePessoaDialogProps {
  pessoa: Pessoa | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPessoaDeleted: () => void
}

export function DeletePessoaDialog({ pessoa, open, onOpenChange, onPessoaDeleted }: DeletePessoaDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!pessoa) return

    try {
      setIsDeleting(true)
      await deletePessoa(pessoa.id)

      toast({
        title: "Person deleted successfully",
        description: `${pessoa.nome} has been removed from the system. Any associated contract has been deactivated for historical purposes.`,
      })

      onPessoaDeleted()
      onOpenChange(false)
    } catch (error) {
      console.error("Error deleting person:", error)
      toast({
        variant: "destructive",
        title: "Error deleting person",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            Delete Person
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{pessoa?.nome}</strong>? This action cannot be undone and will
            permanently remove the person from the system. Any associated contract will be deactivated for historical
            purposes.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Person
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
