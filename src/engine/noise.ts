// Math + noise utilities — ported verbatim from legacy/strata-original.html.

export const TAU = Math.PI * 2

export const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v)
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function hashStr(s: string): number {
  let h = 1779033703 ^ s.length
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return h >>> 0
}

/** mulberry32 PRNG — returns a `() => number` generator seeded by `a`. */
export function mulberry(a: number): () => number {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hash2(x: number, y: number, s: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453
  return n - Math.floor(n)
}

export function vnoise(x: number, y: number, s: number): number {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  return lerp(
    lerp(hash2(xi, yi, s), hash2(xi + 1, yi, s), u),
    lerp(hash2(xi, yi + 1, s), hash2(xi + 1, yi + 1, s), u),
    v,
  )
}

export function fbm(x: number, y: number, s: number, o = 3): number {
  let a = 0
  let amp = 0.5
  let f = 1
  for (let i = 0; i < o; i++) {
    a += amp * vnoise(x * f, y * f, s + i * 17)
    amp *= 0.5
    f *= 2
  }
  return a
}

export function mkCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}
