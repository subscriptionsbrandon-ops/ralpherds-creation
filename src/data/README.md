# data/

Static config, framework-agnostic. Ported near-verbatim from
`legacy/strata-original.html`:

- `rarity.ts` — the `RARITY` table (common → mythic: name + color)
- `catalog.ts` — the `CATALOG`/`def()` item table (id, name, category, rarity,
  value, xp, size) — sprite `draw`/`opts` fields drop out once real assets
  land (see `assets/itemSprites.ts`), replaced by an image-path lookup
- `biomes.ts` — the `BIOMES` table (dig sites: terrain layers, decor, item
  drop tables, unlockable large finds)
- `tools.ts` — the `TOOLS` table (brush/trowel/shovel/pick/hammer stats)
