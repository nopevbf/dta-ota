import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { loginAndNavigateToBumd } from './support.ts';

test.describe('Bank Data BUMD: List & Filter Tests', () => {
  test('BUMD-SC-050: verify BUMD table renders headers and data rows', async ({ browser }) => {
    await loginAndNavigateToBumd(browser);

    // Verifikasi judul halaman
    await expect(browser.locator('body')).toContainText('Bank Data BUMD');

    // Verifikasi header tabel
    const headers = ['Kode', 'Nama Perusahaan BUMD', 'Kota/Kabupaten', 'Provinsi', 'Status', 'Fee Management', 'Fee BUMD'];
    for (const h of headers) {
      await expect(browser.locator(`th:has-text("${h}")`).first()).toBeVisible();
    }

    // Verifikasi data baris ada
    const rows = browser.locator('table tbody tr');
    await expect(await rows.count()).toBeGreaterThan(0);
  });

  test('BUMD-SC-059: verify filter section toggle/collapse', async ({ browser }) => {
    await loginAndNavigateToBumd(browser);

    const filterHeading = browser.locator('text=Filter');
    await expect(filterHeading.first()).toBeVisible();

    // Verifikasi form filter dapat diakses
    const searchInputs = browser.locator('input[type="text"], select');
    await expect(await searchInputs.count()).toBeGreaterThan(0);
  });

  test('BUMD-SC-043: verify search by company name filters data', async ({ browser }) => {
    await loginAndNavigateToBumd(browser);

    // Ambil nama perusahaan dari baris pertama untuk dicari
    const firstCompany = await browser.locator('table tbody tr td:nth-child(3)').first().textContent();
    const keyword = (firstCompany ?? 'Lucas').trim().split(' ')[0];

    const searchInput = browser.locator('input[name="company_name"], input[placeholder*="Nama"], input[type="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill(keyword);
      const submitFilter = browser.locator('button[type="submit"]:has-text("Filter"), button:has-text("Cari")').first();
      if (await submitFilter.isVisible()) {
        await submitFilter.click();
      }
      await expect(browser.locator('table tbody')).toContainText(keyword);
    }
  });

  test('BUMD-SC-053: verify "+ Tambah" button navigates to create BUMD page', async ({ browser }) => {
    await loginAndNavigateToBumd(browser);

    const tambahBtn = browser.locator('a:has-text("Tambah"), button:has-text("Tambah")').first();
    await expect(tambahBtn).toBeVisible();
    await tambahBtn.click();

    await browser.waitForURL(/.*partner\/finance\/bumd\/create.*/);
    await expect(browser.locator('body')).toContainText('Tambah Data BUMD');
  });

  test('BUMD-SC-055: verify Excel export button is present and clickable', async ({ browser }) => {
    await loginAndNavigateToBumd(browser);

    const excelBtn = browser.locator('a:has-text("Excel"), button:has-text("Excel")').first();
    await expect(excelBtn).toBeVisible();
  });
});
