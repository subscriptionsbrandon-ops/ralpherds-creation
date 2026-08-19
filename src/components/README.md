# components/

React UI layer.

- `GameCanvas.tsx` — owns the `<canvas>` ref, wires `engine/loop.ts` +
  `engine/input.ts` in a `useEffect`, reads/writes the low-frequency bits of
  `state/gameStore.ts` (coins, xp, mode) that the imperative loop needs to
  hand off to React.
- `Hud.tsx` — energy/coins/level chips (top bar)
- `Toolbar.tsx` — dig-tool picker (brush/trowel/shovel/pick/hammer)
- `SidePanel.tsx` — scan/pan/museum/end-expedition buttons
- `ToastStack.tsx` — the recovery/level-up/error toast queue
- `DebugOverlay.tsx` — the `#debug` readout (triple-tap location chip / `#debug` in URL)
- `modals/` — `StartModal`, `MuseumModal`, `SummaryModal`, `TradeModal`
  (replacing the innerHTML-string modal building in the original with JSX,
  using `ui/` primitives)
- `ui/` — shadcn/ui primitives (Dialog, Tabs, Button, Input, ...), added via
  `npx shadcn add <component>` as each modal needs them
