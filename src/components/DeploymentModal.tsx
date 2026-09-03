// 삼국지 영걸전 출진 장수 편성 모달

import React from 'react';
import { soundManager } from '../core/audio';
import { CHARACTERS } from '../data/characters';
import { UNIT_CLASSES } from '../data/classes';
import type { StageDef } from '../types/game';

interface DeploymentModalProps {
  stage: StageDef;
  roster: {
    charId: string;
    level: number;
    exp: number;
    classType: string;
    curHp: number;
    maxHp: number;
  }[];
  selectedCharIds: string[];
  onToggleSelect: (charId: string) => void;
  onDeploy: () => void;
  onClose: () => void;
}

export const DeploymentModal: React.FC<DeploymentModalProps> = ({
  stage,
  roster,
  selectedCharIds,
  onToggleSelect,
  onDeploy,
  onClose
}) => {
  const isDeployable = selectedCharIds.length > 0 && selectedCharIds.length <= stage.playerDeploymentLimit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-lg border-4 border-amber-600 bg-slate-950 p-6 text-white shadow-2xl">
        {/* 상단 윈도우 헤더 */}
        <div className="mb-4 flex items-center justify-between border-b-2 border-amber-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-700 px-2.5 py-0.5 text-xs font-bold text-black">출진 부대 편성</span>
            <span className="text-xl font-bold text-amber-300">{stage.name} - 출진 장수 선택</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded border border-blue-500 bg-blue-950/70 px-2.5 py-0.5 text-xs font-bold text-blue-300">
              출진 가능: {selectedCharIds.length} / {stage.playerDeploymentLimit}인
            </span>
            <button
              onClick={() => {
                soundManager.playMenuCancel();
                onClose();
              }}
              className="rounded bg-slate-800 px-2.5 py-1 text-sm font-bold text-slate-300 hover:bg-red-700 hover:text-white transition"
            >
              취소 ✕
            </button>
          </div>
        </div>

        {/* 장수 카드 목록 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
          {roster.map((hero) => {
            const charDef = CHARACTERS[hero.charId] || { name: hero.charId };
            const classDef = UNIT_CLASSES[hero.classType as keyof typeof UNIT_CLASSES] || UNIT_CLASSES.infantry_light;
            const isSelected = selectedCharIds.includes(hero.charId);
            const isRequired = stage.requiredPlayerCharIds.includes(hero.charId);

            return (
              <div
                key={hero.charId}
                onClick={() => {
                  if (isRequired) return; // 필수 출진 장수는 해제 불가
                  soundManager.playMenuClick();
                  onToggleSelect(hero.charId);
                }}
                className={`flex items-center justify-between rounded border p-3 cursor-pointer transition ${
                  isSelected
                    ? 'border-amber-400 bg-amber-950/40 shadow-md'
                    : 'border-slate-800 bg-slate-900 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-800 font-bold text-lg text-amber-400 border border-slate-700">
                    {charDef.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-sm">{charDef.name}</span>
                      {isRequired && (
                        <span className="rounded bg-red-900/80 px-1.5 py-0.2 text-[10px] font-bold text-red-200">
                          필수
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Lv.{hero.level} {classDef.name}
                    </div>
                  </div>
                </div>

                <div>
                  {isSelected ? (
                    <span className="rounded bg-amber-600 px-2.5 py-1 text-xs font-bold text-black">
                      출진
                    </span>
                  ) : (
                    <span className="rounded bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-400">
                      대기
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 출진 개시 버튼 */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
          <div className="text-xs text-slate-400">
            필수 출진 장수를 포함하여 부대를 편성한 후 출진하십시오.
          </div>
          <button
            onClick={() => {
              soundManager.playLevelUp();
              onDeploy();
            }}
            disabled={!isDeployable}
            className="rounded bg-gradient-to-r from-amber-600 to-yellow-500 px-6 py-2 text-sm font-bold text-slate-950 shadow-lg hover:from-amber-500 hover:to-yellow-400 disabled:opacity-30 active:scale-95 transition"
          >
            전장으로 출진! ⚔️
          </button>
        </div>
      </div>
    </div>
  );
};
