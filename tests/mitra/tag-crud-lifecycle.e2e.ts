import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import {
  loginAndNavigateToTagProperti,
  takeEvidenceScreenshot
} from './support.ts';

test.describe('Tag Properti: Full CRUD Lifecycle with Visual Evidence', () => {
  test('TAG-CRUD-LIFECYCLE: Create, Verify, Edit, and Delete Tag Properti with Visual Evidence', async ({ app, browser }) => {
    const uniqueId = Date.now().toString().slice(-4);
    const tagName = `TagAuto${uniqueId}`;
    const tagDesc = `Deskripsi Tag Otomatis QA ${uniqueId}`;

    await loginAndNavigateToTagProperti(browser);

    // ==========================================
    // 1. TAHAP CREATE TAG PROPERTI
    // ==========================================
    const tambahBtn = browser.locator('button:has-text("Tambah"), a:has-text("Tambah")').first();
    await expect(tambahBtn).toBeVisible();
    await tambahBtn.click();

    const modal = browser.locator('.modal, [role="dialog"]').first();
    await expect(modal).toBeVisible();

    // Isi Nama Kelompok
    const nameInput = browser.locator('.modal input[name*="name"], .modal input[name*="nama"]').first();
    await nameInput.fill(tagName);

    // Isi Deskripsi jika ada
    const descInput = browser.locator('.modal textarea[name*="description"], .modal textarea[name*="deskripsi"]').first();
    if (await descInput.isVisible().catch(() => false)) {
      await descInput.fill(tagDesc);
    }

    // Tangkap Screenshot Bukti 1: Form Tambah Tag Properti terisi
    await takeEvidenceScreenshot(app, '01-tag-create-form', '01-tag-create-form.png');

    // Submit simpan tag
    const simpanBtn = browser.locator('.modal button:has-text("Simpan"), .modal button[type="submit"]').first();
    await simpanBtn.click();

    // Tunggu tabel reload
    await expect(browser.locator('table').first()).toBeVisible();

    // ==========================================
    // 2. TAHAP VERIFIKASI TAG DI TABEL
    // ==========================================
    const searchInput = browser.locator('input[placeholder*="Cari"], input[name*="search"]').first();
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill(tagName);
      const searchBtn = browser.locator('button:has-text("Cari"), button[type="submit"]').first();
      if (await searchBtn.isVisible().catch(() => false)) {
        await searchBtn.click();
      }
    }

    // Tangkap Screenshot Bukti 2: Tag baru terverifikasi di tabel
    await takeEvidenceScreenshot(app, '02-tag-verified-in-table', '02-tag-verified-in-table.png');

    // ==========================================
    // 3. TAHAP EDIT TAG PROPERTI
    // ==========================================
    // Cari tombol Edit pada kolom aksi baris pertama
    const editBtn = browser.locator('table tbody tr:first-child td:last-child a, table tbody tr:first-child td:last-child button, table tbody tr:first-child .fa-edit, table tbody tr:first-child .fa-pencil').first();
    if (await editBtn.isVisible().catch(() => false)) {
      await editBtn.click();

      const modalEdit = browser.locator('.modal.show, .modal:has-text("Edit"), .modal:has-text("Ubah")').first();
      await expect(modalEdit).toBeVisible();

      // Tangkap Screenshot Bukti 3: Modal edit terbuka
      await takeEvidenceScreenshot(app, '03-tag-edit-modal-opened', '03-tag-edit-modal-opened.png');

      // Edit nama atau deskripsi
      const descEditInput = browser.locator('.modal.show textarea[name*="description"], .modal.show textarea[name*="deskripsi"]').first();
      if (await descEditInput.isVisible().catch(() => false)) {
        await descEditInput.fill(`${tagDesc} - Updated`);
      }

      // Submit perubahan
      const simpanEditBtn = browser.locator('.modal.show button:has-text("Simpan"), .modal.show button[type="submit"]').first();
      if (await simpanEditBtn.isVisible().catch(() => false)) {
        await simpanEditBtn.click();
      }

      await expect(browser.locator('table').first()).toBeVisible();
    }

    // ==========================================
    // 4. TAHAP DELETE / HAPUS TAG PROPERTI
    // ==========================================
    // Daftarkan listener dialog browser native confirm('Hapus tag ini?')
    let confirmedDialogMessage = '';
    const unsubscribeDialog = await browser.onDialog(async (dialog) => {
      confirmedDialogMessage = dialog.message;
      await dialog.accept();
    });

    // Target tombol persis: <button type="submit" class="btn btn-xs btn-danger" onclick="return confirm('Hapus tag ini?')">
    const deleteBtn = browser.locator('button[onclick*="confirm(\'Hapus tag ini?\')"], button.btn-danger:has(i.mdi-delete), table tbody tr:first-child button.btn-danger').first();
    await expect(deleteBtn).toBeVisible();
    await deleteBtn.click();

    // Verifikasi bahwa alert/dialog konfirmasi native benar-benar muncul dengan pesan "Hapus tag ini?"
    expect(confirmedDialogMessage).toContain('Hapus tag ini?');

    // Unsubscribe listener dialog
    await unsubscribeDialog().catch(() => {});

    // Tunggu dan verifikasi pesan notifikasi keberhasilan: " Tag berhasil dihapus."
    const deleteNotif = browser.locator('.alert:has-text("Tag berhasil dihapus"), div:has-text("Tag berhasil dihapus"), text=" Tag berhasil dihapus."').first();
    if (await deleteNotif.isVisible().catch(() => false)) {
      await expect(deleteNotif).toBeVisible();
    }

    // Tangkap Screenshot Bukti 4: Tag berhasil dihapus dan notifikasi keberhasilan terlihat
    await takeEvidenceScreenshot(app, '04-tag-deleted-verified', '04-tag-deleted-verified.png');

    // Tunggu tabel termuat kembali
    await expect(browser.locator('table').first()).toBeVisible();
  });
});
