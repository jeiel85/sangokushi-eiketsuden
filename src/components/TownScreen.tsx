// 삼국지 영걸전 거점/도시 모드 (대화, 정비, 상점, 출진 준비 화면)

import React, { useState } from 'react';
import { soundManager } from '../core/audio';
import { CHARACTERS } from '../data/characters';
import type { BattleUnit, GameState, StageDef } from '../types/game';

interface TownScreenProps {
  gameState: GameState;
  currentStage: StageDef;
  onOpenShop: () => void;
  onOpenDeployment: () => void;
  onOpenUnitDetail: (unit: BattleUnit) => void;
  onOpenStageSelect: () => void;
  onSaveGame: () => void;
}

export const TownScreen: React.FC<TownScreenProps> = ({
  gameState,
  currentStage,
  onOpenShop,
  onOpenDeployment,
  onOpenUnitDetail,
  onOpenStageSelect,
  onSaveGame
}) => {
  const [selectedDialogueHero, setSelectedDialogueHero] = useState<string>('liu_bei');

  const heroDialogues: Record<string, string> = {
    liu_bei: `백성들을 도탄에서 구하고 한실을 부흥시키는 것이 우리 의형제의 평생의 대의요. 다음 전투인 [${currentStage.name}]에서도 부디 신중을 기해주시오.`,
    guan_yu: `형님의 뜻이 향하는 곳이라면 소장의 청룡언월도가 언제든 앞장설 것입니다. 군비를 단단히 점검하십시오.`,
    zhang_fei: `으하하! 몸이 근질근질하던 참이었는데 잘 됐군! 이번에도 내 장팔사모 맛을 적들에게 톡톡히 보여주겠소!`,
    zhuge_liang: `주군, [${currentStage.name}]에서는 지형의 험준함과 적의 책략을 경계하셔야 합니다. 화계와 수계의 쓰임새를 미리 살펴보시길 권합니다.`,
    zhao_yun: `상산 조자룡, 주군의 안위를 지키기 위해 만반의 준비를 마쳤습니다! 명을 내려주십시오.`
  };

  const activeDialogue = heroDialogues[selectedDialogueHero] || heroDialogues.liu_bei;

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
                tactics: firstUnit.tactics
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
