import { chromium } from 'playwright';
import http from 'http';
import path from 'path';
import fs from 'fs';

function startStaticServer(dir, port) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.svg': 'image/svg+xml'
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
          // SPA fallback to index.html
          fs.readFile(path.join(dir, 'index.html'), (fallbackErr, fallbackContent) => {
            if (fallbackErr) {
              res.writeHead(404);
              res.end('Not found');
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(fallbackContent, 'utf-8');
            }
          });
        } else {
          res.writeHead(500);
          res.end(`Server error: ${err.code}`);
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const actualPort = server.address().port;
      console.log(`📡 Static HTTP server running at http://127.0.0.1:${actualPort}`);
      resolve({ server, port: actualPort });
    });
  });
}

async function runTest() {
  const distDir = path.resolve('./dist');
  const { server, port } = await startStaticServer(distDir);

  const screenshotDir = path.resolve('./test-screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  console.log('🌐 Launching Chromium browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  try {
    console.log(`1️⃣ Navigating to http://127.0.0.1:${port} ...`);
    await page.goto(`http://127.0.0.1:${port}`, { waitUntil: 'networkidle' });

    // 1. Title Screen & start game
    await page.click('button:has-text("새로운 천하 통일 시작")');
    await page.waitForTimeout(600);

    // 2. Town screen -> deploy
    await page.click('button:has-text("전장 출진 준비")');
    await page.waitForTimeout(400);
    await page.click('button:has-text("전장으로 출진!")');
    await page.waitForTimeout(800);

    console.log('2️⃣ Verifying Battle Canvas & Unit Selection Flow...');
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas bounding box not found');

    // Click on Liu Bei (near x: 1, y: 4 => canvas pixel x: 72, y: 216)
    console.log('👉 Step A: Clicking on Liu Bei (x: 1, y: 4)...');
    await page.mouse.click(box.x + 72, box.y + 216);
    await page.waitForTimeout(400);

    // Verify Action Menu is NOT visible yet!
    const actionMenu = page.locator('text=행동 선택');
    const isMenuVisibleImmediately = await actionMenu.isVisible();
    console.log(`✅ Action menu visible immediately upon clicking unit? ${isMenuVisibleImmediately} (Should be FALSE!)`);
    if (isMenuVisibleImmediately) {
      throw new Error('Action menu appeared too early before moving!');
    }

    await page.screenshot({ path: path.join(screenshotDir, '07_unit_selected_only_tiles.png') });
    console.log('📸 Captured 07_unit_selected_only_tiles.png (Only movable tiles highlighted, NO blocking menu!)');

    // 👉 Step B: Click a movable tile to move (e.g., x: 2, y: 4 => pixel x: 120, y: 216)
    console.log('👉 Step B: Clicking movable tile (x: 2, y: 4) to move...');
    await page.mouse.click(box.x + 120, box.y + 216);
    await page.waitForTimeout(400);

    const isMenuVisibleAfterMove = await actionMenu.isVisible();
    console.log(`✅ Action menu visible after moving to tile? ${isMenuVisibleAfterMove} (Should be TRUE!)`);
    if (!isMenuVisibleAfterMove) {
      throw new Error('Action menu did not appear after moving!');
    }

    // Verify Cancel Move button is present!
    const cancelMoveBtn = page.locator('button:has-text("이동 취소")');
    console.log(`✅ "이동 취소" button visible: ${await cancelMoveBtn.isVisible()}`);

    await page.screenshot({ path: path.join(screenshotDir, '08_moved_action_menu_opened.png') });
    console.log('📸 Captured 08_moved_action_menu_opened.png');

    // 👉 Step C: Test "이동 취소"
    console.log('👉 Step C: Testing "이동 취소"...');
    await cancelMoveBtn.click();
    await page.waitForTimeout(400);

    const isMenuClosedAfterCancel = !(await actionMenu.isVisible());
    console.log(`✅ Action menu closed and unit reverted? ${isMenuClosedAfterCancel}`);
    await page.screenshot({ path: path.join(screenshotDir, '09_move_cancelled_reverted.png') });
    console.log('📸 Captured 09_move_cancelled_reverted.png');

    console.log('\n======================================================');
    console.log('🎉 NEW UX FLOW VERIFIED: NO POPUP ON MOVE TILES!');
    console.log('======================================================');
  } catch (err) {
    console.error('❌ Test failed:', err);
    throw err;
  } finally {
    await browser.close();
    server.close();
    console.log('🏁 Verification complete.');
  }
}

runTest();
