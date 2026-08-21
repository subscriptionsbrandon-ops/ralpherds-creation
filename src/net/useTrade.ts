// Peer-to-peer trading over Supabase Realtime broadcast (no tables needed) —
// ported from legacy/strata-original.html's joinTradeRoom/sendOffer/
// sendAccept/checkCommit/adjOffer. Two players enter the same room code;
// offers relay through a Realtime channel. The anon/publishable key below
// is public by design (Supabase dashboard → Project Settings → API).
//
// The original lazy-loaded the Supabase JS library from a CDN script tag
// only when a player opened the trade screen, so non-trading players never
// paid for it. Now that we have a real bundler, `import('@supabase/supabase-js')`
// gets the same effect — Vite code-splits it into a separate chunk that's
// only fetched here.
import { useCallback, useRef, useState } from 'react'
import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'
import { Handshake, LogOut, TriangleAlert } from 'lucide-react'
import { useGameStore } from '@/state/gameStore'
import { CATALOG } from '@/data/catalog'

export const SB_URL = 'https://fqzqgslpobpuudexbxcf.supabase.co'
export const SB_KEY = 'sb_publishable_hJh6invS7pYFBhhCK38wLw_rXzgGO4A'

export interface TradeOffer {
  coins: number
  items: Record<string, number>
  v: number
}

export interface TradeRoomState {
  code: string
  peers: number
  done: boolean
  my: TradeOffer
  their: TradeOffer
  iAcceptedV: number
  theyAcceptedV: number
}

function emptyOffer(): TradeOffer {
  return { coins: 0, items: {}, v: 0 }
}

export function tradeCodeSuggest(): string {
  const c = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 6; i++) s += c[(Math.random() * c.length) | 0]
  return s
}

export function useTrade() {
  const [trade, setTrade] = useState<TradeRoomState | null>(null)
  const tradeRef = useRef<TradeRoomState | null>(null)
  const sbRef = useRef<SupabaseClient | null>(null)
  const chRef = useRef<RealtimeChannel | null>(null)

  const apply = useCallback((patch: Partial<TradeRoomState>) => {
    if (!tradeRef.current) return
    const next = { ...tradeRef.current, ...patch }
    tradeRef.current = next
    setTrade(next)
  }, [])

  const checkCommit = useCallback(() => {
    const t = tradeRef.current
    if (!t || t.done) return
    if (t.iAcceptedV !== t.their.v || t.theyAcceptedV !== t.my.v) return
    if (t.my.v === 0 && t.their.v === 0) return
    // tell the peer we're committing — insurance against a lost 'accept' stranding one side
    try {
      chRef.current?.send({ type: 'broadcast', event: 'done', payload: { gaveV: t.my.v, gotV: t.their.v } })
    } catch {
      // best-effort
    }
    apply({ done: true })
    const newlyCatalogued = useGameStore
      .getState()
      .applyTradeResult(t.their.coins - t.my.coins, t.their.items, t.my.items)
    useGameStore
      .getState()
      .pushToast(
        'Trade complete!' + (newlyCatalogued ? ' ' + newlyCatalogued + ' new museum ' + (newlyCatalogued > 1 ? 'entries' : 'entry') + ' catalogued!' : ''),
        '#8fe86c',
        Handshake,
      )
    leaveRoom()
    useGameStore.getState().showStart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apply])

  const leaveRoom = useCallback(() => {
    if (chRef.current && sbRef.current) sbRef.current.removeChannel(chRef.current)
    chRef.current = null
    tradeRef.current = null
    setTrade(null)
  }, [])

  const sendOffer = useCallback(() => {
    const t = tradeRef.current
    if (!t || !chRef.current || t.done) return
    const my = { ...t.my, v: t.my.v + 1 }
    apply({ my, theyAcceptedV: 0 }) // their acceptance of my OLD offer is void; my acceptance of THEIR unchanged offer stands
    chRef.current.send({ type: 'broadcast', event: 'offer', payload: my })
  }, [apply])

  const joinRoom = useCallback(
    async (code: string) => {
      let createClient: typeof import('@supabase/supabase-js').createClient
      try {
        ;({ createClient } = await import('@supabase/supabase-js'))
        if (!sbRef.current) sbRef.current = createClient(SB_URL, SB_KEY)
      } catch (e) {
        // e.message renders as plain text via Toast.text (see ToastStack.tsx),
        // never as HTML, so an unusual/unexpected error message here can't
        // execute anything — it can only ever end up as literal displayed
        // characters, whatever the message from the SDK/network turns out
        // to say. Don't reintroduce dangerouslySetInnerHTML on this field.
        useGameStore.getState().pushToast('Trade unavailable: ' + (e instanceof Error ? e.message : String(e)), '#e86c5b', TriangleAlert)
        return
      }
      leaveRoom()
      const initial: TradeRoomState = {
        code,
        peers: 1,
        done: false,
        my: emptyOffer(),
        their: emptyOffer(),
        iAcceptedV: 0,
        theyAcceptedV: 0,
      }
      tradeRef.current = initial
      setTrade(initial)

      const sb = sbRef.current
      const ch = sb.channel('strata-trade-' + code, {
        config: { broadcast: { self: false }, presence: { key: 'p' + Math.random().toString(36).slice(2, 9) } },
      })
      chRef.current = ch

      ch.on('presence', { event: 'sync' }, () => {
        if (!tradeRef.current) return
        const n = Object.keys(ch.presenceState()).length
        const had = tradeRef.current.peers
        apply({ peers: n })
        if (n > had && n === 2) {
          useGameStore.getState().pushToast('Trader joined the room', '#8fe86c', Handshake)
          sendOffer()
        }
        if (n < had && !tradeRef.current.done) useGameStore.getState().pushToast('Trader left the room', '#e8b34b', LogOut)
      })
      ch.on('broadcast', { event: 'offer' }, ({ payload: p }: { payload: TradeOffer }) => {
        const t = tradeRef.current
        if (!t || t.done || !p) return
        apply({ their: { coins: Math.max(0, p.coins | 0), items: p.items && typeof p.items === 'object' ? p.items : {}, v: p.v | 0 } })
        checkCommit()
      })
      ch.on('broadcast', { event: 'accept' }, ({ payload: p }: { payload: { v: number } }) => {
        const t = tradeRef.current
        if (!t || t.done || !p) return
        if ((p.v | 0) === t.my.v) apply({ theyAcceptedV: p.v | 0 })
        checkCommit()
      })
      ch.on('broadcast', { event: 'done' }, ({ payload: p }: { payload: { gaveV: number; gotV: number } }) => {
        // peer committed: if it matches current versions and we accepted their offer, commit too
        const t = tradeRef.current
        if (!t || t.done || !p) return
        if ((p.gotV | 0) === t.my.v && (p.gaveV | 0) === t.their.v && t.iAcceptedV === t.their.v) {
          apply({ theyAcceptedV: t.my.v })
          checkCommit()
        }
      })
      ch.subscribe((status: string) => {
        if (!tradeRef.current) return
        if (status === 'SUBSCRIBED') ch.track({ t: Date.now() })
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT')
          useGameStore.getState().pushToast('Trade connection lost', '#e86c5b', TriangleAlert)
      })
    },
    [apply, checkCommit, leaveRoom, sendOffer],
  )

  const sendAccept = useCallback(() => {
    const t = tradeRef.current
    if (!t || !chRef.current || t.done || (t.their.v === 0 && t.my.v === 0)) return
    apply({ iAcceptedV: t.their.v })
    chRef.current.send({ type: 'broadcast', event: 'accept', payload: { v: t.their.v } })
    checkCommit()
  }, [apply, checkCommit])

  const setCoins = useCallback(
    (v: number) => {
      const t = tradeRef.current
      if (!t || t.done) return
      const max = useGameStore.getState().coins
      const next = Math.max(0, Math.min(v, max))
      if (next === t.my.coins) return
      apply({ my: { ...t.my, coins: next } })
      sendOffer()
    },
    [apply, sendOffer],
  )

  const adjustItem = useCallback(
    (id: string, delta: number) => {
      const t = tradeRef.current
      if (!t || t.done) return
      const have = useGameStore.getState().inv[id] || 0
      const cur = t.my.items[id] | 0
      const next = Math.max(0, Math.min(cur + delta, have))
      if (next === cur) return
      const items = { ...t.my.items }
      if (next === 0) delete items[id]
      else items[id] = next
      apply({ my: { ...t.my, items } })
      sendOffer()
    },
    [apply, sendOffer],
  )

  return { trade, joinRoom, leaveRoom, sendAccept, setCoins, adjustItem, catalogHasId: (id: string) => !!CATALOG[id] }
}
