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
import { updateDespesa } from "../api"
import type { Despesa } from "../types"

// Define the form validation schema
const formSchema = z.object({
  descricao: z.string().min(3, {
    message: "Description must be at least 3 characters.",
  }),
  valor: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => {
        const num = Number.parseFloat(val)
        return !isNaN(num) && num >= 0.01
      },
      {
        message: "Amount must be at least 0.01 €.",
      },
    ),
})

type FormValues = z.infer<typeof formSchema>

interface EditDespesaDialogProps {
  despesa: Despesa
  onDespesaUpdated: () => void
}

export function EditDespesaDialog({ despesa, onDespesaUpdated }: EditDespesaDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descricao: despesa.descricao,
      valor: despesa.valor.toString(),
    },
  })

  // Reset form when despesa changes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        descricao: despesa.descricao,
        valor: despesa.valor.toString(),
      })
    }
  }, [despesa, form, isOpen])

  // Handle form submission
  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true)

      // Create the DTO to send to the API
      const updateDto = {
        descricao: values.descricao,
        valor: Number.parseFloat(values.valor),
      }

      await updateDespesa(despesa.id, updateDto)

      // Show success message
      toast({
        title: "Expense updated successfully!",
        description: `The expense has been updated.`,
      })

      // Close the dialog
      setIsOpen(false)

      // Notify the parent component to update the list
      onDespesaUpdated()
    } catch (error) {
      console.error("Error updating expense:", error)
      toast({
        variant: "destructive",
        title: "Error updating expense",
        description: "An error occurred while updating the expense. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-100"
          onClick={(e) => e.stopPropagation()}
        >
          <Pencil className="h-3.5 w-3.5" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogDescription>Update the expense details below.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter expense description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (€)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="Enter expense amount"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value === "" ? "" : e.target.value
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
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
      </DialogContent>
    </Dialog>
  )
}
