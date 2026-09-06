import { redirect } from "next/navigation"

// Rota legada: o catálogo é a página oficial de listagem de produtos.
export default function ProdutosPage() {
  redirect("/catalogo")
}
