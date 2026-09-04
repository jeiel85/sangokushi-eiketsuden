/**
 * E2E 자동사냥 전 스테이지 통과 테스트
 * - 레벨99 치트 활성화 → 46개 스테이지를 자동사냥으로 전부 진행
 * - 일기토 모달, 컷씬, 전투 결과 등 모든 이벤트 자동 처리
 */
import { chromium } from 'playwright';
import http from 'http';
import path from 'path';
import fs from 'fs';

const TOTAL_STAGES = 46;
const SCREENSHOT_DIR = path.resolve('./test-screenshots');
const BATTLE_TIMEOUT = 120_000;    // 전투 1회 최대 대기 120초
const CLICK_DELAY = 300;

let bugReports = [];
let passedStages = [];
let failedStages = [];
let stageResults = [];

function log(msg) {
  const ts = new Date().toISOString().slice(11, 23);
  console.log(`[${ts}] ${msg}`);
}

function bug(stage, desc, screenshotName) {
  bugReports.push({ stage, desc, screenshotName });
  log(`🐛 BUG [Stage ${stage}]: ${desc}`);
}

function startStaticServer(dir) {
  const mimeTypes = {
    '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
    '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpg', '.svg': 'image/svg+xml'
  };
  const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];
    if (reqUrl === '/' || reqUrl === '') reqUrl = '/index.html';
    const filePath = path.join(dir, reqUrl);
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          fs.readFile(path.join(dir, 'index.html'), (fbErr, fbContent) => {
            if (fbErr) { res.writeHead(400); res.end('Not found'); }
            else { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(fbContent, 'utf-8'); }
          });
        } else { res.writeHead(500); res.end('Server error'); }
      } else { res.writeHead(200, { 'Content-Type': contentType }); res.end(content, 'utf-8'); }
    });
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, port: server.address().port });
    });
  });
}

/** 화면에서 텍스트가 포함된 가시 버튼을 클릭 (있으면 true) */
async function clickBtn(page, text, timeout = 3000) {
  try {
    const btn = page.locator(`button:has-text("${text}")`).first();
    await btn.waitFor({ state: 'visible', timeout });
    await btn.click();
    return true;
  } catch { return false; }
}

/** 텍스트 노드 클릭 (버튼 아닌 요소) */
async function clickText(page, text, timeout = 2000) {
  try {
    const el = page.locator(`text=${text}`).first();
    await el.waitFor({ state: 'visible', timeout });
    await el.click();
    return true;
  } catch { return false; }
}

/** z-50 레이어(모달) 위의 "다음 ▶" 버튼을 연속 클릭 */
async function dismissModalNexts(page, maxClicks = 20) {
  for (let i = 0; i < maxClicks; i++) {
    // z-50 레이어 위의 "다음 ▶" 버튼 (일기토 대화 또는 컷씬)
    const nextBtn = page.locator('.fixed.inset-0.z-50 button:has-text("다음 ▶")').first();
    if (await nextBtn.isVisible().catch(() => false)) {
      await nextBtn.click();
      await page.waitForTimeout(350);
    } else break;
  }
}

/** z-50 레이어 위의 "스킵 ⏩" 클릭 */
async function dismissSkip(page, timeout = 1500) {
  try {
    const btn = page.locator('.fixed.inset-0.z-50 button:has-text("스킵 ⏩")').first();
    await btn.waitFor({ state: 'visible', timeout });
    await btn.click();
    await page.waitForTimeout(350);
    return true;
  } catch { return false; }
}

/** z-50 레이어 위의 "확인 ↵" 클릭 */
async function dismissConfirm(page, timeout = 1500) {
  try {
    const btn = page.locator('.fixed.inset-0.z-50 button:has-text("확인 ↵")').first();
    await btn.waitFor({ state: 'visible', timeout });
    await btn.click();
    await page.waitForTimeout(350);
    return true;
  } catch { return false; }
}

/** z-50 레이어 위의 "전투로 복귀하기 ▶" 클릭 (일기토 결과) */
async function dismissDuelReturn(page, timeout = 2000) {
  try {
    const btn = page.locator('.fixed.inset-0.z-50 button:has-text("전투로 복귀하기")').first();
    await btn.waitFor({ state: 'visible', timeout });
    await btn.click();
    await page.waitForTimeout(500);
    return true;
  } catch { return false; }
}

/**
 * 하나의 전투 스테이지를 자동사냥으로 클리어
 * @returns {'victory'|'defeat'|'error'|'timeout'}
 */
async function clearStage(page, stageNum) {
  log(`━━━ Stage ${stageNum} 시작 ━━━`);

  // 1. 거점 화면: "전장 출진 준비" 클릭
  if (!await clickBtn(page, '전장 출진 준비', 5000)) {
    bug(stageNum, '"전장 출진 준비" 버튼 없음', `s${stageNum}_no_deploy`);
    return 'error';
  }
  await page.waitForTimeout(CLICK_DELAY);

  // 2. 출진 모달: "전장으로 출진!" 클릭
  if (!await clickBtn(page, '전장으로 출진!', 5000)) {
    bug(stageNum, '"전장으로 출진!" 버튼 없음', `s${stageNum}_no_go`);
    // 닫기 버튼으로 모달 닫기 시도
    await clickBtn(page, '취소 ✕', 1000);
    return 'error';
  }
  await page.waitForTimeout(600);

  // 3. 프리배틀 컷씬 처리: "스킵 ⏩" 또는 "다음 ▶" 반복
  await handleCutscene(page, stageNum, 'pre');

  // 4. 배속 2x 설정 (1x → 2x)
  try {
    const speedBtn = page.locator('button:has-text("배속")').first();
    if (await speedBtn.isVisible({ timeout: 2000 })) {
      const txt = await speedBtn.textContent();
      if (txt && txt.includes('1x')) {
        await speedBtn.click();
        await page.waitForTimeout(100);
        log(`  ⏩ 배속 2x 설정`);
      }
    }
  } catch { /* ignore */ }

  // 5. 자동사냥 ON
  try {
    const autoBtn = page.locator('button:has-text("자동사냥 OFF")').first();
    if (await autoBtn.isVisible({ timeout: 2000 })) {
      await autoBtn.click();
      log(`  ⚡ 자동사냥 ON`);
    } else {
      // 이미 ON 상태인지 확인
      const autoOn = page.locator('button:has-text("자동사냥 ON")').first();
      if (await autoOn.isVisible({ timeout: 1000 })) {
        log(`  ⚡ 자동사냥 이미 ON 상태`);
      }
    }
  } catch { /* ignore */ }

  await page.waitForTimeout(500);

  // 6. 전투 결과 대기 (승리/패배)
  const result = await waitForBattleEnd(page, stageNum);

  if (result === 'victory') {
    passedStages.push(stageNum);
    log(`  ✅ Stage ${stageNum} 클리어!`);
  } else if (result === 'defeat') {
    failedStages.push(stageNum);
    log(`  ❌ Stage ${stageNum} 패배`);
  } else if (result === 'timeout') {
    bug(stageNum, `${BATTLE_TIMEOUT / 1000}초 내 전투 미종료`, `s${stageNum}_timeout`);
    // 강제 퇴각
    await clickBtn(page, '퇴각', 2000);
    await page.waitForTimeout(500);
  }

  stageResults.push({ stage: stageNum, result });
  return result;
}

/**
 * 컷씬 처리: "스킵 ⏩", "다음 ▶", "확인 ↵" 반복 클릭
 */
async function handleCutscene(page, stageNum, mode) {
  // 스킵 버튼 우선 시도
  const skipped = await dismissSkip(page, 2500);
  if (skipped) {
    log(`  ⏩ ${mode} 컷씬 스킵`);
    await page.waitForTimeout(300);
    return;
  }

  // "다음 ▶" 버튼 반복 클릭 (여러 대사가 있는 경우)
  await dismissModalNexts(page, 20);

  // "확인 ↵" 클릭
  await dismissConfirm(page, 1500);

  await page.waitForTimeout(300);
}

/**
 * 전투 결과(승리/패배) 대기
 * 중간에 일기토, 컷씬 등 이벤트가 뜨면 자동 처리
 */
async function waitForBattleEnd(page, stageNum) {
  const start = Date.now();

  while (Date.now() - start < BATTLE_TIMEOUT) {
    // 1. 승리 모달
    const victoryVisible = await page.locator('.fixed.inset-0.z-50:has-text("대승리 (VICTORY)")').isVisible().catch(() => false);
    if (victoryVisible) {
      // 포스트배틀 컷씬 처리 (스킵 가능)
      await dismissSkip(page, 1000);
      await dismissModalNexts(page, 20);
      await dismissConfirm(page, 1000);

      // "승전 보고 및 다음으로 ▶" 클릭
      await clickBtn(page, '승전 보고', 5000);
      await page.waitForTimeout(600);
      return 'victory';
    }

    // 2. 패배 모달
    const defeatVisible = await page.locator('.fixed.inset-0.z-50:has-text("패배 (DEFEAT)")').isVisible().catch(() => false);
    if (defeatVisible) {
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `defeat_s${stageNum}.png`) });
      await clickBtn(page, '다시 도전하기', 3000);
      await page.waitForTimeout(500);
      return 'defeat';
    }

    // 3. 일기토 모달 처리 ("일기토" 텍스트가 z-50 위에 있는지)
    const duelVisible = await page.locator('.fixed.inset-0.z-50:has-text("일기토")').isVisible().catch(() => false);
    if (duelVisible) {
      log(`  ⚔️ 일기토 감지`);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `duel_s${stageNum}_${Date.now()}.png`) });

      // 스킵 버튼으로 일기토 애니메이션 건너뛰기
      await dismissSkip(page, 1000);

      // 대화 "다음 ▶" 클릭
      await dismissModalNexts(page, 20);

      // "전투로 복귀하기 ▶" 클릭
      await dismissDuelReturn(page, 3000);

      log(`  ⚔️ 일기토 완료`);

      // 일기토 후 자동사냥이 꺼졌을 수 있으니 다시 ON
      await page.waitForTimeout(500);
      await reEnableAutoBattle(page);
      continue;
    }

    // 4. 포스트배틀 컷씬 (승리 후 컷씬 → 확인 버튼 → 승리 모달로 이어짐)
    // z-50 오버레이가 떠 있으면 일단 닫기 시도
    const hasOverlay = await page.locator('.fixed.inset-0.z-50').first().isVisible({ timeout: 300 }).catch(() => false);
    if (hasOverlay) {
      // 스킵 버튼 우선 시도
      const skipped = await dismissSkip(page, 800);
      if (skipped) {
        await page.waitForTimeout(300);
        // 남은 "다음 ▶" / "확인 ↵" 버튼 처리
        await dismissModalNexts(page, 20);
        await dismissConfirm(page, 1500);
        await page.waitForTimeout(300);
        continue;
      }
      // "다음 ▶" 버튼 반복 클릭
      let clicked = false;
      for (let i = 0; i < 15; i++) {
        const nextBtn = page.locator('.fixed.inset-0.z-50 button:has-text("다음 ▶")').first();
        if (await nextBtn.isVisible().catch(() => false)) {
          await nextBtn.click();
          await page.waitForTimeout(350);
          clicked = true;
        } else break;
      }
      if (clicked) {
        await dismissConfirm(page, 1500);
        await page.waitForTimeout(300);
        continue;
      }
      // "확인 ↵" 버튼
      if (await dismissConfirm(page, 800)) {
        await page.waitForTimeout(300);
        continue;
      }
      // 일기토 "전투로 복귀하기" 버튼
      if (await dismissDuelReturn(page, 800)) {
        await page.waitForTimeout(500);
        continue;
      }
    }

    // 5. 자동사냥이 꺼졌으면 다시 켜기
    await reEnableAutoBattle(page);

    await page.waitForTimeout(400);
  }

  return 'timeout';
}

/** 자동사냥이 꺼져있으면 다시 ON (오버레이에 막히면 무시) */
async function reEnableAutoBattle(page) {
  // z-50 오버레이가 떠 있으면 자동사냥 버튼 클릭 불가 → 건너뜀
  const overlayVisible = await page.locator('.fixed.inset-0.z-50').first().isVisible({ timeout: 300 }).catch(() => false);
  if (overlayVisible) return;

  const autoOffBtn = page.locator('button:has-text("자동사냥 OFF")').first();
  if (await autoOffBtn.isVisible({ timeout: 500 }).catch(() => false)) {
    await autoOffBtn.click({ timeout: 2000 }).catch(() => {});
    log(`  ⚡ 자동사냥 재활성화`);
  }
}

async function runTest() {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  log('🚀 E2E 자동사냥 전 스테이지 테스트 시작');
  log(`📁 스크린샷 디렉토리: ${SCREENSHOT_DIR}`);

  const distDir = path.resolve('./dist');
  if (!fs.existsSync(distDir)) {
    log('❌ dist/ 폴더 없음. npm run build 먼저 실행.');
    process.exit(1);
  }

  const { server, port } = await startStaticServer(distDir);
  log(`📡 서버: http://127.0.0.1:${port}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => {
    consoleErrors.push(`PAGE_ERROR: ${err.message}`);
  });

  try {
    await page.goto(`http://127.0.0.1:${port}`, { waitUntil: 'networkidle' });
    log('🌐 페이지 로드 완료');

    // === 타이틀 화면: 레벨99 치트 활성화 ===
    // 유비 👑 초상화를 10번 클릭
    const liuBeiFace = page.locator('.group.relative.my-4 div[title*="비기"]').first();
    if (await liuBeiFace.isVisible({ timeout: 3000 })) {
      log('👑 유비 초상화 치트 활성화 중 (10회 클릭)...');
      for (let i = 0; i < 10; i++) {
        await liuBeiFace.click();
        await page.waitForTimeout(100);
      }
      await page.waitForTimeout(500);

      // 치트 확인
      const cheatText = page.locator('text=레벨 99 치트 적용 중');
      if (await cheatText.isVisible({ timeout: 3000 })) {
        log('⭐ 레벨99 치트 성공!');
      } else {
        log('⚠️ 레벨99 치트 확인 실패 - 일반 난이도로 진행');
      }
    } else {
      log('⚠️ 유비 초상화를 찾을 수 없음 - 일반 진행');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'autoplay_00_title.png') });

    // === 새 게임 시작 ===
    await clickBtn(page, '새로운 천하 통일 시작', 3000);
    await page.waitForTimeout(600);

    // 프롤로그 스킵
    const prologueVisible = await page.locator('text=도원결의').isVisible().catch(() => false);
    if (prologueVisible) {
      log('🌸 프롤로그 감지 - 스킵');
      await clickBtn(page, '스킵 ⏩', 3000);
      await page.waitForTimeout(500);
    }

    // 거점 화면 확인
    await page.waitForTimeout(500);
    const isTown = await page.locator('button:has-text("전장 출진 준비")').isVisible({ timeout: 5000 });
    if (!isTown) {
      log('❌ 거점 화면 도달 실패');
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'autoplay_error_no_town.png') });
      throw new Error('거점 화면 도달 실패');
    }
    log('🏯 거점 화면 도착');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'autoplay_01_town.png') });

    // === 전 스테이지 순회 ===
    for (let stageNum = 1; stageNum <= TOTAL_STAGES; stageNum++) {
      const result = await clearStage(page, stageNum);

      if (result === 'error') {
        log(`⛔ Stage ${stageNum} 오류 - 테스트 중단`);
        break;
      }

      if (result === 'defeat') {
        // 같은 스테이지 1회 재시도
        log(`  🔄 Stage ${stageNum} 재시도`);
        const retry = await clearStage(page, stageNum);
        if (retry !== 'victory') {
          log(`  ⛔ Stage ${stageNum} 재시도 실패 - 건너뜀`);
        }
      }

      // 거점 복귀 대기
      await page.waitForTimeout(600);

      // 컷씬/모달 잔여물 처리
      for (let cleanup = 0; cleanup < 3; cleanup++) {
        await dismissSkip(page, 500);
        await dismissModalNexts(page, 10);
        await dismissConfirm(page, 500);
        if (await page.locator('button:has-text("전장 출진 준비")').isVisible({ timeout: 1000 })) break;
        // 승리 모달이 아직 떠있을 수 있음
        if (await clickBtn(page, '승전 보고', 1000)) {
          await page.waitForTimeout(600);
        }
      }

      // 5스테이지마다 스크린샷
      if (stageNum % 5 === 0 || stageNum === TOTAL_STAGES) {
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, `autoplay_s${stageNum}.png`) });
      }
    }

    // === 최종 결과 ===
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'autoplay_final.png') });

  } catch (err) {
    log(`❌ 테스트 예외: ${err.message}`);
    console.error(err.stack);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'autoplay_error.png') }).catch(() => {});
    bugReports.push({ stage: -1, desc: err.message, screenshotName: 'autoplay_error.png' });
  } finally {
    await browser.close();
    server.close();
  }

  // === 리포트 출력 ===
  log('\n' + '═'.repeat(50));
  log('📊 E2E 자동사냥 테스트 결과');
  log('═'.repeat(50));
  log(`총 ${TOTAL_STAGES}개 스테이지 시도`);
  log(`✅ 클리어: ${passedStages.length}개`);
  if (passedStages.length > 0) log(`   [${passedStages.join(', ')}]`);
  log(`❌ 패배: ${failedStages.length}개`);
  if (failedStages.length > 0) log(`   [${failedStages.join(', ')}]`);
  const errorStages = stageResults.filter(r => r.result === 'error' || r.result === 'timeout');
  if (errorStages.length > 0) {
    log(`⚠️ 에러/타임아웃: ${errorStages.length}개`);
    log(`   [${errorStages.map(r => `${r.stage}(${r.result})`).join(', ')}]`);
  }
  if (bugReports.length > 0) {
    log(`\n🐛 발견된 버그: ${bugReports.length}건`);
    bugReports.forEach(b => log(`  [Stage ${b.stage}] ${b.desc}`));
  } else {
    log(`\n🐛 발견된 버그: 0건`);
  }
  if (consoleErrors.length > 0) {
    log(`\n🔴 콘솔 에러: ${consoleErrors.length}건`);
    consoleErrors.slice(0, 15).forEach(e => log(`  ${e}`));
  }
  log('═'.repeat(50));

  // JSON 리포트 저장
  const report = {
    timestamp: new Date().toISOString(),
    totalStages: TOTAL_STAGES,
    passed: passedStages,
    failed: failedStages,
    errors: errorStages.map(r => r.stage),
    bugs: bugReports,
    consoleErrors: consoleErrors.slice(0, 30),
    stageResults
  };
  fs.writeFileSync(
    path.join(SCREENSHOT_DIR, 'autoplay_report.json'),
    JSON.stringify(report, null, 2), 'utf-8'
  );
  log('📄 리포트: test-screenshots/autoplay_report.json');
}

runTest();
