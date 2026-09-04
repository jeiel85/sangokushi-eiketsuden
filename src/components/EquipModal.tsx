// 삼국지 영걸전 군비 정돈 및 장비/소지품 관리 모달

import React, { useState } from 'react';
import { soundManager } from '../core/audio';
import { CHARACTERS } from '../data/characters';
import { UNIT_CLASSES } from '../data/classes';
import { ITEMS } from '../data/items';
import type { GameState, ItemDef, UnitClassType } from '../types/game';

interface EquipModalProps {
  gameState: GameState;
  onUpdateGameState: (updater: (prev: GameState) => GameState) => void;
  onClose: () => void;
}

export const EquipModal: React.FC<EquipModalProps> = ({
  gameState,
  onUpdateGameState,
  onClose
}) => {
  const [selectedHeroIndex, setSelectedHeroIndex] = useState(0);
  const currentHero = gameState.roster[selectedHeroIndex] || gameState.roster[0];
  const charDef = CHARACTERS[currentHero.charId] || { name: currentHero.charId };
  const classDef = UNIT_CLASSES[currentHero.classType as keyof typeof UNIT_CLASSES] || UNIT_CLASSES.infantry_light;

  // 장비 해제
  const handleUnequip = (slotIndex: number) => {
    const itemId = currentHero.equippedItems[slotIndex];
    if (!itemId) return;

    soundManager.playMenuClick();
    onUpdateGameState((prev) => {
      const roster = [...prev.roster];
      const hero = { ...roster[selectedHeroIndex] };
      const equippedItems = [...hero.equippedItems];
      equippedItems.splice(slotIndex, 1);
      hero.equippedItems = equippedItems;
      roster[selectedHeroIndex] = hero;

      return {
        ...prev,
        roster,
        inventory: [...prev.inventory, itemId]
      };
    });
  };

  // 장비 장착
  const handleEquip = (invIndex: number) => {
    const itemId = gameState.inventory[invIndex];
    if (!itemId) return;

    if (currentHero.equippedItems.length >= 4) {
      soundManager.playMenuCancel();
      alert('장비 슬롯(최대 4개)이 가득 찼습니다.');
      return;
    }

    soundManager.playMenuClick();
    onUpdateGameState((prev) => {
      const inventory = [...prev.inventory];
      inventory.splice(invIndex, 1);

      const roster = [...prev.roster];
      const hero = { ...roster[selectedHeroIndex] };
      hero.equippedItems = [...hero.equippedItems, itemId];
      roster[selectedHeroIndex] = hero;

      return {
        ...prev,
        roster,
        inventory
      };
    });
  };

  // 전직 지침서 사용
  const handleUseManual = (invIndex: number, item: ItemDef) => {
    if (!item.promotesClass) return;

    soundManager.playLevelUp();
    onUpdateGameState((prev) => {
      const inventory = [...prev.inventory];
      inventory.splice(invIndex, 1);

      const roster = [...prev.roster];
      const hero = { ...roster[selectedHeroIndex] };
      hero.classType = item.promotesClass as UnitClassType;
      // 스탯 보너스
      hero.maxHp += 80;
      hero.curHp = hero.maxHp;
      hero.maxMp += 30;
      hero.curMp = hero.maxMp;
      roster[selectedHeroIndex] = hero;

      return {
        ...prev,
        roster,
        inventory
      };
    });

    alert(`${charDef.name} 장수가 [${UNIT_CLASSES[item.promotesClass].name}] 병종으로 전직 승급하였습니다!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-lg border-4 border-amber-600 bg-slate-950 p-6 text-white shadow-2xl">
        {/* 상단 윈도우 헤더 */}
        <div className="mb-4 flex items-center justify-between border-b-2 border-amber-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-700 px-2.5 py-0.5 text-xs font-bold text-black">군비 관리</span>
            <span className="text-xl font-bold text-amber-300">장수 장비 및 소지품 정돈</span>
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

        {/* 장수 선택 탭 */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          {gameState.roster.map((hero, idx) => {
            const hDef = CHARACTERS[hero.charId] || { name: hero.charId };
            const isSelected = idx === selectedHeroIndex;

            return (
              <button
                key={hero.charId}
                onClick={() => {
                  soundManager.playMenuClick();
                  setSelectedHeroIndex(idx);
                }}
                className={`flex items-center gap-2 rounded px-3 py-1.5 text-xs font-bold whitespace-nowrap transition ${
                  isSelected
                    ? 'border border-amber-400 bg-amber-950 text-amber-200'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span>{hDef.name}</span>
                <span className="text-[10px] text-yellow-400">Lv.{hero.level}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 좌측: 선택된 장수의 현재 장착 슬롯 */}
          <div className="space-y-4 rounded border border-amber-900/60 bg-slate-900/90 p-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-amber-500 bg-slate-800 text-2xl font-black text-amber-400">
                {charDef.name[0]}
              </div>
              <div>
                <div className="text-base font-bold text-white">{charDef.name}</div>
                <div className="text-xs text-amber-300 font-semibold">{classDef.name} (Lv.{currentHero.level})</div>
                <div className="text-[11px] text-slate-400">
                  HP: {currentHero.curHp}/{currentHero.maxHp} · MP: {currentHero.curMp}/{currentHero.maxMp} · 무력: {currentHero.war}
                </div>
              </div>
            </div>

            <div className="text-xs font-bold text-amber-400">장착 중인 아이템 (클릭 시 해제)</div>
            <div className="space-y-2">
              {[0, 1, 2, 3].map((slotIdx) => {
                const itemId = currentHero.equippedItems[slotIdx];
                const item = itemId ? ITEMS[itemId] : null;

                return (
                  <div
                    key={slotIdx}
                    className="flex items-center justify-between rounded border border-slate-800 bg-slate-950 p-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{item?.icon || '▫️'}</span>
                      <div>
                        <div className="font-bold text-slate-200">{item?.name || '빈 슬롯'}</div>
                        <div className="text-[10px] text-slate-400">{item?.description || '소지품에서 장착 가능'}</div>
                      </div>
                    </div>
                    {item && (
                      <button
                        onClick={() => handleUnequip(slotIdx)}
                        className="rounded bg-red-900/80 hover:bg-red-800 px-2 py-1 text-[10px] font-bold text-red-200"
                      >
                        해제
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 우측: 보관 중인 전체 소지품 (인벤토리) */}
          <div className="space-y-3 rounded border border-amber-900/60 bg-slate-900/90 p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="text-xs font-bold text-emerald-400">
                보관 중인 소지품 ({gameState.inventory.length}개)
              </div>
              <div className="text-[11px] text-slate-400">클릭하여 장착 또는 전직</div>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {gameState.inventory.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  보관 중인 소지품이 없습니다. 도구 상점에서 구매하세요.
                </div>
              ) : (
                gameState.inventory.map((itemId, idx) => {
                  const item = ITEMS[itemId];
                  if (!item) return null;
                  const isManual = item.type === 'manual' && item.promotesClass;

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded border border-slate-800 bg-slate-950 p-2.5 text-xs hover:border-slate-700 transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <div className="font-bold text-slate-200">{item.name}</div>
                          <div className="text-[10px] text-slate-400">{item.description}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isManual ? (
                          <button
                            onClick={() => handleUseManual(idx, item)}
                            className="rounded bg-yellow-600 hover:bg-yellow-500 px-2.5 py-1 text-[11px] font-bold text-slate-950"
                          >
                            전직 사용
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEquip(idx)}
                            disabled={currentHero.equippedItems.length >= 4}
                            className="rounded bg-amber-600 hover:bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-slate-950 disabled:opacity-40"
                          >
                            장착
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
