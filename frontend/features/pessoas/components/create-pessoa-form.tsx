"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { CalendarIcon, User, Briefcase, Mail, CreditCard, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { createContrato, createPessoa } from "../api"
import type { CreatingContratoDto, CreatingPessoaDto } from "../types"

// Schema de validação com Zod (removido o campo ativo da pessoa)
const formSchema = z
  .object({
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
    pessoaCienciaId: z.string().min(1, {
      message: "Science ID is required.",
    }),
    pessoaUltimoPedPagam: z.date({
      required_error: "Last payment request date is required.",
    }),
    contrato: z.object({
      tipo: z.string().min(1, {
        message: "Contract type is required.",
      }),
      salario: z.number().min(0, {
        message: "Salary must be a positive value.",
      }),
      dataInicio: z.date({
        required_error: "Contract start date is required.",
      }),
      dataFim: z.date({
        required_error: "Contract end date is required.",
      }),
      ativo: z.boolean().default(true),
    }),
  })
  .refine((data) => data.contrato.dataFim > data.contrato.dataInicio, {
    message: "End date must be after start date.",
    path: ["contrato", "dataFim"],
  })

type FormValues = z.infer<typeof formSchema>

interface CreatePessoaFormProps {
  onPessoaCreated: () => void
  onCancel: () => void
}

// Tipos de contrato em português
const TIPOS_CONTRATO = [
  { value: "InvestigadorDocente", label: "Investigador Docente" },
  { value: "Investigador", label: "Investigador" },
  { value: "Bolseiro", label: "Bolseiro" },
]

export function CreatePessoaForm({ onPessoaCreated, onCancel }: CreatePessoaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState<"contract" | "person">("contract")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      pessoaCienciaId: "",
      pessoaUltimoPedPagam: new Date(),
      contrato: {
        tipo: "",
        salario: 0,
        dataInicio: new Date(),
        dataFim: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        ativo: true,
      },
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true)
      setCurrentStep("contract")

      // 1. Criar o contrato primeiro
      const contratoData: CreatingContratoDto = {
        tipo: values.contrato.tipo,
        salario: values.contrato.salario,
        dataInicio: values.contrato.dataInicio.toISOString(),
        dataFim: values.contrato.dataFim.toISOString(),
        ativo: values.contrato.ativo,
      }

      console.log("Creating contract:", contratoData)
      const contrato = await createContrato(contratoData)
      console.log("Contract created successfully:", contrato)

      setCurrentStep("person")

      // 2. Criar a pessoa com o contratoId (SEM o campo ativo)
      const pessoaData: CreatingPessoaDto = {
        nome: values.nome,
        email: values.email,
        pessoaCienciaId: values.pessoaCienciaId,
        pessoaUltimoPedPagam: values.pessoaUltimoPedPagam.toISOString(),
        contratoId: contrato.id,
      }

      console.log("Creating person:", pessoaData)
      const pessoa = await createPessoa(pessoaData)
      console.log("Person created successfully:", pessoa)

      toast({
        title: "Person created successfully!",
        description: `${values.nome} has been added to the system with contract ${contrato.id}.`,
      })

      form.reset()
      onPessoaCreated()
    } catch (error) {
      console.error("Error creating person:", error)
      toast({
        variant: "destructive",
        title: "Error creating person",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      })
    } finally {
      setIsSubmitting(false)
      setCurrentStep("contract")
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Add New Person</h2>
        <p className="text-muted-foreground">
          Fill in personal and contractual information to add a new person to the system.
        </p>
        {isSubmitting && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {currentStep === "contract" ? "Creating contract..." : "Creating person..."}
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Basic person data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  name="pessoaCienciaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Science ID</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="xxxx-xxxx-xxxx  x:digit or number" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>Unique identifier in the science system.</FormDescription>
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
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
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
              </CardContent>
            </Card>

            {/* Informações Contratuais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Contract Information
                </CardTitle>
                <CardDescription>Work contract details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="contrato.tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select contract type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TIPOS_CONTRATO.map((tipo) => (
                            <SelectItem key={tipo.value} value={tipo.value}>
                              {tipo.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Person's hiring modality.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contrato.salario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary (€)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="3500.00"
                          value={field.value === 0 ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(e.target.value === "" ? 0 : Number.parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>Salary amount in euros.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contrato.dataInicio"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
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
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>Contract start date.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contrato.dataFim"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
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
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>Contract end date.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contrato.ativo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Contract</FormLabel>
                        <FormDescription>Indicates if the contract is active.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="sm:w-auto w-full"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="sm:w-auto w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Person"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
