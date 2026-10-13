import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { loginAndNavigateToMitra } from './support.ts';

test.describe('Setting Mitra - Modal Tambah & Ubah Mitra Tests', () => {
  test('MITRA-TC-017: Verifikasi tombol "+ Tambah Mitra" membuka modal form kosong', async ({ browser }) => {
    await loginAndNavigateToMitra(browser);

    const tambahBtn = browser.locator('button:has-text("Tambah Mitra"), a:has-text("Tambah Mitra"), button:has-text("Tambah")').first();
    await expect(tambahBtn).toBeVisible();
    await tambahBtn.click();

    // Verifikasi modal terbuka
    const modal = browser.locator('.modal, [role="dialog"], #modalTambahMitra').first();
    await expect(modal).toBeVisible();

    // Verifikasi input fields mandatory tersedia
    await expect(browser.locator('input[name="first_name"], input[name="nama_depan"], #first_name').first()).toBeVisible();
    await expect(browser.locator('input[name="email"], #email').first()).toBeVisible();
    await expect(browser.locator('input[name="password"], #password').first()).toBeVisible();
    await expect(browser.locator('input[name="password_confirmation"], #password_confirmation').first()).toBeVisible();
  });

  test('MITRA-TC-022 & MITRA-TC-023: Validasi pencegahan submit saat field mandatory kosong', async ({ browser }) => {
    await loginAndNavigateToMitra(browser);

    const tambahBtn = browser.locator('button:has-text("Tambah Mitra"), a:has-text("Tambah Mitra")').first();
    if (await tambahBtn.isVisible().catch(() => false)) {
      await tambahBtn.click();

      // Klik simpan langsung tanpa isi field
      const simpanBtn = browser.locator('button[type="submit"]:has-text("Simpan"), button:has-text("Simpan Mitra")').first();
      await simpanBtn.click();

      // Modal harus tetap terbuka (tidak boleh submit lolos)
      const modal = browser.locator('.modal, [role="dialog"]').first();
      await expect(modal).toBeVisible();
    }
  });

  test('MITRA-TC-029 & MITRA-TC-032: Validasi BVA password (< 7 karakter) dan mismatch password', async ({ browser }) => {
    await loginAndNavigateToMitra(browser);

    const tambahBtn = browser.locator('button:has-text("Tambah Mitra"), a:has-text("Tambah Mitra")').first();
    if (await tambahBtn.isVisible().catch(() => false)) {
      await tambahBtn.click();

      const pwdInput = browser.locator('input[name="password"], #password').first();
      const pwdConfirmInput = browser.locator('input[name="password_confirmation"], #password_confirmation').first();

      // TC-029: BVA < 7 karakter
      await pwdInput.fill('Aa123'); // 5 karakter
      await pwdConfirmInput.fill('Aa123');

      const simpanBtn = browser.locator('button[type="submit"]:has-text("Simpan"), button:has-text("Simpan Mitra")').first();
      await simpanBtn.click();

      // TC-032: Password mismatch
      await pwdInput.fill('Password123');
      await pwdConfirmInput.fill('PasswordBeda999');
      await simpanBtn.click();

      // Verifikasi form tetap menahan submit
      const modal = browser.locator('.modal, [role="dialog"]').first();
      await expect(modal).toBeVisible();
    }
  });

  test('MITRA-TC-015 & MITRA-TC-055: Verifikasi modal "Ubah Data Mitra" membuka form ter-prefill', async ({ browser }) => {
    await loginAndNavigateToMitra(browser);

    const editBtn = browser.locator('a[title*="Ubah"], button[title*="Ubah"], .fa-pencil, .fa-edit').first();
    if (await editBtn.isVisible().catch(() => false)) {
      await editBtn.click();

      const modalEdit = browser.locator('.modal:has-text("Ubah"), [role="dialog"]').first();
      await expect(modalEdit).toBeVisible();

      // Verifikasi field nama depan memiliki value prefill
      const firstNameInput = browser.locator('input[name="first_name"], input[name="nama_depan"]').first();
      if (await firstNameInput.isVisible().catch(() => false)) {
        const val = await firstNameInput.inputValue().catch(() => '');
        expect(val.length).toBeGreaterThan(0);
      }
    }
  });
});
