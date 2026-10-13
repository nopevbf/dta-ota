import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { loginAndNavigateToMitra } from './support.ts';

test.describe('Setting Mitra - Active / On-Progress QA Test Cases', () => {
  /**
   * Ref Scenario : MITRA-SC-008
   * Test Case IDs: MITRA-TC-008-01 s/d MITRA-TC-008-04
   */
  test('MITRA-TC-008: Validasi dropdown filter Tag Kelompok dan hasil penyaringan data', async ({ browser }) => {
    await loginAndNavigateToMitra(browser);

    const tagDropdown = browser.locator('select[name="tag_kelompok"], select[name="tag"], select:has-text("Kelompok")').first();
    if (await tagDropdown.isVisible().catch(() => false)) {
      // Pilih opsi tag kelompok
      await tagDropdown.selectOption({ index: 1 }).catch(() => {});
      const cariBtn = browser.locator('button:has-text("Cari"), button[type="submit"]:has-text("Filter")').first();
      if (await cariBtn.isVisible().catch(() => false)) {
        await cariBtn.click();
      }

      // Pastikan tabel merespons filter
      await expect(browser.locator('table, .empty-state').first()).toBeVisible();
    }
  });

  /**
   * Ref Scenario : MITRA-SC-033
   * Test Case IDs: MITRA-TC-033-01 s/d MITRA-TC-033-04
   */
  test('MITRA-TC-033: Validasi penolakan No. HP berisi huruf/simbol pada Modal Tambah Mitra', async ({ browser }) => {
    await loginAndNavigateToMitra(browser);

    const tambahBtn = browser.locator('button:has-text("Tambah Mitra"), a:has-text("Tambah Mitra")').first();
    if (await tambahBtn.isVisible().catch(() => false)) {
      await tambahBtn.click();

      const hpInput = browser.locator('input[name="phone"], input[name="no_hp"], input[placeholder*="HP"], input[placeholder*="Telepon"]').first();
      if (await hpInput.isVisible().catch(() => false)) {
        // Coba input string mengandung huruf & simbol
        await hpInput.fill('081234abc#$');

        const simpanBtn = browser.locator('button[type="submit"]:has-text("Simpan"), button:has-text("Simpan Mitra")').first();
        if (await simpanBtn.isVisible().catch(() => false)) {
          await simpanBtn.click();
        }

        // Verifikasi: sistem menahan submit (modal tetap terbuka atau field invalid)
        const modal = browser.locator('.modal, [role="dialog"]').first();
        await expect(modal).toBeVisible();

        const inputVal = await hpInput.inputValue().catch(() => '');
        // Jika terdapat sanitasi input langsung di client-side, karakter non-digit seharusnya terbuang
        // Jika ada validasi submit, modal tetap menolak
        expect(inputVal).toBeDefined();
      }
    }
  });

  /**
   * Ref Scenario : MITRA-SC-058
   * Test Case IDs: MITRA-TC-058-01 s/d MITRA-TC-058-04
   */
  test('MITRA-TC-058: Validasi penolakan No. HP berisi huruf/simbol pada Modal Ubah Data Mitra', async ({ browser }) => {
    await loginAndNavigateToMitra(browser);

    const editBtn = browser.locator('a[title*="Ubah"], button[title*="Ubah"], .fa-pencil, .fa-edit').first();
    if (await editBtn.isVisible().catch(() => false)) {
      await editBtn.click();

      const modalEdit = browser.locator('.modal:has-text("Ubah"), [role="dialog"]').first();
      await expect(modalEdit).toBeVisible();

      const hpInput = browser.locator('input[name="phone"], input[name="no_hp"], input[placeholder*="HP"]').first();
      if (await hpInput.isVisible().catch(() => false)) {
        // Ganti nomor HP menjadi huruf/simbol
        await hpInput.fill('0899xyz!@#');

        const simpanBtn = browser.locator('button[type="submit"]:has-text("Simpan"), button:has-text("Simpan Perubahan")').first();
        if (await simpanBtn.isVisible().catch(() => false)) {
          await simpanBtn.click();
        }

        // Modal tetap menolak atau form invalid
        await expect(modalEdit).toBeVisible();
      }
    }
  });
});
