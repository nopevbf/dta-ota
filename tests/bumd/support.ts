import fs from 'node:fs';
import path from 'node:path';
import type { Browser } from '@e2e-dev/web';
import { expect } from 'e2e';

/**
 * Helper untuk login sebagai Manajemen dan menavigasi ke halaman BUMD
 */
export async function loginAndNavigateToBumd(browser: Browser, targetPath = '/partner/finance/bumd') {
  const currentUrl = await browser.url().catch(() => '');
  if (!currentUrl.includes('management.dparagon7.persona-it.com')) {
    const username = process.env.E2E_USER_MANAJEMEN_USERNAME || 'superadmin@dparagon.com';
    const password = process.env.E2E_USER_MANAJEMEN_PASSWORD || 'Merpati98';

    await browser.goto('https://auth.dparagon7.persona-it.com/login');

    const mgmtCard = browser.locator('a.login-type-card:has-text("Management")');
    await mgmtCard.click();

    await browser.locator('#username').fill(username);
    await browser.locator('#userpassword').fill(password);
    await browser.locator('button[type="submit"]:has-text("Masuk")').click();
    await browser.waitForURL(/.*management.*/, { timeout: 30000 });
  }

  await browser.goto(`https://management.dparagon7.persona-it.com${targetPath}`);
}

/**
 * Helper untuk menangkap screenshot bukti uji dan menyalinnya ke reports/bumd/screenshots/
 */
export async function takeEvidenceScreenshot(app: any, label: string, saveFilename?: string): Promise<string> {
  const reportsDir = path.resolve(process.cwd(), 'reports', 'bumd', 'screenshots');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const relative = await app.screenshot(label);
  const targetName = saveFilename || `${label}.png`;
  const destPath = path.join(reportsDir, targetName);

  // Cari file screenshot yang baru saja ditulis oleh runner
  const resultsDir = path.resolve(process.cwd(), '.e2e', 'results');
  const candidate = path.resolve(process.cwd(), relative);

  if (fs.existsSync(candidate)) {
    fs.copyFileSync(candidate, destPath);
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
  }

  return destPath;
}

/**
 * Helper untuk mengisi input Tahun Berdiri (menghindari readonly atribut pada datepicker)
 */
export async function setFoundedYear(browser: Browser, year = '2020') {
  await browser.evaluate((val) => {
    const el = document.querySelector('input[name="founded_year"], input#founded_year') as HTMLInputElement | null;
    if (el) {
      el.removeAttribute('readonly');
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, year);
}

/**
 * Helper untuk mengisi seluruh Tab 1 (Identitas Perusahaan) secara valid
 */
export async function fillTab1(browser: Browser, company = 'PT BUMD Makmur Jaya') {
  await browser.locator('input[name="company_name"]').fill(company);
  await browser.locator('input[name="phone"]').fill('081234567800');
  await browser.locator('input[name="email"]').fill('bumd@test.com');
  await browser.locator('input[name="address"]').fill('Jl. Merdeka No. 45');
  await setFoundedYear(browser, '2021');
  await browser.locator('select#input-province').selectOption({ label: 'Daerah Istimewa Yogyakarta' });
  await browser.locator('select[name="status"]').selectOption({ label: 'Aktif' });

  // Tunggu hingga opsi kota terisi dari AJAX response
  await expect.poll(async () => await browser.locator('select#input-city option').count()).toBeGreaterThan(1);

  await browser.evaluate(() => {
    const city = document.querySelector('select#input-city') as HTMLSelectElement | null;
    if (city && city.options.length > 1) {
      city.selectedIndex = 1;
      city.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
}

/**
 * Helper untuk mengisi Tab 2 (Identitas Penanggungjawab) secara valid
 */
export async function fillTab2(browser: Browser) {
  await browser.locator('input[name="pic_name"]').fill('Budi Santoso PJ');
  await browser.locator('input[name="pic_phone"]').fill('081299887766');
  await browser.locator('input[name="pic_position"]').fill('Kepala Divisi Operasional');
  await browser.locator('input[name="pic_email"]').fill('budi.santoso@test.com');
  await browser.locator('input[name="pic_ktp"]').fill('3471012304950002');
}

/**
 * Helper untuk mengisi Tab 3 (Identitas Pimpinan) secara valid
 */
export async function fillTab3(browser: Browser) {
  await browser.locator('input[name="leader_name"]').fill('Dr. H. Hendra Wijaya');
  await browser.locator('input[name="leader_phone"]').fill('081122334455');
  await browser.locator('input[name="leader_position"]').fill('Direktur Utama');
  await browser.locator('input[name="leader_email"]').fill('hendra.dirut@test.com');
  await browser.locator('input[name="leader_ktp"]').fill('3471012304950003');
}
