// The single source of truth for coarse, low-frequency game state — ported
// from legacy/strata-original.html's `meta`/`state`/`ui` globals. Read via
// `useGameStore()` from React components and via `useGameStore.getState()`/
// `.setState()` from the engine (see src/engine/GameEngine.ts), same as any
// other Zustand store — no React dependency either way.
import { create } from 'zustand'
import { Coins, Radar, ScanSearch, Star, type LucideIcon } from 'lucide-react'
import type { BiomeId, CategoryId, ItemDef, ToolId, UiMode } from '@/engine/types'
import { CATALOG, CATHINT } from '@/data/catalog'
import { RARITY } from '@/data/rarity'
import { loadMeta, saveMeta } from './persistence'

const RARITY_COLOR = Object.fromEntries(Object.entries(RARITY).map(([k, v]) => [k, v.c])) as Record<string, string>
const RARITY_NAME = Object.fromEntries(Object.entries(RARITY).map(([k, v]) => [k, v.n])) as Record<string, string>

export interface Toast {
  id: number
  /** Plain text, rendered as a React text node (never HTML) — see
   * ToastStack.tsx. A caught error's `.message` has ended up in here before
   * (see git history); nothing that flows into this field should ever be
   * treated as markup, only ever as display text. */
  text: string
  color?: string
  icon?: LucideIcon
}

interface GameState {
  // persisted meta
  lvl: number
  xp: number
  coins: number
  found: Set<string>
  expeditions: number
  inv: Record<string, number>

  // current run (not persisted)
  energy: number
  maxE: number
  tool: ToolId
  scans: number
  finds: ItemDef[]

  // ui
  mode: UiMode
  prevMode: UiMode | null
  panMode: boolean
  musTab: 'All' | CategoryId
  startSel: BiomeId
  currentBiome: BiomeId | null
  currentSeed: string | null
  lastRemaining: number
  toasts: Toast[]

  // actions
  setTool: (id: ToolId) => void
  togglePanMode: () => void
  setMusTab: (tab: 'All' | CategoryId) => void
  setStartSel: (id: BiomeId) => void
  spendEnergy: (cost: number) => void
  useScan: () => boolean
  hintToast: (cat: CategoryId) => void
  recoverItem: (def: ItemDef) => void
  startExpedition: (biomeId: BiomeId, seed: string) => void
  endExpedition: (remaining?: number) => void
  openMuseum: () => void
  closeMuseum: () => void
  showStart: () => void
  showTrade: () => void
  leaveTrade: () => void
  pushToast: (text: string, color?: string, icon?: LucideIcon) => void
  removeToast: (id: number) => void
  applyTradeResult: (coinsDelta: number, itemsGained: Record<string, number>, itemsLost: Record<string, number>) => number
}

const xpNeed = (lvl: number) => 90 + (lvl - 1) * 70

let toastId = 0

/** persistence.ts uses the original field name `exp` for expedition count;
 * the store uses `expeditions` for clarity. This adapts between them. */
function persist(s: GameState) {
  saveMeta({ lvl: s.lvl, xp: s.xp, coins: s.coins, found: s.found, exp: s.expeditions, inv: s.inv })
}

export const useGameStore = create<GameState>((set, get) => ({
  lvl: 1,
  xp: 0,
  coins: 0,
  found: new Set(),
  expeditions: 0,
  inv: {},

  energy: 0,
  maxE: 0,
  tool: 'trowel',
  scans: 3,
  finds: [],

  mode: 'menu',
  prevMode: null,
  panMode: false,
  musTab: 'All',
  startSel: 'beach',
  currentBiome: null,
  currentSeed: null,
  lastRemaining: 0,
  toasts: [],

  setTool: (id) => set({ tool: id }),
  togglePanMode: () => set((s) => ({ panMode: !s.panMode })),
  setMusTab: (tab) => set({ musTab: tab }),
  setStartSel: (id) => set({ startSel: id }),

  spendEnergy: (cost) => set((s) => ({ energy: s.energy - cost })),

  useScan: () => {
    const s = get()
    if (s.scans <= 0) {
      get().pushToast('No scanner charges left', undefined, Radar)
      return false
    }
    set({ scans: s.scans - 1 })
    get().pushToast('Scanning… faint underground signatures revealed', undefined, Radar)
    return true
  },

  hintToast: (cat) => {
    get().pushToast('Something is emerging… looks like ' + CATHINT[cat], undefined, ScanSearch)
  },

  recoverItem: (def) => {
    const rarityColor = RARITY_COLOR[def.rar]
    set((s) => ({
      coins: s.coins + def.val,
      inv: { ...s.inv, [def.id]: (s.inv[def.id] || 0) + 1 },
      found: new Set(s.found).add(def.id),
      finds: [...s.finds, def],
    }))
    // Border color (see ToastStack.tsx) already carries the rarity cue, so
    // the text itself doesn't need to repeat it — it used to via inline
    // HTML spans (`<b style="color:...">`), which this plain-text field
    // deliberately no longer supports; see the Toast.text doc comment.
    get().pushToast(`${def.name} recovered! ${RARITY_NAME[def.rar]} · +${def.val}`, rarityColor, Coins)
    addXP(set, get, def.xp)
    persist(get())
  },

  startExpedition: (biomeId, seed) => {
    set((s) => ({
      mode: 'play',
      panMode: false,
      maxE: 240 + (s.lvl - 1) * 30,
      energy: 240 + (s.lvl - 1) * 30,
      finds: [],
      scans: 3,
      currentBiome: biomeId,
      currentSeed: seed,
      expeditions: s.expeditions + 1,
    }))
    persist(get())
    get().pushToast('Expedition ' + get().expeditions + ' started — dig anywhere')
  },

  endExpedition: (remaining = 0) => set({ mode: 'summary', lastRemaining: remaining }),

  openMuseum: () => {
    const s = get()
    set({ prevMode: s.mode === 'museum' ? s.prevMode : s.mode, mode: 'museum' })
  },

  closeMuseum: () => {
    const p = get().prevMode
    set({ prevMode: null })
    if (p === 'play') set({ mode: 'play' })
    else if (p === 'summary') set({ mode: 'summary' })
    else set({ mode: 'menu' })
  },

  showStart: () => set({ mode: 'menu', prevMode: null }),
  showTrade: () => set({ mode: 'trade' }),
  leaveTrade: () => set({ mode: 'menu' }),

  pushToast: (text, color, icon) => {
    const id = ++toastId
    // Cap at 4 visible, like the original's `while(t.children.length>4)
    // t.removeChild(t.firstChild)` — each toast still self-removes on its
    // own timer (see ToastStack.tsx), this just bounds a sudden burst.
    set((s) => {
      const next = [...s.toasts, { id, text, color, icon }]
      return { toasts: next.length > 4 ? next.slice(next.length - 4) : next }
    })
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  applyTradeResult: (coinsDelta, itemsGained, itemsLost) => {
    let newlyCatalogued = 0
    set((s) => {
      const inv = { ...s.inv }
      for (const id in itemsLost) {
        const n = Math.min(itemsLost[id] | 0, inv[id] || 0)
        if (n > 0) {
          inv[id] -= n
          if (inv[id] <= 0) delete inv[id]
        }
      }
      const found = new Set(s.found)
      for (const id in itemsGained) {
        if (!CATALOG[id]) continue
        const n = Math.max(0, Math.min(99, itemsGained[id] | 0))
        if (n > 0) {
          inv[id] = (inv[id] || 0) + n
          if (!found.has(id)) {
            found.add(id)
            newlyCatalogued++
          }
        }
      }
      return { coins: Math.max(0, s.coins + coinsDelta), inv, found }
    })
    persist(get())
    return newlyCatalogued
  },
}))

function addXP(set: (fn: (s: GameState) => Partial<GameState>) => void, get: () => GameState, n: number) {
  set((s) => ({ xp: s.xp + n }))
  while (get().xp >= xpNeed(get().lvl)) {
    const need = xpNeed(get().lvl)
    set((s) => ({ xp: s.xp - need, lvl: s.lvl + 1 }))
    get().pushToast('Level up! Now level ' + get().lvl, '#e8b34b', Star)
  }
}

export function xpNeeded(lvl: number) {
  return xpNeed(lvl)
}

/** Hydrates the store from localStorage (if any save exists) at boot, then
 * applies the TEST MODE unlock (kept intentionally — used to test the
 * trading feature, see legacy/strata-original.html's same block). Returns
 * whether a save was found, so the caller can show the "restored" toast. */
export function hydrateFromSave(): boolean {
  const loaded = loadMeta()
  if (loaded) {
    useGameStore.setState({
      lvl: loaded.lvl,
      xp: loaded.xp,
      coins: loaded.coins,
      found: loaded.found,
      expeditions: loaded.exp,
      inv: loaded.inv,
    })
  }
  // ===== TEST MODE: full unlock for trade testing =====
  useGameStore.setState((s) => {
    const found = new Set(s.found)
    const inv = { ...s.inv }
    for (const id in CATALOG) {
      found.add(id)
      if ((inv[id] | 0) < 3) inv[id] = 3
    }
    return { found, inv, coins: Math.max(s.coins, 500) }
  })
  persist(useGameStore.getState())
  // ===== end TEST MODE =====
  return !!loaded
}
