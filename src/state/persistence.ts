// localStorage save/load — ported from legacy/strata-original.html's
// saveMeta/loadMeta, same key and shape so existing saves keep working.

export const SAVE_KEY = 'strata-save-v1'

export interface PersistedMeta {
  lvl: number
  xp: number
  coins: number
  found: string[]
  exp: number
  inv: Record<string, number>
}

export function saveMeta(meta: { lvl: number; xp: number; coins: number; found: Set<string>; exp: number; inv: Record<string, number> }) {
  try {
    const payload: PersistedMeta = {
      lvl: meta.lvl,
      xp: meta.xp,
      coins: meta.coins,
      found: [...meta.found],
      exp: meta.exp,
      inv: meta.inv,
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload))
  } catch {
    // storage unavailable (private mode / sandboxed) — play session-only
  }
}

export interface LoadedMeta {
  lvl: number
  xp: number
  coins: number
  found: Set<string>
  exp: number
  inv: Record<string, number>
}

export function loadMeta(): LoadedMeta | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as Partial<PersistedMeta> | null
    if (!s) return null
    const found = new Set<string>(Array.isArray(s.found) ? s.found : [])
    const inv: Record<string, number> =
      s.inv && typeof s.inv === 'object' ? s.inv : Object.fromEntries([...found].map((id) => [id, 1])) // migrate pre-inventory saves: 1 of each catalogued item
    return {
      lvl: Math.max(1, s.lvl! | 0),
      xp: Math.max(0, +s.xp! || 0),
      coins: Math.max(0, s.coins! | 0),
      exp: Math.max(0, s.exp! | 0),
      found,
      inv,
    }
  } catch {
    return null
  }
}
