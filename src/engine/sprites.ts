// Procedural item art — ported verbatim from legacy/strata-original.html's
// `DRAW{}` registry. Kept procedural for now (see src/assets/README.md):
// the real-sprite-pack swap is scoped as a follow-up so this port stays a
// faithful, verifiable translation of the original renderer.
import { TAU, hash2 } from './noise'
import type { DrawId, DrawOpts } from './types'

function shade(g: CanvasRenderingContext2D, w: number, h: number) {
  const gr = g.createLinearGradient(0, 0, w, h)
  gr.addColorStop(0, 'rgba(255,255,255,.22)')
  gr.addColorStop(0.55, 'rgba(0,0,0,0)')
  gr.addColorStop(1, 'rgba(0,0,0,.28)')
  g.globalCompositeOperation = 'source-atop'
  g.fillStyle = gr
  g.fillRect(0, 0, w, h)
  g.globalCompositeOperation = 'source-over'
}

type DrawFn = (g: CanvasRenderingContext2D, w: number, h: number, o?: DrawOpts | null) => void

export const DRAW: Record<DrawId, DrawFn> = {
  ammonite(g, w, h) {
    const cx = w * 0.5
    const cy = h * 0.5
    const R0 = w * 0.42
    g.lineCap = 'round'
    for (let pass = 0; pass < 2; pass++) {
      g.beginPath()
      for (let t = 0; t <= 6.9; t += 0.08) {
        const r = R0 * Math.pow(0.72, t * 0.55)
        const x = cx + Math.cos(t * 1.9) * r
        const y = cy + Math.sin(t * 1.9) * r
        if (t) g.lineTo(x, y)
        else g.moveTo(x, y)
      }
      g.strokeStyle = pass ? '#c4b087' : '#6e5c40'
      g.lineWidth = pass ? w * 0.09 : w * 0.14
      g.stroke()
    }
    g.strokeStyle = 'rgba(70,55,35,.55)'
    g.lineWidth = 1.2
    for (let t = 0.3; t < 6.5; t += 0.4) {
      const r = R0 * Math.pow(0.72, t * 0.55)
      const a = t * 1.9
      g.beginPath()
      g.moveTo(cx + Math.cos(a) * r * 0.7, cy + Math.sin(a) * r * 0.7)
      g.lineTo(cx + Math.cos(a) * r * 1.15, cy + Math.sin(a) * r * 1.15)
      g.stroke()
    }
  },
  trilobite(g, w, h) {
    const cx = w / 2
    g.fillStyle = '#6b5d48'
    g.beginPath()
    g.ellipse(cx, h * 0.52, w * 0.32, h * 0.42, 0, 0, TAU)
    g.fill()
    g.fillStyle = '#7d6e55'
    g.beginPath()
    g.ellipse(cx, h * 0.22, w * 0.3, h * 0.15, 0, 0, TAU)
    g.fill()
    g.strokeStyle = 'rgba(35,28,18,.6)'
    g.lineWidth = 1.6
    for (let i = 0; i < 8; i++) {
      const y = h * 0.32 + i * h * 0.075
      g.beginPath()
      g.moveTo(cx - w * 0.29 + i * 1.2, y)
      g.quadraticCurveTo(cx, y + 4, cx + w * 0.29 - i * 1.2, y)
      g.stroke()
    }
    g.beginPath()
    g.moveTo(cx - w * 0.09, h * 0.3)
    g.lineTo(cx - w * 0.09, h * 0.88)
    g.moveTo(cx + w * 0.09, h * 0.3)
    g.lineTo(cx + w * 0.09, h * 0.88)
    g.stroke()
    g.fillStyle = '#2e2519'
    g.beginPath()
    g.arc(cx - w * 0.14, h * 0.2, 2.2, 0, TAU)
    g.arc(cx + w * 0.14, h * 0.2, 2.2, 0, TAU)
    g.fill()
    shade(g, w, h)
  },
  tooth(g, w, h, o) {
    const c = o && o.c ? o.c : ['#e8e0cc', '#8a7a5c']
    g.beginPath()
    g.moveTo(w * 0.15, h * 0.22)
    g.quadraticCurveTo(w * 0.5, h * 0.02, w * 0.85, h * 0.22)
    g.quadraticCurveTo(w * 0.72, h * 0.5, w * 0.52, h * 0.95)
    g.quadraticCurveTo(w * 0.42, h * 0.6, w * 0.15, h * 0.22)
    g.closePath()
    const gr = g.createLinearGradient(0, 0, 0, h)
    gr.addColorStop(0, c[1])
    gr.addColorStop(0.28, c[1])
    gr.addColorStop(0.38, c[0])
    gr.addColorStop(1, c[0])
    g.fillStyle = gr
    g.fill()
    g.strokeStyle = 'rgba(40,30,20,.5)'
    g.lineWidth = 1.4
    g.stroke()
    shade(g, w, h)
  },
  claw(g, w, h) {
    g.beginPath()
    g.moveTo(w * 0.18, h * 0.85)
    g.quadraticCurveTo(w * 0.05, h * 0.35, w * 0.45, h * 0.08)
    g.quadraticCurveTo(w * 0.42, h * 0.45, w * 0.52, h * 0.82)
    g.closePath()
    const gr = g.createLinearGradient(0, 0, w, 0)
    gr.addColorStop(0, '#d8ccb0')
    gr.addColorStop(1, '#9a8a68')
    g.fillStyle = gr
    g.fill()
    g.strokeStyle = 'rgba(50,40,25,.5)'
    g.lineWidth = 1.4
    g.stroke()
    shade(g, w, h)
  },
  vertebra(g, w, h) {
    const cx = w / 2
    const cy = h / 2
    g.fillStyle = '#c5b898'
    const arms: [number, number][] = [
      [-0.55, 0.34],
      [0.55, 0.34],
      [Math.PI - 0.55, 0.34],
      [Math.PI + 0.55, 0.34],
      [-Math.PI / 2, 0.42],
    ]
    for (let i = 0; i < arms.length; i++) {
      g.save()
      g.translate(cx, cy)
      g.rotate(arms[i][0])
      g.fillRect(-w * 0.055, -h * arms[i][1] - h * 0.08, w * 0.11, h * arms[i][1] + h * 0.08)
      g.restore()
    }
    g.fillStyle = '#d5c9ac'
    g.beginPath()
    g.ellipse(cx, cy, w * 0.26, h * 0.2, 0, 0, TAU)
    g.fill()
    g.strokeStyle = 'rgba(60,50,32,.5)'
    g.lineWidth = 1.3
    g.beginPath()
    g.ellipse(cx, cy, w * 0.26, h * 0.2, 0, 0, TAU)
    g.stroke()
    shade(g, w, h)
  },
  fish(g, w, h) {
    g.strokeStyle = '#8f8266'
    g.lineCap = 'round'
    g.lineWidth = 2.6
    g.beginPath()
    g.moveTo(w * 0.14, h * 0.5)
    g.lineTo(w * 0.8, h * 0.5)
    g.stroke()
    g.lineWidth = 1.4
    for (let i = 0; i < 10; i++) {
      const x = w * 0.2 + i * w * 0.055
      const l = h * 0.28 * (1 - i / 13)
      g.beginPath()
      g.moveTo(x, h * 0.5 - l)
      g.lineTo(x, h * 0.5 + l)
      g.stroke()
    }
    g.lineWidth = 2
    g.beginPath()
    g.arc(w * 0.13, h * 0.5, w * 0.06, 0, TAU)
    g.stroke()
    g.beginPath()
    g.moveTo(w * 0.8, h * 0.5)
    g.lineTo(w * 0.93, h * 0.34)
    g.moveTo(w * 0.8, h * 0.5)
    g.lineTo(w * 0.93, h * 0.66)
    g.stroke()
  },
  amber(g, w, h) {
    const cx = w / 2
    const cy = h / 2
    g.beginPath()
    for (let a = 0; a < TAU; a += 0.4) {
      const r = w * 0.38 * (0.85 + 0.3 * hash2(Math.round(a * 10), 3, 4))
      g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
    }
    g.closePath()
    const gr = g.createRadialGradient(cx - 6, cy - 6, 2, cx, cy, w * 0.45)
    gr.addColorStop(0, '#f5c860')
    gr.addColorStop(1, '#b06818')
    g.fillStyle = gr
    g.fill()
    g.fillStyle = 'rgba(40,20,5,.7)'
    g.beginPath()
    g.ellipse(cx + 2, cy + 2, 3, 2, 0.5, 0, TAU)
    g.fill()
    g.strokeStyle = 'rgba(40,20,5,.5)'
    g.lineWidth = 0.8
    const legs: [number, number][] = [
      [-3, -2],
      [3, -2],
      [-3, 2],
      [3, 2],
      [0, -3],
      [0, 3],
    ]
    for (let i = 0; i < legs.length; i++) {
      g.beginPath()
      g.moveTo(cx + 2, cy + 2)
      g.lineTo(cx + 2 + legs[i][0] * 2, cy + 2 + legs[i][1] * 2)
      g.stroke()
    }
    shade(g, w, h)
  },
  tusk(g, w, h) {
    g.lineCap = 'round'
    g.strokeStyle = '#a89468'
    g.lineWidth = w * 0.14
    g.beginPath()
    g.moveTo(w * 0.12, h * 0.85)
    g.quadraticCurveTo(w * 0.25, h * 0.12, w * 0.88, h * 0.22)
    g.stroke()
    g.strokeStyle = '#e5dcc2'
    g.lineWidth = w * 0.1
    g.beginPath()
    g.moveTo(w * 0.13, h * 0.83)
    g.quadraticCurveTo(w * 0.26, h * 0.13, w * 0.86, h * 0.22)
    g.stroke()
  },
  gem(g, w, h, o) {
    const c = o && o.c ? o.c : ['#c9a7f0', '#8a4fd0']
    const cx = w / 2
    const cy = h / 2
    const r = w * 0.42
    g.beginPath()
    for (let i = 0; i < 6; i++) {
      const a = -Math.PI / 2 + (i * TAU) / 6
      if (i) g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
      else g.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
    }
    g.closePath()
    const gr = g.createLinearGradient(0, 0, w, h)
    gr.addColorStop(0, c[0])
    gr.addColorStop(1, c[1])
    g.fillStyle = gr
    g.fill()
    g.strokeStyle = 'rgba(255,255,255,.5)'
    g.lineWidth = 1.3
    for (let i = 0; i < 6; i++) {
      const a = -Math.PI / 2 + (i * TAU) / 6
      g.beginPath()
      g.moveTo(cx, cy)
      g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
      g.stroke()
    }
    g.beginPath()
    for (let i = 0; i < 6; i++) {
      const a = -Math.PI / 2 + (i * TAU) / 6
      if (i) g.lineTo(cx + Math.cos(a) * r * 0.45, cy + Math.sin(a) * r * 0.45)
      else g.moveTo(cx + Math.cos(a) * r * 0.45, cy + Math.sin(a) * r * 0.45)
    }
    g.closePath()
    g.fillStyle = 'rgba(255,255,255,.28)'
    g.fill()
    shade(g, w, h)
  },
  crystals(g, w, h, o) {
    const c = o && o.c ? o.c : ['#d8c8ff', '#7a5bd0']
    const n = Math.max(6, Math.round(w / 34))
    for (let i = 0; i < n; i++) {
      const x = w * 0.15 + (i / (n - 1)) * w * 0.7 + (i % 2 ? w * 0.02 : -w * 0.015)
      const y = h * 0.68
      const len = h * (0.28 + 0.34 * hash2(i, 1, 13))
      const wd = Math.max(4, w * 0.05)
      const a = -Math.PI / 2 + (i - n / 2) * 0.14
      g.save()
      g.translate(x, y)
      g.rotate(a)
      g.beginPath()
      g.moveTo(-wd, 0)
      g.lineTo(-wd * 0.6, -len)
      g.lineTo(0, -len - wd)
      g.lineTo(wd * 0.6, -len)
      g.lineTo(wd, 0)
      g.closePath()
      const gr = g.createLinearGradient(-wd, 0, wd, 0)
      gr.addColorStop(0, c[1])
      gr.addColorStop(0.5, c[0])
      gr.addColorStop(1, c[1])
      g.fillStyle = gr
      g.fill()
      g.strokeStyle = 'rgba(255,255,255,.35)'
      g.lineWidth = 1
      g.stroke()
      g.restore()
    }
    shade(g, w, h)
  },
  nugget(g, w, h, o) {
    const c = o && o.c ? o.c : ['#f0d060', '#a07820']
    for (let i = 0; i < 5; i++) {
      const x = w * (0.3 + hash2(i, 1, 7) * 0.4)
      const y = h * (0.3 + hash2(i, 2, 7) * 0.4)
      const r = w * (0.13 + hash2(i, 3, 7) * 0.12)
      g.beginPath()
      for (let a = 0; a < TAU; a += 0.5) {
        const rr = r * (0.8 + 0.4 * hash2(i, Math.round(a * 10), 9))
        g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr)
      }
      g.closePath()
      const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r * 1.2)
      gr.addColorStop(0, c[0])
      gr.addColorStop(1, c[1])
      g.fillStyle = gr
      g.fill()
    }
    shade(g, w, h)
  },
  obsidian(g, w, h) {
    g.beginPath()
    g.moveTo(w * 0.2, h * 0.8)
    g.lineTo(w * 0.38, h * 0.12)
    g.lineTo(w * 0.62, h * 0.3)
    g.lineTo(w * 0.82, h * 0.75)
    g.closePath()
    const gr = g.createLinearGradient(0, 0, w, h)
    gr.addColorStop(0, '#3a3a44')
    gr.addColorStop(0.5, '#14141c')
    gr.addColorStop(1, '#2a2a36')
    g.fillStyle = gr
    g.fill()
    g.strokeStyle = 'rgba(160,170,200,.5)'
    g.lineWidth = 1.2
    g.stroke()
    g.strokeStyle = 'rgba(200,210,255,.35)'
    g.beginPath()
    g.moveTo(w * 0.38, h * 0.12)
    g.lineTo(w * 0.5, h * 0.78)
    g.stroke()
    shade(g, w, h)
  },
  meteor(g, w, h) {
    const cx = w / 2
    const cy = h / 2
    g.beginPath()
    for (let a = 0; a < TAU; a += 0.35) {
      const r = w * 0.4 * (0.82 + 0.32 * hash2(Math.round(a * 9), 5, 11))
      g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
    }
    g.closePath()
    const gr = g.createRadialGradient(cx - w * 0.12, cy - w * 0.12, w * 0.05, cx, cy, w * 0.45)
    gr.addColorStop(0, '#6a6470')
    gr.addColorStop(1, '#26222c')
    g.fillStyle = gr
    g.fill()
    for (let i = 0; i < 7; i++) {
      const x = cx + (hash2(i, 1, 3) - 0.5) * w * 0.5
      const y = cy + (hash2(i, 2, 3) - 0.5) * h * 0.5
      const r = w * (0.04 + hash2(i, 3, 3) * 0.05)
      g.fillStyle = 'rgba(0,0,0,.45)'
      g.beginPath()
      g.arc(x, y, r, 0, TAU)
      g.fill()
      g.fillStyle = 'rgba(180,175,190,.25)'
      g.beginPath()
      g.arc(x - r * 0.3, y - r * 0.3, r * 0.5, 0, TAU)
      g.fill()
    }
    shade(g, w, h)
  },
  coin(g, w, h, o) {
    const c = o && o.c ? o.c : ['#f0cf6a', '#9a7a28']
    const cx = w / 2
    const cy = h / 2
    const r = w * 0.44
    const gr = g.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r)
    gr.addColorStop(0, c[0])
    gr.addColorStop(1, c[1])
    g.fillStyle = gr
    g.beginPath()
    g.arc(cx, cy, r, 0, TAU)
    g.fill()
    g.strokeStyle = 'rgba(60,45,10,.55)'
    g.lineWidth = 1.5
    g.beginPath()
    g.arc(cx, cy, r * 0.75, 0, TAU)
    g.stroke()
    g.font = 'bold ' + Math.round(r * 0.9) + 'px serif'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillStyle = 'rgba(70,52,12,.6)'
    g.fillText('Ω', cx, cy + 1)
    shade(g, w, h)
  },
  shard(g, w, h) {
    g.beginPath()
    g.moveTo(w * 0.15, h * 0.3)
    g.lineTo(w * 0.55, h * 0.08)
    g.lineTo(w * 0.9, h * 0.4)
    g.lineTo(w * 0.7, h * 0.9)
    g.lineTo(w * 0.25, h * 0.75)
    g.closePath()
    const gr = g.createLinearGradient(0, 0, w, h)
    gr.addColorStop(0, '#b5773f')
    gr.addColorStop(1, '#7a4a24')
    g.fillStyle = gr
    g.fill()
    g.strokeStyle = 'rgba(50,28,12,.6)'
    g.lineWidth = 1.5
    g.stroke()
    g.strokeStyle = 'rgba(40,22,10,.5)'
    g.beginPath()
    g.moveTo(w * 0.25, h * 0.42)
    g.quadraticCurveTo(w * 0.5, h * 0.32, w * 0.8, h * 0.45)
    g.stroke()
    shade(g, w, h)
  },
  amphora(g, w, h) {
    const cx = w / 2
    g.beginPath()
    g.moveTo(cx - w * 0.12, h * 0.08)
    g.lineTo(cx + w * 0.12, h * 0.08)
    g.lineTo(cx + w * 0.09, h * 0.18)
    g.bezierCurveTo(cx + w * 0.4, h * 0.28, cx + w * 0.34, h * 0.7, cx + w * 0.08, h * 0.94)
    g.lineTo(cx - w * 0.08, h * 0.94)
    g.bezierCurveTo(cx - w * 0.34, h * 0.7, cx - w * 0.4, h * 0.28, cx - w * 0.09, h * 0.18)
    g.closePath()
    const gr = g.createLinearGradient(0, 0, w, 0)
    gr.addColorStop(0, '#8a5426')
    gr.addColorStop(0.5, '#c58748')
    gr.addColorStop(1, '#7a4820')
    g.fillStyle = gr
    g.fill()
    g.strokeStyle = 'rgba(45,25,10,.6)'
    g.lineWidth = 1.5
    g.stroke()
    g.strokeStyle = 'rgba(50,28,12,.5)'
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(cx - w * 0.28, h * 0.4)
    g.quadraticCurveTo(cx, h * 0.47, cx + w * 0.28, h * 0.4)
    g.stroke()
    g.lineWidth = 4
    g.beginPath()
    g.arc(cx - w * 0.24, h * 0.24, w * 0.1, Math.PI * 0.6, Math.PI * 1.5)
    g.stroke()
    g.beginPath()
    g.arc(cx + w * 0.24, h * 0.24, w * 0.1, Math.PI * 1.5, Math.PI * 0.4)
    g.stroke()
    shade(g, w, h)
  },
  ring(g, w, h) {
    const cx = w / 2
    const cy = h * 0.58
    const r = w * 0.28
    g.strokeStyle = 'rgba(120,85,20,.6)'
    g.lineWidth = w * 0.16
    g.beginPath()
    g.arc(cx, cy, r, 0, TAU)
    g.stroke()
    g.strokeStyle = '#e8c860'
    g.lineWidth = w * 0.11
    g.beginPath()
    g.arc(cx, cy, r, 0, TAU)
    g.stroke()
    g.fillStyle = '#e05070'
    g.beginPath()
    g.moveTo(cx, cy - r - w * 0.18)
    g.lineTo(cx + w * 0.1, cy - r - w * 0.02)
    g.lineTo(cx, cy - r + w * 0.1)
    g.lineTo(cx - w * 0.1, cy - r - w * 0.02)
    g.closePath()
    g.fill()
    shade(g, w, h)
  },
  amulet(g, w, h) {
    const cx = w / 2
    g.strokeStyle = '#c8b060'
    g.lineWidth = 3
    g.beginPath()
    g.arc(cx, h * 0.3, w * 0.22, Math.PI * 0.1, Math.PI * 0.9, true)
    g.stroke()
    g.fillStyle = '#3aa8a0'
    g.beginPath()
    g.ellipse(cx, h * 0.62, w * 0.26, h * 0.3, 0, 0, TAU)
    g.fill()
    g.strokeStyle = '#8a7430'
    g.lineWidth = 2.5
    g.stroke()
    g.fillStyle = 'rgba(255,255,255,.3)'
    g.beginPath()
    g.ellipse(cx - w * 0.08, h * 0.52, w * 0.08, h * 0.12, -0.5, 0, TAU)
    g.fill()
    shade(g, w, h)
  },
  mask(g, w, h) {
    const cx = w / 2
    g.beginPath()
    g.ellipse(cx, h * 0.5, w * 0.36, h * 0.46, 0, 0, TAU)
    const gr = g.createLinearGradient(0, 0, w, h)
    gr.addColorStop(0, '#c8a44a')
    gr.addColorStop(1, '#8a6a20')
    g.fillStyle = gr
    g.fill()
    g.strokeStyle = 'rgba(60,40,10,.7)'
    g.lineWidth = 2
    g.stroke()
    g.fillStyle = '#241a08'
    g.beginPath()
    g.ellipse(cx - w * 0.14, h * 0.4, w * 0.08, h * 0.06, 0, 0, TAU)
    g.ellipse(cx + w * 0.14, h * 0.4, w * 0.08, h * 0.06, 0, 0, TAU)
    g.fill()
    g.beginPath()
    g.ellipse(cx, h * 0.68, w * 0.1, h * 0.05, 0, 0, TAU)
    g.fill()
    g.strokeStyle = 'rgba(60,40,10,.5)'
    g.beginPath()
    g.moveTo(cx, h * 0.44)
    g.lineTo(cx, h * 0.58)
    g.stroke()
    shade(g, w, h)
  },
  axe(g, w, h) {
    g.save()
    g.translate(w / 2, h / 2)
    g.rotate(0.5)
    g.beginPath()
    g.moveTo(-w * 0.32, -h * 0.1)
    g.quadraticCurveTo(0, -h * 0.34, w * 0.34, -h * 0.08)
    g.quadraticCurveTo(w * 0.2, h * 0.12, -w * 0.05, h * 0.2)
    g.quadraticCurveTo(-w * 0.28, h * 0.1, -w * 0.32, -h * 0.1)
    g.closePath()
    const gr = g.createLinearGradient(-w / 2, 0, w / 2, 0)
    gr.addColorStop(0, '#8a8578')
    gr.addColorStop(1, '#5c584e')
    g.fillStyle = gr
    g.fill()
    g.strokeStyle = 'rgba(35,32,26,.6)'
    g.lineWidth = 1.5
    g.stroke()
    g.restore()
    shade(g, w, h)
  },
  idol(g, w, h) {
    const cx = w / 2
    const gr = g.createLinearGradient(0, 0, 0, h)
    gr.addColorStop(0, '#f5d878')
    gr.addColorStop(1, '#a87c20')
    g.fillStyle = gr
    g.beginPath()
    g.ellipse(cx, h * 0.24, w * 0.2, h * 0.18, 0, 0, TAU)
    g.fill()
    g.beginPath()
    g.moveTo(cx - w * 0.24, h * 0.4)
    g.lineTo(cx + w * 0.24, h * 0.4)
    g.lineTo(cx + w * 0.18, h * 0.92)
    g.lineTo(cx - w * 0.18, h * 0.92)
    g.closePath()
    g.fill()
    g.fillStyle = 'rgba(90,60,10,.8)'
    g.beginPath()
    g.ellipse(cx - w * 0.07, h * 0.22, w * 0.045, h * 0.03, 0, 0, TAU)
    g.ellipse(cx + w * 0.07, h * 0.22, w * 0.045, h * 0.03, 0, 0, TAU)
    g.fill()
    g.strokeStyle = 'rgba(90,60,10,.6)'
    g.lineWidth = 1.5
    g.beginPath()
    g.moveTo(cx - w * 0.14, h * 0.55)
    g.lineTo(cx + w * 0.14, h * 0.55)
    g.moveTo(cx - w * 0.12, h * 0.68)
    g.lineTo(cx + w * 0.12, h * 0.68)
    g.stroke()
    shade(g, w, h)
  },
  pearl(g, w, h) {
    const cx = w / 2
    const cy = h / 2
    const r = w * 0.4
    const gr = g.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.1, cx, cy, r)
    gr.addColorStop(0, '#ffffff')
    gr.addColorStop(0.6, '#e8dfe0')
    gr.addColorStop(1, '#b0a0a8')
    g.fillStyle = gr
    g.beginPath()
    g.arc(cx, cy, r, 0, TAU)
    g.fill()
  },
  geode(g, w, h) {
    const cx = w / 2
    const cy = h / 2
    const r = w * 0.42
    g.fillStyle = '#5a5248'
    g.beginPath()
    g.arc(cx, cy, r, 0, TAU)
    g.fill()
    g.fillStyle = '#7a6cc8'
    g.beginPath()
    g.arc(cx, cy, r * 0.72, 0, TAU)
    g.fill()
    g.fillStyle = '#c8bcf5'
    g.beginPath()
    g.arc(cx, cy, r * 0.45, 0, TAU)
    g.fill()
    g.strokeStyle = 'rgba(255,255,255,.4)'
    g.lineWidth = 1.5
    for (let a = 0; a < TAU; a += 0.35) {
      g.beginPath()
      g.moveTo(cx + Math.cos(a) * r * 0.45, cy + Math.sin(a) * r * 0.45)
      g.lineTo(cx + Math.cos(a + 0.15) * r * 0.7, cy + Math.sin(a + 0.15) * r * 0.7)
      g.stroke()
    }
    shade(g, w, h)
  },
  chest(g, w, h) {
    g.save()
    g.translate(w / 2, h / 2)
    g.rotate(0.15)
    g.translate(-w / 2, -h / 2)
    const gr = g.createLinearGradient(0, h * 0.2, 0, h * 0.85)
    gr.addColorStop(0, '#8a5a2c')
    gr.addColorStop(1, '#5a3818')
    g.fillStyle = gr
    g.fillRect(w * 0.14, h * 0.22, w * 0.72, h * 0.56)
    g.fillStyle = 'rgba(0,0,0,.2)'
    g.fillRect(w * 0.14, h * 0.46, w * 0.72, h * 0.04)
    g.fillStyle = '#c8a23c'
    g.fillRect(w * 0.14, h * 0.22, w * 0.06, h * 0.56)
    g.fillRect(w * 0.8, h * 0.22, w * 0.06, h * 0.56)
    g.fillRect(w * 0.44, h * 0.22, w * 0.12, h * 0.56)
    g.fillStyle = '#e8c860'
    g.beginPath()
    g.arc(w * 0.5, h * 0.5, w * 0.06, 0, TAU)
    g.fill()
    g.fillStyle = '#443014'
    g.fillRect(w * 0.485, h * 0.5, w * 0.03, h * 0.08)
    g.strokeStyle = 'rgba(30,18,6,.6)'
    g.lineWidth = 2
    g.strokeRect(w * 0.14, h * 0.22, w * 0.72, h * 0.56)
    g.restore()
    shade(g, w, h)
  },
  ship(g, w, h) {
    g.save()
    g.translate(w / 2, h / 2)
    g.rotate(-0.3)
    g.translate(-w / 2, -h / 2)
    g.lineCap = 'round'
    g.strokeStyle = '#5a3d22'
    g.lineWidth = w * 0.02
    g.beginPath()
    g.moveTo(w * 0.1, h * 0.5)
    g.quadraticCurveTo(w * 0.5, h * 0.62, w * 0.9, h * 0.42)
    g.stroke()
    for (let i = 0; i < 8; i++) {
      const t = 0.15 + i * 0.1
      const x = w * t
      const l = h * 0.28 * Math.sin(Math.PI * ((i + 1) / 9))
      g.lineWidth = w * 0.012
      g.beginPath()
      g.moveTo(x, h * 0.52)
      g.quadraticCurveTo(x - w * 0.02, h * 0.52 - l * 0.6, x + w * 0.01, h * 0.52 - l)
      g.stroke()
      g.beginPath()
      g.moveTo(x, h * 0.52)
      g.quadraticCurveTo(x + w * 0.02, h * 0.52 + l * 0.5, x - w * 0.01, h * 0.52 + l * 0.8)
      g.stroke()
    }
    g.strokeStyle = '#6e4a2a'
    g.lineWidth = w * 0.015
    g.beginPath()
    g.moveTo(w * 0.15, h * 0.34)
    g.quadraticCurveTo(w * 0.5, h * 0.28, w * 0.82, h * 0.3)
    g.stroke()
    g.beginPath()
    g.moveTo(w * 0.12, h * 0.64)
    g.quadraticCurveTo(w * 0.5, h * 0.76, w * 0.85, h * 0.58)
    g.stroke()
    g.restore()
  },
  statue(g, w, h) {
    const cx = w / 2
    const gr = g.createLinearGradient(0, 0, w, 0)
    gr.addColorStop(0, '#9a927e')
    gr.addColorStop(0.5, '#b8ae96')
    gr.addColorStop(1, '#7c7462')
    g.fillStyle = gr
    g.beginPath()
    g.moveTo(cx - w * 0.22, h * 0.9)
    g.lineTo(cx - w * 0.26, h * 0.3)
    g.quadraticCurveTo(cx - w * 0.24, h * 0.06, cx, h * 0.05)
    g.quadraticCurveTo(cx + w * 0.24, h * 0.06, cx + w * 0.26, h * 0.3)
    g.lineTo(cx + w * 0.22, h * 0.9)
    g.closePath()
    g.fill()
    g.strokeStyle = 'rgba(40,36,28,.55)'
    g.lineWidth = 2
    g.stroke()
    g.strokeStyle = 'rgba(45,40,32,.7)'
    g.lineWidth = 3
    g.beginPath()
    g.moveTo(cx - w * 0.16, h * 0.32)
    g.lineTo(cx - w * 0.04, h * 0.32)
    g.moveTo(cx + w * 0.04, h * 0.32)
    g.lineTo(cx + w * 0.16, h * 0.32)
    g.stroke()
    g.beginPath()
    g.moveTo(cx, h * 0.34)
    g.lineTo(cx - w * 0.03, h * 0.52)
    g.lineTo(cx + w * 0.03, h * 0.54)
    g.stroke()
    g.beginPath()
    g.moveTo(cx - w * 0.08, h * 0.66)
    g.lineTo(cx + w * 0.08, h * 0.66)
    g.stroke()
    g.lineWidth = 1.4
    g.beginPath()
    g.moveTo(cx + w * 0.12, h * 0.12)
    g.lineTo(cx + w * 0.08, h * 0.24)
    g.lineTo(cx + w * 0.14, h * 0.3)
    g.stroke()
    shade(g, w, h)
  },
  temple(g, w, h) {
    const cx = w / 2
    const cy = h / 2
    for (let a = 0; a < TAU; a += 0.5) {
      if (hash2(Math.round(a * 10), 1, 6) < 0.2) continue
      const r = w * 0.34
      const x = cx + Math.cos(a) * r
      const y = cy + Math.sin(a) * r * 0.78
      g.save()
      g.translate(x, y)
      g.rotate(a + (hash2(Math.round(a * 10), 2, 6) - 0.5) * 0.4)
      const bw = w * 0.13
      const bh = w * 0.07
      const gr = g.createLinearGradient(-bw / 2, 0, bw / 2, 0)
      gr.addColorStop(0, '#a89e88')
      gr.addColorStop(1, '#78705e')
      g.fillStyle = gr
      g.fillRect(-bw / 2, -bh / 2, bw, bh)
      g.strokeStyle = 'rgba(35,32,26,.5)'
      g.lineWidth = 1.5
      g.strokeRect(-bw / 2, -bh / 2, bw, bh)
      g.restore()
    }
    g.save()
    g.translate(cx, cy)
    g.rotate(0.2)
    g.fillStyle = '#948a74'
    g.fillRect(-w * 0.12, -w * 0.08, w * 0.24, w * 0.16)
    g.strokeStyle = 'rgba(35,32,26,.5)'
    g.lineWidth = 1.5
    g.strokeRect(-w * 0.12, -w * 0.08, w * 0.24, w * 0.16)
    g.restore()
    shade(g, w, h)
  },
  dino(g, w, h) {
    type Pt = { x: number; y: number }
    const q = (t: number, a: Pt, b: Pt, c: Pt): Pt => ({
      x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * b.x + t * t * c.x,
      y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * b.y + t * t * c.y,
    })
    const p0 = { x: w * 0.08, y: h * 0.7 }
    const p1 = { x: w * 0.4, y: h * 0.18 }
    const p2 = { x: w * 0.78, y: h * 0.45 }
    g.strokeStyle = '#d8cdae'
    g.lineCap = 'round'
    g.lineWidth = Math.max(4, w * 0.013)
    g.beginPath()
    for (let t = 0; t <= 1.001; t += 0.05) {
      const p = q(t, p0, p1, p2)
      if (t) g.lineTo(p.x, p.y)
      else g.moveTo(p.x, p.y)
    }
    g.stroke()
    g.beginPath()
    g.moveTo(p0.x, p0.y)
    g.quadraticCurveTo(w * 0.02, h * 0.82, w * 0.05, h * 0.95)
    g.stroke()
    g.lineWidth = Math.max(2.5, w * 0.008)
    for (let i = 0; i < 10; i++) {
      const t = 0.25 + i * 0.055
      const p = q(t, p0, p1, p2)
      const l = h * 0.3 * Math.sin(Math.PI * ((i + 1) / 12))
      g.beginPath()
      g.moveTo(p.x, p.y)
      g.quadraticCurveTo(p.x - w * 0.03, p.y + l * 0.6, p.x - w * 0.015, p.y + l)
      g.stroke()
    }
    const pe = q(1, p0, p1, p2)
    const hd = { x: w * 0.85, y: h * 0.36 }
    g.lineWidth = Math.max(4, w * 0.013)
    g.beginPath()
    g.moveTo(pe.x, pe.y)
    g.lineTo(hd.x, hd.y)
    g.stroke()
    g.fillStyle = '#e2d8bc'
    g.beginPath()
    g.ellipse(hd.x + w * 0.045, hd.y, w * 0.055, h * 0.075, -0.25, 0, TAU)
    g.fill()
    g.beginPath()
    g.moveTo(hd.x + w * 0.01, hd.y + h * 0.04)
    g.lineTo(hd.x + w * 0.1, hd.y + h * 0.078)
    g.lineTo(hd.x + w * 0.02, hd.y + h * 0.08)
    g.closePath()
    g.fill()
    g.fillStyle = '#3a3226'
    g.beginPath()
    g.arc(hd.x + w * 0.055, hd.y - h * 0.015, Math.max(2, w * 0.011), 0, TAU)
    g.fill()
    g.strokeStyle = '#cfc4a4'
    g.lineWidth = Math.max(3, w * 0.01)
    g.beginPath()
    g.moveTo(w * 0.3, h * 0.42)
    g.lineTo(w * 0.27, h * 0.72)
    g.moveTo(w * 0.6, h * 0.44)
    g.lineTo(w * 0.64, h * 0.72)
    g.stroke()
  },
  mammoth(g, w, h) {
    g.fillStyle = '#ded3b6'
    g.beginPath()
    g.ellipse(w * 0.5, h * 0.32, w * 0.3, h * 0.26, 0, 0, TAU)
    g.fill()
    g.beginPath()
    g.ellipse(w * 0.5, h * 0.52, w * 0.14, h * 0.18, 0, 0, TAU)
    g.fill()
    g.fillStyle = '#2e2a20'
    g.beginPath()
    g.ellipse(w * 0.36, h * 0.34, w * 0.06, h * 0.08, 0, 0, TAU)
    g.ellipse(w * 0.64, h * 0.34, w * 0.06, h * 0.08, 0, 0, TAU)
    g.fill()
    g.lineCap = 'round'
    g.strokeStyle = '#e8dfc5'
    g.lineWidth = w * 0.05
    g.beginPath()
    g.moveTo(w * 0.4, h * 0.6)
    g.quadraticCurveTo(w * 0.18, h * 0.85, w * 0.34, h * 0.97)
    g.stroke()
    g.beginPath()
    g.moveTo(w * 0.6, h * 0.6)
    g.quadraticCurveTo(w * 0.82, h * 0.85, w * 0.66, h * 0.97)
    g.stroke()
    g.strokeStyle = 'rgba(90,80,55,.5)'
    g.lineWidth = 1.5
    g.beginPath()
    g.ellipse(w * 0.5, h * 0.32, w * 0.3, h * 0.26, 0, 0, TAU)
    g.stroke()
    shade(g, w, h)
  },
}

/** Renders an item's sprite into an offscreen canvas the given size — used for
 * museum/inventory/summary icons. Mirrors the original inline `iconHTML()`. */
export function renderItemIcon(
  draw: DrawId,
  opts: DrawOpts | null,
  itemW: number,
  itemH: number,
  size: number,
  silhouette?: boolean,
): HTMLCanvasElement {
  const c = mkCanvasSized(size)
  const g = c.getContext('2d')!
  const sc = Math.min(size / itemW, size / itemH) * 0.9
  const w = itemW * sc
  const h = itemH * sc
  g.save()
  g.translate((size - w) / 2, (size - h) / 2)
  g.scale(sc, sc)
  DRAW[draw](g, itemW, itemH, opts)
  g.restore()
  if (silhouette) {
    g.globalCompositeOperation = 'source-in'
    g.fillStyle = '#34322c'
    g.fillRect(0, 0, size, size)
  }
  return c
}

function mkCanvasSized(s: number): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = s
  c.height = s
  return c
}
