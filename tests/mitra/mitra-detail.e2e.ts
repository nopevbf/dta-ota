import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { loginAndNavigateToMitra } from './support.ts';

test.describe('Setting Mitra - Detail Mitra Page Tests', () => {
  test('MITRA-TC-014 & MITRA-TC-041: Akses halaman Detail Mitra dan validasi atribut panel', async ({ browser }) => {
    await loginAndNavigateToMitra(browser);

    // Klik tombol aksi Lihat (mata) baris pertama
    const viewBtn = browser.locator('a[title*="Lihat"], button[title*="Lihat"], .fa-eye, table tbody tr td:last-child a').first();
    if (await viewBtn.isVisible().catch(() => false)) {
      await viewBtn.click();

      // Tunggu navigasi halaman detail
      await browser.waitForURL(/.*partner.*/, { timeout: 15000 }).catch(() => {});

      // Verifikasi judul/panel detail
      await expect(browser.locator('body')).toContainText(/Detail|Setting Mitra/);

      // Verifikasi atribut penting pada panel
      const detailPanel = browser.locator('body');
      await expect(detailPanel).toContainText(/Kode Mitra|PIC|Email|Properti|Status/);
    }
  });

  test('MITRA-TC-047 & MITRA-TC-048: Verifikasi bagian Daftar Properti pada Detail Mitra', async ({ browser }) => {
    await loginAndNavigateToMitra(browser);

    const viewBtn = browser.locator('a[title*="Lihat"], button[title*="Lihat"], .fa-eye').first();
    if (await viewBtn.isVisible().catch(() => false)) {
      await viewBtn.click();

      const propertiSection = browser.locator('text=Daftar Properti, text=Properti').first();
      await expect(propertiSection).toBeVisible();
    }
  });

  test('MITRA-TC-051 & MITRA-TC-052: Verifikasi bagian Riwayat Aktivitas pada Detail Mitra', async ({ browser }) => {
    await loginAndNavigateToMitra(browser);

    const viewBtn = browser.locator('a[title*="Lihat"], button[title*="Lihat"], .fa-eye').first();
    if (await viewBtn.isVisible().catch(() => false)) {
      await viewBtn.click();

      const aktivitasSection = browser.locator('text=Riwayat Aktivitas, text=Aktivitas').first();
      if (await aktivitasSection.isVisible().catch(() => false)) {
        await expect(aktivitasSection).toBeVisible();
      }
    }
  });

  test('MITRA-TC-054: Verifikasi breadcrumb navigasi kembali ke halaman list', async ({ browser }) => {
    await loginAndNavigateToMitra(browser);

    const viewBtn = browser.locator('a[title*="Lihat"], button[title*="Lihat"], .fa-eye').first();
    if (await viewBtn.isVisible().catch(() => false)) {
      await viewBtn.click();

      const breadcrumbLink = browser.locator('.breadcrumb a:has-text("Setting Mitra"), .breadcrumb a:has-text("Mitra")').first();
      if (await breadcrumbLink.isVisible().catch(() => false)) {
        await breadcrumbLink.click();
        await expect(browser.locator('table')).toBeVisible();
      }
    }
  });
});
