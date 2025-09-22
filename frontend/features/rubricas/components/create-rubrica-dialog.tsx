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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "@/components/ui/use-toast"
import { createRubrica } from "../api"

// Define the form validation schema
const formSchema = z.object({
  nome: z.string().min(3, {
    message: "O nome da rubrica deve ter pelo menos 3 caracteres.",
  }),
})

type FormValues = z.infer<typeof formSchema>

interface CreateRubricaDialogProps {
  onRubricaCreated: () => void
}

export function CreateRubricaDialog({ onRubricaCreated }: CreateRubricaDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
    },
  })

  // Handle form submission
  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true)

      await createRubrica(values)

      // Show success message
      toast({
        title: "Category created successfully!",
        description: `The category "${values.nome}" has been created.`,
      })

      // Reset the form
      form.reset()

      // Close the dialog
      setIsOpen(false)

      // Notify the parent component to update the list
      onRubricaCreated()
    } catch (error) {
      console.error("Erro ao criar rubrica:", error)
      toast({
        variant: "destructive",
        title: "Error creating category",
        description: "An error occurred while creating the category. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>Fill in the field below to create a new budget category.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
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
                {isSubmitting ? "Creating..." : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
