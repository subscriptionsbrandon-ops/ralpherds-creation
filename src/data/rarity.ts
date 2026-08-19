import type { RarityId } from '@/engine/types'

export const RARITY: Record<RarityId, { n: string; c: string }> = {
  common: { n: 'Common', c: '#9aa3a8' },
  uncommon: { n: 'Uncommon', c: '#6cc36c' },
  rare: { n: 'Rare', c: '#5b9fe8' },
  epic: { n: 'Epic', c: '#b06ce8' },
  legendary: { n: 'Legendary', c: '#e8a13c' },
  mythic: { n: 'Mythic', c: '#e85c8a' },
}
