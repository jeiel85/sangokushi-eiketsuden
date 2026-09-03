// 삼국지 영걸전 장수 상세 정보 / 스탯 / 장비 / 책략 모달

import React from 'react';
import { soundManager } from '../core/audio';
import { CHARACTERS } from '../data/characters';
import { UNIT_CLASSES } from '../data/classes';
import { ITEMS } from '../data/items';
import { TACTICS } from '../data/tactics';
import type { BattleUnit } from '../types/game';

interface UnitDetailModalProps {
  unit: BattleUnit;
  onClose: () => void;
  onPromote?: (unit: BattleUnit) => void;
}

export const UnitDetailModal: React.FC<UnitDetailModalProps> = ({ unit, onClose, onPromote }) => {
  const charDef = CHARACTERS[unit.charId] || {
    name: unit.name,
    title: '장수',
    description: '용맹한 무장.',
    force: 'shu'
  };

  const classDef = UNIT_CLASSES[unit.classType] || UNIT_CLASSES.infantry_light;

  const canPromote = classDef.promotionTo && unit.level >= (classDef.promotionLevel || 15);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-lg border-4 border-amber-600 bg-slate-950 p-6 text-white shadow-2xl">
        {/* 상단 윈도우 헤더 */}
        <div className="mb-4 flex items-center justify-between border-b-2 border-amber-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-700 px-2 py-0.5 text-xs font-bold text-black">장수 정보</span>
            <span className="text-xl font-bold text-amber-300">{unit.name} ({charDef.courtesyName || '장수'})</span>
            {charDef.title && (
              <span className="text-xs text-amber-400/80">[{charDef.title}]</span>
            )}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 좌측: 초상화 및 기본 정보 */}
          <div className="flex flex-col items-center rounded border-2 border-amber-900/60 bg-slate-900 p-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-amber-500 bg-slate-800 text-4xl font-black text-amber-400 shadow-inner">
              {unit.name[0]}
            </div>
            <div className="mt-3 text-center">
              <div className="text-lg font-bold text-white">{unit.name}</div>
              <div className="text-xs text-amber-300 font-semibold">{classDef.name} ({classDef.category})</div>
              <div className="mt-1 rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                소속: {charDef.force === 'shu' ? '촉한' : charDef.force === 'wei' ? '조위' : charDef.force === 'wu' ? '동오' : '군웅'}
              </div>
            </div>

            {/* 전직 가능 버튼 */}
            {canPromote && onPromote && (
              <button
                onClick={() => {
                  soundManager.playLevelUp();
                  onPromote(unit);
                }}
                className="mt-4 w-full rounded bg-amber-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 active:scale-95 transition shadow"
              >
                ⭐ 병종 승급 ({UNIT_CLASSES[classDef.promotionTo!].name})
              </button>
            )}
          </div>

          {/* 중앙 & 우측: 능력치 및 장비/책략 */}
          <div className="md:col-span-2 space-y-4">
            {/* 스탯 카드 */}
            <div className="rounded border border-amber-800/60 bg-slate-900 p-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-xs text-slate-400">레벨: </span>
                  <span className="font-bold text-yellow-400 text-base">{unit.level}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400">경험치: </span>
                  <span className="font-bold text-blue-400">{unit.exp} / 100</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400">이동력: </span>
                  <span className="font-bold text-emerald-400">{classDef.movement}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400">병력(HP): </span>
                  <span className="font-bold text-green-400">{unit.curHp} / {unit.maxHp}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400">책략치(MP): </span>
                  <span className="font-bold text-cyan-400">{unit.curMp} / {unit.maxMp}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400">사정거리: </span>
                  <span className="font-bold text-purple-400">{classDef.attackRangeMin} ~ {classDef.attackRangeMax}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400">무력: </span>
                  <span className="font-bold text-red-400">{unit.war}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400">지력: </span>
                  <span className="font-bold text-indigo-400">{unit.intel}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400">통솔력: </span>
                  <span className="font-bold text-amber-400">{unit.lead}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400">공격력: </span>
                  <span className="font-bold text-orange-400">{unit.attack}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400">방어력: </span>
                  <span className="font-bold text-teal-400">{unit.defense}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400">상태: </span>
                  <span className="font-bold text-slate-200">
                    {unit.status === 'confused' ? '💫 혼란' : unit.status === 'poisoned' ? '☠️ 독' : '정상'}
                  </span>
                </div>
              </div>
            </div>

            {/* 장비 아이템 (4 슬롯) */}
            <div className="rounded border border-amber-800/60 bg-slate-900 p-3">
              <div className="mb-2 text-xs font-bold text-amber-400">장비 및 소지품</div>
              <div className="grid grid-cols-2 gap-2">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const itemId = unit.equippedItems[slotIdx];
                  const item = itemId ? ITEMS[itemId] : null;

                  return (
                    <div
                      key={slotIdx}
                      className="flex items-center gap-2 rounded border border-slate-800 bg-slate-950 p-2 text-xs"
                    >
                      <span className="text-base">{item?.icon || '▫️'}</span>
                      <div className="overflow-hidden">
                        <div className="font-semibold text-slate-200 truncate">
                          {item?.name || '빈 슬롯'}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {item?.description || '장착 가능'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 습득 책략 목록 */}
            <div className="rounded border border-amber-800/60 bg-slate-900 p-3">
              <div className="mb-2 text-xs font-bold text-cyan-400">습득 책략 목록</div>
              {unit.tactics && unit.tactics.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {unit.tactics.map((tId) => {
                    const tactic = TACTICS[tId];
                    if (!tactic) return null;
                    return (
                      <span
                        key={tId}
                        className="rounded border border-cyan-800 bg-cyan-950/70 px-2 py-0.5 text-xs text-cyan-200"
                        title={tactic.description}
                      >
                        {tactic.name} (MP {tactic.mpCost})
                      </span>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-slate-500">습득한 책략이 없습니다.</div>
              )}
            </div>
          </div>
        </div>

        {/* 인물 열전 설명 */}
        <div className="mt-4 rounded border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-amber-400">[열전] </span>
          {charDef.description}
        </div>
      </div>
    </div>
  );
};
