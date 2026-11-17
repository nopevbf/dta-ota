# Laporan Eksekusi Pengujian: Menu Laporan Pendapatan Mitra

- **Aplikasi / Modul**: Sistem Manajemen D'Paragon - Menu Laporan Pendapatan Mitra
- **Target URL**: `https://management.dp7.lab.daegi.dev/partner/reports/revenue?page=1`
- **Tanggal Eksekusi**: 16 November 2026
- **Test Runner Framework**: `@e2e-dev/web` & `e2e` v0.19.0 (Agentic AI E2E Framework)
- **Status Eksekusi**: **PASSED (100% Pass Rate)**

---

## 1. Ringkasan Eksekusi (Execution Summary)

| Metrik | Nilai | Keterangan |
| :--- | :---: | :--- |
| **Total Test Suites** | 5 | Mencakup seluruh elemen & alur kerja menu laporan pendapatan |
| **Total Test Cases Teruji** | 26 | Berdasarkan spesifikasi ISTQB `REV-TC-001` s.d `REV-TC-026` |
| **Passed** | **5 / 5 Suites (26/26 TC)** | Seluruh assertion dan transisi status sistem tervalidasi sukses |
| **Failed** | 0 | Tidak ada kegagalan fungsi atau regression defect |
| **Pass Rate** | **100%** | Tingkat keberhasilan penuh |
| **Total Waktu Eksekusi** | ~5m 36s | Menjalankan browser otomatis headless chromium |

---

## 2. Rincian Hasil Pengujian per Test Suite

### 1. Suite: Header, Breadcrumbs & 4 Kartu Ringkasan Finansial
- **Cakupan Test Case**: `REV-TC-001` - `REV-TC-005`
- **Status**: **PASSED** (Durasi: 57.43s)
- **Verifikasi**:
  - Judul `Daftar Laporan Pendapatan` dan deskripsi subjudul tampil konsisten.
  - Hirarki breadcrumb `Mitra > Laporan Pendapatan` terpasang benar.
  - Kartu ringkasan finansial tampil lengkap dengan format mata uang:
    - `PENDAPATAN KOTOR`
    - `TOTAL KOMISI OTA`
    - `TOTAL BERSIH MITRA`
    - `BELUM ADA RESERVASI`
- **Bukti Pengujian**: `reports/revenue/screenshots/001-01-header-summary-cards.png`

### 2. Suite: Interaktivitas Form Filter, Search & Reset
- **Cakupan Test Case**: `REV-TC-006` - `REV-TC-014`, `REV-TC-025`
- **Status**: **PASSED** (Durasi: 77.58s)
- **Verifikasi**:
  - Tombol accordion `Toggle Filter` membuka dan menutup formulir pencarian secara responsif.
  - Input `Cari Properti / Mitra` (`search`), `Range Tanggal` (`dates`), Select `Kelompok / Tag` (`tag`), `Kota / Wilayah` (`city`), dan `Urutan` (`sort_by`) terpasang lengkap.
  - Format default range tanggal terverifikasi sesuai format final `MM/DD/YYYY - MM/DD/YYYY` (`11/01/2026 - 11/30/2026`).
  - Pencarian kata kunci negatif (`KEYWORD_TIDAK_ADA_9999`) berhasil ditangani secara anggun tanpa crash.
  - Tombol `Reset` berhasil merestorasi form filter dan data tabel ke status awal.
- **Bukti Pengujian**: `reports/revenue/screenshots/001-02-filter-operations.png`

### 3. Suite: Struktur 10 Kolom Tabel Data & Integritas Formula Finansial
- **Cakupan Test Case**: `REV-TC-015` - `REV-TC-018`
- **Status**: **PASSED** (Durasi: 62.08s)
- **Verifikasi**:
  - Header tabel laporan utama memuat tepat 10 kolom:
    1. `No`
    2. `Nama Properti`
    3. `Mitra`
    4. `Kelompok`
    5. `Pendapatan Kotor`
    6. `Komisi OTA (%)`
    7. `Komisi OTA (Rp)`
    8. `Pendapatan Bersih`
    9. `Status`
    10. `Aksi`
  - Formula integritas finansial tervalidasi akurat:
    $$\text{Pendapatan Kotor} = \text{Komisi OTA (Rp)} + \text{Pendapatan Bersih}$$
  - Badge tag kelompok kerjasama dan status reservasi tampil proporsional.
- **Bukti Pengujian**: `reports/revenue/screenshots/001-03-table-and-badges.png`

### 4. Suite: Tombol Aksi & Navigasi ke Rincian Pendapatan Mitra
- **Cakupan Test Case**: `REV-TC-019` & `REV-TC-020`
- **Status**: **PASSED** (Durasi: 69.47s)
- **Verifikasi**:
  - Tautan tombol aksi `Lihat Rincian Pendapatan` mengarah ke `/partner/reports/revenue/{id}`.
  - Klik pada tautan berhasil memuat halaman rincian transaksi mitra terkait tanpa error HTTP 404 atau fatal 500.
- **Bukti Pengujian**: `reports/revenue/screenshots/001-04-revenue-detail-page.png`

### 5. Suite: Tombol Ekspor Dokumen (Excel & PDF) dan Navigasi Pagination
- **Cakupan Test Case**: `REV-TC-021` - `REV-TC-024`, `REV-TC-026`
- **Status**: **PASSED** (Durasi: 67.44s)
- **Verifikasi**:
  - Tombol ekspor Excel mengarah ke endpoint valid `/partner/reports/revenue/export/excel?page=1`.
  - Tombol ekspor PDF mengarah ke endpoint valid `/partner/reports/revenue/export/pdf?page=1`.
  - Tombol pagination `« Previous` dalam status disabled pada boundary halaman pertama (`?page=1`).
  - Navigasi ke halaman kedua (`?page=2`) berhasil memuat batch data lanjutan dengan parameter URL yang konsisten.
- **Bukti Pengujian**: `reports/revenue/screenshots/001-05-export-and-pagination.png`

---

## 3. Perintah Eksekusi Otomatis

Untuk menjalankan ulang pengujian ini di lingkungan CI/CD atau terminal:
```bash
pnpm test:report:revenue
```
