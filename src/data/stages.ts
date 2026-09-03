import type { StageDef, TerrainType } from '../types/game';

// 12x10 규격의 맵 생성 헬퍼 함수
function generateMap(pattern: string[]): TerrainType[][] {
  const map: TerrainType[][] = [];
  const charToTerrain: Record<string, TerrainType> = {
    '.': 'plain',
    ',': 'grass',
    'F': 'forest',
    'M': 'mountain',
    '~': 'river',
    '=': 'bridge',
    'S': 'swamp',
    'W': 'wasteland',
    'C': 'castle',
    '#': 'wall',
    'G': 'gate',
    'V': 'village',
    'B': 'barracks',
    'T': 'treasure'
  };

  for (const row of pattern) {
    const r: TerrainType[] = [];
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      r.push(charToTerrain[ch] || 'plain');
    }
    map.push(r);
  }
  return map;
}

export const STAGES: StageDef[] = [
  // ==================== 서장: 반동탁 연합군 ====================
  {
    id: 1,
    code: 'sishui_pass',
    chapter: 0,
    chapterTitle: '서장: 반동탁 연합군',
    name: '사수관 전투',
    description: '반동탁 연합군의 선봉이 화웅의 맹공에 고전하자, 관우가 술이 식기 전에 화웅의 목을 베겠다고 나선다.',
    width: 14,
    height: 10,
    mapData: generateMap([
      'MMMMMMMMMMMMMM',
      'MM..FF..W.GMMM',
      'M..FFF...WW#MM',
      '..FFFF....W#CM',
      ',,...==...W#CM',
      ',,.~~~~...W#CM',
      ',..FFF....W#BM',
      'M..FF...WWW#MM',
      'MM...WWWWW.GMM',
      'MMMMMMMMMMMMMM'
    ]),
    maxTurns: 30,
    victoryCondition: '화웅 격파 또는 적 전멸',
    defeatCondition: '유비의 퇴각 또는 제한 턴 초과',
    playerDeploymentLimit: 5,
    requiredPlayerCharIds: ['liu_bei'],
    clearGold: 500,
    clearExpBonus: 50,
    initialDeployments: [
      { charId: 'liu_bei', x: 1, y: 4, faction: 'player', isCommander: true },
      { charId: 'guan_yu', x: 2, y: 3, faction: 'player' },
      { charId: 'zhang_fei', x: 2, y: 5, faction: 'player' },
      { charId: 'jian_yong', x: 0, y: 4, faction: 'player' },
      { charId: 'fan_gong', x: 1, y: 6, faction: 'player' },

      // 적군
      { charId: 'hua_xiong', x: 11, y: 4, faction: 'enemy', isCommander: true, aiType: 'hold' },
      { charId: 'li_ru', x: 11, y: 3, faction: 'enemy', aiType: 'hold' },
      { charId: 'deng_mao', x: 7, y: 3, faction: 'enemy', aiType: 'aggressive' },
      { charId: 'cheng_yuanzhi', x: 7, y: 5, faction: 'enemy', aiType: 'aggressive' },
      { charId: 'deng_mao', x: 9, y: 2, faction: 'enemy', aiType: 'aggressive' },
      { charId: 'cheng_yuanzhi', x: 9, y: 6, faction: 'enemy', aiType: 'aggressive' }
    ],
    duels: [
      {
        playerCharId: 'guan_yu',
        enemyCharId: 'hua_xiong',
        dialogueLines: [
          { speaker: '화웅', text: '이름 없는 마궁수 따위가 감히 나 화웅에게 덤비다니!' },
          { speaker: '관우', text: '술이 식기 전에 네 놈의 목을 베어 바치겠다!' },
          { speaker: '화웅', text: '크헉! 이 무슨 괴력인가...!' }
        ],
        winner: 'player',
        rewardExp: 100,
        enemyRetreats: true
      }
    ],
    treasures: [
      { x: 12, y: 3, itemId: 'rice' },
      { x: 12, y: 5, itemId: 'good_medicine' }
    ],
    preBattleDialogue: [
      { speaker: '조조', text: '화웅의 무용이 대단하여 연합군의 장수들이 연달아 목숨을 잃고 있소.' },
      { speaker: '관우', text: '소장이 나아가 화웅의 목을 베어 오겠습니다. 술 한 잔을 데워두십시오.' }
    ]
  },
  {
    id: 2,
    code: 'hulao_pass',
    chapter: 0,
    chapterTitle: '서장: 반동탁 연합군',
    name: '호뢰관 전투',
    description: '적토마를 탄 천하무쌍 여포가 호뢰관 앞에 서서 연합군을 도륙하자, 유비 삼형제가 함께 맞선다.',
    width: 14,
    height: 10,
    mapData: generateMap([
      'MMMMMMMMMMMMMM',
      'MM..FF..WW.GMM',
      'M..FFF...WW#CM',
      '..FFFF....W#CM',
      ',,...==...W#CM',
      ',,.~~~~...W#CM',
      ',..FFF....W#BM',
      'M..FF...WWW#MM',
      'MM...WWWWW.GMM',
      'MMMMMMMMMMMMMM'
    ]),
    maxTurns: 30,
    victoryCondition: '여포 격파 또는 동탁의 퇴각',
    defeatCondition: '유비의 퇴각 또는 제한 턴 초과',
    playerDeploymentLimit: 6,
    requiredPlayerCharIds: ['liu_bei'],
    clearGold: 800,
    clearExpBonus: 60,
    initialDeployments: [
      { charId: 'liu_bei', x: 1, y: 4, faction: 'player', isCommander: true },
      { charId: 'guan_yu', x: 2, y: 3, faction: 'player' },
      { charId: 'zhang_fei', x: 2, y: 5, faction: 'player' },
      { charId: 'jian_yong', x: 1, y: 2, faction: 'player' },
      { charId: 'fan_gong', x: 1, y: 6, faction: 'player' },

      // 적군
      { charId: 'lu_bu', x: 7, y: 4, faction: 'enemy', isCommander: true, aiType: 'aggressive' },
      { charId: 'dong_zhuo', x: 12, y: 4, faction: 'enemy', aiType: 'hold' },
      { charId: 'li_ru', x: 11, y: 3, faction: 'enemy', aiType: 'hold' },
      { charId: 'deng_mao', x: 6, y: 2, faction: 'enemy', aiType: 'aggressive' },
      { charId: 'cheng_yuanzhi', x: 6, y: 6, faction: 'enemy', aiType: 'aggressive' }
    ],
    duels: [
      {
        playerCharId: 'zhang_fei',
        enemyCharId: 'lu_bu',
        dialogueLines: [
          { speaker: '장비', text: '삼성가노 여포 놈아! 연인 장익덕이 여기 있다!' },
          { speaker: '여포', text: '주둥이만 산 놈! 방천화극의 맛을 보아라!' }
        ],
        winner: 'player',
        rewardExp: 80,
        enemyRetreats: false
      }
    ],
    treasures: [
      { x: 12, y: 2, itemId: 'manual_sword' },
      { x: 12, y: 6, itemId: 'meat' }
    ]
  },

  // ==================== 제1장: 군웅할거 ====================
  {
    id: 3,
    code: 'jieqiao',
    chapter: 1,
    chapterTitle: '제1장: 군웅할거',
    name: '계교 전투',
    description: '공손찬이 원소의 대군에 몰려 위기에 처하자, 조자룡이 백마를 타고 나타나 문추를 물리친다.',
    width: 14,
    height: 10,
    mapData: generateMap([
      '......FF......',
      '..,....FF..FF.',
      '..,,,,...==...',
      '..,,..~~~~~~..',
      '..V...~~~~~~..',
      '..,,..~~~~~~..',
      '..,,,,...==...',
      '..,....FF..FF.',
      '......FF......',
      'WWWWWWWWWWWWWW'
    ]),
    maxTurns: 35,
    victoryCondition: '원소 격파 또는 적 전멸',
    defeatCondition: '공손찬 또는 유비의 퇴각',
    playerDeploymentLimit: 6,
    requiredPlayerCharIds: ['liu_bei'],
    clearGold: 1000,
    clearExpBonus: 70,
    initialDeployments: [
      { charId: 'liu_bei', x: 1, y: 4, faction: 'player', isCommander: true },
      { charId: 'guan_yu', x: 1, y: 3, faction: 'player' },
      { charId: 'zhang_fei', x: 1, y: 5, faction: 'player' },
      { charId: 'jian_yong', x: 0, y: 4, faction: 'player' },
      { charId: 'zhao_yun', x: 4, y: 4, faction: 'player' },

      // 원소군
      { charId: 'yuan_shao', x: 12, y: 4, faction: 'enemy', isCommander: true, aiType: 'hold' },
      { charId: 'wen_chou', x: 8, y: 3, faction: 'enemy', aiType: 'aggressive' },
      { charId: 'yan_liang', x: 8, y: 5, faction: 'enemy', aiType: 'aggressive' },
      { charId: 'chunyu_qiong', x: 10, y: 4, faction: 'enemy', aiType: 'aggressive' }
    ],
    duels: [
      {
        playerCharId: 'zhao_yun',
        enemyCharId: 'wen_chou',
        dialogueLines: [
          { speaker: '문추', text: '풋내기 녀석, 상산 조자룡이라 하였느냐!' },
          { speaker: '조운', text: '공손찬 태수를 건드리지 마라!' }
        ],
        winner: 'player',
        rewardExp: 100,
        enemyRetreats: true
      }
    ],
    treasures: [
      { x: 2, y: 4, itemId: 'manual_horse' }
    ]
  },
  {
    id: 4,
    code: 'beihai',
    chapter: 1,
    chapterTitle: '제1장: 군웅할거',
    name: '북해 전투',
    description: '북해상 공융이 황건 잔당 관해에게 포위당하자, 태사자의 구원 요청을 받은 유비 삼형제가 출진한다.',
    width: 14,
    height: 10,
    mapData: generateMap([
      'MMMM......MMMM',
      'MM..FF..FF..MM',
      '..FFFF..FFFF..',
      '..FF......FF..',
      '....VV..VV....',
      '....VV..VV....',
      '..FF......FF..',
      '..FFFF..FFFF..',
      'MM..FF..FF..MM',
      'MMMM......MMMM'
    ]),
    maxTurns: 30,
    victoryCondition: '관해 격파 및 적 전멸',
    defeatCondition: '유비의 퇴각',
    playerDeploymentLimit: 6,
    requiredPlayerCharIds: ['liu_bei'],
    clearGold: 1000,
    clearExpBonus: 70,
    initialDeployments: [
      { charId: 'liu_bei', x: 1, y: 4, faction: 'player', isCommander: true },
      { charId: 'guan_yu', x: 2, y: 3, faction: 'player' },
      { charId: 'zhang_fei', x: 2, y: 5, faction: 'player' },
      { charId: 'cheng_yuanzhi', x: 10, y: 4, faction: 'enemy', isCommander: true, aiType: 'aggressive' },
      { charId: 'deng_mao', x: 8, y: 3, faction: 'enemy', aiType: 'aggressive' },
      { charId: 'deng_mao', x: 8, y: 5, faction: 'enemy', aiType: 'aggressive' }
    ],
    duels: [
      {
        playerCharId: 'guan_yu',
        enemyCharId: 'cheng_yuanzhi',
        dialogueLines: [
          { speaker: '관해', text: '감히 내 앞을 가로막다니 죽음을 자초하는구나!' },
          { speaker: '관우', text: '도적 무리의 우두머리는 청룡도를 받아라!' }
        ],
        winner: 'player',
        rewardExp: 100,
        enemyRetreats: true
      }
    ]
  },
  {
    id: 5,
    code: 'xuzhou',
    chapter: 1,
    chapterTitle: '제1장: 군웅할거',
    name: '서주 구원전',
    description: '부친 조숭의 원수를 갚으려 서주를 침공한 조조 대군. 유비는 도겸을 구하기 위해 서주성으로 입성한다.',
    width: 14,
    height: 10,
    mapData: generateMap([
      'MMMMMMMMMMMMMM',
      'M#CCCCCCCCCC#M',
      'M#CBB....BBC#M',
      'M#C..FFFF..C#M',
      'M#C..FFFF..C#M',
      'M#C..FFFF..C#M',
      'M#CBB....BBC#M',
      'M#CCCCCCCCCC#M',
      'MM....GG....MM',
      'MMMMMMMMMMMMMM'
    ]),
    maxTurns: 30,
    victoryCondition: '유비의 서주성 진입 또는 우금/하후연 격퇴',
    defeatCondition: '유비의 퇴각 또는 도겸의 사망',
    playerDeploymentLimit: 6,
    requiredPlayerCharIds: ['liu_bei'],
    clearGold: 1200,
    clearExpBonus: 80,
    initialDeployments: [
      { charId: 'liu_bei', x: 6, y: 8, faction: 'player', isCommander: true },
      { charId: 'guan_yu', x: 5, y: 8, faction: 'player' },
      { charId: 'zhang_fei', x: 7, y: 8, faction: 'player' },
      { charId: 'xiahou_yuan', x: 6, y: 3, faction: 'enemy', isCommander: true, aiType: 'aggressive' },
      { charId: 'dian_wei', x: 4, y: 4, faction: 'enemy', aiType: 'aggressive' },
      { charId: 'xu_chu', x: 8, y: 4, faction: 'enemy', aiType: 'aggressive' }
    ]
  },
  {
    id: 6,
    code: 'xiapi',
    chapter: 1,
    chapterTitle: '제1장: 군웅할거',
    name: '하비 전투 (여포 토벌)',
    description: '수공으로 하비성이 물에 잠기고 여포는 백문루에서 마지막 저항을 벌인다.',
    width: 14,
    height: 10,
    mapData: generateMap([
      'SSSSSSSSSSSSSS',
      'SS~~~~~~~~~~SS',
      'S~##GG##GG##~S',
      'S~#CCCCCCCC#~S',
      'S~#CB....BC#~S',
      'S~#C......C#~S',
      'S~#CCCCCCCC#~S',
      'S~##GG##GG##~S',
      'SS~~~~~~~~~~SS',
      'SSSSSSSSSSSSSS'
    ]),
    maxTurns: 35,
    victoryCondition: '여포 격파',
    defeatCondition: '유비의 퇴각',
    playerDeploymentLimit: 7,
    requiredPlayerCharIds: ['liu_bei'],
    clearGold: 1500,
    clearExpBonus: 90,
    initialDeployments: [
      { charId: 'liu_bei', x: 2, y: 4, faction: 'player', isCommander: true },
      { charId: 'guan_yu', x: 2, y: 3, faction: 'player' },
      { charId: 'zhang_fei', x: 2, y: 5, faction: 'player' },
      { charId: 'lu_bu', x: 6, y: 4, faction: 'enemy', isCommander: true, aiType: 'hold' },
      { charId: 'zhang_liao', x: 7, y: 3, faction: 'enemy', aiType: 'aggressive' }
    ],
    duels: [
      {
        playerCharId: 'guan_yu',
        enemyCharId: 'zhang_liao',
        dialogueLines: [
          { speaker: '관우', text: '문원! 어찌 여포 같은 의리 없는 자를 섬기는가!' },
          { speaker: '장료', text: '운장 형님... 장수로서 주군을 지킬 뿐이오!' }
        ],
        winner: 'player',
        rewardExp: 80,
        enemyRetreats: false
      }
    ],
    treasures: [
      { x: 6, y: 5, itemId: 'fangtian_halberd' },
      { x: 7, y: 5, itemId: 'red_hare' }
    ]
  },

  // ==================== 제2장: 관도대전 & 방랑 ====================
  {
    id: 7,
    code: 'baima',
    chapter: 2,
    chapterTitle: '제2장: 관도대전 & 방랑',
    name: '백마 전투',
    description: '조조에게 잠시 의탁했던 관우가 원소의 맹장 안량을 단칼에 베어 조조의 은혜에 보답한다.',
    width: 14,
    height: 10,
    mapData: generateMap([
      '..............',
      '...FF....FF...',
      '..FFFF..FFFF..',
      '..FFFF..FFFF..',
      '..............',
      '..~~~~~~~~~~..',
      '......==......',
      '..............',
      '...WW....WW...',
      '..WWWW..WWWW..'
    ]),
    maxTurns: 30,
    victoryCondition: '안량 격파',
    defeatCondition: '조조 또는 관우의 퇴각',
    playerDeploymentLimit: 5,
    requiredPlayerCharIds: ['guan_yu'],
    clearGold: 1200,
    clearExpBonus: 90,
    initialDeployments: [
      { charId: 'guan_yu', x: 6, y: 7, faction: 'player', isCommander: true },
      { charId: 'zhang_liao', x: 5, y: 8, faction: 'ally' },
      { charId: 'xu_huang', x: 7, y: 8, faction: 'ally' },
      { charId: 'yan_liang', x: 6, y: 2, faction: 'enemy', isCommander: true, aiType: 'hold' },
      { charId: 'chunyu_qiong', x: 4, y: 3, faction: 'enemy', aiType: 'aggressive' }
    ],
    duels: [
      {
        playerCharId: 'guan_yu',
        enemyCharId: 'yan_liang',
        dialogueLines: [
          { speaker: '안량', text: '조조군에 저런 장수가 있었던가? 누구냐!' },
          { speaker: '관우', text: '한수정후 관운장이다! 네 목을 가져가겠다!' }
        ],
        winner: 'player',
        rewardExp: 100,
        enemyRetreats: true
      }
    ]
  },
  {
    id: 8,
    code: 'yanjin',
    chapter: 2,
    chapterTitle: '제2장: 관도대전 & 방랑',
    name: '연진 전투',
    description: '안량의 원수를 갚으려 진격해 온 문추를 관우가 황하 강변에서 또다시 베어 넘긴다.',
    width: 14,
    height: 10,
    mapData: generateMap([
      '~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~',
      '......==......',
      '..............',
      '..FF......FF..',
      '..FFFF..FFFF..',
      '..FFFF..FFFF..',
      '..............',
      '....WW..WW....',
      '..WWWW..WWWW..'
    ]),
    maxTurns: 30,
    victoryCondition: '문추 격파',
    defeatCondition: '조조 또는 관우의 퇴각',
    playerDeploymentLimit: 5,
    requiredPlayerCharIds: ['guan_yu'],
    clearGold: 1200,
    clearExpBonus: 90,
    initialDeployments: [
      { charId: 'guan_yu', x: 6, y: 4, faction: 'player', isCommander: true },
      { charId: 'wen_chou', x: 6, y: 1, faction: 'enemy', isCommander: true, aiType: 'aggressive' }
    ],
    duels: [
      {
        playerCharId: 'guan_yu',
        enemyCharId: 'wen_chou',
        dialogueLines: [
          { speaker: '문추', text: '네 놈이 안량 형님을 죽인 관우냐! 원수를 갚겠다!' },
          { speaker: '관우', text: '너 또한 원소의 헛된 욕심에 희생될 뿐이다!' }
        ],
        winner: 'player',
        rewardExp: 100,
        enemyRetreats: true
      }
    ]
  },
  {
    id: 9,
    code: 'runan',
    chapter: 2,
    chapterTitle: '제2장: 관도대전 & 방랑',
    name: '여남 전투 (조운 재회)',
    description: '여남에서 유비가 조조군의 포위를 당했을 때, 조자룡이 달려와 유비를 구원하고 평생의 군신이 된다.',
    width: 14,
    height: 10,
    mapData: generateMap([
      'MMMM......MMMM',
      'MM..FF..FF..MM',
      '..FFFF..FFFF..',
      '..FF..VV..FF..',
      '....VVVVVV....',
      '....VVVVVV....',
      '..FF..VV..FF..',
      '..FFFF..FFFF..',
      'MM..FF..FF..MM',
      'MMMM......MMMM'
    ]),
    maxTurns: 30,
    victoryCondition: '조조군 격퇴 또는 유비의 탈출',
    defeatCondition: '유비의 퇴각',
    playerDeploymentLimit: 6,
    requiredPlayerCharIds: ['liu_bei'],
    clearGold: 1400,
    clearExpBonus: 100,
    initialDeployments: [
      { charId: 'liu_bei', x: 6, y: 5, faction: 'player', isCommander: true },
      { charId: 'guan_yu', x: 5, y: 5, faction: 'player' },
      { charId: 'zhang_fei', x: 7, y: 5, faction: 'player' },
      { charId: 'zhao_yun', x: 1, y: 5, faction: 'player' },
      { charId: 'xu_chu', x: 10, y: 4, faction: 'enemy', isCommander: true, aiType: 'aggressive' },
      { charId: 'xiahou_dun', x: 10, y: 6, faction: 'enemy', aiType: 'aggressive' }
    ],
    duels: [
      {
        playerCharId: 'zhao_yun',
        enemyCharId: 'xu_chu',
        dialogueLines: [
          { speaker: '허저', text: '애송이 장수가 제법이구나! 나와 힘을 겨뤄보자!' },
          { speaker: '조운', text: '주군을 해치려는 자는 이 조자룡의 창을 넘지 못한다!' }
        ],
        winner: 'player',
        rewardExp: 80,
        enemyRetreats: false
      }
    ]
  },
  {
    id: 10,
    code: 'bowangpo',
    chapter: 2,
    chapterTitle: '제2장: 관도대전 & 방랑',
    name: '박망파 전투 (제갈량의 데뷔전)',
    description: '삼고초려로 얻은 군사 제갈량의 첫 출진. 좁은 박망파 계곡에서 화공으로 하후돈의 10만 군을 불태운다.',
    width: 14,
    height: 10,
    mapData: generateMap([
      'MMMMMMMMMMMMMM',
      'MMMMFFFFFFMMMM',
      'MMFFFFFFFFFFMM',
      '..FFFFFFFFFF..',
      '..FFFFFFFFFF..',
      '..FFFFFFFFFF..',
      '..FFFFFFFFFF..',
      'MMFFFFFFFFFFMM',
      'MMMMFFFFFFMMMM',
      'MMMMMMMMMMMMMM'
    ]),
    maxTurns: 30,
    victoryCondition: '하후돈 격파',
    defeatCondition: '유비의 퇴각',
    playerDeploymentLimit: 7,
    requiredPlayerCharIds: ['liu_bei', 'zhuge_liang'],
    clearGold: 1600,
    clearExpBonus: 120,
    initialDeployments: [
      { charId: 'liu_bei', x: 1, y: 4, faction: 'player', isCommander: true },
      { charId: 'zhuge_liang', x: 0, y: 4, faction: 'player' },
      { charId: 'zhao_yun', x: 4, y: 4, faction: 'player' },
      { charId: 'guan_yu', x: 6, y: 2, faction: 'player' },
      { charId: 'zhang_fei', x: 6, y: 7, faction: 'player' },
      { charId: 'xiahou_dun', x: 10, y: 4, faction: 'enemy', isCommander: true, aiType: 'aggressive' },
      { charId: 'xiahou_yuan', x: 11, y: 3, faction: 'enemy', aiType: 'aggressive' }
    ],
    duels: [
      {
        playerCharId: 'guan_yu',
        enemyCharId: 'xiahou_dun',
        dialogueLines: [
          { speaker: '하후돈', text: '제갈량의 풋내기 화공에 내가 당하다니!' },
          { speaker: '관우', text: '군사님의 묘책은 하늘도 꿰뚫는다. 어서 물러가라!' }
        ],
        winner: 'player',
        rewardExp: 80,
        enemyRetreats: true
      }
    ]
  },
  {
    id: 11,
    code: 'changban',
    chapter: 2,
    chapterTitle: '제2장: 관도대전 & 방랑',
    name: '장판파 전투 (당양교의 일갈)',
    description: '조운은 백만 대군을 뚫고 아두를 품에 안고 구출하고, 장비는 장판교 위에서 홀로 조조군을 호통쳐 물리친다.',
    width: 14,
    height: 10,
    mapData: generateMap([
      '..............',
      '...FF....FF...',
      '..FFFF..FFFF..',
      '~~~~~~~~~~~~~~',
      '~~~~~~==~~~~~~',
      '~~~~~~~~~~~~~~',
      '..FFFF..FFFF..',
      '...FF....FF...',
      '..............',
      'WWWWWWWWWWWWWW'
    ]),
    maxTurns: 35,
    victoryCondition: '유비와 민중의 탈출 또는 조조군 격퇴',
    defeatCondition: '유비 또는 조운의 퇴각',
    playerDeploymentLimit: 7,
    requiredPlayerCharIds: ['liu_bei', 'zhao_yun', 'zhang_fei'],
    clearGold: 2000,
    clearExpBonus: 150,
    initialDeployments: [
      { charId: 'liu_bei', x: 12, y: 7, faction: 'player', isCommander: true },
      { charId: 'zhang_fei', x: 6, y: 4, faction: 'player' }, // 장판교 위
      { charId: 'zhao_yun', x: 3, y: 2, faction: 'player' },
      { charId: 'cao_cao', x: 1, y: 1, faction: 'enemy', isCommander: true, aiType: 'aggressive' },
      { charId: 'zhang_liao', x: 2, y: 2, faction: 'enemy', aiType: 'aggressive' },
      { charId: 'xu_chu', x: 1, y: 3, faction: 'enemy', aiType: 'aggressive' }
    ],
    duels: [
      {
        playerCharId: 'zhang_fei',
        enemyCharId: 'xu_chu',
        dialogueLines: [
          { speaker: '장비', text: '내가 바로 연인 장익덕이다! 목숨이 아깝지 않은 놈은 덤벼라!' },
          { speaker: '조조', text: '저자의 기세에 눌려 군사들이 간담이 서늘해졌구나... 전군 퇴각하라!' }
        ],
        winner: 'player',
        rewardExp: 120,
        enemyRetreats: false
      }
    ],
    treasures: [
      { x: 1, y: 2, itemId: 'blue_steel_sword' }
    ]
  },

  // ==================== 제3장: 적벽대전 & 형주 평정 ====================
  {
    id: 12,
    code: 'chibi',
    chapter: 3,
    chapterTitle: '제3장: 적벽대전 & 형주 평정',
    name: '적벽 대전',
    description: '동남풍이 불어오고 황개의 화선이 조조의 쇠사슬 연환 선단을 불바다로 만든다.',
    width: 14,
    height: 10,
    mapData: generateMap([
      '~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~',
      '~~~~==~~~~~~~~',
      '~~~~==~~~~~~~~',
      '~~~~==~~~~~~~~',
      '~~~~==~~~~~~~~',
      '~~~~~~~~~~~~~~',
      '..FFFF..FFFF..',
      '..FFFF..FFFF..',
      '..............'
    ]),
    maxTurns: 35,
    victoryCondition: '조조의 대선단 격파 및 조조 추격',
    defeatCondition: '유비의 퇴각',
    playerDeploymentLimit: 8,
    requiredPlayerCharIds: ['liu_bei', 'zhuge_liang'],
    clearGold: 2500,
    clearExpBonus: 180,
    initialDeployments: [
      { charId: 'liu_bei', x: 2, y: 8, faction: 'player', isCommander: true },
      { charId: 'zhuge_liang', x: 1, y: 8, faction: 'player' },
      { charId: 'guan_yu', x: 4, y: 8, faction: 'player' },
      { charId: 'zhang_fei', x: 5, y: 8, faction: 'player' },
      { charId: 'zhou_yu', x: 8, y: 8, faction: 'ally' },
      { charId: 'cao_cao', x: 6, y: 1, faction: 'enemy', isCommander: true, aiType: 'hold' },
      { charId: 'zhang_liao', x: 5, y: 2, faction: 'enemy', aiType: 'aggressive' },
      { charId: 'sima_yi', x: 7, y: 2, faction: 'enemy', aiType: 'hold' }
    ]
  },
  {
    id: 13,
    code: 'changsha',
    chapter: 3,
    chapterTitle: '제3장: 적벽대전 & 형주 평정',
    name: '장사 전투 (황충과 위연)',
    description: '관우와 노장 황충의 백병전! 황충은 화살로 투구 끈만 맞추고, 위연이 한현을 베고 성문을 연다.',
    width: 14,
    height: 10,
    mapData: generateMap([
      'MMMMMMMMMMMMMM',
      'M#CCCCCCCCCC#M',
      'M#CB......BC#M',
      'M#C...VV...C#M',
      'M#C...VV...C#M',
      'MM....GG....MM',
      '..............',
      '..FF......FF..',
      '..FFFF..FFFF..',
      'MMMMMMMMMMMMMM'
    ]),
    maxTurns: 30,
    victoryCondition: '한현 격파 또는 황충 설득',
    defeatCondition: '유비 또는 관우의 퇴각',
    playerDeploymentLimit: 7,
    requiredPlayerCharIds: ['liu_bei', 'guan_yu'],
    clearGold: 2200,
    clearExpBonus: 160,
    initialDeployments: [
      { charId: 'liu_bei', x: 6, y: 8, faction: 'player', isCommander: true },
      { charId: 'guan_yu', x: 6, y: 6, faction: 'player' },
      { charId: 'zhang_fei', x: 4, y: 7, faction: 'player' },
      { charId: 'huang_zhong', x: 6, y: 3, faction: 'enemy', isCommander: true, aiType: 'aggressive' },
      { charId: 'wei_yan', x: 7, y: 3, faction: 'enemy', aiType: 'hold' }
    ],
    duels: [
      {
        playerCharId: 'guan_yu',
        enemyCharId: 'huang_zhong',
        dialogueLines: [
          { speaker: '관우', text: '노익장의 궁술과 칼솜씨가 과연 천하에 짝이 없구려!' },
          { speaker: '황충', text: '관공의 청룡도에 깃든 의기를 보았소. 내 활시위를 거두겠소.' }
        ],
        winner: 'player',
        rewardExp: 120,
        enemyRetreats: true
      }
    ]
  },

  // ==================== 제4장: 익주 공략 & 한중 쟁패 ====================
  {
    id: 14,
    code: 'luofengpo',
    chapter: 4,
    chapterTitle: '제4장: 익주 공략 & 한중 쟁패',
    name: '낙봉파 전투 (방통 구출)',
    description: '장임의 복병이 낙봉파에서 방통을 노린다. 유비군은 신속히 방통을 구출해야 한다.',
    width: 14,
    height: 10,
    mapData: generateMap([
      'MMMMMMMMMMMMMM',
      'MMMM..WW..MMMM',
      'MMM..WWWW..MMM',
      'MM..WWWWWW..MM',
      'M..WWWWWWWW..M',
      'M..WWWWWWWW..M',
      'MM..WWWWWW..MM',
      'MMM..WWWW..MMM',
      'MMMM..WW..MMMM',
      'MMMMMMMMMMMMMM'
    ]),
    maxTurns: 25,
    victoryCondition: '장임 격파 및 방통 구출',
    defeatCondition: '유비 또는 방통의 퇴각',
    playerDeploymentLimit: 7,
    requiredPlayerCharIds: ['liu_bei', 'pang_tong'],
    clearGold: 2400,
    clearExpBonus: 180,
    initialDeployments: [
      { charId: 'liu_bei', x: 2, y: 4, faction: 'player', isCommander: true },
      { charId: 'pang_tong', x: 4, y: 4, faction: 'player' },
      { charId: 'zhao_yun', x: 2, y: 5, faction: 'player' },
      { charId: 'fan_gong', x: 2, y: 3, faction: 'player' },
      { charId: 'deng_mao', x: 8, y: 4, faction: 'enemy', isCommander: true, aiType: 'aggressive' },
      { charId: 'cheng_yuanzhi', x: 8, y: 5, faction: 'enemy', aiType: 'aggressive' }
    ]
  },
  {
    id: 15,
    code: 'dingjun',
    chapter: 4,
    chapterTitle: '제4장: 익주 공략 & 한중 쟁패',
    name: '정군산 전투',
    description: '법정의 책략에 따라 높은 고지를 선점한 황충이 번개처럼 말을 몰아 하후연을 참살한다.',
    width: 14,
    height: 10,
    mapData: generateMap([
      'MMMMMMMMMMMMMM',
      'MMMM..MM..MMMM',
      'MMM..MMMM..MMM',
      'MM..MMMMMM..MM',
      '..MMMMMMMMMM..',
      '..MMMMMMMMMM..',
      'MM..MMMMMM..MM',
      'MMM..MMMM..MMM',
      'MMMM..MM..MMMM',
      'MMMMMMMMMMMMMM'
    ]),
    maxTurns: 30,
    victoryCondition: '하후연 격파',
    defeatCondition: '유비의 퇴각',
    playerDeploymentLimit: 8,
    requiredPlayerCharIds: ['liu_bei', 'huang_zhong'],
    clearGold: 2800,
    clearExpBonus: 200,
    initialDeployments: [
      { charId: 'liu_bei', x: 2, y: 4, faction: 'player', isCommander: true },
      { charId: 'huang_zhong', x: 4, y: 4, faction: 'player' },
      { charId: 'fa_zheng', x: 2, y: 3, faction: 'player' },
      { charId: 'xiahou_yuan', x: 10, y: 4, faction: 'enemy', isCommander: true, aiType: 'aggressive' },
      { charId: 'zhang_he', x: 10, y: 5, faction: 'enemy', aiType: 'aggressive' }
    ],
    duels: [
      {
        playerCharId: 'huang_zhong',
        enemyCharId: 'xiahou_yuan',
        dialogueLines: [
          { speaker: '하후연', text: '늙은이가 감히 내 진영으로 뛰어들다니!' },
          { speaker: '황충', text: '내 칼끝이 번개보다 빠름을 보여주마! 받거라!' }
        ],
        winner: 'player',
        rewardExp: 150,
        enemyRetreats: true
      }
    ]
  },
  {
    id: 16,
    code: 'fancheng',
    chapter: 4,
    chapterTitle: '제4장: 익주 공략 & 한중 쟁패',
    name: '번성 전투 (관우의 수공)',
    description: '관우가 한수를 터뜨려 우금의 7군을 수몰시키고 방덕을 사로잡으며 위진화하의 위세를 떨친다.',
    width: 14,
    height: 10,
    mapData: generateMap([
      '~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~',
      'SSSSSSSSSSSSSS',
      'S##GG####GG##S',
      'S#CCCCCCCCCC#S',
      'S#CCCCCCCCCC#S',
      'S##GG####GG##S',
      'SSSSSSSSSSSSSS',
      '~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~'
    ]),
    maxTurns: 30,
    victoryCondition: '조인 격파',
    defeatCondition: '관우의 퇴각',
    playerDeploymentLimit: 6,
    requiredPlayerCharIds: ['guan_yu'],
    clearGold: 3000,
    clearExpBonus: 220,
    initialDeployments: [
      { charId: 'guan_yu', x: 2, y: 4, faction: 'player', isCommander: true },
      { charId: 'guan_ping', x: 2, y: 3, faction: 'player' },
      { charId: 'zhou_cang', x: 2, y: 5, faction: 'player' },
      { charId: 'cao_ren', x: 8, y: 4, faction: 'enemy', isCommander: true, aiType: 'hold' },
      { charId: 'xu_huang', x: 10, y: 4, faction: 'enemy', aiType: 'aggressive' }
    ]
  },

  // ==================== 종장: 중원 결전 & 천하 통일 ====================
  {
    id: 17,
    code: 'yiling',
    chapter: 5,
    chapterTitle: '종장: 중원 결전 & 천하 통일',
    name: '이릉 전투 (복수전)',
    description: '의형제 관우와 장비의 복수를 위해 동오를 친 유비. 육손의 화공을 극복하고 오나라와 연합을 맺는다.',
    width: 14,
    height: 10,
    mapData: generateMap([
      'MMMMMMMMMMMMMM',
      'MMFFFFFFFFFFMM',
      'MFFFFFFFFFFFFM',
      '..FFFFFFFFFF..',
      '..FFFFFFFFFF..',
      '..FFFFFFFFFF..',
      '..FFFFFFFFFF..',
      'MFFFFFFFFFFFFM',
      'MMFFFFFFFFFFMM',
      'MMMMMMMMMMMMMM'
    ]),
    maxTurns: 35,
    victoryCondition: '육손 격파',
    defeatCondition: '유비의 퇴각',
    playerDeploymentLimit: 8,
    requiredPlayerCharIds: ['liu_bei'],
    clearGold: 3500,
    clearExpBonus: 250,
    initialDeployments: [
      { charId: 'liu_bei', x: 2, y: 4, faction: 'player', isCommander: true },
      { charId: 'zhao_yun', x: 2, y: 3, faction: 'player' },
      { charId: 'lu_xun', x: 11, y: 4, faction: 'enemy', isCommander: true, aiType: 'hold' },
      { charId: 'sun_quan', x: 12, y: 4, faction: 'enemy', aiType: 'hold' }
    ]
  },
  {
    id: 18,
    code: 'ye_castle_final',
    chapter: 5,
    chapterTitle: '종장: 중원 결전 & 천하 통일',
    name: '업성 최종결전 (천하 통일)',
    description: '촉과 오의 연합군이 조조의 마지막 거점 업성으로 총진격한다. 400년 한나라의 부흥을 건 건곤일척의 최후 승부!',
    width: 14,
    height: 10,
    mapData: generateMap([
      '##############',
      '#CCCCCCCCCCCC#',
      '#CBB......BBC#',
      '#C..TT..TT..C#',
      '#C..........C#',
      '#C..........C#',
      '#C..TT..TT..C#',
      '#CBB......BBC#',
      '#CCCCCCCCCCCC#',
      '######GG######'
    ]),
    maxTurns: 40,
    victoryCondition: '조조 격파 및 한실 부흥',
    defeatCondition: '유비의 퇴각',
    playerDeploymentLimit: 10,
    requiredPlayerCharIds: ['liu_bei', 'guan_yu', 'zhang_fei', 'zhuge_liang', 'zhao_yun'],
    clearGold: 10000,
    clearExpBonus: 500,
    initialDeployments: [
      { charId: 'liu_bei', x: 6, y: 8, faction: 'player', isCommander: true },
      { charId: 'guan_yu', x: 5, y: 8, faction: 'player' },
      { charId: 'zhang_fei', x: 7, y: 8, faction: 'player' },
      { charId: 'zhuge_liang', x: 6, y: 9, faction: 'player' },
      { charId: 'zhao_yun', x: 4, y: 8, faction: 'player' },
      { charId: 'huang_zhong', x: 8, y: 8, faction: 'player' },
      { charId: 'ma_chao', x: 3, y: 8, faction: 'player' },
      { charId: 'wei_yan', x: 9, y: 8, faction: 'player' },

      // 조조 최후의 수비군
      { charId: 'cao_cao', x: 6, y: 2, faction: 'enemy', isCommander: true, aiType: 'hold' },
      { charId: 'sima_yi', x: 7, y: 2, faction: 'enemy', aiType: 'hold' },
      { charId: 'xiahou_dun', x: 5, y: 3, faction: 'enemy', aiType: 'aggressive' },
      { charId: 'zhang_liao', x: 7, y: 3, faction: 'enemy', aiType: 'aggressive' },
      { charId: 'xu_chu', x: 4, y: 4, faction: 'enemy', aiType: 'aggressive' },
      { charId: 'xu_huang', x: 8, y: 4, faction: 'enemy', aiType: 'aggressive' }
    ],
    duels: [
      {
        playerCharId: 'guan_yu',
        enemyCharId: 'zhang_liao',
        dialogueLines: [
          { speaker: '관우', text: '문원, 오늘 이 자리에서 우리의 오랜 인연도 끝이 나겠구려.' },
          { speaker: '장료', text: '운장 형님! 후회 없이 무인으로서 검을 맞대겠소!' }
        ],
        winner: 'player',
        rewardExp: 150,
        enemyRetreats: true
      }
    ],
    treasures: [
      { x: 4, y: 3, itemId: 'imperial_seal' },
      { x: 8, y: 3, itemId: 'elixir' }
    ],
    preBattleDialogue: [
      { speaker: '유비', text: '조조! 마침내 그대의 패도도 오늘로 끝이 났소!' },
      { speaker: '조조', text: '유현덕... 천하의 영웅은 오직 나와 그대뿐이라 했거늘, 최후의 승부를 겨뤄보자!' }
    ],
    postBattleDialogue: [
      { speaker: '조조', text: '크윽... 현덕... 하늘이 그대를 택했단 말인가...' },
      { speaker: '유비', text: '천하의 백성들이 마침내 평화를 되찾게 되었소. 의형제들이여, 한실의 부흥을 알리자!' }
    ]
  }
];
