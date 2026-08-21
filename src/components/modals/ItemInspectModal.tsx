// Full 3D inspect view for a single museum item — opened by clicking a
// discovered tile in MuseumModal. Shows the item's category model (see
// src/data/models.ts) tinted to its rarity, orbit-able with one-finger
// drag (OrbitControls' default touch binding) or mouse drag on desktop.
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Coins } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ItemModel } from '@/components/museum/ItemModel'
import { RARITY } from '@/data/rarity'
import type { ItemDef } from '@/engine/types'

export function ItemInspectModal({ item, onClose }: { item: ItemDef | null; onClose: () => void }) {
  const rc = item ? RARITY[item.rar] : null

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="z-30 w-[min(92vw,520px)]">
        {item && rc && (
          <>
            <DialogTitle className="text-lg">{item.name}</DialogTitle>
            <div className="-mt-2 flex items-center gap-2">
              <Badge style={{ background: rc.c + '22', color: rc.c }}>{rc.n}</Badge>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                {item.cat} · <Coins className="h-3 w-3" />
                {item.val} · +{item.xp} XP
              </span>
            </div>

            <div className="h-[46vh] min-h-[280px] touch-none overflow-hidden rounded-xl border border-white/[0.08] bg-black/20">
              <Canvas camera={{ position: [0, 0.6, 2.4], fov: 40 }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[3, 5, 4]} intensity={1.3} />
                <directionalLight position={[-3, -1, -2]} intensity={0.4} />
                <Suspense fallback={null}>
                  <ItemModel def={item} />
                </Suspense>
                <OrbitControls
                  enablePan={false}
                  minDistance={1.2}
                  maxDistance={4}
                  autoRotate
                  autoRotateSpeed={0.8}
                />
              </Canvas>
            </div>
            <p className="text-center text-[11px] text-muted-foreground">Drag to rotate · pinch or scroll to zoom</p>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
