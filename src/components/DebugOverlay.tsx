// Debug readout — ported from legacy/strata-original.html's #debug toggle
// (enable with #debug in the URL, or triple-tap the location chip) +
// updateDbg(). The location chip dispatches a `strata:debug-tap` window
// event on pointerdown (see Hud.tsx) instead of this file reaching into the
// DOM for it, since there's no `#topL` element id to grab anymore.
import { useEffect, useRef, useState } from 'react'
import { Bug } from 'lucide-react'
import { tryGetEngine } from '@/engine/engineInstance'
import { DEBUG_TAP_EVENT } from '@/lib/debugTap'

const TAP_WINDOW_MS = 800

function initialDbgOn() {
  return /debug/.test(location.hash) || /debug/.test(location.search)
}

export function DebugOverlay() {
  const [dbgOn, setDbgOn] = useState(initialDbgOn)
  const [text, setText] = useState('')
  const tapsRef = useRef<number[]>([])

  useEffect(() => {
    const onTap = () => {
      const t = performance.now()
      tapsRef.current = tapsRef.current.filter((x) => t - x < TAP_WINDOW_MS)
      tapsRef.current.push(t)
      if (tapsRef.current.length >= 3) {
        setDbgOn((v) => !v)
        tapsRef.current = []
      }
    }
    window.addEventListener(DEBUG_TAP_EVENT, onTap)
    return () => window.removeEventListener(DEBUG_TAP_EVENT, onTap)
  }, [])

  useEffect(() => {
    if (!dbgOn) return
    let raf = 0
    const tick = () => {
      const engine = tryGetEngine()
      if (engine) {
        const d = engine.getDebugSnapshot()
        setText(
          `win ${d.win.w}x${d.win.h} dpr${d.win.dpr.toFixed(2)}\n` +
            `mouse ${d.mouse ? Math.round(d.mouse.x) + ',' + Math.round(d.mouse.y) : '—'}\n` +
            `cvrect ${Math.round(d.cvRect.left)},${Math.round(d.cvRect.top)} ${Math.round(d.cvRect.w)}x${Math.round(d.cvRect.h)}  backing ${d.cvRect.backingW}x${d.cvRect.backingH}\n` +
            `world ${d.world ? d.world.w + 'x' + d.world.h : '—'}  cam.s ${d.cam.s.toFixed(3)}\n` +
            `cam ${Math.round(d.cam.x)},${Math.round(d.cam.y)}\n` +
            `energy ${Math.ceil(d.energy)}  buried ${d.buried}\n` +
            `lastDig ${d.lastDig}`,
        )
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [dbgOn])

  return (
    <>
      <button
        onClick={() => setDbgOn((v) => !v)}
        className="fixed left-1/2 top-[calc(8px+env(safe-area-inset-top,0px))] z-[31] flex h-7 w-[34px] -translate-x-1/2 items-center justify-center rounded-lg border border-white/20 bg-black/80 p-0 text-sm"
      >
        <Bug className="h-4 w-4 text-[#7dff9f]" />
      </button>
      {dbgOn && (
        <div className="fixed bottom-[calc(140px+var(--vvb,0px))] left-2 z-30 max-w-[70vw] whitespace-pre rounded-lg bg-black/[0.72] px-2 py-1.5 font-mono text-[11px] text-[#7dff9f]">
          {text}
        </div>
      )}
    </>
  )
}
