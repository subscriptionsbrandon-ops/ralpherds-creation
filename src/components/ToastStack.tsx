// Recovery/level-up/error toast queue — ported from
// legacy/strata-original.html's #toast + toast(). Renders as plain React
// text + an optional icon component, never raw HTML — see the Toast.text
// doc comment in gameStore.ts for why (a caught error's `.message` ended up
// flowing through here once; nothing that reaches this field should ever
// be treated as markup).
import { useEffect, useState } from 'react'
import { useGameStore, type Toast } from '@/state/gameStore'

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useGameStore((s) => s.removeToast)
  const [fading, setFading] = useState(false)
  const Icon = toast.icon

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setFading(true), 3200)
    const removeTimer = window.setTimeout(() => removeToast(toast.id), 3620)
    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(removeTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast.id])

  return (
    <div
      className="animate-toast-in flex items-center gap-1.5 rounded-[10px] border border-white/[0.14] bg-black/[0.87] px-4 py-2 text-sm shadow-[0_4px_18px_rgba(0,0,0,.4)] transition-opacity duration-500"
      style={{ borderColor: toast.color, opacity: fading ? 0 : 1 }}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" style={{ color: toast.color }} />}
      {toast.text}
    </div>
  )
}

export function ToastStack() {
  const toasts = useGameStore((s) => s.toasts)
  return (
    <div className="pointer-events-none fixed left-1/2 top-16 z-[8] flex w-max max-w-[90vw] -translate-x-1/2 flex-col items-center gap-1.5">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  )
}
