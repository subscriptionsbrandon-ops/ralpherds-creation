// Real, CC0-licensed 3D models used to render collectibles in the museum's
// inspect view (see src/components/museum). One representative model per
// category, tinted per-item by rarity color — the same "one shape family,
// recolored per item" pattern src/engine/sprites.ts already uses for the
// flat procedural icons, just with a sourced 3D asset standing in for the
// category instead of a canvas draw routine.
//
// All six files are CC0 1.0 Universal, converted to .glb by ToxSam from the
// archived Polygonal Mind open-source initiative:
// https://github.com/ToxSam/cc0-models-Polygonal-Mind (license text at
// .../main/License.md). Original packs: "Tomb Chaser 1" (Egyptian pyramid
// platformer assets) and "MomusPark" (park environment assets), plus one
// coin from "Medieval Fair" — all released CC0 by Polygonal Mind.
//
// Structures uses Tomb Chaser's carved Anubis head rather than MomusPark's
// "Statue_greek" models — despite the name, those turned out to be plain
// rectangular plinths with no figure (checked against their reference
// thumbnails before picking), a much weaker "best match" for this category.
import type { CategoryId } from '@/engine/types'
import fossilsUrl from '@/assets/models/fossils.glb?url'
import gemsUrl from '@/assets/models/gems.glb?url'
import mineralsUrl from '@/assets/models/minerals.glb?url'
import artifactsUrl from '@/assets/models/artifacts.glb?url'
import treasureUrl from '@/assets/models/treasure.glb?url'
import structuresUrl from '@/assets/models/structures.glb?url'

export interface CategoryModel {
  url: string
  /** Source file + credit, kept for reference even though CC0 needs none. */
  source: string
  /** Uniform scale applied after the model's own bounding box is normalized
   * to a unit cube — lets each asset's very different native scale/pivot
   * still frame consistently in the viewer. */
  scale: number
  /** Extra Y-axis rotation (radians) so the model's "front" faces the
   * camera at rest, since none of these were modeled for this use. */
  rotationY: number
  /** Extra X-axis tilt (radians) — mainly for flat objects like the coin,
   * which otherwise rest face-on to a Y-only spin and read as a 2D circle
   * until dragged. */
  rotationX?: number
}

export const CATEGORY_MODELS: Record<CategoryId, CategoryModel> = {
  Fossils: { url: fossilsUrl, source: 'MomusPark/Rock_02_Art.glb', scale: 1.1, rotationY: 0.4 },
  Gems: { url: gemsUrl, source: 'tomb-chaser-1/Gem01_Art.glb', scale: 1.3, rotationY: 0 },
  Minerals: { url: mineralsUrl, source: 'MomusPark/Rock_04_Art.glb', scale: 1.1, rotationY: 0.4 },
  Artifacts: { url: artifactsUrl, source: 'tomb-chaser-1/Jar01_Art.glb', scale: 1.0, rotationY: 0 },
  Treasure: { url: treasureUrl, source: 'medieval-fair/Coin_PolygonalMind.glb', scale: 1.3, rotationY: 0.3, rotationX: 0.5 },
  Structures: { url: structuresUrl, source: 'tomb-chaser-1/GodAnubis_Art.glb', scale: 1.1, rotationY: 0.5 },
}
