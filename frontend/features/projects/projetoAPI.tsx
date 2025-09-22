export interface ApiProjeto {
    id: string
    nome: string
    descricao: string
    pessoaId?: string  
}

export interface CreateProjetoDto {
    nome: string
    descricao: string
    pessoaId?: string; 
}

export interface UpdateProjetoDto {
    nome: string
    descricao: string
    pessoaId?: string  
}

const BASE_URL = "http://localhost:5225/api/projetos"

export async function fetchProjetos(): Promise<ApiProjeto[]> {
    try {
        const response = await fetch(BASE_URL)
        if (!response.ok) {
            throw new Error(`Erro ao buscar projetos: ${response.status}`)
        }
        return await response.json()
    } catch (error) {
        console.error("Erro ao buscar projetos:", error)
        throw error
    }
}

export async function fetchProjetoById(id: string): Promise<ApiProjeto | null> {
    try {
        const response = await fetch(`${BASE_URL}/${id}`)
        if (response.status === 404) return null
        if (!response.ok) {
            throw new Error(`Erro ao buscar projeto: ${response.status}`)
        }
        return await response.json()
    } catch (error) {
        console.error(`Erro ao buscar projeto ${id}:`, error)
        return null
    }
}

export async function createProjeto(dto: CreateProjetoDto): Promise<ApiProjeto> {
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dto),
        })

        if (!response.ok) {
            throw new Error(`Erro ao criar projeto: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error("Erro ao criar projeto:", error)
        throw error
    }
}

// Atualizar um projeto existente
export async function updateProjeto(id: string, dto: UpdateProjetoDto): Promise<ApiProjeto | null> {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dto),
        })

        if (response.status === 404) return null
        if (!response.ok) {
            throw new Error(`Erro ao atualizar projeto: ${response.status}`)
        }

        return await response.json()
    } catch (error) {
        console.error("Erro ao atualizar projeto:", error)
        throw error
    }
}

// Deletar um projeto
export async function deleteProjeto(id: string): Promise<boolean> {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
        })

        if (response.status === 404) return false
        if (!response.ok) {
            throw new Error(`Erro ao excluir projeto: ${response.status}`)
        }

        return true
    } catch (error) {
        console.error("Erro ao excluir projeto:", error)
        throw error
    }
}
