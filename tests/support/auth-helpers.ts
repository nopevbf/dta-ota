import fs from 'node:fs';
import path from 'node:path';
import type { Browser } from '@e2e-dev/web';

export const TARGET_URL = 'https://dparagon7.persona-it.com/lang_en?ava_min_room_ready=1&ava_pax=2';
export const AUTH_LOGOUT_URL = 'https://auth.dparagon7.persona-it.com/logout';

/**
 * Memasang bridge perantara pada browser.route untuk menormalkan header accept application/json
 * dan memastikan password diteruskan dengan benar tanpa terhalang masking e2e.
 */
export async function setupApiRouteBridge(browser: Browser): Promise<void> {
  const mgmtPass = process.env.E2E_USER_MANAJEMEN_PASSWORD || 'Merpati98';
  const mitraPass = process.env.E2E_USER_MITRA_PASSWORD || 'Qwerty12345';
  const tamuPass = process.env.E2E_USER_TAMU_PASSWORD || 'qwerty12345';

  await browser.route('**/_nuxt_api/**', async (route: any) => {
    let rawPostData = route.request.postData;
    if (rawPostData && typeof rawPostData === 'string') {
      if (rawPostData.includes('manajemen.password')) {
        rawPostData = rawPostData.replace(/<secret:[^>]+>/g, mgmtPass);
      } else if (rawPostData.includes('mitra.password')) {
        rawPostData = rawPostData.replace(/<secret:[^>]+>/g, mitraPass);
      } else if (rawPostData.includes('tamu.password')) {
        rawPostData = rawPostData.replace(/<secret:[^>]+>/g, tamuPass);
      }
    }

    try {
      const nodeRes = await fetch(route.request.url, {
        method: route.request.method,
        headers: {
          ...route.request.headers,
          'accept': 'application/json',
          'content-type': 'application/json'
        },
        body: (route.request.method !== 'GET' && route.request.method !== 'HEAD') ? rawPostData : undefined
      });

      const bodyText = await nodeRes.text();
      await route.fulfill({
        status: nodeRes.status,
        headers: {
          'content-type': 'application/json',
          'access-control-allow-origin': '*'
        },
        body: bodyText
      });
    } catch (e: any) {
      await route.fallback();
    }
  });
}

/**
 * Menyimpan screenshot pengujian ke direktori reports/screenshots/auth/
 */
export async function takeAuthScreenshot(app: any, filename: string): Promise<string> {
  const reportsDir = path.resolve(process.cwd(), 'reports', 'screenshots', 'auth');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const cleanName = filename.endsWith('.png') ? filename : `${filename}.png`;
  const destPath = path.join(reportsDir, cleanName);

  try {
    const label = cleanName.replace('.png', '').replace(/[^a-zA-Z0-9-_]/g, '_');
    const relative = await app.screenshot(label);

    if (relative) {
      const candidate = path.resolve(process.cwd(), relative);
      if (fs.existsSync(candidate)) {
        fs.copyFileSync(candidate, destPath);
        return destPath;
      }
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
    }
  } catch (e) {}

  return destPath;
}

/**
 * Menutup popup promo awal jika muncul
 */
export async function dismissInitialPromo(browser: Browser): Promise<boolean> {
  try {
    const promoBtn = browser.locator('button[aria-label="Close Promo"]').first();
    if (await promoBtn.isVisible().catch(() => false)) {
      await promoBtn.click();
      await new Promise(r => setTimeout(r, 1000));
      return true;
    }

    const hasBackdrop = await browser.evaluate(() => {
      const el = document.querySelector('.z-\\[99999\\]');
      return el && (el as HTMLElement).offsetWidth > 0;
    });

    if (hasBackdrop) {
      await browser.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 800));
      return true;
    }
  } catch (e) {}

  return false;
}

/**
 * Membuka modal 'Log in to D’Paragon' dari header
 */
export async function openLoginModal(browser: Browser): Promise<void> {
  await dismissInitialPromo(browser);

  const modalHeading = browser.locator('h2:has-text("Log in to D’Paragon")');
  if (await modalHeading.isVisible().catch(() => false)) {
    return;
  }

  const loginBtn = browser.locator('button:has-text("Login"):visible, a:has-text("Login"):visible').first();
  if (await loginBtn.isVisible().catch(() => false)) {
    await loginBtn.click();
  } else {
    await browser.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button, a')).find(el => {
        const rect = el.getBoundingClientRect();
        return el.textContent?.trim().toLowerCase() === 'login' && rect.width > 0 && rect.height > 0;
      }) as HTMLElement | undefined;
      if (btn) btn.click();
    });
  }

  await new Promise(r => setTimeout(r, 1500));
}

/**
 * Melakukan logout sesi aktif secara tuntas agar pengujian role berikutnya bersih
 */
export async function logoutSession(browser: Browser): Promise<void> {
  try {
    await browser.goto(TARGET_URL);
    await new Promise(r => setTimeout(r, 1500));

    // Bersihkan cookie dan storage secara komprehensif
    await browser.evaluate(() => {
      document.cookie.split(";").forEach(c => {
        const name = c.split("=")[0].trim();
        document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        document.cookie = `${name}=; path=/; domain=.persona-it.com; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        document.cookie = `${name}=; path=/; domain=dparagon7.persona-it.com; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      });
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {}
    });

    await browser.reload();
    await new Promise(r => setTimeout(r, 1500));
    await dismissInitialPromo(browser);
  } catch (e) {}
}
