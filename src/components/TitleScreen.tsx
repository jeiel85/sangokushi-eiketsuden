// 삼국지 영걸전 타이틀 화면 및 전설의 '유비 얼굴 연타 레벨 99 치트' 구현

import React, { useState } from 'react';
import { soundManager } from '../core/audio';

interface TitleScreenProps {
  onStartGame: () => void;
  onContinueGame: () => void;
  onContinueBattle?: () => void;
  onOpenStageSelect: () => void;
  hasSavedGame: boolean;
  hasBattleSave?: boolean;
  onActivateLevel99Cheat: () => void;
  isCheated: boolean;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onContinueGame,
  onContinueBattle,
  onOpenStageSelect,
  hasSavedGame,
  hasBattleSave,
  onActivateLevel99Cheat,
  isCheated
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [showCheatNotification, setShowCheatNotification] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  const handleLiuBeiFaceClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    soundManager.playMenuClick();

    if (nextCount >= 10 && !isCheated) {
      soundManager.playCheatLevel99();
      onActivateLevel99Cheat();
      setShowCheatNotification(true);
      setTimeout(() => setShowCheatNotification(false), 4000);
    }
  };

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-between overflow-hidden bg-slate-950 p-6 select-none">
      {/* 고전 영걸전 배경 그래픽 효과 */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/40 via-slate-950 to-amber-950/40" />
      <div className="absolute inset-0 bg-[radial-gradient(#b91c1c_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

      {/* 상단 우측 음향 버튼 */}
      <div className="relative z-10 flex w-full justify-between items-center max-w-4xl">
        <div className="flex items-center gap-2">
          <span className="rounded border border-amber-600/80 bg-amber-950/80 px-2.5 py-1 text-xs font-bold text-amber-300">
            KOEI 1995 RECREATION
          </span>
          <span className="text-xs text-slate-400">웹 브라우저 100% 완전 재현 에디션</span>
        </div>
        <button
          onClick={toggleSound}
          className="rounded border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-bold text-slate-300 hover:border-amber-500 hover:text-white transition"
        >
          {isMuted ? '🔇 음소거 해제' : '🔊 사운드 ON'}
        </button>
      </div>

      {/* 중앙 메인 로고 & 유비 초상화 (치트키) */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto">
        {/* 타이틀 로고 */}
        <div className="relative mb-6">
          <div className="text-xs tracking-[0.4em] text-amber-400 font-bold mb-1">
            코에이 정통 턴제 시뮬레이션 RPG
          </div>
          <h1 className="font-serif text-5xl sm:text-7xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]">
            三國志 英傑傳
          </h1>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-200 drop-shadow">
            삼 국 지 &nbsp; 영 걸 전
          </div>
        </div>

        {/* 유비 초상화 (레전드 레벨 99 비기 클릭존) */}
        <div className="group relative my-4 flex flex-col items-center">
          <div
            onClick={handleLiuBeiFaceClick}
            className="relative flex h-32 w-32 cursor-pointer items-center justify-center rounded-2xl border-4 border-amber-500 bg-gradient-to-br from-green-900 via-slate-900 to-amber-950 text-6xl shadow-[0_0_25px_rgba(245,158,11,0.3)] transition active:scale-95 group-hover:border-yellow-300"
            title="유비의 얼굴을 여러 번 클릭해보세요! (전설의 비기)"
          >
            👑
            <div className="absolute -bottom-2 rounded bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-slate-950 shadow">
              유비 현덕
            </div>
          </div>
          <div className="mt-2 text-[11px] text-amber-300/80 font-medium">
            (💡 비기: 유비 초상화를 10회 연속 클릭하세요! {clickCount > 0 && clickCount < 10 ? `[${clickCount}/10]` : ''})
          </div>

          {/* 치트 발동 안내 팝업 */}
          {showCheatNotification && (
            <div className="absolute -top-16 z-20 w-80 animate-bounce rounded-lg border-2 border-yellow-400 bg-red-950 p-3 text-center text-xs font-bold text-yellow-300 shadow-2xl">
              🎉 전설의 비기 발동! 🎉<br />
              유비와 촉한 장수들의 레벨이 99가 되고 금화 10,000냥이 지급되었습니다!
            </div>
          )}

          {isCheated && (
            <div className="mt-1 text-xs font-bold text-yellow-400 animate-pulse">
              ⭐ 레벨 99 치트 적용 중 ⭐
            </div>
          )}
        </div>

        {/* 메인 메뉴 버튼들 */}
        <div className="mt-6 flex flex-col gap-3 w-64">
          <button
            onClick={() => {
              soundManager.playMenuClick();
              onStartGame();
            }}
            className="rounded border-2 border-amber-500 bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 px-6 py-3 text-base font-black text-slate-950 shadow-xl hover:from-amber-600 hover:to-yellow-500 active:scale-95 transition"
          >
            새로운 천하 통일 시작 ⚔️
          </button>

          {hasBattleSave && onContinueBattle && (
            <button
              onClick={() => {
                soundManager.playMenuClick();
                onContinueBattle();
              }}
              className="rounded border-2 border-indigo-500 bg-indigo-950/80 px-6 py-3 text-base font-bold text-indigo-200 hover:bg-indigo-900 active:scale-95 transition shadow-lg animate-pulse"
            >
              전투 이어하기 (전장 저장) ⚔️
            </button>
          )}

          {hasSavedGame && (
            <button
              onClick={() => {
                soundManager.playMenuClick();
                onContinueGame();
              }}
              className="rounded border-2 border-blue-600 bg-slate-900 px-6 py-3 text-base font-bold text-blue-200 hover:bg-slate-850 active:scale-95 transition"
            >
              거점 이어하기 (본영 저장) 💾
            </button>
          )}

          <button
            onClick={() => {
              soundManager.playMenuClick();
              onOpenStageSelect();
            }}
            className="rounded border border-slate-700 bg-slate-900/80 px-6 py-2.5 text-sm font-semibold text-slate-300 hover:border-amber-400 hover:text-white active:scale-95 transition"
          >
            전 스테이지 선택기 🗺️
          </button>
        </div>
      </div>

      {/* 하단 저작권 및 안내 */}
      <div className="relative z-10 text-center text-xs text-slate-500">
        1995 KOEI Classic SRPG Homage · Developed with Web Technologies & TypeScript
      </div>
    </div>
  );
};
