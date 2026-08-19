// Renders a catalog item's procedural sprite into an <img> — the React
// equivalent of legacy/strata-original.html's inline `iconHTML()`.
import { useMemo } from 'react'
import { renderItemIcon } from '@/engine/sprites'
import type { ItemDef } from '@/engine/types'

export function ItemIcon({ def, size, silhouette }: { def: ItemDef; size: number; silhouette?: boolean }) {
  const src = useMemo(
    () => renderItemIcon(def.draw, def.opts, def.w, def.h, size, silhouette).toDataURL(),
    [def, size, silhouette],
  )
  return <img src={src} width={size} height={size} draggable={false} alt={silhouette ? '???' : def.name} />
}
