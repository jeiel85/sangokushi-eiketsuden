// 삼국지 영걸전 전투 엔진 및 데미지 / 경험치 / 승급 공식

import { TERRAINS, UNIT_CLASSES } from '../data/classes';
import { ITEMS } from '../data/items';
import { TACTICS } from '../data/tactics';
import type { BattleUnit, StageDef, TerrainType } from '../types/game';

export interface CombatResult {
  damage: number;
  isCritical: boolean;
  isBackAttack?: boolean;
  isFlankAttack?: boolean;
  isKilled: boolean;
  expGained: number;
  isLevelUp: boolean;
  counterDamage?: number;
  counterKilled?: boolean;
}

export class BattleEngine {
  // 1. 이동 가능한 타일 좌표 목록 계산 (BFS 기반 지형 비용 & 유닛 충돌 판정)
  public static getMovableTiles(
    unit: BattleUnit,
    allUnits: BattleUnit[],
    mapData: TerrainType[][]
  ): { x: number; y: number }[] {
    const classDef = UNIT_CLASSES[unit.classType];
    if (!classDef) return [{ x: unit.x, y: unit.y }];

    const maxMove = classDef.movement + this.getEquipmentBonus(unit, 'movement');
    const height = mapData.length;
    const width = mapData[0]?.length || 0;

    // 점유된 타일 맵 (적군 타일은 통과 불가, 아군은 통과 가능하나 최종 정지는 불가)
    const occupiedMap = new Map<string, BattleUnit>();
    allUnits.forEach(u => {
      if (u.curHp > 0) {
        occupiedMap.set(`${u.x},${u.y}`, u);
      }
    });

    const costSoFar = new Map<string, number>();
    const queue: { x: number; y: number; cost: number }[] = [];

    queue.push({ x: unit.x, y: unit.y, cost: 0 });
    costSoFar.set(`${unit.x},${unit.y}`, 0);

    const directions = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 }
    ];

    while (queue.length > 0) {
      const current = queue.shift()!;

      for (const dir of directions) {
        const nx = current.x + dir.x;
        const ny = current.y + dir.y;

        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;

        const terrain = mapData[ny][nx];
        const moveCost = classDef.terrainCosts[terrain] ?? 1;

        // 이동 불가 지형
        if (moveCost === -1) continue;

        const otherUnit = occupiedMap.get(`${nx},${ny}`);
        // 적 유닛이 있는 타일은 관통 이동 불가 (ZOC)
        if (otherUnit && otherUnit.faction !== unit.faction) {
          continue;
        }

        const newCost = current.cost + moveCost;
        if (newCost <= maxMove) {
          const key = `${nx},${ny}`;
          if (!costSoFar.has(key) || newCost < costSoFar.get(key)!) {
            costSoFar.set(key, newCost);
            queue.push({ x: nx, y: ny, cost: newCost });
          }
        }
      }
    }

    // 최종 결과에서 다른 유닛(아군 포함)이 이미 서 있는 위치는 제외 (본인 시작 위치 제외)
    const result: { x: number; y: number }[] = [];
    for (const [key] of costSoFar.entries()) {
      const [kx, ky] = key.split(',').map(Number);
      const blocker = occupiedMap.get(key);
      if (!blocker || blocker.uid === unit.uid) {
        result.push({ x: kx, y: ky });
      }
    }

    return result;
  }

  // 2. 공격 가능 대상 타일 계산 (사정거리 min ~ max)
  public static getAttackableTiles(
    unit: BattleUnit,
    fromX: number,
    fromY: number,
    mapWidth: number,
    mapHeight: number
  ): { x: number; y: number }[] {
    const classDef = UNIT_CLASSES[unit.classType];
    const minRange = classDef.attackRangeMin;
    const maxRange = classDef.attackRangeMax;

    const targets: { x: number; y: number }[] = [];

    for (let dy = -maxRange; dy <= maxRange; dy++) {
      for (let dx = -maxRange; dx <= maxRange; dx++) {
        const dist = Math.abs(dx) + Math.abs(dy);
        if (dist >= minRange && dist <= maxRange) {
          const tx = fromX + dx;
          const ty = fromY + dy;
          if (tx >= 0 && ty >= 0 && tx < mapWidth && ty < mapHeight) {
            targets.push({ x: tx, y: ty });
          }
        }
      }
    }

    return targets;
  }

  // 3. 책략 사정거리 타일 계산
  public static getTacticTargetTiles(
    tacticId: string,
    fromX: number,
    fromY: number,
    mapWidth: number,
    mapHeight: number
  ): { x: number; y: number }[] {
    const tactic = TACTICS[tacticId];
    if (!tactic) return [];

    const range = tactic.range;
    const targets: { x: number; y: number }[] = [];

    for (let dy = -range; dy <= range; dy++) {
      for (let dx = -range; dx <= range; dx++) {
        const dist = Math.abs(dx) + Math.abs(dy);
        if (dist <= range && dist > 0) {
          const tx = fromX + dx;
          const ty = fromY + dy;
          if (tx >= 0 && ty >= 0 && tx < mapWidth && ty < mapHeight) {
            targets.push({ x: tx, y: ty });
          }
        }
      }
    }

    return targets;
  }

  // 4. 일반 물리 공격 데미지 및 반격 처리 공식 (방향성 배후/측면 공격 반영)
  public static executeAttack(
    attacker: BattleUnit,
    defender: BattleUnit,
    defenderTerrain: TerrainType
  ): CombatResult {
    const atkWarBonus = this.getEquipmentBonus(attacker, 'attack');
    const defLeadBonus = this.getEquipmentBonus(defender, 'defense');

    const totalAtk = attacker.attack + atkWarBonus;
    const totalDef = defender.defense + defLeadBonus;

    // 지형 보정률 (숲 1.2, 성내 1.3 등)
    const tDefMod = TERRAINS[defenderTerrain]?.defenseMod || 1.0;

    // 병종 상성 (보병 > 기병 > 궁병 > 보병)
    const classMod = this.getClassAdvantageModifier(attacker.classType, defender.classType);

    // 방향 보정 (배후 공격 +20%, 측면 공격 +10%)
    let directionMod = 1.0;
    let isBackAttack = false;
    let isFlankAttack = false;

    const defFacing = defender.facing || 'down';
    const dx = attacker.x - defender.x;
    const dy = attacker.y - defender.y;

    if (
      (defFacing === 'right' && dx < 0) ||
      (defFacing === 'left' && dx > 0) ||
      (defFacing === 'down' && dy < 0) ||
      (defFacing === 'up' && dy > 0)
    ) {
      directionMod = 1.2;
      isBackAttack = true;
    } else if (
      (defFacing === 'right' && dx === 0) ||
      (defFacing === 'left' && dx === 0) ||
      (defFacing === 'down' && dy === 0) ||
      (defFacing === 'up' && dy === 0)
    ) {
      directionMod = 1.1;
      isFlankAttack = true;
    }

    // 기본 공식: (Atk * 3 - Def * 2) * 상성 * 방향보정 / 지형
    let baseDamage = (totalAtk * 3 - totalDef * 2);
    if (baseDamage < 10) baseDamage = Math.max(5, Math.round(totalAtk * 0.4));

    // 크리티컬 확률 (무력 차이 반영)
    const critChance = Math.max(0.05, (attacker.war - defender.war) * 0.005 + 0.08);
    const isCritical = Math.random() < critChance;
    const critMultiplier = isCritical ? 1.5 : 1.0;

    // 랜덤 난수 (0.9 ~ 1.1)
    const variance = 0.9 + Math.random() * 0.2;

    const finalDamage = Math.max(
      1,
      Math.round((baseDamage * classMod * directionMod * critMultiplier * variance) / tDefMod)
    );

    // 수비자 HP 차감
    const newDefenderHp = Math.max(0, defender.curHp - finalDamage);
    defender.curHp = newDefenderHp;
    const isKilled = newDefenderHp === 0;

    // 경험치 획득 계산 (영걸전 공식)
    let expGained = 8 + Math.floor(Math.random() * 5); // 기본 행동 EXP
    if (isKilled) {
      const levelDiff = defender.level - attacker.level;
      expGained += Math.max(12, 32 + levelDiff * 4); // 격파 보너스 EXP
    }

    // 공격자 경험치 및 레벨업 체크
    const isLevelUp = this.applyExp(attacker, expGained);

    // 반격 (수비자가 살아있고, 사정거리 내이며, 반격 가능한 병종인 경우)
    let counterDamage: number | undefined;
    let counterKilled = false;

    if (!isKilled && defender.status !== 'confused') {
      const defClass = UNIT_CLASSES[defender.classType];
      const dist = Math.abs(attacker.x - defender.x) + Math.abs(attacker.y - defender.y);

      if (defClass.canCounterAttack && dist >= defClass.attackRangeMin && dist <= defClass.attackRangeMax) {
        let counterBase = (totalDef * 2.8 - totalAtk * 2);
        if (counterBase < 5) counterBase = Math.max(3, Math.round(totalDef * 0.3));

        const counterClassMod = this.getClassAdvantageModifier(defender.classType, attacker.classType);
        counterDamage = Math.max(1, Math.round(counterBase * counterClassMod * (0.9 + Math.random() * 0.2)));

        attacker.curHp = Math.max(0, attacker.curHp - counterDamage);
        if (attacker.curHp === 0) {
          counterKilled = true;
        }
      }
    }

    return {
      damage: finalDamage,
      isCritical,
      isBackAttack,
      isFlankAttack,
      isKilled,
      expGained,
      isLevelUp,
      counterDamage,
      counterKilled
    };
  }

  // 5. 책략 발동 계산 (날씨 시스템 연동)
  public static executeTactic(
    caster: BattleUnit,
    target: BattleUnit,
    tacticId: string,
    targetTerrain: TerrainType,
    weather: 'sunny' | 'rainy' | 'cloudy' = 'sunny'
  ): { value: number; message: string; expGained: number; isLevelUp: boolean; isKilled: boolean } {
    const tactic = TACTICS[tacticId];
    if (!tactic || caster.curMp < tactic.mpCost) {
      return { value: 0, message: '책략치 부족', expGained: 0, isLevelUp: false, isKilled: false };
    }

    // 비(우천)일 때 화계 불가
    if (weather === 'rainy' && tactic.category === 'fire') {
      return {
        value: 0,
        message: '우천으로 화계 불가!',
        expGained: 0,
        isLevelUp: false,
        isKilled: false
      };
    }

    caster.curMp -= tactic.mpCost;

    if (tactic.effectType === 'heal') {
      // 치유계
      const healAmount = Math.round(tactic.power + caster.intel * 1.5);
      const prevHp = target.curHp;
      target.curHp = Math.min(target.maxHp, target.curHp + healAmount);
      const actualHeal = target.curHp - prevHp;

      const exp = 10 + Math.floor(Math.random() * 4);
      const isLevelUp = this.applyExp(caster, exp);

      return {
        value: actualHeal,
        message: `+${actualHeal} 회복!`,
        expGained: exp,
        isLevelUp,
        isKilled: false
      };
    } else if (tactic.effectType === 'confuse') {
      // 상태이상계
      const successChance = Math.max(0.4, (caster.intel - target.intel) * 0.01 + 0.7);
      const isSuccess = Math.random() < successChance;

      if (isSuccess) {
        target.status = 'confused';
        const exp = 12;
        const isLevelUp = this.applyExp(caster, exp);
        return {
          value: 0,
          message: '혼란 상태!',
          expGained: exp,
          isLevelUp,
          isKilled: false
        };
      } else {
        return {
          value: 0,
          message: '계책 간파당함!',
          expGained: 4,
          isLevelUp: false,
          isKilled: false
        };
      }
    } else if (tactic.effectType === 'cure') {
      // 상태이상 해제
      target.status = 'normal';
      const exp = 8;
      const isLevelUp = this.applyExp(caster, exp);
      return {
        value: 0,
        message: '정신을 차림!',
        expGained: exp,
        isLevelUp,
        isKilled: false
      };
    } else {
      // 공격형 책략 (화계, 수계, 낙석계)
      const intelDiff = caster.intel * 2.2 - target.intel * 1.2;
      let tacticDamage = Math.round(tactic.power + intelDiff * 0.8);

      // 지형 및 날씨 보너스
      if (tactic.category === 'fire' && targetTerrain === 'forest') {
        tacticDamage = Math.round(tacticDamage * 1.3); // 숲에서 화계 30% 증폭!
      } else if (tactic.category === 'water') {
        if (targetTerrain === 'river' || targetTerrain === 'swamp') {
          tacticDamage = Math.round(tacticDamage * 1.3); // 강/습지에서 수계 30% 증폭!
        }
        if (weather === 'rainy') {
          tacticDamage = Math.round(tacticDamage * 1.25); // 호우로 인한 수계 25% 추가 증폭!
        }
      }

      tacticDamage = Math.max(15, Math.round(tacticDamage * (0.9 + Math.random() * 0.2)));

      target.curHp = Math.max(0, target.curHp - tacticDamage);
      const isKilled = target.curHp === 0;

      let exp = 10;
      if (isKilled) {
        exp += Math.max(12, 30 + (target.level - caster.level) * 4);
      }

      const isLevelUp = this.applyExp(caster, exp);

      return {
        value: tacticDamage,
        message: `-${tacticDamage}`,
        expGained: exp,
        isLevelUp,
        isKilled
      };
    }
  }

  // 경험치 누적 및 100 경험치 레벨업 처리
  public static applyExp(unit: BattleUnit, exp: number): boolean {
    if (unit.faction !== 'player') return false; // 플레이어 진영만 레벨업 처리

    unit.exp += exp;
    if (unit.exp >= 100) {
      unit.exp -= 100;
      unit.level += 1;

      // 스탯 증가 공식
      const hpGain = Math.round(unit.war * 0.18 + 10);
      const mpGain = Math.round(unit.intel * 0.12 + 4);
      const atkGain = Math.round(unit.war * 0.08 + 2);
      const defGain = Math.round(unit.lead * 0.08 + 2);

      unit.maxHp += hpGain;
      unit.maxMp += mpGain;
      unit.attack += atkGain;
      unit.defense += defGain;

      // 영걸전 특유의 레벨업 즉시 체력/책략치 완전 회복 보너스!
      unit.curHp = unit.maxHp;
      unit.curMp = unit.maxMp;

      return true;
    }
    return false;
  }

  // 장비 아이템 보너스 합산
  public static getEquipmentBonus(unit: BattleUnit, stat: 'attack' | 'defense' | 'movement'): number {
    let total = 0;
    for (const itemId of unit.equippedItems) {
      const item = ITEMS[itemId];
      if (!item) continue;
      if (stat === 'attack' && item.attackBonus) total += item.attackBonus;
      if (stat === 'defense' && item.defenseBonus) total += item.defenseBonus;
      if (stat === 'movement' && item.movementBonus) total += item.movementBonus;
    }
    return total;
  }

  // 병종 상성 배율
  private static getClassAdvantageModifier(attackerClass: string, defenderClass: string): number {
    const atkDef = UNIT_CLASSES[attackerClass as keyof typeof UNIT_CLASSES];
    const defDef = UNIT_CLASSES[defenderClass as keyof typeof UNIT_CLASSES];
    if (!atkDef || !defDef) return 1.0;

    // 기병은 궁병에 강함 (+15%)
    if (atkDef.category === 'cavalry' && defDef.category === 'archer') return 1.15;
    // 궁병은 보병에 강함 (+15%)
    if (atkDef.category === 'archer' && defDef.category === 'infantry') return 1.15;
    // 보병은 기병에 강함 (+15%)
    if (atkDef.category === 'infantry' && defDef.category === 'cavalry') return 1.15;

    return 1.0;
  }

  // 스테이지 클리어 조건 확인
  public static checkStageStatus(
    stage: StageDef,
    units: BattleUnit[],
    currentTurn: number
  ): 'ongoing' | 'victory' | 'defeat' {
    const liuBei = units.find(u => u.charId === 'liu_bei' && u.faction === 'player');
    if (!liuBei || liuBei.curHp <= 0) {
      return 'defeat'; // 유비 사망 시 패배
    }

    if (currentTurn > stage.maxTurns) {
      return 'defeat'; // 제한 턴 초과
    }

    // 적군 생존 여부
    const livingEnemies = units.filter(u => u.faction === 'enemy' && u.curHp > 0);
    if (livingEnemies.length === 0) {
      return 'victory'; // 적 전멸 승리!
    }

    // 적 총대장 격파 조건 체크
    const enemyCommander = livingEnemies.find(u => u.isCommander);
    if (!enemyCommander && livingEnemies.length > 0) {
      // 적 총대장이 쓰러졌으면 승리
      return 'victory';
    }

    return 'ongoing';
  }
}
