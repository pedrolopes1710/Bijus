"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { MoreHorizontal, Plus, Search, Trash2, Edit2, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { fetchProjetos, createProjeto, deleteProjeto, updateProjeto } from "./projetoAPI"
import { fetchPessoas } from "../pessoas/api" 

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [pessoaId, setPessoaId] = useState("") 

  const [pessoas, setPessoas] = useState<any[]>([]) 

  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")

  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await fetchProjetos()
        setProjects(data)
      } catch (err) {
        setError("Error loading projects.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadProjects()
  }, [])
  
  useEffect(() => {
    async function loadPessoas() {
      try {
        const data = await fetchPessoas()
        setPessoas(data)
      } catch (error) {
        console.error("Erro ao carregar pessoas:", error)
      }
    }
    loadPessoas()
  }, [])

  async function handleCreateProject() {
    if (!name.trim() || !description.trim() || !pessoaId) {
      alert("Please fill in name, description and select a person.")
      return
    }
    try {
      const newProject = await createProjeto({ nome: name, descricao: description, pessoaId })
      setProjects((prev) => [...prev, newProject])
      setName("")
      setDescription("")
      setPessoaId("")
      setShowForm(false)
    } catch (error) {
      console.error("Error creating project:", error)
      alert("Error creating project")
    }
  }

  async function handleDeleteProject(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return
    try {
      const success = await deleteProjeto(id)
      if (success) {
        setProjects((prev) => prev.filter((p) => p.id !== id))
      }
    } catch (error) {
      console.error("Error deleting project:", error)
      alert("Error deleting project")
    }
  }

  function startEditing(project: any) {
    setEditingProjectId(project.id)
    setEditName(project.nome)
    setEditDescription(project.descricao)
  }

  async function handleSaveEdit(id: string) {
    if (!editName.trim() || !editDescription.trim()) {
      alert("Please fill in name and description to edit.")
      return
    }
    try {
      const updated = await updateProjeto(id, { nome: editName, descricao: editDescription })
      if (updated) {
        setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)))
        setEditingProjectId(null)
      }
    } catch (error) {
      console.error("Error updating project:", error)
      alert("Error updating project")
    }
  }

  if (loading) return <p>Loading projects...</p>
  if (error) return <p className="text-red-500">{error}</p>

  const filteredProjects = projects.filter((project) =>
      project.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
      <div className="space-y-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Projects</h1>
        </header>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
                placeholder="    Search projects..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>
        </div>

        {showForm && (
            <Card className="max-w-md p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
              <Input
                  placeholder="Project name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mb-3"
              />
              <Input
                  placeholder="Project description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mb-3"
              />

              {/* Dropdown para escolher a pessoa */}
              <label htmlFor="pessoa-select" className="block mb-1 font-medium">
                Pessoa associada
              </label>
              <select
                  id="pessoa-select"
                  value={pessoaId}
                  onChange={(e) => setPessoaId(e.target.value)}
                  className="w-full border rounded-md p-2 mb-6"
              >
                <option value="">Selecione uma pessoa</option>
                {pessoas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                ))}
              </select>

              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject}>Create</Button>
              </div>
            </Card>
        )}

        <Tabs defaultValue="grid" className="space-y-4">
          <TabsContent value="grid">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                  <Card
                      key={project.id}
                      className="shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <CardHeader>
                      {editingProjectId === project.id ? (
                          <>
                            <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="mb-2"
                            />
                            <Input
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="mb-2"
                            />
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setEditingProjectId(null)}>
                                ❌ Cancel
                              </Button>
                              <Button onClick={() => handleSaveEdit(project.id)}>Save</Button>
                            </div>
                          </>
                      ) : (
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg font-semibold text-primary">
                                {project.nome}
                              </CardTitle>
                              <CardDescription className="text-sm text-muted-foreground">
                                ID: {project.id}
                              </CardDescription>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => startEditing(project)}>
                                  <Edit2 className="w-4 h-4 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteProject(project.id)}>
                                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                      )}
                    </CardHeader>
                    {!editingProjectId || editingProjectId !== project.id ? (
                        <CardContent className="text-sm text-muted-foreground">{project.descricao}</CardContent>
                    ) : null}
                  </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
  )
}
