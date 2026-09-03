// 삼국지 영걸전 픽셀 캔버스 2D 렌더러

import { TERRAINS, UNIT_CLASSES } from '../data/classes';
import type { BattleUnit, TerrainType } from '../types/game';

export interface DamageFloater {
  id: number;
  x: number; // 타일 좌표
  y: number;
  text: string;
  color: string;
  lifetime: number; // 0 ~ 1
}

export interface AnimationEffect {
  id: number;
  type: 'slash' | 'fire' | 'water' | 'rock' | 'heal' | 'level_up';
  x: number;
  y: number;
  progress: number; // 0 ~ 1
}

export class GameRenderer {
  public tileSize: number = 48; // 타일 기본 픽셀 크기
  public animationTick: number = 0;

  constructor(tileSize: number = 48) {
    this.tileSize = tileSize;
  }

  // 1. 타일맵 그리기
  public renderMap(
    ctx: CanvasRenderingContext2D,
    mapData: TerrainType[][],
    cameraX: number,
    cameraY: number
  ) {
    const height = mapData.length;
    const width = mapData[0]?.length || 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const terrain = mapData[y][x];
        const screenX = x * this.tileSize - cameraX;
        const screenY = y * this.tileSize - cameraY;

        this.drawTerrainTile(ctx, terrain, screenX, screenY, x, y);
      }
    }
  }

  // 지형 타일별 정밀 레트로 도트 그래픽 렌더링
  private drawTerrainTile(
    ctx: CanvasRenderingContext2D,
    terrain: TerrainType,
    sx: number,
    sy: number,
    gx: number,
    gy: number
  ) {
    const ts = this.tileSize;
    const info = TERRAINS[terrain] || TERRAINS.plain;

    // 기본 배경색
    ctx.fillStyle = info.color;
    ctx.fillRect(sx, sy, ts, ts);

    // 지형별 픽셀 텍스처 데코레이션
    switch (terrain) {
      case 'plain':
      case 'grass': {
        // 작은 풀잎 도트
        ctx.fillStyle = terrain === 'grass' ? '#4d7c0f' : '#65a30d';
        ctx.fillRect(sx + 10, sy + 14, 4, 3);
        ctx.fillRect(sx + 28, sy + 32, 4, 3);
        ctx.fillRect(sx + 36, sy + 10, 3, 4);
        break;
      }
      case 'forest': {
        // 숲 나무 도트
        ctx.fillStyle = '#1b5e20';
        ctx.fillRect(sx + 6, sy + 6, ts - 12, ts - 12);
        ctx.fillStyle = '#2e7d32';
        ctx.fillRect(sx + 10, sy + 10, ts - 20, ts - 20);
        ctx.fillStyle = '#4e342e'; // 나무 밑동
        ctx.fillRect(sx + ts / 2 - 2, sy + ts - 8, 4, 6);
        ctx.fillStyle = '#81c784';
        ctx.fillRect(sx + 14, sy + 14, 4, 4);
        break;
      }
      case 'mountain': {
        // 험준한 바위산 봉우리
        ctx.fillStyle = '#6d4c41';
        ctx.beginPath();
        ctx.moveTo(sx + ts / 2, sy + 6);
        ctx.lineTo(sx + ts - 6, sy + ts - 4);
        ctx.lineTo(sx + 6, sy + ts - 4);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#a1887f'; // 산 그림자/하이라이트
        ctx.beginPath();
        ctx.moveTo(sx + ts / 2, sy + 6);
        ctx.lineTo(sx + ts / 2, sy + ts - 4);
        ctx.lineTo(sx + 6, sy + ts - 4);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'river': {
        // 강물 물결 애니메이션
        const wave = Math.sin(this.animationTick * 0.05 + gx + gy) * 3;
        ctx.fillStyle = '#0277bd';
        ctx.fillRect(sx, sy + 12 + wave, ts, 4);
        ctx.fillStyle = '#4fc3f7';
        ctx.fillRect(sx + 8, sy + 24 - wave, 16, 2);
        break;
      }
      case 'bridge': {
        // 목조 다리 난간과 판자
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(sx, sy + 4, ts, ts - 8);
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(sx, sy + 4, ts, 3);
        ctx.fillRect(sx, sy + ts - 7, ts, 3);
        // 세로 판자 틈
        for (let i = 6; i < ts; i += 8) {
          ctx.fillRect(sx + i, sy + 4, 2, ts - 8);
        }
        break;
      }
      case 'swamp': {
        // 보라/짙은 녹색 습지 수포
        ctx.fillStyle = '#33691e';
        ctx.fillRect(sx + 8, sy + 12, 10, 8);
        ctx.fillRect(sx + 26, sy + 28, 12, 6);
        ctx.fillStyle = '#827717';
        ctx.fillRect(sx + 10, sy + 14, 4, 3);
        break;
      }
      case 'castle': {
        // 성내 석조 바닥 타일
        ctx.fillStyle = '#90a4ae';
        ctx.fillRect(sx + 2, sy + 2, ts - 4, ts - 4);
        ctx.strokeStyle = '#546e7a';
        ctx.lineWidth = 1;
        ctx.strokeRect(sx + 2, sy + 2, ts - 4, ts - 4);
        break;
      }
      case 'wall': {
        // 높은 성벽 블록
        ctx.fillStyle = '#37474f';
        ctx.fillRect(sx, sy, ts, ts);
        ctx.fillStyle = '#546e7a';
        ctx.fillRect(sx + 2, sy + 2, ts - 4, ts / 2 - 3);
        ctx.fillRect(sx + 2, sy + ts / 2 + 1, ts - 4, ts / 2 - 3);
        break;
      }
      case 'gate': {
        // 붉은 기둥과 기와 관문
        ctx.fillStyle = '#b71c1c';
        ctx.fillRect(sx + 4, sy + 4, 6, ts - 8);
        ctx.fillRect(sx + ts - 10, sy + 4, 6, ts - 8);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(sx + 2, sy + 4, ts - 4, 6);
        break;
      }
      case 'village': {
        // 초가집 / 민가 지붕
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.moveTo(sx + ts / 2, sy + 8);
        ctx.lineTo(sx + ts - 8, sy + 22);
        ctx.lineTo(sx + 8, sy + 22);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#78350f';
        ctx.fillRect(sx + 12, sy + 22, ts - 24, 16);
        ctx.fillStyle = '#fef3c7'; // 문
        ctx.fillRect(sx + ts / 2 - 3, sy + 28, 6, 10);
        break;
      }
      case 'barracks': {
        // 군막 / 병영 텐트
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.moveTo(sx + ts / 2, sy + 6);
        ctx.lineTo(sx + ts - 6, sy + ts - 8);
        ctx.lineTo(sx + 6, sy + ts - 8);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.fillRect(sx + ts / 2 - 2, sy + 14, 4, 16);
        break;
      }
      case 'treasure': {
        // 황금 보물 상자
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(sx + 10, sy + 16, ts - 20, ts - 26);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(sx + 12, sy + 14, ts - 24, 6);
        ctx.fillStyle = '#1e293b'; // 자물쇠
        ctx.fillRect(sx + ts / 2 - 2, sy + 22, 4, 5);
        break;
      }
      default:
        break;
    }

    // 그리드 격자 테두리 (미세한 레트로 도트 라인)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(sx, sy, ts, ts);
  }

  // 2. 이동 가능 범위 하이라이트 (푸른색)
  public renderMoveRange(
    ctx: CanvasRenderingContext2D,
    rangeCoords: { x: number; y: number }[],
    cameraX: number,
    cameraY: number
  ) {
    const ts = this.tileSize;
    const pulse = 0.35 + Math.sin(this.animationTick * 0.08) * 0.08;

    for (const c of rangeCoords) {
      const sx = c.x * ts - cameraX;
      const sy = c.y * ts - cameraY;

      ctx.fillStyle = `rgba(59, 130, 246, ${pulse})`;
      ctx.fillRect(sx, sy, ts, ts);
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx + 1, sy + 1, ts - 2, ts - 2);
    }
  }

  // 3. 공격 / 책략 타겟 범위 하이라이트 (붉은색)
  public renderAttackRange(
    ctx: CanvasRenderingContext2D,
    targetCoords: { x: number; y: number }[],
    cameraX: number,
    cameraY: number
  ) {
    const ts = this.tileSize;
    const pulse = 0.45 + Math.sin(this.animationTick * 0.1) * 0.1;

    for (const c of targetCoords) {
      const sx = c.x * ts - cameraX;
      const sy = c.y * ts - cameraY;

      ctx.fillStyle = `rgba(239, 68, 68, ${pulse})`;
      ctx.fillRect(sx, sy, ts, ts);
      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx + 1, sy + 1, ts - 2, ts - 2);
    }
  }

  // 4. 장수 부대 스프라이트 렌더링
  public renderUnits(
    ctx: CanvasRenderingContext2D,
    units: BattleUnit[],
    selectedUid: string | null,
    cameraX: number,
    cameraY: number
  ) {
    const ts = this.tileSize;

    for (const unit of units) {
      const sx = unit.x * ts - cameraX;
      const sy = unit.y * ts - cameraY;

      // 화면 밖이면 컬링(culling)
      if (sx < -ts || sy < -ts || sx > ctx.canvas.width || sy > ctx.canvas.height) {
        continue;
      }

      const isSelected = unit.uid === selectedUid;

      // 선택된 유닛 펄스 링
      if (isSelected) {
        ctx.save();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        const ringPulse = Math.sin(this.animationTick * 0.12) * 3;
        ctx.strokeRect(sx + 2 - ringPulse, sy + 2 - ringPulse, ts - 4 + ringPulse * 2, ts - 4 + ringPulse * 2);
        ctx.restore();
      }

      // 유닛 스프라이트 본체 그리기
      this.drawUnitSprite(ctx, unit, sx, sy);

      // 상단 체력 게이지 및 상태 표시
      this.drawUnitOverlays(ctx, unit, sx, sy);
    }
  }

  // 장수별 개성 있는 16비트 도트 스프라이트 그리기
  private drawUnitSprite(ctx: CanvasRenderingContext2D, unit: BattleUnit, sx: number, sy: number) {
    const isActed = unit.hasActed;
    const classDef = UNIT_CLASSES[unit.classType] || UNIT_CLASSES.infantry_light;

    ctx.save();
    if (isActed) {
      ctx.filter = 'grayscale(80%) brightness(80%)';
    }

    // 진영별 베이스 깃발 / 서클 컬러
    const factionBorder = unit.faction === 'player' ? '#2563eb' : unit.faction === 'enemy' ? '#dc2626' : '#16a34a';

    // 1. 병종 베이스 실루엣
    if (classDef.category === 'cavalry') {
      // 기병 (말 + 무장)
      this.drawCavalrySprite(ctx, unit, sx, sy, factionBorder);
    } else if (classDef.category === 'archer') {
      // 궁병 (활/노)
      this.drawArcherSprite(ctx, unit, sx, sy, factionBorder);
    } else if (classDef.category === 'special') {
      // 군악대 / 수송대 / 주술사
      this.drawSpecialSprite(ctx, unit, sx, sy, factionBorder);
    } else {
      // 보병 / 무도가 / 적병
      this.drawInfantrySprite(ctx, unit, sx, sy, factionBorder);
    }

    ctx.restore();
  }

  // 보병 계열 도트 스프라이트
  private drawInfantrySprite(ctx: CanvasRenderingContext2D, unit: BattleUnit, sx: number, sy: number, factionBorder: string) {
    const ts = this.tileSize;

    // 진영 발판 원
    ctx.fillStyle = factionBorder;
    ctx.beginPath();
    ctx.ellipse(sx + ts / 2, sy + ts - 8, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // 몸통/갑옷
    ctx.fillStyle = unit.charId === 'liu_bei' ? '#16a34a' : '#475569';
    ctx.fillRect(sx + 16, sy + 18, 16, 16);

    // 머리/투구
    ctx.fillStyle = unit.charId === 'liu_bei' ? '#f59e0b' : '#334155';
    ctx.fillRect(sx + 18, sy + 8, 12, 10);

    // 얼굴 도트
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(sx + 20, sy + 12, 8, 6);

    // 무기 (검 / 창)
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(sx + 34, sy + 10, 3, 22);
    ctx.fillStyle = '#f59e0b'; // 칼자루
    ctx.fillRect(sx + 32, sy + 22, 7, 3);
  }

  // 기병 계열 도트 스프라이트
  private drawCavalrySprite(ctx: CanvasRenderingContext2D, unit: BattleUnit, sx: number, sy: number, factionBorder: string) {
    const ts = this.tileSize;

    // 진영 발판
    ctx.fillStyle = factionBorder;
    ctx.beginPath();
    ctx.ellipse(sx + ts / 2, sy + ts - 6, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // 말 몸통 (적토마는 붉은색, 조운의 백마는 흰색, 관우/장비는 갈색/흑색)
    let horseColor = '#78350f';
    if (unit.charId === 'lu_bu') horseColor = '#991b1b'; // 적토마
    else if (unit.charId === 'zhao_yun') horseColor = '#f8fafc'; // 백마
    else if (unit.charId === 'zhang_fei') horseColor = '#1e293b'; // 흑마

    ctx.fillStyle = horseColor;
    ctx.fillRect(sx + 12, sy + 22, 24, 14); // 말 몸
    ctx.fillRect(sx + 30, sy + 14, 8, 12);  // 말 머리

    // 기수 (관우: 녹색 도포 + 수염, 여포: 붉은 갑옷 + 봉미투구, 장비: 검은 갑옷)
    let riderColor = '#dc2626';
    if (unit.charId === 'guan_yu') riderColor = '#15803d';
    else if (unit.charId === 'zhang_fei') riderColor = '#0f172a';
    else if (unit.charId === 'zhao_yun') riderColor = '#38bdf8';
    else if (unit.charId === 'lu_bu') riderColor = '#b91c1c';

    ctx.fillStyle = riderColor;
    ctx.fillRect(sx + 18, sy + 10, 12, 14);

    // 머리/투구
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(sx + 20, sy + 6, 8, 6);

    // 관우의 긴 수염 연출
    if (unit.charId === 'guan_yu') {
      ctx.fillStyle = '#171717';
      ctx.fillRect(sx + 22, sy + 12, 4, 7);
    }
    // 여포의 방천화극 / 봉미 깃털
    if (unit.charId === 'lu_bu') {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx + 22, sy + 6);
      ctx.quadraticCurveTo(sx + 16, sy - 2, sx + 14, sy + 4);
      ctx.stroke();
    }

    // 장병기 (청룡도, 사모, 창)
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(sx + 34, sy + 2, 3, 28);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(sx + 33, sy + 4, 5, 8);
  }

  // 궁병 계열 스프라이트
  private drawArcherSprite(ctx: CanvasRenderingContext2D, unit: BattleUnit, sx: number, sy: number, factionBorder: string) {
    const ts = this.tileSize;

    ctx.fillStyle = factionBorder;
    ctx.beginPath();
    ctx.ellipse(sx + ts / 2, sy + ts - 8, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = unit.charId === 'huang_zhong' ? '#ca8a04' : '#059669';
    ctx.fillRect(sx + 18, sy + 16, 12, 16);

    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(sx + 20, sy + 10, 8, 6);

    // 활
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sx + 34, sy + 20, 10, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  }

  // 특수 계열 (주술사, 군악대, 수송대) 스프라이트
  private drawSpecialSprite(ctx: CanvasRenderingContext2D, unit: BattleUnit, sx: number, sy: number, factionBorder: string) {
    const ts = this.tileSize;

    ctx.fillStyle = factionBorder;
    ctx.beginPath();
    ctx.ellipse(sx + ts / 2, sy + ts - 8, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // 제갈량 / 군사 도포
    ctx.fillStyle = unit.charId === 'zhuge_liang' ? '#f8fafc' : '#6366f1';
    ctx.fillRect(sx + 16, sy + 16, 16, 18);

    // 머리/관모
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(sx + 18, sy + 6, 12, 6);
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(sx + 20, sy + 10, 8, 6);

    // 학선(부채) 또는 지팡이
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(sx + 34, sy + 18, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. 유닛 오버레이 (HP 게이지, 이름, 레벨 뱃지, 상태이상)
  private drawUnitOverlays(ctx: CanvasRenderingContext2D, unit: BattleUnit, sx: number, sy: number) {
    const ts = this.tileSize;

    // HP 게이지 바
    const barW = ts - 8;
    const barH = 5;
    const barX = sx + 4;
    const barY = sy + 2;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(barX, barY, barW, barH);

    const hpPercent = Math.max(0, Math.min(1, unit.curHp / unit.maxHp));
    const hpColor = hpPercent > 0.5 ? '#22c55e' : hpPercent > 0.25 ? '#eab308' : '#ef4444';

    ctx.fillStyle = hpColor;
    ctx.fillRect(barX + 1, barY + 1, Math.round((barW - 2) * hpPercent), barH - 2);

    // 하단 유닛 이름 & 레벨 뱃지
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(sx + 2, sy + ts - 12, ts - 4, 11);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 9px DungGeunMo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${unit.name.substring(0, 3)} ${unit.level}`, sx + ts / 2, sy + ts - 3);

    // 상태이상 아이콘 (혼란: 별, 중독: 독방울)
    if (unit.status === 'confused') {
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('💫', sx + 6, sy + 16);
    } else if (unit.status === 'poisoned') {
      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('☠️', sx + 6, sy + 16);
    }
  }

  // 6. 데미지 플로팅 텍스트
  public renderDamageFloaters(
    ctx: CanvasRenderingContext2D,
    floaters: DamageFloater[],
    cameraX: number,
    cameraY: number
  ) {
    const ts = this.tileSize;

    for (const f of floaters) {
      const sx = f.x * ts + ts / 2 - cameraX;
      // 시간에 따라 위로 떠오름
      const sy = f.y * ts - cameraY - f.lifetime * 24;

      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - f.lifetime * 0.7);
      ctx.font = 'bold 16px DungGeunMo, sans-serif';
      ctx.textAlign = 'center';

      // 검은색 외곽선
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText(f.text, sx, sy);

      // 본문 색상
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, sx, sy);
      ctx.restore();
    }
  }

  // 7. 공격 및 이펙트 애니메이션
  public renderEffects(
    ctx: CanvasRenderingContext2D,
    effects: AnimationEffect[],
    cameraX: number,
    cameraY: number
  ) {
    const ts = this.tileSize;

    for (const eff of effects) {
      const cx = eff.x * ts + ts / 2 - cameraX;
      const cy = eff.y * ts + ts / 2 - cameraY;

      ctx.save();
      if (eff.type === 'slash') {
        // 백색/황금색 칼날 궤적
        const len = 30 * eff.progress;
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx - len, cy - len);
        ctx.lineTo(cx + len, cy + len);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - len + 2, cy - len - 2);
        ctx.lineTo(cx + len + 2, cy + len - 2);
        ctx.stroke();
      } else if (eff.type === 'fire') {
        // 화염 이펙트 (초열/화룡)
        const radius = 24 * eff.progress;
        const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius);
        grad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
        grad.addColorStop(0.5, 'rgba(239, 68, 68, 0.8)');
        grad.addColorStop(1, 'rgba(185, 28, 28, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (eff.type === 'water') {
        // 수류/해일 이펙트
        const radius = 28 * eff.progress;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (eff.type === 'heal') {
        // 치유/구급 상승하는 빛의 십자가
        const yOffset = -eff.progress * 25;
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(cx - 3, cy + yOffset - 12, 6, 24);
        ctx.fillRect(cx - 12, cy + yOffset - 3, 24, 6);
      }
      ctx.restore();
    }
  }
}
