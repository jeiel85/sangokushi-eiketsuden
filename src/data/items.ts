import type { ItemDef } from '../types/game';

export const ITEMS: Record<string, ItemDef> = {
  // 전직 지침서
  manual_sword: {
    id: 'manual_sword',
    name: '검술지침서',
    type: 'manual',
    price: 400,
    description: '단병을 장병 또는 근위병으로 승급시키는 비전서',
    promotesClass: 'infantry_heavy',
    icon: '📜'
  },
  manual_horse: {
    id: 'manual_horse',
    name: '마술지침서',
    type: 'manual',
    price: 500,
    description: '경기병을 중기병 또는 친위대로 승급시키는 기마 교본',
    promotesClass: 'cavalry_heavy',
    icon: '📜'
  },
  manual_bow: {
    id: 'manual_bow',
    name: '궁술지침서',
    type: 'manual',
    price: 450,
    description: '궁병을 연노병 또는 발석차로 승급시키는 궁술 비법서',
    promotesClass: 'archer_repeater',
    icon: '📜'
  },

  // 명검 및 무기
  twin_swords: {
    id: 'twin_swords',
    name: '자웅일대검',
    type: 'weapon',
    price: 1500,
    description: '유비의 보검. 암수 한 쌍으로 이루어진 명검. 공격력 +12',
    attackBonus: 12,
    icon: '⚔️'
  },
  green_dragon: {
    id: 'green_dragon',
    name: '청룡언월도',
    type: 'weapon',
    price: 2000,
    description: '관우의 무게 82근 신병. 공격력 +15',
    attackBonus: 15,
    icon: '🗡️'
  },
  serpent_spear: {
    id: 'serpent_spear',
    name: '장팔사모',
    type: 'weapon',
    price: 2000,
    description: '장비의 뱀 모양 창끝을 가진 강철 사모. 공격력 +15',
    attackBonus: 15,
    icon: '🔱'
  },
  fangtian_halberd: {
    id: 'fangtian_halberd',
    name: '방천화극',
    type: 'weapon',
    price: 2500,
    description: '여포가 휘두르던 무적의 극. 공격력 +18',
    attackBonus: 18,
    icon: '🪓'
  },
  seven_star_sword: {
    id: 'seven_star_sword',
    name: '칠성검',
    type: 'weapon',
    price: 1200,
    description: '칠성단에 별빛을 새긴 보검. 공격력 +10',
    attackBonus: 10,
    icon: '⚔️'
  },
  yitian_sword: {
    id: 'yitian_sword',
    name: '의천검',
    type: 'weapon',
    price: 1800,
    description: '조조의 애검. 하늘을 찌르는 명검. 공격력 +14',
    attackBonus: 14,
    icon: '⚔️'
  },
  blue_steel_sword: {
    id: 'blue_steel_sword',
    name: '청홍검',
    type: 'weapon',
    price: 1800,
    description: '쇠를 찰흙 베듯 자르는 신검. 조운이 장판파에서 노획. 공격력 +14',
    attackBonus: 14,
    icon: '⚔️'
  },
  three_point_blade: {
    id: 'three_point_blade',
    name: '삼첨도',
    type: 'weapon',
    price: 1100,
    description: '기령의 무기. 세 갈래 칼끝을 지닌 대도. 공격력 +10',
    attackBonus: 10,
    icon: '🗡️'
  },
  iron_sword: {
    id: 'iron_sword',
    name: '강철검',
    type: 'weapon',
    price: 300,
    description: '단단하게 벼린 병사용 검. 공격력 +4',
    attackBonus: 4,
    icon: '🗡️'
  },
  iron_spear: {
    id: 'iron_spear',
    name: '강철창',
    type: 'weapon',
    price: 350,
    description: '긴 사거리와 타격력을 지닌 장창. 공격력 +5',
    attackBonus: 5,
    icon: '🔱'
  },
  repeater_bow: {
    id: 'repeater_bow',
    name: '강궁',
    type: 'weapon',
    price: 350,
    description: '탄력 있는 활줄을 단 강궁. 공격력 +4',
    attackBonus: 4,
    icon: '🏹'
  },

  // 갑옷 및 방어구
  leather_armor: {
    id: 'leather_armor',
    name: '가죽갑옷',
    type: 'armor',
    price: 200,
    description: '가볍고 질긴 무두질 가죽 갑옷. 방어력 +3',
    defenseBonus: 3,
    icon: '🛡️'
  },
  iron_armor: {
    id: 'iron_armor',
    name: '철갑옷',
    type: 'armor',
    price: 500,
    description: '철판을 덧대어 화살을 튕겨내는 중장갑옷. 방어력 +7',
    defenseBonus: 7,
    icon: '🛡️'
  },
  silver_armor: {
    id: 'silver_armor',
    name: '백은갑옷',
    type: 'armor',
    price: 1200,
    description: '찬란한 은빛의 명품 갑옷. 방어력 +12',
    defenseBonus: 12,
    icon: '🛡️'
  },
  gold_armor: {
    id: 'gold_armor',
    name: '황금갑옷',
    type: 'armor',
    price: 2000,
    description: '황금으로 도금된 군주의 명갑. 방어력 +16',
    defenseBonus: 16,
    icon: '🛡️'
  },

  // 명마
  red_hare: {
    id: 'red_hare',
    name: '적토마',
    type: 'horse',
    price: 3000,
    description: '하루에 천 리를 달리는 천하제일의 명마. 이동력 +3',
    movementBonus: 3,
    icon: '🐎'
  },
  dilu_horse: {
    id: 'dilu_horse',
    name: '적로',
    type: 'horse',
    price: 2000,
    description: '단계를 뛰어넘어 유비의 목숨을 구한 준마. 이동력 +2',
    movementBonus: 2,
    icon: '🐎'
  },
  shadow_runner: {
    id: 'shadow_runner',
    name: '절영',
    type: 'horse',
    price: 1500,
    description: '그림자조차 비추지 못할 만큼 빠른 조조의 명마. 이동력 +1',
    movementBonus: 1,
    icon: '🐎'
  },

  // 병법서 및 비보
  art_of_war: {
    id: 'art_of_war',
    name: '손자병법서',
    type: 'treasure',
    price: 2500,
    description: '고대 군사 전략의 집대성. 공격력 +8, 방어력 +8',
    attackBonus: 8,
    defenseBonus: 8,
    icon: '📖'
  },
  imperial_seal: {
    id: 'imperial_seal',
    name: '옥새',
    type: 'treasure',
    price: 5000,
    description: '천자의 정통성을 증명하는 옥새. 공격력 +10, 방어력 +10, 이동력 +1',
    attackBonus: 10,
    defenseBonus: 10,
    movementBonus: 1,
    icon: '👑'
  },

  // 회복 및 소비품
  bean: {
    id: 'bean',
    name: '콩',
    type: 'consumable',
    price: 50,
    description: '간단한 군량. 부대 병력(HP) 50을 회복',
    hpRestore: 50,
    icon: '🫘'
  },
  rice: {
    id: 'rice',
    name: '쌀',
    type: 'consumable',
    price: 100,
    description: '따뜻한 쌀밥. 부대 병력(HP) 100을 회복',
    hpRestore: 100,
    icon: '🍚'
  },
  meat: {
    id: 'meat',
    name: '고기',
    type: 'consumable',
    price: 200,
    description: '원기 왕성한 고기. 부대 병력(HP) 200을 회복',
    hpRestore: 200,
    icon: '🍖'
  },
  good_medicine: {
    id: 'good_medicine',
    name: '상약',
    type: 'consumable',
    price: 400,
    description: '명의의 특제 한약. 부대 병력(HP) 400을 회복',
    hpRestore: 400,
    icon: '💊'
  },
  elixir: {
    id: 'elixir',
    name: '특효약',
    type: 'consumable',
    price: 800,
    description: '전설의 영약. 부대 병력(HP)을 완전히 회복',
    hpRestore: 9999,
    icon: '🧪'
  },
  wine: {
    id: 'wine',
    name: '술',
    type: 'consumable',
    price: 80,
    description: '사기를 북돋우는 전통 명주. 책략치(MP) 25 회복',
    mpRestore: 25,
    icon: '🍶'
  },
  clear_wine: {
    id: 'clear_wine',
    name: '특급주',
    type: 'consumable',
    price: 220,
    description: '진귀한 고급 곡주. 책략치(MP) 60 회복',
    mpRestore: 60,
    icon: '🍾'
  },
  stimulant: {
    id: 'stimulant',
    name: '각성제',
    type: 'consumable',
    price: 60,
    description: '혼란 상태에 빠진 부대의 제정신을 즉시 되찾게 한다',
    cureStatus: true,
    icon: '🌿'
  }
};
