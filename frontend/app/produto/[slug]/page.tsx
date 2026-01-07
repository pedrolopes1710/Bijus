export const dynamic = "force-dynamic"

import ProdutoClient from "./produtoClient"

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return <ProdutoClient slug={slug} />
}
