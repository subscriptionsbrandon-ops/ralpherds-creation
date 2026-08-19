import * as React from 'react'
import { cn } from '@/lib/utils'

/** Rarity/status pill — mirrors the original's `.rar` chip, which set its
 * background/color inline per-rarity, so this stays a thin wrapper rather
 * than baking rarity colors into variants. */
function Badge({ className, style, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn('inline-block rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wide', className)}
      style={style}
      {...props}
    />
  )
}

export { Badge }
