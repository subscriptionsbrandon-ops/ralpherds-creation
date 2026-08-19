// Peer-to-peer trading UI — ported from legacy/strata-original.html's
// showTrade()/offerRows(). Protocol logic lives in src/net/useTrade.ts.
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ItemIcon } from '@/components/ItemIcon'
import { CATALOG } from '@/data/catalog'
import { RARITY } from '@/data/rarity'
import { useGameStore } from '@/state/gameStore'
import { SB_KEY, SB_URL, tradeCodeSuggest, useTrade } from '@/net/useTrade'

function OfferRows({
  mine,
  items,
  inv,
  found,
  onAdjust,
}: {
  mine: boolean
  items: Record<string, number>
  inv: Record<string, number>
  found: Set<string>
  onAdjust?: (id: string, delta: number) => void
}) {
  const ids = mine ? Object.keys(inv) : Object.keys(items)
  const rows = ids
    .map((id) => {
      const d = CATALOG[id]
      if (!d) return null
      const have = inv[id] || 0
      const n = items[id] | 0
      if (!mine && n <= 0) return null
      const rc = RARITY[d.rar]
      const isNew = !mine && !found.has(id)
      return (
        <div key={id} className="flex items-center gap-2.5 py-1.5">
          <ItemIcon def={d} size={34} />
          <div className="min-w-0 flex-1">
            <b className="text-xs">{d.name}</b>
            <div className="text-[10px]" style={{ color: rc.c }}>
              {rc.n}
              {mine ? ' · own ' + have : ''}
            </div>
          </div>
          {isNew && (
            <Badge
              style={{ background: '#e8b34b22', color: '#e8b34b' }}
              title="Not in your museum yet — accepting this trade catalogues it"
            >
              🏛 NEW
            </Badge>
          )}
          {mine ? (
            <>
              <Button variant="secondary" size="sm" className="px-2.5 py-0.5" onClick={() => onAdjust?.(id, -1)}>
                −
              </Button>
              <span className="w-[22px] text-center text-sm">{n}</span>
              <Button variant="secondary" size="sm" className="px-2.5 py-0.5" onClick={() => onAdjust?.(id, 1)}>
                +
              </Button>
            </>
          ) : (
            <span className="text-sm">×{n}</span>
          )}
        </div>
      )
    })
    .filter(Boolean)

  if (rows.length === 0) {
    return <p className="my-1.5 text-sm text-muted-foreground">{mine ? 'No items yet — dig some up first!' : 'Nothing offered yet'}</p>
  }
  return <div className="max-h-[200px] overflow-auto">{rows}</div>
}

export function TradeModal() {
  const open = useGameStore((s) => s.mode === 'trade')
  const inv = useGameStore((s) => s.inv)
  const found = useGameStore((s) => s.found)
  const coins = useGameStore((s) => s.coins)
  const showStart = useGameStore((s) => s.showStart)
  const { trade, joinRoom, leaveRoom, sendAccept, setCoins, adjustItem } = useTrade()
  const [codeInput, setCodeInput] = useState(tradeCodeSuggest)
  const [coinsInput, setCoinsInput] = useState('0')

  const back = () => {
    leaveRoom()
    showStart()
  }

  if (!SB_URL || !SB_KEY) {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent hideClose onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
          <DialogTitle className="text-lg">🤝 Trading</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Trading isn't configured yet. The site owner needs to fill in SB_URL and SB_KEY in src/net/useTrade.ts
            (Supabase dashboard → Project Settings → API).
          </p>
          <div className="text-right">
            <Button onClick={showStart}>Back</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!trade) {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent hideClose onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
          <DialogTitle className="text-lg">🤝 Trade with a friend</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Both players enter the <b>same room code</b> — share it however you like. Works across any two devices,
            anywhere.
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            <Input value={codeInput} maxLength={12} onChange={(e) => setCodeInput(e.target.value)} />
            <Button
              onClick={() => {
                const c = codeInput.trim().toUpperCase()
                if (c.length < 4) {
                  useGameStore.getState().pushToast('Code must be at least 4 characters', '#e8b34b')
                  return
                }
                joinRoom(c)
              }}
            >
              Enter room
            </Button>
            <div className="flex-1" />
            <Button variant="secondary" onClick={showStart}>
              Back
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const t = trade
  const waiting = t.peers < 2
  const crowded = t.peers > 2
  const iAcc = t.iAcceptedV > 0 && t.iAcceptedV === t.their.v
  const theyAcc = t.theyAcceptedV === t.my.v && t.my.v > 0

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent hideClose onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogTitle className="text-lg">🤝 Trading — room {t.code}</DialogTitle>

        {waiting ? (
          <p className="my-4 text-sm text-muted-foreground">
            Room <b className="tracking-widest text-primary">{t.code}</b> — waiting for your trade partner to enter
            the same code…
          </p>
        ) : (
          <>
            {crowded && (
              <p className="text-sm text-destructive">⚠ More than 2 people are in this room — trading is paused. Pick a fresh code.</p>
            )}
            <div className="flex flex-wrap gap-3.5">
              <div className="min-w-[220px] flex-1">
                <h3 className="text-sm font-semibold">You offer</h3>
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="text-sm">🪙</span>
                  <Input
                    className="w-20"
                    value={coinsInput}
                    maxLength={7}
                    onChange={(e) => setCoinsInput(e.target.value)}
                    onBlur={() => setCoins(parseInt(coinsInput, 10) || 0)}
                    onKeyDown={(e) => e.key === 'Enter' && setCoins(parseInt(coinsInput, 10) || 0)}
                  />
                  <span className="text-sm text-muted-foreground">of {coins}</span>
                </div>
                <OfferRows mine items={t.my.items} inv={inv} found={found} onAdjust={adjustItem} />
              </div>
              <div className="min-w-[220px] flex-1">
                <h3 className="text-sm font-semibold">They offer</h3>
                <div className="mb-1.5 text-sm">🪙 {t.their.coins || 0}</div>
                <OfferRows mine={false} items={t.their.items} inv={inv} found={found} />
              </div>
            </div>
            <p className="mt-2.5 text-sm text-muted-foreground">
              {theyAcc && '✅ They accepted your current offer. '}
              {iAcc ? '✅ You accepted their offer — waiting on them.' : 'Changing any offer resets acceptances on both sides.'}
            </p>
          </>
        )}

        <div className="mt-3.5 flex gap-2.5">
          <Button variant="secondary" onClick={back}>
            Leave
          </Button>
          <div className="flex-1" />
          {!waiting && !crowded && (
            <Button disabled={iAcc} onClick={sendAccept}>
              Accept trade
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
