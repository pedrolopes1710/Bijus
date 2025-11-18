import type { Categoria, Produto, DadosRegisto, DadosLogin, Usuario } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5225/api"

export async function fetchCategorias(): Promise<Categoria[]> {
  try {
    console.log("[v0] Fetching categorias from:", `${API_BASE_URL}/categorias`)
    const response = await fetch(`${API_BASE_URL}/categorias`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Categorias fetched successfully:", data.length, "items")
    return data
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    throw new Error("Falha ao carregar categorias. Verifique se a API está funcionando.")
  }
}

export async function fetchProdutos(): Promise<Produto[]> {
  try {
    console.log("[v0] Fetching produtos from:", `${API_BASE_URL}/produtos`)
    const response = await fetch(`${API_BASE_URL}/produtos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Produtos fetched successfully:", data.length, "items")
    return data
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    throw new Error("Falha ao carregar produtos. Verifique se a API está funcionando.")
  }
}

export async function fetchProdutosPorCategoria(categoriaId: string): Promise<Produto[]> {
  try {
    console.log("[v0] Fetching produtos by categoria:", categoriaId)
    const response = await fetch(`${API_BASE_URL}/produtos?categoria=${categoriaId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Produtos by categoria fetched successfully:", data.length, "items")
    return data
  } catch (error) {
    console.error("Erro ao buscar produtos por categoria:", error)
    throw new Error("Falha ao carregar produtos da categoria. Verifique se a API está funcionando.")
  }
}

export async function registarUsuario(dados: DadosRegisto): Promise<{ usuario: Usuario; token: string }> {
  try {
    console.log("[v0] Criando cliente:", dados.email)
    
    // Passo 1: Criar o cliente
    const clienteResponse = await fetch(`${API_BASE_URL}/clientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: dados.nome,
        email: dados.email,
        morada: dados.morada,
      }),
    })

    if (!clienteResponse.ok) {
      let errorMessage = "Erro ao criar cliente"
      
      try {
        const error = await clienteResponse.json()
        errorMessage = error.message || error.error || errorMessage
      } catch {
        if (clienteResponse.status === 409 || clienteResponse.status === 400) {
          errorMessage = "Este email já está registrado. Por favor, use outro email ou faça login."
        } else if (clienteResponse.status === 422) {
          errorMessage = "Dados inválidos. Verifique as informações fornecidas."
        } else if (clienteResponse.status >= 500) {
          errorMessage = "Erro no servidor. Tente novamente mais tarde."
        }
      }
      
      throw new Error(errorMessage)
    }

    const cliente = await clienteResponse.json()
    console.log("[v0] Cliente criado com sucesso:", cliente.id)

    // Passo 2: Criar o usuário com o clienteId
    console.log("[v0] Criando usuário:", dados.username)
    const userResponse = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: dados.username,
        password: dados.password, // Password em texto puro - backend faz hash
        clienteId: cliente.id,
      }),
    })

    if (!userResponse.ok) {
      let errorMessage = "Erro ao criar usuário"
      
      try {
        const error = await userResponse.json()
        errorMessage = error.message || error.error || errorMessage
      } catch {
        if (userResponse.status === 409 || userResponse.status === 400) {
          errorMessage = "Este username já está em uso. Por favor, escolha outro."
        } else if (userResponse.status === 422) {
          errorMessage = "Dados inválidos. Verifique as informações fornecidas."
        } else if (userResponse.status >= 500) {
          errorMessage = "Erro no servidor. Tente novamente mais tarde."
        }
      }
      
      throw new Error(errorMessage)
    }

    const result = await userResponse.json()
    console.log("[v0] Usuário criado com sucesso:", result.usuario?.id || result.id)
    
    // Retornar no formato esperado pelo contexto
    return {
      usuario: result.usuario || result,
      token: result.token || ""
    }
  } catch (error) {
    console.error("Erro ao registrar:", error)
    throw error
  }
}

export async function loginUsuario(dados: DadosLogin): Promise<{usuario: Usuario; token: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserOrEmail: dados.username,
        userPassword: dados.password,
      }),
    });
    console.log("Body enviado:", JSON.stringify({
        UserOrEmail: dados.username,
        Password: dados.password,
      }))
    
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || "Erro ao fazer login");
    }

    const result = await response.json();
    console.log("[API] Login response:", result);

    // Aqui está a estrutura correta
    const jwt = result.token.token;
    const usuario = result.token.user;

    return {
      usuario,
      token: jwt,
    };
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
}

export async function verificarToken(token: string): Promise<Usuario> {
  try {
    console.log("[v0] Verificando token")
    const response = await fetch(`${API_BASE_URL}/usuarios/verificar`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Token inválido")
    }

    const usuario = await response.json()
    console.log("[v0] Token válido:", usuario.id)
    return usuario
  } catch (error) {
    console.error("Erro ao verificar token:", error)
    throw error
  }
}

export async function fetchUsuario(username: string): Promise<Usuario> {
  try {
    console.log("[v0] Buscando utilizador:", username)
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const users = await response.json()
    console.log("[v0] Users fetched:", users.length)
    
    // Filtrar pelo username
    const usuario = users.find((u: Usuario) => u.userName === username)
    
    if (!usuario) {
      throw new Error("Utilizador não encontrado")
    }
    
    console.log("[v0] Utilizador encontrado:", usuario.id)
    return usuario
  } catch (error) {
    console.error("Erro ao buscar utilizador:", error)
    throw error
  }
}
