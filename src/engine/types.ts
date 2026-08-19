// Shared types for the engine/data layers. Mirrors the shapes used
// implicitly (via object literals) in legacy/strata-original.html.

export type RarityId = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'

export type CategoryId = 'Fossils' | 'Gems' | 'Minerals' | 'Artifacts' | 'Treasure' | 'Structures'

export type BiomeId = 'beach' | 'desert' | 'mountain' | 'volcano' | 'tundra' | 'crystal'

export type ToolId = 'brush' | 'trowel' | 'shovel' | 'pick' | 'hammer'

export type DrawId =
  | 'ammonite'
  | 'trilobite'
  | 'tooth'
  | 'claw'
  | 'vertebra'
  | 'fish'
  | 'amber'
  | 'tusk'
  | 'gem'
  | 'crystals'
  | 'nugget'
  | 'obsidian'
  | 'meteor'
  | 'coin'
  | 'shard'
  | 'amphora'
  | 'ring'
  | 'amulet'
  | 'mask'
  | 'axe'
  | 'idol'
  | 'pearl'
  | 'geode'
  | 'chest'
  | 'ship'
  | 'statue'
  | 'temple'
  | 'dino'
  | 'mammoth'

export interface DrawOpts {
  c?: [string, string]
}

export interface ItemDef {
  id: string
  name: string
  cat: CategoryId
  rar: RarityId
  draw: DrawId
  w: number
  h: number
  opts: DrawOpts | null
  rec: number
  large: boolean
  val: number
  xp: number
}

export interface TerrainLayer {
  c: [number, number, number]
  v: number
  h: number
  name?: string
}

export interface Biome {
  id: BiomeId
  n: string
  unlock: number
  diff: number
  prefix: string
  water?: boolean
  accent: string
  tag: string
  css: string
  cols: [string, string]
  layers: TerrainLayer[]
  decor: [string, number][]
  items: [string, number][]
  large: string[]
}

export interface ToolDef {
  n: string
  r: number
  soft: number
  rock: number
  cost: number
  icon: string
  min: number
}

export type UiMode = 'menu' | 'play' | 'summary' | 'museum' | 'trade'
