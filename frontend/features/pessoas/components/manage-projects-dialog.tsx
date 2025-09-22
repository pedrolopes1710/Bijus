"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { Loader2, FolderOpen, Plus, Minus, Users, AlertTriangle } from "lucide-react"
import { fetchProjetos, associarProjetos, desassociarProjetos, fetchPessoa } from "../api"
import type { Pessoa, Projeto } from "../types"

interface ManageProjectsDialogProps {
  pessoa: Pessoa | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectsUpdated: () => void
}

export function ManageProjectsDialog({ pessoa, open, onOpenChange, onProjectsUpdated }: ManageProjectsDialogProps) {
  const [allProjects, setAllProjects] = useState<Projeto[]>([])
  const [currentPessoa, setCurrentPessoa] = useState<Pessoa | null>(null)
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Load all projects and current pessoa data when dialog opens
  useEffect(() => {
    if (open && pessoa) {
      loadData()
    }
  }, [open, pessoa])

  // Set selected projects when currentPessoa changes
  useEffect(() => {
    if (currentPessoa) {
      const projectIds = currentPessoa.projetos?.map((p) => p.id) || []
      setSelectedProjects(projectIds)
      console.log("Current pessoa projects:", currentPessoa.projetos)
      console.log("Selected project IDs:", projectIds)
    }
  }, [currentPessoa])

  const loadData = async () => {
    if (!pessoa) return

    try {
      setLoading(true)

      // Load both projects and fresh pessoa data
      const [projects, freshPessoaData] = await Promise.all([fetchProjetos(), fetchPessoa(pessoa.id)])

      console.log("=== DEBUG CONTADOR PROJETOS ===")
      console.log("Fresh pessoa data:", freshPessoaData)
      console.log("Projetos da pessoa:", freshPessoaData.projetos)
      console.log("Número de projetos:", freshPessoaData.projetos?.length)
      console.log("================================")

      setAllProjects(projects)
      setCurrentPessoa(freshPessoaData)

      console.log("Loaded projects:", projects)
      console.log("Fresh pessoa data:", freshPessoaData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        variant: "destructive",
        title: "Error loading data",
        description: "Could not load projects and person data.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleProjectToggle = (projectId: string) => {
    const isCurrentlySelected = selectedProjects.includes(projectId)
    const isBolseiro = currentPessoa?.contrato?.tipo?.toLowerCase() === "bolseiro"

    // Se é bolseiro e está tentando adicionar um segundo projeto
    if (isBolseiro && !isCurrentlySelected && selectedProjects.length >= 1) {
      toast({
        variant: "destructive",
        title: "Project limit reached",
        description: "Bolseiros can only be associated with 1 project.",
      })
      return
    }

    setSelectedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId],
    )
  }

  const handleSave = async () => {
    if (!currentPessoa) return

    try {
      setSubmitting(true)

      const currentProjectIds = currentPessoa.projetos?.map((p) => p.id) || []
      const toAssociate = selectedProjects.filter((id) => !currentProjectIds.includes(id))
      const toDisassociate = currentProjectIds.filter((id) => !selectedProjects.includes(id))

      console.log("Current project IDs:", currentProjectIds)
      console.log("Selected projects:", selectedProjects)
      console.log("To associate:", toAssociate)
      console.log("To disassociate:", toDisassociate)

      // Associate new projects
      if (toAssociate.length > 0) {
        await associarProjetos(currentPessoa.id, toAssociate)
      }

      // Disassociate removed projects
      if (toDisassociate.length > 0) {
        await desassociarProjetos(currentPessoa.id, toDisassociate)
      }

      toast({
        title: "Projects updated successfully!",
        description: `Updated project associations for ${currentPessoa.nome}.`,
      })

      // Reload fresh data after save
      await loadData()

      onProjectsUpdated()
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating projects:", error)
      toast({
        variant: "destructive",
        title: "Error updating projects",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (!pessoa || !currentPessoa) return null

  const currentProjectIds = currentPessoa.projetos?.map((p) => p.id) || []
  const currentProjectsCount = Array.isArray(currentPessoa?.projetos) ? currentPessoa.projetos.length : 0
  const toAssociate = selectedProjects.filter((id) => !currentProjectIds.includes(id))
  const toDisassociate = currentProjectIds.filter((id) => !selectedProjects.includes(id))
  const hasChanges = toAssociate.length > 0 || toDisassociate.length > 0
  const isBolseiro = currentPessoa?.contrato?.tipo?.toLowerCase() === "bolseiro"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Manage Projects - {currentPessoa.nome}
          </DialogTitle>
          <DialogDescription>
            Select which projects this person should be associated with.
            {isBolseiro && (
              <span className="block mt-1 text-amber-600 font-medium">
                ⚠️ Bolseiros can only be associated with 1 project.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Contract Type Info */}
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Badge variant={isBolseiro ? "destructive" : "secondary"}>
              {currentPessoa.contrato?.tipo || "Sem contrato"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {isBolseiro ? "Maximum 1 project" : "Unlimited projects"}
            </span>
          </div>

          {/* Current Projects Summary */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Current Projects ({currentProjectsCount})</div>
            {currentPessoa.projetos && currentPessoa.projetos.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {currentPessoa.projetos.map((project) => (
                  <Badge key={project.id} variant="outline">
                    {project.nome}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic">No projects associated</div>
            )}
          </div>

          {/* Bolseiro Warning */}
          {isBolseiro && selectedProjects.length >= 1 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                As a Bolseiro, this person can only be associated with 1 project. Select only the most
                relevant project.
              </AlertDescription>
            </Alert>
          )}

          {/* Changes Preview */}
          {hasChanges && (
            <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium">Pending Changes:</div>
              {toAssociate.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Plus className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Add: {toAssociate.length} project(s)</span>
                </div>
              )}
              {toDisassociate.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Minus className="h-4 w-4 text-red-600" />
                  <span className="text-red-600">Remove: {toDisassociate.length} project(s)</span>
                </div>
              )}
            </div>
          )}

          {/* Available Projects */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Available Projects</div>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : allProjects.length > 0 ? (
              <ScrollArea className="h-48 border rounded-md p-3">
                <div className="space-y-3">
                  {allProjects.map((project) => {
                    const isSelected = selectedProjects.includes(project.id)
                    const isCurrentlyAssociated = currentProjectIds.includes(project.id)
                    const shouldDisable = isBolseiro && !isSelected && selectedProjects.length >= 1

                    return (
                      <div key={project.id} className="flex items-center space-x-3">
                        <Checkbox
                          id={project.id}
                          checked={isSelected}
                          disabled={shouldDisable}
                          onCheckedChange={() => handleProjectToggle(project.id)}
                        />
                        <label
                          htmlFor={project.id}
                          className={`flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer ${
                            shouldDisable ? "opacity-50" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {project.nome}
                            {isCurrentlyAssociated && (
                              <Badge variant="secondary" className="text-xs">
                                Current
                              </Badge>
                            )}
                          </div>
                          {project.descricao && (
                            <div className="text-xs text-muted-foreground mt-1">{project.descricao}</div>
                          )}
                        </label>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-8 w-8 text-muted-foreground mb-2" />
                <div className="text-sm text-muted-foreground">No projects available</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={submitting || !hasChanges} className="flex-1">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
