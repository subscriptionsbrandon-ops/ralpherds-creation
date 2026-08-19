// Procedural surface decoration (shells, pebbles, crystals, ...) — ported
// verbatim from legacy/strata-original.html's `DECOR{}` registry.
import { TAU } from './noise'

export type RandFn = () => number

export const DECOR: Record<string, (g: CanvasRenderingContext2D, x: number, y: number, R: RandFn) => void> = {
  shell(g, x, y, R) {
    const s = 3 + R() * 4
    g.save()
    g.translate(x, y)
    g.rotate(R() * TAU)
    g.fillStyle = ['#f0e8d8', '#e8d0c0', '#d8c8a8'][(R() * 3) | 0]
    g.beginPath()
    g.moveTo(0, s)
    g.quadraticCurveTo(-s, -s * 0.5, 0, -s)
    g.quadraticCurveTo(s, -s * 0.5, 0, s)
    g.fill()
    g.strokeStyle = 'rgba(120,90,70,.4)'
    g.lineWidth = 0.7
    for (let i = -1; i <= 1; i++) {
      g.beginPath()
      g.moveTo(0, s)
      g.lineTo(i * s * 0.5, -s * 0.7)
      g.stroke()
    }
    g.restore()
  },
  pebble(g, x, y, R) {
    const s = 1.5 + R() * 3.5
    g.fillStyle = 'rgba(' + ((90 + R() * 80) | 0) + ',' + ((85 + R() * 70) | 0) + ',' + ((75 + R() * 60) | 0) + ',.9)'
    g.beginPath()
    g.ellipse(x, y, s, s * 0.75, R() * TAU, 0, TAU)
    g.fill()
    g.fillStyle = 'rgba(255,255,255,.25)'
    g.beginPath()
    g.ellipse(x - s * 0.25, y - s * 0.25, s * 0.4, s * 0.3, 0, 0, TAU)
    g.fill()
  },
  stick(g, x, y, R) {
    g.save()
    g.translate(x, y)
    g.rotate(R() * TAU)
    g.fillStyle = '#7a5c38'
    const l = 16 + R() * 20
    g.fillRect(-l / 2, -1.5, l, 3)
    g.fillStyle = 'rgba(0,0,0,.2)'
    g.fillRect(-l / 2, -1.5, 6, 3)
    g.restore()
  },
  seaweed(g, x, y, R) {
    g.strokeStyle = 'rgba(60,90,50,.7)'
    g.lineWidth = 1.5
    g.beginPath()
    g.moveTo(x, y)
    let px = x
    let py = y
    for (let i = 0; i < 4; i++) {
      px += (R() - 0.5) * 10
      py += 4 + R() * 5
      g.lineTo(px, py)
    }
    g.stroke()
  },
  starfish(g, x, y, R) {
    g.save()
    g.translate(x, y)
    g.rotate(R() * TAU)
    g.fillStyle = '#d88858'
    g.beginPath()
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5
      const r = i % 2 ? 3 : 7
      g.lineTo(Math.cos(a) * r, Math.sin(a) * r)
    }
    g.closePath()
    g.fill()
    g.restore()
  },
  crack(g, x, y, R) {
    g.strokeStyle = 'rgba(40,28,14,.4)'
    g.lineWidth = 1
    let px = x
    let py = y
    g.beginPath()
    g.moveTo(px, py)
    for (let i = 0; i < 6; i++) {
      px += (R() - 0.3) * 16
      py += (R() - 0.5) * 14
      g.lineTo(px, py)
    }
    g.stroke()
  },
  shrub(g, x, y, R) {
    g.strokeStyle = 'rgba(110,96,60,.8)'
    g.lineWidth = 1
    for (let i = 0; i < 7; i++) {
      const a = R() * TAU
      g.beginPath()
      g.moveTo(x, y)
      g.quadraticCurveTo(x + Math.cos(a) * 5, y + Math.sin(a) * 5 - 4, x + Math.cos(a) * 9, y + Math.sin(a) * 9 - 6)
      g.stroke()
    }
  },
  rockd(g, x, y, R) {
    const s = 4 + R() * 9
    g.save()
    g.translate(x, y)
    g.rotate(R() * TAU)
    g.beginPath()
    for (let a = 0; a < TAU; a += 0.7) {
      const r = s * (0.7 + R() * 0.5)
      g.lineTo(Math.cos(a) * r, Math.sin(a) * r)
    }
    g.closePath()
    g.fillStyle = 'rgb(' + ((95 + R() * 40) | 0) + ',' + ((90 + R() * 36) | 0) + ',' + ((82 + R() * 30) | 0) + ')'
    g.fill()
    g.fillStyle = 'rgba(255,255,255,.18)'
    g.beginPath()
    g.arc(-s * 0.25, -s * 0.3, s * 0.4, 0, TAU)
    g.fill()
    g.fillStyle = 'rgba(0,0,0,.22)'
    g.beginPath()
    g.arc(s * 0.3, s * 0.35, s * 0.45, 0, TAU)
    g.fill()
    g.restore()
  },
  moss(g, x, y, R) {
    g.fillStyle = 'rgba(80,110,55,.35)'
    for (let i = 0; i < 8; i++) {
      g.beginPath()
      g.arc(x + (R() - 0.5) * 16, y + (R() - 0.5) * 12, 2 + R() * 4, 0, TAU)
      g.fill()
    }
  },
  fissure(g, x, y, R) {
    g.lineCap = 'round'
    const seg: [number, number][] = []
    let px = x
    let py = y
    const dx = R() - 0.5
    for (let i = 0; i < 7; i++) {
      px += (R() - 0.5 + dx) * 18
      py += (R() - 0.5) * 16
      seg.push([px, py])
    }
    for (let p = 0; p < 2; p++) {
      g.strokeStyle = p ? 'rgba(255,120,30,.55)' : 'rgba(255,60,10,.18)'
      g.lineWidth = p ? 1.5 : 5
      g.beginPath()
      g.moveTo(x, y)
      for (let i = 0; i < seg.length; i++) g.lineTo(seg[i][0], seg[i][1])
      g.stroke()
    }
  },
  obshard(g, x, y, R) {
    g.save()
    g.translate(x, y)
    g.rotate(R() * TAU)
    g.fillStyle = '#1a1a22'
    g.beginPath()
    g.moveTo(-4, 3)
    g.lineTo(0, -6 - R() * 4)
    g.lineTo(4, 3)
    g.closePath()
    g.fill()
    g.strokeStyle = 'rgba(180,190,230,.4)'
    g.lineWidth = 0.8
    g.stroke()
    g.restore()
  },
  sparkle(g, x, y, R) {
    g.fillStyle = 'rgba(255,255,255,' + (0.3 + R() * 0.5) + ')'
    g.fillRect(x, y, 1.6, 1.6)
  },
  icestreak(g, x, y, R) {
    g.save()
    g.translate(x, y)
    g.rotate(-0.4 + (R() - 0.5) * 0.3)
    g.fillStyle = 'rgba(255,255,255,.16)'
    g.beginPath()
    g.ellipse(0, 0, 20 + R() * 40, 3 + R() * 4, 0, 0, TAU)
    g.fill()
    g.restore()
  },
  dune(g, x, y, R) {
    g.save()
    g.translate(x, y)
    g.rotate((R() - 0.5) * 0.6)
    g.strokeStyle = 'rgba(255,240,200,.2)'
    g.lineWidth = 3 + R() * 4
    g.lineCap = 'round'
    const l = 60 + R() * 60
    g.beginPath()
    g.moveTo(-l, 0)
    g.quadraticCurveTo(0, -14 - R() * 20, l, 0)
    g.stroke()
    g.strokeStyle = 'rgba(90,60,20,.12)'
    g.lineWidth = 3
    g.beginPath()
    g.moveTo(-l, 4)
    g.quadraticCurveTo(0, -10, l, 4)
    g.stroke()
    g.restore()
  },
  crystald(g, x, y, R) {
    g.save()
    g.translate(x, y)
    g.rotate(R() * TAU)
    g.fillStyle = 'rgba(' + ((150 + R() * 80) | 0) + ',' + ((120 + R() * 60) | 0) + ',' + ((220 + R() * 30) | 0) + ',.8)'
    g.beginPath()
    g.moveTo(-3, 4)
    g.lineTo(-1.5, -8 - R() * 6)
    g.lineTo(0, -11)
    g.lineTo(1.5, -8)
    g.lineTo(3, 4)
    g.closePath()
    g.fill()
    g.fillStyle = 'rgba(255,255,255,.4)'
    g.fillRect(-0.5, -9, 1, 10)
    g.restore()
  },
}
