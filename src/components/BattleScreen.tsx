// 삼국지 영걸전 메인 전투 화면 (그리드 턴제 SRPG 전투 엔진 연동)

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AIEngine } from '../core/aiEngine';
import { soundManager } from '../core/audio';
import { BattleEngine } from '../core/battleEngine';
import { GameRenderer } from '../core/renderer';
import type { AnimationEffect, DamageFloater } from '../core/renderer';
import { CHARACTERS } from '../data/characters';
import { TERRAINS, UNIT_CLASSES } from '../data/classes';
import { ITEMS } from '../data/items';
import { TACTICS } from '../data/tactics';
import type { BattleSaveData, BattleUnit, DuelDef, StageDef } from '../types/game';
import { DuelModal } from './DuelModal';
import { UnitDetailModal } from './UnitDetailModal';

interface BattleScreenProps {
  stage: StageDef;
  playerUnits: BattleUnit[];
  savedBattleState?: BattleSaveData | null;
  onLootTreasure?: (itemId: string, gold?: number) => void;
  onVictory: (clearedStageId: number, rewardGold: number, rewardExp: number) => void;
  onDefeat: () => void;
  onRetreat: () => void;
  onSaveBattle?: (saveData: BattleSaveData) => void;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({
  stage,
  playerUnits,
  savedBattleState,
  onLootTreasure,
  onVictory,
  onDefeat,
  onRetreat,
  onSaveBattle
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<GameRenderer>(new GameRenderer(48));

  const [currentTurn, setCurrentTurn] = useState(1);
  const [phase, setPhase] = useState<'player' | 'enemy'>('player');
  const [weather, setWeather] = useState<'sunny' | 'rainy' | 'cloudy'>('sunny');
  const [units, setUnits] = useState<BattleUnit[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [movableTiles, setMovableTiles] = useState<{ x: number; y: number }[]>([]);
  const [attackableTiles, setAttackableTiles] = useState<{ x: number; y: number }[]>([]);
  const [activeActionMenu, setActiveActionMenu] = useState<'root' | 'tactics' | 'items' | null>(null);
  const [selectedTacticId, setSelectedTacticId] = useState<string | null>(null);
  const [selectedItemIdx, setSelectedItemIdx] = useState<number | null>(null);
  const [hoveredTile, setHoveredTile] = useState<{ x: number; y: number } | null>(null);
  const [unitOriginalPos, setUnitOriginalPos] = useState<{ x: number; y: number } | null>(null);
  const [claimedTreasures, setClaimedTreasures] = useState<Set<string>>(new Set());

  // 스토리 회화 컷씬 모달
  const [dialogueCutscene, setDialogueCutscene] = useState<{ mode: 'pre' | 'post'; index: number } | null>(null);

  // 일기토 모달
  const [activeDuel, setActiveDuel] = useState<DuelDef | null>(null);

  // 장수 정보 모달
  const [inspectUnit, setInspectUnit] = useState<BattleUnit | null>(null);

  // 전투 결과 모달
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);

  // 애니메이션 이펙트 및 플로팅 데미지 상태
  const [floaters, setFloaters] = useState<DamageFloater[]>([]);
  const [effects, setEffects] = useState<AnimationEffect[]>([]);

  // 초기 유닛 배치 및 중간 저장 복원
  useEffect(() => {
    soundManager.playBgm('battle');

    // 전장 중간 저장 데이터가 있는 경우 상태 즉시 복원
    if (savedBattleState && savedBattleState.stageId === stage.id) {
      setCurrentTurn(savedBattleState.currentTurn);
      setPhase(savedBattleState.phase);
      setWeather(savedBattleState.weather);
      setUnits(savedBattleState.units);
      setClaimedTreasures(new Set(savedBattleState.claimedTreasures));
      setDialogueCutscene(null);
      return;
    }

    const combinedUnits: BattleUnit[] = playerUnits.map((pu) => ({
      ...pu,
      morale: pu.morale ?? 100
    }));

    // 스테이지 정의에 따른 적군 및 아군 NPC 배치
    stage.initialDeployments.forEach((dep, idx) => {
      if (dep.faction === 'enemy' || dep.faction === 'ally') {
        const charDef = CHARACTERS[dep.charId] || {
          name: dep.charId,
          baseWar: 70,
          baseInt: 60,
          baseLead: 65,
          defaultClass: 'infantry_light'
        };

        const classType = dep.classType || charDef.defaultClass || 'infantry_light';
        const level = dep.level || (stage.id * 2 + 1);
        const maxHp = 150 + level * 35;
        const maxMp = 30 + level * 8;

        combinedUnits.push({
          uid: `${dep.faction}-${dep.charId}-${idx}`,
          charId: dep.charId,
          name: charDef.name,
          faction: dep.faction,
          classType,
          level,
          exp: 0,
          curHp: maxHp,
          maxHp,
          curMp: maxMp,
          maxMp,
          war: charDef.baseWar,
          intel: charDef.baseInt,
          lead: charDef.baseLead,
          attack: Math.round(charDef.baseWar * 1.6 + level * 4),
          defense: Math.round(charDef.baseLead * 1.5 + level * 3),
          x: dep.x,
          y: dep.y,
          hasActed: false,
          status: 'normal',
          equippedItems: charDef.initialItems || [],
          tactics: charDef.initialTactics || ['pyro_1'],
          isCommander: dep.isCommander,
          morale: 100
        });
      }
    });

    setUnits(combinedUnits);
    setClaimedTreasures(new Set());

    if (stage.preBattleDialogue && stage.preBattleDialogue.length > 0) {
      setDialogueCutscene({ mode: 'pre', index: 0 });
    } else {
      setDialogueCutscene(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage.id, savedBattleState]);

  // 플로팅 데미지 추가 헬퍼
  const addFloater = (x: number, y: number, text: string, color: string = '#ef4444') => {
    const newFloater: DamageFloater = {
      id: Date.now() + Math.random(),
      x,
      y,
      text,
      color,
      lifetime: 0
    };
    setFloaters((prev) => [...prev, newFloater]);
  };

  // 애니메이션 이펙트 추가 헬퍼
  const addEffect = (x: number, y: number, type: AnimationEffect['type']) => {
    const newEffect: AnimationEffect = {
      id: Date.now() + Math.random(),
      type,
      x,
      y,
      progress: 0
    };
    setEffects((prev) => [...prev, newEffect]);
  };

  // 캔버스 60 FPS 렌더링 루프
  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const renderer = rendererRef.current;
      renderer.animationTick++;

      // 화면 초기화
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. 타일맵 렌더링
      renderer.renderMap(ctx, stage.mapData, 0, 0);

      // 2. 이동 범위 및 타겟 범위 하이라이트
      if (movableTiles.length > 0) {
        renderer.renderMoveRange(ctx, movableTiles, 0, 0);
      }
      if (attackableTiles.length > 0) {
        renderer.renderAttackRange(ctx, attackableTiles, 0, 0);
      }

      // 3. 유닛 스프라이트 렌더링
      renderer.renderUnits(ctx, units.filter(u => u.curHp > 0), selectedUnitId, 0, 0);

      // 4. 이펙트 및 플로팅 데미지 렌더링
      renderer.renderEffects(ctx, effects, 0, 0);
      renderer.renderDamageFloaters(ctx, floaters, 0, 0);

      // 플로팅 및 이펙트 수명 갱신
      setFloaters((prev) =>
        prev
          .map((f) => ({ ...f, lifetime: f.lifetime + 0.03 }))
          .filter((f) => f.lifetime < 1)
      );

      setEffects((prev) =>
        prev
          .map((e) => ({ ...e, progress: e.progress + 0.08 }))
          .filter((e) => e.progress < 1)
      );

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [stage.mapData, movableTiles, attackableTiles, units, selectedUnitId, effects, floaters]);

  // 유닛 선택 및 이동/행동 제어
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const tileX = Math.floor(clickX / rendererRef.current.tileSize);
    const tileY = Math.floor(clickY / rendererRef.current.tileSize);

    if (phase !== 'player') return;

    // 1. 공격 / 책략 / 도구 타겟 선택 상태인 경우
    if (attackableTiles.length > 0) {
      const isTargetTile = attackableTiles.some((t) => t.x === tileX && t.y === tileY);
      if (isTargetTile) {
        const targetUnit = units.find((u) => u.x === tileX && u.y === tileY && u.curHp > 0);
        const attacker = units.find((u) => u.uid === selectedUnitId);

        if (attacker && targetUnit) {
          if (selectedItemIdx !== null) {
            handleExecuteItem(attacker, targetUnit, selectedItemIdx);
            setUnitOriginalPos(null);
            return;
          } else if (selectedTacticId) {
            handleExecuteTactic(attacker, targetUnit, selectedTacticId);
            setUnitOriginalPos(null);
            return;
          } else {
            handleExecuteAttack(attacker, targetUnit);
            setUnitOriginalPos(null);
            return;
          }
        }
      }
      // 공격 / 책략 / 도구 대상 선택 취소 및 메뉴 복귀
      soundManager.playMenuCancel();
      setAttackableTiles([]);
      setSelectedTacticId(null);
      setSelectedItemIdx(null);
      setActiveActionMenu('root');
      return;
    }

    // 2. 이동 가능한 타일을 클릭한 경우 -> 유닛 이동 후 행동 선택 메뉴 표시!
    if (movableTiles.length > 0 && selectedUnitId) {
      const isMoveTile = movableTiles.some((t) => t.x === tileX && t.y === tileY);
      if (isMoveTile) {
        soundManager.playMenuClick();
        const curUnit = units.find((u) => u.uid === selectedUnitId);
        let nextFacing: 'up' | 'down' | 'left' | 'right' = curUnit?.facing || 'down';
        if (curUnit) {
          if (tileX > curUnit.x) nextFacing = 'right';
          else if (tileX < curUnit.x) nextFacing = 'left';
          else if (tileY > curUnit.y) nextFacing = 'down';
          else if (tileY < curUnit.y) nextFacing = 'up';

          setUnitOriginalPos({ x: curUnit.x, y: curUnit.y });
        }

        // 보물 상자 / 보물 타일 루팅 체크
        const treasureKey = `${tileX},${tileY}`;
        const foundTreasure = stage.treasures?.find((t) => t.x === tileX && t.y === tileY);
        if (foundTreasure && !claimedTreasures.has(treasureKey)) {
          setClaimedTreasures((prev) => new Set([...prev, treasureKey]));
          soundManager.playLevelUp();
          const itemDef = ITEMS[foundTreasure.itemId];
          const itemName = itemDef ? itemDef.name : foundTreasure.itemId;
          addFloater(tileX, tileY, `💎 [${itemName}] 획득!`, '#3b82f6');
          if (onLootTreasure) {
            onLootTreasure(foundTreasure.itemId, 0);
          }
        }

        setUnits((prev) =>
          prev.map((u) => (u.uid === selectedUnitId ? { ...u, x: tileX, y: tileY, facing: nextFacing } : u))
        );
        setMovableTiles([]);
        setActiveActionMenu('root');
        return;
      }
    }

    // 3. 필드 위의 유닛 클릭
    const clickedUnit = units.find((u) => u.x === tileX && u.y === tileY && u.curHp > 0);

    if (clickedUnit) {
      soundManager.playMenuClick();
      if (clickedUnit.faction === 'player' && !clickedUnit.hasActed) {
        // 행동 가능한 아군 유닛 선택: 이동 가능 범위만 하이라이트하고 메뉴는 띄우지 않음!
        setSelectedUnitId(clickedUnit.uid);
        const tiles = BattleEngine.getMovableTiles(clickedUnit, units, stage.mapData);
        setMovableTiles(tiles);
        setActiveActionMenu(null);
        setAttackableTiles([]);
        setSelectedTacticId(null);
        setUnitOriginalPos(null);
      } else {
        // 적군 또는 이미 행동한 유닛 정보 표시
        setSelectedUnitId(clickedUnit.uid);
        setMovableTiles([]);
        setAttackableTiles([]);
        setActiveActionMenu(null);
        setSelectedTacticId(null);
        setUnitOriginalPos(null);
      }
    } else {
      // 빈 타일 클릭 시 선택 해제 (행동 메뉴가 떠 있는 경우 이동 취소)
      if (activeActionMenu && unitOriginalPos) {
        handleCancelMove();
      } else {
        setSelectedUnitId(null);
        setMovableTiles([]);
        setAttackableTiles([]);
        setActiveActionMenu(null);
        setSelectedTacticId(null);
        setUnitOriginalPos(null);
      }
    }
  };

  // 이동 취소 (원래 타일로 복귀)
  const handleCancelMove = () => {
    soundManager.playMenuCancel();
    if (selectedUnitId && unitOriginalPos) {
      setUnits((prev) =>
        prev.map((u) =>
          u.uid === selectedUnitId ? { ...u, x: unitOriginalPos.x, y: unitOriginalPos.y } : u
        )
      );
      const unit = units.find((u) => u.uid === selectedUnitId);
      if (unit) {
        unit.x = unitOriginalPos.x;
        unit.y = unitOriginalPos.y;
        const tiles = BattleEngine.getMovableTiles(unit, units, stage.mapData);
        setMovableTiles(tiles);
      }
    }
    setActiveActionMenu(null);
    setAttackableTiles([]);
    setSelectedTacticId(null);
    setSelectedItemIdx(null);
    setUnitOriginalPos(null);
  };

  // 도구 아이템 사용 (자신 또는 인접 아군 부대 치유/보급)
  const handleExecuteItem = (user: BattleUnit, target: BattleUnit, itemIndex: number) => {
    const itemId = user.equippedItems[itemIndex];
    const item = ITEMS[itemId];
    if (!item) return;

    soundManager.playMagicHeal();
    addEffect(target.x, target.y, 'heal');

    if (item.hpRestore) {
      const prevHp = target.curHp;
      target.curHp = Math.min(target.maxHp, target.curHp + item.hpRestore);
      const diff = target.curHp - prevHp;
      addFloater(target.x, target.y, `+${diff} (HP 회복)`, '#22c55e');
    }
    if (item.mpRestore) {
      const prevMp = target.curMp;
      target.curMp = Math.min(target.maxMp, target.curMp + item.mpRestore);
      const diff = target.curMp - prevMp;
      addFloater(target.x, target.y, `+${diff} (MP 회복)`, '#38bdf8');
    }
    if (item.cureStatus) {
      target.status = 'normal';
      addFloater(target.x, target.y, '상태 정상화!', '#22c55e');
    }

    user.equippedItems.splice(itemIndex, 1);
    const isLevelUp = BattleEngine.applyExp(user, 8);
    if (isLevelUp) {
      soundManager.playLevelUp();
      addFloater(user.x, user.y, '⭐ 레벨업!', '#3b82f6');
    }

    user.hasActed = true;
    setUnits([...units]);
    setAttackableTiles([]);
    setSelectedItemIdx(null);
    setActiveActionMenu(null);
    setSelectedUnitId(null);
    setUnitOriginalPos(null);
  };

  // 전장 실시간 중간 저장
  const handleSaveBattleState = () => {
    soundManager.playSaveSuccess();
    const saveData: BattleSaveData = {
      stageId: stage.id,
      currentTurn,
      phase,
      weather,
      units: [...units],
      claimedTreasures: Array.from(claimedTreasures),
      timestamp: Date.now()
    };
    localStorage.setItem('samguk_hero_battlesave_v1', JSON.stringify(saveData));
    if (onSaveBattle) {
      onSaveBattle(saveData);
    }
    const unitPos = selectedUnit ? selectedUnit : { x: 1, y: 1 };
    addFloater(unitPos.x, unitPos.y, '💾 전장 저장 완료!', '#38bdf8');
  };

  // 일반 물리 공격 실행
  const handleExecuteAttack = (attacker: BattleUnit, defender: BattleUnit) => {
    // 1. 일기토 이벤트 조건 확인
    const duelMatch = stage.duels?.find(
      (d) =>
        (d.playerCharId === attacker.charId && d.enemyCharId === defender.charId) ||
        (d.playerCharId === defender.charId && d.enemyCharId === attacker.charId)
    );

    if (duelMatch) {
      setActiveDuel(duelMatch);
      setAttackableTiles([]);
      setActiveActionMenu(null);
      return;
    }

    // 2. 일반 전투 공격 연산
    const defTerrain = stage.mapData[defender.y][defender.x];
    const result = BattleEngine.executeAttack(attacker, defender, defTerrain);

    soundManager.playAttackSlash();
    addEffect(defender.x, defender.y, 'slash');

    setTimeout(() => {
      soundManager.playHitImpact();
      if (result.isCritical) {
        soundManager.playCriticalHit();
        addFloater(defender.x, defender.y, `-${result.damage} (회심의 일격!)`, '#fbbf24');
      } else {
        addFloater(defender.x, defender.y, `-${result.damage}`, '#ef4444');
      }

      if (result.isKilled) {
        soundManager.playUnitRetreat();
        if (defender.faction === 'player') {
          if (defender.charId !== 'liu_bei') {
            addFloater(defender.x, defender.y, `[${defender.name}] "분하다... 퇴각한다!"`, '#ef4444');
          }
        } else {
          addFloater(defender.x, defender.y, `[${defender.name}] 퇴각!`, '#f97316');
        }
      }

      if (result.isLevelUp) {
        soundManager.playLevelUp();
        addFloater(attacker.x, attacker.y, '⭐ 레벨업!', '#3b82f6');
      }

      // 반격 처리
      if (result.counterDamage !== undefined) {
        setTimeout(() => {
          soundManager.playAttackSlash();
          addEffect(attacker.x, attacker.y, 'slash');
          soundManager.playHitImpact();
          addFloater(attacker.x, attacker.y, `-${result.counterDamage}`, '#f97316');
        }, 400);
      }

      // 유닛 행동 완료 표시
      attacker.hasActed = true;
      setUnits([...units]);
      setAttackableTiles([]);
      setActiveActionMenu(null);
      setSelectedUnitId(null);

      // 스테이지 승패 판정
      checkVictoryDefeat();
    }, 250);
  };

  // 책략 실행
  const handleExecuteTactic = (caster: BattleUnit, target: BattleUnit, tacticId: string) => {
    const targetTerrain = stage.mapData[target.y][target.x];
    const res = BattleEngine.executeTactic(caster, target, tacticId, targetTerrain, weather);

    if (res.message === '우천으로 화계 불가!') {
      soundManager.playMenuCancel();
      addFloater(target.x, target.y, '우천으로 화계 불가!', '#f59e0b');
      setAttackableTiles([]);
      setSelectedTacticId(null);
      setActiveActionMenu('root');
      return;
    }

    const tactic = TACTICS[tacticId];
    if (tactic?.category === 'fire') {
      soundManager.playMagicFire();
      addEffect(target.x, target.y, 'fire');
    } else if (tactic?.category === 'water') {
      soundManager.playMagicWater();
      addEffect(target.x, target.y, 'water');
    } else if (tactic?.category === 'recovery') {
      soundManager.playMagicHeal();
      addEffect(target.x, target.y, 'heal');
    } else if (tactic?.category === 'support') {
      soundManager.playCheerMorale();
      addEffect(target.x, target.y, 'heal');
    }

    setTimeout(() => {
      addFloater(
        target.x,
        target.y,
        res.message,
        tactic?.effectType === 'heal' ? '#22c55e' : '#f59e0b'
      );

      if (res.isLevelUp) {
        soundManager.playLevelUp();
        addFloater(caster.x, caster.y, '⭐ 레벨업!', '#3b82f6');
      }

      caster.hasActed = true;
      setUnits([...units]);
      setAttackableTiles([]);
      setSelectedTacticId(null);
      setActiveActionMenu(null);
      setSelectedUnitId(null);

      checkVictoryDefeat();
    }, 300);
  };

  // 승패 조건 확인
  const checkVictoryDefeat = useCallback(() => {
    const status = BattleEngine.checkStageStatus(stage, units, currentTurn);
    if (status === 'victory') {
      soundManager.playBgm('victory');
      if (stage.postBattleDialogue && stage.postBattleDialogue.length > 0) {
        setDialogueCutscene({ mode: 'post', index: 0 });
      } else {
        setBattleResult('victory');
      }
    } else if (status === 'defeat') {
      soundManager.playMenuCancel();
      setBattleResult('defeat');
    }
  }, [stage, units, currentTurn]);

  // 일기토 완료 후 콜백
  const handleDuelComplete = () => {
    if (activeDuel) {
      if (activeDuel.enemyRetreats) {
        // 적장 퇴각 처리
        setUnits((prev) =>
          prev.map((u) => (u.charId === activeDuel.enemyCharId ? { ...u, curHp: 0 } : u))
        );
      }
      // 플레이어에게 보너스 경험치 지급
      const playerUnit = units.find((u) => u.charId === activeDuel.playerCharId);
      if (playerUnit) {
        BattleEngine.applyExp(playerUnit, activeDuel.rewardExp);
        addFloater(playerUnit.x, playerUnit.y, `EXP +${activeDuel.rewardExp}`, '#3b82f6');
      }
    }
    setActiveDuel(null);
    checkVictoryDefeat();
  };

  // 아군 턴 종료 및 적군 턴 시작
  const handleEndPlayerPhase = () => {
    soundManager.playMenuClick();
    setSelectedUnitId(null);
    setMovableTiles([]);
    setAttackableTiles([]);
    setActiveActionMenu(null);
    setPhase('enemy');

    // 적군 AI 행동 순차 실행
    setTimeout(() => {
      executeEnemyTurn();
    }, 800);
  };

  // 적군 AI 턴 순차 실행
  const executeEnemyTurn = () => {
    const livingEnemies = units.filter((u) => u.faction === 'enemy' && u.curHp > 0);

    let idx = 0;
    const executeNextEnemy = () => {
      if (idx >= livingEnemies.length) {
        // 적군 턴 완료: 다시 아군 턴으로 전환
        setCurrentTurn((prev) => prev + 1);
        setPhase('player');

        // 날씨 변동 시스템 (75% 맑음, 15% 흐림, 10% 비)
        const randWeather = Math.random();
        const nextWeather = randWeather < 0.10 ? 'rainy' : randWeather < 0.25 ? 'cloudy' : 'sunny';
        setWeather(nextWeather);

        // 모든 아군 및 적군 행동 플래그 리셋 & 지형 회복 적용
        setUnits((prev) => {
          const next = prev.map((u) => {
            if (u.curHp <= 0) return u;
            const terrain = stage.mapData[u.y][u.x];
            const healRatio = TERRAINS[terrain]?.healPerTurn || 0;
            const healedHp = Math.min(u.maxHp, u.curHp + Math.round(u.maxHp * healRatio));
            const diff = healedHp - u.curHp;
            if (diff > 0) {
              addFloater(u.x, u.y, `+${diff} (지형)`, '#22c55e');
            }
            return {
              ...u,
              curHp: healedHp,
              hasActed: false
            };
          });

          // 군악대 및 수송대 고유 턴 패시브 적용
          const passives = BattleEngine.applyTurnPassives(next, 'player');
          passives.forEach((p) => {
            addFloater(p.x, p.y, p.message, p.color);
          });
          if (passives.some((p) => p.message.includes('군악대'))) {
            soundManager.playCheerMorale();
          }

          return next;
        });
        return;
      }

      const enemy = livingEnemies[idx];
      const action = AIEngine.decideUnitAction(enemy, units, stage.mapData);

      // 적 이동 반영
      enemy.x = action.moveToX;
      enemy.y = action.moveToY;

      if (action.actionType === 'attack' && action.targetUid) {
        const target = units.find((u) => u.uid === action.targetUid && u.curHp > 0);
        if (target) {
          const targetTerrain = stage.mapData[target.y][target.x];
          const result = BattleEngine.executeAttack(enemy, target, targetTerrain);

          soundManager.playAttackSlash();
          addEffect(target.x, target.y, 'slash');
          setTimeout(() => {
            soundManager.playHitImpact();
            addFloater(target.x, target.y, `-${result.damage}`, '#ef4444');
            setUnits([...units]);
          }, 300);
        }
      }

      idx++;
      setTimeout(executeNextEnemy, 700);
    };

    executeNextEnemy();
  };

  const selectedUnit = units.find((u) => u.uid === selectedUnitId);

  return (
    <div className="relative flex h-screen w-full flex-col justify-between overflow-hidden bg-slate-950 p-2 select-none">
      {/* 상단 전장 HUD */}
      <div className="flex items-center justify-between rounded-lg border-2 border-amber-700 bg-slate-900/90 px-4 py-2 text-white shadow-md">
        <div className="flex items-center gap-3">
          <span className="rounded bg-amber-600 px-2.5 py-0.5 text-xs font-bold text-slate-950">
            {stage.name}
          </span>
          <span className="text-sm font-semibold text-amber-300">
            {currentTurn} / {stage.maxTurns} 턴
          </span>
          <span
            className={`rounded px-2 py-0.5 text-xs font-bold ${
              phase === 'player' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white animate-pulse'
            }`}
          >
            {phase === 'player' ? '아군 턴 (PLAYER)' : '적군 턴 (ENEMY)'}
          </span>
          <span
            className={`rounded px-2.5 py-0.5 text-xs font-bold border transition ${
              weather === 'rainy'
                ? 'bg-blue-950 border-cyan-400 text-cyan-200 animate-pulse'
                : weather === 'cloudy'
                ? 'bg-slate-800 border-slate-600 text-slate-300'
                : 'bg-amber-950 border-amber-500 text-amber-200'
            }`}
          >
            {weather === 'rainy' ? '🌧️ 폭우 (수계 +25% / 화계 불가)' : weather === 'cloudy' ? '☁️ 흐림' : '☀️ 맑음'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {phase === 'player' && (
            <>
              <button
                onClick={handleSaveBattleState}
                className="rounded bg-indigo-900 border border-indigo-400 px-3 py-1 text-xs font-bold text-indigo-200 hover:bg-indigo-800 active:scale-95 transition shadow"
              >
                💾 전장 저장
              </button>
              <button
                onClick={handleEndPlayerPhase}
                className="rounded bg-amber-600 px-3 py-1 text-xs font-bold text-slate-950 hover:bg-amber-500 active:scale-95 transition shadow"
              >
                턴 종료 ▶
              </button>
            </>
          )}
          <button
            onClick={() => {
              soundManager.playMenuCancel();
              onRetreat();
            }}
            className="rounded bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300 hover:bg-red-800 hover:text-white transition"
          >
            퇴각 ✕
          </button>
        </div>
      </div>

      {/* 중앙 메인 캔버스 전장 맵 */}
      <div className="relative my-auto flex items-center justify-center overflow-auto p-1">
        <canvas
          ref={canvasRef}
          width={stage.width * 48}
          height={stage.height * 48}
          onClick={handleCanvasClick}
          onMouseMove={(e) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const tx = Math.floor(((e.clientX - rect.left) * scaleX) / 48);
            const ty = Math.floor(((e.clientY - rect.top) * scaleY) / 48);
            if (tx >= 0 && ty >= 0 && tx < stage.width && ty < stage.height) {
              setHoveredTile({ x: tx, y: ty });
            }
          }}
          className="rounded-lg border-4 border-amber-800 shadow-[0_0_30px_rgba(0,0,0,0.8)] cursor-pointer"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* 공격/책략/도구 타겟 선택 중일 때 상단 취소 버튼 */}
        {attackableTiles.length > 0 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40">
            <button
              onClick={() => {
                soundManager.playMenuCancel();
                setAttackableTiles([]);
                setSelectedTacticId(null);
                setSelectedItemIdx(null);
                setActiveActionMenu('root');
              }}
              className="rounded-full bg-red-900/90 border-2 border-red-500 px-4 py-1.5 text-xs font-bold text-white shadow-xl hover:bg-red-800 active:scale-95 transition"
            >
              ↩️ {selectedItemIdx !== null ? '도구 대상 선택 취소' : selectedTacticId ? '책략 대상 선택 취소' : '공격 대상 선택 취소'}
            </button>
          </div>
        )}

        {/* 액션 명령 메뉴 (이동 후 나타나는 영걸전 스타일 스마트 배치 윈도우) */}
        {activeActionMenu && selectedUnit && (
          <div
            className="absolute z-40 rounded-lg border-4 border-amber-600 bg-slate-950/95 p-3 shadow-2xl text-white transition-all"
            style={{
              left:
                selectedUnit.x > stage.width / 2
                  ? Math.max(10, selectedUnit.x * 48 - 170)
                  : Math.min(stage.width * 48 - 180, (selectedUnit.x + 1) * 48 + 12),
              top: Math.max(10, Math.min(stage.height * 48 - 260, selectedUnit.y * 48 - 20))
            }}
          >
            <div className="mb-2 text-center text-xs font-bold text-amber-300 border-b border-amber-800 pb-1">
              {selectedUnit.name} - 행동 선택
            </div>

            {activeActionMenu === 'root' && (
              <div className="flex flex-col gap-1.5 w-36">
                <button
                  onClick={() => {
                    soundManager.playMenuClick();
                    const targets = BattleEngine.getAttackableTiles(
                      selectedUnit,
                      selectedUnit.x,
                      selectedUnit.y,
                      stage.width,
                      stage.height
                    );
                    const hasEnemies = targets.some((t) =>
                      units.some((u) => u.x === t.x && u.y === t.y && u.faction === 'enemy' && u.curHp > 0)
                    );
                    if (!hasEnemies) {
                      soundManager.playMenuCancel();
                      addFloater(selectedUnit.x, selectedUnit.y, '사거리 내 적 없음', '#f59e0b');
                    }
                    setAttackableTiles(targets);
                    setSelectedTacticId(null);
                    setActiveActionMenu(null);
                  }}
                  className="rounded bg-red-800/80 hover:bg-red-700 px-3 py-1.5 text-xs font-bold text-white transition"
                >
                  ⚔️ 공격
                </button>

                {selectedUnit.tactics && selectedUnit.tactics.length > 0 && (
                  <button
                    onClick={() => {
                      soundManager.playMenuClick();
                      setActiveActionMenu('tactics');
                    }}
                    className="rounded bg-indigo-800/80 hover:bg-indigo-700 px-3 py-1.5 text-xs font-bold text-white transition"
                  >
                    ✨ 책략
                  </button>
                )}

                <button
                  onClick={() => {
                    soundManager.playMenuClick();
                    setActiveActionMenu('items');
                  }}
                  className="rounded bg-emerald-800/80 hover:bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white transition"
                >
                  🎒 도구
                </button>

                <button
                  onClick={() => {
                    soundManager.playMenuClick();
                    selectedUnit.hasActed = true;
                    setUnits([...units]);
                    setActiveActionMenu(null);
                    setSelectedUnitId(null);
                    setUnitOriginalPos(null);
                  }}
                  className="rounded bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-bold text-white transition"
                >
                  🛡️ 대기
                </button>

                {/* 이동 취소 버튼 */}
                {unitOriginalPos && (
                  <button
                    onClick={() => {
                      handleCancelMove();
                    }}
                    className="rounded bg-amber-900/90 hover:bg-amber-800 px-3 py-1.5 text-xs font-bold text-amber-200 transition"
                  >
                    ↩️ 이동 취소
                  </button>
                )}

                <button
                  onClick={() => {
                    soundManager.playMenuClick();
                    setInspectUnit(selectedUnit);
                  }}
                  className="rounded bg-amber-700/80 hover:bg-amber-600 px-3 py-1.5 text-xs font-bold text-white transition"
                >
                  📜 정보
                </button>
              </div>
            )}

            {/* 책략 서브메뉴 */}
            {activeActionMenu === 'tactics' && (
              <div className="flex flex-col gap-1 w-44 max-h-48 overflow-y-auto">
                {selectedUnit.tactics.map((tId) => {
                  const tactic = TACTICS[tId];
                  if (!tactic) return null;
                  const canCast = selectedUnit.curMp >= tactic.mpCost;

                  return (
                    <button
                      key={tId}
                      disabled={!canCast}
                      onClick={() => {
                        soundManager.playMenuClick();
                        const targets = BattleEngine.getTacticTargetTiles(
                          tId,
                          selectedUnit.x,
                          selectedUnit.y,
                          stage.width,
                          stage.height
                        );
                        // 지원/회복 책략은 시전자 본인 타일도 포함
                        if (tactic.effectType === 'heal' || tactic.effectType === 'morale_up' || tactic.effectType === 'cure') {
                          targets.push({ x: selectedUnit.x, y: selectedUnit.y });
                        }
                        setAttackableTiles(targets);
                        setSelectedTacticId(tId);
                        setSelectedItemIdx(null);
                        setActiveActionMenu(null);
                      }}
                      className="flex items-center justify-between rounded bg-slate-900 hover:bg-indigo-900/80 p-2 text-xs transition disabled:opacity-40"
                    >
                      <span className="font-bold text-indigo-300">{tactic.name}</span>
                      <span className="text-[10px] text-cyan-400">MP {tactic.mpCost}</span>
                    </button>
                  );
                })}
                <button
                  onClick={() => setActiveActionMenu('root')}
                  className="mt-1 rounded bg-slate-800 py-1 text-[11px] text-slate-300"
                >
                  뒤로
                </button>
              </div>
            )}

            {/* 도구 서브메뉴 (자신 및 인접 아군 지정 사용) */}
            {activeActionMenu === 'items' && (
              <div className="flex flex-col gap-1 w-44 max-h-48 overflow-y-auto">
                {selectedUnit.equippedItems.map((itemId, idx) => {
                  const item = ITEMS[itemId];
                  if (!item || item.type !== 'consumable') return null;

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        soundManager.playMenuClick();
                        // 인접 4방향 및 본인 타일 중 생존 아군 위치만 대상 선정
                        const candidateTiles = [
                          { x: selectedUnit.x, y: selectedUnit.y },
                          { x: selectedUnit.x + 1, y: selectedUnit.y },
                          { x: selectedUnit.x - 1, y: selectedUnit.y },
                          { x: selectedUnit.x, y: selectedUnit.y + 1 },
                          { x: selectedUnit.x, y: selectedUnit.y - 1 }
                        ].filter(
                          (t) =>
                            t.x >= 0 &&
                            t.x < stage.width &&
                            t.y >= 0 &&
                            t.y < stage.height &&
                            units.some((u) => u.x === t.x && u.y === t.y && u.faction === 'player' && u.curHp > 0)
                        );
                        setAttackableTiles(candidateTiles);
                        setSelectedItemIdx(idx);
                        setSelectedTacticId(null);
                        setActiveActionMenu(null);
                      }}
                      className="flex items-center justify-between rounded bg-slate-900 hover:bg-emerald-900/80 p-2 text-xs transition"
                    >
                      <span className="font-bold text-slate-200">{item.name}</span>
                      <span className="text-sm">{item.icon}</span>
                    </button>
                  );
                })}
                <button
                  onClick={() => setActiveActionMenu('root')}
                  className="mt-1 rounded bg-slate-800 py-1 text-[11px] text-slate-300"
                >
                  뒤로
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 하단 유닛 카드 & 지형 정보 HUD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-lg border-2 border-amber-800 bg-slate-900/90 p-2 text-xs text-white">
        {/* 선택된 장수 카드 */}
        <div className="flex items-center gap-3">
          {selectedUnit ? (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-amber-500 bg-slate-800 text-2xl font-bold text-amber-400">
                {selectedUnit.name[0]}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-300 text-sm">{selectedUnit.name}</span>
                  <span className="text-slate-400">Lv.{selectedUnit.level}</span>
                  <span className="rounded bg-slate-800 px-1.5 text-[10px] text-slate-300">
                    {UNIT_CLASSES[selectedUnit.classType]?.name}
                  </span>
                </div>
                <div className="flex gap-3 text-[11px]">
                  <span>HP: <strong className="text-green-400">{selectedUnit.curHp}/{selectedUnit.maxHp}</strong></span>
                  <span>MP: <strong className="text-cyan-400">{selectedUnit.curMp}/{selectedUnit.maxMp}</strong></span>
                  <span>사기: <strong className="text-yellow-400">{selectedUnit.morale ?? 100}</strong></span>
                  <span>공: <strong className="text-orange-400">{selectedUnit.attack}</strong></span>
                  <span>방: <strong className="text-teal-400">{selectedUnit.defense}</strong></span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-slate-500">장수를 선택하면 정보가 표시됩니다.</div>
          )}
        </div>

        {/* 지형 정보 카드 */}
        <div className="flex items-center justify-end gap-3 text-right">
          {hoveredTile && (
            <div>
              <div className="font-bold text-amber-300">
                지형: {TERRAINS[stage.mapData[hoveredTile.y][hoveredTile.x]]?.name || '평지'}
              </div>
              <div className="text-[11px] text-slate-400">
                방어 보정: {(TERRAINS[stage.mapData[hoveredTile.y][hoveredTile.x]]?.defenseMod * 100).toFixed(0)}%
                {TERRAINS[stage.mapData[hoveredTile.y][hoveredTile.x]]?.healPerTurn > 0 &&
                  ` · 턴당 ${(TERRAINS[stage.mapData[hoveredTile.y][hoveredTile.x]]?.healPerTurn * 100).toFixed(0)}% 회복`}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 일기토 모달 */}
      {activeDuel && (
        <DuelModal duel={activeDuel} onComplete={handleDuelComplete} />
      )}

      {/* 장수 상세 정보 모달 */}
      {inspectUnit && (
        <UnitDetailModal unit={inspectUnit} onClose={() => setInspectUnit(null)} />
      )}

      {/* 스토리 회화 컷씬 모달 (전투 전/후 대사 연출) */}
      {dialogueCutscene && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-6 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-xl border-4 border-amber-600 bg-slate-950/95 p-5 text-white shadow-2xl animate-fade-in">
            {(() => {
              const dialogues =
                dialogueCutscene.mode === 'pre'
                  ? stage.preBattleDialogue || []
                  : stage.postBattleDialogue || [];
              const currentDiag = dialogues[dialogueCutscene.index];
              if (!currentDiag) return null;

              const isLast = dialogueCutscene.index >= dialogues.length - 1;

              return (
                <div>
                  <div className="mb-3 flex items-center justify-between border-b border-amber-800/70 pb-2">
                    <span className="text-xs font-bold text-amber-400">
                      {dialogueCutscene.mode === 'pre' ? '📜 전투 개시 회화' : '🏆 승전 보고 회화'} ({dialogueCutscene.index + 1}/{dialogues.length})
                    </span>
                    <button
                      onClick={() => {
                        soundManager.playMenuClick();
                        if (dialogueCutscene.mode === 'pre') {
                          setDialogueCutscene(null);
                        } else {
                          setDialogueCutscene(null);
                          setBattleResult('victory');
                        }
                      }}
                      className="rounded bg-slate-800 px-2.5 py-0.5 text-[11px] font-bold text-slate-300 hover:bg-slate-700 transition"
                    >
                      스킵 ⏩
                    </button>
                  </div>

                  <div className="flex items-start gap-4 my-2">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border-2 border-amber-500 bg-slate-900 text-3xl font-black text-amber-400 shadow-md">
                      {currentDiag.speaker[0]}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="text-sm font-black text-amber-300">
                        [{currentDiag.speaker}]
                      </div>
                      <p className="text-sm font-medium leading-relaxed text-slate-100 min-h-[48px]">
                        "{currentDiag.text}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => {
                        soundManager.playMenuClick();
                        if (isLast) {
                          if (dialogueCutscene.mode === 'pre') {
                            setDialogueCutscene(null);
                          } else {
                            setDialogueCutscene(null);
                            setBattleResult('victory');
                          }
                        } else {
                          setDialogueCutscene({
                            ...dialogueCutscene,
                            index: dialogueCutscene.index + 1
                          });
                        }
                      }}
                      className="rounded bg-gradient-to-r from-amber-600 to-yellow-500 px-5 py-1.5 text-xs font-black text-slate-950 hover:from-amber-500 hover:to-yellow-400 active:scale-95 transition shadow"
                    >
                      {isLast ? '확인 ↵' : '다음 ▶'}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* 승리 모달 */}
      {battleResult === 'victory' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border-4 border-yellow-500 bg-slate-950 p-6 text-center text-white shadow-2xl">
            <div className="text-5xl mb-2 animate-bounce">🏆</div>
            <h2 className="text-2xl font-black text-yellow-400 mb-1">대승리 (VICTORY)!</h2>
            <p className="text-sm text-slate-300 mb-4">{stage.name}을(를) 평정하였습니다!</p>
            <div className="rounded border border-yellow-700/60 bg-slate-900 p-3 mb-5 space-y-1 text-xs">
              <div>획득 전리품 금화: <strong className="text-yellow-400">+{stage.clearGold} 금</strong></div>
              <div>전원 보너스 경험치: <strong className="text-blue-400">+{stage.clearExpBonus} EXP</strong></div>
            </div>
            <button
              onClick={() => onVictory(stage.id, stage.clearGold, stage.clearExpBonus)}
              className="w-full rounded bg-gradient-to-r from-amber-600 to-yellow-500 py-2.5 font-bold text-slate-950 hover:from-amber-500 hover:to-yellow-400 shadow-lg"
            >
              승전 보고 및 다음으로 ▶
            </button>
          </div>
        </div>
      )}

      {/* 패배 모달 */}
      {battleResult === 'defeat' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border-4 border-red-700 bg-slate-950 p-6 text-center text-white shadow-2xl">
            <div className="text-5xl mb-2">☠️</div>
            <h2 className="text-2xl font-black text-red-500 mb-1">패배 (DEFEAT)</h2>
            <p className="text-sm text-slate-300 mb-5">유비 군이 퇴각하였습니다.</p>
            <button
              onClick={onDefeat}
              className="w-full rounded bg-red-700 py-2.5 font-bold text-white hover:bg-red-600 shadow-lg"
            >
              다시 도전하기 ↺
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
