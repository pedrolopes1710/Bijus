"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { togglePessoaStatus } from "../api"
import type { Pessoa } from "../types"

interface ToggleStatusDialogProps {
  pessoa: Pessoa | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusToggled: () => void
}

export function ToggleStatusDialog({ pessoa, open, onOpenChange, onStatusToggled }: ToggleStatusDialogProps) {
  const [isToggling, setIsToggling] = useState(false)

  const handleToggle = async () => {
    if (!pessoa) return

    try {
      setIsToggling(true)
      await togglePessoaStatus(pessoa.id, !pessoa.ativo)

      toast({
        title: `Person ${pessoa.ativo ? "deactivated" : "activated"} successfully`,
        description: `${pessoa.nome} has been ${pessoa.ativo ? "deactivated" : "activated"}.`,
      })

      onStatusToggled()
      onOpenChange(false)
    } catch (error) {
      console.error("Error toggling person status:", error)
      toast({
        variant: "destructive",
        title: "Error toggling person status",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      })
    } finally {
      setIsToggling(false)
    }
  }

  if (!pessoa) return null

  const isActivating = !pessoa.ativo

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isActivating ? "Activate" : "Deactivate"} Person</DialogTitle>
          <DialogDescription>
            Are you sure you want to {isActivating ? "activate" : "deactivate"} <strong>{pessoa.nome}</strong>?
            {pessoa.contrato && (
              <span className="block mt-2 text-sm">
                The associated contract will also be {isActivating ? "activated" : "deactivated"}.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end space-x-2 pt-5">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant={isActivating ? "default" : "destructive"} onClick={handleToggle} disabled={isToggling}>
            {isToggling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isActivating ? "Activating..." : "Deactivating..."}
              </>
            ) : isActivating ? (
              "Activate"
            ) : (
              "Deactivate"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
