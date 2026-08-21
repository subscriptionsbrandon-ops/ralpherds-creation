// Collected-items catalog — ported from legacy/strata-original.html's
// showMuseum().
import { lazy, Suspense, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CATALOG, CATLIST } from '@/data/catalog'
import { RARITY } from '@/data/rarity'
import { ItemIcon } from '@/components/ItemIcon'
import { useGameStore } from '@/state/gameStore'
import type { CategoryId, ItemDef } from '@/engine/types'

// three.js/@react-three/fiber/drei plus the .glb models add well over 1MB
// to whatever chunk imports them — split into their own chunk, fetched only
// once someone actually opens the museum, instead of on every page load.
const ItemInspectModal = lazy(() =>
  import('@/components/modals/ItemInspectModal').then((m) => ({ default: m.ItemInspectModal })),
)

const CATS: ('All' | CategoryId)[] = ['All', ...CATLIST]

export function MuseumModal() {
  const open = useGameStore((s) => s.mode === 'museum')
  const musTab = useGameStore((s) => s.musTab)
  const setMusTab = useGameStore((s) => s.setMusTab)
  const found = useGameStore((s) => s.found)
  const inv = useGameStore((s) => s.inv)
  const closeMuseum = useGameStore((s) => s.closeMuseum)
  // Which discovered item's 3D inspect view is open — transient UI state,
  // scoped to this modal rather than the global store. `everInspected`
  // keeps ItemInspectModal mounted after its first open so later closes get
  // Radix's normal fade-out instead of vanishing when `inspecting` clears.
  const [inspecting, setInspecting] = useState<ItemDef | null>(null)
  const [everInspected, setEverInspected] = useState(false)

  const items = Object.values(CATALOG).filter((d) => musTab === 'All' || d.cat === musTab)
  const total = Object.keys(CATALOG).length

  // Warm the 3D chunk + model cache as soon as the museum opens, so the
  // first inspect click doesn't stall on a fetch.
  useEffect(() => {
    if (open) import('@/components/museum/preloadItemModels').then((m) => m.preloadItemModels())
  }, [open])

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent hideClose onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogTitle className="text-lg">🏛 Museum Collection</DialogTitle>
        <p className="-mt-2 text-sm text-muted-foreground">
          {found.size} of {total} discoveries catalogued · reputation grows with every recovery
        </p>

        <Tabs value={musTab} onValueChange={(v) => setMusTab(v as 'All' | CategoryId)}>
          <TabsList>
            {CATS.map((c) => (
              <TabsTrigger key={c} value={c}>
                {c}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(92px,1fr))] gap-2">
          {items.map((d) => {
            const has = found.has(d.id)
            const count = inv[d.id] || 0
            const rc = RARITY[d.rar]
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  if (!has) return
                  setInspecting(d)
                  setEverInspected(true)
                }}
                disabled={!has}
                className="relative rounded-[10px] border border-white/[0.08] bg-white/[0.02] px-1 py-2 text-center disabled:cursor-default enabled:cursor-pointer enabled:transition-transform enabled:hover:-translate-y-0.5 enabled:hover:border-white/20"
                style={has ? { borderColor: rc.c + '55' } : undefined}
              >
                {has && count > 0 && (
                  <span
                    className="absolute right-1 top-1 rounded-full bg-black/70 px-[6px] py-px text-[10px] font-semibold leading-tight text-[#e8e2d4]"
                    aria-label={`${count} owned`}
                  >
                    ×{count}
                  </span>
                )}
                <ItemIcon def={d} size={50} silhouette={!has} />
                <div className="mt-1 text-[10px] text-[#bdb49e]">{has ? d.name : '???'}</div>
              </button>
            )
          })}
        </div>

        <div className="mt-2 text-right">
          <Button onClick={closeMuseum}>Close</Button>
        </div>
      </DialogContent>
      {everInspected && (
        <Suspense fallback={null}>
          <ItemInspectModal item={inspecting} onClose={() => setInspecting(null)} />
        </Suspense>
      )}
    </Dialog>
  )
}
