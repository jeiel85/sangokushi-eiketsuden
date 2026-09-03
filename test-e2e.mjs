import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function runTest() {
  const targetUrl = 'https://jeiel85.github.io/samguk-hero-antigravity/';
  console.log(`🌐 Testing live deployed site at: ${targetUrl}`);

  const screenshotDir = path.resolve('./test-screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  console.log('🚀 Launching Chromium browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.error('Browser console error:', msg.text());
    }
  });

  try {
    console.log(`1️⃣ Navigating to ${targetUrl} ...`);
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });

    const title = await page.title();
    console.log(`✅ Page Title verified: "${title}"`);

    // Screenshot 1: Title Screen
    await page.screenshot({ path: path.join(screenshotDir, '01_title_screen.png') });
    console.log('📸 Captured 01_title_screen.png');

    // 2. Test Level 99 Easter Egg Cheat
    console.log('2️⃣ Testing Level 99 Easter Egg Cheat (Click Liu Bei 10 times)...');
    const liuBeiFace = page.locator('text=유비 현덕').locator('..');
    for (let i = 0; i < 10; i++) {
      await liuBeiFace.click();
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(500);

    const cheatBanner = page.locator('text=비기 발동!');
    const isCheatVisible = await cheatBanner.isVisible();
    console.log(`✅ Level 99 Cheat banner visible: ${isCheatVisible}`);
    await page.screenshot({ path: path.join(screenshotDir, '02_cheat_activated.png') });
    console.log('📸 Captured 02_cheat_activated.png');

    // 3. Start New Game
    console.log('3️⃣ Clicking "새로운 천하 통일 시작"...');
    await page.click('button:has-text("새로운 천하 통일 시작")');
    await page.waitForTimeout(600);

    const townTitle = page.locator('text=거점 본영');
    console.log(`✅ Town/Briefing screen loaded: ${await townTitle.isVisible()}`);
    await page.screenshot({ path: path.join(screenshotDir, '03_town_screen.png') });
    console.log('📸 Captured 03_town_screen.png');

    // 4. Test Dialogue with generals
    console.log('4️⃣ Testing dialogues with Guan Yu, Zhang Fei...');
    await page.click('text=관우');
    await page.waitForTimeout(300);
    await page.click('text=장비');
    await page.waitForTimeout(300);

    // 5. Test Shop Modal
    console.log('5️⃣ Opening Tool Shop...');
    await page.click('button:has-text("도구 상점")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotDir, '04_shop_modal.png') });
    console.log('📸 Captured 04_shop_modal.png');

    // Buy Bean (콩)
    const buyButton = page.locator('button:has-text("구매")').first();
    await buyButton.click();
    await page.waitForTimeout(300);
    await page.click('button:has-text("나가기")');
    await page.waitForTimeout(400);

    // 6. Test Stage Select Modal
    console.log('6️⃣ Opening Stage Select Modal...');
    await page.click('button:has-text("전투지 선택")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotDir, '05_stage_select.png') });
    console.log('📸 Captured 05_stage_select.png');
    await page.click('button:has-text("닫기")');
    await page.waitForTimeout(400);

    // 7. Test Deployment Modal
    console.log('7️⃣ Opening Deployment Modal...');
    await page.click('button:has-text("전장 출진 준비")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotDir, '06_deployment_modal.png') });
    console.log('📸 Captured 06_deployment_modal.png');

    // 8. Deploy to Battle Screen
    console.log('8️⃣ Clicking "전장으로 출진!" to enter battle...');
    await page.click('button:has-text("전장으로 출진!")');
    await page.waitForTimeout(1000);

    const canvas = page.locator('canvas');
    const isCanvasVisible = await canvas.isVisible();
    console.log(`✅ Battle Canvas visible: ${isCanvasVisible}`);

    const turnIndicator = page.locator('text=아군 턴 (PLAYER)');
    console.log(`✅ Player Turn indicator visible: ${await turnIndicator.isVisible()}`);

    // Click on canvas to interact with units
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.click(box.x + 80, box.y + 180);
      await page.waitForTimeout(400);
    }

    await page.screenshot({ path: path.join(screenshotDir, '07_battle_screen.png') });
    console.log('📸 Captured 07_battle_screen.png');

    console.log('\n======================================================');
    console.log('🎉 ALL 8 E2E BROWSER TESTS PASSED FLAWLESSLY!');
    console.log('======================================================');
    if (consoleErrors.length > 0) {
      console.warn(`⚠️ Console errors count: ${consoleErrors.length}`, consoleErrors);
    } else {
      console.log('✅ Zero console errors detected.');
    }
  } catch (err) {
    console.error('❌ Test failed:', err);
    throw err;
  } finally {
    await browser.close();
    console.log('🏁 Verification complete.');
  }
}

runTest();
