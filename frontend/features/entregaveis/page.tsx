"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Edit2 } from "lucide-react"

import {
  fetchEntregaveis,
  createEntregavel,
  updateEntregavel,
  deleteEntregavel,
} from "./entregaveisAPI"

import {
  fetchTiposEntregavel,
  createTipoEntregavel,
  deleteTipoEntregavel,
} from "@/features/tiposEntregaveis/tiposEntregaveisAPI"

import { fetchActivities } from "@/features/tasks/api" // Ajuste esse caminho se necessário

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export default function EntregaveisPage() {
  const [entregaveis, setEntregaveis] = useState<any[]>([])
  const [tipoEntregaveis, setTipoEntregaveis] = useState<any[]>([])
  const [atividades, setAtividades] = useState<any[]>([]) // ⬅ Novo estado

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [data, setData] = useState("")
  const [tipoId, setTipoId] = useState("")
  const [atividadeId, setAtividadeId] = useState("")

  const [novoTipoNome, setNovoTipoNome] = useState("")
  const [criarTipo, setTipo] = useState(false)
  const [tipoError, setTipoError] = useState<string | null>(null)
  const [tipoDeleteErro, setTipoDeleteErro] = useState<string | null>(null)

  const [formErrors, setFormErrors] = useState<any>({})
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchEntregaveis()
        setEntregaveis(data)
      } catch {
        setError("Error loading deliverables")
      }

      try {
        const tipos = await fetchTiposEntregavel()
        setTipoEntregaveis(tipos)
      } catch { }

      try {
        const atividades = await fetchActivities() // ⬅ Buscar atividades
        setAtividades(atividades)
      } catch {
        console.error("Error loading activities")
      }

      setLoading(false)
    }
    load()
  }, [])

  function validarFormulario() {
    const errors: any = {}
    if (!nome.trim()) errors.nome = "Name is required"
    if (!descricao.trim()) errors.descricao = "Description is required"
    if (!data) {
      errors.data = "Date is required"
    } else {
      const atividade = atividades.find((a) => a.id === atividadeId)


      if (atividade) {
        const dataEntregavel = new Date(data)
        const dataInicio = new Date(atividade.dataInicioAtividade)
        const dataFim = new Date(atividade.dataFimAtividade)

        if (dataEntregavel < dataInicio || dataEntregavel > dataFim) {
          errors.data = `The date must be between ${new Date(atividade.dataInicioAtividade).toLocaleDateString()} and ${new Date(atividade.dataFimAtividade).toLocaleDateString()}`
        }
      }
    }
    if (!tipoId) errors.tipoId = "Select deliverable type"
    if (!atividadeId) errors.atividadeId = "Select activity"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }


  function resetForm() {
    setNome("")
    setDescricao("")
    setData("")
    setTipoId("")
    setAtividadeId("")
    setFormErrors({})
    setNovoTipoNome("")
    setTipo(false)
    setTipoError(null)
  }

  async function handleCreate() {
    if (!validarFormulario()) return
    try {
      const novo = await createEntregavel({
        nome,
        descricao,
        data,
        tipoEntregavel: { id: tipoId },
        atividadeId: atividadeId || undefined,
      })
      setEntregaveis((prev) => [...prev, novo])
      resetForm()
      setShowForm(false)
    } catch (err) {
      alert("Error creating deliverable")
      console.error(err)
    }
  }

  function startEdit(entregavel: any) {
    setEditingId(entregavel.id)
    setNome(entregavel.nome)
    setDescricao(entregavel.descricao)
    setData(entregavel.data.slice(0, 10))
    setTipoId(entregavel.tipoEntregavel?.id || "")
    setAtividadeId(entregavel.atividadeId || "")
    setFormErrors({})
    setShowForm(false)
  }

  async function handleSaveEdit() {
    if (!validarFormulario() || !editingId) return
    try {
      const updated = await updateEntregavel(editingId, {
        id: editingId,
        nome,
        descricao,
        data,
        tipoEntregavel: { id: tipoId },
        atividadeId: atividadeId || undefined,
      })
      setEntregaveis((prev) =>
        prev.map((e) => (e.id === editingId ? updated : e))
      )
      resetForm()
      setEditingId(null)
    } catch (err) {
      alert("Error updating deliverable")
      console.error(err)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this deliverable?")) return
    try {
      const ok = await deleteEntregavel(id)
      if (ok) {
        setEntregaveis((prev) => prev.filter((e) => e.id !== id))
      }
    } catch {
      alert("Error deleting deliverable")
    }
  }

  async function handleCriarNovoTipo() {
    if (!novoTipoNome.trim()) {
      setTipoError("Name is required")
      return
    }
    setTipoError(null)
    try {
      const novoTipo = await createTipoEntregavel({ nome: novoTipoNome })
      setTipoEntregaveis((prev) => [...prev, novoTipo])
      setTipoId(novoTipo.id)
      setNovoTipoNome("")
      setTipo(false)
    } catch (err) {
      setTipoError("Error creating deliverable type")
      console.error(err)
    }
  }

  if (loading) return <p>🔄 Loading deliverables...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">📦 Deliverables</h1>

      {!editingId && (
        <Button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> {showForm ? "Close Form" : "New Deliverable"}
        </Button>
      )}

      {(showForm || editingId) && (
        <div className="border border-gray-300 rounded-xl p-4 bg-white shadow space-y-4">
          <Input placeholder="Name" value={nome} onChange={(e) => setNome(e.target.value)} />
          {formErrors.nome && <p className="text-red-500 text-sm">{formErrors.nome}</p>}

          <Textarea placeholder="Description" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          {formErrors.descricao && <p className="text-red-500 text-sm">{formErrors.descricao}</p>}

          <label className="block">
            Date
            <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
          </label>
          {formErrors.data && <p className="text-red-500 text-sm">{formErrors.data}</p>}

          <label className="block">
            Deliverable Type
            <select
              className="w-full border rounded-md p-2 mt-1"
              value={tipoId}
              onChange={(e) => setTipoId(e.target.value)}
            >
              <option value="">Select type</option>
              {tipoEntregaveis.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nome}
                </option>
              ))}
            </select>
          </label>
          {formErrors.tipoId && <p className="text-red-500 text-sm">{formErrors.tipoId}</p>}

          {!criarTipo && (
            <>
              <button
                type="button"
                onClick={() => setTipo(true)}
                className="text-sm text-blue-600 mt-1 hover:underline"
              >
                + Create new deliverable type
              </button>

              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="text-sm text-black-600 mt-1 hover:underline"
                  >
                    🗑️ Delete deliverable type
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Deliverable Type</DialogTitle>
                    <DialogDescription>Select a type to delete. This action is irreversible.</DialogDescription>
                  </DialogHeader>

                  {tipoDeleteErro && <p className="text-red-500 text-sm">{tipoDeleteErro}</p>}

                  <ul className="space-y-2 max-h-64 overflow-auto mt-2">
                    {tipoEntregaveis.map((tipo) => (
                      <li key={tipo.id} className="flex justify-between items-center border rounded p-2">
                        <span>{tipo.nome}</span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={async () => {
                            const emUso = entregaveis.some(
                              (ent) => ent.tipoEntregavel?.id === tipo.id
                            )
                            if (emUso) {
                              setTipoDeleteErro(`Cannot delete: there are deliverables using the type: "${tipo.nome}".`)
                              return
                            }
                            if (!confirm(`Do you want to delete the following deliverable type: "${tipo.nome}"?`)) return
                            try {
                              await deleteTipoEntregavel(tipo.id)
                              setTipoEntregaveis((prev) =>
                                prev.filter((t) => t.id !== tipo.id)
                              )
                              setTipoDeleteErro(null);
                            } catch (err) {
                              setTipoDeleteErro("Error deleting type. Please try again.");
                              console.error(err)
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </li>
                    ))}
                  </ul>
                </DialogContent>
              </Dialog>
            </>
          )}

          {criarTipo && (
            <div className="space-y-2">
              <Input
                placeholder="New deliverable type name"
                value={novoTipoNome}
                onChange={(e) => setNovoTipoNome(e.target.value)}
              />
              {tipoError && <p className="text-red-500 text-sm">{tipoError}</p>}
              <div className="flex gap-2">
                <Button variant="outline" type="button" onClick={() => {
                  setTipo(false)
                  setNovoTipoNome("")
                  setTipoError(null)
                }}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleCriarNovoTipo}>Create Type</Button>
              </div>
            </div>
          )}

          <label className="block">
            Activity
            <select
              className="w-full border rounded-md p-2 mt-1"
              value={atividadeId}
              onChange={(e) => setAtividadeId(e.target.value)}
            >
              <option value="">Select activity</option>
              {atividades.map((atividade) => (
                <option key={atividade.id} value={atividade.id}>
                  {atividade.nomeAtividade}
                </option>
              ))}
            </select>
          </label>
          {formErrors.atividadeId && <p className="text-red-500 text-sm">{formErrors.atividadeId}</p>}


          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              if (editingId) {
                setEditingId(null)
              } else {
                setShowForm(false)
              }
            }}>
              Cancel
            </Button>
            <Button onClick={editingId ? handleSaveEdit : handleCreate}>
              {editingId ? "Save" : "Create"}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {entregaveis.map((entregavel) => (
          <Card key={entregavel.id} className="shadow-md hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex justify-between items-start">
              <div>
                <CardTitle>{entregavel.nome}</CardTitle>
                <CardDescription>
                  {entregavel.descricao} <br />
                  Data: {new Date(entregavel.data).toLocaleDateString()} <br />
                  Tipo: {entregavel.tipoEntregavel?.nome || entregavel.tipoEntregavel?.id || "—"} <br />
                  Atividade: {entregavel.atividadeId || "—"}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={() => startEdit(entregavel)}>
                  <Edit2 className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(entregavel.id)}>
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
