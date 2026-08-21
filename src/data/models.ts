// Real, CC0-licensed 3D models used to render collectibles in the museum's
// inspect view (see src/components/museum). Most items now point at their
// own specific model rather than sharing one shape per category — e.g. each
// gem/crystal item gets a different real crystal shape — falling back to a
// single representative model per category (CATEGORY_MODELS) only where no
// closer real-world match was available among what's actually sourceable
// here (see the network-access note below).
//
// All files are CC0 1.0 Universal, converted to .glb by ToxSam from the
// archived Polygonal Mind open-source initiative:
// https://github.com/ToxSam/cc0-models-Polygonal-Mind (license text at
// .../main/License.md). This sandbox can only reach raw.githubusercontent.com
// and api.github.com — not Kenney.nl, Poly Pizza, Sketchfab, or OpenGameArt
// directly — so "real assets from available libraries" means CC0 packs
// mirrored in a GitHub repo like this one, not the wider asset-site catalog.
// Every candidate here was checked against its own reference thumbnail
// before being picked (see git history: an earlier pick named
// "Statue_greek" turned out to be a plain plinth despite the name).
import type { ItemDef } from '@/engine/types'
import { RARITY } from '@/data/rarity'

// ---- category fallbacks --------------------------------------------------
import fossilsUrl from '@/assets/models/fossils.glb?url'
import gemsUrl from '@/assets/models/gems.glb?url'
import mineralsUrl from '@/assets/models/minerals.glb?url'
import artifactsUrl from '@/assets/models/artifacts.glb?url'
import treasureUrl from '@/assets/models/treasure.glb?url'
import structuresUrl from '@/assets/models/structures.glb?url'

// ---- per-item overrides ---------------------------------------------------
import gemCrystalSmall1 from '@/assets/models/items/gem-crystal-small-1.glb?url'
import gemCrystalSmall2 from '@/assets/models/items/gem-crystal-small-2.glb?url'
import gemCrystalSmall3 from '@/assets/models/items/gem-crystal-small-3.glb?url'
import gemCrystalSmall4 from '@/assets/models/items/gem-crystal-small-4.glb?url'
import gemCrystalBase from '@/assets/models/items/gem-crystal-base.glb?url'
import gemCrystalCluster from '@/assets/models/items/gem-crystal-cluster.glb?url'
import gemCrystalClusterSurrounded from '@/assets/models/items/gem-crystal-cluster-surrounded.glb?url'
import gem2 from '@/assets/models/items/gem-2.glb?url'
import gem3 from '@/assets/models/items/gem-3.glb?url'
import mineralRockCa1 from '@/assets/models/items/mineral-rock-ca1.glb?url'
import mineralRockCa2 from '@/assets/models/items/mineral-rock-ca2.glb?url'
import mineralRockCa3 from '@/assets/models/items/mineral-rock-ca3.glb?url'
import mineralRockLunar1 from '@/assets/models/items/mineral-rock-lunar1.glb?url'
import mineralRockLunar2 from '@/assets/models/items/mineral-rock-lunar2.glb?url'
import mineralRockMomus1 from '@/assets/models/items/mineral-rock-momus1.glb?url'
import fossilShell from '@/assets/models/items/fossil-shell.glb?url'
import artifactJar2 from '@/assets/models/items/artifact-jar2.glb?url'
import treasureRing from '@/assets/models/items/treasure-ring.glb?url'
import treasureCoinpile from '@/assets/models/items/treasure-coinpile.glb?url'
import structureObelisk from '@/assets/models/items/structure-obelisk.glb?url'
import structureGodbastet from '@/assets/models/items/structure-godbastet.glb?url'

export interface CategoryModel {
  url: string
  /** Source file, kept for reference even though CC0 needs no credit. */
  source: string
  /** Uniform scale applied after the model's own bounding box is normalized
   * to a unit cube — lets each asset's very different native scale/pivot
   * still frame consistently in the viewer. */
  scale: number
  /** Extra Y-axis rotation (radians) so the model's "front" faces the
   * camera at rest, since none of these were modeled for this use.
   * Defaults to 0. */
  rotationY?: number
  /** Extra X-axis tilt (radians) — mainly for flat/elongated objects (a
   * coin, a crystal shard) that otherwise rest face-on or edge-on to a
   * Y-only spin and don't read as 3D until dragged. */
  rotationX?: number
}

export const CATEGORY_MODELS: Record<ItemDef['cat'], CategoryModel> = {
  Fossils: { url: fossilsUrl, source: 'MomusPark/Rock_02_Art.glb', scale: 1.1, rotationY: 0.4 },
  Gems: { url: gemsUrl, source: 'tomb-chaser-1/Gem01_Art.glb', scale: 1.3, rotationY: 0 },
  Minerals: { url: mineralsUrl, source: 'MomusPark/Rock_04_Art.glb', scale: 1.1, rotationY: 0.4 },
  Artifacts: { url: artifactsUrl, source: 'tomb-chaser-1/Jar01_Art.glb', scale: 1.0, rotationY: 0 },
  Treasure: { url: treasureUrl, source: 'medieval-fair/Coin_PolygonalMind.glb', scale: 1.3, rotationY: 0.3, rotationX: 0.5 },
  Structures: { url: structuresUrl, source: 'tomb-chaser-1/GodAnubis_Art.glb', scale: 1.1, rotationY: 0.5 },
}

/** Per-item overrides, keyed by catalog item id (see src/data/catalog.ts).
 * Items not listed here render with their category's default model. */
export const ITEM_MODELS: Partial<Record<string, CategoryModel>> = {
  // Gems — a distinct real crystal/gem shape per item instead of one
  // faceted gem recolored nine ways.
  quartz: { url: gemCrystalSmall1, source: 'crystal-crossroads/Crystal_Small_01.glb', scale: 1.3, rotationX: 0.3 },
  amethyst: { url: gemCrystalSmall2, source: 'crystal-crossroads/Crystal_Small_02.glb', scale: 1.3, rotationX: 0.3 },
  topaz: { url: gemCrystalSmall3, source: 'crystal-crossroads/Crystal_Small_03.glb', scale: 1.3, rotationX: 0.3 },
  diamond: { url: gemCrystalSmall4, source: 'crystal-crossroads/Crystal_Small_04.glb', scale: 1.3, rotationX: 0.3 },
  // Gem02_Art is natively green, Gem03_Art natively blue (checked via
  // thumbnail — the tomb-chaser set isn't neutral/tintable, each one is
  // already a specific colored gem), hence sapphire <- 3 and emerald <- 2.
  sapphire: { url: gem3, source: 'tomb-chaser-1/Gem03_Art.glb', scale: 1.3 },
  emerald: { url: gem2, source: 'tomb-chaser-1/Gem02_Art.glb', scale: 1.3 },
  opal: { url: gemCrystalBase, source: 'crystal-crossroads/Crystal_Base.glb', scale: 1.6 },
  fireopal: { url: gemCrystalCluster, source: 'crystal-crossroads/Crystal_Cluster.glb', scale: 1.2 },
  geode: { url: gemCrystalClusterSurrounded, source: 'crystal-crossroads/Crystal_ClusterSurrounded.glb', scale: 1.1 },
  crystalbed: { url: gemCrystalCluster, source: 'crystal-crossroads/Crystal_Cluster.glb', scale: 1.2, rotationY: 1.5 },

  // Minerals — a different rock per item instead of one shared chunk. The
  // ca-world "Rock" trio all share one very dark, teal-veined native
  // texture (checked via thumbnail) — great as-is for obsidian/meteorite,
  // but it fights a gold/silver tint rather than taking it. lunar-year's
  // rocks are plain neutral gray, so those go to the metals instead.
  pyrite: { url: mineralRockMomus1, source: 'MomusPark/Rock_01_Art.glb', scale: 1.0 },
  silver: { url: mineralRockLunar1, source: 'lunar-year/Rock01.glb', scale: 1.1 },
  gold: { url: mineralRockLunar2, source: 'lunar-year/Rock02.glb', scale: 1.1 },
  obsidianshard: { url: mineralRockCa1, source: 'ca-world/Rock_01.glb', scale: 1.1 },
  meteoriron: { url: mineralRockCa2, source: 'ca-world/Rock_02.glb', scale: 1.1 },
  meteorite: { url: mineralRockCa3, source: 'ca-world/Rock_03.glb', scale: 1.2, rotationY: 2 },

  // Fossils — a shell for the one item that has a real shell-shaped match;
  // the rest (no bone/tooth/tusk model was found in any reachable CC0
  // source) stay on the category's rock fallback.
  ammonite: { url: fossilShell, source: 'avatar-garden/Shell01.glb', scale: 1.4, rotationX: 0.6 },

  // Artifacts — the "coin" item gets the actual coin model (previously it
  // was rendering as a jar, since Artifacts' category default is pottery).
  coin: { url: treasureUrl, source: 'medieval-fair/Coin_PolygonalMind.glb', scale: 1.3, rotationY: 0.3, rotationX: 0.5 },
  amphora: { url: artifactJar2, source: 'tomb-chaser-1/Jar02_Art.glb', scale: 1.0 },

  // Treasure — a real ring for the ring, a coin pile for the chest (reads
  // more "treasure" than a single coin), a statue bust standing in for the
  // idol (an actual carved figure, unlike the flat coin/ring shapes).
  goldring: { url: treasureRing, source: 'towers/Colony_Ring_Art.glb', scale: 1.5, rotationX: 0.5 },
  chest: { url: treasureCoinpile, source: 'tomb-chaser-1/Coins_Art.glb', scale: 1.1 },
  idol: { url: structureGodbastet, source: 'tomb-chaser-1/GodBastet_Art.glb', scale: 1.1, rotationY: 0.5 },

  // Structures — Obelisk for the ruin item. "statue" and "ship" stay on
  // the category default (GodAnubis) — no real shipwreck model was found
  // anywhere reachable, and GodAnubis already fits "statue" directly.
  temple: { url: structureObelisk, source: 'tomb-chaser-1/Obelisk_Art.glb', scale: 1.1 },
}

export function getModelForItem(def: ItemDef): CategoryModel {
  return ITEM_MODELS[def.id] ?? CATEGORY_MODELS[def.cat]
}

export interface Tint {
  color: string
  /** How strongly to lerp the model's own material color toward `color`.
   * An item with a defined `opts.c` (ruby red, gold yellow, ...) needs a
   * strong pull to actually read as that color against whatever the
   * source model's native texture happens to be — several of these (e.g.
   * the tomb-chaser gem set) are already strongly, specifically colored
   * themselves, not neutral/tintable. A rarity-only fallback is a much
   * softer decorative cue on top of the model's own look, so it stays
   * light to keep that look legible. */
  strength: number
}

/** Prefer the item's own defined color (the same `opts.c[0]` the flat
 * procedural icon uses — e.g. ruby red, sapphire blue, gold yellow) over
 * the generic rarity color, so items that already have a real color
 * identity keep it in 3D instead of all going whatever color their rarity
 * happens to be. Items with no custom color (Fossils' bone/tooth/tusk
 * items, and a few Artifacts/Treasure/Structures) still fall back to the
 * rarity tint. */
export function getTint(def: ItemDef): Tint {
  const custom = def.opts?.c?.[0]
  return custom ? { color: custom, strength: 0.7 } : { color: RARITY[def.rar].c, strength: 0.4 }
}
