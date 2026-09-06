import { readdir, mkdir, copyFile, stat, rename } from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"
import sharp from "sharp"

const ROOT = path.resolve(process.cwd(), "public/uploads")
const DIRS = ["produtos", "colecoes"]
const MAX_WIDTH = 1600
const QUALITY = 80
const MIN_BYTES = 400 * 1024 // só otimiza ficheiros acima de 400 KB

let saved = 0
let processed = 0

for (const dir of DIRS) {
  const abs = path.join(ROOT, dir)
  if (!existsSync(abs)) continue

  const backupDir = path.join(abs, "_original")
  await mkdir(backupDir, { recursive: true })

  const files = (await readdir(abs, { withFileTypes: true }))
    .filter((d) => d.isFile() && /\.(jpe?g|png|webp)$/i.test(d.name))
    .map((d) => d.name)

  for (const name of files) {
    const src = path.join(abs, name)
    const info = await stat(src)
    if (info.size < MIN_BYTES) continue

    const backup = path.join(backupDir, name)
    if (!existsSync(backup)) await copyFile(src, backup)

    const tmp = path.join(abs, `.tmp-${name}`)
    await sharp(backup)
      .rotate() // respeita orientação EXIF
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(tmp)

    await rename(tmp, src)

    const after = (await stat(src)).size
    saved += info.size - after
    processed++
    console.log(
      `${dir}/${name}  ${(info.size / 1048576).toFixed(1)}MB -> ${(after / 1024).toFixed(0)}KB`,
    )
  }
}

console.log(`\n${processed} imagens otimizadas · poupado ${(saved / 1048576).toFixed(1)} MB`)
console.log("Originais guardados em public/uploads/<pasta>/_original/")
