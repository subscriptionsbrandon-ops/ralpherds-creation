// Draw-loop building blocks — ported from legacy/strata-original.html's
// particle/glow arrays and the per-frame composition inside `frame()`. The
// requestAnimationFrame scheduling itself, plus the "still holding the
// pointer down" auto-repeat dig, live in engine/GameEngine.ts since they
// need the full engine context (energy, store callbacks); this module holds
// the reusable, self-contained drawing math.
import { TAU, clamp } from './noise'
import type { Camera } from './camera'
import type { World } from './world'
import { CATC } from '@/data/catalog'

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  s: number
  c: string
}

export interface Glow {
  x: number
  y: number
  r: number
  t: number
}

export function spawnDigParticles(parts: Particle[], wx: number, wy: number, color: [number, number, number], toolRadius: number) {
  for (let i = 0; i < 10; i++) {
    const a = Math.random() * TAU
    const v = 1 + Math.random() * 3
    parts.push({
      x: wx,
      y: wy,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      life: 0.6 + Math.random() * 0.5,
      s: 1.5 + Math.random() * 2.5,
      c: 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',.9)',
    })
  }
  parts.push({ x: wx, y: wy, vx: 0, vy: -0.25, life: 1, s: toolRadius * 0.9, c: 'rgba(215,195,155,.13)' })
  if (parts.length > 260) parts.splice(0, parts.length - 260)
}

export function spawnRecoverGlow(glows: Glow[], x: number, y: number, r: number) {
  glows.push({ x, y, r, t: 0 })
}

export interface RenderFrameParams {
  g: CanvasRenderingContext2D
  innerWidth: number
  innerHeight: number
  world: World
  cam: Camera
  shake: number
  particles: Particle[]
  glows: Glow[]
  scanUntil: number
  now: number
  mouse: { x: number; y: number } | null
  showDigCursor: boolean
  toolRadius: number
}

/** Draws one frame of the world (surface, dig craters, revealed buried
 * objects, scanner pulses, particles, glows, dig cursor). Returns the
 * decayed shake value for the caller to carry into the next frame. */
export function renderFrame(p: RenderFrameParams): number {
  const { g, innerWidth, innerHeight, world, cam, particles, glows } = p
  const shake = p.shake * 0.86
  const shx = (Math.random() - 0.5) * shake
  const shy = (Math.random() - 0.5) * shake
  g.save()
  g.translate(innerWidth / 2 + shx, innerHeight / 2 + shy)
  g.scale(cam.s, cam.s)
  g.translate(-cam.x, -cam.y)
  g.imageSmoothingEnabled = cam.s < 2
  g.drawImage(world.surface, 0, 0)
  g.drawImage(world.digCv, 0, 0)

  const oc = world.octx
  oc.clearRect(0, 0, world.W, world.H)
  let anyObj = false
  for (let k = 0; k < world.objects.length; k++) {
    const o = world.objects[k]
    if (o.recovered || o.exp <= 0.02) continue
    anyObj = true
    oc.globalAlpha = clamp((o.exp - 0.02) / Math.max(0.04, o.def.rec - 0.02), 0.12, 1)
    oc.drawImage(o.cv, o.x - o.half, o.y - o.half)
  }
  if (anyObj) {
    oc.globalAlpha = 1
    oc.globalCompositeOperation = 'destination-in'
    oc.drawImage(world.digCv, 0, 0)
    oc.globalCompositeOperation = 'source-over'
    g.drawImage(world.objCv, 0, 0)
  }

  if (p.now < p.scanUntil) {
    const pulse = 0.5 + 0.5 * Math.sin(p.now * 0.006)
    for (let k = 0; k < world.objects.length; k++) {
      const o = world.objects[k]
      if (o.recovered) continue
      const col = CATC[o.def.cat] || '#ffffff'
      const r = Math.min(170, o.half * 1.25 + 40)
      const ox = o.x + o.sox
      const oy = o.y + o.soy
      const rg = g.createRadialGradient(ox, oy, 0, ox, oy, r)
      rg.addColorStop(0, col + 'bb')
      rg.addColorStop(0.55, col + '55')
      rg.addColorStop(1, col + '00')
      g.globalAlpha = 0.45 + 0.3 * pulse
      g.fillStyle = rg
      g.beginPath()
      g.arc(ox, oy, r, 0, TAU)
      g.fill()
      g.globalAlpha = 0.35 + 0.35 * pulse
      g.strokeStyle = col
      g.lineWidth = 2 / cam.s
      g.beginPath()
      g.arc(ox, oy, r * (0.55 + 0.25 * pulse), 0, TAU)
      g.stroke()
      g.globalAlpha = 1
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const pt = particles[i]
    pt.x += pt.vx
    pt.y += pt.vy
    pt.vx *= 0.92
    pt.vy *= 0.92
    pt.life -= 0.03
    if (pt.life <= 0) {
      particles.splice(i, 1)
      continue
    }
    g.globalAlpha = Math.min(1, pt.life) * 0.8
    g.fillStyle = pt.c
    g.fillRect(pt.x - pt.s / 2, pt.y - pt.s / 2, pt.s, pt.s)
  }
  g.globalAlpha = 1

  for (let i = glows.length - 1; i >= 0; i--) {
    const gl = glows[i]
    gl.t += 0.02
    if (gl.t > 1) {
      glows.splice(i, 1)
      continue
    }
    g.globalAlpha = (1 - gl.t) * 0.8
    g.strokeStyle = '#f5e08a'
    g.lineWidth = 3 / cam.s + 2
    g.beginPath()
    g.arc(gl.x, gl.y, gl.r * (0.6 + gl.t * 0.9), 0, TAU)
    g.stroke()
  }
  g.globalAlpha = 1
  g.restore()

  if (p.mouse && p.showDigCursor) {
    g.strokeStyle = 'rgba(255,255,255,.55)'
    g.lineWidth = 1.5
    g.setLineDash([4, 4])
    g.beginPath()
    g.arc(p.mouse.x, p.mouse.y, p.toolRadius * cam.s, 0, TAU)
    g.stroke()
    g.setLineDash([])
  }

  return shake
}
