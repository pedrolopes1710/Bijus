"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CargaMensalDto } from "../types"
import { updateCargaMensal } from "../api"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"

interface EditCargaMensalDialogProps {
  isOpen: boolean
  onClose: () => void
  cargaMensal: CargaMensalDto
  onSuccess: () => void
  editField:
    | "jornadaDiaria"
    | "diasUteisTrabalhaveis"
    | "feriasBaixasLicencasFaltas"
    | "salarioBase"
    | "taxaSocialUnica"
}

interface EditingCargaMensalDto {
  jornadaDiaria: number
  diasUteisTrabalhaveis: number
  feriasBaixasLicencasFaltas: number
  salarioBase: number
  taxaSocialUnica: number
}

export default function EditCargaMensalDialog({
  isOpen,
  onClose,
  cargaMensal,
  onSuccess,
  editField,
}: EditCargaMensalDialogProps) {
  // Get initial value based on field
  const getInitialValue = () => {
    switch (editField) {
      case "jornadaDiaria":
        return cargaMensal.jornadaDiaria.toString()
      case "diasUteisTrabalhaveis":
        return cargaMensal.diasUteisTrabalhaveis.toString()
      case "feriasBaixasLicencasFaltas":
        return cargaMensal.feriasBaixasLicencasFaltas.toString()
      case "salarioBase":
        return cargaMensal.salarioBase.toString()
      case "taxaSocialUnica":
        return cargaMensal.taxaSocialUnica.toString()
      default:
        return "0"
    }
  }

  // Get field label
  const getFieldLabel = () => {
    switch (editField) {
      case "jornadaDiaria":
        return "Daily Working Hours"
      case "diasUteisTrabalhaveis":
        return "Working Days"
      case "feriasBaixasLicencasFaltas":
        return "Vacation Days"
      case "salarioBase":
        return "Base Salary (€)"
      case "taxaSocialUnica":
        return "Social Security Rate (%)"
      default:
        return "Value"
    }
  }

  // Get field unit
  const getFieldUnit = () => {
    switch (editField) {
      case "jornadaDiaria":
        return "hours"
      case "diasUteisTrabalhaveis":
        return "days"
      case "feriasBaixasLicencasFaltas":
        return "days"
      case "salarioBase":
        return "€"
      case "taxaSocialUnica":
        return "%"
      default:
        return ""
    }
  }

  const [valor, setValor] = useState<string>(getInitialValue())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Format date
  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString)
      return format(data, "MMMM yyyy", { locale: enUS })
    } catch (error) {
      return dataString
    }
  }

  // Handle value change
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValor(e.target.value)
    setError(null)
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      // Convert to number
      const valorNumerico = Number.parseFloat(valor)
      if (isNaN(valorNumerico)) {
        setError("Please enter a valid number")
        setIsSubmitting(false)
        return
      }

      // Validate based on field type
      if (editField === "jornadaDiaria" && (valorNumerico <= 0 || valorNumerico > 24)) {
        setError("Daily hours must be between 0 and 24")
        setIsSubmitting(false)
        return
      }

      if (editField === "diasUteisTrabalhaveis" && (valorNumerico <= 0 || valorNumerico > 31)) {
        setError("Working days must be between 1 and 31")
        setIsSubmitting(false)
        return
      }

      if (editField === "feriasBaixasLicencasFaltas" && valorNumerico < 0) {
        setError("Vacation days cannot be negative")
        setIsSubmitting(false)
        return
      }

      if (editField === "salarioBase" && valorNumerico < 0) {
        setError("Base salary cannot be negative")
        setIsSubmitting(false)
        return
      }

      if (editField === "taxaSocialUnica" && (valorNumerico < 0 || valorNumerico > 100)) {
        setError("Social security rate must be between 0 and 100")
        setIsSubmitting(false)
        return
      }

      // Create update object with all current values, updating only the selected field
      const updateData: EditingCargaMensalDto = {
        jornadaDiaria: editField === "jornadaDiaria" ? valorNumerico : cargaMensal.jornadaDiaria,
        diasUteisTrabalhaveis:
          editField === "diasUteisTrabalhaveis" ? valorNumerico : cargaMensal.diasUteisTrabalhaveis,
        feriasBaixasLicencasFaltas:
          editField === "feriasBaixasLicencasFaltas" ? valorNumerico : cargaMensal.feriasBaixasLicencasFaltas,
        salarioBase: editField === "salarioBase" ? valorNumerico : cargaMensal.salarioBase,
        taxaSocialUnica: editField === "taxaSocialUnica" ? valorNumerico : cargaMensal.taxaSocialUnica,
      }

      await updateCargaMensal(cargaMensal.id, updateData)

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error updating carga mensal:", error)
      setError("Failed to update monthly workload. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Edit {getFieldLabel()} - {formatarData(cargaMensal.mesAno)}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="month" className="text-right">
              Month
            </Label>
            <div className="col-span-3">{formatarData(cargaMensal.mesAno)}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="valor" className="text-right">
              {getFieldLabel()}
            </Label>
            <div className="col-span-3">
              <Input
                id="valor"
                type="number"
                step={editField === "salarioBase" || editField === "taxaSocialUnica" ? "0.01" : "0.5"}
                min="0"
                max={
                  editField === "jornadaDiaria"
                    ? "24"
                    : editField === "diasUteisTrabalhaveis"
                      ? "31"
                      : editField === "taxaSocialUnica"
                        ? "100"
                        : undefined
                }
                value={valor}
                onChange={handleValorChange}
                placeholder={`Enter ${getFieldLabel().toLowerCase()}`}
              />
              <p className="text-xs text-gray-500 mt-1">
                Current value: {getInitialValue()} {getFieldUnit()}
              </p>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
