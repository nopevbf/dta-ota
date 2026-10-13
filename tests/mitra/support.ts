import fs from 'node:fs';
import path from 'node:path';
import type { Browser } from '@e2e-dev/web';

/**
 * Helper login sebagai Manajemen dan menavigasi ke halaman Setting Mitra
 */
export async function loginAndNavigateToMitra(browser: Browser, targetPath = '/partner/partners') {
  const currentUrl = await browser.url().catch(() => '');
  if (!currentUrl.includes('management.dparagon7.persona-it.com')) {
    const username = process.env.E2E_USER_MANAJEMEN_USERNAME || 'superadmin@dparagon.com';
    const password = process.env.E2E_USER_MANAJEMEN_PASSWORD || 'Merpati98';

    await browser.goto('https://auth.dparagon7.persona-it.com/login');

    const mgmtCard = browser.locator('a.login-type-card:has-text("Management")');
    if (await mgmtCard.isVisible().catch(() => false)) {
      await mgmtCard.click();
    }

    await browser.locator('#username').fill(username);
    await browser.locator('#userpassword').fill(password);

    await browser.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]') as HTMLButtonElement | null;
      if (btn) btn.click();
    });

    const submitBtn = browser.locator('button[type="submit"]:has-text("Masuk")');
    if (await submitBtn.isVisible().catch(() => false)) {
      await submitBtn.click({ timeout: 10000 }).catch(() => {});
    }

    await browser.waitForURL(/.*management.*/, { timeout: 35000 });
  }

  // Navigasi langsung ke URL resmi modul Mitra: /partner/partners
  const urlNow = await browser.url().catch(() => '');
  if (!urlNow.includes('/partner/partners')) {
    await browser.goto(`https://management.dparagon7.persona-it.com${targetPath}`);
  }
}

/**
 * Helper untuk menyimpan bukti tangkapan layar pengujian ke reports/mitra/screenshots/
 */
export async function takeEvidenceScreenshot(app: any, label: string, saveFilename?: string): Promise<string> {
  const reportsDir = path.resolve(process.cwd(), 'reports', 'mitra', 'screenshots');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const relative = await app.screenshot(label);
  const targetName = saveFilename || `${label}.png`;
  const destPath = path.join(reportsDir, targetName);

  const resultsDir = path.resolve(process.cwd(), '.e2e', 'results');
  const candidate = path.resolve(process.cwd(), relative);

  if (fs.existsSync(candidate)) {
    fs.copyFileSync(candidate, destPath);
  } else if (fs.existsSync(resultsDir)) {
    const pngs = fs.readdirSync(resultsDir)
      .filter(f => f.endsWith('.png'))
      .map(f => ({ name: f, time: fs.statSync(path.join(resultsDir, f)).mtimeMs }))
      .sort((a, b) => b.time - a.time);

    if (pngs.length > 0) {
      fs.copyFileSync(path.join(resultsDir, pngs[0].name), destPath);
    }
  }

  return destPath;
}
