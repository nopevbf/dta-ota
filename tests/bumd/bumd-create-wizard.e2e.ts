import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { loginAndNavigateToBumd, fillTab1, fillTab2 } from './support.ts';

test.describe('Form Tambah Data BUMD: Wizard Tabs Tests', () => {
  test('BUMD-SC-001: verify validation error when submitting empty fields on Tab 1', async ({ browser }) => {
    await loginAndNavigateToBumd(browser, '/partner/finance/bumd/create');

    // Klik tombol Selanjutnya tanpa mengisi field wajib
    const nextBtn = browser.locator('#tab-perusahaan .next-tab');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    // Verifikasi tetap di tab pertama
    const companyInput = browser.locator('input[name="company_name"]');
    await expect(companyInput).toBeVisible();
  });

  test('BUMD-SC-010: verify Province selection loads Regency/City options', async ({ browser }) => {
    await loginAndNavigateToBumd(browser, '/partner/finance/bumd/create');

    const provinceSelect = browser.locator('select#input-province, select[name="province_id"]');
    await expect(provinceSelect).toBeVisible();

    await provinceSelect.selectOption({ label: 'Jawa Barat' });

    // Tunggu dropdown kota diperbarui
    await expect.poll(async () => await browser.locator('select#input-city option').count()).toBeGreaterThan(1);
  });

  test('BUMD-SC-011: verify Status Kerjasama dropdown options', async ({ browser }) => {
    await loginAndNavigateToBumd(browser, '/partner/finance/bumd/create');

    const statusSelect = browser.locator('select[name="status"]');
    await expect(statusSelect).toBeVisible();

    await statusSelect.selectOption({ label: 'Aktif' });
    const selectedVal = await statusSelect.inputValue();
    expect(selectedVal).toBeTruthy();
  });

  test('BUMD-SC-013: verify "Batal" button returns to BUMD list page', async ({ browser }) => {
    await loginAndNavigateToBumd(browser, '/partner/finance/bumd/create');

    const batalBtn = browser.locator('a.btn-danger:has-text("Batal"), button.btn-danger:has-text("Batal")').first();
    await expect(batalBtn).toBeVisible();
    await batalBtn.click();

    await browser.waitForURL(/.*partner\/finance\/bumd$/);
    await expect(browser.locator('body')).toContainText('Bank Data BUMD');
  });

  test('BUMD-SC-012 & BUMD-SC-024: fill Tab 1 validly and advance to Tab 2 and Tab 3', async ({ browser }) => {
    await loginAndNavigateToBumd(browser, '/partner/finance/bumd/create');

    // 1. Isi Tab 1: Identitas Perusahaan
    await fillTab1(browser, 'PT BUMD Testing Prima');

    // Klik Selanjutnya ke Tab 2
    await browser.locator('#tab-perusahaan .next-tab').click();

    // Verifikasi berada di Tab 2: Identitas Penanggungjawab
    const picNameInput = browser.locator('input[name="pic_name"]');
    await expect(picNameInput).toBeVisible();

    // 2. Isi Tab 2: Identitas Penanggungjawab
    await fillTab2(browser);

    // Klik Selanjutnya ke Tab 3
    await browser.locator('#tab-pj .next-tab').click();

    // Verifikasi berada di Tab 3: Identitas Pimpinan
    const leaderNameInput = browser.locator('input[name="leader_name"]');
    await expect(leaderNameInput).toBeVisible();

    // 3. Verifikasi tombol Kembali ke Tab 2
    const prevBtn = browser.locator('#tab-pimpinan .prev-tab');
    await expect(prevBtn).toBeVisible();
    await prevBtn.click();

    // Pastikan data Tab 2 tidak hilang
    await expect(picNameInput).toBeVisible();
    expect(await picNameInput.inputValue()).toBe('Budi Santoso PJ');
  });
});
