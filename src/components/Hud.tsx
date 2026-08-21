// Top location/energy/coins/level chips — ported from legacy/strata-original.html's
// #topL/#topR + hud().
import type { ReactNode } from 'react'
import { Coins, Zap } from 'lucide-react'
import { useGameStore, xpNeeded } from '@/state/gameStore'
import { BIOMES } from '@/data/biomes'
import { dispatchDebugTap } from '@/lib/debugTap'

function Chip({ children, onPointerDown }: { children: ReactNode; onPointerDown?: () => void }) {
  return (
    <div
      onPointerDown={onPointerDown}
      className="rounded-[10px] border border-white/10 bg-black/[0.72] px-3 py-1.5 text-xs tracking-wide backdrop-blur-md"
    >
      {children}
    </div>
  )
}

function Bar({ pct, colorClass }: { pct: number; colorClass: string }) {
  return (
    <span className="ml-1.5 inline-block h-2 w-[100px] overflow-hidden rounded-full bg-white/[0.12] align-middle max-[600px]:hidden">
      <i className={`block h-full rounded-full transition-[width] duration-200 ${colorClass}`} style={{ width: `${pct}%` }} />
    </span>
  )
}

export function Hud() {
  // Selected individually (not as one object) so each read stays
  // referentially stable across renders — Zustand/useSyncExternalStore
  // needs that to avoid re-render loops.
  const energy = useGameStore((s) => s.energy)
  const maxE = useGameStore((s) => s.maxE)
  const coins = useGameStore((s) => s.coins)
  const lvl = useGameStore((s) => s.lvl)
  const xp = useGameStore((s) => s.xp)
  const currentBiome = useGameStore((s) => s.currentBiome)
  const currentSeed = useGameStore((s) => s.currentSeed)

  const locationLabel = currentBiome
    ? (
        <>
          <b>{BIOMES[currentBiome].n}</b> · {currentSeed}
        </>
      )
    : (
        '—'
      )

  const energyPct = Math.max(0, Math.min(100, (energy / (maxE || 1)) * 100))
  const xpPct = Math.max(0, Math.min(100, (xp / xpNeeded(lvl)) * 100))

  return (
    <>
      <div className="fixed left-2.5 top-2.5 z-[5] flex max-w-[46vw] items-center gap-2 sm:max-w-none">
        <Chip onPointerDown={dispatchDebugTap}>{locationLabel}</Chip>
      </div>
      <div className="fixed right-2.5 top-2.5 z-[5] flex flex-wrap items-center justify-end gap-2">
        <Chip>
          <Zap className="inline h-3.5 w-3.5 -translate-y-px align-middle" /> <span>{Math.max(0, Math.ceil(energy))}</span>
          <Bar pct={energyPct} colorClass="bg-gradient-to-r from-[#e8b34b] to-[#f0d078]" />
        </Chip>
        <Chip>
          <Coins className="inline h-3.5 w-3.5 -translate-y-px align-middle" /> {coins}
        </Chip>
        <Chip>
          Lv {lvl}
          <Bar pct={xpPct} colorClass="bg-gradient-to-r from-[#7db2e8] to-[#9fd0f0]" />
        </Chip>
      </div>
    </>
  )
}
