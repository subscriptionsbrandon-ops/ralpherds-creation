// Scaffolding placeholder. Once the engine/state/UI layers described in
// legacy/strata-original.html are ported, this becomes:
//   <GameCanvas /> + <Hud /> + <Toolbar /> + <SidePanel /> + <ToastStack /> + active <modals/*>
// See src/engine, src/state, src/components for the structure this fills in.
export default function App() {
  return (
    <div className="flex h-dvh w-dvw items-center justify-center bg-background text-foreground">
      <div className="rounded-xl border border-white/10 bg-black/30 px-6 py-4 text-center">
        <h1 className="text-lg font-semibold tracking-wide text-amber-300">
          STRATA — scaffold online
        </h1>
        <p className="mt-1 text-sm text-white/60">
          Vite + React + TypeScript + Tailwind + shadcn/ui build pipeline is wired up.
          Game engine and UI porting comes next.
        </p>
      </div>
    </div>
  )
}
