"use client"

import { useState, useEffect } from "react"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "@/components/ui/use-toast"
import { createOrcamento } from "../api"
import { fetchRubricas } from "@/features/rubricas/api"
import type { Rubrica } from "@/features/rubricas/types"
import type { Activity } from "@/features/activities/types"
import { CreateRubricaDialog } from "@/features/rubricas/components/create-rubrica-dialog"

// Define the form validation schema
const formSchema = z.object({
  gastoPlaneado: z.coerce
    .number({
      required_error: "O valor do gasto planeado é obrigatório.",
      invalid_type_error: "O valor deve ser um número.",
    })
    .min(0.01, {
      message: "O valor deve ser maior que zero.",
    }),
  rubricaId: z.string({
    required_error: "Por favor selecione uma rubrica.",
  }),
  atividadeId: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface CreateOrcamentoDialogProps {
  onOrcamentoCriado: (orcamentoId: string) => void
}

export function CreateOrcamentoDialog({ onOrcamentoCriado }: CreateOrcamentoDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rubricas, setRubricas] = useState<Rubrica[]>([])
  const [atividades, setAtividades] = useState<Activity[]>([])
  const [loadingRubricas, setLoadingRubricas] = useState(false)
  const [loadingAtividades, setLoadingAtividades] = useState(false)
  const [showCreateRubrica, setShowCreateRubrica] = useState(false)

  // Initialize the form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gastoPlaneado: 0,
      rubricaId: "defaultRubricaId", // Updated default value to be a non-empty string
      atividadeId: "none",
    },
  })

  // Load rubricas and atividades when dialog opens
  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        try {
          setLoadingRubricas(true)
          setLoadingAtividades(true)

          // Load rubricas
          const rubricasData = await fetchRubricas()
          setRubricas(rubricasData)

        } catch (error) {
          console.error("Error loading data:", error)
          toast({
            variant: "destructive",
            title: "Error loading data",
            description: "Could not load categories or activities.",
          })
        } finally {
          setLoadingRubricas(false)
          setLoadingAtividades(false)
        }
      }

      loadData()
    }
  }, [isOpen])

  // Handle form submission
  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true)

      // Create the DTO to send to the API
      const createDto = {
        gastoPlaneado: values.gastoPlaneado,
        rubricaId: values.rubricaId,
        // Only include atividadeId if it's defined and not empty and not "none"
        ...(values.atividadeId &&
          values.atividadeId !== "" &&
          values.atividadeId !== "none" && { atividadeId: values.atividadeId }),
      }

      const createdOrcamento = await createOrcamento(createDto)

      // Show success message
      toast({
        title: "Budget created successfully!",
        description: `The budget has been created with the amount of ${values.gastoPlaneado.toLocaleString("en-US", {
          style: "currency",
          currency: "EUR",
        })}.`,
      })

      // Reset the form
      form.reset({
        gastoPlaneado: 0,
        rubricaId: "defaultRubricaId",
        atividadeId: "none",
      })

      // Close the dialog
      setIsOpen(false)

      // Notify the parent component to update the list
      onOrcamentoCriado(createdOrcamento.id)
    } catch (error) {
      console.error("Erro ao criar orçamento:", error)
      toast({
        variant: "destructive",
        title: "Error creating budget",
        description: "An error occurred while creating the budget. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle rubrica creation
  const handleRubricaCreated = async () => {
    setShowCreateRubrica(false)

    // Reload rubricas
    try {
      setLoadingRubricas(true)
      const rubricasData = await fetchRubricas()
      setRubricas(rubricasData)
    } catch (error) {
      console.error("Error reloading rubricas:", error)
    } finally {
      setLoadingRubricas(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Budget
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>Fill in the fields below to create a new budget.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="gastoPlaneado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Planned Expense (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter planned amount"
                        {...field}
                        value={field.value === 0 ? "0" : field.value.toString()}
                        onChange={(e) => {
                          const value = e.target.value === "" ? 0 : Number(e.target.value)
                          field.onChange(value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rubricaId"
                  render={({ field }) => (
                    <FormItem className="flex-1 mr-2">
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={loadingRubricas ? "Loading categories..." : "Select a category"}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rubricas.map((rubrica) => (
                            <SelectItem key={rubrica.id} value={rubrica.id}>
                              {rubrica.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-6">
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateRubrica(true)}>
                    <Plus className="h-3 w-3 mr-1" />
                    New
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Budget"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog for creating a new rubrica */}
      {showCreateRubrica && <CreateRubricaDialog onRubricaCreated={handleRubricaCreated} />}
    </>
  )
}
