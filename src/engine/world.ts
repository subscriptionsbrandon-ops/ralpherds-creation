// World generation — ported from legacy/strata-original.html's
// sizeWorld/makeObj/generate. World size and the RNG-driven object/decor
// placement are unchanged; state that was module-level globals there
// (`world`, `W`, `H`) is now the returned `World` object.
import { clamp, hashStr, mkCanvas, mulberry } from './noise'
import { DRAW } from './sprites'
import { paintSurface } from './terrain'
import type { Biome, BiomeId, ItemDef } from './types'
import { CATALOG } from '@/data/catalog'

export const WORLD_MAX = 1280
export const WORLD_MIN = 480

/** Match the screen's aspect ratio (no letterbox, correct zoom) but keep the
 * LONGER axis capped at WORLD_MAX so terrain/surface canvases stay under
 * mobile browser canvas-area limits — oversized canvases make getImageData
 * silently return blank, which shows as digs depleting energy but not rendering. */
export function sizeWorld(innerWidth: number, innerHeight: number): { W: number; H: number } {
  const iw = innerWidth || 1280
  const ih = innerHeight || 960
  const ar = iw / ih
  let w: number
  let h: number
  if (ar >= 1) {
    w = WORLD_MAX
    h = Math.round(WORLD_MAX / ar)
  } else {
    h = WORLD_MAX
    w = Math.round(WORLD_MAX * ar)
  }
  return {
    W: clamp(Math.round(w / 2) * 2, WORLD_MIN, WORLD_MAX),
    H: clamp(Math.round(h / 2) * 2, WORLD_MIN, WORLD_MAX),
  }
}

export interface BuriedObject {
  def: ItemDef
  x: number
  y: number
  side: number
  half: number
  cv: HTMLCanvasElement
  pts: number[]
  depth: number
  exp: number
  recovered: boolean
  hinted: boolean
  sox: number
  soy: number
}

export function makeObj(defId: string, R: () => number, x: number, y: number): BuriedObject {
  const d = CATALOG[defId]
  const sc = 0.85 + R() * 0.35
  const w = Math.round(d.w * sc)
  const h = Math.round(d.h * sc)
  const rot = d.large ? (R() - 0.5) * 0.9 : R() * Math.PI * 2
  const side = Math.ceil(Math.hypot(w, h)) + 4
  const c = mkCanvas(side, side)
  const g = c.getContext('2d')!
  g.save()
  g.translate(side / 2, side / 2)
  g.rotate(rot)
  g.translate(-w / 2, -h / 2)
  DRAW[d.draw](g, w, h, d.opts)
  g.restore()
  const sdata = g.getImageData(0, 0, side, side)
  const pts: number[] = []
  const step = Math.max(4, Math.floor(side / 26))
  for (let yy = 0; yy < side; yy += step)
    for (let xx = 0; xx < side; xx += step) {
      if (sdata.data[(yy * side + xx) * 4 + 3] > 70) pts.push(xx, yy)
    }
  return {
    def: d,
    x: Math.round(x),
    y: Math.round(y),
    side,
    half: side / 2,
    cv: c,
    pts,
    depth: 0,
    exp: 0,
    recovered: false,
    hinted: false,
    sox: (R() - 0.5) * 70,
    soy: (R() - 0.5) * 70,
  }
}

export interface World {
  seedStr: string
  biome: Biome
  biomeId: BiomeId
  surface: HTMLCanvasElement
  digCv: HTMLCanvasElement
  dctx: CanvasRenderingContext2D
  objCv: HTMLCanvasElement
  octx: CanvasRenderingContext2D
  depth: Float32Array
  objects: BuriedObject[]
  waterY: Float32Array | null
  ts: number
  W: number
  H: number
}

export function generate(
  biomes: Record<BiomeId, Biome>,
  biomeId: BiomeId,
  seedStr: string,
  innerWidth: number,
  innerHeight: number,
): World {
  const { W, H } = sizeWorld(innerWidth, innerHeight)
  const b = biomes[biomeId]
  const R = mulberry(hashStr(biomeId + '|' + seedStr.toUpperCase()))
  const ns = R() * 997
  const ps = paintSurface(b, R, ns, W, H)
  const digCv = mkCanvas(W, H)
  const dctx = digCv.getContext('2d')!
  const objCv = mkCanvas(W, H)
  const octx = objCv.getContext('2d')!
  const depth = new Float32Array(W * H)
  const yMin = ps.waterY ? H * 0.22 : H * 0.09
  const objects: BuriedObject[] = []
  const nLarge = 1 + (R() < 0.35 ? 1 : 0)
  for (let i = 0; i < nLarge; i++) {
    const id = b.large[(R() * b.large.length) | 0]
    const o = makeObj(id, R, W * 0.2 + R() * W * 0.6, yMin + (H - yMin) * (0.15 + R() * 0.6))
    o.depth = 0.32 + R() * 0.28
    objects.push(o)
  }
  const tot = b.items.reduce((s, it) => s + it[1], 0)
  const n = 11 + ((R() * 5) | 0)
  for (let i = 0; i < n; i++) {
    let r = R() * tot
    let id = b.items[0][0]
    for (let k = 0; k < b.items.length; k++) {
      r -= b.items[k][1]
      if (r <= 0) {
        id = b.items[k][0]
        break
      }
    }
    let x = W / 2
    let y = H / 2
    let ok = false
    for (let t = 0; t < 25 && !ok; t++) {
      x = W * 0.06 + R() * W * 0.88
      y = yMin + R() * (H - yMin - H * 0.06)
      ok = true
      for (let j = 0; j < objects.length; j++) {
        const o = objects[j]
        if (Math.hypot(o.x - x, o.y - y) < o.half + 50) {
          ok = false
          break
        }
      }
    }
    const o = makeObj(id, R, x, y)
    o.depth = 0.2 + R() * 0.5
    objects.push(o)
  }
  return {
    seedStr: seedStr.toUpperCase(),
    biome: b,
    biomeId,
    surface: ps.c,
    digCv,
    dctx,
    objCv,
    octx,
    depth,
    objects,
    waterY: ps.waterY,
    ts: ns,
    W,
    H,
  }
}
