// Dig-site picker — ported from legacy/strata-original.html's showStart().
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BIOME_ORDER, BIOMES } from '@/data/biomes'
import { BiomeIcon } from '@/assets/biomeIcons'
import { suggestSeed, TOUCH } from '@/lib/seed'
import { useGameStore } from '@/state/gameStore'
import { getEngine } from '@/engine/engineInstance'
import { cn } from '@/lib/utils'
import type { BiomeId } from '@/engine/types'

export function StartModal() {
  const open = useGameStore((s) => s.mode === 'menu')
  const startSel = useGameStore((s) => s.startSel)
  const setStartSel = useGameStore((s) => s.setStartSel)
  const openMuseum = useGameStore((s) => s.openMuseum)
  const showTrade = useGameStore((s) => s.showTrade)
  const [seed, setSeed] = useState(() => suggestSeed(startSel))

  const selectBiome = (id: BiomeId) => {
    setStartSel(id)
    setSeed(suggestSeed(id))
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        hideClose
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogTitle>⛏ STRATA</DialogTitle>
        <p className="-mt-2 text-sm leading-relaxed text-muted-foreground">
          An archaeological excavation sandbox. Choose a dig site, then {TOUCH ? 'touch' : 'click'} &amp; drag the
          ground to brush away sand, soil and stone. Everything buried at a site already exists — the same site code
          always hides the same world.
        </p>

        <div className="my-2 flex flex-col overflow-hidden rounded-xl border border-white/10">
          {BIOME_ORDER.map((id) => {
            const b = BIOMES[id]
            const selected = startSel === id
            return (
              <button
                key={id}
                onClick={() => selectBiome(id)}
                className={cn(
                  'flex items-center gap-3 border-b border-white/[0.06] bg-white/[0.02] p-2.5 text-left transition-colors last:border-b-0 hover:bg-primary/10',
                  selected && 'bg-primary/15',
                )}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]"
                  style={{ background: b.accent + '26' }}
                >
                  <BiomeIcon id={id} color={b.accent} />
                </div>
                <div className="min-w-0 flex-1">
                  <b className="block text-sm">{b.n}</b>
                  <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{b.tag}</span>
                </div>
                <div className="shrink-0 whitespace-nowrap text-xs tracking-widest">
                  {'★'.repeat(b.diff)}
                  <span className="opacity-25">{'★'.repeat(4 - b.diff)}</span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Input value={seed} maxLength={24} onChange={(e) => setSeed(e.target.value)} />
          <Button variant="secondary" onClick={() => setSeed(suggestSeed(startSel))}>
            🎲 New site
          </Button>
          <div className="flex-1" />
          <Button variant="secondary" onClick={showTrade}>
            🤝 Trade
          </Button>
          <Button variant="secondary" onClick={openMuseum}>
            🏛 Museum
          </Button>
          <Button onClick={() => getEngine().startExpedition(startSel, seed.trim() || suggestSeed(startSel))}>
            Begin Expedition
          </Button>
        </div>

        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {TOUCH ? 'Pinch to zoom · ✋ to pan' : 'Scroll to zoom · right-drag or ✋ to pan'} · 📡 scanners hint at what
          lies beneath · switch to a ⛏ pickaxe when you hit rock. Watch your ⚡ energy — every scoop costs some.
        </p>
      </DialogContent>
    </Dialog>
  )
}
