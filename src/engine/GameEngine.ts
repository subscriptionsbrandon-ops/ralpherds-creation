// Orchestrates the engine pieces (camera, world, dig, loop, input) into one
// instance per <GameCanvas/>, mirroring the module-level globals + handlers
// in legacy/strata-original.html's input/main-loop sections. Talks to
// src/state/gameStore.ts via getState()/setState() the same way the engine
// talks to any other non-React consumer of a Zustand store — see that
// file's header comment.
import { Camera } from './camera'
import { digAt } from './dig'
import { attachInput, type InputTarget } from './input'
import { renderFrame, spawnDigParticles, spawnRecoverGlow, type Glow, type Particle } from './loop'
import { clamp } from './noise'
import { generate, type World } from './world'
import { BIOMES } from '@/data/biomes'
import { TOOL_ORDER, TOOLS } from '@/data/tools'
import type { BiomeId } from './types'
import { useGameStore } from '@/state/gameStore'

interface PanState {
  sx: number
  sy: number
  cx: number
  cy: number
}

interface PinchState {
  d: number
  s: number
}

export interface DebugSnapshot {
  win: { w: number; h: number; dpr: number }
  mouse: { x: number; y: number } | null
  cvRect: { left: number; top: number; w: number; h: number; backingW: number; backingH: number }
  world: { w: number; h: number } | null
  cam: { s: number; x: number; y: number }
  energy: number
  buried: number
  lastDig: string
}

export class GameEngine implements InputTarget {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private cam = new Camera()
  private world: World | null = null
  private particles: Particle[] = []
  private glows: Glow[] = []
  private shake = 0
  private digCount = 0
  private scanUntil = 0
  private lastDig = '—'

  private pointers = new Map<number, { x: number; y: number }>()
  private panState: PanState | null = null
  private pinch: PinchState | null = null
  private digging = false
  private lastDigW: { x: number; y: number } | null = null
  private lastDigT = 0
  private spaceHeld = false
  private mouse: { x: number; y: number } | null = null

  private detachInput: (() => void) | null = null
  private rafId: number | null = null
  private frame = (now: number) => {
    this.rafId = requestAnimationFrame(this.frame)
    const dpr = window.devicePixelRatio || 1
    const iw = window.innerWidth
    const ih = window.innerHeight
    if (this.canvas.width !== Math.round(iw * dpr) || this.canvas.height !== Math.round(ih * dpr)) {
      this.canvas.width = Math.round(iw * dpr)
      this.canvas.height = Math.round(ih * dpr)
      // <canvas> is a CSS "replaced element" — position:fixed;inset:0 alone
      // does NOT stretch it to the viewport like it would a <div>; browsers
      // size a replaced element from its width/height *attributes* instead.
      // Without pinning the CSS box back to viewport size explicitly here,
      // the canvas visually balloons to iw*dpr × ih*dpr CSS pixels on any
      // display with devicePixelRatio > 1 (i.e. most phones and laptops),
      // gets clipped by overflow:hidden, and pointer coordinates stop
      // lining up with what's drawn — digs land off the visible area.
      this.canvas.style.width = iw + 'px'
      this.canvas.style.height = ih + 'px'
    }
    const g = this.ctx
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    g.fillStyle = '#0e0c0a'
    g.fillRect(0, 0, iw, ih)
    const store = useGameStore.getState()
    if (this.world) {
      if (this.digging && store.mode === 'play' && !store.panMode && now - this.lastDigT > 240 && this.mouse) {
        const p = this.cam.s2w(this.mouse.x, this.mouse.y, iw, ih)
        this.performDig(p.x, p.y)
        this.lastDigW = p
        this.lastDigT = now
      }
      this.shake = renderFrame({
        g,
        innerWidth: iw,
        innerHeight: ih,
        world: this.world,
        cam: this.cam,
        shake: this.shake,
        particles: this.particles,
        glows: this.glows,
        scanUntil: this.scanUntil,
        now,
        mouse: this.mouse,
        showDigCursor: !!(this.mouse && store.mode === 'play' && !store.panMode),
        toolRadius: TOOLS[store.tool].r,
      })
    }
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
  }

  start() {
    this.detachInput = attachInput(this.canvas, this)
    this.rafId = requestAnimationFrame(this.frame)
  }

  destroy() {
    if (this.rafId != null) cancelAnimationFrame(this.rafId)
    this.detachInput?.()
  }

  startExpedition(biomeId: BiomeId, seed: string) {
    this.world = generate(BIOMES, biomeId, seed, window.innerWidth, window.innerHeight)
    this.digCount = 0
    this.particles = []
    this.glows = []
    this.shake = 0
    this.scanUntil = 0
    this.lastDig = '—'
    this.cam.fitTo(this.world.W, this.world.H, window.innerWidth, window.innerHeight)
    useGameStore.getState().startExpedition(biomeId, seed)
  }

  endExpedition() {
    if (!this.world) return
    useGameStore.getState().endExpedition(this.remainingBuried())
  }

  private remainingBuried(): number {
    return this.world ? this.world.objects.filter((o) => !o.recovered).length : 0
  }

  doScan() {
    if (useGameStore.getState().mode !== 'play') return
    const ok = useGameStore.getState().useScan()
    if (ok) this.scanUntil = performance.now() + 7000
  }

  getDebugSnapshot(): DebugSnapshot {
    const r = this.canvas.getBoundingClientRect()
    const store = useGameStore.getState()
    const buried = this.world ? this.world.objects.filter((o) => !o.recovered).length : 0
    return {
      win: { w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio || 1 },
      mouse: this.mouse,
      cvRect: { left: r.left, top: r.top, w: r.width, h: r.height, backingW: this.canvas.width, backingH: this.canvas.height },
      world: this.world ? { w: this.world.W, h: this.world.H } : null,
      cam: { s: this.cam.s, x: this.cam.x, y: this.cam.y },
      energy: store.energy,
      buried,
      lastDig: this.lastDig,
    }
  }

  private performDig(wx: number, wy: number) {
    const store = useGameStore.getState()
    if (!this.world || store.mode !== 'play' || store.panMode) return
    const tool = TOOLS[store.tool]
    const outcome = digAt(this.world, tool, this.digCount, store.energy, wx, wy)
    if (outcome.kind === 'blocked') return
    if (outcome.kind === 'insufficient-energy') {
      store.endExpedition(this.remainingBuried())
      return
    }
    this.digCount++
    store.spendEnergy(outcome.cost)
    this.lastDig = Math.round(wx) + ',' + Math.round(wy) + ' li' + outcome.li
    spawnDigParticles(this.particles, wx, wy, outcome.particleColor, tool.r)
    if (outcome.li >= 2) this.shake = Math.min(6, this.shake + outcome.shake)
    for (const cat of outcome.hinted) store.hintToast(cat)
    for (const item of outcome.recovered) {
      spawnRecoverGlow(this.glows, item.x, item.y, item.half)
      store.recoverItem(item.def)
    }
    if (useGameStore.getState().energy <= 0) {
      store.pushToast('⚡ Energy exhausted')
      window.setTimeout(() => {
        if (useGameStore.getState().mode === 'play') this.endExpedition()
      }, 700)
    }
  }

  // ===== InputTarget =====

  pointerDown(e: PointerEvent) {
    this.canvas.setPointerCapture(e.pointerId)
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
    this.mouse = { x: e.clientX, y: e.clientY }
    if (this.pointers.size === 2) {
      const p = [...this.pointers.values()]
      this.pinch = { d: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y), s: this.cam.s }
      this.digging = false
      this.panState = null
      return
    }
    const store = useGameStore.getState()
    if (e.button === 2 || e.button === 1 || store.panMode || this.spaceHeld) {
      this.panState = { sx: e.clientX, sy: e.clientY, cx: this.cam.x, cy: this.cam.y }
      return
    }
    if (store.mode === 'play') {
      this.digging = true
      const p = this.cam.s2w(e.clientX, e.clientY, window.innerWidth, window.innerHeight)
      this.performDig(p.x, p.y)
      this.lastDigW = p
      this.lastDigT = performance.now()
    }
  }

  pointerMove(e: PointerEvent) {
    this.mouse = { x: e.clientX, y: e.clientY }
    if (this.pointers.has(e.pointerId)) this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const iw = window.innerWidth
    const ih = window.innerHeight
    if (this.pinch && this.pointers.size === 2) {
      const p = [...this.pointers.values()]
      const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y)
      this.cam.s = clamp((this.pinch.s * d) / this.pinch.d, this.cam.min, this.cam.min * 4)
      if (this.world) this.cam.clamp(this.world.W, this.world.H, iw, ih)
      return
    }
    if (this.panState) {
      this.cam.x = this.panState.cx - (e.clientX - this.panState.sx) / this.cam.s
      this.cam.y = this.panState.cy - (e.clientY - this.panState.sy) / this.cam.s
      if (this.world) this.cam.clamp(this.world.W, this.world.H, iw, ih)
      return
    }
    const store = useGameStore.getState()
    if (this.digging && store.mode === 'play') {
      const p = this.cam.s2w(e.clientX, e.clientY, iw, ih)
      const t = TOOLS[store.tool]
      if (!this.lastDigW || Math.hypot(p.x - this.lastDigW.x, p.y - this.lastDigW.y) > t.r * 0.55) {
        this.performDig(p.x, p.y)
        this.lastDigW = p
        this.lastDigT = performance.now()
      }
    }
  }

  private endPointer(e: PointerEvent) {
    this.pointers.delete(e.pointerId)
    if (this.pointers.size < 2) this.pinch = null
    if (this.pointers.size === 0) {
      this.digging = false
      this.panState = null
    }
  }

  pointerUp(e: PointerEvent) {
    this.endPointer(e)
  }

  wheel(e: WheelEvent) {
    e.preventDefault()
    const iw = window.innerWidth
    const ih = window.innerHeight
    const w0 = this.cam.s2w(e.clientX, e.clientY, iw, ih)
    this.cam.s = clamp(this.cam.s * Math.pow(1.0015, -e.deltaY), this.cam.min, this.cam.min * 4)
    const w1 = this.cam.s2w(e.clientX, e.clientY, iw, ih)
    this.cam.x += w0.x - w1.x
    this.cam.y += w0.y - w1.y
    if (this.world) this.cam.clamp(this.world.W, this.world.H, iw, ih)
  }

  keyDown(e: KeyboardEvent) {
    if (e.key === ' ') {
      this.spaceHeld = true
      e.preventDefault()
    }
    const i = parseInt(e.key, 10) - 1
    if (i >= 0 && i < TOOL_ORDER.length) useGameStore.getState().setTool(TOOL_ORDER[i])
  }

  keyUp(e: KeyboardEvent) {
    if (e.key === ' ') this.spaceHeld = false
  }

  resize() {
    if (!this.world) return
    const iw = window.innerWidth
    const ih = window.innerHeight
    this.cam.min = Math.max(iw / this.world.W, ih / this.world.H)
    this.cam.s = clamp(this.cam.s, this.cam.min, this.cam.min * 4)
    this.cam.clamp(this.world.W, this.world.H, iw, ih)
  }
}
