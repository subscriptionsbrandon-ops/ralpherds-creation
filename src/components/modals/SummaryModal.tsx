// Expedition results screen — ported from legacy/strata-original.html's
// endExpedition() modal build.
import { Coins, Landmark, Radar, Sparkles } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ItemIcon } from '@/components/ItemIcon'
import { CATALOG } from '@/data/catalog'
import { RARITY } from '@/data/rarity'
import { BIOMES } from '@/data/biomes'
import { useGameStore } from '@/state/gameStore'

export function SummaryModal() {
  const open = useGameStore((s) => s.mode === 'summary')
  const finds = useGameStore((s) => s.finds)
  const currentBiome = useGameStore((s) => s.currentBiome)
  const currentSeed = useGameStore((s) => s.currentSeed)
  const lastRemaining = useGameStore((s) => s.lastRemaining)
  const lvl = useGameStore((s) => s.lvl)
  const found = useGameStore((s) => s.found)
  const openMuseum = useGameStore((s) => s.openMuseum)
  const showStart = useGameStore((s) => s.showStart)

  if (!currentBiome) return null
  const biome = BIOMES[currentBiome]
  const totalCoins = finds.reduce((s, d) => s + d.val, 0)
  const totalXp = finds.reduce((s, d) => s + d.xp, 0)

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent hideClose onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogTitle className="text-lg">Expedition Summary — {biome.n}</DialogTitle>
        <p className="-mt-2 text-sm text-muted-foreground">
          {currentSeed} · {finds.length} finds · {lastRemaining} discoveries still buried at this site
        </p>

        {finds.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing recovered this time. Try the{' '}
            <Radar className="inline h-3.5 w-3.5 -translate-y-px align-middle" /> scanner early, and dig where the
            ground hints at something.
          </p>
        ) : (
          <div className="max-h-[40vh] overflow-auto">
            {finds.map((d, i) => {
              const rc = RARITY[d.rar]
              return (
                <div key={i} className="flex items-center gap-2.5 border-b border-white/[0.06] py-1.5 last:border-b-0">
                  <ItemIcon def={CATALOG[d.id]} size={46} />
                  <div className="flex-1">
                    <b className="text-sm">{d.name}</b>
                    <div className="text-[11px] text-muted-foreground">{d.cat}</div>
                  </div>
                  <Badge style={{ background: rc.c + '22', color: rc.c }}>{rc.n}</Badge>
                  <span className="flex w-16 items-center justify-end gap-0.5 text-right text-sm">
                    <Coins className="h-3.5 w-3.5" />
                    {d.val}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        <div className="flex flex-wrap gap-4 text-sm">
          <span className="inline-flex items-center gap-1">
            <Coins className="h-4 w-4" /> +{totalCoins}
          </span>
          <span className="inline-flex items-center gap-1">
            <Sparkles className="h-4 w-4" /> +{totalXp} XP
          </span>
          <span>Level {lvl}</span>
          <span className="inline-flex items-center gap-1">
            <Landmark className="h-4 w-4" />
            {found.size}/{Object.keys(CATALOG).length}
          </span>
        </div>

        <div className="flex gap-2.5">
          <Button variant="secondary" onClick={openMuseum}>
            <Landmark className="h-4 w-4" /> Museum
          </Button>
          <div className="flex-1" />
          <Button onClick={showStart}>New Expedition</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
