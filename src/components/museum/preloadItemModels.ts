import { useGLTF } from '@react-three/drei'
import { CATEGORY_MODELS } from '@/data/models'

/** Warms the GLTF cache for the six category fallback models up front, so
 * inspecting any item that doesn't have its own override (see
 * src/data/models.ts ITEM_MODELS) doesn't pay the fetch+parse cost on
 * first click. Deliberately does NOT preload the ~20 per-item overrides —
 * those are each only needed for one or two specific items, so eagerly
 * fetching all of them on museum-open would cost several extra MB nobody
 * asked for yet; they fetch lazily via useGLTF's own suspense the first
 * time that specific item is actually inspected, then stay cached. */
export function preloadItemModels() {
  for (const { url } of Object.values(CATEGORY_MODELS)) useGLTF.preload(url)
}
