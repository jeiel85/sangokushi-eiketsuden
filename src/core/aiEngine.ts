import { TERRAINS } from '../data/classes';
import { ITEMS } from '../data/items';
import { TACTICS } from '../data/tactics';
import type { BattleUnit, StageDef, TerrainType } from '../types/game';
import { BattleEngine } from './battleEngine';

export interface AIAction {
  unitUid: string;
  moveToX: number;
  moveToY: number;
  actionType: 'attack' | 'tactic' | 'item' | 'wait';
  targetUid?: string;
  tacticId?: string;
  itemIndex?: number;
}

export class AIEngine {
  /**
   * 적군 AI 유닛 행동 결정 로직
   */
  public static decideUnitAction(
    unit: BattleUnit,
    allUnits: BattleUnit[],
    mapData: TerrainType[][]
  ): AIAction {
    // 혼란 상태면 행동 불가
    if (unit.status === 'confused') {
      return {
        unitUid: unit.uid,
        moveToX: unit.x,
        moveToY: unit.y,
        actionType: 'wait'
      };
    }

    const height = mapData.length;
    const width = mapData[0]?.length || 0;
    const livingPlayers = allUnits.filter(u => u.faction === 'player' && u.curHp > 0);
    if (livingPlayers.length === 0) {
      return { unitUid: unit.uid, moveToX: unit.x, moveToY: unit.y, actionType: 'wait' };
    }

    // 1. 이동 가능한 타일들
    const movableTiles = BattleEngine.getMovableTiles(unit, allUnits, mapData);

    // 2. 공격 가능 후보 탐색
    let bestTarget: BattleUnit | null = null;
    let bestMoveTile: { x: number; y: number } = { x: unit.x, y: unit.y };
    let highestPriority = -9999;

    for (const tile of movableTiles) {
      const attackableTiles = BattleEngine.getAttackableTiles(unit, tile.x, tile.y, width, height);

      for (const atkTile of attackableTiles) {
        const candidate = livingPlayers.find(p => p.x === atkTile.x && p.y === atkTile.y);
        if (candidate) {
          // 우선순위 점수: 유비 노리기 + 체력 낮은 적 우선 + 방어력 낮은 대상
          let score = 1000 - candidate.curHp;
          if (candidate.charId === 'liu_bei') score += 500;
          if (candidate.classType.startsWith('sorcerer') || candidate.classType === 'supply_wagon') score += 300;

          if (score > highestPriority) {
            highestPriority = score;
            bestTarget = candidate;
            bestMoveTile = tile;
          }
        }
      }
    }

    // 사정거리 내 공격 가능한 상대가 있으면 공격
    if (bestTarget) {
      // 만약 책략이 있고 MP가 충분하며 지력이 높다면 책략 우선 고려
      if (unit.tactics && unit.tactics.length > 0 && unit.curMp >= 8 && unit.intel >= 70) {
        const offensiveTactic = unit.tactics.find(t => t.startsWith('pyro') || t.startsWith('water') || t.startsWith('rock'));
        if (offensiveTactic) {
          return {
            unitUid: unit.uid,
            moveToX: bestMoveTile.x,
            moveToY: bestMoveTile.y,
            actionType: 'tactic',
            targetUid: bestTarget.uid,
            tacticId: offensiveTactic
          };
        }
      }

      return {
        unitUid: unit.uid,
        moveToX: bestMoveTile.x,
        moveToY: bestMoveTile.y,
        actionType: 'attack',
        targetUid: bestTarget.uid
      };
    }

    // 공격할 대상이 주변에 없는 경우: 가장 가까운 플레이어를 향해 진격
    let closestPlayer = livingPlayers[0];
    let minDistance = 9999;
    for (const p of livingPlayers) {
      const dist = Math.abs(p.x - unit.x) + Math.abs(p.y - unit.y);
      if (dist < minDistance) {
        minDistance = dist;
        closestPlayer = p;
      }
    }

    // 이동 가능한 타일 중 가장 대상 플레이어와 가까워지는 타일 선택
    let bestAdvanceTile = { x: unit.x, y: unit.y };
    let bestDist = 9999;

    for (const tile of movableTiles) {
      const d = Math.abs(tile.x - closestPlayer.x) + Math.abs(tile.y - closestPlayer.y);
      if (d < bestDist) {
        bestDist = d;
        bestAdvanceTile = tile;
      }
    }

    return {
      unitUid: unit.uid,
      moveToX: bestAdvanceTile.x,
      moveToY: bestAdvanceTile.y,
      actionType: 'wait'
    };
  }

  /**
   * 플레이어 아군 유닛 자동사냥(Auto-Battle) 지능형 전술 판단 로직
   * - 생존 우선 (체력 저하 시 회복 책략 및 아이템 사용)
   * - 위험 아군 치유 및 사기 고무
   * - 격파 가능한 적 우선 및 적 지휘관/원거리 집중 타격
   * - 이동 범위 내 미루팅 보물창고 자동 획득
   * - 최적 지형 방어 타일 선점 및 전진
   */
  public static decidePlayerAutoAction(
    unit: BattleUnit,
    allUnits: BattleUnit[],
    mapData: TerrainType[][],
    stage: StageDef,
    claimedTreasures?: Set<string>,
    weather: 'sunny' | 'rainy' | 'cloudy' = 'sunny'
  ): AIAction {
    // 0. 혼란 상태면 대기
    if (unit.status === 'confused') {
      return { unitUid: unit.uid, moveToX: unit.x, moveToY: unit.y, actionType: 'wait' };
    }

    const height = mapData.length;
    const width = mapData[0]?.length || 0;
    const livingEnemies = allUnits.filter(u => u.faction === 'enemy' && u.curHp > 0);
    const livingAllies = allUnits.filter(u => u.faction === 'player' && u.curHp > 0);

    if (livingEnemies.length === 0) {
      return { unitUid: unit.uid, moveToX: unit.x, moveToY: unit.y, actionType: 'wait' };
    }

    const movableTiles = BattleEngine.getMovableTiles(unit, allUnits, mapData);

    // 1. [자가 생존 긴급 치유] 체력이 40% 이하일 때
    const hpRatio = unit.curHp / unit.maxHp;
    if (hpRatio <= 0.40) {
      // 회복 책략 확인
      const healTactic = unit.tactics?.find(t => {
        const def = TACTICS[t];
        return def && def.effectType === 'heal' && unit.curMp >= def.mpCost;
      });
      if (healTactic) {
        return {
          unitUid: unit.uid,
          moveToX: unit.x,
          moveToY: unit.y,
          actionType: 'tactic',
          targetUid: unit.uid,
          tacticId: healTactic
        };
      }

      // 회복 도구 확인
      if (unit.equippedItems && unit.equippedItems.length > 0) {
        const itemIdx = unit.equippedItems.findIndex(id => {
          const item = ITEMS[id];
          return item && item.type === 'consumable' && (item.hpRestore ?? 0) > 0;
        });
        if (itemIdx >= 0) {
          return {
            unitUid: unit.uid,
            moveToX: unit.x,
            moveToY: unit.y,
            actionType: 'item',
            targetUid: unit.uid,
            itemIndex: itemIdx
          };
        }
      }
    }

    // 2. [아군 지원/치유] 수송대/책사 또는 치유 책략 보유자가 빈사 아군 치유
    const healTactic = unit.tactics?.find(t => {
      const def = TACTICS[t];
      return def && def.effectType === 'heal' && unit.curMp >= def.mpCost;
    });

    if (healTactic) {
      const criticalAlly = livingAllies
        .filter(a => a.curHp / a.maxHp <= 0.50)
        .sort((a, b) => (a.curHp / a.maxHp) - (b.curHp / b.maxHp))[0];

      if (criticalAlly) {
        for (const tile of movableTiles) {
          const tTargets = BattleEngine.getTacticTargetTiles(healTactic, tile.x, tile.y, width, height);
          tTargets.push({ x: tile.x, y: tile.y }); // 본인 타일 포함
          if (tTargets.some(t => t.x === criticalAlly.x && t.y === criticalAlly.y)) {
            return {
              unitUid: unit.uid,
              moveToX: tile.x,
              moveToY: tile.y,
              actionType: 'tactic',
              targetUid: criticalAlly.uid,
              tacticId: healTactic
            };
          }
        }
      }
    }

    // 3. [공격 및 공격형 책략 탐색] 전체 이동 가능 타일에서 최적 타격 후보 산출
    interface CandidateAction {
      tile: { x: number; y: number };
      target: BattleUnit;
      type: 'attack' | 'tactic';
      tacticId?: string;
      score: number;
    }

    let bestAction: CandidateAction | null = null;

    for (const tile of movableTiles) {
      const terrain = mapData[tile.y][tile.x];
      const terrainDefMod = TERRAINS[terrain]?.defenseMod || 1.0;
      const isTreasureTile = stage.treasures?.some(t => t.x === tile.x && t.y === tile.y && !claimedTreasures?.has(`${t.x},${t.y}`));

      // 3-1. 물리 공격 검토
      const atkTiles = BattleEngine.getAttackableTiles(unit, tile.x, tile.y, width, height);
      for (const atkTile of atkTiles) {
        const target = livingEnemies.find(e => e.x === atkTile.x && e.y === atkTile.y);
        if (target) {
          // 예상 데미지 계산
          const estDamage = Math.max(5, Math.round((unit.attack * 3 - target.defense * 2)));
          let score = 1000 - target.curHp;

          // 즉시 격파 가능한 경우 파격적인 우선순위 부여 (+5000점)
          if (target.curHp <= estDamage) {
            score += 5000;
          }

          // 적 지휘관 우선 (+1500점)
          const isEnemyCommander = target.isCommander || stage.initialDeployments.some(d => d.charId === target.charId && d.isCommander);
          if (isEnemyCommander) {
            score += 1500;
          }

          // 위험한 원거리 및 지원 병종 우선 (+400점)
          if (target.classType.startsWith('sorcerer') || target.classType === 'supply_wagon' || target.classType.startsWith('archer')) {
            score += 400;
          }

          // 이동 타일이 보물 타일인 경우 보너스 (+1200점)
          if (isTreasureTile) {
            score += 1200;
          }

          // 방어 지형 가산점
          score += Math.round((terrainDefMod - 1.0) * 500);

          if (!bestAction || score > bestAction.score) {
            bestAction = {
              tile,
              target,
              type: 'attack',
              score
            };
          }
        }
      }

      // 3-2. 공격 책략 검토 (화계, 수계, 낙석계 등)
      if (unit.tactics && unit.tactics.length > 0 && unit.curMp >= 8) {
        for (const tId of unit.tactics) {
          const tDef = TACTICS[tId];
          if (!tDef || unit.curMp < tDef.mpCost) continue;
          if (tDef.effectType !== 'damage') continue;
          // 비가 올 때 화계 금지 룰 준수
          if (weather === 'rainy' && tDef.category === 'fire') continue;

          const tTargets = BattleEngine.getTacticTargetTiles(tId, tile.x, tile.y, width, height);
          for (const tTile of tTargets) {
            const target = livingEnemies.find(e => e.x === tTile.x && e.y === tTile.y);
            if (target) {
              const intelDiff = unit.intel * 2.2 - target.intel * 1.2;
              const estDamage = Math.round(tDef.power + intelDiff * 0.8);
              let score = 1100 - target.curHp;

              if (target.curHp <= estDamage) {
                score += 5500; // 책략 킬
              }
              const isTacticCommander = target.isCommander || stage.initialDeployments.some(d => d.charId === target.charId && d.isCommander);
              if (isTacticCommander) {
                score += 1600;
              }
              if (isTreasureTile) {
                score += 1200;
              }

              if (!bestAction || score > bestAction.score) {
                bestAction = {
                  tile,
                  target,
                  type: 'tactic',
                  tacticId: tId,
                  score
                };
              }
            }
          }
        }
      }
    }

    // 최적 공격/책략 행동이 있으면 실행
    if (bestAction) {
      return {
        unitUid: unit.uid,
        moveToX: bestAction.tile.x,
        moveToY: bestAction.tile.y,
        actionType: bestAction.type,
        targetUid: bestAction.target.uid,
        tacticId: bestAction.tacticId
      };
    }

    // 4. [보물창고/마을 루팅] 사정거리 내 적이 없을 때 보물이 이동 범위 내에 있으면 우선 루팅
    if (stage.treasures && stage.treasures.length > 0) {
      const unclaimed = stage.treasures.find(t => !claimedTreasures?.has(`${t.x},${t.y}`));
      if (unclaimed) {
        const canReachTreasure = movableTiles.find(m => m.x === unclaimed.x && m.y === unclaimed.y);
        if (canReachTreasure) {
          return {
            unitUid: unit.uid,
            moveToX: canReachTreasure.x,
            moveToY: canReachTreasure.y,
            actionType: 'wait'
          };
        }
      }
    }

    // 5. [최적 진격] 가장 가까운 적을 향해 이동 (지형 방어력 높은 타일 우대)
    let closestEnemy = livingEnemies[0];
    let minDistance = 9999;
    for (const e of livingEnemies) {
      const dist = Math.abs(e.x - unit.x) + Math.abs(e.y - unit.y);
      if (dist < minDistance) {
        minDistance = dist;
        closestEnemy = e;
      }
    }

    let bestAdvanceTile = { x: unit.x, y: unit.y };
    let bestDist = 9999;
    let bestTerrainScore = -999;

    for (const tile of movableTiles) {
      const d = Math.abs(tile.x - closestEnemy.x) + Math.abs(tile.y - closestEnemy.y);
      const tDef = TERRAINS[mapData[tile.y][tile.x]]?.defenseMod || 1.0;

      if (d < bestDist || (d === bestDist && tDef > bestTerrainScore)) {
        bestDist = d;
        bestTerrainScore = tDef;
        bestAdvanceTile = tile;
      }
    }

    return {
      unitUid: unit.uid,
      moveToX: bestAdvanceTile.x,
      moveToY: bestAdvanceTile.y,
      actionType: 'wait'
    };
  }
}
