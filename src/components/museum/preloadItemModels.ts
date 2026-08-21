import { useGLTF } from '@react-three/drei'
import { CATEGORY_MODELS } from '@/data/models'

/** Warms the GLTF cache for every category up front so the first inspect
 * click doesn't pay the fetch+parse cost — these are small (150KB-650KB)
 * and only loaded once total regardless of how many items share a category. */
export function preloadItemModels() {
  for (const { url } of Object.values(CATEGORY_MODELS)) useGLTF.preload(url)
}
