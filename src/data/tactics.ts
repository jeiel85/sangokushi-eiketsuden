import type { TacticDef } from '../types/game';

export const TACTICS: Record<string, TacticDef> = {
  // 화계
  pyro_1: {
    id: 'pyro_1',
    name: '초열',
    category: 'fire',
    mpCost: 4,
    range: 2,
    area: 'single',
    power: 50,
    description: '적 1부대에 화공을 가해 불길 피해를 입힌다 (평지/숲/초원)',
    allowedTerrains: ['plain', 'grass', 'forest', 'wasteland'],
    effectType: 'damage'
  },
  pyro_2: {
    id: 'pyro_2',
    name: '화룡',
    category: 'fire',
    mpCost: 8,
    range: 3,
    area: 'cross',
    power: 90,
    description: '화룡을 불러 십자 범위 적 부대에 큰 화염 피해를 준다',
    allowedTerrains: ['plain', 'grass', 'forest', 'wasteland'],
    effectType: 'damage'
  },
  pyro_3: {
    id: 'pyro_3',
    name: '대초열',
    category: 'fire',
    mpCost: 14,
    range: 3,
    area: 'diamond',
    power: 150,
    description: '맹렬한 업화로 광범위의 적 부대를 일격에 불태운다',
    allowedTerrains: ['plain', 'grass', 'forest', 'wasteland'],
    effectType: 'damage'
  },

  // 수계
  water_1: {
    id: 'water_1',
    name: '탁류',
    category: 'water',
    mpCost: 4,
    range: 2,
    area: 'single',
    power: 60,
    description: '탁한 급류를 일으켜 적에게 피해를 준다 (강/습지)',
    allowedTerrains: ['river', 'swamp', 'bridge'],
    effectType: 'damage'
  },
  water_2: {
    id: 'water_2',
    name: '해일',
    category: 'water',
    mpCost: 9,
    range: 3,
    area: 'cross',
    power: 100,
    description: '성난 파도로 십자 범위 적 부대를 휩쓴다',
    allowedTerrains: ['river', 'swamp', 'bridge'],
    effectType: 'damage'
  },
  water_3: {
    id: 'water_3',
    name: '대해일',
    category: 'water',
    mpCost: 16,
    range: 3,
    area: 'diamond',
    power: 160,
    description: '거대한 수마로 광범위 적군을 쓸어버린다',
    allowedTerrains: ['river', 'swamp', 'bridge'],
    effectType: 'damage'
  },

  // 낙석계
  rock_1: {
    id: 'rock_1',
    name: '암석',
    category: 'rock',
    mpCost: 4,
    range: 2,
    area: 'single',
    power: 55,
    description: '바위를 굴려 적에게 타격을 가한다 (산/황무지/성벽)',
    allowedTerrains: ['mountain', 'wasteland', 'wall', 'gate'],
    effectType: 'damage'
  },
  rock_2: {
    id: 'rock_2',
    name: '낙석',
    category: 'rock',
    mpCost: 9,
    range: 3,
    area: 'cross',
    power: 95,
    description: '다량의 낙석을 쏟아부어 십자 범위 적을 강타한다',
    allowedTerrains: ['mountain', 'wasteland', 'wall', 'gate'],
    effectType: 'damage'
  },
  rock_3: {
    id: 'rock_3',
    name: '산사태',
    category: 'rock',
    mpCost: 15,
    range: 3,
    area: 'diamond',
    power: 155,
    description: '거대한 산사태를 일으켜 광범위 적을 매몰시킨다',
    allowedTerrains: ['mountain', 'wasteland', 'wall', 'gate'],
    effectType: 'damage'
  },

  // 상태이상계
  confuse_1: {
    id: 'confuse_1',
    name: '위병',
    category: 'status',
    mpCost: 6,
    range: 3,
    area: 'single',
    power: 0,
    description: '거짓 정보를 퍼뜨려 적 부대를 혼란 상태에 빠뜨린다',
    effectType: 'confuse'
  },
  confuse_2: {
    id: 'confuse_2',
    name: '위성',
    category: 'status',
    mpCost: 12,
    range: 3,
    area: 'cross',
    power: 0,
    description: '적 진영을 뒤흔들어 십자 범위 적 부대를 일제히 혼란에 빠뜨린다',
    effectType: 'confuse'
  },
  cure_status: {
    id: 'cure_status',
    name: '각성',
    category: 'status',
    mpCost: 4,
    range: 2,
    area: 'single',
    power: 0,
    description: '혼란에 빠진 아군 부대의 정신을 차리게 한다',
    effectType: 'cure'
  },

  // 회복계
  heal_1: {
    id: 'heal_1',
    name: '원격',
    category: 'recovery',
    mpCost: 4,
    range: 2,
    area: 'single',
    power: 120,
    description: '아군 1부대의 부상병을 치료한다 (HP 약 120 회복)',
    effectType: 'heal'
  },
  heal_2: {
    id: 'heal_2',
    name: '치료',
    category: 'recovery',
    mpCost: 8,
    range: 3,
    area: 'single',
    power: 280,
    description: '아군 1부대의 전력을 대폭 회복시킨다 (HP 약 280 회복)',
    effectType: 'heal'
  },
  heal_3: {
    id: 'heal_3',
    name: '구급',
    category: 'recovery',
    mpCost: 14,
    range: 3,
    area: 'single',
    power: 600,
    description: '아군 1부대의 체력을 거의 완벽히 회복시킨다',
    effectType: 'heal'
  },
  heal_all: {
    id: 'heal_all',
    name: '구원',
    category: 'recovery',
    mpCost: 24,
    range: 4,
    area: 'diamond',
    power: 300,
    description: '범위 내의 모든 아군 부대에게 구호물자를 보낸다',
    effectType: 'heal'
  },

  // 지원계
  cheer_1: {
    id: 'cheer_1',
    name: '고무',
    category: 'support',
    mpCost: 6,
    range: 2,
    area: 'single',
    power: 15,
    description: '아군 부대의 사기를 올려 공격력과 방어력을 증강한다',
    effectType: 'morale_up'
  },
  cheer_2: {
    id: 'cheer_2',
    name: '환호',
    category: 'support',
    mpCost: 12,
    range: 3,
    area: 'cross',
    power: 25,
    description: '십자 범위 아군들의 사기를 일제히 북돋운다',
    effectType: 'morale_up'
  }
};
