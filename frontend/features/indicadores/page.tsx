"use client"

import {useEffect, useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {MoreHorizontal, Plus, Trash2, Edit2, Save, X} from "lucide-react"
import {
    fetchIndicadores,
    createIndicador,
    updateIndicador,
    deleteIndicador,
} from "./indicadoresAPI"
import {fetchProjetos} from "../projects/projetoAPI"

export default function IndicatorsPage() {
    const [indicators, setIndicators] = useState<any[]>([])
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingProjects, setLoadingProjects] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [errorProjects, setErrorProjects] = useState<string | null>(null)

    const [showForm, setShowForm] = useState(false)
    const [projectId, setProjectId] = useState("")
    const [name, setName] = useState("")
    const [currentValue, setCurrentValue] = useState("")
    const [maxValue, setMaxValue] = useState("")
    const [formErrors, setFormErrors] = useState<any>({})

    const [editingId, setEditingId] = useState<string | null>(null)
    const [editCurrentValue, setEditCurrentValue] = useState("")

    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchIndicadores()
                setIndicators(data)
            } catch {
                setError("Error loading indicators.")
            } finally {
                setLoading(false)
            }

            try {
                const projectsData = await fetchProjetos()
                setProjects(projectsData)
            } catch {
                setErrorProjects("Error loading projects.")
            } finally {
                setLoadingProjects(false)
            }
        }

        load()
    }, [])

    function validateForm() {
        const errors: any = {}
        if (!projectId) errors.projectId = "Please select a project"
        if (!name.trim()) errors.name = "Please enter a name"
        if (!currentValue || isNaN(Number(currentValue))) errors.currentValue = "Please enter a valid number"
        if (!maxValue || isNaN(Number(maxValue))) errors.maxValue = "Please enter a valid number"
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    async function handleCreate() {
        if (!validateForm()) return
        try {
            const newIndicator = await createIndicador({
                projetoId: projectId,
                nome: name,
                valorAtual: Number(currentValue),
                valorMaximo: Number(maxValue),
            })
            setIndicators((prev) => [...prev, newIndicator])
            setProjectId("")
            setName("")
            setCurrentValue("")
            setMaxValue("")
            setShowForm(false)
            setFormErrors({})
        } catch (err) {
            alert("Error creating indicator")
            console.error(err)
        }
    }

    function startEditing(indicator: any) {
        setEditingId(indicator.id)
        setEditCurrentValue(indicator.valorAtual.toString())
    }

    async function handleSaveEdit(id: string) {
        if (!editCurrentValue.trim() || isNaN(Number(editCurrentValue))) {
            alert("Please enter a valid number for the current value")
            return
        }
        try {
            const updated = await updateIndicador(id, Number(editCurrentValue))
            setIndicators((prev) => prev.map((i) => (i.id === id ? updated : i)))
            setEditingId(null)
        } catch (err) {
            alert("Error updating indicator")
            console.error(err)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this indicator?")) return
        try {
            const ok = await deleteIndicador(id)
            if (ok) {
                setIndicators((prev) => prev.filter((i) => i.id !== id))
            }
        } catch {
            alert("Error deleting indicator")
        }
    }

    if (loading) return <p> Loading indicators...</p>
    if (error) return <p className="text-red-500">{error}</p>

    const filteredIndicators = indicators.filter((indicator) =>
        indicator.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-4">
            <h1 className="text-2xl font-bold">📊 Indicators</h1>

            <div className="relative max-w-sm mb-4">
                <Input
                    placeholder=" Search indicators..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-muted-foreground">
                    
                </div>
            </div>

            <Button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 mb-4 bg-blue-600 text-white hover:bg-blue-700"
            >
                <Plus className="w-4 h-4"/> {showForm ? "Close Form" : "New Indicator"}
            </Button>

            {showForm && (
                <div className="border border-gray-300 rounded-xl p-4 bg-white shadow space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Project</label>
                        <select
                            value={projectId}
                            onChange={(e) => setProjectId(e.target.value)}
                            className="w-full border rounded-md p-2"
                        >
                            <option value="">Select a project</option>
                            {projects.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nome}
                                </option>
                            ))}
                        </select>
                        {formErrors.projectId && <p className="text-red-500 text-sm">{formErrors.projectId}</p>}
                    </div>

                    <div>
                        <Input
                            placeholder="e.g. Quality"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
                    </div>

                    <div>
                        <Input
                            placeholder="Current Value (e.g. 40)"
                            type="text"
                            value={currentValue}
                            onChange={(e) => setCurrentValue(e.target.value)}
                        />
                        {formErrors.currentValue && <p className="text-red-500 text-sm">{formErrors.currentValue}</p>}
                    </div>

                    <div>
                        <Input
                            placeholder="Max Value (e.g. 100)"
                            type="text"
                            value={maxValue}
                            onChange={(e) => setMaxValue(e.target.value)}
                        />
                        {formErrors.maxValue && <p className="text-red-500 text-sm">{formErrors.maxValue}</p>}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowForm(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate}>Create</Button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {filteredIndicators.map((indicator) => (
                    <Card key={indicator.id} className="shadow-md hover:shadow-lg transition-all duration-200">
                        <CardHeader className="flex justify-between items-center">
                            <div>
                                <CardTitle>{indicator.nome}</CardTitle>
                                <CardDescription>ID: {indicator.id}</CardDescription>
                            </div>

                            {editingId === indicator.id ? (
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="number"
                                        value={editCurrentValue}
                                        onChange={(e) => setEditCurrentValue(e.target.value)}
                                        className="w-24"
                                    />
                                    <Button variant="outline" size="icon" onClick={() => setEditingId(null)}>
                                        <X className="w-4 h-4"/>
                                    </Button>
                                    <Button size="icon" onClick={() => handleSaveEdit(indicator.id)}>
                                        <Save className="w-4 h-4"/>
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <span>
                                        Current Value: <strong>{indicator.valorAtual}</strong> / {indicator.valorMaximo}
                                    </span>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="w-5 h-5"/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => startEditing(indicator)}>
                                                <Edit2 className="w-4 h-4 mr-2"/> Edit Value
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(indicator.id)}>
                                                <Trash2 className="w-4 h-4 mr-2"/> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    )
}
