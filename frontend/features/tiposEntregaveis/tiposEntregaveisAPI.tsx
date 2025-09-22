const BASE_URL = "http://localhost:5225/api/tiposentregavel";

export interface TipoEntregavel {
  id: string;
  nome: string;
}

export interface TipoEntregavelCreate {
  nome: string;
}

export async function fetchTiposEntregavel(): Promise<TipoEntregavel[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Erro ao buscar tipos de entregável");
  return res.json();
}

export async function createTipoEntregavel(data: TipoEntregavelCreate): Promise<TipoEntregavel> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar tipo de entregável");
  return res.json();
}


export async function deleteTipoEntregavel(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erro ao deletar tipo de entregável");
}
