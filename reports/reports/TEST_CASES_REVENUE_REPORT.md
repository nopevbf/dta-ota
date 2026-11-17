# Dokumen Spesifikasi Test Case: Laporan Pendapatan Mitra (ISTQB Standard)

- **Aplikasi / Modul**: Sistem Manajemen D'Paragon - Menu Laporan Pendapatan Mitra (Partner Revenue Report)
- **Target URL**: `https://management.dp7.lab.daegi.dev/partner/reports/revenue?page=1`
- **Tingkat Pengujian (Test Level)**: System Testing & End-to-End (E2E) Testing
- **Standar Format**: ISTQB (International Software Testing Qualifications Board) — ISO/IEC/IEEE 29119-3
- **Teknik Pengujian Digunakan**:
  - **Equivalence Partitioning (EP)**: Validasi partisi input valid dan invalid pada filter pencarian, rentang tanggal, dan select kriteria.
  - **Boundary Value Analysis (BVA)**: Validasi batas navigasi pagination (halaman 1 batas bawah, tombol Previous disabled) dan rentang tanggal (awal bulan s.d akhir bulan).
  - **Decision Table Testing (DT)**: Validasi kombinasi logika AND pada multi-filter (Search + Range Tanggal + Tag + Kota + Sort) dan rumus integritas finansial (*Pendapatan Kotor = Komisi OTA + Pendapatan Bersih*).
  - **State Transition Testing (ST)**: Siklus buka/tutup (*Toggle*) filter, aktivasi/reset filter, transisi navigasi halaman pagination, serta navigasi ke halaman rincian transaksi (`/partner/reports/revenue/{id}`).
  - **Use Case Testing (UC)**: Alur kerja operasional Super Admin / Manajemen dalam meninjau laporan pendapatan mitra dan mengekspor dokumen laporan ke format Excel/PDF.
  - **GUI Verification & Data Integrity**: Verifikasi kelengkapan 4 kartu ringkasan finansial, format mata uang (Rupiah), konsistensi 10 header kolom tabel, badge tag kerjasama, dan status reservasi.

---

## 1. Ringkasan Eksekutif & RTM (Requirement Traceability Matrix)

| Test Suite / Area | Rentang Test Case ID | Total TC | Teknik ISTQB | Prioritas Utama |
| :--- | :--- | :---: | :--- | :---: |
| **Suite 1: Header, Breadcrumbs & 4 Summary Cards** | `REV-TC-001` - `REV-TC-005` | 5 | GUI / EP / Integrity | High |
| **Suite 2: Formulir Filter & Pengurutan (Sorting)** | `REV-TC-006` - `REV-TC-014` | 9 | EP / BVA / DT / ST | High |
| **Suite 3: Tabel Data & Integritas Finansial (10 Kolom)** | `REV-TC-015` - `REV-TC-018` | 4 | Schema / Decision Table | Critical |
| **Suite 4: Navigasi Aksi Rincian Pendapatan Mitra** | `REV-TC-019` - `REV-TC-020` | 2 | Use Case / State Transition | High |
| **Suite 5: Fitur Ekspor Dokumen Laporan (Excel & PDF)** | `REV-TC-021` - `REV-TC-022` | 2 | Functional / Export / HTTP Status | High |
| **Suite 6: Navigasi Pagination & Resiliensi URL** | `REV-TC-023` - `REV-TC-026` | 4 | BVA / ST / Error Guessing | Medium |
| **TOTAL TEST CASES** | | **26** | | |

---

## 2. Test Suite 1: Header, Breadcrumbs & 4 Kartu Ringkasan Finansial

| Test Case ID | Test Objective / Skenario | Preconditions | Langkah Pengujian (Test Steps) | Test Data | Hasil yang Diharapkan (Expected Result) | Teknik ISTQB | Prioritas | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **REV-TC-001** | Verifikasi tampilan judul halaman, subjudul, dan breadcrumb navigasi | Login sebagai Manajemen (`superadmin@dparagon.com`), berada di `/partner/reports/revenue` | 1. Buka halaman Laporan Pendapatan.<br>2. Periksa heading judul halaman.<br>3. Periksa deskripsi subjudul.<br>4. Periksa tautan breadcrumb. | URL: `/partner/reports/revenue?page=1` | - Judul menampilkan "Daftar Laporan Pendapatan".<br>- Subjudul memuat teks "Rekap pendapatan kotor, komisi OTA & pendapatan bersih tiap mitra".<br>- Breadcrumb memuat hirarki: `Mitra > Laporan Pendapatan`. | GUI Verification | High | Major |
| **REV-TC-002** | Validasi visualisasi dan format kartu "PENDAPATAN KOTOR" | Berada pada halaman laporan | 1. Amati widget kartu ringkasan 1.<br>2. Periksa label judul kartu.<br>3. Validasi format nilai nominal. | Label: `PENDAPATAN KOTOR` | Kartu menampilkan label "PENDAPATAN KOTOR" dengan format mata uang yang valid (contoh: `Rp 0` atau `Rp X.XXX.XXX`). | GUI / EP | High | Major |
| **REV-TC-003** | Validasi visualisasi dan format kartu "TOTAL KOMISI OTA" | Berada pada halaman laporan | 1. Amati widget kartu ringkasan 2.<br>2. Periksa label judul kartu.<br>3. Validasi format nilai nominal. | Label: `TOTAL KOMISI OTA` | Kartu menampilkan label "TOTAL KOMISI OTA" dengan format mata uang yang valid (contoh: `Rp 0` atau `Rp X.XXX.XXX`). | GUI / EP | High | Major |
| **REV-TC-004** | Validasi visualisasi dan format kartu "TOTAL BERSIH MITRA" | Berada pada halaman laporan | 1. Amati widget kartu ringkasan 3.<br>2. Periksa label judul kartu.<br>3. Validasi format nilai nominal. | Label: `TOTAL BERSIH MITRA` | Kartu menampilkan label "TOTAL BERSIH MITRA" dengan format mata uang yang valid (contoh: `Rp 0` atau `Rp X.XXX.XXX`). | GUI / EP | High | Major |
| **REV-TC-005** | Validasi kartu counter "BELUM ADA RESERVASI" | Berada pada halaman laporan | 1. Amati widget kartu ringkasan 4.<br>2. Periksa label judul kartu.<br>3. Validasi angka counter mitra tanpa reservasi. | Label: `BELUM ADA RESERVASI` | Kartu menampilkan label "BELUM ADA RESERVASI" dengan nilai counter numerik non-negatif (contoh: `15`). | Integrity / EP | Medium | Minor |

---

## 3. Test Suite 2: Formulir Filter Pencarian & Pengurutan (Sorting)

| Test Case ID | Test Objective / Skenario | Preconditions | Langkah Pengujian (Test Steps) | Test Data | Hasil yang Diharapkan (Expected Result) | Teknik ISTQB | Prioritas | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **REV-TC-006** | Verifikasi interaksi tombol "Toggle Filter" untuk expand dan collapse panel filter | Halaman laporan pendapatan terbuka | 1. Klik tombol "Toggle Filter".<br>2. Amati transisi panel form filter.<br>3. Klik kembali tombol "Toggle Filter". | Tombol `Toggle Filter` | Form filter mengembang (*expanded*) memperlihatkan seluruh field kontrol, dan menciut (*collapsed*) saat diklik ulang tanpa merusak layout tabel. | State Transition | High | Major |
| **REV-TC-007** | Pengujian pencarian berdasarkan "Nama Properti" yang terdaftar | Panel filter terbuka | 1. Masukkan nama properti terdaftar pada input `Cari Properti / Mitra`.<br>2. Klik tombol "Terapkan Filter".<br>3. Amati hasil baris tabel. | Keyword: `Arsyy Royal Suites` | Tabel hanya menampilkan baris properti yang memuat nama "Arsyy Royal Suites". Baris lain disaring keluar. | Equivalence Partitioning (Valid) | High | Major |
| **REV-TC-008** | Pengujian pencarian berdasarkan "Nama Mitra" yang terdaftar | Panel filter terbuka | 1. Masukkan nama mitra terdaftar pada input `Cari Properti / Mitra`.<br>2. Klik tombol "Terapkan Filter".<br>3. Amati hasil baris tabel. | Keyword: `Firman SQA` | Tabel hanya menampilkan baris properti milik mitra "Firman SQA". | Equivalence Partitioning (Valid) | High | Major |
| **REV-TC-009** | Pengujian pencarian dengan keyword yang tidak terdaftar (Empty State) | Panel filter terbuka | 1. Masukkan keyword acak yang tidak ada di sistem.<br>2. Klik tombol "Terapkan Filter". | Keyword: `KEYWORD_TIDAK_ADA_9999` | Tabel menampilkan indikator data tidak ditemukan / empty state secara rapi tanpa error runtime atau crash aplikasi. | EP (Negative) | Medium | Minor |
| **REV-TC-010** | Pengujian penyaringan data berdasarkan Range Tanggal valid | Panel filter terbuka | 1. Masukkan rentang tanggal valid pada input `#dates` dengan format `MM/DD/YYYY - MM/DD/YYYY`.<br>2. Klik tombol "Terapkan Filter". | Input `dates`: `11/01/2026 - 11/30/2026` | Sistem menerima rentang tanggal dan memperbarui rekap kartu finansial serta baris tabel sesuai periode terpilih. | Boundary Value Analysis | High | Major |
| **REV-TC-011** | Pengujian filter dropdown "Kelompok / Tag" (Select2) | Panel filter terbuka | 1. Buka dropdown `Kelompok / Tag`.<br>2. Pilih salah satu opsi tag (contoh: `BUMD` atau `Perorangan`).<br>3. Klik tombol "Terapkan Filter". | Tag terpilih: `BUMD` | Tabel menyaring data sehingga hanya properti dengan kelompok/tag terpilih yang tampil. Badge kolom kelompok sesuai. | Decision Table | High | Major |
| **REV-TC-012** | Pengujian filter dropdown "Kota / Wilayah" (Select2) | Panel filter terbuka | 1. Buka dropdown `Kota / Wilayah`.<br>2. Pilih salah satu kota (contoh: `Kota Yogyakarta` atau `Kabupaten Sleman`).<br>3. Klik tombol "Terapkan Filter". | Kota terpilih: `Kota Yogyakarta` | Tabel memfilter properti yang berlokasi di kota/wilayah terpilih. | Decision Table | Medium | Minor |
| **REV-TC-013** | Pengujian pengurutan data nama properti A-Z dan Z-A (`sort_by`) | Panel filter terbuka | 1. Pilih opsi `Nama (A - Z)` lalu klik "Terapkan Filter".<br>2. Amati urutan nama properti baris 1 s.d n.<br>3. Ganti ke opsi `Nama (Z - A)` lalu klik "Terapkan Filter". | `sort_by`: `name_asc` dan `name_desc` | Baris tabel terurut secara alfabetis naik (A ke Z) pada opsi `name_asc`, dan terurut turun (Z ke A) pada opsi `name_desc`. | Data Ordering | Medium | Minor |
| **REV-TC-014** | Verifikasi fungsionalitas tombol "Reset" filter | Filter aktif terpasang pada halaman | 1. Terapkan filter pencarian / tanggal / tag.<br>2. Klik tombol "Reset".<br>3. Amati URL dan kondisi input form. | Tombol `Reset` (`a.btn-light`) | Browser mereset seluruh nilai filter ke nilai default (mengarah kembali ke `/partner/reports/revenue`) dan memuat ulang tabel penuh. | State Transition | High | Major |

---

## 4. Test Suite 3: Tabel Data & Integritas Finansial (10 Kolom)

| Test Case ID | Test Objective / Skenario | Preconditions | Langkah Pengujian (Test Steps) | Test Data | Hasil yang Diharapkan (Expected Result) | Teknik ISTQB | Prioritas | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **REV-TC-015** | Verifikasi struktur 10 kolom header tabel data | Halaman laporan pendapatan terbuka | 1. Identifikasi elemen `table` pada halaman.<br>2. Hitung jumlah dan periksa teks tiap kolom `th`. | 10 Kolom Header | Tabel memuat tepat 10 kolom berurutan: `No`, `Nama Properti`, `Mitra`, `Kelompok`, `Pendapatan Kotor`, `Komisi OTA (%)`, `Komisi OTA (Rp)`, `Pendapatan Bersih`, `Status`, `Aksi`. | Schema / GUI | High | Major |
| **REV-TC-016** | Validasi integritas kalkulasi matematis: Pendapatan Kotor = Komisi OTA + Pendapatan Bersih | Data baris tampil di tabel | 1. Ambil nilai kolom Pendapatan Kotor ($K$).<br>2. Ambil nilai nominal Komisi OTA ($C$).<br>3. Ambil nilai Pendapatan Bersih ($B$).<br>4. Uji formula: $K = C + B$. | Baris transaksi mitra | Nilai Pendapatan Kotor selalu sama persis dengan penjumlahan Komisi OTA (Rp) ditambah Pendapatan Bersih (Rp) pada setiap baris data. | Decision Table | Critical | Critical |
| **REV-TC-017** | Verifikasi badge visualisasi kolom "Kelompok" | Baris data tampil di tabel | 1. Amati elemen pada kolom "Kelompok" tiap baris.<br>2. Periksa tipe tag yang terpasang (BUMD, BUMDS, Djurkam, Perorangan, dll.). | Variasi data tag kelompok | Kolom Kelompok menampilkan badge label yang jelas sesuai data master properti/mitra. | GUI Verification | Medium | Minor |
| **REV-TC-018** | Verifikasi visualisasi badge pada kolom "Status" | Baris data tampil di tabel | 1. Amati elemen pada kolom "Status" tiap baris.<br>2. Periksa teks dan styling badge. | Status: `Belum Ada Reservasi` | Badge status memuat informasi reservasi mitra secara informatif dengan styling visual yang tepat. | GUI / State | Medium | Minor |

---

## 5. Test Suite 4: Navigasi Aksi Rincian Pendapatan Mitra

| Test Case ID | Test Objective / Skenario | Preconditions | Langkah Pengujian (Test Steps) | Test Data | Hasil yang Diharapkan (Expected Result) | Teknik ISTQB | Prioritas | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **REV-TC-019** | Verifikasi ketersediaan tautan "Lihat Rincian Pendapatan" pada kolom Aksi | Terdapat data pada tabel laporan | 1. Amati kolom "Aksi" pada baris tabel.<br>2. Periksa atribut tautan icon/tombol aksi. | Baris 1: cth ID `40` | Setiap baris memuat tombol/ikon aksi dengan link berformat `/partner/reports/revenue/{id}`. | GUI Verification | High | Major |
| **REV-TC-020** | Verifikasi navigasi ke halaman Detail Rincian Pendapatan Mitra | Terdapat data pada tabel laporan | 1. Klik tautan "Lihat Rincian Pendapatan" pada salah satu baris.<br>2. Tunggu transisi halaman.<br>3. Periksa URL dan konten halaman detail. | Baris terpilih | Halaman rincian pendapatan berhasil dimuat tanpa error 404/500, URL memuat ID mitra/properti yang sesuai, dan menampilkan tabel rincian transaksi terkait. | Use Case Testing | High | Critical |

---

## 6. Test Suite 5: Fitur Ekspor Dokumen Laporan (Excel & PDF)

| Test Case ID | Test Objective / Skenario | Preconditions | Langkah Pengujian (Test Steps) | Test Data | Hasil yang Diharapkan (Expected Result) | Teknik ISTQB | Prioritas | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **REV-TC-021** | Validasi tombol ekspor "Excel" menghasilkan respon HTTP 200 / file download | Halaman laporan pendapatan terbuka | 1. Temukan tombol "Excel" pada grup Export.<br>2. Periksa atribut href endpoint ekspor.<br>3. Trigger request/klik tombol ekspor Excel.<br>4. Periksa respon status dari server. | Endpoint: `/partner/reports/revenue/export/excel?page=1` | Server merespon dengan status HTTP 200 OK dengan header MIME/Content-Disposition dokumen Excel yang valid. | Functional / Export | High | Major |
| **REV-TC-022** | Validasi tombol ekspor "PDF" menghasilkan respon HTTP 200 / file download | Halaman laporan pendapatan terbuka | 1. Temukan tombol "PDF" pada grup Export.<br>2. Periksa atribut href endpoint ekspor.<br>3. Trigger request/klik tombol ekspor PDF.<br>4. Periksa respon status dari server. | Endpoint: `/partner/reports/revenue/export/pdf?page=1` | Server merespon dengan status HTTP 200 OK dengan header MIME/Content-Disposition dokumen PDF yang valid. | Functional / Export | High | Major |

---

## 7. Test Suite 6: Navigasi Pagination & Resiliensi URL

| Test Case ID | Test Objective / Skenario | Preconditions | Langkah Pengujian (Test Steps) | Test Data | Hasil yang Diharapkan (Expected Result) | Teknik ISTQB | Prioritas | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **REV-TC-023** | Verifikasi tombol "« Previous" dalam kondisi disabled saat berada pada Halaman 1 | Berada pada URL `?page=1` | 1. Amati komponen pagination di bawah tabel.<br>2. Periksa status tombol "« Previous". | Parameter `?page=1` | Tombol « Previous berstatus disabled / tidak dapat diklik saat pengguna berada di halaman pertama (boundary minimum). | Boundary Value Analysis | Medium | Minor |
| **REV-TC-024** | Verifikasi navigasi ke halaman berikutnya (Page 2 / Next ») | Terdapat lebih dari 1 halaman data | 1. Klik tombol halaman "2" atau tombol "Next »".<br>2. Tunggu pemuatan data.<br>3. Amati nomor urut baris dan parameter URL. | Tombol Page `2` / `Next »` | URL berubah memuat parameter `?page=2`, nomor urut tabel melanjutkan batch sebelumnya (cth: baris mulai dari No 16), dan tombol Previous kini berstatus aktif/enabled. | State Transition | High | Major |
| **REV-TC-025** | Validasi kombinasi filter multi-kriteria (Search + Tag + City) berlogika AND | Panel filter terbuka | 1. Masukkan keyword nama properti.<br>2. Pilih tag kelompok spesifik.<br>3. Pilih kota spesifik.<br>4. Klik "Terapkan Filter". | Kombinasi multi-kriteria | Hanya baris yang memenuhi seluruh kriteria secara bersamaan yang ditampilkan (logika AND). Jika tidak ada yang cocok, tampil empty state. | Decision Table | High | Major |
| **REV-TC-026** | Resiliensi sistem terhadap manipulasi parameter URL (Error Guessing) | Berada pada halaman laporan | 1. Navigasi ke URL dengan parameter halaman negatif (misal: `?page=-1` atau `?page=99999`).<br>2. Amati penanganan sistem. | `?page=-1`, `?page=99999` | Sistem menangani secara anggun (graceful degradation) tanpa fatal error 500, mengarahkan ke halaman 1 atau menampilkan halaman kosong yang informatif. | Error Guessing | Medium | Minor |

---

## 8. Panduan Eksekusi Otomatis E2E Test (@e2e-dev/web)

Untuk mengeksekusi skenario uji ini secara otomatis:
```bash
# Jalankan seluruh test suite Laporan Pendapatan Mitra
pnpm test:report:revenue

# Atau jalankan langsung via e2e CLI
npx e2e run tests/reports/revenue-report.e2e.ts
```

Bukti tangkapan layar pengujian otomatis disimpan pada:
`reports/revenue/screenshots/`
