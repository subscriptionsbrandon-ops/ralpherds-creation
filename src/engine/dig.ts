// Digging mechanics — ported from legacy/strata-original.html's digAt/
// updateExposure. Kept store-agnostic (per src/engine/README.md): instead of
// directly mutating game meta (coins/xp/inventory) like the original did,
// this returns a description of what happened so the orchestrating
// GameEngine can apply it to the Zustand store in one place.
import { clamp, hash2, vnoise } from './noise'
import { layerIndexAt, paintDig } from './terrain'
import type { World } from './world'
import type { CategoryId, ItemDef, ToolDef } from './types'

export interface RecoveredItem {
  def: ItemDef
  x: number
  y: number
  half: number
}

export type DigOutcome =
  | { kind: 'blocked' }
  | { kind: 'insufficient-energy'; cost: number }
  | {
      kind: 'dug'
      cost: number
      li: number
      recovered: RecoveredItem[]
      hinted: CategoryId[]
      shake: number
      particleColor: [number, number, number]
    }

/** Mutates `world.depth`/`world.dctx`/each object's `exp` in place (matching
 * the original's imperative style) and reports what happened. */
export function digAt(world: World, tool: ToolDef, digId: number, energy: number, wxRaw: number, wyRaw: number): DigOutcome {
  const { W, H } = world
  const wx = clamp(wxRaw, 0, W - 1)
  const wy = clamp(wyRaw, 0, H - 1)
  if (world.waterY && wy < world.waterY[Math.round(wx)] + 4) return { kind: 'blocked' }
  const D0 = world.depth[(wy | 0) * W + (wx | 0)]
  if (D0 >= 0.99) return { kind: 'blocked' }
  const li = layerIndexAt(wx, wy, D0, world.ts)
  const hard = world.biome.layers[li].h
  const eff = li >= 2 ? tool.rock : tool.soft
  const cost = tool.cost * (li >= 2 ? 1.6 : 1)
  if (energy < cost) return { kind: 'insufficient-energy', cost }

  const r = tool.r
  const rx = Math.floor(wx - r * 1.4)
  const ry = Math.floor(wy - r * 1.4)
  const rs = Math.ceil(r * 2.8)
  const amt0 = (0.2 * eff) / hard
  for (let y = Math.max(0, ry); y < Math.min(H, ry + rs); y++) {
    for (let x = Math.max(0, rx); x < Math.min(W, rx + rs); x++) {
      const dx = x - wx
      const dy = y - wy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const ang = Math.atan2(dy, dx)
      const rr = r * (0.78 + 0.5 * vnoise(Math.cos(ang) * 1.5 + digId * 0.37, Math.sin(ang) * 1.5, world.ts + 99))
      if (dist > rr) continue
      const fall = Math.pow(1 - dist / rr, 0.8)
      const i = y * W + x
      world.depth[i] = Math.min(1, world.depth[i] + amt0 * fall * (0.8 + 0.4 * hash2(x, y, digId)))
    }
  }
  paintDig(world.dctx, wx, wy, r, digId, li, D0, world.ts, world.biome.layers)

  const { recovered, hinted } = updateExposure(world, rx, ry, rs, rs)

  return {
    kind: 'dug',
    cost,
    li,
    recovered,
    hinted,
    shake: li >= 2 ? 1.8 : 0,
    particleColor: world.biome.layers[Math.min(3, li)].c,
  }
}

function updateExposure(
  world: World,
  rx: number,
  ry: number,
  rw: number,
  rh: number,
): { recovered: RecoveredItem[]; hinted: CategoryId[] } {
  const { W, H } = world
  const recovered: RecoveredItem[] = []
  const hinted: CategoryId[] = []
  for (let k = 0; k < world.objects.length; k++) {
    const o = world.objects[k]
    if (o.recovered) continue
    if (o.x + o.half < rx || o.x - o.half > rx + rw || o.y + o.half < ry || o.y - o.half > ry + rh) continue
    let n = 0
    for (let i = 0; i < o.pts.length; i += 2) {
      const x = clamp(o.x - o.half + o.pts[i], 0, W - 1) | 0
      const y = clamp(o.y - o.half + o.pts[i + 1], 0, H - 1) | 0
      if (world.depth[y * W + x] >= o.depth) n++
    }
    const p = n / (o.pts.length / 2 || 1)
    o.exp = p
    if (p >= 0.28 && !o.hinted) {
      o.hinted = true
      hinted.push(o.def.cat)
    }
    if (p >= o.def.rec) {
      o.recovered = true
      o.exp = 1
      recovered.push({ def: o.def, x: o.x, y: o.y, half: o.half })
    }
  }
  return { recovered, hinted }
}
