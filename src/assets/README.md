# assets/

Bridges `data/catalog.ts` item ids to real image assets (replacing the
procedural `DRAW{}` functions in `legacy/strata-original.html`), and the
biome icon set.

- `itemSprites.ts` — item id → sprite path map + preloader, backed by
  `public/assets/items/*.png` (a CC0 sprite pack — license/attribution to be
  added to `public/assets/ATTRIBUTION.md` once the pack is picked)
- `biomeIcons.tsx` — biome id → `lucide-react` icon component (the biome
  icons were already Lucide paths inlined as SVG strings in the original —
  this just swaps to the real package instead of hand-copied path data)

Terrain/dig-crater rendering stays procedural (`engine/terrain.ts`) — it's a
live per-pixel depth simulation, not artwork, so no sprite replaces it.
