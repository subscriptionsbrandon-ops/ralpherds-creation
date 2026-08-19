// Keeps bottom UI above mobile browser chrome (URL bar etc.) — ported from
// legacy/strata-original.html's syncVV(). Sets a `--vvb` custom property
// that Toolbar/SidePanel/DebugOverlay's `bottom` offsets read.
import { useEffect } from 'react'

function syncVV() {
  const vv = window.visualViewport
  if (!vv) {
    document.documentElement.style.setProperty('--vvb', '0px')
    return
  }
  const gap = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop))
  document.documentElement.style.setProperty('--vvb', gap + 'px')
}

export function useViewportInsetVar() {
  useEffect(() => {
    syncVV()
    window.visualViewport?.addEventListener('resize', syncVV)
    window.visualViewport?.addEventListener('scroll', syncVV)
    window.addEventListener('resize', syncVV)
    return () => {
      window.visualViewport?.removeEventListener('resize', syncVV)
      window.visualViewport?.removeEventListener('scroll', syncVV)
      window.removeEventListener('resize', syncVV)
    }
  }, [])
}
