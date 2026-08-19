// Camera — ported from legacy/strata-original.html's cam state/fitCamera/
// clampCam/s2w. A small class instead of module-level globals so each
// GameEngine instance (one per <GameCanvas/>) gets its own camera.
import { clamp } from './noise'

export class Camera {
  x = 0
  y = 0
  s = 1
  min = 1

  fitTo(W: number, H: number, innerWidth: number, innerHeight: number) {
    this.min = Math.max(innerWidth / W, innerHeight / H)
    this.s = this.min
    this.x = W / 2
    this.y = H / 2
    this.clamp(W, H, innerWidth, innerHeight)
  }

  clamp(W: number, H: number, innerWidth: number, innerHeight: number) {
    const vw = innerWidth / this.s / 2
    const vh = innerHeight / this.s / 2
    this.x = clamp(this.x, Math.min(vw, W / 2), Math.max(W - vw, W / 2))
    this.y = clamp(this.y, Math.min(vh, H / 2), Math.max(H - vh, H / 2))
  }

  /** Screen → world coordinates. */
  s2w(sx: number, sy: number, innerWidth: number, innerHeight: number): { x: number; y: number } {
    return {
      x: (sx - innerWidth / 2) / this.s + this.x,
      y: (sy - innerHeight / 2) / this.s + this.y,
    }
  }
}
