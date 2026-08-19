import type { CategoryId, DrawId, DrawOpts, ItemDef, RarityId } from '@/engine/types'

export const CATLIST: CategoryId[] = ['Fossils', 'Gems', 'Minerals', 'Artifacts', 'Treasure', 'Structures']

export const CATC: Record<CategoryId, string> = {
  Fossils: '#e8c860',
  Gems: '#b06ce8',
  Minerals: '#e8843c',
  Artifacts: '#5bc8e8',
  Treasure: '#f0d060',
  Structures: '#8fe86c',
}

export const CATHINT: Record<CategoryId, string> = {
  Fossils: 'ancient remains',
  Gems: 'something crystalline',
  Minerals: 'a metallic mass',
  Artifacts: 'something man-made',
  Treasure: 'something valuable',
  Structures: 'a large structure',
}

const VAL: Record<RarityId, number> = { common: 8, uncommon: 16, rare: 32, epic: 70, legendary: 150, mythic: 400 }
const XPV: Record<RarityId, number> = { common: 6, uncommon: 11, rare: 22, epic: 45, legendary: 90, mythic: 200 }

function def(
  id: string,
  name: string,
  cat: CategoryId,
  rar: RarityId,
  draw: DrawId,
  w: number,
  h: number,
  opts: DrawOpts | null = null,
  large = false,
): ItemDef {
  return {
    id,
    name,
    cat,
    rar,
    draw,
    w,
    h,
    opts,
    rec: large ? 0.66 : 0.8,
    large,
    val: Math.round(VAL[rar] * (large ? 2 : 1)),
    xp: Math.round(XPV[rar] * (large ? 2 : 1)),
  }
}

export const CATALOG: Record<string, ItemDef> = Object.fromEntries(
  [
    def('ammonite', 'Ammonite', 'Fossils', 'common', 'ammonite', 54, 54),
    def('trilobite', 'Trilobite', 'Fossils', 'uncommon', 'trilobite', 46, 58),
    def('sharktooth', 'Shark Tooth', 'Fossils', 'common', 'tooth', 36, 42),
    def('megtooth', 'Megalodon Tooth', 'Fossils', 'epic', 'tooth', 72, 84, { c: ['#c8bda0', '#5a4a34'] }),
    def('claw', 'Raptor Claw', 'Fossils', 'rare', 'claw', 44, 52),
    def('vertebra', 'Dino Vertebra', 'Fossils', 'uncommon', 'vertebra', 48, 48),
    def('fishfossil', 'Ancient Fish Fossil', 'Fossils', 'rare', 'fish', 72, 44),
    def('amber', 'Insect in Amber', 'Fossils', 'rare', 'amber', 40, 40),
    def('tusk', 'Mammoth Tusk', 'Fossils', 'epic', 'tusk', 86, 60),
    def('quartz', 'Quartz', 'Gems', 'common', 'gem', 38, 38, { c: ['#f0f0f5', '#b8b8c8'] }),
    def('amethyst', 'Amethyst', 'Gems', 'uncommon', 'gem', 40, 40, { c: ['#d8b8f5', '#7a3fc0'] }),
    def('topaz', 'Topaz', 'Gems', 'uncommon', 'gem', 38, 38, { c: ['#f5d890', '#c08828'] }),
    def('ruby', 'Ruby', 'Gems', 'rare', 'gem', 36, 36, { c: ['#f58890', '#a01828'] }),
    def('sapphire', 'Sapphire', 'Gems', 'rare', 'gem', 36, 36, { c: ['#88a8f5', '#1838a0'] }),
    def('emerald', 'Emerald', 'Gems', 'epic', 'gem', 36, 36, { c: ['#88e8a8', '#187840'] }),
    def('opal', 'Opal', 'Gems', 'epic', 'gem', 38, 38, { c: ['#e8f0f5', '#88b8c0'] }),
    def('diamond', 'Diamond', 'Gems', 'legendary', 'gem', 34, 34, { c: ['#ffffff', '#a8c8e0'] }),
    def('fireopal', 'Fire Opal', 'Gems', 'legendary', 'gem', 36, 36, { c: ['#f5c060', '#d04818'] }),
    def('copper', 'Copper Ore', 'Minerals', 'common', 'nugget', 44, 40, { c: ['#d08850', '#7a4820'] }),
    def('pyrite', 'Pyrite', 'Minerals', 'common', 'nugget', 42, 38, { c: ['#e8d070', '#8a7020'] }),
    def('silver', 'Silver Nugget', 'Minerals', 'uncommon', 'nugget', 42, 38, { c: ['#e0e0e8', '#787888'] }),
    def('gold', 'Gold Nugget', 'Minerals', 'rare', 'nugget', 42, 38, { c: ['#f5d860', '#a07818'] }),
    def('obsidianshard', 'Obsidian', 'Minerals', 'uncommon', 'obsidian', 44, 52),
    def('meteoriron', 'Meteorite Iron', 'Minerals', 'epic', 'meteor', 48, 46),
    def('coin', 'Ancient Coin', 'Artifacts', 'common', 'coin', 32, 32),
    def('potshard', 'Pottery Shard', 'Artifacts', 'common', 'shard', 44, 42),
    def('amphora', 'Amphora', 'Artifacts', 'rare', 'amphora', 52, 74),
    def('axe', 'Stone Axe Head', 'Artifacts', 'uncommon', 'axe', 50, 44),
    def('mask', 'Ceremonial Mask', 'Artifacts', 'epic', 'mask', 54, 66),
    def('goldring', 'Gold Ring', 'Treasure', 'rare', 'ring', 36, 40),
    def('amulet', 'Jade Amulet', 'Treasure', 'epic', 'amulet', 40, 52),
    def('pearl', 'Pearl', 'Treasure', 'rare', 'pearl', 30, 30),
    def('idol', 'Golden Idol', 'Treasure', 'mythic', 'idol', 48, 66),
    def('geode', 'Giant Geode', 'Gems', 'epic', 'geode', 110, 110, null, true),
    def('chest', 'Sunken Treasure Chest', 'Treasure', 'legendary', 'chest', 150, 120, null, true),
    def('ship', 'Shipwreck Section', 'Structures', 'epic', 'ship', 340, 240, null, true),
    def('statue', 'Buried Statue', 'Structures', 'legendary', 'statue', 180, 260, null, true),
    def('temple', 'Temple Foundation', 'Structures', 'epic', 'temple', 320, 280, null, true),
    def('dino', 'Dinosaur Skeleton', 'Fossils', 'legendary', 'dino', 420, 260, null, true),
    def('mammoth', 'Mammoth Skull', 'Fossils', 'legendary', 'mammoth', 220, 240, null, true),
    def('meteorite', 'Massive Meteorite', 'Minerals', 'mythic', 'meteor', 200, 190, null, true),
    def('crystalbed', 'Crystal Formation', 'Gems', 'epic', 'crystals', 260, 180, null, true),
  ].map((d) => [d.id, d]),
)
