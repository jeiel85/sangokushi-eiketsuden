// 삼국지 영걸전 도구상점(Tool Shop) 모달

import React, { useState } from 'react';
import { soundManager } from '../core/audio';
import { ITEMS } from '../data/items';
import type { ItemDef } from '../types/game';

interface ShopModalProps {
  gold: number;
  inventory: string[];
  onBuy: (itemId: string, cost: number) => void;
  onSell: (itemIndex: number, price: number) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  gold,
  inventory,
  onBuy,
  onSell,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [selectedItem, setSelectedItem] = useState<ItemDef | null>(null);

  // 상점에서 취급하는 상품 목록
  const shopItemIds = [
    'bean', 'rice', 'meat', 'good_medicine', 'wine', 'clear_wine', 'stimulant',
    'iron_sword', 'iron_spear', 'repeater_bow', 'leather_armor', 'iron_armor',
    'manual_sword', 'manual_horse', 'manual_bow'
  ];

  const handleBuy = (item: ItemDef) => {
    if (gold < item.price) {
      soundManager.playMenuCancel();
      alert('금화가 부족합니다!');
      return;
    }
    soundManager.playMenuClick();
    onBuy(item.id, item.price);
  };

  const handleSell = (index: number, item: ItemDef) => {
    const sellPrice = Math.round(item.price * 0.7);
    soundManager.playMenuClick();
    onSell(index, sellPrice);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-lg border-4 border-amber-600 bg-slate-950 p-6 text-white shadow-2xl">
        {/* 상단 윈도우 헤더 */}
        <div className="mb-4 flex items-center justify-between border-b-2 border-amber-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-700 px-2.5 py-0.5 text-xs font-bold text-black">도구상점</span>
            <span className="text-xl font-bold text-amber-300">낙양 도구점 (무기 및 보급품)</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded border border-amber-600/60 bg-slate-900 px-3 py-1 text-sm font-bold text-yellow-400">
              소지금: {gold.toLocaleString()} 금
            </div>
            <button
              onClick={() => {
                soundManager.playMenuCancel();
                onClose();
              }}
              className="rounded bg-slate-800 px-2.5 py-1 text-sm font-bold text-slate-300 hover:bg-red-700 hover:text-white transition"
            >
              나가기 ✕
            </button>
          </div>
        </div>

        {/* 탭 버튼 */}
        <div className="mb-4 flex gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => {
              soundManager.playMenuClick();
              setActiveTab('buy');
            }}
            className={`rounded px-4 py-1.5 text-sm font-bold transition ${
              activeTab === 'buy' ? 'bg-amber-600 text-black' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            물품 구매
          </button>
          <button
            onClick={() => {
              soundManager.playMenuClick();
              setActiveTab('sell');
            }}
            className={`rounded px-4 py-1.5 text-sm font-bold transition ${
              activeTab === 'sell' ? 'bg-amber-600 text-black' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            소지품 매각 ({inventory.length}개)
          </button>
        </div>

        {/* 메인 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {activeTab === 'buy' ? (
              shopItemIds.map((itemId) => {
                const item = ITEMS[itemId];
                if (!item) return null;
                const canAfford = gold >= item.price;

                return (
                  <div
                    key={itemId}
                    onClick={() => setSelectedItem(item)}
                    className={`flex items-center justify-between rounded border p-2 text-xs cursor-pointer transition ${
                      selectedItem?.id === item.id
                        ? 'border-amber-400 bg-amber-950/40'
                        : 'border-slate-800 bg-slate-900 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <div className="font-bold text-slate-200">{item.name}</div>
                        <div className="text-[10px] text-slate-400">{item.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>
                        {item.price} 금
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuy(item);
                        }}
                        disabled={!canAfford}
                        className="rounded bg-amber-600 px-2.5 py-1 text-[11px] font-bold text-black hover:bg-amber-500 disabled:opacity-30"
                      >
                        구매
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              inventory.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  매각할 소지품이 없습니다.
                </div>
              ) : (
                inventory.map((itemId, idx) => {
                  const item = ITEMS[itemId];
                  if (!item) return null;
                  const sellPrice = Math.round(item.price * 0.7);

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedItem(item)}
                      className={`flex items-center justify-between rounded border p-2 text-xs cursor-pointer transition ${
                        selectedItem?.id === item.id
                          ? 'border-amber-400 bg-amber-950/40'
                          : 'border-slate-800 bg-slate-900 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.icon}</span>
                        <div>
                          <div className="font-bold text-slate-200">{item.name}</div>
                          <div className="text-[10px] text-slate-400">{item.type}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-400">+{sellPrice} 금</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSell(idx, item);
                          }}
                          className="rounded bg-green-700 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-green-600"
                        >
                          판매
                        </button>
                      </div>
                    </div>
                  );
                })
              )
            )}
          </div>

          {/* 우측 아이템 상세 설명 */}
          <div className="flex flex-col justify-between rounded border border-amber-900/60 bg-slate-900 p-4">
            {selectedItem ? (
              <div>
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <span className="text-4xl">{selectedItem.icon}</span>
                  <div>
                    <div className="text-base font-bold text-amber-300">{selectedItem.name}</div>
                    <div className="text-xs text-slate-400">분류: {selectedItem.type}</div>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-xs text-slate-300 leading-relaxed">
                  <p>{selectedItem.description}</p>
                  {selectedItem.attackBonus && (
                    <p className="font-bold text-orange-400">공격력 보정: +{selectedItem.attackBonus}</p>
                  )}
                  {selectedItem.defenseBonus && (
                    <p className="font-bold text-teal-400">방어력 보정: +{selectedItem.defenseBonus}</p>
                  )}
                  {selectedItem.movementBonus && (
                    <p className="font-bold text-emerald-400">이동력 보정: +{selectedItem.movementBonus}</p>
                  )}
                  {selectedItem.hpRestore && (
                    <p className="font-bold text-green-400">병력 회복: {selectedItem.hpRestore >= 9000 ? '전체 회복' : `+${selectedItem.hpRestore}`}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-500">
                물품을 선택하면 상세 정보가 표시됩니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
