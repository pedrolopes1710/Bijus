// Semeia a base de dados (categorias + produtos com imagens) via API, como admin.
// Uso: node scripts/seed.mjs   (com o backend a correr em http://localhost:5225)
import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

const API = process.env.API || "http://localhost:5225/api"
const ADMIN_USER = process.env.SEED_USER || "admin"
const ADMIN_PASS = process.env.SEED_PASS || "Admin123!"
const UPLOADS = path.resolve(process.cwd(), "public/uploads/produtos")

async function main() {
  // 1) login
  const loginRes = await fetch(`${API}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ UserOrEmail: ADMIN_USER, userPassword: ADMIN_PASS }),
  })
  if (!loginRes.ok) throw new Error(`Login falhou (${loginRes.status}). Confirma ADMIN_USERS e a conta.`)
  const { token, isAdmin } = await loginRes.json()
  if (!isAdmin) throw new Error("A conta não é admin. Adiciona o username a ADMIN_USERS e reinicia o backend.")
  const auth = { Authorization: `Bearer ${token}` }
  console.log("✓ login admin ok")

  // 2) categorias
  const nomesCategorias = ["Bonecos Grandes", "Miniaturas", "Edição Natal", "Presença de Mesa"]
  const existentes = await (await fetch(`${API}/categorias`)).json()
  const catId = {}
  for (const nome of nomesCategorias) {
    let cat = existentes.find((c) => c.nome === nome)
    if (!cat) {
      const r = await fetch(`${API}/categorias`, {
        method: "POST",
        headers: { ...auth, "Content-Type": "application/json" },
        body: JSON.stringify({ nome }),
      })
      cat = await r.json()
      console.log(`+ categoria: ${nome}`)
    }
    catId[nome] = cat.id
  }

  // 3) produtos (usa imagens reais da pasta uploads/produtos)
  const imagens = (await readdir(UPLOADS)).filter((f) => /\.(jpe?g|png)$/i.test(f))
  const img = (i) => imagens[i % imagens.length]

  const produtos = [
    { nome: "Bailarina em Ponta", descricao: "Figura em biscuit modelada e pintada à mão, com saia em tons de rosa.", preco: 48, stock: 4, categoria: "Bonecos Grandes" },
    { nome: "Casal dos Noivos", descricao: "Topo de bolo personalizável, peça única feita por encomenda.", preco: 62, stock: 2, categoria: "Bonecos Grandes" },
    { nome: "Menina com Balões", descricao: "Cena romântica modelada ao detalhe, com balões coloridos.", preco: 39, stock: 6, categoria: "Bonecos Grandes" },
    { nome: "Miniatura Gatinho", descricao: "Gatinho miniatura pintado à mão — cabe na palma da mão.", preco: 12, stock: 30, categoria: "Miniaturas" },
    { nome: "Coelhinho da Sorte", descricao: "Coelho em biscuit com laço e acabamento fosco.", preco: 14, stock: 0, categoria: "Miniaturas" },
    { nome: "Trio de Passarinhos", descricao: "Conjunto de três aves delicadas para um centro de mesa.", preco: 28, stock: 9, categoria: "Presença de Mesa" },
    { nome: "Vaso de Rosas", descricao: "Arranjo floral inteiramente modelado em biscuit, pétala a pétala.", preco: 54, stock: 3, categoria: "Presença de Mesa" },
    { nome: "Pai Natal Clássico", descricao: "Pai Natal tradicional com saco de prendas, em vermelho e branco.", preco: 34, stock: 11, categoria: "Edição Natal" },
    { nome: "Boneco de Neve", descricao: "Boneco de neve sorridente com cachecol.", preco: 20, stock: 7, categoria: "Edição Natal" },
  ]

  const jaExistem = await (await fetch(`${API}/produtos`)).json()
  let criados = 0
  for (let i = 0; i < produtos.length; i++) {
    const p = produtos[i]
    if (jaExistem.some((e) => e.nome === p.nome)) {
      console.log(`= já existe: ${p.nome}`)
      continue
    }
    const fd = new FormData()
    fd.append("Nome", p.nome)
    fd.append("Descricao", p.descricao)
    fd.append("Preco", String(p.preco))
    fd.append("Stock", String(p.stock))
    fd.append("CategoriaId", catId[p.categoria])
    const file = img(i)
    const buf = await readFile(path.join(UPLOADS, file))
    fd.append("Fotos", new Blob([buf], { type: "image/jpeg" }), file)

    const r = await fetch(`${API}/produtos`, { method: "POST", headers: auth, body: fd })
    if (r.ok) {
      criados++
      console.log(`+ produto: ${p.nome}`)
    } else {
      console.log(`! falhou ${p.nome}: ${r.status} ${await r.text()}`)
    }
  }

  console.log(`\nConcluído. ${criados} produtos criados, ${nomesCategorias.length} categorias garantidas.`)
}

main().catch((err) => {
  console.error("Erro no seed:", err.message)
  process.exit(1)
})
