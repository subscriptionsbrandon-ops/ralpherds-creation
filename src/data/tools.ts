import type { ToolDef, ToolId } from '@/engine/types'

export const TOOLS: Record<ToolId, ToolDef> = {
  brush: { n: 'Brush', r: 13, soft: 0.55, rock: 0.15, cost: 0.4, icon: '🖌', min: 1 },
  trowel: { n: 'Trowel', r: 22, soft: 1, rock: 0.3, cost: 0.8, icon: '🛠', min: 1 },
  shovel: { n: 'Shovel', r: 38, soft: 1.8, rock: 0.12, cost: 1.4, icon: '⚒', min: 1 },
  pick: { n: 'Pickaxe', r: 20, soft: 0.7, rock: 1.6, cost: 1.4, icon: '⛏', min: 1 },
  hammer: { n: 'Geo Hammer', r: 26, soft: 0.6, rock: 2.6, cost: 2, icon: '🔨', min: 1 },
}

export const TOOL_ORDER: ToolId[] = ['brush', 'trowel', 'shovel', 'pick', 'hammer']
