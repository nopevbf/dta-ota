import fs from 'node:fs';
import path from 'node:path';
import type { Browser } from '@e2e-dev/web';
import { credentials, expect } from 'e2e';

/**
 * Helper login sebagai Manajemen dan menavigasi ke halaman Setting Mitra
 */
export async function loginAndNavigateToMitra(browser: Browser, targetPath = '/partner/partners', forceRelogin = false) {
  const targetUrl = targetPath.startsWith('http') ? targetPath : `https://management.dp7.lab.daegi.dev${targetPath}`;
  const currentUrl = await browser.url().catch(() => '');

  // Jika sudah berada di manajemen dan tidak force relogin, navigasi langsung tanpa login ulang
  if (!forceRelogin && currentUrl.includes('management.dp7.lab.daegi.dev')) {
    console.log(`[NAVIGASI] Sesi manajemen sudah aktif, langsung menuju: ${targetUrl}`);
    await browser.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
    return;
  }

  const username = process.env.E2E_USER_MANAJEMEN_USERNAME || 'superadmin@dparagon.com';
  const password = process.env.E2E_USER_MANAJEMEN_PASSWORD || 'Merpati98';

  // Fresh login per tes: logout sesi lama dan bersihkan cookies (Rule 2)
  await logoutCurrentSession(browser);

  // Blokir socket.io polling yang mati di staging untuk mencegah hang navigasi
  await browser.route(/.*socket\.io.*/, async (route) => {
    await route.abort().catch(() => {});
  }).catch(() => {});

  await browser.goto('https://auth.dp7.lab.daegi.dev/login', { waitUntil: 'domcontentloaded', timeout: 90000 });

  const mgmtCard = browser.locator('a.login-type-card:has-text("Management"), a:has-text("Management")').first();
  if (await mgmtCard.isVisible().catch(() => false)) {
    await mgmtCard.click();
    await new Promise(r => setTimeout(r, 800));
  }

  const userInput = browser.locator('#username, input[name="username"], input[name="email"]').first();
  if (await userInput.isVisible().catch(() => false)) {
    await userInput.fill(username);
    await browser.locator('#userpassword, input[name="password"]').first().fill(password);

    await browser.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]') as HTMLButtonElement | null;
      if (btn) btn.click();
    }).catch(() => {});

    const submitBtn = browser.locator('button[type="submit"]:has-text("Masuk")').first();
    if (await submitBtn.isVisible().catch(() => false)) {
      await submitBtn.click().catch(() => {});
    }
    await browser.waitForURL(/.*management.*/, { timeout: 60000 }).catch(() => {});
  }

  await browser.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
}

/**
 * Helper untuk menavigasi ke halaman Tag Properti
 */
export async function loginAndNavigateToTagProperti(browser: Browser) {
  await loginAndNavigateToMitra(browser, '/partner/partners');

  const currentUrl = await browser.url().catch(() => '');
  if (!currentUrl.includes('/partner/property-tags')) {
    await browser.goto('https://management.dp7.lab.daegi.dev/partner/property-tags');
    await browser.waitForURL(/.*property-tags.*/, { timeout: 30000 }).catch(() => {});
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
    await browser.goto('https://management.dp7.lab.daegi.dev/property/create').catch(() => {});
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
 * Helper untuk login fresh ke dashboard Mitra dengan email & password (tanpa session cache)
 */
export async function loginMitraDashboard(browser: Browser, email: string, password = 'Password123!') {
  // Lakukan logout sesi sebelumnya terlebih dahulu agar benar-benar fresh
  await logoutCurrentSession(browser);

  // Blokir socket.io polling yang mati di staging untuk mencegah hang navigasi
  await browser.route(/.*socket\.io.*/, async (route) => {
    await route.abort().catch(() => {});
  }).catch(() => {});

  // Navigasi ke auth mitra login dengan domcontentloaded agar tidak terhambat background poll
  try {
    await browser.goto('https://auth.dp7.lab.daegi.dev/mitra/login', { waitUntil: 'domcontentloaded', timeout: 90000 });
  } catch {
    console.log('[WARN] Percobaan pertama ke auth mitra login timeout, mencoba ulang...');
    await browser.goto('https://auth.dp7.lab.daegi.dev/mitra/login', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
  }

  // Rule 2: Strict Session Barrier & DOM Readiness
  const emailInput = browser.locator('#email, input[name="email"]').first();
  await expect(emailInput).toBeVisible({ timeout: 45000 });

  await emailInput.fill(email);
  await browser.locator('#userpassword, input[name="password"]').first().fill(password);

  // Sembunyikan debugbar jika ada
  await browser.evaluate(() => {
    const db = document.querySelector('.phpdebugbar') as HTMLElement | null;
    if (db) db.style.display = 'none';
  }).catch(() => {});

  // Submit form login mitra via DOM native requestSubmit untuk mencegah deadlock scheduled navigations
  await browser.evaluate(() => {
    const form = document.querySelector('form') as HTMLFormElement | null;
    const btn = document.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (form && btn) {
      form.requestSubmit(btn);
    } else if (btn) {
      btn.click();
    }
  }).catch(() => {});

  // Tunggu redirect menuju portal mitra
  await browser.waitForURL(/.*guest.*|.*mitra(?!\/login).*/, { timeout: 90000 }).catch(() => {});
}

/**
 * Helper untuk membersihkan session / logout fresh dengan clear cookies & local storage
 */
export async function logoutCurrentSession(browser: Browser) {
  try {
    // 1. Bersihkan seluruh cookie (termasuk HttpOnly session Laravel) via browser context API
    const existingCookies = await browser.cookies().catch(() => []);
    if (existingCookies && existingCookies.length > 0) {
      const expired = existingCookies.map((c) => ({
        name: c.name,
        value: '',
        expires: 0,
        domain: c.domain,
        path: c.path || '/'
      }));
      await browser.setCookies(expired).catch(() => {});
    }

    // 2. Bersihkan localStorage dan sessionStorage
    await browser.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch {}
    }).catch(() => {});

    await new Promise(r => setTimeout(r, 600));
  } catch {}
}
