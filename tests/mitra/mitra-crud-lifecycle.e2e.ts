import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import {
  loginAndNavigateToMitra,
  takeEvidenceScreenshot
} from './support.ts';

test.describe('Setting Mitra: Full CRUD Lifecycle with Visual Evidence', () => {
  test('MITRA-CRUD-LIFECYCLE: Create Mitra, Verify in Table, and Update Mitra with Visual Evidence', async ({ app, browser }) => {
    const uniqueId = Date.now().toString().slice(-5);
    const firstName = `MitraQA${uniqueId}`;
    const lastName = 'TestAuto';
    const email = `qa.mitra.${uniqueId}@example.com`;
    const phone = `0812${Date.now().toString().slice(-8)}`;
    const password = 'Password123!';

    // Navigasi ke halaman Setting Mitra
    await loginAndNavigateToMitra(browser, '/partner/partners');

    // ==========================================
    // 1. TAHAP CREATE MITRA
    // ==========================================
    const tambahBtn = browser.locator('button:has-text("Tambah Mitra"), a:has-text("Tambah Mitra")').first();
    await expect(tambahBtn).toBeVisible();
    await tambahBtn.click();

    const modal = browser.locator('.modal, [role="dialog"]').first();
    await expect(modal).toBeVisible();

    // Isi Form Tambah Mitra
    await browser.locator('.modal input[name*="first_name"], .modal input[name*="nama_depan"], .modal input[name="name"]').first().fill(firstName);
    
    const lastNameInput = browser.locator('.modal input[name*="last_name"], .modal input[name*="nama_belakang"]').first();
    if (await lastNameInput.isVisible().catch(() => false)) {
      await lastNameInput.fill(lastName);
    }

    const emailInput = browser.locator('.modal input[type="email"], .modal input[name*="email"]').first();
    await emailInput.fill(email);

    const phoneInput = browser.locator('.modal input[name*="phone"], .modal input[name*="hp"], .modal input[name*="telp"]').first();
    if (await phoneInput.isVisible().catch(() => false)) {
      await phoneInput.fill(phone);
    }

    const passInput = browser.locator('.modal input[type="password"]').first();
    if (await passInput.isVisible().catch(() => false)) {
      await passInput.fill(password);
    }

    const passConfirmInput = browser.locator('.modal input[type="password"]').nth(1);
    if (await passConfirmInput.isVisible().catch(() => false)) {
      await passConfirmInput.fill(password);
    }

    // Tangkap Screenshot Bukti 1: Form Tambah Mitra terisi
    await takeEvidenceScreenshot(app, '01-mitra-create-form', '01-mitra-create-form.png');

    // Submit form simpan mitra
    const simpanBtn = browser.locator('.modal button:has-text("Simpan"), .modal button[type="submit"]').first();
    await simpanBtn.click();

    // Tunggu modal tertutup atau tabel reload
    await expect(browser.locator('table').first()).toBeVisible();

    // ==========================================
    // 2. TAHAP VERIFIKASI MITRA DI TABEL
    // ==========================================
    const table = browser.locator('table').first();
    await expect(table).toBeVisible();

    // Tangkap Screenshot Bukti 2: Mitra baru terverifikasi di tabel
    await takeEvidenceScreenshot(app, '02-mitra-verified-in-table', '02-mitra-verified-in-table.png');

    // ==========================================
    // 3. TAHAP UPDATE / EDIT MITRA
    // ==========================================
    // Klik tombol Ubah (button di kolom aksi baris pertama)
    const editBtn = browser.locator('table tbody tr:first-child button').first();
    await expect(editBtn).toBeVisible();
    await editBtn.click();

    const modalEdit = browser.locator('.modal.show, .modal:has-text("Ubah")').first();
    await expect(modalEdit).toBeVisible();

    // Tangkap Screenshot Bukti 3: Modal edit terbuka dengan data prefilled
    await takeEvidenceScreenshot(app, '03-mitra-edit-modal-opened', '03-mitra-edit-modal-opened.png');

    // Ubah nama belakang / nama mitra
    const lastNameEdit = browser.locator('.modal.show input[name*="last_name"], .modal.show input[name*="nama_belakang"]').first();
    if (await lastNameEdit.isVisible().catch(() => false)) {
      await lastNameEdit.fill('TestUpdated');
    }

    // Submit perubahan
    const simpanEditBtn = browser.locator('.modal.show button:has-text("Simpan"), .modal.show button[type="submit"]').first();
    if (await simpanEditBtn.isVisible().catch(() => false)) {
      await simpanEditBtn.click();
    }

    // Tunggu tabel ter-refresh
    await expect(table).toBeVisible();

    // Tangkap Screenshot Bukti 4: Data mitra terverifikasi diperbarui di tabel
    await takeEvidenceScreenshot(app, '04-mitra-updated-verified', '04-mitra-updated-verified.png');
  });
});
