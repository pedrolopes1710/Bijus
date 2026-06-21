export type ShopPreset = "default" | "jewelry" | "craft" | "beauty" | "kids" | "home-decor" | "checkout"

export const SHOP_PRESET_LABELS: Record<ShopPreset, string> = {
  default: "Boutique feminina",
  jewelry: "Joalharia delicada",
  craft: "Artesanal",
  beauty: "Beleza e cuidado",
  kids: "Infantil",
  "home-decor": "Casa e decoração",
  checkout: "Compra tranquila",
}

const CATEGORY_PRESETS: Record<string, ShopPreset> = {
  aneis: "jewelry",
  anel: "jewelry",
  colares: "jewelry",
  colar: "jewelry",
  brincos: "jewelry",
  brinco: "jewelry",
  pulseiras: "jewelry",
  pulseira: "jewelry",
  biscuit: "craft",
  "biscuit-artesanal": "craft",
  artesanal: "craft",
  beleza: "beauty",
  cosmetica: "beauty",
  skincare: "beauty",
  infantil: "kids",
  crianca: "kids",
  kids: "kids",
  casa: "home-decor",
  decoracao: "home-decor",
  decor: "home-decor",
}

export function getShopPresetFromPath(pathname: string): ShopPreset {
  const normalizedPath = pathname.toLowerCase()
  const segments = normalizedPath.split("/").filter(Boolean)
  const lastSegment = segments.at(-1) || ""

  if (["carrinho", "checkout", "pedido-confirmado", "login", "registo", "perfil"].some((segment) => segments.includes(segment))) {
    return "checkout"
  }

  if (segments.includes("produto")) {
    return getPresetFromSlug(lastSegment) || "default"
  }

  if (segments.includes("categoria")) {
    return getPresetFromSlug(lastSegment) || "default"
  }

  if (segments.includes("colecao") || segments.includes("colecoes")) {
    return "craft"
  }

  if (segments.includes("catalogo") || segments.includes("produtos") || segments.includes("categorias")) {
    return "default"
  }

  return "default"
}

function getPresetFromSlug(slug: string): ShopPreset | undefined {
  const match = Object.entries(CATEGORY_PRESETS).find(([keyword]) => slug.includes(keyword))
  return match?.[1]
}
