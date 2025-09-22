"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { CalendarIcon, Loader2, FileText, Plus, Unlink, Edit, RotateCcw } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { createContrato, associarContrato, removerContrato, updateContrato } from "../api"
import type { Pessoa, CreatingContratoDto, EditingContratoDto } from "../types"

const contractSchema = z.object({
  tipo: z.string().min(1, "Contract type is required"),
  salario: z.number().min(0, "Salary must be positive"),
  dataInicio: z.date({
    required_error: "Start date is required",
  }),
  dataFim: z.date({
    required_error: "End date is required",
  }),
})

const renewContractSchema = z.object({
  tipo: z.string().min(1, "Contract type is required"),
  salario: z.number().min(0, "Salary must be positive"),
  dataFim: z.date({
    required_error: "End date is required",
  }),
})

type ContractFormValues = z.infer<typeof contractSchema>
type RenewContractFormValues = z.infer<typeof renewContractSchema>

interface ManageContractDialogProps {
  pessoa: Pessoa | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onContractUpdated: () => void
}

const TIPOS_CONTRATO = ["Investigador", "Investigador Docente", "Bolseiro"]

export function ManageContractDialog({ pessoa, open, onOpenChange, onContractUpdated }: ManageContractDialogProps) {
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<"create" | "renew" | "edit">("create")

  const createForm = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      tipo: "",
      salario: 0,
      dataInicio: new Date(),
      dataFim: new Date(),
    },
  })

  const renewForm = useForm<RenewContractFormValues>({
    resolver: zodResolver(renewContractSchema),
    defaultValues: {
      tipo: "",
      salario: 0,
      dataFim: new Date(),
    },
  })

  const editForm = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      tipo: "",
      salario: 0,
      dataInicio: new Date(),
      dataFim: new Date(),
    },
  })

  // Reset forms when dialog opens
  useEffect(() => {
    if (open && pessoa) {
      createForm.reset({
        tipo: "",
        salario: 0,
        dataInicio: new Date(),
        dataFim: new Date(),
      })

      if (pessoa.contrato) {
        // Set renew form with current contract data
        renewForm.reset({
          tipo: pessoa.contrato.tipo,
          salario: pessoa.contrato.salario,
          dataFim: new Date(pessoa.contrato.dataFim),
        })

        // Set edit form with current contract data
        editForm.reset({
          tipo: pessoa.contrato.tipo,
          salario: pessoa.contrato.salario,
          dataInicio: new Date(pessoa.contrato.dataInicio),
          dataFim: new Date(pessoa.contrato.dataFim),
        })

        // If person has contract, default to renew tab
        setActiveTab("renew")
      } else {
        // If no contract, default to create tab
        setActiveTab("create")
      }
    }
  }, [open, pessoa])

  const handleRemoveContract = async () => {
    if (!pessoa) return

    try {
      setSubmitting(true)
      await removerContrato(pessoa.id)

      toast({
        title: "Contract removed successfully!",
        description: `Contract has been removed from ${pessoa.nome}.`,
      })

      onContractUpdated()
      onOpenChange(false)
    } catch (error) {
      console.error("Error removing contract:", error)
      toast({
        variant: "destructive",
        title: "Error removing contract",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateAndAssociate = async (values: ContractFormValues) => {
    if (!pessoa) return

    try {
      setSubmitting(true)

      // Create new contract
      const newContractData: CreatingContratoDto = {
        tipo: values.tipo,
        salario: values.salario,
        dataInicio: values.dataInicio.toISOString(),
        dataFim: values.dataFim.toISOString(),
      }

      const newContract = await createContrato(newContractData)

      // Associate with person
      await associarContrato(pessoa.id, newContract.id)

      toast({
        title: "Contract created and associated!",
        description: `New contract has been created and associated with ${pessoa.nome}.`,
      })

      onContractUpdated()
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating and associating contract:", error)
      toast({
        variant: "destructive",
        title: "Error creating contract",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleRenewContract = async (values: RenewContractFormValues) => {
    if (!pessoa || !pessoa.contrato) return

    try {
      setSubmitting(true)

      // Update existing contract
      const updateData: EditingContratoDto = {
        id: pessoa.contrato.id,
        tipo: values.tipo,
        salario: values.salario,
        dataInicio: pessoa.contrato.dataInicio, // Keep original start date
        dataFim: values.dataFim.toISOString(),
        ativo: true,
      }

      await updateContrato(updateData)

      toast({
        title: "Contract renewed successfully!",
        description: `Contract has been renewed for ${pessoa.nome}.`,
      })

      onContractUpdated()
      onOpenChange(false)
    } catch (error) {
      console.error("Error renewing contract:", error)
      toast({
        variant: "destructive",
        title: "Error renewing contract",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditContract = async (values: ContractFormValues) => {
    if (!pessoa || !pessoa.contrato) return

    try {
      setSubmitting(true)

      // Update existing contract
      const updateData: EditingContratoDto = {
        id: pessoa.contrato.id,
        tipo: values.tipo,
        salario: values.salario,
        dataInicio: values.dataInicio.toISOString(),
        dataFim: values.dataFim.toISOString(),
        ativo: true,
      }

      await updateContrato(updateData)

      toast({
        title: "Contract updated successfully!",
        description: `Contract has been updated for ${pessoa.nome}.`,
      })

      onContractUpdated()
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating contract:", error)
      toast({
        variant: "destructive",
        title: "Error updating contract",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (!pessoa) return null

  const hasContract = !!pessoa.contrato

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Manage Contract - {pessoa.nome}
          </DialogTitle>
          <DialogDescription>Create, renew, edit, or remove a contract for this person.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Contract */}
          <div className="space-y-3">
            <div className="text-sm font-medium">Current Contract</div>
            {hasContract ? (
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{pessoa.contrato.tipo}</Badge>
                  <span className="font-medium">€{pessoa.contrato.salario.toLocaleString()}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(pessoa.contrato.dataInicio).toLocaleDateString()} -{" "}
                  {new Date(pessoa.contrato.dataFim).toLocaleDateString()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveContract}
                  disabled={submitting}
                  className="w-full"
                >
                  <Unlink className="h-4 w-4 mr-2" />
                  Remove Contract
                </Button>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic">No contract associated</div>
            )}
          </div>

          {/* Contract Management Tabs */}
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-6">
            <TabsList className={cn("grid w-full", hasContract ? "grid-cols-2" : "grid-cols-1")}>
              {!hasContract && <TabsTrigger value="create">Create New</TabsTrigger>}
              {hasContract && (
                <>
                  <TabsTrigger value="renew">Renew</TabsTrigger>
                  <TabsTrigger value="edit">Edit Current</TabsTrigger>
                </>
              )}
            </TabsList>

            {!hasContract && (
              <TabsContent value="create" className="space-y-6">
                <Form {...createForm}>
                  <form onSubmit={createForm.handleSubmit(handleCreateAndAssociate)} className="space-y-6">
                    <FormField
                      control={createForm.control}
                      name="tipo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contract Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select contract type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="z-[100]">
                              {TIPOS_CONTRATO.map((tipo) => (
                                <SelectItem key={tipo} value={tipo}>
                                  {tipo}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createForm.control}
                      name="salario"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salary (€)</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="50000"
                              value={field.value || ""}
                              onChange={(e) => {
                                // Permitir apenas números e ponto decimal
                                const value = e.target.value.replace(/[^0-9.]/g, "")
                                field.onChange(value === "" ? 0 : Number.parseFloat(value))
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="dataInicio"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>
                            <Popover modal={false}>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 z-[100]" align="start" side="bottom">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date("1900-01-01")}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={createForm.control}
                        name="dataFim"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>End Date</FormLabel>
                            <Popover modal={false}>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 z-[100]" align="start" side="bottom">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date("1900-01-01")}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <DialogFooter className="mt-6 flex justify-between gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={submitting}
                        className="flex-1"
                      >
                        Close
                      </Button>
                      <Button type="submit" disabled={submitting} className="flex-1">
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Contract
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </TabsContent>
            )}

            {hasContract && (
              <TabsContent value="renew" className="space-y-6">
                <Form {...renewForm}>
                  <form onSubmit={renewForm.handleSubmit(handleRenewContract)} className="space-y-6">
                    <FormField
                      control={renewForm.control}
                      name="tipo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contract Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select contract type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="z-[100]">
                              {TIPOS_CONTRATO.map((tipo) => (
                                <SelectItem key={tipo} value={tipo}>
                                  {tipo}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={renewForm.control}
                      name="salario"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salary (€)</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="50000"
                              value={field.value || ""}
                              onChange={(e) => {
                                // Permitir apenas números e ponto decimal
                                const value = e.target.value.replace(/[^0-9.]/g, "")
                                field.onChange(value === "" ? 0 : Number.parseFloat(value))
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={renewForm.control}
                      name="dataFim"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>New End Date</FormLabel>
                          <Popover modal={false}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 z-[100]" align="start" side="bottom">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  const currentEndDate = pessoa?.contrato
                                    ? new Date(pessoa.contrato.dataFim)
                                    : new Date()
                                  return date < currentEndDate || date < new Date("1900-01-01")
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <div className="text-xs text-muted-foreground mt-1">
                            Current contract ends:{" "}
                            {pessoa?.contrato ? new Date(pessoa.contrato.dataFim).toLocaleDateString() : "N/A"}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter className="mt-6 flex justify-between gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={submitting}
                        className="flex-1"
                      >
                        Close
                      </Button>
                      <Button type="submit" disabled={submitting} className="flex-1">
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Renewing...
                          </>
                        ) : (
                          <>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Renew Contract
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </TabsContent>
            )}

            {hasContract && (
              <TabsContent value="edit" className="space-y-6">
                <Form {...editForm}>
                  <form onSubmit={editForm.handleSubmit(handleEditContract)} className="space-y-6">
                    <FormField
                      control={editForm.control}
                      name="tipo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contract Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select contract type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="z-[100]">
                              {TIPOS_CONTRATO.map((tipo) => (
                                <SelectItem key={tipo} value={tipo}>
                                  {tipo}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editForm.control}
                      name="salario"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salary (€)</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="50000"
                              value={field.value || ""}
                              onChange={(e) => {
                                // Permitir apenas números e ponto decimal
                                const value = e.target.value.replace(/[^0-9.]/g, "")
                                field.onChange(value === "" ? 0 : Number.parseFloat(value))
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={editForm.control}
                        name="dataInicio"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>
                            <Popover modal={false}>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 z-[100]" align="start" side="bottom">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date("1900-01-01")}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={editForm.control}
                        name="dataFim"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>End Date</FormLabel>
                            <Popover modal={false}>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 z-[100]" align="start" side="bottom">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date("1900-01-01")}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <DialogFooter className="mt-6 flex justify-between gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={submitting}
                        className="flex-1"
                      >
                        Close
                      </Button>
                      <Button type="submit" disabled={submitting} className="flex-1">
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Edit className="h-4 w-4 mr-2" />
                            Update Contract
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
