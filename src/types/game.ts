// 삼국지 영걸전 핵심 타입 정의

export type Faction = 'player' | 'enemy' | 'ally';

export type UnitClassType =
  // 보병계
  | 'infantry_light'   // 단병
  | 'infantry_heavy'   // 장병
  | 'infantry_guard'   // 근위병
  // 기병계
  | 'cavalry_light'    // 경기병
  | 'cavalry_heavy'    // 중기병
  | 'cavalry_elite'    // 친위대
  // 궁병계
  | 'archer_short'     // 궁병
  | 'archer_repeater'  // 연노병
  | 'archer_catapult'  // 발석차
  // 적병계
  | 'bandit_scout'     // 산적
  | 'bandit_raider'    // 흉도
  | 'bandit_chivalric' // 의적
  // 무도가계
  | 'martial_artist'   // 무도가
  | 'martial_master'   // 권사
  // 특수계
  | 'military_band'    // 군악대 (사기 회복)
  | 'supply_wagon'     // 수송대 (체력 회복)
  | 'sorcerer_apprentice' // 요술사
  | 'sorcerer_master'  // 주술사 / 환술사
  | 'tribal_warrior';  // 이민족

export type TerrainType =
  | 'plain'     // 평지
  | 'grass'     // 초원
  | 'forest'    // 숲
  | 'mountain'  // 산
  | 'river'     // 강
  | 'bridge'    // 다리
  | 'swamp'     // 습지
  | 'wasteland' // 황무지
  | 'castle'    // 성내
  | 'wall'      // 성벽
  | 'gate'      // 관문
  | 'village'   // 마을 (회복)
  | 'barracks'  // 병영 (회복)
  | 'treasure'; // 보물창고

export interface TerrainDef {
  id: TerrainType;
  name: string;
  defenseMod: number; // 방어 보정율 (1.0 = 100%)
  healPerTurn: number; // 턴당 회복 비율 (0 = 없음, 0.2 = 20%)
  bgColor: string;
  tileIndex: number;
}

export interface UnitClassDef {
  id: UnitClassType;
  name: string;
  category: 'infantry' | 'cavalry' | 'archer' | 'bandit' | 'martial' | 'special';
  movement: number;
  attackRangeMin: number;
  attackRangeMax: number;
  canCounterAttack: boolean;
  promotionTo?: UnitClassType;
  promotionLevel?: number;
  promotionItem?: string;
  terrainCosts: Partial<Record<TerrainType, number>>; // 이동력 소모치 (-1이면 진입불가)
  color: string;
}

export type ItemType = 'weapon' | 'armor' | 'horse' | 'manual' | 'consumable' | 'treasure';

export interface ItemDef {
  id: string;
  name: string;
  type: ItemType;
  price: number;
  description: string;
  attackBonus?: number;
  defenseBonus?: number;
  movementBonus?: number;
  hpRestore?: number;
  mpRestore?: number;
  cureStatus?: boolean;
  promotesClass?: UnitClassType;
  icon: string;
}

export type TacticCategory = 'fire' | 'water' | 'rock' | 'status' | 'recovery' | 'support';

export interface TacticDef {
  id: string;
  name: string;
  category: TacticCategory;
  mpCost: number;
  range: number;
  area: 'single' | 'cross' | 'diamond' | 'all_around';
  power: number;
  description: string;
  allowedTerrains?: TerrainType[];
  effectType: 'damage' | 'heal' | 'confuse' | 'cure' | 'morale_up' | 'morale_down';
}

export interface CharacterDef {
  id: string;
  name: string;
  title?: string;
  courtesyName?: string; // 자 (예: 현덕, 운장, 익덕)
  force: 'shu' | 'wei' | 'wu' | 'other';
  baseWar: number;       // 무력 (1~100)
  baseInt: number;       // 지력 (1~100)
  baseLead: number;      // 통솔력 (1~100)
  defaultClass: UnitClassType;
  avatarColor: string;
  portrait: string;      // 초상화 식별자 또는 스타일
  spriteType: string;
  description: string;
  initialItems?: string[];
  initialTactics?: string[];
}

export interface BattleUnit {
  uid: string;           // 전투 고유 인스턴스 ID
  charId: string;        // 캐릭터 ID
  name: string;
  faction: Faction;
  classType: UnitClassType;
  level: number;
  exp: number;
  curHp: number;
  maxHp: number;
  curMp: number;
  maxMp: number;
  war: number;           // 무력
  intel: number;         // 지력
  lead: number;          // 통솔
  attack: number;
  defense: number;
  x: number;
  y: number;
  hasActed: boolean;
  status: 'normal' | 'confused' | 'poisoned';
  equippedItems: string[];
  tactics: string[];
  isCommander?: boolean;
  facing?: 'up' | 'down' | 'left' | 'right';
  morale: number;        // 사기(士氣, 0~100)
}

export interface DuelDef {
  playerCharId: string;
  enemyCharId: string;
  triggerCondition?: 'adjacent';
  dialogueLines: { speaker: string; text: string }[];
  winner: 'player' | 'enemy';
  rewardExp: number;
  enemyRetreats: boolean;
}

export interface StageDeployment {
  charId: string;
  x: number;
  y: number;
  faction: Faction;
  level?: number;
  classType?: UnitClassType;
  isCommander?: boolean;
  aiType?: 'aggressive' | 'hold' | 'guard_commander' | 'patrol';
}

export interface StageDef {
  id: number;
  code: string;
  chapter: number;
  chapterTitle: string;
  name: string;
  description: string;
  width: number;
  height: number;
  mapData: TerrainType[][];
  maxTurns: number;
  victoryCondition: string;
  defeatCondition: string;
  playerDeploymentLimit: number;
  requiredPlayerCharIds: string[]; // 필수 출진 (예: 유비)
  initialDeployments: StageDeployment[];
  reinforcements?: {
    turn: number;
    deployments: StageDeployment[];
    message: string;
  }[];
  duels?: DuelDef[];
  treasures?: { x: number; y: number; itemId: string; isClaimed?: boolean }[];
  clearGold: number;
  clearExpBonus: number;
  preBattleDialogue?: { speaker: string; text: string }[];
  postBattleDialogue?: { speaker: string; text: string }[];
  escapePoint?: { x: number; y: number }; // 탈출 승리 조건 지점 (예: 유비 탈출)
}

export interface BattleSaveData {
  stageId: number;
  currentTurn: number;
  phase: 'player' | 'enemy';
  weather: 'sunny' | 'rainy' | 'cloudy';
  units: BattleUnit[];
  claimedTreasures: string[];
  timestamp: number;
}

export interface GameState {
  currentStageId: number;
  gold: number;
  roster: {
    charId: string;
    level: number;
    exp: number;
    classType: UnitClassType;
    curHp: number;
    maxHp: number;
    curMp: number;
    maxMp: number;
    war: number;
    intel: number;
    lead: number;
    equippedItems: string[];
    tactics: string[];
    morale?: number;
  }[];
  inventory: string[]; // 보관 중인 아이템들
  isCheatedLevel99: boolean;
  clearedStages: number[];
  battleSave?: BattleSaveData | null;
}
