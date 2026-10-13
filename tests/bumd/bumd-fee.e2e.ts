import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { loginAndNavigateToBumd, fillTab1, fillTab2, fillTab3 } from './support.ts';

test.describe('Fitur Tambahan: Fee BUMD Tests', () => {
  test('BUMD-FEE-006: verify Fee Management and Fee BUMD columns in table', async ({ browser }) => {
    await loginAndNavigateToBumd(browser, '/partner/finance/bumd');

    const feeMgmtHeader = browser.locator('th:has-text("Fee Management")');
    const feeBumdHeader = browser.locator('th:has-text("Fee BUMD")');

    await expect(feeMgmtHeader).toBeVisible();
    await expect(feeBumdHeader).toBeVisible();

    // Verifikasi data baris pertama memuat format persentase (%)
    const firstRowMgmtFee = browser.locator('table tbody tr td:nth-child(11)').first();
    const firstRowBumdFee = browser.locator('table tbody tr td:nth-child(12)').first();

    await expect(firstRowMgmtFee).toBeVisible();
    await expect(firstRowBumdFee).toBeVisible();
    await expect(firstRowMgmtFee).toContainText('%');
    await expect(firstRowBumdFee).toContainText('%');
  });

  test('BUMD-FEE-001 & BUMD-FEE-002: navigate to Fee BUMD tab and validate inputs', async ({ browser }) => {
    await loginAndNavigateToBumd(browser, '/partner/finance/bumd/create');

    // 1. Isi Tab 1
    await fillTab1(browser, 'PT BUMD Makmur Jaya');
    await browser.locator('#tab-perusahaan .next-tab').click();

    // 2. Isi Tab 2
    await fillTab2(browser);
    await browser.locator('#tab-pj .next-tab').click();

    // 3. Isi Tab 3
    await fillTab3(browser);
    await browser.locator('#tab-pimpinan .next-tab').click();

    // 4. Verifikasi berada di Tab 4: Fee BUMD
    const feeMgmtInput = browser.locator('input[name="fee_management"]');
    const feeBumdInput = browser.locator('input[name="fee_bumd"]');

    await expect(feeMgmtInput).toBeVisible();
    await expect(feeBumdInput).toBeVisible();

    // Input persentase valid
    await feeMgmtInput.fill('15');
    await feeBumdInput.fill('85');

    expect(await feeMgmtInput.inputValue()).toBe('15');
    expect(await feeBumdInput.inputValue()).toBe('85');

    // 5. Verifikasi tombol Kembali ke Tab 3
    const backBtn = browser.locator('#tab-fee .prev-tab');
    await expect(backBtn).toBeVisible();
    await backBtn.click();

    // Verifikasi kembali di Tab 3
    await expect(browser.locator('input[name="leader_name"]')).toBeVisible();
  });

  test('BUMD-FEE-003: Boundary Value Analysis (BVA) for Fee BUMD (0% and 100%)', async ({ browser }) => {
    await loginAndNavigateToBumd(browser, '/partner/finance/bumd/create');

    // Isi Tab 1
    await fillTab1(browser, 'PT BVA Test BUMD');
    await browser.locator('#tab-perusahaan .next-tab').click();

    // Isi Tab 2
    await fillTab2(browser);
    await browser.locator('#tab-pj .next-tab').click();

    // Isi Tab 3
    await fillTab3(browser);
    await browser.locator('#tab-pimpinan .next-tab').click();

    // Tab 4: Uji Boundary 0% dan 100%
    const feeMgmtInput = browser.locator('input[name="fee_management"]');
    const feeBumdInput = browser.locator('input[name="fee_bumd"]');

    // Case 1: 0% Fee Management & 100% Fee BUMD
    await feeMgmtInput.fill('0');
    await feeBumdInput.fill('100');
    expect(await feeMgmtInput.inputValue()).toBe('0');
    expect(await feeBumdInput.inputValue()).toBe('100');

    // Case 2: 100% Fee Management & 0% Fee BUMD
    await feeMgmtInput.fill('100');
    await feeBumdInput.fill('0');
    expect(await feeMgmtInput.inputValue()).toBe('100');
    expect(await feeBumdInput.inputValue()).toBe('0');
  });
});
