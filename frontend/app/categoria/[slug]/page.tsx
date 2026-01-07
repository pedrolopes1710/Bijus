export const dynamic = "force-dynamic"

import CategoriaClient from "./categoriaClient"

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return <CategoriaClient slug={slug} />
}
