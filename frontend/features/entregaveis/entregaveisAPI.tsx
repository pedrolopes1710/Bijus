const BASE_URL = "http://localhost:5225/api/entregaveis";

export async function fetchEntregaveis() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Erro ao buscar entregáveis");
  return res.json();
}

export async function createEntregavel(data: {
  nome: string;
  descricao: string;
  data: string; // ISO string da data (ex: "2025-05-22T00:00:00Z")
  tipoEntregavel: { id: string }; 
  atividadeId?: string; 
}) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar entregável");
  return res.json();
}

export async function updateEntregavel(id: string, data: {
  id: string;
  nome: string;
  descricao: string;
  data: string; // ISO string
  tipoEntregavel: { id: string };
  atividadeId?: string;
}) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar entregável");
  return res.json();
}

export async function deleteEntregavel(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erro ao deletar entregável");
  return res.ok;
}
