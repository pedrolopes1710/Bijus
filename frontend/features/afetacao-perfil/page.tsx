"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { fetchAfetacoesPerfil } from "./api"
import type { AfetacaoPerfil } from "./types"
import { AfetacaoPerfilForm } from "./components/afetacao-perfil-form"
import { DeleteAfetacaoDialog } from "./components/delete-afetacao-dialog"
import { Toaster } from "@/components/ui/toaster"
import { Search, Plus, MoreHorizontal, Edit, Trash, User, Clock, ArrowLeft, UserCheck } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

type ViewMode = "list" | "create" | "edit"

export default function AfetacaoPerfilPage() {
  const [afetacoes, setAfetacoes] = useState<AfetacaoPerfil[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedAfetacao, setSelectedAfetacao] = useState<AfetacaoPerfil | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [afetacaoToDelete, setAfetacaoToDelete] = useState<AfetacaoPerfil | null>(null)

  // Carregar afetações
  useEffect(() => {
    loadAfetacoes()
  }, [])

  async function loadAfetacoes() {
    try {
      setLoading(true)
      const data = await fetchAfetacoesPerfil()
      setAfetacoes(data)
    } catch (error) {
      console.error("Erro ao carregar afetações:", error)
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as afetações de perfil.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filtrar afetações com base na busca
  const filteredAfetacoes = afetacoes.filter(
    (afetacao) =>
      afetacao.pessoaDto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      afetacao.pessoaDto.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      afetacao.perfilDto.descricao.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  function handleCreate() {
    setSelectedAfetacao(null)
    setViewMode("create")
  }

  function handleEdit(afetacao: AfetacaoPerfil) {
    setSelectedAfetacao(afetacao)
    setViewMode("edit")
  }

  function handleDelete(afetacao: AfetacaoPerfil) {
    setAfetacaoToDelete(afetacao)
    setDeleteDialogOpen(true)
  }

  function handleFormSuccess() {
    setViewMode("list")
    setSelectedAfetacao(null)
    loadAfetacoes()
  }

  function handleFormCancel() {
    setViewMode("list")
    setSelectedAfetacao(null)
  }

  function handleDeleteSuccess() {
    loadAfetacoes()
  }

  // Componente de carregamento
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="opacity-70">
          <CardHeader className="pb-2 space-y-0">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Renderizar formulário
  if (viewMode === "create" || viewMode === "edit") {
    return (
      <div className="space-y-6">
        <Toaster />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleFormCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {viewMode === "create" ? "Nova Afetação de Perfil" : "Editar Afetação de Perfil"}
          </h1>
        </div>
        <AfetacaoPerfilForm
          afetacao={selectedAfetacao || undefined}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </div>
    )
  }

  // Renderizar lista
  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Afetação de Perfil</h1>
        <p className="text-muted-foreground">Gerencie as afetações de perfil das pessoas</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center w-full max-w-sm gap-2">
          <Search className="h-4 w-4 text-muted-foreground absolute ml-3 pointer-events-none" />
          <Input
            placeholder="Buscar por pessoa ou perfil..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nova Afetação
        </Button>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : filteredAfetacoes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAfetacoes.map((afetacao) => (
            <Card key={afetacao.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {afetacao.pessoaDto.nome}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <UserCheck className="h-3 w-3" />
                      {afetacao.perfilDto.descricao}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Ações</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(afetacao)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(afetacao)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">{afetacao.pessoaDto.email}</div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-700">
                    <Clock className="h-3 w-3 mr-1" />
                    {afetacao.duracaoMes} meses
                  </Badge>
                  <Badge variant="outline" className="bg-green-500/10 text-green-700">
                    {afetacao.pMsAprovados} PMs
                  </Badge>
                </div>

                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    <strong>Perfil:</strong> {afetacao.perfilDto.pMs} PMs disponíveis
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <strong>Status:</strong> {afetacao.pessoaDto.ativo ? "Ativo" : "Inativo"}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-3 mb-4">
              <UserCheck className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhuma afetação encontrada</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {searchTerm
                ? "Não encontramos nenhuma afetação correspondente à sua busca."
                : "Você ainda não tem nenhuma afetação de perfil cadastrada."}
            </p>
            <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Criar Nova Afetação
            </Button>
          </CardContent>
        </Card>
      )}

      <DeleteAfetacaoDialog
        afetacao={afetacaoToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
