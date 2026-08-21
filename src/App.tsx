// Top-level layout — ported from legacy/strata-original.html's body markup
// (#cv, #topL/#topR, #toolbar, #side, #toast, #modal) + its boot sequence
// at the bottom of the file (load save, TEST MODE, first render, RAF start).
import { useEffect, useRef } from 'react'
import { Save } from 'lucide-react'
import { GameCanvas } from '@/components/GameCanvas'
import { Hud } from '@/components/Hud'
import { Toolbar } from '@/components/Toolbar'
import { SidePanel } from '@/components/SidePanel'
import { ToastStack } from '@/components/ToastStack'
import { DebugOverlay } from '@/components/DebugOverlay'
import { StartModal } from '@/components/modals/StartModal'
import { MuseumModal } from '@/components/modals/MuseumModal'
import { SummaryModal } from '@/components/modals/SummaryModal'
import { TradeModal } from '@/components/modals/TradeModal'
import { hydrateFromSave, useGameStore } from '@/state/gameStore'
import { useViewportInsetVar } from '@/lib/useViewportInsetVar'

export default function App() {
  useViewportInsetVar()
  const pushToast = useGameStore((s) => s.pushToast)
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current) return // guards React StrictMode's double-invoke in dev
    hydrated.current = true
    const hadSave = hydrateFromSave()
    if (hadSave) {
      const s = useGameStore.getState()
      pushToast('Progress restored — Lv ' + s.lvl + ' · ' + s.coins + ' coins · ' + s.found.size + ' catalogued', '#8fe86c', Save)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="fixed inset-0 h-dvh w-dvw select-none overflow-hidden bg-[#141210] text-[#e8e2d4]">
      <GameCanvas />
      <Hud />
      <Toolbar />
      <SidePanel />
      <ToastStack />
      <DebugOverlay />
      <StartModal />
      <MuseumModal />
      <SummaryModal />
      <TradeModal />
    </div>
  )
}
