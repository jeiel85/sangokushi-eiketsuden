import type { BattleUnit, TerrainType } from '../types/game';
import { BattleEngine } from './battleEngine';

export interface AIAction {
  unitUid: string;
  moveToX: number;
  moveToY: number;
  actionType: 'attack' | 'tactic' | 'wait';
  targetUid?: string;
  tacticId?: string;
}

export class AIEngine {
  public static decideUnitAction(
    unit: BattleUnit,
    allUnits: BattleUnit[],
    mapData: TerrainType[][]
  ): AIAction {
    // 혼란 상태면 행동 건너뜀
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
}
