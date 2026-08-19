// Shared with DebugOverlay.tsx's triple-tap listener — split into its own
// module (rather than exported from DebugOverlay.tsx) purely to keep that
// file component-only for Fast Refresh.
export const DEBUG_TAP_EVENT = 'strata:debug-tap'

export function dispatchDebugTap() {
  window.dispatchEvent(new Event(DEBUG_TAP_EVENT))
}
