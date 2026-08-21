// Dig-tool picker — ported from legacy/strata-original.html's #toolbar +
// renderToolbar().
import { cn } from '@/lib/utils'
import { TOOL_ORDER, TOOLS } from '@/data/tools'
import { useGameStore } from '@/state/gameStore'

export function Toolbar() {
  const tool = useGameStore((s) => s.tool)
  const setTool = useGameStore((s) => s.setTool)

  return (
    <div
      className="fixed bottom-[calc(12px+var(--vvb,0px)+env(safe-area-inset-bottom,0px))] left-1/2 z-[5] flex -translate-x-1/2 gap-1.5"
    >
      {TOOL_ORDER.map((id) => {
        const t = TOOLS[id]
        const active = tool === id
        const Icon = t.icon
        return (
          <button
            key={id}
            onClick={() => setTool(id)}
            className={cn(
              'flex h-[58px] w-14 flex-col items-center justify-center gap-0.5 rounded-xl border border-white/10 bg-black/[0.72] text-[9px] text-[#cfc6b2] backdrop-blur-md max-[380px]:h-12 max-[380px]:w-11 sm:h-[50px] sm:w-[46px] sm:text-[8px]',
              active && 'border-primary bg-[rgba(60,45,20,.8)] text-[#f2d992] shadow-[0_0_12px_rgba(232,179,75,.25)]',
            )}
          >
            <Icon className="h-[18px] w-[18px] max-[600px]:h-4 max-[600px]:w-4" strokeWidth={2} />
            {t.n}
          </button>
        )
      })}
    </div>
  )
}
