# state/

- `gameStore.ts` — Zustand store mirroring today's `meta`/`state`/`ui`
  globals (level, xp, coins, inventory, `found` set, energy, active tool,
  `ui.mode`). Coarse, low-frequency values only — the per-frame dig/camera
  state stays in `engine/` and is read imperatively by `GameCanvas.tsx`, not
  pushed through React on every tick.
- `persistence.ts` — localStorage save/load, same `strata-save-v1` key and
  shape as the original so existing saves keep working across the rewrite.
