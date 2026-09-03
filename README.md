# 삼국지 영걸전 (三國志 英傑傳) 99% 재현 웹 SRPG

> **1995년 코에이(KOEI) 불후의 명작 SRPG '삼국지 영걸전'을 현대 웹 브라우저에서 99% 동일한 감성과 시스템으로 완벽 재현한 오픈소스 웹 애플리케이션입니다.**

[![GitHub Pages](https://img.shields.io/badge/Live_Demo-GitHub_Pages-brightgreen?style=for-the-badge&logo=github)](https://jeiel85.github.io/samguk-hero-antigravity/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🎮 실시간 라이브 데모 (Live Demo)
👉 **[삼국지 영걸전 웹앱 플레이하기](https://jeiel85.github.io/samguk-hero-antigravity/)**

---

## ⚔️ 주요 시스템 및 구현 특징

### 1. 정통 레트로 픽셀 아트 & 캔버스 렌더러
- **60 FPS 타일맵 엔진**: 평지, 초원, 숲, 산지, 강, 다리, 습지, 성내, 성벽, 관문, 마을, 병영, 보물창고 등 14개 이상의 원작 지형 완벽 렌더링.
- **고전 도트 스프라이트**: 유비(자웅일대검), 관우(청룡언월도/긴 수염), 장비(장팔사모), 조운(백마 은갑옷), 제갈량(학선/도포), 여포(적토마/방천화극), 조조 등 시그니처 비주얼.
- **DungGeunMo 고전 DOS 폰트 탑재**: 90년대 DOS/Windows 95 한글판 영걸전 고유의 비트맵 타이포그래피 재현.

### 2. 순수 Web Audio API 레트로 사운드 신디사이저
- 외부 mp3 파일 로딩 없이 브라우저 자체 Web Audio API로 오실레이터 합성:
  - **BGM 테마**: 타이틀 오프닝, 거점 본영, 전장 진군, 1:1 일기토, 승리의 팡파르
  - **효과음(SFX)**: 칼 가르는 소리, 타격 충격음, 1:1 일기토 병기 격돌음, 초열/화룡 화염음, 탁류/해일 수류음, 원격/치료 치유음, 레벨업 팡파르

### 3. 영걸전 공식 100% 전투 엔진
- **데미지 공식**: `(공격력 * 3 - 방어력 * 2) * 지형보정 * 병종상성 * 크리티컬`
- **병종 상성**: 보병 > 기병 > 궁병 > 보병 및 전직 트리(단병 -> 장병 -> 근위병 / 경기병 -> 중기병 -> 친위대 / 궁병 -> 연노병 -> 발석차).
- **경험치 & 성장**: 100 EXP 누적 시 레벨업, 스탯 증가 및 병력/책략치 전원 회복.
- **책략 시스템**: 화계(초열/화룡/대초열), 수계(탁류/해일/대해일), 낙석(암석/낙석/산사태), 상태이상(위병/위성/각성), 회복(원격/치료/구급).

### 4. 1:1 일기토 (Duel) 시네마틱 모드
- 관우 vs 화웅, 장비 vs 여포, 조운 vs 문추, 관우 vs 안량/문추, 장비 vs 허저 등 역사적 명장 조우 시 전용 1:1 일기토 컷씬 발동.
- 말 달리기, 4합의 격돌, 불꽃 스파크, 대사 팝업, 피니시 블로우 및 적장 퇴각 연출.

### 5. 전설의 비기 (Easter Egg & Cheats)
- **유비 얼굴 연타 레벨 99 치트키**: 타이틀 화면에서 유비의 초상화를 10회 연속 클릭 시 비기 발동! 전원 레벨 99 및 금화 10,000냥 즉시 지급.
- **전 스테이지 셀렉터**: 서장 사수관 전투부터 종장 업성 최종 결전(조조 결전)까지 언제든 자유롭게 스테이지 선택 가능.

---

## 🛠️ 기술 스택 (Tech Stack)
- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS + Pixel Retro System Font (NeoDunggeunmo)
- **Game Engine**: HTML5 Canvas 2D Engine (Procedural Sprites & Particle Float FX)
- **Audio**: Web Audio API Procedural Synthesizer
- **Deployment**: GitHub Pages & GitHub Actions

---

## 🚀 로컬 실행 방법
```bash
git clone https://github.com/jeiel85/samguk-hero-antigravity.git
cd samguk-hero-antigravity
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.
