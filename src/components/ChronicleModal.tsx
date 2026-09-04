// 삼국지 영걸전 대하 역사 연대기 실록 (Chronicle) 모달 컴포넌트

import React, { useState } from 'react';
import { soundManager } from '../core/audio';
import { STAGES } from '../data/stages';
import {
  CHAPTER_CHRONICLES,
  PEACH_GARDEN_PROLOGUE,
  STAGE_BRIEFINGS
} from '../data/storyChronicle';

interface ChronicleModalProps {
  onClose: () => void;
  currentStageId?: number;
}

export const ChronicleModal: React.FC<ChronicleModalProps> = ({
  onClose,
  currentStageId = 1
}) => {
  const [activeTab, setActiveTab] = useState<'chapters' | 'battles' | 'oath'>('chapters');
  const [selectedChapterIdx, setSelectedChapterIdx] = useState(0);
  const [selectedBattleId, setSelectedBattleId] = useState(currentStageId);

  const currentChapter = CHAPTER_CHRONICLES[selectedChapterIdx] || CHAPTER_CHRONICLES[0];
  const currentBattle = STAGES.find((s) => s.id === selectedBattleId) || STAGES[0];
  const currentBriefing = STAGE_BRIEFINGS[selectedBattleId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative flex flex-col h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border-4 border-amber-600 bg-slate-950 text-white shadow-2xl">
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between border-b-2 border-amber-800 bg-slate-900/90 px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📜</span>
            <div>
              <h2 className="text-xl font-black text-amber-300">
                삼국지 영걸전 대하 연대기 실록 (三國志 實錄)
              </h2>
              <p className="text-xs text-amber-400/80">
                난세의 시작부터 천하 통일까지, 영웅들의 파란만장한 역사 서사시
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playMenuCancel();
              onClose();
            }}
            className="rounded bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-red-700 hover:text-white active:scale-95 transition"
          >
            닫기 ✕
          </button>
        </div>

        {/* 탭 내비게이션 바 */}
        <div className="flex border-b border-amber-900/80 bg-slate-900/60 px-6">
          <button
            onClick={() => {
              soundManager.playMenuClick();
              setActiveTab('chapters');
            }}
            className={`px-5 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'chapters'
                ? 'border-amber-400 text-amber-300 bg-amber-950/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📖 삼국지 7대 챕터 대하 연표
          </button>
          <button
            onClick={() => {
              soundManager.playMenuClick();
              setActiveTab('battles');
            }}
            className={`px-5 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'battles'
                ? 'border-amber-400 text-amber-300 bg-amber-950/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚔️ 46개 전장 역사 실록
          </button>
          <button
            onClick={() => {
              soundManager.playMenuClick();
              setActiveTab('oath');
            }}
            className={`px-5 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'oath'
                ? 'border-amber-400 text-amber-300 bg-amber-950/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🌸 도원결의 (桃園結義)
          </button>
        </div>

        {/* 1. 챕터별 대하 연표 탭 */}
        {activeTab === 'chapters' && (
          <div className="flex flex-1 overflow-hidden">
            {/* 좌측 챕터 선택 리스트 */}
            <div className="w-1/3 border-r border-amber-900/60 bg-slate-900/40 p-3 overflow-y-auto space-y-2">
              {CHAPTER_CHRONICLES.map((ch, idx) => {
                const isSelected = idx === selectedChapterIdx;
                return (
                  <button
                    key={ch.chapter}
                    onClick={() => {
                      soundManager.playMenuClick();
                      setSelectedChapterIdx(idx);
                    }}
                    className={`w-full text-left rounded-lg p-3 transition border ${
                      isSelected
                        ? 'border-amber-400 bg-amber-950/70 shadow-md'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[10px] font-bold text-amber-400">{ch.period}</div>
                    <div className="font-bold text-sm text-slate-100 mt-0.5 line-clamp-1">
                      {ch.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {ch.stagesCovered}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 우측 챕터 상세 서사 본문 */}
            <div className="w-2/3 p-6 overflow-y-auto space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded bg-amber-700/80 px-2.5 py-0.5 text-xs font-bold text-black">
                    {currentChapter.period}
                  </span>
                  <span className="text-xs text-amber-400/90 font-semibold">
                    포함 전투: {currentChapter.stagesCovered}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-amber-300 mt-2">
                  {currentChapter.title}
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="text-xs text-slate-400 font-semibold mr-1">주요 인물:</span>
                  {currentChapter.keyFigures.map((fig) => (
                    <span
                      key={fig}
                      className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-slate-300 border border-slate-700"
                    >
                      {fig}
                    </span>
                  ))}
                </div>
              </div>

              {/* 챕터 요약 상자 */}
              <div className="rounded-xl border-l-4 border-amber-500 bg-slate-900/90 p-4 shadow">
                <div className="text-xs font-bold text-amber-400 mb-1">【 시대 개요 】</div>
                <p className="text-sm font-semibold text-slate-200 leading-relaxed">
                  "{currentChapter.summary}"
                </p>
              </div>

              {/* 상세 역사 서사 단계별 풀이 */}
              <div className="space-y-3">
                <div className="text-sm font-bold text-amber-300 border-b border-amber-900/60 pb-1">
                  📜 상세 역사 기록 및 영걸전 스토리
                </div>
                {currentChapter.historicalNarrative.map((par, pIdx) => (
                  <div
                    key={pIdx}
                    className="flex items-start gap-3 text-sm leading-relaxed text-slate-200 bg-slate-900/40 p-3 rounded-lg border border-slate-800/80"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-800/80 text-[10px] font-bold text-amber-200 mt-0.5">
                      {pIdx + 1}
                    </span>
                    <p className="flex-1">{par}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. 46개 전장 역사 실록 탭 */}
        {activeTab === 'battles' && (
          <div className="flex flex-1 overflow-hidden">
            {/* 좌측 46개 전투 목록 */}
            <div className="w-1/3 border-r border-amber-900/60 bg-slate-900/40 p-3 overflow-y-auto space-y-2">
              {STAGES.map((st) => {
                const isSelected = st.id === selectedBattleId;
                return (
                  <button
                    key={st.id}
                    onClick={() => {
                      soundManager.playMenuClick();
                      setSelectedBattleId(st.id);
                    }}
                    className={`w-full text-left rounded-lg p-2.5 transition border ${
                      isSelected
                        ? 'border-amber-400 bg-amber-950/70 shadow-md'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] font-bold text-amber-400">
                        제 {st.id} 막
                      </span>
                      <span className="text-[10px] text-slate-500">{st.chapterTitle.split(':')[0]}</span>
                    </div>
                    <div className="font-bold text-sm text-slate-100 mt-1 line-clamp-1">
                      {st.name}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 우측 전투 상세 실록 */}
            <div className="w-2/3 p-6 overflow-y-auto space-y-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-amber-700 px-2.5 py-0.5 text-xs font-bold text-black">
                    제 {currentBattle.id} 막
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{currentBattle.chapterTitle}</span>
                </div>
                <h3 className="text-2xl font-black text-amber-300 mt-2">
                  {currentBattle.name}
                </h3>
              </div>

              {/* 시대 연도 및 장소 브리핑 */}
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-amber-900/60 bg-slate-900/90 p-3.5 text-xs">
                <div>
                  <span className="text-slate-400">시대 연도: </span>
                  <strong className="text-amber-300">{currentBriefing?.year || '후한 말기'}</strong>
                </div>
                <div>
                  <span className="text-slate-400">전투 장소: </span>
                  <strong className="text-amber-300">{currentBriefing?.location || currentBattle.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400">승리 조건: </span>
                  <strong className="text-green-400">{currentBattle.victoryCondition}</strong>
                </div>
                <div>
                  <span className="text-slate-400">패배 조건: </span>
                  <strong className="text-red-400">{currentBattle.defeatCondition}</strong>
                </div>
              </div>

              {/* 역사적 상황 해설 */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-2">
                <div className="text-xs font-bold text-amber-400">【 전황 및 역사적 맥락 】</div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {currentBriefing?.historicalContext || currentBattle.description}
                </p>
              </div>

              {/* 전략적 목표 */}
              {currentBriefing?.strategicObjective && (
                <div className="rounded-xl border-l-4 border-blue-500 bg-slate-900/60 p-4">
                  <div className="text-xs font-bold text-blue-400 mb-1">【 유비군의 전략 목표 】</div>
                  <p className="text-sm font-semibold text-slate-200">
                    {currentBriefing.strategicObjective}
                  </p>
                </div>
              )}

              {/* 명대사 */}
              {currentBriefing?.famousQuote && (
                <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-4 text-center">
                  <div className="text-xs font-bold text-amber-400 mb-1">
                    [명대사] - {currentBriefing.famousQuote.speaker}
                  </div>
                  <p className="text-base font-bold text-yellow-200 italic">
                    "{currentBriefing.famousQuote.text}"
                  </p>
                </div>
              )}

              {/* 1:1 일기토 기록 */}
              {currentBattle.duels && currentBattle.duels.length > 0 && (
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                  <div className="text-xs font-bold text-red-400">【 전장 일기토(一騎討) 이벤트 】</div>
                  {currentBattle.duels.map((duel, dIdx) => (
                    <div key={dIdx} className="text-xs text-slate-300">
                      ⚔️ <strong className="text-amber-300">{duel.playerCharId}</strong> vs{' '}
                      <strong className="text-red-300">{duel.enemyCharId}</strong> (승리 시 EXP +{duel.rewardExp})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. 도원결의 탭 */}
        {activeTab === 'oath' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="text-4xl">🌸</div>
              <h3 className="text-2xl font-black text-amber-300">
                도원결의 (桃園結義) - 삼국지 영걸전의 출발점
              </h3>
              <p className="text-xs text-slate-400">
                서기 184년 유주 탁현, 복숭아 밭에서 하늘과 땅에 제사를 지내고 맺은 삼형제의 불멸의 맹세
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              {PEACH_GARDEN_PROLOGUE.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4"
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-xl font-bold"
                    style={{
                      borderColor: item.avatarColor,
                      backgroundColor: '#020617',
                      color: item.avatarColor
                    }}
                  >
                    {item.avatarLetter}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="text-xs font-bold" style={{ color: item.avatarColor }}>
                      [{item.speaker}]
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-medium">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
