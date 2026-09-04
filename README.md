# 삼국지 영걸전 (三國志 英傑傳) 100% 완전 재현 웹 SRPG

> **1995년 코에이(KOEI) 불후의 명작 SRPG '삼국지 영걸전'을 현대 웹 브라우저에서 100% 동일한 감성과 시스템으로 완벽 재현한 오픈소스 웹 애플리케이션입니다.**

[![Live Demo](https://img.shields.io/badge/🌐_라이브_플레이-GitHub_Pages-2ea44f?style=for-the-badge&logo=githubpages&logoColor=white)](https://jeiel85.github.io/sangokushi-eiketsuden/)
[![GitHub Repo](https://img.shields.io/badge/📦_GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/jeiel85/sangokushi-eiketsuden)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[![Topics](https://img.shields.io/badge/Topics-sangokushi%20%7C%20eiketsuden%20%7C%20three--kingdoms%20%7C%20srpg%20%7C%20retro--game%20%7C%20koei-blue?style=flat-square)](https://github.com/jeiel85/sangokushi-eiketsuden)

---

## 🎮 라이브 서비스 주소 (Live Service)
👉 **[삼국지 영걸전 웹앱 바로 플레이하기 (Live Demo)](https://jeiel85.github.io/sangokushi-eiketsuden/)**

모바일 및 PC 웹 브라우저 어디서나 별도의 설치 없이 즉시 구동됩니다.

---

## 🏷️ 저장소 토픽 (Topics & Tags)
`sangokushi` · `sangokushi-eiketsuden` · `eiketsuden` · `samgukji` · `romance-of-the-three-kingdoms` · `three-kingdoms` · `srpg` · `tactical-rpg` · `retro-game` · `pixel-art` · `koei` · `browser-game` · `react` · `typescript` · `vite`

---

## ⚔️ 100% 원작 완전 재현 핵심 시스템

### 1. 원작 영걸전 전 46개 스테이지 완벽 구현
- **서장 (반동탁 연합군)**: 사수관 전투(관우 vs 화웅), 호로관 전투(장비 vs 여포)
- **제1장 (군웅할거)**: 계교, 북해, 서주, 소패, 태산, 하구, 팽성, 하비(여포의 최후), 광릉, 연주 탈출전
- **제2장 (관도대전 & 방랑)**: 백마(안량), 연진(문추), 여남, 고성, 강하(적로마), 남양(팔문금쇄진), 박망파(제갈량 화공), 신야, 양양, 장판파 1~2(아두 구출/장비의 일갈)
- **제3장 (적벽대전 & 형주 평정)**: 적벽대전(화공 격파), 화용도, 강릉, 영릉, 계양, 무릉, 장사(관우 vs 황충)
- **제4장 (익주 평정 & 한중 쟁패)**: 부수관, 낙성(낙봉파 방통 구출전), 가맹관(장비 vs 마초), 성도(익주 평정), 와구관, 정군산(하후연 참수), 한수, 양평관(한중왕 등극)
- **제4장 분기 (형주 수공 & 이릉대전)**: 번성(수계 칠군 수몰), **맥성 구출전(원작 영걸전 최대 IF 분기!)**, 서릉, 이릉(화계 극복)
- **종장 (삼국 정립 & 천하 통일)**: 남만(칠종칠금), 진창, 기산, **업성 최종결전(조조군 총본영 함락 & 400년 한실 부흥 엔딩)**

### 2. 사기(士氣 - Morale, 0~100) 시스템 완전 구현
- 모든 장수에게 고유 사기 수치 부여.
- 공격/방어력 보정 및 회심의 일격(Critical) 확률 연동.
- 피격 시 사기 저하 및 **사기 0 도달 시 부대 궤멸/퇴각**.
- **고무 / 환호 책략 (`cheer_1`, `cheer_2`)**으로 아군 사기 회복 및 경험치 획득.

### 3. 군악대 & 수송대 고유 턴 패시브
- **군악대 패시브**: 매 턴 개시 시 인접 1타일 아군 부대 **MP +10 회복 & 사기 +5 고무**.
- **수송대 패시브**: 매 턴 개시 시 인접 1타일 아군 부대 **HP 15% 보급 치유**.

### 4. 인접 아군 도구 전달 및 보급
- 전투 중 **[🎒 도구]** 메뉴에서 콩, 쌀, 고기, 술, 각성제 선택 시 인접 1타일 내 아군 부대를 지정하여 치유/보급 가능.

### 5. 전장 실시간 중간 저장 & 이어하기 (Mid-Battle Save / Resume)
- 전장 상단 HUD의 **[💾 전장 저장]**으로 실시간 턴, 날씨, 유닛 좌표/HP/사기/행동 여부 로컬 저장.
- 타이틀 화면의 **[전투 이어하기 (전장 저장) ⚔️]** 버튼으로 언제든 전장으로 즉시 복귀.

### 6. 삼국지 영걸전 대하 연대기 실록 (Chronicle) & 도원결의 프롤로그
- **도원결의 오프닝 프롤로그**: 새 게임 시작 시 탁현 복숭아 밭에서의 맹세 컷씬 연출.
- **삼국지 7대 챕터 대하 연표**: 서장부터 종장까지 시대 연도, 전황 해설, 상세 역사 서사 뷰어 탑재.
- **46개 전장 실록 뷰어**: 전장별 시대 연도, 위치, 전략 목표, 인물 명대사 열람.
- **전투 개시 전 정세 브리핑**: 전투 진입 시 시대 연도(`⏳ 서기 190년 봄`) 및 전황 브리핑 제공.

### 7. 군비 정돈 및 병종 승급(전직) 시스템
- 거점 화면의 **[군비 정돈 / 전직 ⚔️]** 모달에서 장수별 장비(무기/방어구/명마) 최대 4슬롯 탈부착.
- **검술지침서, 마술지침서, 궁술지침서**를 통한 병종 전직(단병 ➡️ 장병 ➡️ 근위병, 경기병 ➡️ 중기병 ➡️ 친위대, 궁병 ➡️ 연노병 ➡️ 발석차) 승급.

### 8. 날씨(기후) 변화 및 전술 연동
- 턴 경과에 따라 ☀️ 맑음 / ☁️ 흐림 / 🌧️ 폭우 기후 유기적 변화.
- 폭우 시 화계 사용 불가 및 수계 책략 데미지 1.25배 증폭.

### 9. 1:1 일기토 컷씬 & 유비 레벨 99 치트키 (비기)
- 47개 전장 일기토 컷씬 (말 달리기, 4합의 칼부림, 피니시 블로우, 패주 대사).
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
git clone https://github.com/jeiel85/sangokushi-eiketsuden.git
cd sangokushi-eiketsuden
npm install
npm run dev
```
브라우저에서 `http://localhost:5173` 접속.
