"use client"

import React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { CalendarIcon, Loader2, Mail, User } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { updatePessoa } from "../api"
import type { Pessoa, EditingPessoaDto } from "../types"

const formSchema = z.object({
  nome: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters long.",
    })
    .max(100, {
      message: "Name cannot be longer than 100 characters.",
    }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  pessoaUltimoPedPagam: z.date({
    required_error: "Last payment request date is required.",
  }),
})

type FormValues = z.infer<typeof formSchema>

interface EditPessoaDialogProps {
  pessoa: Pessoa | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPessoaUpdated: () => void
}

export function EditPessoaDialog({ pessoa, open, onOpenChange, onPessoaUpdated }: EditPessoaDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: pessoa?.nome || "",
      email: pessoa?.email || "",
      pessoaUltimoPedPagam: pessoa?.pessoaUltimoPedPagam ? new Date(pessoa.pessoaUltimoPedPagam) : new Date(),
    },
  })

  // Reset form when pessoa changes
  React.useEffect(() => {
    if (pessoa) {
      form.reset({
        nome: pessoa.nome,
        email: pessoa.email,
        pessoaUltimoPedPagam: new Date(pessoa.pessoaUltimoPedPagam),
      })
    }
  }, [pessoa, form])

  async function onSubmit(values: FormValues) {
    if (!pessoa) return

    try {
      setIsSubmitting(true)

      const editingData: EditingPessoaDto = {
        id: pessoa.id,
        nome: values.nome,
        email: values.email,
        pessoaUltimoPedPagam: values.pessoaUltimoPedPagam.toISOString(),
      }

      await updatePessoa(editingData)

      toast({
        title: "Person updated successfully!",
        description: `${values.nome} has been updated.`,
      })

      onOpenChange(false)
      onPessoaUpdated()
    } catch (error) {
      console.error("Error updating person:", error)
      toast({
        variant: "destructive",
        title: "Error updating person",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!pessoa) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Person
          </DialogTitle>
          <DialogDescription>Update the person's information below.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Silva Santos" {...field} />
                  </FormControl>
                  <FormDescription>Full name as per official documents.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="john.silva@company.com" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>Corporate or personal email for communication.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pessoaUltimoPedPagam"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Last Payment Request</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Select a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Date of the last registered payment request.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Person"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
