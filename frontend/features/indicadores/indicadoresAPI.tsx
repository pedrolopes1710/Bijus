const BASE_URL = "http://localhost:5225/api/indicador"

export async function fetchIndicadores() {
    const res = await fetch(BASE_URL)
    if (!res.ok) throw new Error("Erro ao buscar indicadores")
    return res.json()
}

export async function createIndicador(data: {
    projetoId: string
    nome: string
    valorAtual: number
    valorMaximo: number
}) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Erro ao criar indicador")
    return res.json()
}

export async function updateIndicador(id: string, novoValorAtual: number) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoValorAtual),
    })
    if (!res.ok) throw new Error("Erro ao atualizar indicador")
    return res.json()
}

export async function deleteIndicador(id: string) {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" })
    return res.ok
}
