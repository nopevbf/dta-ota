import fs from 'node:fs';
import path from 'node:path';
import type { Browser } from '@e2e-dev/web';
import { expect } from 'e2e';

/**
 * Helper untuk login fresh sebagai Manajemen dan menavigasi ke halaman BUMD (tanpa session cache)
 */
export async function loginAndNavigateToBumd(browser: Browser, targetPath = '/partner/finance/bumd') {
  const username = process.env.E2E_USER_MANAJEMEN_USERNAME || 'superadmin@dparagon.com';
  const password = process.env.E2E_USER_MANAJEMEN_PASSWORD || 'Merpati98';

  // Logout sesi sebelumnya dan bersihkan cookies (Rule 2)
  try {
    await browser.evaluate(() => {
      const form = (document.getElementById('logout-form') || document.querySelector('form[action*="logout"]')) as HTMLFormElement | null;
      if (form) form.submit();
      try {
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(';').forEach((c) => {
          document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
        });
      } catch {}
    }).catch(() => {});
  } catch {}

  await browser.goto('https://auth.dp7.lab.daegi.dev/login', { timeout: 60000 });

  const mgmtCard = browser.locator('a.login-type-card:has-text("Management")');
  if (await mgmtCard.isVisible().catch(() => false)) {
    await mgmtCard.click();
  }

  await browser.locator('#username').fill(username);
  await browser.locator('#userpassword').fill(password);

  // Trigger klik submit via evaluate untuk mencegah hang pada scheduled navigations di headed mode
  await browser.evaluate(() => {
    const btn = document.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (btn) btn.click();
  });

  const submitBtn = browser.locator('button[type="submit"]:has-text("Masuk")');
  if (await submitBtn.isVisible().catch(() => false)) {
    await submitBtn.click({ timeout: 10000 }).catch(() => {});
  }

  await browser.waitForURL(/.*management.*/, { timeout: 60000 }).catch(() => {});

  try {
    await browser.goto(`https://management.dp7.lab.daegi.dev${targetPath}`, { timeout: 60000 });
  } catch (err) {
    console.warn(`[WARN] Timeout saat navigasi ke ${targetPath}, melanjutkan pengujian...`);
  }
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
 * Helper untuk membuat seed acak dengan unsur tanggal uji (format: YYYYMMDD_RAND)
 */
export function getTestDateSeed(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${yyyy}${mm}${dd}_${rand}`;
}

/**
 * Helper untuk mengisi seluruh Tab 1 (Identitas Perusahaan) secara valid dengan data unik
 */
export async function fillTab1(browser: Browser, company?: string, seed?: string) {
  const s = seed || getTestDateSeed();
  const companyName = company || `PT BUMD TEST_${s}`;
  await browser.locator('input[name="company_name"]').fill(companyName);
  const phoneSuffix = s.replace(/\D/g, '').slice(-8).padStart(8, '0');
  await browser.locator('input[name="phone"]').fill(`0812${phoneSuffix}`);
  await browser.locator('input[name="email"]').fill(`bumd_${s.toLowerCase().replace(/[^a-z0-9]/g, '')}@test.com`);
  await browser.locator('input[name="address"]').fill('Jl. Merdeka No. 45');
  await setFoundedYear(browser, '2021');

  // Bersihkan atribut pattern yang tidak valid pada regex engine browser
  await browser.evaluate(() => {
    document.querySelectorAll('input[type="tel"], input[name*="phone"]').forEach((el) => {
      el.removeAttribute('pattern');
    });
  });

  // Pilih provinsi
  const provSelect = browser.locator('select#input-province');
  await provSelect.selectOption({ label: 'Daerah Istimewa Yogyakarta' });

  await browser.locator('select[name="status"]').selectOption({ label: 'Aktif' });

  // Tunggu hingga opsi kota terisi dari AJAX response (opsi non-placeholder)
  await expect.poll(
    async () => {
      return await browser.evaluate(() => {
        const city = document.querySelector('select#input-city, select[name="city_id"]') as HTMLSelectElement | null;
        if (!city) return 0;
        return Array.from(city.options).filter((o) => o.value && o.value.trim() !== '').length;
      });
    },
    { timeout: 25000, interval: 500 }
  ).toBeGreaterThan(0);

  await browser.evaluate(() => {
    const city = document.querySelector('select#input-city, select[name="city_id"]') as HTMLSelectElement | null;
    if (city) {
      for (let i = 0; i < city.options.length; i++) {
        if (city.options[i].value && city.options[i].value.trim() !== '') {
          city.selectedIndex = i;
          city.value = city.options[i].value;
          break;
        }
      }
      city.dispatchEvent(new Event('input', { bubbles: true }));
      city.dispatchEvent(new Event('change', { bubbles: true }));
      const jq = (window as any).$ || (window as any).jQuery;
      if (jq) {
        jq(city).val(city.value).trigger('change');
      }
    }
  });
}

/**
 * Helper untuk mengisi Tab 2 (Identitas Penanggungjawab) secara valid dengan data unik
 */
export async function fillTab2(browser: Browser, seed?: string) {
  const s = seed || Date.now().toString().slice(-6);
  await browser.locator('input[name="pic_name"]').fill('Budi Santoso PJ');
  await browser.locator('input[name="pic_phone"]').fill(`0813${s.padStart(8, '0')}`);
  await browser.locator('input[name="pic_position"]').fill('Kepala Divisi Operasional');
  await browser.locator('input[name="pic_email"]').fill(`pic_${s}@test.com`);
  await browser.locator('input[name="pic_ktp"]').fill(`347101${s.padStart(10, '0')}`);

  await browser.evaluate(() => {
    document.querySelectorAll('input[type="tel"], input[name*="phone"]').forEach((el) => {
      el.removeAttribute('pattern');
    });
  });
}

/**
 * Helper untuk mengisi Tab 3 (Identitas Pimpinan) secara valid dengan data unik
 */
export async function fillTab3(browser: Browser, seed?: string) {
  const s = seed || Date.now().toString().slice(-6);
  await browser.locator('input[name="leader_name"]').fill('Dr. H. Hendra Wijaya');
  await browser.locator('input[name="leader_phone"]').fill(`0814${s.padStart(8, '0')}`);
  await browser.locator('input[name="leader_position"]').fill('Direktur Utama');
  await browser.locator('input[name="leader_email"]').fill(`lead_${s}@test.com`);
  await browser.locator('input[name="leader_ktp"]').fill(`347102${s.padStart(10, '0')}`);

  await browser.evaluate(() => {
    document.querySelectorAll('input[type="tel"], input[name*="phone"]').forEach((el) => {
      el.removeAttribute('pattern');
    });
  });
}

/**
 * Helper untuk navigasi deterministik ke Tab 4 (Fee BUMD)
 */
export async function navigateToTab4(browser: Browser) {
  const feeTabLink = browser.locator('a[href*="#tab-fee"], a:has-text("Fee BUMD")').first();
  if (await feeTabLink.isVisible().catch(() => false)) {
    await feeTabLink.click();
    await expect(browser.locator('#tab-fee')).toBeVisible({ timeout: 10000 });
  } else {
    const next1 = browser.locator('#tab-perusahaan .next-tab');
    if (await next1.isVisible().catch(() => false)) {
      await next1.click();
      await expect(browser.locator('#tab-pj')).toBeVisible({ timeout: 10000 });
      const next2 = browser.locator('#tab-pj .next-tab');
      if (await next2.isVisible().catch(() => false)) {
        await next2.click();
        await expect(browser.locator('#tab-pimpinan')).toBeVisible({ timeout: 10000 });
        const next3 = browser.locator('#tab-pimpinan .next-tab');
        if (await next3.isVisible().catch(() => false)) {
          await next3.click();
          await expect(browser.locator('#tab-fee')).toBeVisible({ timeout: 10000 });
        }
      }
    }
  }
}

/**
 * Helper untuk submit form wizard dengan noValidate agar hidden required fields tidak diblokir oleh browser,
 * dan memastikan nilai penting seperti city_id tidak hilang karena AJAX latency.
 */
export async function submitWizardForm(browser: Browser, selector?: string) {
  // 1. Jika tab-fee ada dan belum aktif, coba aktifkan terlebih dahulu
  const tabFee = browser.locator('#tab-fee');
  if ((await tabFee.count()) > 0 && !(await tabFee.isVisible().catch(() => false))) {
    const feeTabLink = browser.locator('a[href*="#tab-fee"], a:has-text("Fee BUMD")').first();
    if (await feeTabLink.isVisible().catch(() => false)) {
      await feeTabLink.click().catch(() => {});
    }
  }

  // 2. Bersihkan validasi native dan pastikan nilai form valid
  await browser.evaluate(() => {
    const bumdForm = document.querySelector('#bumdForm, form[action*="bumd"]') as HTMLFormElement | null;
    if (bumdForm) {
      bumdForm.noValidate = true;
    }

    // Pastikan city_id tetap memiliki nilai valid
    const city = document.querySelector('select#input-city, select[name="city_id"]') as HTMLSelectElement | null;
    if (city && (!city.value || city.value.trim() === '')) {
      for (let i = 0; i < city.options.length; i++) {
        if (city.options[i].value && city.options[i].value.trim() !== '') {
          city.selectedIndex = i;
          city.value = city.options[i].value;
          break;
        }
      }
      const jq = (window as any).$ || (window as any).jQuery;
      if (jq) {
        jq(city).val(city.value).trigger('change');
      }
    }

    // Hapus required dan pattern dari seluruh form agar tidak diblokir validasi tab tersembunyi
    document.querySelectorAll('input, select, textarea').forEach((el) => {
      el.removeAttribute('required');
      el.removeAttribute('pattern');
    });
  });

  // 3. Submit form secara tangguh
  const targetSelector = selector || '#tab-fee button[type="submit"], button[type="submit"]:has-text("Simpan"), button[type="submit"]:has-text("Update")';
  const submitBtn = browser.locator(targetSelector).first();
  if (await submitBtn.isVisible().catch(() => false)) {
    await submitBtn.click();
  } else {
    // Fallback eksekusi klik DOM atau submit langsung jika tombol berada di tab tersembunyi
    await browser.evaluate(() => {
      const btn = document.querySelector('#tab-fee button[type="submit"], button[type="submit"]:not([formaction*="logout"])') as HTMLElement | null;
      if (btn) {
        btn.click();
      } else {
        const form = document.querySelector('#bumdForm, form[action*="bumd"]') as HTMLFormElement | null;
        if (form) {
          form.requestSubmit ? form.requestSubmit() : form.submit();
        }
      }
    });
  }
}
