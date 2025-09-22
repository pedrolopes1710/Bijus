"use client"

import type React from "react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarDays, AlertTriangle } from "lucide-react"
import { createCargasMensaisBulk } from "../api"
import type { PessoaDto } from "../types"

interface CreateCargasMensaisDialogProps {
  pessoa: PessoaDto
  onSuccess: () => void
}

export default function CreateCargasMensaisDialog({ pessoa, onSuccess }: CreateCargasMensaisDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mesAnoInicial, setMesAnoInicial] = useState("")
  const [mesAnoFinal, setMesAnoFinal] = useState("")
  const [jornadaDiaria, setJornadaDiaria] = useState("")
  const [diasUteisTrabalhaveis, setDiasUteisTrabalhaveis] = useState("")
  const [taxaSocialUnica, setTaxaSocialUnica] = useState("")

  const hasContract = !!pessoa.contrato
  const contractSalary = pessoa.contrato?.salario || 0

  function resetForm() {
    setMesAnoInicial("")
    setMesAnoFinal("")
    setJornadaDiaria("")
    setDiasUteisTrabalhaveis("")
    setTaxaSocialUnica("")
  }

  function handleOpenChange(newOpen: boolean) {
    setOpen(newOpen)
    if (!newOpen) {
      resetForm()
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!hasContract) return

    setLoading(true)
    try {
      // Converter formato YYYY-MM para YYYY-MM-01T00:00:00 (ISO DateTime)
      const mesAnoInicioISO = `${mesAnoInicial}-01T00:00:00`
      const mesAnoFimISO = `${mesAnoFinal}-01T00:00:00`

      await createCargasMensaisBulk({
        pessoaId: pessoa.id,
        mesAnoInicio: mesAnoInicioISO,
        mesAnoFim: mesAnoFimISO,
        jornadaDiaria: Number(jornadaDiaria),
        diasUteisTrabalhaveis: Number(diasUteisTrabalhaveis),
        feriasBaixasLicencasFaltas: 0, // Sempre 0 conforme especificado
        salarioBase: contractSalary,
        taxaSocialUnica: Number(taxaSocialUnica),
      })

      setOpen(false)
      resetForm()
      onSuccess()
    } catch (error) {
      console.error("Error creating cargas mensais:", error)
      alert("Failed to create monthly workloads. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const isFormValid =
    mesAnoInicial && mesAnoFinal && jornadaDiaria && diasUteisTrabalhaveis && taxaSocialUnica && hasContract

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CalendarDays className="h-4 w-4" />
          Create Monthly Workloads
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Monthly Workloads</DialogTitle>
          <DialogDescription>Create monthly workloads for {pessoa.nome} for a specific period.</DialogDescription>
        </DialogHeader>

        {!hasContract && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This person does not have an active contract. Monthly workloads cannot be created without a contract.
            </AlertDescription>
          </Alert>
        )}

        {hasContract && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Contract Salary:</strong> €{contractSalary.toFixed(2)}
            </p>
            <p className="text-xs text-blue-600 mt-1">This salary will be used for all monthly workloads created.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mesAnoInicial">Start Month/Year</Label>
              <Input
                id="mesAnoInicial"
                type="month"
                lang="en"
                value={mesAnoInicial}
                onChange={(e) => setMesAnoInicial(e.target.value)}
                disabled={!hasContract || loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mesAnoFinal">End Month/Year</Label>
              <Input
                id="mesAnoFinal"
                type="month"
                lang="en"
                value={mesAnoFinal}
                onChange={(e) => setMesAnoFinal(e.target.value)}
                disabled={!hasContract || loading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jornadaDiaria">Daily Working Hours</Label>
            <Input
              id="jornadaDiaria"
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={jornadaDiaria}
              onChange={(e) => setJornadaDiaria(e.target.value)}
              placeholder="e.g., 8"
              disabled={!hasContract || loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diasUteisTrabalhaveis">Working Days per Month</Label>
            <Input
              id="diasUteisTrabalhaveis"
              type="number"
              min="1"
              max="31"
              value={diasUteisTrabalhaveis}
              onChange={(e) => setDiasUteisTrabalhaveis(e.target.value)}
              placeholder="e.g., 22"
              disabled={!hasContract || loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxaSocialUnica">Social Security Rate (%)</Label>
            <Input
              id="taxaSocialUnica"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={taxaSocialUnica}
              onChange={(e) => setTaxaSocialUnica(e.target.value)}
              placeholder="e.g., 23.75"
              disabled={!hasContract || loading}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid || loading}>
              {loading ? "Creating..." : "Create Workloads"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
