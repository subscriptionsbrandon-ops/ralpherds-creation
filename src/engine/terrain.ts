// Terrain painting — ported from legacy/strata-original.html's
// paintTerrainBase/paintSurface/thAt/layerIndexAt/paintDig. Parameterized on
// W/H/ts instead of reading module-level globals, so the World object
// (engine/world.ts) owns that state instead of the module.
import { TAU, clamp, fbm, mkCanvas, vnoise } from './noise'
import { DECOR, type RandFn } from './decor'
import type { Biome, TerrainLayer } from './types'

export function paintTerrainBase(g: CanvasRenderingContext2D, W: number, H: number, R: RandFn, cols: [string, string]) {
  const gr = g.createLinearGradient(0, 0, W * 0.3, H)
  gr.addColorStop(0, cols[0])
  gr.addColorStop(1, cols[1])
  g.fillStyle = gr
  g.fillRect(0, 0, W, H)
  for (let i = 0; i < 70; i++) {
    const x = R() * W
    const y = R() * H
    const r = 40 + R() * 160
    const rg = g.createRadialGradient(x, y, 0, x, y, r)
    rg.addColorStop(0, R() > 0.5 ? 'rgba(255,250,235,.10)' : 'rgba(40,30,15,.10)')
    rg.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = rg
    g.beginPath()
    g.arc(x, y, r, 0, TAU)
    g.fill()
  }
  for (let i = 0; i < 9000; i++) {
    g.fillStyle = R() > 0.5 ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.06)'
    g.fillRect(R() * W, R() * H, 1.5, 1.5)
  }
}

export function paintSurface(
  b: Biome,
  R: RandFn,
  ns: number,
  W: number,
  H: number,
): { c: HTMLCanvasElement; waterY: Float32Array | null } {
  const c = mkCanvas(W, H)
  const g = c.getContext('2d')!
  paintTerrainBase(g, W, H, R, b.cols)
  let waterY: Float32Array | null = null
  if (b.water) {
    waterY = new Float32Array(W)
    for (let x = 0; x < W; x++) waterY[x] = H * 0.06 + H * 0.09 * fbm(x * 0.003, 0, ns + 55, 3)
    g.fillStyle = 'rgba(120,90,50,.25)'
    g.beginPath()
    g.moveTo(0, 0)
    for (let x = 0; x < W; x += 8) g.lineTo(x, waterY[x] + 34 + 10 * fbm(x * 0.01, 3, ns + 9, 2))
    g.lineTo(W, 0)
    g.closePath()
    g.fill()
    const wg = g.createLinearGradient(0, 0, 0, H * 0.16)
    wg.addColorStop(0, '#1e7a96')
    wg.addColorStop(1, '#5ec8d8')
    g.fillStyle = wg
    g.beginPath()
    g.moveTo(0, 0)
    for (let x = 0; x < W; x += 8) g.lineTo(x, waterY[x])
    g.lineTo(W, 0)
    g.closePath()
    g.fill()
    g.strokeStyle = 'rgba(255,255,255,.75)'
    g.lineWidth = 3
    g.beginPath()
    for (let x = 0; x < W; x += 6) g.lineTo(x, waterY[x] + 1.5 * Math.sin(x * 0.1))
    g.stroke()
    g.strokeStyle = 'rgba(255,255,255,.3)'
    g.lineWidth = 6
    g.beginPath()
    for (let x = 0; x < W; x += 6) g.lineTo(x, waterY[x] + 6 + 3 * Math.sin(x * 0.07 + 2))
    g.stroke()
  }
  for (let di = 0; di < b.decor.length; di++) {
    const fn = b.decor[di][0]
    const n = b.decor[di][1]
    for (let i = 0; i < n; i++) {
      const x = R() * W
      const y = R() * H
      if (waterY && y < waterY[x | 0] + 30) continue
      DECOR[fn](g, x, y, R)
    }
  }
  const vg = g.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.9)
  vg.addColorStop(0, 'rgba(0,0,0,0)')
  vg.addColorStop(1, 'rgba(0,0,0,.3)')
  g.fillStyle = vg
  g.fillRect(0, 0, W, H)
  return { c, waterY }
}

export function thAt(x: number, y: number, ts: number): [number, number, number] {
  return [
    0.14 + 0.1 * vnoise(x * 0.008, y * 0.008, ts + 3),
    0.4 + 0.12 * vnoise(x * 0.006, y * 0.006, ts + 7),
    0.68 + 0.1 * vnoise(x * 0.007, y * 0.007, ts + 11),
  ]
}

export function layerIndexAt(x: number, y: number, D: number, ts: number): number {
  const t = thAt(x, y, ts)
  return D < t[0] ? 0 : D < t[1] ? 1 : D < t[2] ? 2 : 3
}

export function paintDig(
  dctx: CanvasRenderingContext2D,
  wx: number,
  wy: number,
  r: number,
  digId: number,
  li: number,
  D: number,
  ts: number,
  layers: TerrainLayer[],
) {
  const base = layers[Math.min(3, li)]
  const g1 = fbm(wx * 0.05, wy * 0.05, ts + li * 31, 2)
  const sh = clamp(1 - D * 0.38, 0.45, 1.1)
  const cr = clamp((base.c[0] + (g1 - 0.5) * base.v) * sh, 0, 255) | 0
  const cg = clamp((base.c[1] + (g1 - 0.5) * base.v) * sh, 0, 255) | 0
  const cb = clamp((base.c[2] + (g1 - 0.5) * base.v) * sh, 0, 255) | 0
  dctx.beginPath()
  for (let a = 0, first = true; a < TAU + 0.001; a += TAU / 28) {
    const rr = r * (0.78 + 0.5 * vnoise(Math.cos(a) * 1.5 + digId * 0.37, Math.sin(a) * 1.5, ts + 99))
    const x = wx + Math.cos(a) * rr
    const y = wy + Math.sin(a) * rr
    if (first) {
      dctx.moveTo(x, y)
      first = false
    } else dctx.lineTo(x, y)
  }
  dctx.closePath()
  dctx.fillStyle = 'rgb(' + cr + ',' + cg + ',' + cb + ')'
  dctx.fill()
  const rg = dctx.createRadialGradient(wx, wy, r * 0.12, wx, wy, r * 1.15)
  rg.addColorStop(0, 'rgba(0,0,0,.24)')
  rg.addColorStop(0.7, 'rgba(0,0,0,.06)')
  rg.addColorStop(1, 'rgba(0,0,0,0)')
  dctx.fillStyle = rg
  dctx.fill()
}
