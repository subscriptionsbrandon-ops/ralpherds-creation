// Dig-site seed suggestions — ported from legacy/strata-original.html's
// suggestSeed(). (tradeCodeSuggest() lives in src/net/useTrade.ts, next to
// the trading code it's only used by.)
import { BIOMES } from '@/data/biomes'
import type { BiomeId } from '@/engine/types'

const SEED_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export function randomSeedSuffix(len: number): string {
  let s = ''
  for (let i = 0; i < len; i++) s += SEED_CHARS[(Math.random() * SEED_CHARS.length) | 0]
  return s
}

export function suggestSeed(biomeId: BiomeId): string {
  return BIOMES[biomeId].prefix + '-' + randomSeedSuffix(5)
}

export const TOUCH = typeof matchMedia !== 'undefined' && matchMedia('(pointer:coarse)').matches
