# 삼국지 영걸전 (三國志 英傑傳) 99% 재현 웹 SRPG

> **1995년 코에이(KOEI) 불후의 명작 SRPG '삼국지 영걸전'을 현대 웹 브라우저에서 99% 동일한 감성과 시스템으로 완벽 재현한 오픈소스 웹 애플리케이션입니다.**

[![Live Demo](https://img.shields.io/badge/🌐_라이브_플레이-GitHub_Pages-2ea44f?style=for-the-badge&logo=githubpages&logoColor=white)](https://jeiel85.github.io/samguk-hero-antigravity/)
[![GitHub Repo](https://img.shields.io/badge/📦_GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/jeiel85/samguk-hero-antigravity)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[![Topics](https://img.shields.io/badge/Topics-samgukji%20%7C%20three--kingdoms%20%7C%20srpg%20%7C%20tactical--rpg%20%7C%20retro--game%20%7C%20pixel--art%20%7C%20koei-blue?style=flat-square)](https://github.com/jeiel85/samguk-hero-antigravity)

---

## 🎮 라이브 서비스 주소 (Live Service)
👉 **[삼국지 영걸전 웹앱 바로 플레이하기 (Live Demo)](https://jeiel85.github.io/samguk-hero-antigravity/)**

모바일 및 PC 웹 브라우저 어디서나 별도의 설치 없이 즉시 구동됩니다.

---

## 🏷️ 저장소 토픽 (Topics & Tags)
`samgukji` · `romance-of-the-three-kingdoms` · `three-kingdoms` · `srpg` · `tactical-rpg` · `retro-game` · `pixel-art` · `koei` · `browser-game` · `react` · `typescript` · `vite` · `canvas` · `web-audio-api`

---

## ⚔️ 주요 시스템 및 99% 원작 재현 요소

### 1. 원작 영걸전 전 46개 스테이지 완벽 구현
- **서장 (반동탁 연합군)**: 사수관 전투(관우 vs 화웅), 호로관 전투(장비 vs 여포)
- **제1장 (군웅할거)**: 계교, 북해, 서주, 소패, 태산, 하구, 팽성, 하비(여포의 최후), 광릉, 연주 탈출전
- **제2장 (관도대전 & 방랑)**: 백마(안량), 연진(문추), 여남, 고성, 강하(적로마), 남양(팔문금쇄진), 박망파(제갈량 화공), 신야, 양양, 장판파 1~2(아두 구출/장비의 일갈)
- **제3장 (적벽대전 & 형주 평정)**: 적벽대전(화공 격파), 화용도, 강릉, 영릉, 계양, 무릉, 장사(관우 vs 황충)
- **제4장 (익주 평정 & 한중 쟁패)**: 부수관, 낙성(낙봉파 방통 구출전), 가맹관(장비 vs 마초), 성도(익주 평정), 와구관, 정군산(하후연 참수), 한수, 양평관(한중왕 등극)
- **종장 (삼국 정립 & 천하 통일)**: 번성(수계 칠군 수몰), 맥성 구출전(IF 분기), 서릉, 이릉, 남만(칠종칠금), 진창, 기산, **업성 최종결전(조조군 총본영 함락 & 한실 부흥 엔딩)**

### 2. 군비 정돈 및 병종 승급(전직) 시스템
- 거점 화면의 **[군비 정돈 / 전직 ⚔️]** 모달에서 장수별 장비(무기/방어구/명마) 최대 4슬롯 탈부착.
- **검술지침서, 마술지침서, 궁술지침서**를 통한 병종 전직(보병계/기병계/궁병계) 및 외형·능력치 승급.

### 3. 날씨(기후) 변화 및 전술 연동
- 턴 경과에 따라 ☀️ 맑음 / ☁️ 흐림 / 🌧️ 폭우 기후 변화.
- 폭우 시 화계 사용 불가 및 수계 책략 데미지 1.25배 증폭.

### 4. 전장 보물창고 / 마을 루팅 & 스토리 회화
- 전장 내 보물창고나 마을 진입 시 전설의 보물(적토마, 청룡언월도, 손자병법서 등) 획득 및 인벤토리 저장.
- 전투 개시 및 승리 시 역사적 장수 대화 컷씬 출력.

### 5. 정통 SRPG 이동 조작 UX & 취소 기능
- 아군 선택 시 **오직 푸른색 이동 타일만 깨끗하게 표시**.
- 목적지 이동 후에만 유닛 옆에 **[공격] [책략] [도구] [대기] [↩️ 이동 취소]** 팝업 표시.
- 이동 후에도 **[↩️ 이동 취소]**를 눌러 언제든 원래 위치로 원상 복구 가능.

### 6. 1:1 일기토 컷씬 & 유비 레벨 99 치트키 (비기)
- 명장 간 전투 시 전용 일기토 모달 전환 (말 달리기, 4합의 칼부림, 피니시 블로우, 패주 대사).
- 타이틀 화면에서 유비 초상화 10회 연속 클릭 시 치트 발동 (전 아군 Lv 99 & 금 10,000냥).

---

## 🛠️ 기술 스택 (Tech Stack)
- **Frontend**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS + Pixel Retro Font (NeoDunggeunmo)
- **Game Engine**: HTML5 Canvas 2D Engine (Procedural Sprites & Particle Float FX)
- **Audio Engine**: Pure Web Audio API Procedural Synthesizer (Chiptune FM Sound)
- **CI/CD**: GitHub Actions & GitHub Pages

---

## 🚀 로컬 실행 방법
```bash
git clone https://github.com/jeiel85/samguk-hero-antigravity.git
cd samguk-hero-antigravity
npm install
npm run dev
```
브라우저에서 `http://localhost:5173` 접속.

