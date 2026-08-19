# net/

- `useTrade.ts` — the Supabase Realtime trade-room logic from
  `legacy/strata-original.html` (`joinTradeRoom`/`sendOffer`/`sendAccept`/
  `checkCommit`), wrapped as a React hook consumed by
  `components/modals/TradeModal.tsx`. Protocol (offer/accept/done broadcast
  events, version-numbered offers) carries over unchanged.
