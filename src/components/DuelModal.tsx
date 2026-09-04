// 삼국지 영걸전 시그니처 1:1 일기토(Duel) 전용 연출 모달

import React, { useEffect, useState } from 'react';
import { soundManager } from '../core/audio';
import { CHARACTERS } from '../data/characters';
import type { DuelDef } from '../types/game';

interface DuelModalProps {
  duel: DuelDef;
  onComplete: () => void;
}

export const DuelModal: React.FC<DuelModalProps> = ({ duel, onComplete }) => {
  const playerChar = CHARACTERS[duel.playerCharId] || { name: duel.playerCharId, baseWar: 95 };
  const enemyChar = CHARACTERS[duel.enemyCharId] || { name: duel.enemyCharId, baseWar: 90 };

  const [phase, setPhase] = useState<'dialogue' | 'clashing' | 'finish' | 'ended'>('dialogue');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [clashCount, setClashCount] = useState(0);
  const [playerHorseX, setPlayerHorseX] = useState(15);
  const [enemyHorseX, setEnemyHorseX] = useState(85);
  const [sparkVisible, setSparkVisible] = useState(false);

  useEffect(() => {
    soundManager.playBgm('duel');
    return () => {
      soundManager.playBgm('battle');
    };
  }, []);

  const handleNextDialogue = () => {
    soundManager.playMenuClick();
    if (dialogueIndex < duel.dialogueLines.length - 1) {
      setDialogueIndex(prev => prev + 1);
    } else {
      // 대화 종료 후 격돌 애니메이션 시작
      setPhase('clashing');
      startClashAnimation();
    }
  };

  const startClashAnimation = () => {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setClashCount(count);

      // 말들이 중앙으로 돌진하여 맞부딪힘
      setPlayerHorseX(42);
      setEnemyHorseX(58);
      setSparkVisible(true);
      soundManager.playDuelClash();

      setTimeout(() => {
        setSparkVisible(false);
        setPlayerHorseX(35);
        setEnemyHorseX(65);
      }, 300);

      if (count >= 4) {
        clearInterval(interval);
        setTimeout(() => {
          setPhase('finish');
          soundManager.playAttackSlash();
          soundManager.playHitImpact();
          // 승자 연출
          if (duel.winner === 'player') {
            setEnemyHorseX(80);
            setPlayerHorseX(55);
          }
          setTimeout(() => {
            setPhase('ended');
            soundManager.playVictoryFanfare();
          }, 1200);
        }, 500);
      }
    }, 800);
  };

  const currentLine = duel.dialogueLines[dialogueIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-lg border-4 border-amber-600 bg-slate-950 p-6 text-white shadow-2xl">
        {/* 상단 타이틀 배너 */}
        <div className="mb-4 flex items-center justify-between border-b-2 border-amber-700/60 pb-2">
          <div className="flex items-center gap-2">
            <span className="rounded bg-red-700 px-2.5 py-0.5 text-xs font-bold text-amber-200">일기토</span>
            <span className="font-bold text-lg text-amber-300">건곤일척 1:1 대결!</span>
          </div>
          <div className="flex items-center gap-3">
            {phase !== 'ended' && (
              <button
                onClick={() => {
                  soundManager.playMenuClick();
                  setPhase('ended');
                }}
                className="rounded bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-slate-300 hover:bg-slate-700 active:scale-95 transition"
              >
                스킵 ⏩
              </button>
            )}
            <div className="text-sm font-semibold text-slate-400">
              {phase === 'clashing' ? `격돌 중 (${clashCount}/4합)` : phase === 'ended' ? '승부 결착!' : '장수 대면'}
            </div>
          </div>
        </div>

        {/* 상단 장수 정보 헤더 */}
        <div className="grid grid-cols-2 gap-4 pb-4">
          {/* 아군 장수 */}
          <div className="flex items-center gap-3 rounded bg-blue-950/60 p-3 border border-blue-800">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-700 text-2xl font-bold shadow">
              {playerChar.name[0]}
            </div>
            <div>
              <div className="text-xs text-blue-300 font-semibold">아군 맹장</div>
              <div className="text-xl font-bold text-white">{playerChar.name}</div>
              <div className="text-xs text-amber-400 font-bold">무력: {playerChar.baseWar}</div>
            </div>
          </div>

          {/* 적군 장수 */}
          <div className="flex items-center justify-end gap-3 rounded bg-red-950/60 p-3 border border-red-800 text-right">
            <div>
              <div className="text-xs text-red-300 font-semibold">적군 맹장</div>
              <div className="text-xl font-bold text-white">{enemyChar.name}</div>
              <div className="text-xs text-amber-400 font-bold">무력: {enemyChar.baseWar}</div>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-red-700 text-2xl font-bold shadow">
              {enemyChar.name[0]}
            </div>
          </div>
        </div>

        {/* 전장 일기토 캔버스 애니메이션 영역 */}
        <div className="relative h-64 w-full overflow-hidden rounded border-2 border-amber-900/60 bg-gradient-to-b from-amber-950/40 via-yellow-950/20 to-amber-900/40">
          {/* 모래먼지 / 바닥 라인 */}
          <div className="absolute bottom-0 h-16 w-full bg-amber-900/40 border-t border-amber-800/40" />

          {/* 아군 기마 무장 */}
          <div
            className="absolute bottom-6 transition-all duration-300 ease-out"
            style={{ left: `${playerHorseX}%`, transform: 'translateX(-50%)' }}
          >
            <div className="flex flex-col items-center">
              <div className="mb-1 rounded bg-blue-900 px-2 py-0.5 text-[11px] font-bold text-blue-200">
                {playerChar.name}
              </div>
              <div className="relative text-5xl filter drop-shadow-md">
                🏇
                <div className="absolute -top-1 -right-2 text-2xl">⚔️</div>
              </div>
            </div>
          </div>

          {/* 불꽃 스파크 이펙트 */}
          {sparkVisible && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl animate-ping">
              💥
            </div>
          )}

          {/* 적군 기마 무장 */}
          <div
            className="absolute bottom-6 transition-all duration-300 ease-out"
            style={{ left: `${enemyHorseX}%`, transform: 'translateX(-50%) scaleX(-1)' }}
          >
            <div className="flex flex-col items-center">
              <div className="mb-1 rounded bg-red-900 px-2 py-0.5 text-[11px] font-bold text-red-200 [transform:scaleX(-1)]">
                {enemyChar.name}
              </div>
              <div className="relative text-5xl filter drop-shadow-md">
                🏇
                <div className="absolute -top-1 -right-2 text-2xl">🗡️</div>
              </div>
            </div>
          </div>

          {/* 피니시 결착 텍스트 */}
          {phase === 'finish' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="text-4xl font-extrabold text-yellow-400 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] animate-bounce">
                {duel.winner === 'player' ? `${playerChar.name}의 결정타!` : `${enemyChar.name}의 맹공!`}
              </div>
            </div>
          )}
        </div>

        {/* 하단 대사창 / 결과 버튼 */}
        <div className="mt-4 min-h-24 rounded border-2 border-amber-700 bg-slate-900 p-4">
          {phase === 'dialogue' && currentLine && (
            <div className="flex flex-col justify-between h-full">
              <div>
                <span className="font-bold text-amber-400">[{currentLine.speaker}]</span>
                <p className="mt-1 text-base text-slate-100 font-medium leading-relaxed">
                  "{currentLine.text}"
                </p>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleNextDialogue}
                  className="rounded bg-amber-600 px-4 py-1.5 text-sm font-bold text-slate-950 transition hover:bg-amber-500 active:scale-95 shadow"
                >
                  다음 ▶
                </button>
              </div>
            </div>
          )}

          {phase === 'clashing' && (
            <div className="flex h-full items-center justify-center text-center">
              <p className="text-lg font-bold text-amber-300 animate-pulse">
                칼과 창이 맹렬하게 부딪히며 불꽃이 튑니다!
              </p>
            </div>
          )}

          {phase === 'ended' && (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-amber-300">
                  {duel.winner === 'player' ? '아군 승리!' : '적군 승리!'}
                </div>
                <div className="text-xs text-slate-300">
                  경험치 +{duel.rewardExp} 획득! {duel.enemyRetreats ? '적장이 패주하여 퇴각했습니다.' : ''}
                </div>
              </div>
              <button
                onClick={onComplete}
                className="rounded bg-green-600 px-5 py-2 font-bold text-white transition hover:bg-green-500 active:scale-95 shadow-lg"
              >
                전투로 복귀하기 ▶
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
