// Owns the <canvas> and the GameEngine instance driving it. Ported from
// legacy/strata-original.html's `#cv` element + main-loop bootstrap at the
// bottom of the file. Deliberately outside React's render cycle once
// mounted — see src/engine/README.md for why.
import { useEffect, useRef } from 'react'
import { GameEngine } from '@/engine/GameEngine'
import { setEngine } from '@/engine/engineInstance'

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const engine = new GameEngine(canvas)
    setEngine(engine)
    engine.start()
    return () => {
      engine.destroy()
      setEngine(null)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 block touch-none" style={{ cursor: 'crosshair' }} />
}
