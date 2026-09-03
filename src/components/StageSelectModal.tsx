// 삼국지 영걸전 전 스테이지 선택기 모달 (모든 챕터 & 전투 맵 자유 선택)

import React from 'react';
import { soundManager } from '../core/audio';
import { STAGES } from '../data/stages';

interface StageSelectModalProps {
  currentStageId: number;
  onSelectStage: (stageId: number) => void;
  onClose: () => void;
}

export const StageSelectModal: React.FC<StageSelectModalProps> = ({
  currentStageId,
  onSelectStage,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-lg border-4 border-amber-600 bg-slate-950 p-6 text-white shadow-2xl">
        {/* 상단 윈도우 헤더 */}
        <div className="mb-4 flex items-center justify-between border-b-2 border-amber-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-700 px-2.5 py-0.5 text-xs font-bold text-black">시나리오</span>
            <span className="text-xl font-bold text-amber-300">삼국지 영걸전 전 스테이지 선택기</span>
          </div>
          <button
            onClick={() => {
              soundManager.playMenuCancel();
              onClose();
            }}
            className="rounded bg-slate-800 px-2.5 py-1 text-sm font-bold text-slate-300 hover:bg-red-700 hover:text-white transition"
          >
            닫기 ✕
          </button>
        </div>

        {/* 스테이지 목록 그리드 */}
        <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
          {STAGES.map((stage) => {
            const isSelected = stage.id === currentStageId;

            return (
              <div
                key={stage.id}
                onClick={() => {
                  soundManager.playMenuClick();
                  onSelectStage(stage.id);
                  onClose();
                }}
                className={`flex flex-col sm:flex-row sm:items-center justify-between rounded border p-3 cursor-pointer transition ${
                  isSelected
                    ? 'border-amber-400 bg-amber-950/50'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                      제 {stage.id} 막
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{stage.chapterTitle}</span>
                    <span className="text-base font-bold text-white">{stage.name}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{stage.description}</p>
                  <div className="flex flex-wrap gap-3 text-[11px] text-slate-400">
                    <span>승리: <strong className="text-green-400">{stage.victoryCondition}</strong></span>
                    <span>최대 턴: <strong className="text-yellow-400">{stage.maxTurns}턴</strong></span>
                    <span>출진 한도: <strong className="text-blue-400">{stage.playerDeploymentLimit}명</strong></span>
                  </div>
                </div>

                <div className="mt-2 sm:mt-0 flex items-center justify-end">
                  <button className="rounded bg-amber-600 px-3 py-1.5 text-xs font-bold text-black hover:bg-amber-500 shadow">
                    {isSelected ? '현재 전투' : '출진 선택 ▶'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
