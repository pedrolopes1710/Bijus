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
import { Pencil } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "@/components/ui/use-toast"
import { fetchOrcamento, updateOrcamento } from "../api"
import type { Orcamento } from "../types"
import { fetchRubricas } from "@/features/rubricas/api"
import type { Rubrica } from "@/features/rubricas/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define the form validation schema
const formSchema = z.object({
  gastoPlaneado: z.coerce
    .number({
      required_error: "Planned expense amount is required.",
      invalid_type_error: "Value must be a number.",
    })
    .positive({
      message: "Value must be positive.",
    }),
  rubricaId: z.string({
    required_error: "Please select a category.",
  }),
})

type FormValues = z.infer<typeof formSchema>

interface EditOrcamentoDialogProps {
  orcamento: Orcamento
  onOrcamentoAtualizado: () => void
}

export function EditOrcamentoDialog({ orcamento, onOrcamentoAtualizado }: EditOrcamentoDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rubricas, setRubricas] = useState<Rubrica[]>([])

  // Initialize the form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gastoPlaneado: orcamento.gastoPlaneado,
      rubricaId: orcamento.rubrica.id,
    },
  })

  // Load data when dialog opens
  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        try {
          setIsLoading(true)

          // Load rubricas
          const rubricasData = await fetchRubricas()
          setRubricas(rubricasData)

          // Load current orcamento data
          const orcamentoData = await fetchOrcamento(orcamento.id)

          // Update form values
          form.reset({
            gastoPlaneado: orcamentoData.gastoPlaneado,
            rubricaId: orcamentoData.rubrica.id,
          })
        } catch (error) {
          console.error("Error loading data:", error)
          toast({
            variant: "destructive",
            title: "Error loading data",
            description: "Could not load the required data.",
          })
        } finally {
          setIsLoading(false)
        }
      }

      loadData()
    }
  }, [isOpen, orcamento.id, form])

  // Handle form submission
  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true)

      // Create the DTO to send to the API
      const updateDto = {
        gastoPlaneado: values.gastoPlaneado,
        rubricaId: values.rubricaId,
      }

      await updateOrcamento(orcamento.id, updateDto)

      // Show success message
      toast({
        title: "Budget updated successfully!",
        description: `The budget has been updated with the amount of ${values.gastoPlaneado.toLocaleString("en-US", {
          style: "currency",
          currency: "EUR",
        })}.`,
      })

      // Close the dialog
      setIsOpen(false)

      // Notify the parent component to update the list
      onOrcamentoAtualizado()
    } catch (error) {
      console.error("Error updating budget:", error)
      toast({
        variant: "destructive",
        title: "Error updating budget",
        description: "An error occurred while updating the budget. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Budget</DialogTitle>
          <DialogDescription>Modify the fields below to update the budget.</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="py-6 text-center">Loading...</div>
        ) : (
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
                        min="0"
                        placeholder="Enter planned amount"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                          field.onChange(value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rubricaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
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
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
