import type { TerrainType, UnitClassDef, UnitClassType } from '../types/game';

export const UNIT_CLASSES: Record<UnitClassType, UnitClassDef> = {
  // 보병계
  infantry_light: {
    id: 'infantry_light',
    name: '단병',
    category: 'infantry',
    movement: 4,
    attackRangeMin: 1,
    attackRangeMax: 1,
    canCounterAttack: true,
    promotionTo: 'infantry_heavy',
    promotionLevel: 15,
    promotionItem: 'manual_sword',
    color: '#3b82f6',
    terrainCosts: {
      plain: 1, grass: 1, forest: 2, mountain: 3, wasteland: 2,
      river: 4, bridge: 1, swamp: 3, castle: 1, wall: -1, gate: 1,
      village: 1, barracks: 1, treasure: 1
    }
  },
  infantry_heavy: {
    id: 'infantry_heavy',
    name: '장병',
    category: 'infantry',
    movement: 4,
    attackRangeMin: 1,
    attackRangeMax: 1,
    canCounterAttack: true,
    promotionTo: 'infantry_guard',
    promotionLevel: 30,
    promotionItem: 'manual_sword',
    color: '#2563eb',
    terrainCosts: {
      plain: 1, grass: 1, forest: 2, mountain: 3, wasteland: 2,
      river: 4, bridge: 1, swamp: 3, castle: 1, wall: -1, gate: 1,
      village: 1, barracks: 1, treasure: 1
    }
  },
  infantry_guard: {
    id: 'infantry_guard',
    name: '근위병',
    category: 'infantry',
    movement: 5,
    attackRangeMin: 1,
    attackRangeMax: 1,
    canCounterAttack: true,
    color: '#1d4ed8',
    terrainCosts: {
      plain: 1, grass: 1, forest: 2, mountain: 2, wasteland: 2,
      river: 3, bridge: 1, swamp: 2, castle: 1, wall: -1, gate: 1,
      village: 1, barracks: 1, treasure: 1
    }
  },

  // 기병계
  cavalry_light: {
    id: 'cavalry_light',
    name: '경기병',
    category: 'cavalry',
    movement: 6,
    attackRangeMin: 1,
    attackRangeMax: 1,
    canCounterAttack: true,
    promotionTo: 'cavalry_heavy',
    promotionLevel: 15,
    promotionItem: 'manual_horse',
    color: '#ef4444',
    terrainCosts: {
      plain: 1, grass: 1, forest: 3, mountain: -1, wasteland: 2,
      river: -1, bridge: 1, swamp: 4, castle: 2, wall: -1, gate: 1,
      village: 1, barracks: 1, treasure: 1
    }
  },
  cavalry_heavy: {
    id: 'cavalry_heavy',
    name: '중기병',
    category: 'cavalry',
    movement: 6,
    attackRangeMin: 1,
    attackRangeMax: 1,
    canCounterAttack: true,
    promotionTo: 'cavalry_elite',
    promotionLevel: 30,
    promotionItem: 'manual_horse',
    color: '#dc2626',
    terrainCosts: {
      plain: 1, grass: 1, forest: 3, mountain: -1, wasteland: 2,
      river: -1, bridge: 1, swamp: 4, castle: 2, wall: -1, gate: 1,
      village: 1, barracks: 1, treasure: 1
    }
  },
  cavalry_elite: {
    id: 'cavalry_elite',
    name: '친위대',
    category: 'cavalry',
    movement: 7,
    attackRangeMin: 1,
    attackRangeMax: 1,
    canCounterAttack: true,
    color: '#b91c1c',
    terrainCosts: {
      plain: 1, grass: 1, forest: 2, mountain: -1, wasteland: 2,
      river: -1, bridge: 1, swamp: 3, castle: 1, wall: -1, gate: 1,
      village: 1, barracks: 1, treasure: 1
    }
  },

  // 궁병계
  archer_short: {
    id: 'archer_short',
    name: '궁병',
    category: 'archer',
    movement: 4,
    attackRangeMin: 1,
    attackRangeMax: 2,
    canCounterAttack: true,
    promotionTo: 'archer_repeater',
    promotionLevel: 15,
    promotionItem: 'manual_bow',
    color: '#10b981',
    terrainCosts: {
      plain: 1, grass: 1, forest: 2, mountain: 3, wasteland: 2,
      river: 4, bridge: 1, swamp: 3, castle: 1, wall: -1, gate: 1,
      village: 1, barracks: 1, treasure: 1
    }
  },
  archer_repeater: {
    id: 'archer_repeater',
    name: '연노병',
    category: 'archer',
    movement: 4,
    attackRangeMin: 1,
    attackRangeMax: 2,
    canCounterAttack: true,
    promotionTo: 'archer_catapult',
    promotionLevel: 30,
    promotionItem: 'manual_bow',
    color: '#059669',
    terrainCosts: {
      plain: 1, grass: 1, forest: 2, mountain: 3, wasteland: 2,
      river: 4, bridge: 1, swamp: 3, castle: 1, wall: -1, gate: 1,
      village: 1, barracks: 1, treasure: 1
    }
  },
  archer_catapult: {
    id: 'archer_catapult',
    name: '발석차',
    category: 'archer',
    movement: 4,
    attackRangeMin: 2,
    attackRangeMax: 3,
    canCounterAttack: false,
    color: '#047857',
    terrainCosts: {
      plain: 1, grass: 1, forest: 3, mountain: -1, wasteland: 3,
      river: -1, bridge: 1, swamp: 4, castle: 2, wall: -1, gate: 1,
      village: 1, barracks: 1, treasure: 1
    }
  },

  // 적병계
  bandit_scout: {
    id: 'bandit_scout',
    name: '산적',
    category: 'bandit',
    movement: 4,
    attackRangeMin: 1,
    attackRangeMax: 1,
    canCounterAttack: true,
    promotionTo: 'bandit_raider',
    promotionLevel: 15,
    color: '#d97706',
    terrainCosts: {
      plain: 1, grass: 1, forest: 1, mountain: 1, wasteland: 1,
      river: 3, bridge: 1, swamp: 2, castle: 2, wall: -1, gate: 1,
      village: 1, barracks: 1, treasure: 1
    }
  },
  bandit_raider: {
    id: 'bandit_raider',
    name: '흉도',
    category: 'bandit',
    movement: 5,
    attackRangeMin: 1,
    attackRangeMax: 1,
    canCounterAttack: true,
    promotionTo: 'bandit_chivalric',
    promotionLevel: 30,
    color: '#b45309',
    terrainCosts: {
      plain: 1, grass: 1, forest: 1, mountain: 1, wasteland: 1,
      river: 3, bridge: 1, swamp: 2, castle: 2, wall: -1, gate: 1,
      village: 1, barracks: 1, treasure: 1
    }
  },
  bandit_chivalric: {
    id: 'bandit_chivalric',
    name: '의적',
    category: 'bandit',
    movement: 5,
    attackRangeMin: 1,
    attackRangeMax: 1,
    canCounterAttack: true,
    color: '#92400e',
    terrainCosts: {
      plain: 1, grass: 1, forest: 1, mountain: 1, wasteland: 1,
      river: 2, bridge: 1, swamp: 2, castle: 1, wall: -1, gate: 1,
      village: 1, barracks: 1, treasure: 1
    }
  },

  // 무도가계
  martial_artist: {
    id: 'martial_artist',
    name: '무도가',
    category: 'martial',
    movement: 5,
    attackRangeMin: 1,
    attackRangeMax: 1,
    canCounterAttack: true,
    promotionTo: 'martial_master',
    promotionLevel: 25,
    color: '#8b5cf6',
    terrainCosts: {
      plain: 1, grass: 1, forest: 1, mountain: 2, wasteland: 2,
      river: 3, bridge: 1, swamp: 2, castle: 1, wall: -1, gate: 1,
      village: 1, barracks: 1, treasure: 1
    }
  },
  martial_master: {
    id: 'martial_master',
    name: '권사',
    category: 'martial',
    movement: 5,
    attackRangeMin: 1,
    attackRangeMax: 1,
    canCounterAttack: true,
    color: '#7c3aed',
    terrainCosts: {
      plain: 1, grass: 1, forest: 1, mountain: 2, wasteland: 2,
      river: 3, bridge: 1, swamp: 2, castle: 1, wall: -1, gate: 1,
      village: 1, barracks: 1, treasure: 1
    }
  },

  // 특수계
  military_band: {
    id: 'military_band',
    name: '군악대',
    category: 'special',
    movement: 4,
    attackRangeMin: 1,
    attackRangeMax: 1,
    canCounterAttack: false,
    color: '#ec4899',
    terrainCosts: {
      plain: 1, grass: 1, forest: 2, mountain: 3, wasteland: 2,
      river: 4, bridge: 1, swamp: 3, castle: 1, wall: -1, gate: 1,
      village: 1, barracks: 1, treasure: 1
    }
  },
  supply_wagon: {
    id: 'supply_wagon',
    name: '수송대',
    category: 'special',
    movement: 4,
    attackRangeMin: 1,
    attackRangeMax: 1,
    canCounterAttack: false,
    color: '#06b6d4',
    terrainCosts: {
      plain: 1, grass: 1, forest: 2, mountain: 3, wasteland: 2,
      river: 4, bridge: 1, swamp: 3, castle: 1, wall: -1, gate: 1,
      village: 1, barracks: 1, treasure: 1
    }
  },
  sorcerer_apprentice: {
    id: 'sorcerer_apprentice',
    name: '요술사',
    category: 'special',
    movement: 4,
    attackRangeMin: 1,
    attackRangeMax: 1,
    canCounterAttack: false,
    promotionTo: 'sorcerer_master',
    promotionLevel: 20,
    color: '#6366f1',
    terrainCosts: {
      plain: 1, grass: 1, forest: 2, mountain: 2, wasteland: 2,
      river: 4, bridge: 1, swamp: 2, castle: 1, wall: -1, gate: 1,
      village: 1, barracks: 1, treasure: 1
    }
  },
  sorcerer_master: {
    id: 'sorcerer_master',
    name: '주술사',
    category: 'special',
    movement: 4,
    attackRangeMin: 1,
    attackRangeMax: 1,
    canCounterAttack: false,
    color: '#4f46e5',
    terrainCosts: {
      plain: 1, grass: 1, forest: 1, mountain: 2, wasteland: 2,
      river: 3, bridge: 1, swamp: 2, castle: 1, wall: -1, gate: 1,
      village: 1, barracks: 1, treasure: 1
    }
  },
  tribal_warrior: {
    id: 'tribal_warrior',
    name: '이민족',
    category: 'bandit',
    movement: 5,
    attackRangeMin: 1,
    attackRangeMax: 1,
    canCounterAttack: true,
    color: '#854d0e',
    terrainCosts: {
      plain: 1, grass: 1, forest: 1, mountain: 1, wasteland: 1,
      river: 2, bridge: 1, swamp: 2, castle: 2, wall: -1, gate: 1,
      village: 1, barracks: 1, treasure: 1
    }
  }
};

export const TERRAINS: Record<TerrainType, { name: string; defenseMod: number; healPerTurn: number; color: string; desc: string }> = {
  plain: { name: '평지', defenseMod: 1.0, healPerTurn: 0, color: '#7cb342', desc: '이동이 자유로운 일반 평야' },
  grass: { name: '초원', defenseMod: 1.0, healPerTurn: 0, color: '#689f38', desc: '푸른 잔디가 우거진 풀밭' },
  forest: { name: '숲', defenseMod: 1.2, healPerTurn: 0, color: '#2e7d32', desc: '수풀이 우거져 방어력 상승, 화계 취약' },
  mountain: { name: '산', defenseMod: 1.3, healPerTurn: 0, color: '#8d6e63', desc: '험준한 산악, 낙석 책략 가능' },
  river: { name: '강', defenseMod: 0.8, healPerTurn: 0, color: '#0288d1', desc: '물살이 세며 수계 책략 가능' },
  bridge: { name: '다리', defenseMod: 1.0, healPerTurn: 0, color: '#a1887f', desc: '강을 건널 수 있는 길목' },
  swamp: { name: '습지', defenseMod: 0.9, healPerTurn: 0, color: '#558b2f', desc: '발이 빠지는 늪지대' },
  wasteland: { name: '황무지', defenseMod: 1.0, healPerTurn: 0, color: '#bcaaa4', desc: '척박한 흙먼지 벌판' },
  castle: { name: '성내', defenseMod: 1.3, healPerTurn: 0.1, color: '#78909c', desc: '성곽 내부, 턴마다 10% 병력 회복' },
  wall: { name: '성벽', defenseMod: 1.5, healPerTurn: 0, color: '#455a64', desc: '높은 성벽' },
  gate: { name: '관문', defenseMod: 1.4, healPerTurn: 0.1, color: '#5c6bc0', desc: '견고한 요충지 성문' },
  village: { name: '마을', defenseMod: 1.2, healPerTurn: 0.15, color: '#f59e0b', desc: '민가, 턴마다 15% 병력 회복' },
  barracks: { name: '병영', defenseMod: 1.3, healPerTurn: 0.2, color: '#e11d48', desc: '군사 주둔소, 턴마다 20% 병력 회복' },
  treasure: { name: '보물', defenseMod: 1.0, healPerTurn: 0, color: '#eab308', desc: '희귀 보물이 숨겨진 창고' }
};
