"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { getShopPresetFromPath, SHOP_PRESET_LABELS } from "@/lib/shop-presets"

export function ShopExperience({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const preset = getShopPresetFromPath(pathname || "/")

  return (
    <div className={`shop-preset shop-preset-${preset}`} data-shop-preset={preset} data-shop-preset-label={SHOP_PRESET_LABELS[preset]}>
      {children}
    </div>
  )
}
