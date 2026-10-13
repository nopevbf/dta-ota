import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import {
  loginAndNavigateToBumd,
  fillTab1,
  fillTab2,
  fillTab3,
  navigateToTab4,
  submitWizardForm,
  takeEvidenceScreenshot,
} from './support.ts';

test.describe('Bank Data BUMD: End-to-End CRUD Lifecycle with Visual Evidence', () => {
  test('BUMD-CRUD-LIFECYCLE: Create, Verify in Table, Update, and Delete BUMD with Visual Evidence', async ({ app, browser }) => {
    const uniqueId = Date.now().toString().slice(-6);
    const testCompanyName = `PT BUMD AutoTest ${uniqueId}`;

    // ==========================================
    // 1. TAHAP CREATE & VERIFY
    // ==========================================
    await loginAndNavigateToBumd(browser, '/partner/finance/bumd/create');

    // Tab 1: Identitas Perusahaan
    await fillTab1(browser, testCompanyName, uniqueId);
    await browser.locator('#tab-perusahaan .next-tab').click();

    // Tab 2: Identitas Penanggungjawab
    await fillTab2(browser, uniqueId);
    await browser.locator('#tab-pj .next-tab').click();

    // Tab 3: Identitas Pimpinan
    await fillTab3(browser, uniqueId);
    await browser.locator('#tab-pimpinan .next-tab').click();

    // Tab 4: Fee BUMD
    const feeMgmtInput = browser.locator('input[name="fee_management"]');
    const feeBumdInput = browser.locator('input[name="fee_bumd"]');
    await feeMgmtInput.fill('15');
    await feeBumdInput.fill('10');

    // Tangkap Screenshot Bukti 1: Form Create lengkap di Tab 4
    await takeEvidenceScreenshot(app, '01-create-wizard-tab4-filled', '01-create-wizard-tab4-filled.png');

    // Submit Form Tambah BUMD
    await submitWizardForm(browser);

    // Tunggu redirect kembali ke halaman tabel BUMD (timeout 30s)
    await browser.waitForURL(/.*\/partner\/finance\/bumd$/, { timeout: 30000 });
    const feeMgmtHeader = browser.locator('th:has-text("Fee Management")');
    await expect(feeMgmtHeader).toBeVisible();

    // Tangkap Screenshot Bukti 2: Data baru berhasil dibuat dan tampil di tabel
    await takeEvidenceScreenshot(app, '02-create-verified-in-table', '02-create-verified-in-table.png');

    // Verifikasi data baru muncul di tabel beserta nilai Fee
    const rowSelector = `tr:has-text("${testCompanyName}")`;
    await expect.poll(async () => await browser.locator(rowSelector).count()).toBeGreaterThan(0);
    await expect(browser.locator(`${rowSelector} td:has-text("15%")`).first()).toBeVisible();
    await expect(browser.locator(`${rowSelector} td:has-text("10%")`).first()).toBeVisible();

    // ==========================================
    // 2. TAHAP UPDATE & VERIFY
    // ==========================================
    // Klik tombol edit dari baris data yang baru dibuat
    const editBtn = browser.locator(`${rowSelector} a[href*="/edit"]`).first();
    await editBtn.click();

    // Tunggu halaman form edit terbuka
    await browser.waitForURL(/.*\/edit.*/, { timeout: 30000 });
    await expect.poll(async () => await browser.locator('input[name="company_name"]').isVisible()).toBe(true);

    // Tangkap Screenshot Bukti 3: Halaman form edit berhasil dibuka
    await takeEvidenceScreenshot(app, '03-edit-form-opened', '03-edit-form-opened.png');

    // Ubah data nomor telepon perusahaan di Tab 1
    const updatedPhone = '081299998888';
    await browser.locator('input[name="phone"]').fill(updatedPhone);

    // Navigasi deterministik ke Tab 4 Fee BUMD untuk memodifikasi Fee
    await navigateToTab4(browser);

    // Perbarui nilai Fee BUMD menjadi 12% jika input fee tersedia
    const updateFeeBumd = browser.locator('input[name="fee_bumd"]');
    if (await updateFeeBumd.isVisible().catch(() => false)) {
      await updateFeeBumd.fill('12');
    }

    // Simpan pembaruan data edit
    await submitWizardForm(browser);

    // Tunggu redirect kembali ke list BUMD
    await browser.waitForURL(/.*\/partner\/finance\/bumd$/, { timeout: 30000 });
    await expect(feeMgmtHeader).toBeVisible();

    // Tangkap Screenshot Bukti 4: Data ter-update terverifikasi di tabel
    await takeEvidenceScreenshot(app, '04-update-verified-in-table', '04-update-verified-in-table.png');

    // Verifikasi data nomor telepon yang diperbarui terlihat di baris tabel
    await expect.poll(async () => await browser.locator(rowSelector).count()).toBeGreaterThan(0);
    await expect(browser.locator(`${rowSelector} td:has-text("${updatedPhone}")`).first()).toBeVisible();

    // ==========================================
    // 3. TAHAP DELETE & TEARDOWN VERIFICATION
    // ==========================================
    // Siapkan handler dialog konfirmasi browser confirm()
    await browser.onDialog(async (dialog) => {
      await dialog.accept();
    });

    // Tangkap Screenshot Bukti 5: Sebelum menghapus data
    await takeEvidenceScreenshot(app, '05-delete-confirmation-dialog', '05-delete-confirmation-dialog.png');

    // Klik tombol delete dari baris data yang telah di-update
    const deleteBtn = browser.locator(`${rowSelector} td:last-child button, ${rowSelector} td:last-child a.btn-danger, ${rowSelector} form button`).first();
    await deleteBtn.click();

    // Tunggu jika ada modal konfirmasi SweetAlert2
    const swalModal = browser.locator('.swal2-modal, .swal2-popup');
    if (await expect.poll(async () => await swalModal.isVisible().catch(() => false)).toBe(true).catch(() => false)) {
      const confirmDeleteBtn = browser.locator('.swal2-confirm, button:has-text("Ya"), button:has-text("Hapus")').first();
      await confirmDeleteBtn.click().catch(() => {});
    }

    // Tunggu alert / reload selesai
    await browser.waitForURL(/.*\/partner\/finance\/bumd.*/, { timeout: 15000 }).catch(() => {});
    await browser.goto('https://management.dparagon7.persona-it.com/partner/finance/bumd');
    await expect(feeMgmtHeader).toBeVisible();

    // Tangkap Screenshot Bukti 6: Data terverifikasi telah dihapus dari tabel
    await takeEvidenceScreenshot(app, '06-delete-verified-removed', '06-delete-verified-removed.png');

    // Verifikasi bahwa data BUMD tersebut sudah tidak lagi ada di tabel
    await expect.poll(async () => await browser.locator(rowSelector).count()).toBe(0);
  });
});
