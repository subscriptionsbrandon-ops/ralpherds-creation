// Scan/pan/museum/end-expedition buttons — ported from
// legacy/strata-original.html's #side + renderSide().
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useGameStore } from '@/state/gameStore'
import { getEngine } from '@/engine/engineInstance'

function SideButton({ icon, label, active, onClick }: { icon: ReactNode; label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex h-[58px] w-14 flex-col items-center justify-center gap-0.5 rounded-xl border border-white/10 bg-black/[0.72] text-[9px] text-[#cfc6b2] backdrop-blur-md max-[380px]:h-12 max-[380px]:w-11 sm:h-[50px] sm:w-[46px] sm:text-[8px]',
        active && 'border-primary bg-[rgba(60,45,20,.8)] text-[#f2d992] shadow-[0_0_12px_rgba(232,179,75,.25)]',
      )}
    >
      <div className="text-[17px] max-[600px]:text-[15px]">{icon}</div>
      {label}
    </button>
  )
}

export function SidePanel() {
  const scans = useGameStore((s) => s.scans)
  const panMode = useGameStore((s) => s.panMode)
  const togglePanMode = useGameStore((s) => s.togglePanMode)
  const openMuseum = useGameStore((s) => s.openMuseum)
  const mode = useGameStore((s) => s.mode)

  return (
    <div className="fixed bottom-[calc(12px+var(--vvb,0px)+env(safe-area-inset-bottom,0px))] right-3 z-[5] flex flex-col gap-1.5 max-[600px]:bottom-[calc(68px+var(--vvb,0px)+env(safe-area-inset-bottom,0px))] max-[600px]:left-1/2 max-[600px]:right-auto max-[600px]:-translate-x-1/2 max-[600px]:flex-row">
      <SideButton icon="📡" label={`Scan ×${scans}`} onClick={() => getEngine().doScan()} />
      <SideButton icon="✋" label="Pan" active={panMode} onClick={togglePanMode} />
      <SideButton icon="🏛" label="Museum" onClick={openMuseum} />
      <SideButton icon="🚩" label="End" onClick={() => mode === 'play' && getEngine().endExpedition()} />
    </div>
  )
}
