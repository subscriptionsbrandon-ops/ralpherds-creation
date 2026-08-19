// A single GameEngine is mounted for the app's lifetime (one <canvas>,
// always present behind the modals — same as legacy/strata-original.html's
// single global `world`/`cam`/etc.). Modals and HUD components call into it
// via this module-level accessor instead of threading a ref through every
// component, mirroring that original global-access pattern.
import type { GameEngine } from './GameEngine'

let instance: GameEngine | null = null

export function setEngine(e: GameEngine | null) {
  instance = e
}

export function getEngine(): GameEngine {
  if (!instance) throw new Error('GameEngine not initialized — <GameCanvas/> must be mounted first')
  return instance
}

export function tryGetEngine(): GameEngine | null {
  return instance
}
