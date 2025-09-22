"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Trash2, Plus, Users, UserCheck, UserX } from "lucide-react"
import { fetchProfiles, deleteProfile } from "../api"
import type { Profile } from "../types"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ProfileListProps {
  onCreateProfile: () => void
  refreshTrigger?: number
}

export function ProfileList({ onCreateProfile, refreshTrigger }: ProfileListProps) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Carregar perfis
  const loadProfiles = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchProfiles()
      setProfiles(data)
    } catch (error) {
      console.error("Erro ao carregar perfis:", error)
      setError("Não foi possível carregar os perfis.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfiles()
  }, [refreshTrigger])

  // Filtrar perfis
  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.departamento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.nivel?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Estatísticas
  const stats = {
    total: profiles.length,
    active: profiles.filter((p) => p.ativo !== false).length,
    inactive: profiles.filter((p) => p.ativo === false).length,
  }

  // Deletar perfil
  const handleDeleteProfile = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja deletar o perfil "${nome}"?`)) {
      return
    }

    try {
      await deleteProfile(id)
      toast({
        title: "Perfil deletado",
        description: `O perfil "${nome}" foi removido com sucesso.`,
      })
      loadProfiles()
    } catch (error) {
      console.error("Erro ao deletar perfil:", error)
      toast({
        variant: "destructive",
        title: "Erro ao deletar perfil",
        description: "Não foi possível deletar o perfil.",
      })
    }
  }

  // Componente de carregamento
  const LoadingSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="opacity-70">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Perfis</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Perfis Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Perfis Inativos</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center w-full max-w-sm gap-2">
          <Search className="h-4 w-4 text-muted-foreground absolute ml-3 pointer-events-none" />
          <Input
            placeholder="Buscar perfis..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadProfiles} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button onClick={onCreateProfile}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Perfil
          </Button>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            {error}
            <Button variant="outline" size="sm" onClick={loadProfiles} className="ml-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Lista de perfis */}
      {loading ? (
        <LoadingSkeleton />
      ) : filteredProfiles.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProfiles.map((profile) => (
            <Card key={profile.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{profile.nome}</CardTitle>
                    <CardDescription className="mt-1">{profile.departamento}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteProfile(profile.id, profile.nome || "Perfil")}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{profile.descricao}</p>

                <div className="flex flex-wrap gap-2">
                  {profile.ativo !== false ? (
                    <Badge className="bg-green-500/20 text-green-700">Ativo</Badge>
                  ) : (
                    <Badge variant="secondary">Inativo</Badge>
                  )}

                  {profile.nivel && <Badge variant="outline">{profile.nivel}</Badge>}

                  {profile.pms && <Badge variant="outline">{profile.pms} PMs</Badge>}
                </div>

                {profile.competencias && profile.competencias.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Competências:</div>
                    <div className="flex flex-wrap gap-1">
                      {profile.competencias.slice(0, 3).map((competencia) => (
                        <Badge key={competencia} variant="secondary" className="text-xs">
                          {competencia}
                        </Badge>
                      ))}
                      {profile.competencias.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{profile.competencias.length - 3} mais
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhum perfil encontrado</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {searchTerm
                ? "Não encontramos nenhum perfil correspondente à sua busca."
                : "Você ainda não tem nenhum perfil cadastrado."}
            </p>
            <Button onClick={onCreateProfile}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Perfil
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
