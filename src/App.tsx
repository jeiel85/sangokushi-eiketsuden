// 삼국지 영걸전 웹앱 메인 애플리케이션

import { useEffect, useMemo, useState } from 'react';
import { BattleScreen } from './components/BattleScreen';
import { ChronicleModal } from './components/ChronicleModal';
import { DeploymentModal } from './components/DeploymentModal';
import { EquipModal } from './components/EquipModal';
import { PrologueModal } from './components/PrologueModal';
import { ShopModal } from './components/ShopModal';
import { StageSelectModal } from './components/StageSelectModal';
import { TitleScreen } from './components/TitleScreen';
import { TownScreen } from './components/TownScreen';
import { UnitDetailModal } from './components/UnitDetailModal';
import { soundManager } from './core/audio';
import { CHARACTERS } from './data/characters';
import { STAGES } from './data/stages';
import type { BattleSaveData, BattleUnit, GameState, UnitClassType } from './types/game';

const SAVE_KEY = 'samguk_hero_save_v1';
const BATTLE_SAVE_KEY = 'samguk_hero_battlesave_v1';

// 초기 촉한 장수 로스터 생성
function createInitialGameState(): GameState {
  return {
    currentStageId: 1, // 사수관 전투 시작
    gold: 1500,
    isCheatedLevel99: false,
    clearedStages: [],
    inventory: ['bean', 'bean', 'rice', 'meat', 'wine', 'manual_sword'],
    battleSave: null,
    roster: [
      {
        charId: 'liu_bei',
        level: 1,
        exp: 0,
        classType: 'infantry_light',
        curHp: 160,
        maxHp: 160,
        curMp: 35,
        maxMp: 35,
        war: 75,
        intel: 78,
        lead: 99,
        equippedItems: ['twin_swords', 'rice'],
        tactics: ['cheer_1', 'heal_1'],
        morale: 100
      },
      {
        charId: 'guan_yu',
        level: 1,
        exp: 0,
        classType: 'cavalry_light',
        curHp: 190,
        maxHp: 190,
        curMp: 30,
        maxMp: 30,
        war: 98,
        intel: 84,
        lead: 98,
        equippedItems: ['green_dragon', 'meat'],
        tactics: ['cheer_1', 'pyro_1'],
        morale: 100
      },
      {
        charId: 'zhang_fei',
        level: 1,
        exp: 0,
        classType: 'cavalry_light',
        curHp: 200,
        maxHp: 200,
        curMp: 20,
        maxMp: 20,
        war: 99,
        intel: 45,
        lead: 85,
        equippedItems: ['serpent_spear', 'wine'],
        tactics: ['cheer_1'],
        morale: 100
      },
      {
        charId: 'jian_yong',
        level: 1,
        exp: 0,
        classType: 'archer_short',
        curHp: 130,
        maxHp: 130,
        curMp: 25,
        maxMp: 25,
        war: 56,
        intel: 76,
        lead: 72,
        equippedItems: ['repeater_bow', 'bean'],
        tactics: ['cheer_1', 'heal_1'],
        morale: 100
      },
      {
        charId: 'fan_gong',
        level: 1,
        exp: 0,
        classType: 'martial_artist',
        curHp: 150,
        maxHp: 150,
        curMp: 20,
        maxMp: 20,
        war: 80,
        intel: 62,
        lead: 74,
        equippedItems: ['meat'],
        tactics: ['cheer_1'],
        morale: 100
      },
      {
        charId: 'zhao_yun',
        level: 3,
        exp: 0,
        classType: 'cavalry_light',
        curHp: 230,
        maxHp: 230,
        curMp: 35,
        maxMp: 35,
        war: 98,
        intel: 86,
        lead: 96,
        equippedItems: ['iron_spear'],
        tactics: ['cheer_1', 'pyro_1'],
        morale: 100
      },
      {
        charId: 'zhuge_liang',
        level: 5,
        exp: 0,
        classType: 'sorcerer_master',
        curHp: 210,
        maxHp: 210,
        curMp: 120,
        maxMp: 120,
        war: 38,
        intel: 100,
        lead: 98,
        equippedItems: ['art_of_war'],
        tactics: ['pyro_1', 'pyro_2', 'water_1', 'water_2', 'confuse_1', 'heal_2'],
        morale: 100
      },
      {
        charId: 'huang_zhong',
        level: 5,
        exp: 0,
        classType: 'archer_repeater',
        curHp: 220,
        maxHp: 220,
        curMp: 40,
        maxMp: 40,
        war: 95,
        intel: 68,
        lead: 90,
        equippedItems: ['repeater_bow', 'meat'],
        tactics: ['cheer_1', 'pyro_1'],
        morale: 100
      },
      {
        charId: 'wei_yan',
        level: 5,
        exp: 0,
        classType: 'infantry_heavy',
        curHp: 250,
        maxHp: 250,
        curMp: 30,
        maxMp: 30,
        war: 92,
        intel: 72,
        lead: 85,
        equippedItems: ['iron_sword'],
        tactics: ['cheer_1', 'rock_1'],
        morale: 100
      }
    ]
  };
}

export function App() {
  const [screenMode, setScreenMode] = useState<'title' | 'town' | 'battle'>('title');
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [selectedDeployChars, setSelectedDeployChars] = useState<string[]>(['liu_bei', 'guan_yu', 'zhang_fei']);

  // 모달 상태들
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isEquipOpen, setIsEquipOpen] = useState(false);
  const [isDeploymentOpen, setIsDeploymentOpen] = useState(false);
  const [isStageSelectOpen, setIsStageSelectOpen] = useState(false);
  const [isPrologueOpen, setIsPrologueOpen] = useState(false);
  const [isChronicleOpen, setIsChronicleOpen] = useState(false);
  const [inspectUnit, setInspectUnit] = useState<BattleUnit | null>(null);

  // 로컬 저장 데이터 확인
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [hasBattleSave, setHasBattleSave] = useState(false);
  const [activeBattleSave, setActiveBattleSave] = useState<BattleSaveData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      setHasSavedGame(true);
    }
    const battleSaved = localStorage.getItem(BATTLE_SAVE_KEY);
    if (battleSaved) {
      setHasBattleSave(true);
    }
  }, []);

  // 게임 저장
  const handleSaveGame = () => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    setHasSavedGame(true);
    alert('게임 진행 상황이 브라우저에 안전하게 저장되었습니다!');
  };

  // 거점 이어하기
  const handleContinueGame = () => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setGameState(parsed);
        setScreenMode('town');
        soundManager.playBgm('town');
      } catch {
        alert('저장 데이터를 불러오는 데 실패했습니다.');
      }
    }
  };

  // 전장 중간 저장 이어하기
  const handleContinueBattle = () => {
    const saved = localStorage.getItem(BATTLE_SAVE_KEY);
    if (saved) {
      try {
        const parsed: BattleSaveData = JSON.parse(saved);
        setActiveBattleSave(parsed);
        setGameState((prev) => ({ ...prev, currentStageId: parsed.stageId }));
        setScreenMode('battle');
        soundManager.playBgm('battle');
      } catch {
        alert('전장 저장 데이터를 불러오는 데 실패했습니다.');
      }
    }
  };

  // 새 게임 시작 (도원결의 오프닝 프롤로그 재생)
  const handleStartNewGame = () => {
    const initial = createInitialGameState();
    if (gameState.isCheatedLevel99) {
      applyLevel99ToState(initial);
    }
    setGameState(initial);
    setIsPrologueOpen(true);
  };

  // 전설의 유비 얼굴 연타 레벨 99 치트키 발동!
  const handleActivateLevel99Cheat = () => {
    setGameState((prev) => {
      const next = { ...prev };
      applyLevel99ToState(next);
      return next;
    });
  };

  const applyLevel99ToState = (state: GameState) => {
    state.isCheatedLevel99 = true;
    state.gold += 10000;
    state.roster = state.roster.map((hero) => ({
      ...hero,
      level: 99,
      curHp: 999,
      maxHp: 999,
      curMp: 255,
      maxMp: 255,
      morale: 100,
      war: Math.min(100, hero.war + 20),
      intel: Math.min(100, hero.intel + 20),
      lead: Math.min(100, hero.lead + 20),
      classType:
        hero.classType === 'infantry_light'
          ? 'infantry_guard'
          : hero.classType === 'cavalry_light'
          ? 'cavalry_elite'
          : hero.classType === 'archer_short'
          ? 'archer_catapult'
          : hero.classType
    }));
  };

  const currentStage = STAGES.find((s) => s.id === gameState.currentStageId) || STAGES[0];

  // 상점 구매 처리
  const handleBuyItem = (itemId: string, cost: number) => {
    setGameState((prev) => ({
      ...prev,
      gold: prev.gold - cost,
      inventory: [...prev.inventory, itemId]
    }));
  };

  // 상점 판매 처리
  const handleSellItem = (index: number, price: number) => {
    setGameState((prev) => {
      const updatedInv = [...prev.inventory];
      updatedInv.splice(index, 1);
      return {
        ...prev,
        gold: prev.gold + price,
        inventory: updatedInv
      };
    });
  };

  // 출진 장수 선택 토글
  const handleToggleDeployChar = (charId: string) => {
    setSelectedDeployChars((prev) => {
      if (prev.includes(charId)) {
        return prev.filter((id) => id !== charId);
      } else {
        return [...prev, charId];
      }
    });
  };

  // 출진 개시 -> 전투 화면 진입
  const handleDeployToBattle = () => {
    setIsDeploymentOpen(false);
    setScreenMode('battle');
  };

  // 전투 승리 시
  const handleBattleVictory = (clearedStageId: number, rewardGold: number, rewardExp: number) => {
    localStorage.removeItem(BATTLE_SAVE_KEY);
    setHasBattleSave(false);
    setActiveBattleSave(null);

    setGameState((prev) => {
      const nextStageId = Math.min(STAGES.length, clearedStageId + 1);
      const updatedRoster = prev.roster.map((hero) => {
        const isDeployed = selectedDeployChars.includes(hero.charId);
        if (isDeployed) {
          return {
            ...hero,
            exp: hero.exp + rewardExp,
            curHp: hero.maxHp,
            curMp: hero.maxMp,
            morale: 100
          };
        }
        return hero;
      });

      return {
        ...prev,
        currentStageId: nextStageId,
        gold: prev.gold + rewardGold,
        clearedStages: Array.from(new Set([...prev.clearedStages, clearedStageId])),
        roster: updatedRoster
      };
    });

    setScreenMode('town');
    soundManager.playBgm('town');
  };

  // 전투 패배 시
  const handleBattleDefeat = () => {
    localStorage.removeItem(BATTLE_SAVE_KEY);
    setHasBattleSave(false);
    setActiveBattleSave(null);
    setScreenMode('town');
    soundManager.playBgm('town');
  };

  // 출진용 플레이어 유닛 객체 생성
  const generatePlayerBattleUnits = (): BattleUnit[] => {
    return selectedDeployChars.map((charId, idx) => {
      const hero = gameState.roster.find((h) => h.charId === charId);
      const charDef = CHARACTERS[charId] || { name: charId };

      const level = hero?.level || 1;
      const classType = (hero?.classType || 'infantry_light') as UnitClassType;
      const maxHp = hero?.maxHp || 160;
      const maxMp = hero?.maxMp || 35;
      const war = hero?.war || 80;
      const intel = hero?.intel || 70;
      const lead = hero?.lead || 80;

      return {
        uid: `player-${charId}-${idx}`,
        charId,
        name: charDef.name,
        faction: 'player',
        classType,
        level,
        exp: hero?.exp || 0,
        curHp: hero?.curHp || maxHp,
        maxHp,
        curMp: hero?.curMp || maxMp,
        maxMp,
        war,
        intel,
        lead,
        attack: Math.round(war * 1.6 + level * 3),
        defense: Math.round(lead * 1.5 + level * 2),
        x: 1 + (idx % 2),
        y: 3 + Math.floor(idx / 2),
        hasActed: false,
        status: 'normal',
        equippedItems: hero?.equippedItems || [],
        tactics: hero?.tactics || ['cheer_1', 'pyro_1'],
        isCommander: charId === 'liu_bei',
        morale: hero?.morale ?? 100
      };
    });
  };

  // 보물창고 및 전장 보물 획득
  const handleLootTreasure = (itemId: string, gold?: number) => {
    setGameState((prev) => {
      const next = { ...prev };
      if (itemId) {
        next.inventory = [...next.inventory, itemId];
      }
      if (gold) {
        next.gold = prev.gold + gold;
      }
      return next;
    });
  };

  const playerBattleUnits = useMemo(() => {
    return generatePlayerBattleUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDeployChars, gameState.roster]);

  return (
    <div className="h-screen w-screen bg-black font-sans text-slate-100 flex flex-col items-center justify-center">
      {/* 1. 타이틀 화면 */}
      {screenMode === 'title' && (
        <TitleScreen
          onStartGame={handleStartNewGame}
          onContinueGame={handleContinueGame}
          onContinueBattle={handleContinueBattle}
          onOpenStageSelect={() => setIsStageSelectOpen(true)}
          onOpenChronicle={() => setIsChronicleOpen(true)}
          hasSavedGame={hasSavedGame}
          hasBattleSave={hasBattleSave}
          onActivateLevel99Cheat={handleActivateLevel99Cheat}
          isCheated={gameState.isCheatedLevel99}
        />
      )}

      {/* 2. 거점 / 도시 화면 */}
      {screenMode === 'town' && (
        <TownScreen
          gameState={gameState}
          currentStage={currentStage}
          onOpenShop={() => setIsShopOpen(true)}
          onOpenEquip={() => setIsEquipOpen(true)}
          onOpenDeployment={() => setIsDeploymentOpen(true)}
          onOpenUnitDetail={(unit) => setInspectUnit(unit)}
          onOpenStageSelect={() => setIsStageSelectOpen(true)}
          onOpenChronicle={() => setIsChronicleOpen(true)}
          onSaveGame={handleSaveGame}
        />
      )}

      {/* 3. 메인 전투 화면 */}
      {screenMode === 'battle' && (
        <BattleScreen
          stage={currentStage}
          playerUnits={playerBattleUnits}
          savedBattleState={activeBattleSave}
          onLootTreasure={handleLootTreasure}
          onVictory={handleBattleVictory}
          onDefeat={handleBattleDefeat}
          onRetreat={() => {
            localStorage.removeItem(BATTLE_SAVE_KEY);
            setHasBattleSave(false);
            setActiveBattleSave(null);
            setScreenMode('town');
            soundManager.playBgm('town');
          }}
          onSaveBattle={() => setHasBattleSave(true)}
        />
      )}

      {/* 도구상점 모달 */}
      {isShopOpen && (
        <ShopModal
          gold={gameState.gold}
          inventory={gameState.inventory}
          onBuy={handleBuyItem}
          onSell={handleSellItem}
          onClose={() => setIsShopOpen(false)}
        />
      )}

      {/* 군비 정돈 및 전직 모달 */}
      {isEquipOpen && (
        <EquipModal
          gameState={gameState}
          onUpdateGameState={setGameState}
          onClose={() => setIsEquipOpen(false)}
        />
      )}

      {/* 출진 장수 편성 모달 */}
      {isDeploymentOpen && (
        <DeploymentModal
          stage={currentStage}
          roster={gameState.roster}
          selectedCharIds={selectedDeployChars}
          onToggleSelect={handleToggleDeployChar}
          onDeploy={handleDeployToBattle}
          onClose={() => setIsDeploymentOpen(false)}
        />
      )}

      {/* 스테이지 선택기 모달 */}
      {isStageSelectOpen && (
        <StageSelectModal
          currentStageId={gameState.currentStageId}
          onSelectStage={(stageId) => {
            setGameState((prev) => ({ ...prev, currentStageId: stageId }));
            setIsStageSelectOpen(false);
          }}
          onClose={() => setIsStageSelectOpen(false)}
        />
      )}

      {/* 장수 상세 정보 모달 */}
      {inspectUnit && (
        <UnitDetailModal
          unit={inspectUnit}
          onClose={() => setInspectUnit(null)}
          onPromote={(unit) => {
            setGameState((prev) => ({
              ...prev,
              roster: prev.roster.map((h) =>
                h.charId === unit.charId
                  ? {
                      ...h,
                      classType:
                        h.classType === 'infantry_light'
                          ? 'infantry_heavy'
                          : h.classType === 'cavalry_light'
                          ? 'cavalry_heavy'
                          : h.classType === 'archer_short'
                          ? 'archer_repeater'
                          : h.classType
                    }
                  : h
              )
            }));
            setInspectUnit(null);
          }}
        />
      )}
      {/* 도원결의 오프닝 프롤로그 모달 */}
      {isPrologueOpen && (
        <PrologueModal
          onComplete={() => {
            setIsPrologueOpen(false);
            setScreenMode('town');
            soundManager.playBgm('town');
          }}
        />
      )}

      {/* 삼국지 영걸전 대하 연대기 실록 모달 */}
      {isChronicleOpen && (
        <ChronicleModal
          onClose={() => setIsChronicleOpen(false)}
          currentStageId={gameState.currentStageId}
        />
      )}
    </div>
  );
}

export default App;
