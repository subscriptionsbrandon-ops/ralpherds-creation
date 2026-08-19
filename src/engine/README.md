# engine/

Pure TypeScript simulation — no React, no DOM UI. Owns the mutable
`world`/`cam`/dig-state objects the way `legacy/strata-original.html` does
today, driven imperatively by `components/GameCanvas.tsx` via
`requestAnimationFrame`, not by React re-renders.

Planned modules (ported from the corresponding sections of
`legacy/strata-original.html`):

- `noise.ts` — `hashStr`/`mulberry32`/`hash2`/`vnoise`/`fbm`, `clamp`/`lerp`, `TAU`
- `terrain.ts` — `paintTerrainBase`, `paintSurface`, `paintDig`, `layerIndexAt`
- `world.ts` — `generate()`, `makeObj()`, the `World` type
- `dig.ts` — `digAt`, `updateExposure`, `recover`, `addXP`, energy accounting
- `camera.ts` — camera state, `s2w`, `fitCamera`, `clampCam`
- `input.ts` — pointer/wheel/keyboard → engine calls
- `loop.ts` — the main draw loop, particles, glows
