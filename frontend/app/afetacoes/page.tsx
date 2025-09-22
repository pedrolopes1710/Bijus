"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { getTabelaAfetacoes } from "@/features/afetacoes/api"
import type { TabelaAfetacoesDto, PessoaDto } from "@/features/afetacoes/types"
import TabelaAfetacoes from "@/features/afetacoes/components/tabela-afetacoes"
import CreateCargasMensaisDialog from "@/features/afetacoes/components/create-cargas-mensais-dialog"

export default function AfetacoesPage() {
  const [pessoas, setPessoas] = useState<PessoaDto[]>([])
  const [selectedPessoaId, setSelectedPessoaId] = useState<string>("")
  const [tabelaAfetacoes, setTabelaAfetacoes] = useState<TabelaAfetacoesDto | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingPessoas, setLoadingPessoas] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pessoa selecionada com dados completos (incluindo contrato)
  const selectedPessoa = pessoas.find((p) => p.id === selectedPessoaId)

  useEffect(() => {
    loadPessoas()
  }, [])

  useEffect(() => {
    if (selectedPessoaId) {
      loadTabelaAfetacoes(selectedPessoaId)
    } else {
      setTabelaAfetacoes(null)
    }
  }, [selectedPessoaId])

  async function loadPessoas() {
    setLoadingPessoas(true)
    setError(null)
    try {
      // Buscar dados completos das pessoas (incluindo contratos)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5225"}/api/pessoas`)
      if (!response.ok) {
        throw new Error(`Failed to fetch pessoas: ${response.status} ${response.statusText}`)
      }
      const pessoasData: PessoaDto[] = await response.json()
      setPessoas(pessoasData)
    } catch (error) {
      console.error("Error loading people:", error)
      setError("Failed to load people. Please try again.")
    } finally {
      setLoadingPessoas(false)
    }
  }

  async function loadTabelaAfetacoes(pessoaId: string) {
    setLoading(true)
    setError(null)
    try {
      const data = await getTabelaAfetacoes(pessoaId)
      setTabelaAfetacoes(data)
    } catch (error) {
      console.error("Error loading allocation table:", error)
      setError("Failed to load allocation table. Please try again.")
      setTabelaAfetacoes(null)
    } finally {
      setLoading(false)
    }
  }

  function handleRefresh() {
    if (selectedPessoaId) {
      loadTabelaAfetacoes(selectedPessoaId)
    }
  }

  function handleCargasMensaisCreated() {
    if (selectedPessoaId) {
      loadTabelaAfetacoes(selectedPessoaId)
    }
  }

  function handleAfetacaoUpdated() {
    if (selectedPessoaId) {
      loadTabelaAfetacoes(selectedPessoaId)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Allocation Table</h1>
        <div className="flex gap-4 items-center">
          <Select value={selectedPessoaId} onValueChange={setSelectedPessoaId} disabled={loadingPessoas}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={loadingPessoas ? "Loading people..." : "Select a person"} />
            </SelectTrigger>
            <SelectContent>
              {pessoas.map((pessoa) => (
                <SelectItem key={pessoa.id} value={pessoa.id}>
                  {pessoa.nome} ({pessoa.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={!selectedPessoaId || loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          {selectedPessoa && (
            <CreateCargasMensaisDialog pessoa={selectedPessoa} onSuccess={handleCargasMensaisCreated} />
          )}
        </div>
        {error && (
          <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">{error}</div>
        )}
      </div>

      {selectedPessoaId && (
        <Card>
          <CardHeader>
            <CardTitle>
              {loading
                ? "Loading data..."
                : tabelaAfetacoes
                  ? `Allocations for ${selectedPessoa?.nome || tabelaAfetacoes.pessoa.nome}`
                  : "Select a person to view their allocations"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : tabelaAfetacoes ? (
              <TabelaAfetacoes tabelaAfetacoes={tabelaAfetacoes} onAfetacaoUpdated={handleAfetacaoUpdated} />
            ) : (
              <div className="text-center py-12 text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
