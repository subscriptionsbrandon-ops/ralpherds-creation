// Dig-site picker — ported from legacy/strata-original.html's showStart().
import { useState } from 'react'
import { Dices, Hand, Handshake, Landmark, Pickaxe, Radar, Star, Zap } from 'lucide-react'
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

/** Small inline icon sized to sit on a text baseline, for icons mixed into
 * a sentence rather than standing alone next to a label. */
function InlineIcon({ icon: Icon }: { icon: typeof Pickaxe }) {
  return <Icon className="inline h-[13px] w-[13px] -translate-y-[1px] align-middle" strokeWidth={2.25} />
}

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
        <DialogTitle className="flex items-center gap-2">
          <Pickaxe className="h-5 w-5 text-primary" />
          STRATA
        </DialogTitle>
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
                <div className="flex shrink-0 items-center gap-0.5">
                  {Array.from({ length: 4 }, (_, i) => (
                    <Star
                      key={i}
                      className={cn('h-3 w-3', i < b.diff ? 'fill-primary text-primary' : 'text-muted-foreground/30')}
                    />
                  ))}
                </div>
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Input value={seed} maxLength={24} onChange={(e) => setSeed(e.target.value)} />
          <Button variant="secondary" onClick={() => setSeed(suggestSeed(startSel))}>
            <Dices className="h-4 w-4" /> New site
          </Button>
          <div className="flex-1" />
          <Button variant="secondary" onClick={showTrade}>
            <Handshake className="h-4 w-4" /> Trade
          </Button>
          <Button variant="secondary" onClick={openMuseum}>
            <Landmark className="h-4 w-4" /> Museum
          </Button>
          <Button onClick={() => getEngine().startExpedition(startSel, seed.trim() || suggestSeed(startSel))}>
            Begin Expedition
          </Button>
        </div>

        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {TOUCH ? 'Pinch to zoom' : 'Scroll to zoom or right-drag'} · <InlineIcon icon={Hand} /> to pan ·{' '}
          <InlineIcon icon={Radar} /> scanners hint at what lies beneath · switch to a <InlineIcon icon={Pickaxe} />{' '}
          pickaxe when you hit rock. Watch your <InlineIcon icon={Zap} /> energy — every scoop costs some.
        </p>
      </DialogContent>
    </Dialog>
  )
}
