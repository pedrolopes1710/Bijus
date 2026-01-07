export const dynamic = "force-dynamic"

import ColecaoClient from "./colecaoClient"

export default async function ColecaoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return <ColecaoClient slug={slug} />
}
