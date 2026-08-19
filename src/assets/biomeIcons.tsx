// Biome icons — ported verbatim from legacy/strata-original.html's
// `BIOME_ICONS` (Lucide, ISC license, inlined as static paths there to avoid
// a runtime fetch in the single-file build). Now that we have a real
// package manager, these render through the actual `lucide-react` package
// instead of hand-copied path data — see the per-icon mapping below.
import { Sailboat, Pyramid, Mountain, Flame, Snowflake, Gem, type LucideIcon } from 'lucide-react'
import type { BiomeId } from '@/engine/types'

const ICONS: Record<BiomeId, LucideIcon> = {
  beach: Sailboat,
  desert: Pyramid,
  mountain: Mountain,
  volcano: Flame,
  tundra: Snowflake,
  crystal: Gem,
}

export function BiomeIcon({ id, color, size = 20 }: { id: BiomeId; color: string; size?: number }) {
  const Icon = ICONS[id]
  return <Icon color={color} size={size} strokeWidth={2} />
}
