"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  DollarSign,
  Users,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  ArrowLeft,
  User,
  FolderOpen,
  FileText,
} from "lucide-react"
import { fetchPessoas, fetchPessoa } from "./api"
import type { Pessoa } from "./types"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreatePessoaForm } from "./components/create-pessoa-form"
import { DeletePessoaDialog } from "./components/delete-pessoa-dialog"
import { ToggleStatusDialog } from "./components/toggle-status-dialog"
import { EditPessoaDialog } from "./components/edit-pessoa-dialog"
import { ManageProjectsDialog } from "./components/manage-projects-dialog"
import { ManageContractDialog } from "./components/manage-contracts-dialog"

export default function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [contractTypeFilter, setContractTypeFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"name" | "email" | "salary" | "contractEnd">("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isCreating, setIsCreating] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [toggleStatusDialogOpen, setToggleStatusDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [manageProjectsDialogOpen, setManageProjectsDialogOpen] = useState(false)
  const [manageContractDialogOpen, setManageContractDialogOpen] = useState(false)
  const [selectedPessoa, setSelectedPessoa] = useState<Pessoa | null>(null)

  // Carregar pessoas
  useEffect(() => {
    async function loadPessoas() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchPessoas()
        setPessoas(data)
      } catch (error) {
        console.error("Erro ao carregar pessoas:", error)
        setError("Não foi possível carregar as pessoas. Verifique se a API está em execução.")
      } finally {
        setLoading(false)
      }
    }

    if (!isCreating) {
      loadPessoas()
    }
  }, [isCreating])

  // Função para lidar com a criação de pessoa
  const handlePessoaCreated = () => {
    setIsCreating(false)
    // Os dados serão recarregados automaticamente pelo useEffect
  }

  // Função para abrir dialog de delete
  const handleDeleteClick = (pessoa: Pessoa) => {
    setSelectedPessoa(pessoa)
    setDeleteDialogOpen(true)
  }

  // Função para abrir dialog de toggle status
  const handleToggleStatusClick = (pessoa: Pessoa) => {
    setSelectedPessoa(pessoa)
    setToggleStatusDialogOpen(true)
  }

  // Função para abrir dialog de edit
  const handleEditClick = (pessoa: Pessoa) => {
    setSelectedPessoa(pessoa)
    setEditDialogOpen(true)
  }

  // Função para abrir dialog de manage projects
  const handleManageProjectsClick = (pessoa: Pessoa) => {
    setSelectedPessoa(pessoa)
    setManageProjectsDialogOpen(true)
  }

  // Função para abrir dialog de manage contract
  const handleManageContractClick = (pessoa: Pessoa) => {
    setSelectedPessoa(pessoa)
    setManageContractDialogOpen(true)
  }

  // Função para lidar com pessoa deletada
  const handlePessoaDeleted = async () => {
    try {
      const data = await fetchPessoas()
      setPessoas(data)
      toast({
        title: "Person deleted",
        description: "Person has been deleted successfully.",
      })
    } catch (error) {
      console.error("Erro ao recarregar pessoas:", error)
      toast({
        title: "Error",
        description: "Could not reload people data.",
        variant: "destructive",
      })
    }
  }

  // Função para lidar com status alterado
  const handleStatusToggled = async () => {
    try {
      const data = await fetchPessoas()
      setPessoas(data)
      toast({
        title: "Status updated",
        description: "Person status has been updated successfully.",
      })
    } catch (error) {
      console.error("Erro ao recarregar pessoas:", error)
      toast({
        title: "Error",
        description: "Could not reload people data.",
        variant: "destructive",
      })
    }
  }

  // Função para lidar com pessoa editada
  const handlePessoaUpdated = async () => {
    try {
      const data = await fetchPessoas()
      setPessoas(data)
    } catch (error) {
      console.error("Erro ao recarregar pessoas:", error)
      toast({
        title: "Error",
        description: "Could not reload people data.",
        variant: "destructive",
      })
    }
  }

  // Função para lidar com projetos atualizados
  const handleProjectsUpdated = async () => {
    try {
      const data = await fetchPessoas()
      setPessoas(data)

      // Se há uma pessoa selecionada, atualizar os seus dados também
      if (selectedPessoa) {
        const updatedPessoa = await fetchPessoa(selectedPessoa.id)
        setSelectedPessoa(updatedPessoa)
      }
    } catch (error) {
      console.error("Erro ao recarregar pessoas:", error)
      toast({
        title: "Error",
        description: "Could not reload people data.",
        variant: "destructive",
      })
    }
  }

  // Função para lidar com contrato atualizado
  const handleContractUpdated = async () => {
    try {
      const data = await fetchPessoas()
      setPessoas(data)

      // Se há uma pessoa selecionada, atualizar os seus dados também
      if (selectedPessoa) {
        const updatedPessoa = await fetchPessoa(selectedPessoa.id)
        setSelectedPessoa(updatedPessoa)
      }
    } catch (error) {
      console.error("Erro ao recarregar pessoas:", error)
      toast({
        title: "Error",
        description: "Could not reload people data.",
        variant: "destructive",
      })
    }
  }

  // Se estiver no modo de criação, mostrar o formulário
  if (isCreating) {
    return (
      <div className="space-y-6">
        <Toaster />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setIsCreating(false)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Person</h1>
            <p className="text-muted-foreground">Add a new person to the system</p>
          </div>
        </div>

        <CreatePessoaForm onPessoaCreated={handlePessoaCreated} onCancel={() => setIsCreating(false)} />
      </div>
    )
  }

  // Filtrar e ordenar pessoas
  const filteredAndSortedPessoas = pessoas
    .filter((pessoa) => {
      const matchesSearch =
        pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pessoa.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pessoa.pessoaCienciaId.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && pessoa.ativo) ||
        (statusFilter === "inactive" && !pessoa.ativo)

      const matchesContractType = contractTypeFilter === "all" || pessoa.contrato?.tipo === contractTypeFilter

      return matchesSearch && matchesStatus && matchesContractType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.nome.localeCompare(b.nome)
        case "email":
          return a.email.localeCompare(b.email)
        case "salary":
          return (b.contrato?.salario || 0) - (a.contrato?.salario || 0)
        case "contractEnd":
          return new Date(a.contrato?.dataFim || 0).getTime() - new Date(b.contrato?.dataFim || 0).getTime()
        default:
          return 0
      }
    })

  // Obter tipos de contrato únicos
  const contractTypes = [...new Set(pessoas.map((p) => p.contrato?.tipo).filter(Boolean))]

  // Estatísticas
  const stats = {
    total: pessoas.length,
    active: pessoas.filter((p) => p.ativo).length,
    inactive: pessoas.filter((p) => !p.ativo).length,
    averageSalary:
      pessoas.length > 0 ? pessoas.reduce((sum, p) => sum + (p.contrato?.salario || 0), 0) / pessoas.length : 0,
  }

  // Função para recarregar dados
  const handleRefresh = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchPessoas()
      setPessoas(data)
      toast({
        title: "Data updated",
        description: "The people list has been updated successfully.",
      })
    } catch (error) {
      console.error("Erro ao recarregar pessoas:", error)
      setError("Could not reload people.")
    } finally {
      setLoading(false)
    }
  }

  // Componente de carregamento
  const LoadingSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <Card key={i} className="opacity-70">
          <CardHeader className="pb-2 space-y-0">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-6 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Renderizar card de pessoa
  const renderPessoaCard = (pessoa: Pessoa) => (
    <Card key={pessoa.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">{pessoa.nome}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {pessoa.email}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditClick(pessoa)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleManageProjectsClick(pessoa)}>
                <FolderOpen className="h-4 w-4 mr-2" />
                Manage Projects
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleManageContractClick(pessoa)}>
                <FileText className="h-4 w-4 mr-2" />
                Manage Contract
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleStatusClick(pessoa)}>
                {pessoa.ativo ? (
                  <>
                    <UserX className="h-4 w-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(pessoa)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status:</span>
            <Badge
              variant={pessoa.ativo ? "default" : "secondary"}
              className={pessoa.ativo ? "bg-green-500/20 text-green-700" : ""}
            >
              {pessoa.ativo ? "Active" : "Inactive"}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Type:</span>
            <Badge variant="outline">{pessoa.contrato?.tipo || "N/A"}</Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Salary:</span>
            <span className="font-medium">€{(pessoa.contrato?.salario || 0).toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Projects:</span>
            <span className="font-medium">{pessoa.projetos?.length || 0}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Science ID:</span>
            <span className="font-mono text-xs">{pessoa.pessoaCienciaId}</span>
          </div>
        </div>

        {pessoa.contrato && (
          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Contract:</span>
                <span>
                  {pessoa.contrato?.dataInicio ? new Date(pessoa.contrato?.dataInicio).toLocaleDateString() : "N/A"} -{" "}
                  {pessoa.contrato?.dataFim ? new Date(pessoa.contrato?.dataFim).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Payment:</span>
                <span>{new Date(pessoa.pessoaUltimoPedPagam).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  // Renderizar item de lista
  const renderPessoaListItem = (pessoa: Pessoa) => (
    <Card key={pessoa.id} className="mb-2">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <div className="font-medium">{pessoa.nome}</div>
                <div className="text-sm text-muted-foreground">{pessoa.email}</div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={pessoa.ativo ? "default" : "secondary"}
                  className={pessoa.ativo ? "bg-green-500/20 text-green-700" : ""}
                >
                  {pessoa.ativo ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="outline">{pessoa.contrato?.tipo || "N/A"}</Badge>
              </div>

              <div className="text-sm">
                <div className="font-medium">€{(pessoa.contrato?.salario || 0).toLocaleString()}</div>
                <div className="text-muted-foreground">Salary</div>
              </div>

              <div className="text-sm">
                <div className="font-medium">{pessoa.projetos?.length || 0} projects</div>
                <div className="text-muted-foreground">Associated</div>
              </div>

              {pessoa.contrato && (
                <div className="text-sm">
                  <div className="font-medium">
                    {pessoa.contrato?.dataFim ? new Date(pessoa.contrato?.dataFim).toLocaleDateString() : "N/A"}
                  </div>
                  <div className="text-muted-foreground">Contract End</div>
                </div>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditClick(pessoa)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleManageProjectsClick(pessoa)}>
                <FolderOpen className="h-4 w-4 mr-2" />
                Manage Projects
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleManageContractClick(pessoa)}>
                <FileText className="h-4 w-4 mr-2" />
                Manage Contract
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleStatusClick(pessoa)}>
                {pessoa.ativo ? (
                  <>
                    <UserX className="h-4 w-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(pessoa)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Toaster />

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">People</h1>
        <p className="text-muted-foreground">Manage all people and their contracts</p>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total People</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active People</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inactive People</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{Math.round(stats.averageSalary).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center w-full max-w-sm gap-2 relative">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10" />
          <Input
            placeholder="Search people..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={contractTypeFilter} onValueChange={setContractTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tipo de Contrato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {contractTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="salary">Salary</SelectItem>
              <SelectItem value="contractEnd">Contract End</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Person
          </Button>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            {error}
            <Button variant="outline" size="sm" onClick={handleRefresh} className="ml-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs para diferentes visualizações */}
      <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          {loading ? (
            <LoadingSkeleton />
          ) : filteredAndSortedPessoas.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAndSortedPessoas.map(renderPessoaCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No people found</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  {searchTerm || statusFilter !== "all" || contractTypeFilter !== "all"
                    ? "We couldn't find any people matching the applied filters."
                    : "You don't have any people registered yet."}
                </p>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Person
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {loading ? (
            <LoadingSkeleton />
          ) : filteredAndSortedPessoas.length > 0 ? (
            <div className="space-y-2">{filteredAndSortedPessoas.map(renderPessoaListItem)}</div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No people found</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  {searchTerm || statusFilter !== "all" || contractTypeFilter !== "all"
                    ? "We couldn't find any people matching the applied filters."
                    : "You don't have any people registered yet."}
                </p>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Person
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <DeletePessoaDialog
        pessoa={selectedPessoa}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onPessoaDeleted={handlePessoaDeleted}
      />

      <ToggleStatusDialog
        pessoa={selectedPessoa}
        open={toggleStatusDialogOpen}
        onOpenChange={setToggleStatusDialogOpen}
        onStatusToggled={handleStatusToggled}
      />

      <EditPessoaDialog
        pessoa={selectedPessoa}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onPessoaUpdated={handlePessoaUpdated}
      />

      <ManageProjectsDialog
        pessoa={selectedPessoa}
        open={manageProjectsDialogOpen}
        onOpenChange={setManageProjectsDialogOpen}
        onProjectsUpdated={handleProjectsUpdated}
      />

      <ManageContractDialog
        pessoa={selectedPessoa}
        open={manageContractDialogOpen}
        onOpenChange={setManageContractDialogOpen}
        onContractUpdated={handleContractUpdated}
      />
    </div>
  )
}
