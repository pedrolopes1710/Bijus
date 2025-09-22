"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AfetacaoPerfilDto, CargaMensalDto, AfetacaoMensalDto } from "../types"
import { createAfetacaoMensal, updateAfetacaoMensal } from "../api"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"

interface EditAfetacaoDialogProps {
  isOpen: boolean
  onClose: () => void
  afetacaoPerfil: AfetacaoPerfilDto
  cargaMensal: CargaMensalDto
  afetacaoMensal?: AfetacaoMensalDto
  onSuccess: () => void
  showHours: boolean
}

export default function EditAfetacaoDialog({
  isOpen,
  onClose,
  afetacaoPerfil,
  cargaMensal,
  afetacaoMensal,
  onSuccess,
  showHours,
}: EditAfetacaoDialogProps) {
  // Calcular horas potenciais trabalháveis
  const horasPotenciais = cargaMensal.jornadaDiaria * cargaMensal.diasUteisTrabalhaveis

  // Valor inicial (em PMs)
  const valorInicial = afetacaoMensal?.pMs || 0

  // Estado para o valor (sempre em PMs)
  const [valor, setValor] = useState<string>(valorInicial.toString())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Converter entre PMs e horas
  const pmParaHoras = (pm: number): number => pm * horasPotenciais
  const horasParaPm = (horas: number): number => horas / horasPotenciais

  // Formatar a data
  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString)
      return format(data, "MMMM yyyy", { locale: enUS })
    } catch (error) {
      return dataString
    }
  }

  // Manipular mudança de valor
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValor(e.target.value)
    setError(null)
  }

  // Manipular envio do formulário
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      // Converter para número
      let valorNumerico = Number.parseFloat(valor)
      if (isNaN(valorNumerico)) {
        setError("Please enter a valid number")
        setIsSubmitting(false)
        return
      }

      // Se estiver mostrando horas, converter para PMs
      if (showHours) {
        valorNumerico = horasParaPm(valorNumerico)
      }

      if (afetacaoMensal) {
        // Atualizar afetação existente
        await updateAfetacaoMensal(afetacaoMensal.id, { pMs: valorNumerico })
      } else {
        // Criar nova afetação
        await createAfetacaoMensal({
          pMs: valorNumerico,
          afetacaoPerfilId: afetacaoPerfil.id,
          mesAno: cargaMensal.mesAno,
        })
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error saving afetacao:", error)
      setError("Failed to save allocation. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Resetar o formulário quando o diálogo é aberto
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
            {afetacaoMensal ? "Edit Allocation" : "Create Allocation"} - {formatarData(cargaMensal.mesAno)}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profile" className="text-right">
              Profile
            </Label>
            <div className="col-span-3 font-medium">{afetacaoPerfil.perfilDto?.descricao || "Unknown Profile"}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="month" className="text-right">
              Month
            </Label>
            <div className="col-span-3">{formatarData(cargaMensal.mesAno)}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="valor" className="text-right">
              {showHours ? "Hours" : "PMs"}
            </Label>
            <div className="col-span-3">
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                value={showHours ? pmParaHoras(Number.parseFloat(valor) || 0).toString() : valor}
                onChange={handleValorChange}
                placeholder={showHours ? "Enter hours" : "Enter PMs"}
              />
              {showHours && (
                <p className="text-xs text-gray-500 mt-1">
                  Equivalent to {horasParaPm(Number.parseFloat(valor) || 0).toFixed(2)} PMs
                </p>
              )}
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
