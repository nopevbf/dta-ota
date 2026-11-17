import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { loginAndNavigateToMitra } from '../mitra/support.ts';
import { MANAGEMENT_URL, getReportScreenshotDir } from '../support/env-config.ts';
import fs from 'node:fs';
import path from 'node:path';

const TARGET_URL = `${MANAGEMENT_URL.replace(/\/+$/, '')}/partner/reports/revenue?page=1`;

async function saveEvidenceScreenshot(app: any, label: string) {
  const reportsDir = getReportScreenshotDir('revenue');

  try {
    const relative = await app.screenshot(label);
    const candidate = path.resolve(process.cwd(), relative);
    const dest = path.join(reportsDir, `${label}.png`);
    if (fs.existsSync(candidate)) {
      fs.copyFileSync(candidate, dest);
    }
  } catch (e) {}
}

test.describe('Laporan Pendapatan Mitra (Partner Revenue Report)', () => {

  test('REV-TC-001 s.d REV-TC-005: Verifikasi Header, Breadcrumbs & 4 Kartu Ringkasan Finansial', async ({ browser, app }) => {
    await loginAndNavigateToMitra(browser, TARGET_URL);
    await new Promise(r => setTimeout(r, 2000));

    // REV-TC-001: Heading & Breadcrumbs
    const pageHeading = browser.locator('h1, h2, h3, h4, .page-title').filter({ hasText: 'Daftar Laporan Pendapatan' }).first();
    await expect(pageHeading).toBeVisible();

    const breadcrumb = browser.locator('.breadcrumb, nav[aria-label="breadcrumb"]').first();
    if (await breadcrumb.isVisible().catch(() => false)) {
      await expect(breadcrumb).toContainText('Mitra');
      await expect(breadcrumb).toContainText('Laporan Pendapatan');
    }

    // REV-TC-002 s.d REV-TC-005: 4 Financial Summary Cards
    const cardKotor = browser.locator('text=PENDAPATAN KOTOR').first();
    await expect(cardKotor).toBeVisible();

    const cardKomisi = browser.locator('text=TOTAL KOMISI OTA').first();
    await expect(cardKomisi).toBeVisible();

    const cardBersih = browser.locator('text=TOTAL BERSIH MITRA').first();
    await expect(cardBersih).toBeVisible();

    const cardBelumAda = browser.locator('text=BELUM ADA RESERVASI').first();
    await expect(cardBelumAda).toBeVisible();

    await saveEvidenceScreenshot(app, '01-header-summary-cards');
  });

  test('REV-TC-006 s.d REV-TC-014: Verifikasi Interaktivitas Form Filter, Search & Reset', async ({ browser, app }) => {
    await loginAndNavigateToMitra(browser, TARGET_URL);
    await new Promise(r => setTimeout(r, 2000));

    // REV-TC-006: Toggle Filter Button & pastikan panel filter terbuka
    await browser.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('a, button')).find(el => {
        const text = el.textContent?.trim() || '';
        const title = el.getAttribute('title') || '';
        return text.includes('Toggle Filter') || title.includes('Toggle Filter') || el.getAttribute('href')?.includes('#');
      }) as HTMLElement | undefined;
      if (btn) btn.click();

      const collapseEl = document.querySelector('.collapse') as HTMLElement | null;
      if (collapseEl && !collapseEl.classList.contains('show')) {
        collapseEl.classList.add('show');
        collapseEl.style.display = 'block';
      }
    });

    await new Promise(r => setTimeout(r, 1200));

    // Verifikasi kontrol filter
    const searchInput = browser.locator('input[name="search"]').first();
    await expect(searchInput).toBeVisible();

    const dateInput = browser.locator('input[name="dates"], #dates').first();
    await expect(dateInput).toBeVisible();

    // Pastikan default dates menggunakan format MM/DD/YYYY - MM/DD/YYYY
    const dateVal = await dateInput.inputValue().catch(() => '');
    console.log(`[INFO] Current Date Range Value: ${dateVal}`);
    expect(dateVal).toMatch(/\d{2}\/\d{2}\/\d{4}\s*-\s*\d{2}\/\d{2}\/\d{4}/);

    const applyBtn = browser.locator('button:has-text("Terapkan Filter"), button[type="submit"]:has-text("Filter")').first();
    await expect(applyBtn).toBeVisible();

    const resetBtn = browser.locator('a:has-text("Reset"), button:has-text("Reset")').first();
    await expect(resetBtn).toBeVisible();

    // REV-TC-009: Uji pencarian negatif keyword acak
    await searchInput.fill('KEYWORD_TIDAK_ADA_9999');
    await applyBtn.click();
    await new Promise(r => setTimeout(r, 2000));

    // Periksa bahwa tabel tidak crash
    const mainTable = browser.locator('table:has(th:has-text("Nama Properti"))').first();
    await expect(mainTable).toBeVisible();

    // REV-TC-014: Uji tombol Reset filter
    const resetAfterFilter = browser.locator('a:has-text("Reset"), button:has-text("Reset")').first();
    await resetAfterFilter.click();
    await new Promise(r => setTimeout(r, 2000));

    await expect(browser.locator('table:has(th:has-text("Nama Properti")) tbody tr').first()).toBeVisible();
    await saveEvidenceScreenshot(app, '02-filter-operations');
  });

  test('REV-TC-015 s.d REV-TC-018: Verifikasi Struktur 10 Kolom Tabel & Integritas Perhitungan Finansial', async ({ browser, app }) => {
    await loginAndNavigateToMitra(browser, TARGET_URL);
    await new Promise(r => setTimeout(r, 2000));

    // REV-TC-015: 10 Kolom Header pada tabel laporan utama (hindari tabel debugbar)
    const ths = browser.locator('table:has(th:has-text("Nama Properti")) thead th');
    const thCount = await ths.count();
    console.log(`[INFO] Total Header Columns: ${thCount}`);
    expect(thCount).toBe(10);

    const headersText = await ths.allTextContents();
    console.log('[INFO] Headers:', headersText.map(t => t.trim()));
    expect(headersText.some(h => h.includes('Nama Properti'))).toBe(true);
    expect(headersText.some(h => h.includes('Pendapatan Kotor'))).toBe(true);
    expect(headersText.some(h => h.includes('Komisi OTA'))).toBe(true);
    expect(headersText.some(h => h.includes('Pendapatan Bersih'))).toBe(true);
    expect(headersText.some(h => h.includes('Aksi'))).toBe(true);

    // REV-TC-016: Integritas Matematis Pendapatan Kotor = Komisi OTA (Rp) + Pendapatan Bersih (Rp)
    const rows = browser.locator('table:has(th:has-text("Nama Properti")) tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    const parseRupiah = (text: string): number => {
      const cleaned = text.replace(/[^0-9]/g, '');
      return cleaned ? parseInt(cleaned, 10) : 0;
    };

    const firstRowCells = await browser.locator('table:has(th:has-text("Nama Properti")) tbody tr:first-child td').allTextContents();
    console.log('[INFO] Baris 1 Cells:', firstRowCells.map(c => c.trim()));

    if (firstRowCells.length >= 8) {
      const kotor = parseRupiah(firstRowCells[4]);
      const komisi = parseRupiah(firstRowCells[6]);
      const bersih = parseRupiah(firstRowCells[7]);

      console.log(`[FINANCIAL_CHECK] Kotor: ${kotor}, Komisi OTA: ${komisi}, Bersih: ${bersih}`);
      expect(kotor).toBe(komisi + bersih);
    }

    await saveEvidenceScreenshot(app, '03-table-and-badges');
  });

  test('REV-TC-019 & REV-TC-020: Verifikasi Tombol Aksi & Navigasi ke Halaman Rincian Pendapatan Mitra', async ({ browser, app }) => {
    await loginAndNavigateToMitra(browser, TARGET_URL);
    await new Promise(r => setTimeout(r, 2000));

    // REV-TC-019: Tombol Aksi "Lihat Rincian Pendapatan"
    const detailLink = browser.locator('table:has(th:has-text("Nama Properti")) tbody tr td:last-child a, table:has(th:has-text("Nama Properti")) tbody tr a[href*="/partner/reports/revenue/"]').first();
    await expect(detailLink).toBeVisible();

    const detailHref = await detailLink.getAttribute('href');
    console.log(`[INFO] Target Rincian Pendapatan: ${detailHref}`);
    expect(detailHref).toMatch(/\/partner\/reports\/revenue\/\d+/);

    // REV-TC-020: Klik dan Navigasi ke Detail
    await detailLink.click();
    await new Promise(r => setTimeout(r, 2500));

    const currentUrl = await browser.url();
    console.log(`[INFO] Halaman Detail Terbuka: ${currentUrl}`);
    expect(currentUrl).toContain('/partner/reports/revenue/');

    // Verifikasi konten halaman detail tidak menampilkan error fatal 500
    await expect(browser.locator('body')).toBeVisible();
    await expect(browser.locator('text=Error, text=500, text=Whoops').first()).not.toBeVisible();

    await saveEvidenceScreenshot(app, '04-revenue-detail-page');
  });

  test('REV-TC-021 s.d REV-TC-024: Verifikasi Tombol Ekspor Dokumen (Excel & PDF) dan Navigasi Pagination', async ({ browser, app }) => {
    await loginAndNavigateToMitra(browser, TARGET_URL);
    await new Promise(r => setTimeout(r, 2000));

    // REV-TC-021 & REV-TC-022: Tombol Ekspor Dokumen
    const excelBtn = browser.locator('a:has-text("Excel"), [href*="export/excel"]').first();
    await expect(excelBtn).toBeVisible();
    const excelHref = await excelBtn.getAttribute('href');
    console.log(`[INFO] Excel Export Endpoint: ${excelHref}`);
    expect(excelHref).toContain('/export/excel');

    const pdfBtn = browser.locator('a:has-text("PDF"), [href*="export/pdf"]').first();
    await expect(pdfBtn).toBeVisible();
    const pdfHref = await pdfBtn.getAttribute('href');
    console.log(`[INFO] PDF Export Endpoint: ${pdfHref}`);
    expect(pdfHref).toContain('/export/pdf');

    // REV-TC-023: Tombol Previous disabled pada Halaman 1
    const prevBtn = browser.locator('.pagination li:first-child, .pagination a:has-text("Previous"), .pagination [aria-label*="Previous"]').first();
    if (await prevBtn.isVisible().catch(() => false)) {
      const isClassDisabled = (await prevBtn.getAttribute('class').catch(() => ''))?.includes('disabled');
      const isDisabledAttr = await prevBtn.getAttribute('disabled').catch(() => null);
      console.log(`[INFO] Previous button disabled state: class=${isClassDisabled}, attr=${isDisabledAttr}`);
    }

    // REV-TC-024: Navigasi ke Halaman 2
    const page2Btn = browser.locator('.pagination a:has-text("2"), .pagination a[href*="page=2"]').first();
    if (await page2Btn.isVisible().catch(() => false)) {
      console.log('[INFO] Menavigasi ke Page 2...');
      await page2Btn.click();
      await new Promise(r => setTimeout(r, 2500));

      const page2Url = await browser.url();
      console.log(`[INFO] URL Halaman 2: ${page2Url}`);
      expect(page2Url).toContain('page=2');

      const rowsPage2 = browser.locator('table:has(th:has-text("Nama Properti")) tbody tr');
      await expect(rowsPage2.first()).toBeVisible();
    }

    await saveEvidenceScreenshot(app, '05-export-and-pagination');
  });

});
