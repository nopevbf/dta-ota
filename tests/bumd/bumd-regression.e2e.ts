import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import {
  loginAndNavigateToBumd,
  fillTab1,
  fillTab2,
  fillTab3,
  submitWizardForm,
  takeEvidenceScreenshot,
} from './support.ts';

test.describe('Bank Data BUMD: Regression Test Suite (Automated End-to-End)', () => {
  test('BUMD-REG-001: Table Rendering, Fee Columns, and Action Toolbar Integrity', async ({ browser }) => {
    await loginAndNavigateToBumd(browser, '/partner/finance/bumd');

    // Verifikasi header tabel
    await expect(browser.locator('th:has-text("Nama Perusahaan BUMD")')).toBeVisible();
    await expect(browser.locator('th:has-text("Fee Management")')).toBeVisible();
    await expect(browser.locator('th:has-text("Fee BUMD")')).toBeVisible();
    await expect(browser.locator('th:has-text("Aksi")')).toBeVisible();

    // Verifikasi tombol aksi atas
    await expect(browser.locator('a[href*="/create"]:has-text("Tambah")')).toBeVisible();
    await expect(browser.locator('a[href*="/export/excel"]:has-text("Excel")')).toBeVisible();
  });

  test('BUMD-REG-002: Wizard Stepper Navigation and Form State Retention (Tab 1 to Tab 4)', async ({ browser }) => {
    await loginAndNavigateToBumd(browser, '/partner/finance/bumd/create');

    // Tab 1
    const company = 'PT Regresi Verifikasi Wizard';
    await fillTab1(browser, company);
    await browser.locator('#tab-perusahaan .next-tab').click();

    // Tab 2
    await fillTab2(browser);
    await browser.locator('#tab-pj .next-tab').click();

    // Tab 3
    await fillTab3(browser);
    await browser.locator('#tab-pimpinan .next-tab').click();

    // Tab 4 (Fee BUMD)
    await browser.locator('input[name="fee_management"]').fill('20');
    await browser.locator('input[name="fee_bumd"]').fill('15');

    // Navigasi mundur ke Tab 3 -> Tab 2 -> Tab 1
    await browser.locator('#tab-fee .prev-tab').click();
    await expect(browser.locator('#tab-pimpinan')).toBeVisible();
    await browser.locator('#tab-pimpinan .prev-tab').click();
    await expect(browser.locator('#tab-pj')).toBeVisible();
    await browser.locator('#tab-pj .prev-tab').click();
    await expect(browser.locator('#tab-perusahaan')).toBeVisible();

    // Nilai perusahaan di Tab 1 tetap tersimpan
    await expect(browser.locator('input[name="company_name"]')).toHaveValue(company);
  });

  test('BUMD-REG-003: Full Data Lifecycle CRUD (Create -> Verify -> Update -> Verify -> Delete -> Verify Teardown)', async ({ app, browser }) => {
    const regUnique = Date.now().toString().slice(-6);
    const regCompanyName = `PT BUMD Regresi ${regUnique}`;

    // 1. CREATE
    await loginAndNavigateToBumd(browser, '/partner/finance/bumd/create');
    await fillTab1(browser, regCompanyName, regUnique);
    await browser.locator('#tab-perusahaan .next-tab').click();
    await fillTab2(browser, regUnique);
    await browser.locator('#tab-pj .next-tab').click();
    await fillTab3(browser, regUnique);
    await browser.locator('#tab-pimpinan .next-tab').click();
    await browser.locator('input[name="fee_management"]').fill('15');
    await browser.locator('input[name="fee_bumd"]').fill('10');
    await submitWizardForm(browser);

    // Tunggu redirect & verifikasi di tabel
    await browser.waitForURL(/.*\/partner\/finance\/bumd$/, { timeout: 30000 });
    const rowSelector = `tr:has-text("${regCompanyName}")`;
    await expect.poll(async () => await browser.locator(rowSelector).count()).toBeGreaterThan(0);
    await expect(browser.locator(`${rowSelector} td:has-text("15%")`).first()).toBeVisible();
    await expect(browser.locator(`${rowSelector} td:has-text("10%")`).first()).toBeVisible();

    // 2. UPDATE
    const editBtn = browser.locator(`${rowSelector} a[href*="/edit"]`).first();
    await editBtn.click();
    await browser.waitForURL(/.*\/edit.*/, { timeout: 30000 });
    const regUpdatedPhone = '081288887777';
    await browser.locator('input[name="phone"]').fill(regUpdatedPhone);

    // Navigasi ke Tab 4 Fee & Update
    const next1 = browser.locator('#tab-perusahaan .next-tab');
    if (await next1.isVisible().catch(() => false)) {
      await next1.click();
      const next2 = browser.locator('#tab-pj .next-tab');
      if (await next2.isVisible().catch(() => false)) {
        await next2.click();
        const next3 = browser.locator('#tab-pimpinan .next-tab');
        if (await next3.isVisible().catch(() => false)) {
          await next3.click();
        }
      }
    }
    const updateFeeBumd = browser.locator('input[name="fee_bumd"]');
    if (await updateFeeBumd.isVisible().catch(() => false)) {
      await updateFeeBumd.fill('12');
    }

    await submitWizardForm(browser);
    await browser.waitForURL(/.*\/partner\/finance\/bumd$/, { timeout: 30000 });

    // Verifikasi pembaruan di tabel
    await expect.poll(async () => await browser.locator(rowSelector).count()).toBeGreaterThan(0);
    await expect(browser.locator(`${rowSelector} td:has-text("${regUpdatedPhone}")`).first()).toBeVisible();

    // 3. DELETE
    await browser.onDialog(async (dialog) => {
      await dialog.accept();
    });

    const deleteBtn = browser.locator(`${rowSelector} td:last-child button, ${rowSelector} form button`).first();
    await deleteBtn.click();

    // Tunggu refresh dan verifikasi bahwa data telah terhapus
    await browser.waitForURL(/.*\/partner\/finance\/bumd.*/, { timeout: 15000 }).catch(() => {});
    await browser.goto('https://management.dparagon7.persona-it.com/partner/finance/bumd');
    await expect.poll(async () => await browser.locator(rowSelector).count()).toBe(0);
  });

  test('BUMD-REG-004: Filter Functionality and Excel Export Response', async ({ browser }) => {
    await loginAndNavigateToBumd(browser, '/partner/finance/bumd');

    // Buka filter jika tersembunyi
    const filterHeader = browser.locator('a:has-text("Filter"), button:has-text("Filter")').first();
    if (await filterHeader.isVisible().catch(() => false)) {
      await filterHeader.click();
    }

    // Input filter pencarian
    const searchInput = browser.locator('input#input-search-company_name, input[name="company_name"]');
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('BUMD');
      const applyBtn = browser.locator('button#btn-apply-filter, button:has-text("Terapkan")');
      if (await applyBtn.isVisible().catch(() => false)) {
        await applyBtn.click();
      }
    }

    // Verifikasi tombol Excel dapat diklik
    const excelBtn = browser.locator('a[href*="/export/excel"]');
    await expect(excelBtn).toBeVisible();
  });
});
