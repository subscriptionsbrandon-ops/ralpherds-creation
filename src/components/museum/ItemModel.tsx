// Renders one catalog item as a real 3D model inside a react-three-fiber
// <Canvas> — the item's sourced .glb (see src/data/models.ts, which picks a
// specific model per item where a good real match exists, falling back to
// one shared model per category otherwise), normalized to a consistent
// on-screen size and tinted toward the item's own color (or its rarity
// color, for items with no defined color of their own). Each mount gets its
// own cloned scene/materials so multiple instances of the same underlying
// model (e.g. two Minerals items sharing a fallback rock) don't fight over
// shared material state.
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { getModelForItem, getTint } from '@/data/models'
import type { ItemDef } from '@/engine/types'

export function ItemModel({ def }: { def: ItemDef }) {
  const { url, scale, rotationY = 0, rotationX = 0 } = getModelForItem(def)
  const { color: tint, strength: tintStrength } = getTint(def)
  const { scene } = useGLTF(url)

  const { object, offset, factor } = useMemo(() => {
    const obj = scene.clone(true)

    // Some of these game-asset exports (rock props in particular) bundle a
    // separate invisible physics-collision mesh alongside the real one —
    // e.g. a node literally named "Rock_04_collider" sitting right next to
    // "Rock_04_Art". Rendering it too looks like the model shattered into a
    // second floating chunk, since it's a rough, differently-shaped proxy
    // never meant to be seen. Strip anything named like a collider before
    // it's tinted or counted toward the model's bounding box.
    const colliders: THREE.Object3D[] = []
    obj.traverse((child) => {
      if (/collider|collision/i.test(child.name)) colliders.push(child)
    })
    colliders.forEach((node) => node.parent?.remove(node))

    const tintColor = new THREE.Color(tint)
    const tintMaterial = (m: THREE.Material) => {
      const clone = m.clone()
      if ('color' in clone && clone.color instanceof THREE.Color) {
        // Lerp toward the target color rather than a full replace — keeps
        // the source model's own texture/shading legible while still
        // giving each item a correct, recognizable color identity.
        clone.color = clone.color.clone().lerp(tintColor, tintStrength)
      }
      // `color` is a multiplier over the material's texture map — on a
      // model with a dark baked-in texture (e.g. the ring/idol busts,
      // both quite dark natively), multiplying by an even-brighter color
      // still can't lift it past that texture's own dark pixels, so a
      // color-only tint reads as barely-changed no matter how strong.
      // Adding a touch of emissive glow actually adds light instead of
      // just multiplying it, which is the only way to visibly warm up a
      // model that's dark to begin with. Scaled by tintStrength so this
      // stays subtle for the plain rarity-fallback case (where the model's
      // own look should stay dominant) and only meaningful for items with
      // a real intended color to show.
      if ('emissive' in clone && clone.emissive instanceof THREE.Color) {
        clone.emissive = tintColor.clone().multiplyScalar(tintStrength * 0.35)
      }
      return clone
    }
    obj.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
      // A material array (vs. a single material) is only valid on a mesh
      // whose geometry defines matching `.groups` — reassigning a plain
      // single material as a one-element array here would silently make
      // three.js render nothing for meshes without groups, which is most
      // of these (single-material, no multi-group Blender export).
      child.material = Array.isArray(child.material) ? child.material.map(tintMaterial) : tintMaterial(child.material)
    })

    const box = new THREE.Box3().setFromObject(obj)
    const size = new THREE.Vector3()
    box.getSize(size)
    const center = new THREE.Vector3()
    box.getCenter(center)
    const maxDim = Math.max(size.x, size.y, size.z) || 1

    return { object: obj, offset: center, factor: (1 / maxDim) * scale }
  }, [scene, tint, tintStrength, scale])

  return (
    <group rotation={[rotationX, rotationY, 0]}>
      <group scale={factor} position={[-offset.x * factor, -offset.y * factor, -offset.z * factor]}>
        <primitive object={object} />
      </group>
    </group>
  )
}
