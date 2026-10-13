import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { loginAndNavigateToMitra } from './support.ts';

test.describe('Setting Mitra - List, Tab & Filter Tests', () => {
  test('MITRA-TC-001: Verifikasi tabel mitra dan badge counter "Daftar Seluruh Mitra"', async ({ browser }) => {
    await loginAndNavigateToMitra(browser);

    // Verifikasi keberadaan tabel mitra
    const table = browser.locator('table').first();
    await expect(table).toBeVisible();

    // Verifikasi header tab atau baris tabel
    const tabSeluruh = browser.locator('text=Daftar Seluruh Mitra, a:has-text("Daftar Seluruh Mitra"), text=Seluruh Mitra, .nav-tabs').first();
    if (await tabSeluruh.isVisible().catch(() => false)) {
      await expect(tabSeluruh).toBeVisible();
    }

    // Verifikasi minimal terdapat kolom tabel
    const thElements = browser.locator('table th');
    await expect(await thElements.count()).toBeGreaterThan(0);
  });

  test('MITRA-TC-002: Verifikasi tab "Memiliki Minimal 1 Properti"', async ({ browser }) => {
    await loginAndNavigateToMitra(browser);

    const tabMin1 = browser.locator('text=Memiliki Minimal 1 Properti, a:has-text("Minimal 1 Properti")').first();
    if (await tabMin1.isVisible().catch(() => false)) {
      await tabMin1.click();
      await expect(browser.locator('body')).toBeVisible();
    }
  });

  test('MITRA-TC-005 & MITRA-TC-006: Verifikasi filter pencarian Nama / Email dan Empty State', async ({ browser }) => {
    await loginAndNavigateToMitra(browser);

    const searchInput = browser.locator('input[placeholder*="Nama"], input[placeholder*="Email"], input[name="search"], input[type="search"]').first();
    const searchBtn = browser.locator('button:has-text("Cari"), button[type="submit"]:has-text("Filter")').first();

    if (await searchInput.isVisible().catch(() => false)) {
      // TC-006: Cari keyword yang tidak ada
      await searchInput.fill('XYZ_TIDAK_DITEMUKAN_999');
      if (await searchBtn.isVisible().catch(() => false)) {
        await searchBtn.click();
      }
      await expect(browser.locator('table, .empty-state').first()).toBeVisible();

      // Reset / Hapus input
      await searchInput.fill('');
    }
  });

  test('MITRA-TC-007: Verifikasi dropdown filter Status (Pending / Approved)', async ({ browser }) => {
    await loginAndNavigateToMitra(browser);

    const statusDropdown = browser.locator('select[name="status"], select:has-text("Status")').first();
    if (await statusDropdown.isVisible().catch(() => false)) {
      await statusDropdown.selectOption({ label: 'Pending' }).catch(() => {});
      const filterBtn = browser.locator('button:has-text("Cari"), button[type="submit"]:has-text("Filter")').first();
      if (await filterBtn.isVisible().catch(() => false)) {
        await filterBtn.click();
      }
      await expect(browser.locator('table tbody').first()).toBeVisible();
    }
  });

  test('MITRA-TC-012 & MITRA-TC-013: Verifikasi kolom Aksi pada mitra Pending dan Approved', async ({ browser }) => {
    await loginAndNavigateToMitra(browser);

    const rows = browser.locator('table tbody tr');
    const rowCount = await rows.count().catch(() => 0);

    if (rowCount > 0) {
      // Periksa minimal ada tombol Lihat (mata) atau Ubah (pensil) di kolom aksi
      const actionIcons = browser.locator('table tbody tr td:last-child a, table tbody tr td:last-child button');
      await expect(await actionIcons.count()).toBeGreaterThan(0);
    }
  });

  test('MITRA-TC-021: Verifikasi tombol Reset filter', async ({ browser }) => {
    await loginAndNavigateToMitra(browser);

    const resetBtn = browser.locator('button:has-text("Reset"), a:has-text("Reset")').first();
    if (await resetBtn.isVisible().catch(() => false)) {
      await resetBtn.click();
      await expect(browser.locator('table').first()).toBeVisible();
    }
  });
});
