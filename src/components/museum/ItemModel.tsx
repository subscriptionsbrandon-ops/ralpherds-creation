// Renders one catalog item as a real 3D model inside a react-three-fiber
// <Canvas> — the category's sourced .glb (see src/data/models.ts),
// normalized to a consistent on-screen size and tinted toward the item's
// rarity color. Each mount gets its own cloned scene/materials so multiple
// instances of the same category model (e.g. two different Gems items)
// don't fight over shared material state.
import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { CATEGORY_MODELS } from '@/data/models'
import { RARITY } from '@/data/rarity'
import type { CategoryId, RarityId } from '@/engine/types'

export function ItemModel({ cat, rar }: { cat: CategoryId; rar: RarityId }) {
  const { url, scale, rotationY, rotationX = 0 } = CATEGORY_MODELS[cat]
  const { scene } = useGLTF(url)

  const { object, offset, factor } = useMemo(() => {
    const obj = scene.clone(true)

    // Some of these game-asset exports (MomusPark's rock props) bundle a
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

    const tintColor = new THREE.Color(RARITY[rar].c)
    const tintMaterial = (m: THREE.Material) => {
      const clone = m.clone()
      if ('color' in clone && clone.color instanceof THREE.Color) {
        // Light lerp toward the rarity color rather than a full replace —
        // keeps the source model's own texture/shading legible while still
        // giving the same rarity-coded cue the flat icons use.
        clone.color = clone.color.clone().lerp(tintColor, 0.35)
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
  }, [scene, rar, scale])

  return (
    <group rotation={[rotationX, rotationY, 0]}>
      <group scale={factor} position={[-offset.x * factor, -offset.y * factor, -offset.z * factor]}>
        <primitive object={object} />
      </group>
    </group>
  )
}
