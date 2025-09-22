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
import { updateRubrica, fetchRubrica } from "../api"

// Define the form validation schema
const formSchema = z.object({
  nome: z.string().min(3, {
    message: "O nome da rubrica deve ter pelo menos 3 caracteres.",
  }),
})

type FormValues = z.infer<typeof formSchema>

interface EditRubricaDialogProps {
  rubricaId: string
  rubricaName: string
  onRubricaUpdated: () => void
}

export function EditRubricaDialog({ rubricaId, rubricaName, onRubricaUpdated }: EditRubricaDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize the form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: rubricaName,
    },
  })

  // Load rubrica data when dialog opens
  useEffect(() => {
    if (isOpen && rubricaId) {
      const loadRubrica = async () => {
        try {
          setIsLoading(true)
          const rubrica = await fetchRubrica(rubricaId)
          form.reset({ nome: rubrica.nome })
        } catch (error) {
          console.error("Error loading rubrica:", error)
          toast({
            variant: "destructive",
            title: "Erro ao carregar rubrica",
            description: "Não foi possível carregar os dados da rubrica.",
          })
        } finally {
          setIsLoading(false)
        }
      }

      loadRubrica()
    }
  }, [isOpen, rubricaId, form])

  // Handle form submission
  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true)

      await updateRubrica(rubricaId, values)

      // Show success message
      toast({
        title: "Rubrica atualizada com sucesso!",
        description: `A rubrica foi atualizada para "${values.nome}".`,
      })

      // Close the dialog
      setIsOpen(false)

      // Notify the parent component to update the list
      onRubricaUpdated()
    } catch (error) {
      console.error("Erro ao atualizar rubrica:", error)
      toast({
        variant: "destructive",
        title: "Erro ao atualizar rubrica",
        description: "Ocorreu um erro ao tentar atualizar a rubrica. Tente novamente.",
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
          <span className="sr-only">Editar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Rubrica</DialogTitle>
          <DialogDescription>Modifique o nome da rubrica abaixo.</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="py-6 text-center">Carregando...</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Rubrica</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome da rubrica" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
