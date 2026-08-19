# Strata

An archaeological excavation sandbox game.

## Status: mid-rewrite

This project is being migrated from a single hand-written `index.html`
(preserved at [`legacy/strata-original.html`](legacy/strata-original.html),
still fully playable by opening it directly) into a proper
Vite + React + TypeScript + Tailwind + shadcn/ui app.

**Current step:** tooling scaffold — build/dev/lint pipeline is wired up and
verified working; the game engine, state, and UI have not been ported yet
(`src/App.tsx` is a placeholder). See the `README.md` in each `src/*`
subfolder for what lands there next:

- [`src/engine`](src/engine) — the canvas simulation (world gen, digging, camera, input, draw loop)
- [`src/data`](src/data) — catalog/biome/tool/rarity tables
- [`src/assets`](src/assets) — real sprite assets replacing the original's procedural art
- [`src/state`](src/state) — Zustand store + save/load persistence
- [`src/net`](src/net) — the Supabase Realtime trading feature
- [`src/components`](src/components) — React UI (HUD, toolbar, modals) built on shadcn/ui

## Development

```sh
npm install
npm run dev       # dev server
npm run build     # type-check + production build to dist/
npm run lint
```

## Deployment

`.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages
on every push to `main`. Requires the repo's **Settings → Pages → Source**
set to **GitHub Actions**.
