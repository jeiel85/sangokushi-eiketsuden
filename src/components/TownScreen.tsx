// 삼국지 영걸전 거점/도시 모드 (대화, 정비, 상점, 출진 준비 화면)

import React, { useState } from 'react';
import { soundManager } from '../core/audio';
import { CHARACTERS } from '../data/characters';
import type { BattleUnit, GameState, StageDef } from '../types/game';

interface TownScreenProps {
  gameState: GameState;
  currentStage: StageDef;
  onOpenShop: () => void;
  onOpenEquip: () => void;
  onOpenDeployment: () => void;
  onOpenUnitDetail: (unit: BattleUnit) => void;
  onOpenStageSelect: () => void;
  onOpenChronicle: () => void;
  onSaveGame: () => void;
}

export const TownScreen: React.FC<TownScreenProps> = ({
  gameState,
  currentStage,
  onOpenShop,
  onOpenEquip,
  onOpenDeployment,
  onOpenUnitDetail,
  onOpenStageSelect,
  onOpenChronicle,
  onSaveGame
}) => {
  const [selectedDialogueHero, setSelectedDialogueHero] = useState<string>('liu_bei');

  const getHeroDialogue = (charId: string): string => {
    const stageId = currentStage.id;
    const stageName = currentStage.name;

    if (charId === 'guan_yu') {
      if (stageId <= 2) return `화웅 따위의 목은 술이 식기 전에 단칼에 베어 바치겠습니다. 형님께서는 염려 마십시오.`;
      if (stageId <= 12) return `여포의 용맹이 뛰어나다 하나 백성을 등진 자는 천하를 얻을 수 없습니다. [${stageName}]에서 결판을 내겠습니다.`;
      if (stageId <= 15) return `백마와 연진에서 안량과 문추를 베어 조조에게 빚을 갚았으니, 이제 오관참육장을 돌파해 형님을 뵈러 갑니다!`;
      if (stageId <= 30) return `장사 전투에서 만난 노장 황충은 참으로 충직한 장수요. 함께 힘을 합쳐 형주를 굳건히 지키겠습니다.`;
      if (stageId <= 40) return `번성에서 수계를 펼쳐 우금의 칠군을 수몰시켰습니다! 청룡언월도가 한실의 대의를 밝힐 것입니다.`;
      return `형님과 도원결의를 맺은 날이 엊그제 같소. 천하 통일과 한실 부흥의 그날까지 소장의 무예를 다 바치겠습니다.`;
    }

    if (charId === 'zhang_fei') {
      if (stageId <= 2) return `으하하! 호로관의 여포 녀석, 제아무리 날고 기어도 내 장팔사모 맛을 보면 간담이 서늘할 거요!`;
      if (stageId <= 12) return `간신 배 놈들을 모두 쓸어버리지 않고는 배길 수가 없소! [${stageName}]의 적들을 모조리 쓸어버립시다!`;
      if (stageId <= 23) return `당양교 위에 나 장익덕이 홀로 버티고 서 있다! 목숨이 아까운 조조 놈들은 덤벼라!`;
      if (stageId <= 35) return `가맹관에서 금마초와 밤낮을 횃불 밝혀 싸웠소! 이제 와구관의 장합 놈도 단숨에 쳐부수겠소!`;
      return `형님! 이제 마지막 결전 [${stageName}]만 남았소! 삼형제가 천하를 호령할 때가 드디어 왔소!`;
    }

    if (charId === 'zhao_yun') {
      if (stageId <= 10) return `공손찬 장군 휘하에 있었으나, 유현덕 공의 인덕을 흠모하여 왔습니다. 평생을 주군을 위해 바치겠습니다.`;
      if (stageId <= 23) return `장판파의 조조군 백만 대군 속이라도, 주군의 혈육인 아두님을 품에 안고 반드시 살아서 돌아오겠습니다!`;
      if (stageId <= 38) return `한수 전투에서 온몸이 담력(一身都是膽)이라는 찬사를 들었습니다. 상산 조자룡, 선봉에 서겠습니다!`;
      return `주군! 어떠한 험지라도 백마와 은창으로 길을 열겠습니다. [${stageName}]의 승리는 우리의 것입니다!`;
    }

    if (charId === 'zhuge_liang') {
      if (stageId <= 20) return `삼고초려의 은혜에 보답하고자 융중의 대책을 펼칩니다. 박망파와 신야에서 화공으로 조조군을 격파할 것입니다.`;
      if (stageId <= 25) return `동남풍이 불어오면 적벽의 조조 수군은 하룻밤 사이에 불바다가 될 것입니다. 천시와 지리는 우리에게 있습니다.`;
      if (stageId <= 34) return `서천의 험준한 산세를 넘어 익주를 평정하고 한중을 취해야 삼분천하의 계책이 완성됩니다.`;
      if (stageId <= 43) return `남만왕 맹획을 칠종칠금하여 남방의 우환을 없앴으니, 이제 북벌을 단행하여 중원을 수복할 때입니다.`;
      return `주군, [${stageName}]의 마지막 관문만 넘으면 400년 한실의 사직이 다시 우뚝 설 것입니다. 만전을 기해주소서.`;
    }

    // liu_bei
    return `백성들을 도탄에서 구하고 한실을 부흥시키는 것이 우리 의형제의 평생의 대의요. [${stageName}]에서도 전 장수들이 합심하여 승리를 쟁취합시다.`;
  };

  const activeDialogue = getHeroDialogue(selectedDialogueHero);

  return (
    <div className="relative flex h-screen w-full flex-col justify-between overflow-hidden bg-slate-950 p-4 select-none">
      {/* 고전 영걸전 궁전/성곽 배경 분위기 */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 via-slate-950 to-slate-900" />

      {/* 상단 거점 헤더 바 */}
      <div className="relative z-10 flex items-center justify-between rounded-lg border-2 border-amber-700 bg-slate-900/90 p-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded bg-amber-600 px-2.5 py-0.5 text-xs font-bold text-slate-950">
            거점 본영
          </div>
          <div>
            <div className="text-base font-bold text-amber-300">
              다음 전장: {currentStage.name} ({currentStage.chapterTitle})
            </div>
            <div className="text-xs text-slate-400">승리 조건: {currentStage.victoryCondition}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded border border-amber-600/70 bg-slate-950 px-3 py-1 text-xs font-bold text-yellow-400">
            소지금: {gameState.gold.toLocaleString()} 금
          </div>
          <button
            onClick={() => {
              soundManager.playMenuClick();
              onSaveGame();
            }}
            className="rounded bg-slate-800 px-3 py-1 text-xs font-bold text-slate-200 hover:bg-slate-700 active:scale-95 transition"
          >
            저장 💾
          </button>
        </div>
      </div>

      {/* 중앙 본영 회의실 & 장수들 */}
      <div className="relative z-10 my-auto flex flex-col items-center">
        {/* 장수들 대열 (클릭하여 대화) */}
        <div className="mb-6 flex flex-wrap justify-center gap-4">
          {['liu_bei', 'guan_yu', 'zhang_fei', 'zhao_yun', 'zhuge_liang'].map((charId) => {
            const char = CHARACTERS[charId];
            if (!char) return null;
            const isSelected = selectedDialogueHero === charId;

            return (
              <div
                key={charId}
                onClick={() => {
                  soundManager.playMenuClick();
                  setSelectedDialogueHero(charId);
                }}
                className={`group flex flex-col items-center cursor-pointer transition ${
                  isSelected ? 'scale-110' : 'opacity-75 hover:opacity-100 hover:scale-105'
                }`}
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-xl border-2 text-2xl font-bold shadow-lg transition ${
                    isSelected
                      ? 'border-amber-400 bg-amber-950/70 text-amber-300 shadow-amber-500/20'
                      : 'border-slate-700 bg-slate-900 text-slate-200'
                  }`}
                >
                  {char.name[0]}
                </div>
                <div className="mt-1.5 text-xs font-bold text-white">
                  {char.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* 대화창 */}
        <div className="w-full max-w-3xl rounded-lg border-2 border-amber-700 bg-slate-900/95 p-5 shadow-2xl">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-amber-500 bg-amber-950 text-2xl font-bold text-amber-300">
              {CHARACTERS[selectedDialogueHero]?.name[0] || '유'}
            </div>
            <div>
              <div className="font-bold text-amber-400 text-sm">
                [{CHARACTERS[selectedDialogueHero]?.name || '유비'}]
              </div>
              <p className="mt-1 text-sm text-slate-100 leading-relaxed font-medium">
                "{activeDialogue}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 명령 메뉴 버튼 바 */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 rounded-lg border border-slate-800 bg-slate-900/90 p-3 shadow-lg">
        <button
          onClick={() => {
            soundManager.playMenuClick();
            onOpenShop();
          }}
          className="rounded border border-amber-600 bg-amber-950/50 px-5 py-2.5 text-sm font-bold text-amber-300 hover:bg-amber-900/60 active:scale-95 transition"
        >
          도구 상점 🛒
        </button>

        <button
          onClick={() => {
            soundManager.playMenuClick();
            onOpenEquip();
          }}
          className="rounded border border-emerald-600 bg-emerald-950/50 px-5 py-2.5 text-sm font-bold text-emerald-300 hover:bg-emerald-900/60 active:scale-95 transition"
        >
          군비 정돈 / 전직 ⚔️
        </button>

        <button
          onClick={() => {
            soundManager.playMenuClick();
            const firstUnit = gameState.roster[0];
            if (firstUnit) {
              onOpenUnitDetail({
                uid: 'roster-0',
                charId: firstUnit.charId,
                name: CHARACTERS[firstUnit.charId]?.name || firstUnit.charId,
                faction: 'player',
                classType: firstUnit.classType,
                level: firstUnit.level,
                exp: firstUnit.exp,
                curHp: firstUnit.curHp,
                maxHp: firstUnit.maxHp,
                curMp: firstUnit.curMp,
                maxMp: firstUnit.maxMp,
                war: firstUnit.war,
                intel: firstUnit.intel,
                lead: firstUnit.lead,
                attack: Math.round(firstUnit.war * 1.5),
                defense: Math.round(firstUnit.lead * 1.4),
                x: 0,
                y: 0,
                hasActed: false,
                status: 'normal',
                equippedItems: firstUnit.equippedItems,
                tactics: firstUnit.tactics,
                morale: firstUnit.morale ?? 100
              });
            }
          }}
          className="rounded border border-blue-600 bg-blue-950/50 px-5 py-2.5 text-sm font-bold text-blue-300 hover:bg-blue-900/60 active:scale-95 transition"
        >
          장수 정보 / 군비 📜
        </button>

        <button
          onClick={() => {
            soundManager.playMenuClick();
            onOpenChronicle();
          }}
          className="rounded border border-emerald-600 bg-emerald-950/60 px-5 py-2.5 text-sm font-bold text-emerald-300 hover:bg-emerald-900/60 active:scale-95 transition"
        >
          삼국지 연대기 📖
        </button>

        <button
          onClick={() => {
            soundManager.playMenuClick();
            onOpenStageSelect();
          }}
          className="rounded border border-purple-600 bg-purple-950/50 px-5 py-2.5 text-sm font-bold text-purple-300 hover:bg-purple-900/60 active:scale-95 transition"
        >
          전투지 선택 🗺️
        </button>

        <button
          onClick={() => {
            soundManager.playLevelUp();
            onOpenDeployment();
          }}
          className="rounded bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 px-7 py-2.5 text-sm font-black text-slate-950 shadow-lg hover:from-amber-500 hover:to-yellow-400 active:scale-95 transition"
        >
          전장 출진 준비 ▶
        </button>
      </div>
    </div>
  );
};
