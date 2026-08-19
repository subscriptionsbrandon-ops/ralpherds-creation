// Recovery/level-up/error toast queue — ported from
// legacy/strata-original.html's #toast + toast(). Messages are internally
// generated strings (item names come from our own CATALOG, never raw
// network/user input), so rendering them as HTML — same as the original —
// is safe here.
import { useEffect, useState } from 'react'
import { useGameStore, type Toast } from '@/state/gameStore'

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useGameStore((s) => s.removeToast)
  const [fading, setFading] = useState(false)

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
      className="animate-toast-in rounded-[10px] border border-white/[0.14] bg-black/[0.87] px-4 py-2 text-sm shadow-[0_4px_18px_rgba(0,0,0,.4)] transition-opacity duration-500"
      style={{ borderColor: toast.color, opacity: fading ? 0 : 1 }}
      dangerouslySetInnerHTML={{ __html: toast.html }}
    />
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
