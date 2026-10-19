import fs from 'node:fs';
import path from 'node:path';
import type { Browser } from '@e2e-dev/web';
import { credentials, expect } from 'e2e';

/**
 * Helper login sebagai Manajemen dan menavigasi ke halaman Setting Mitra
 */
export async function loginAndNavigateToMitra(browser: Browser, targetPath = '/partner/partners') {
  const username = process.env.E2E_USER_MANAJEMEN_USERNAME || 'superadmin@dparagon.com';
  const password = process.env.E2E_USER_MANAJEMEN_PASSWORD || 'Merpati98';

  // Coba navigasi ke URL target portal manajemen
  await browser.goto(`https://management.dparagon7.persona-it.com${targetPath}`).catch(() => {});
  await new Promise(r => setTimeout(r, 1500));

  let urlNow = await browser.url().catch(() => '');
  let isForbidden = await browser.locator('text="Whoops! Anda tidak mempunyai izin", text="403"').first().isVisible().catch(() => false);

  // Jika ter-redirect keluar manajemen atau mendapat 403 Forbidden
  if (isForbidden || !urlNow.includes('management.dparagon7.persona-it.com')) {
    // Navigasi ke auth login
    await browser.goto('https://auth.dparagon7.persona-it.com/login');
    await new Promise(r => setTimeout(r, 1000));

    const authUrl = await browser.url().catch(() => '');
    if (!authUrl.includes('/login')) {
      await browser.goto('https://auth.dparagon7.persona-it.com/logout').catch(() => {});
      await browser.goto('https://auth.dparagon7.persona-it.com/login');
    }

    const mgmtCard = browser.locator('a.login-type-card:has-text("Management"), a:has-text("Management")').first();
    if (await mgmtCard.isVisible().catch(() => false)) {
      await mgmtCard.click();
      await new Promise(r => setTimeout(r, 1000));
    }

    const userInput = browser.locator('#username, input[name="username"], input[name="email"]').first();
    if (await userInput.isVisible().catch(() => false)) {
      await userInput.fill(username);
      await browser.locator('#userpassword, input[name="password"]').first().fill(password);

      const submitBtn = browser.locator('button[type="submit"]:has-text("Masuk")').first();
      if (await submitBtn.isVisible().catch(() => false)) {
        await submitBtn.click().catch(() => {});
      } else {
        await browser.evaluate(() => {
          const btn = document.querySelector('button[type="submit"]') as HTMLButtonElement | null;
          if (btn) btn.click();
        }).catch(() => {});
      }
      await browser.waitForURL(/.*management.*/, { timeout: 35000 }).catch(() => {});
    }

    await browser.goto(`https://management.dparagon7.persona-it.com${targetPath}`).catch(() => {});
    await new Promise(r => setTimeout(r, 1500));
  }
}

/**
 * Helper untuk menavigasi ke halaman Tag Properti
 */
export async function loginAndNavigateToTagProperti(browser: Browser) {
  await loginAndNavigateToMitra(browser, '/partner/partners');

  const currentUrl = await browser.url().catch(() => '');
  if (!currentUrl.includes('/partner/property-tags')) {
    await browser.goto('https://management.dparagon7.persona-it.com/partner/property-tags');
    await browser.waitForURL(/.*property-tags.*/, { timeout: 15000 }).catch(() => {});
  }
}

/**
 * Helper untuk menavigasi ke halaman Registrasi / Tambah Properti
 */
export async function loginAndNavigateToRegistrasiProperti(browser: Browser) {
  await loginAndNavigateToMitra(browser, '/partner/partners');

  const regMenu = browser.locator('a:has-text("Registrasi Properti"), a:has-text("Tambah Properti"), a[href*="property/create"]').first();
  if (await regMenu.isVisible().catch(() => false)) {
    await regMenu.click();
  } else {
    await browser.goto('https://management.dparagon7.persona-it.com/property/create').catch(() => {});
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

  try {
    const relative = await app.screenshot(label);
    const targetName = saveFilename || `${label}.png`;
    const destPath = path.join(reportsDir, targetName);

    const resultsDir = path.resolve(process.cwd(), '.e2e', 'results');
    const candidate = path.resolve(process.cwd(), relative);

    if (fs.existsSync(candidate)) {
      fs.copyFileSync(candidate, destPath);
      return destPath;
    } else if (fs.existsSync(resultsDir)) {
      const searchFile = (dir: string): boolean => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            if (searchFile(full)) return true;
          } else if (entry.name.includes(label) && entry.name.endsWith('.png')) {
            fs.copyFileSync(full, destPath);
            return true;
          }
        }
        return false;
      };
      searchFile(resultsDir);
      return destPath;
    }
  } catch (err) {
    // Tangani jika screenshot policy denied atau error
  }
  return '';
}

/**
 * Helper untuk menyimpan bukti tangkapan layar pengujian siklus 25 tahapan ke reports/mitra/screenshots/lifecycle/
 */
export async function takeLifecycleScreenshot(app: any, stepNumber: number, stepName: string): Promise<string> {
  const reportsDir = path.resolve(process.cwd(), 'reports', 'mitra', 'screenshots', 'lifecycle');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const prefix = String(stepNumber).padStart(2, '0');
  const filename = `${prefix}-${stepName}.png`;
  const destPath = path.join(reportsDir, filename);

  try {
    const label = `step-${prefix}-${stepName}`;
    const relative = await app.screenshot(label);
    const candidate = path.resolve(process.cwd(), relative);

    if (fs.existsSync(candidate)) {
      fs.copyFileSync(candidate, destPath);
      return destPath;
    }

    const resultsDir = path.resolve(process.cwd(), '.e2e', 'results');
    if (fs.existsSync(resultsDir)) {
      const searchFile = (dir: string): boolean => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            if (searchFile(full)) return true;
          } else if (entry.name.includes(label) && entry.name.endsWith('.png')) {
            fs.copyFileSync(full, destPath);
            return true;
          }
        }
        return false;
      };
      searchFile(resultsDir);
      return destPath;
    }
  } catch (err) {
    // Abaikan jika screenshot error
  }
  return destPath;
}

/**
 * Helper untuk login ke dashboard Mitra dengan email & password
 */
export async function loginMitraDashboard(browser: Browser, email: string, password = 'Password123!') {
  await browser.goto('https://auth.dparagon7.persona-it.com/mitra/login');
  const urlNow = await browser.url().catch(() => '');
  if (!urlNow.includes('mitra')) {
    await logoutCurrentSession(browser);
    await browser.goto('https://auth.dparagon7.persona-it.com/mitra/login');
  }

  const emailInput = browser.locator('#email');
  await expect(emailInput).toBeVisible({ timeout: 25000 });
  await emailInput.fill(email);
  await browser.locator('#userpassword').fill(password);
  await browser.locator('button[type="submit"]:has-text("Masuk")').click();
  await browser.waitForURL(/.*mitra.*/, { timeout: 35000 });
}

/**
 * Helper untuk membersihkan session / logout saat berpindah antar portal
 */
export async function logoutCurrentSession(browser: Browser) {
  try {
    const userDropdown = browser.locator('.profile-user, button.profile-user, [data-toggle="dropdown"], .dropdown-toggle, button:has-text("Auto"), header button').first();
    if (await userDropdown.isVisible().catch(() => false)) {
      await userDropdown.click().catch(() => {});
      await new Promise(r => setTimeout(r, 500));
    }
    const logoutBtn = browser.locator('a[href*="logout"], button:has-text("Logout"), a:has-text("Logout"), a:has-text("Keluar")').first();
    if (await logoutBtn.isVisible().catch(() => false)) {
      await logoutBtn.click().catch(() => {});
      await new Promise(r => setTimeout(r, 2000));
      return;
    }
  } catch {}

  try {
    await browser.evaluate(() => {
      const form = (document.querySelector('#logout-form') || document.querySelector('form[action*="logout"]')) as HTMLFormElement | null;
      if (form) {
        form.submit();
      }
    }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));
  } catch {}
}
