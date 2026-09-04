// 도원결의 (桃園結義) 오프닝 프롤로그 모달 컴포넌트

import React, { useState } from 'react';
import { soundManager } from '../core/audio';
import { PEACH_GARDEN_PROLOGUE } from '../data/storyChronicle';

interface PrologueModalProps {
  onComplete: () => void;
}

export const PrologueModal: React.FC<PrologueModalProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentDialogue = PEACH_GARDEN_PROLOGUE[currentIndex];
  const isLast = currentIndex >= PEACH_GARDEN_PROLOGUE.length - 1;

  const handleNext = () => {
    soundManager.playMenuClick();
    if (isLast) {
      soundManager.playCheerMorale();
      onComplete();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    soundManager.playMenuClick();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border-4 border-amber-600 bg-gradient-to-b from-slate-950 via-slate-900 to-black p-6 text-white shadow-2xl">
        {/* 상단 윈도우 헤더 */}
        <div className="flex items-center justify-between border-b-2 border-amber-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-pulse">🌸</span>
            <div>
              <h2 className="text-lg font-black text-amber-300">
                도원결의 (桃園結義) - 프롤로그
              </h2>
              <p className="text-[11px] text-amber-400/80">
                삼국지 영걸전 대하 서사시의 시작 ({currentIndex + 1} / {PEACH_GARDEN_PROLOGUE.length})
              </p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="rounded bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300 hover:bg-slate-700 active:scale-95 transition"
          >
            스킵 ⏩
          </button>
        </div>

        {/* 중앙 본문 컷씬 영역 */}
        <div className="my-6 min-h-[160px] flex items-start gap-5 rounded-xl border border-amber-900/60 bg-slate-950/70 p-5 shadow-inner">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-2 shadow-lg text-4xl font-black transition-transform duration-300 scale-105"
            style={{
              borderColor: currentDialogue.avatarColor,
              backgroundColor: '#0f172a',
              color: currentDialogue.avatarColor
            }}
          >
            {currentDialogue.avatarLetter}
          </div>

          <div className="flex-1 space-y-2">
            <div
              className="text-base font-black tracking-wide"
              style={{ color: currentDialogue.avatarColor }}
            >
              [{currentDialogue.speaker}]
            </div>
            <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-100 min-h-[80px]">
              {currentDialogue.text}
            </p>
          </div>
        </div>

        {/* 하단 제어 버튼 바 */}
        <div className="flex items-center justify-between border-t border-amber-900/60 pt-4">
          <div className="flex gap-1.5">
            {PEACH_GARDEN_PROLOGUE.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-6 bg-amber-400' : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {currentIndex > 0 && (
              <button
                onClick={() => {
                  soundManager.playMenuClick();
                  setCurrentIndex((prev) => Math.max(0, prev - 1));
                }}
                className="rounded bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 active:scale-95 transition"
              >
                ◀ 이전
              </button>
            )}
            <button
              onClick={handleNext}
              className="rounded bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 px-6 py-2 text-sm font-black text-slate-950 shadow-lg hover:from-amber-500 hover:to-yellow-400 active:scale-95 transition"
            >
              {isLast ? '대의를 품고 출진! ⚔️' : '다음 ▶'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
