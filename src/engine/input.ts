// DOM event wiring — attaches pointer/wheel/keyboard/resize listeners onto
// the canvas and forwards them to a target (GameEngine implements this).
// Ported from legacy/strata-original.html's addEventListener calls.

export interface InputTarget {
  pointerDown(e: PointerEvent): void
  pointerMove(e: PointerEvent): void
  pointerUp(e: PointerEvent): void
  wheel(e: WheelEvent): void
  keyDown(e: KeyboardEvent): void
  keyUp(e: KeyboardEvent): void
  resize(): void
}

/** Returns a cleanup function that removes every listener it attached. */
export function attachInput(canvas: HTMLCanvasElement, target: InputTarget): () => void {
  const onContextMenu = (e: Event) => e.preventDefault()
  const onDown = (e: PointerEvent) => target.pointerDown(e)
  const onMove = (e: PointerEvent) => target.pointerMove(e)
  const onUp = (e: PointerEvent) => target.pointerUp(e)
  const onWheel = (e: WheelEvent) => target.wheel(e)
  const onKeyDown = (e: KeyboardEvent) => target.keyDown(e)
  const onKeyUp = (e: KeyboardEvent) => target.keyUp(e)
  const onResize = () => target.resize()

  canvas.addEventListener('contextmenu', onContextMenu)
  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerup', onUp)
  canvas.addEventListener('pointercancel', onUp)
  canvas.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('resize', onResize)

  return () => {
    canvas.removeEventListener('contextmenu', onContextMenu)
    canvas.removeEventListener('pointerdown', onDown)
    canvas.removeEventListener('pointermove', onMove)
    canvas.removeEventListener('pointerup', onUp)
    canvas.removeEventListener('pointercancel', onUp)
    canvas.removeEventListener('wheel', onWheel)
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('resize', onResize)
  }
}
