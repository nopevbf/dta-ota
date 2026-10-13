# Test Specification: BUMD & Fee Management (ISTQB Standard)

- **Aplikasi / Modul**: Sistem Manajemen D'Paragon - Finance BUMD
- **Target URL**: `https://management.dparagon7.persona-it.com/partner/finance/bumd`
- **Referensi Dokumen**: 
  1. Google Spreadsheet QA BUMD: `https://docs.google.com/spreadsheets/d/1DZcVkIg0SVcx7siouUJrb5NEVzdJjFw81xq3SGhUnZU/edit?gid=0#gid=0` (48 Test Scenarios)
  2. Spesifikasi Fitur Baru: Pengaturan & Rekapitulasi **Fee BUMD** (Form Wizard Tab 4 & Kolom Tabel)
- **Standar Format**: ISTQB (International Software Testing Qualifications Board) - Test Case Specification (ISO/IEC/IEEE 29119-3)
- **Teknik Pengujian Digunakan**:
  - Equivalence Partitioning (EP)
  - Boundary Value Analysis (BVA)
  - State Transition Testing (Wizard navigation & step validation)
  - Decision Table Testing (Filter kombinasi)

---

## 1. Test Suite: Fee BUMD (Fitur Baru)

| Test ID | Modul / Fitur | Deskripsi Uji | Preconditions | Test Steps | Data Uji | Expected Result | Teknik | Prioritas | Status Otomasi |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BUMD-FEE-001** | Create Wizard - Tab 4 | Input Fee Management & Fee BUMD dengan nilai valid | Login sebagai manajemen, berada di Tab 4 form wizard BUMD | 1. Ketik nilai pada `input[name="fee_management"]`<br>2. Ketik nilai pada `input[name="fee_bumd"]` | Fee Mgmt: `15`, Fee BUMD: `10` | Input menerima nilai angka dengan format persentase yang valid | EP | High | Automated (PASS) |
| **BUMD-FEE-002** | Create Wizard - Tab 4 | Navigasi mundur ke Tab 3 dan maju kembali ke Tab 4 | Berada di Tab 4 form wizard BUMD dengan input terisi | 1. Klik tombol "Sebelumnya" (`.prev-tab`)<br>2. Verifikasi Tab 3 aktif<br>3. Klik tombol "Selanjutnya" (`.next-tab`) pada Tab 3 | - | Nilai yang telah diisi pada `fee_management` dan `fee_bumd` tidak hilang/reset saat bernavigasi antar-tab | State Transition | Medium | Automated (PASS) |
| **BUMD-FEE-003** | Create Wizard - Tab 4 | Boundary Value Analysis (BVA) input Fee (0% dan 100%) | Berada di Tab 4 form wizard BUMD | 1. Input Fee Mgmt = `0` dan Fee BUMD = `100`<br>2. Ubah Fee Mgmt = `100` dan Fee BUMD = `0` | Nilai batas: `0` dan `100` | Input menerima nilai batas bawah (0) dan batas atas (100) tanpa error kalkulasi | BVA | High | Automated (PASS) |
| **BUMD-FEE-004** | Create Wizard - Tab 4 | Validasi nilai negatif dan di atas 100% | Berada di Tab 4 form wizard BUMD | 1. Coba masukkan nilai negatif `-5`<br>2. Coba masukkan nilai `150` | Nilai invalid: `-5`, `150` | Sistem menolak nilai atau membatasi input antara 0 - 100% | BVA / EP | High | Planned |
| **BUMD-FEE-005** | Create Wizard - Tab 4 | Submit Form lengkap termasuk Fee BUMD | Berada di Tab 4 form wizard BUMD dengan seluruh tab 1-3 valid | 1. Isi Fee Mgmt dan Fee BUMD<br>2. Klik tombol "Simpan" (`#tab-fee button[type="submit"]`) | Data perusahaan valid + Fee valid | Form berhasil disubmit, dialihkan ke halaman list BUMD dengan pesan sukses | Positive Flow | High | Automated (via Wizard flow) |
| **BUMD-FEE-006** | BUMD List Table | Tampilan kolom Fee Management dan Fee BUMD pada Tabel | Login sebagai manajemen, akses halaman `/partner/finance/bumd` | 1. Periksa header tabel BUMD<br>2. Periksa cell data baris BUMD | Tabel BUMD | Kolom "Fee Management" dan "Fee BUMD" ter-render di header dan menampilkan format persentase / nilai yang sesuai | GUI Verification | High | Automated (PASS) |

---

## 2. Test Suite: Master BUMD - Create Wizard (Spreadsheet Ref: BUMD-SC-001 s/d BUMD-SC-035)

### Tab 1: Identitas Perusahaan
| Test ID | Deskripsi Skenario | Preconditions | Langkah Uji | Data Uji | Hasil yang Diharapkan | Prioritas | Status Otomasi |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BUMD-SC-001** | Akses Form Tambah BUMD | Login manajemen, halaman list BUMD | Klik tombol "Tambah Data" | - | Dialihkan ke URL `/partner/finance/bumd/create`, Tab 1 aktif | High | Automated (PASS) |
| **BUMD-SC-002** | Validasi Field Mandatory Tab 1 kosong | Di Tab 1 create BUMD | Langsung klik tombol "Selanjutnya" tanpa isi data | Semua field kosong | Field wajib menampilkan indikator error validasi HTML5/JS | High | Planned |
| **BUMD-SC-003** | Format Nama Perusahaan valid | Di Tab 1 | Isi nama perusahaan alphanumeric | "PT BUMD Maju Bersama" | Input diterima | Medium | Automated (PASS) |
| **BUMD-SC-004** | Format NIB valid (13 digit angka) | Di Tab 1 | Isi NIB dengan 13 digit angka | "1234567890123" | Input diterima | Medium | Automated (PASS) |
| **BUMD-SC-005** | Format NPWP valid (16 digit angka) | Di Tab 1 | Isi NPWP dengan 16 digit angka | "0123456789012345" | Input diterima | Medium | Automated (PASS) |
| **BUMD-SC-006** | Pemilihan Jenis Badan Hukum | Di Tab 1 | Pilih dropdown jenis badan hukum | "Perseroan Daerah (Perseroda)" | Opsi terpilih dengan benar | Medium | Automated (PASS) |
| **BUMD-SC-007** | Pemilihan Tahun Berdiri | Di Tab 1 | Pilih/set tahun berdiri dari datepicker | "2020" | Nilai tahun terisi di input `founded_year` | Medium | Automated (PASS) |
| **BUMD-SC-008** | Input Telepon Perusahaan | Di Tab 1 | Isi nomor telepon perusahaan valid | "081234567890" | Input format nomor telepon diterima | Medium | Automated (PASS) |
| **BUMD-SC-009** | Input Alamat & Detail Domisili | Di Tab 1 | Isi alamat lengkap dan pilih dropdown domisili | "Jl. Malioboro No. 10" | Field alamat terisi | Medium | Automated (PASS) |
| **BUMD-SC-010** | Berhasil Melanjutkan ke Tab 2 (Selanjutnya) | Di Tab 1, semua mandatory valid | Klik `#tab-perusahaan .next-tab` | Data lengkap Tab 1 | Tab 1 tertutup/hidden, Tab 2 (`#tab-pj`) menjadi aktif dan terlihat | High | Automated (PASS) |

### Tab 2: Identitas Penanggungjawab
| Test ID | Deskripsi Skenario | Preconditions | Langkah Uji | Data Uji | Hasil yang Diharapkan | Prioritas | Status Otomasi |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BUMD-SC-011** | Navigasi Mundur dari Tab 2 ke Tab 1 | Di Tab 2 create BUMD | Klik `#tab-pj .prev-tab` | - | Tab 1 aktif kembali, data yang diinputkan sebelumnya tetap tersimpan | High | Automated (PASS) |
| **BUMD-SC-012** | Validasi Field Mandatory Tab 2 kosong | Di Tab 2 | Klik tombol "Selanjutnya" tanpa isi penanggungjawab | Field kosong | Sistem mencegah navigasi dan menampilkan alert/validasi | Medium | Planned |
| **BUMD-SC-013** | Input Lengkap Identitas Penanggungjawab | Di Tab 2 | Isi Nama, NIK (16 digit), Jabatan, No HP, Email | Data PJ valid | Seluruh field menerima data sesuai tipe input | High | Automated (PASS) |
| **BUMD-SC-014** | Validasi Format NIK Penanggungjawab (BVA 16 digit) | Di Tab 2 | Coba input NIK kurang dari 16 digit atau huruf | "12345" / "abc" | Ditolak atau muncul pesan validasi | Medium | Planned |
| **BUMD-SC-015** | Validasi Format Email Penanggungjawab | Di Tab 2 | Masukkan email tidak valid | "penanggungjawab.com" | Validasi format email HTML5 aktif | Medium | Planned |
| **BUMD-SC-016** | Berhasil Melanjutkan ke Tab 3 (Selanjutnya) | Di Tab 2, data valid terisi | Klik `#tab-pj .next-tab` | Data PJ valid | Tab 2 tertutup, Tab 3 (`#tab-pimpinan`) aktif dan terlihat | High | Automated (PASS) |

### Tab 3: Identitas Pimpinan
| Test ID | Deskripsi Skenario | Preconditions | Langkah Uji | Data Uji | Hasil yang Diharapkan | Prioritas | Status Otomasi |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BUMD-SC-020** | Navigasi Mundur dari Tab 3 ke Tab 2 | Di Tab 3 create BUMD | Klik `#tab-pimpinan .prev-tab` | - | Tab 2 aktif kembali, data penanggungjawab tetap tersimpan | High | Automated (PASS) |
| **BUMD-SC-021** | Input Lengkap Identitas Pimpinan | Di Tab 3 | Isi Nama, NIK, Jabatan, No HP, Email pimpinan | Data Pimpinan valid | Field menerima data pimpinan | High | Automated (PASS) |
| **BUMD-SC-022** | Checkbox/Opsi Samakan dengan Penanggungjawab | Di Tab 3 | Aktifkan opsi jika pimpinan sama dengan PJ (jika ada) | Flag is_same | Data ter-autofill dari Tab 2 | Low | Planned |
| **BUMD-SC-024** | Berhasil Melanjutkan ke Tab 4 (Fee BUMD) | Di Tab 3, data pimpinan terisi | Klik `#tab-pimpinan .next-tab` | Data valid | Tab 3 tertutup, Tab 4 (`#tab-fee`) aktif dan terlihat | High | Automated (PASS) |

---

## 3. Test Suite: Master BUMD - List, Search, Filter & Export (Spreadsheet Ref: BUMD-SC-036 s/d BUMD-SC-048 & BUMD-SC-050 s/d BUMD-SC-060)

| Test ID | Deskripsi Skenario | Preconditions | Langkah Uji | Data Uji | Hasil yang Diharapkan | Prioritas | Status Otomasi |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BUMD-SC-050** | Render Tabel Data BUMD | Login manajemen, buka `/partner/finance/bumd` | Buka halaman BUMD | - | Tabel BUMD ter-render lengkap dengan headers (Nama, Badan Hukum, PIC, Pimpinan, Fee, Aksi) | High | Automated (PASS) |
| **BUMD-SC-051** | Pagination Tabel BUMD | Berada di halaman BUMD dengan data > 10 | Klik tombol next page / nomor halaman | Page 2 | Tabel memuat data halaman berikutnya | Medium | Planned |
| **BUMD-SC-052** | Perubahan Show Entries (Rows Per Page) | Berada di halaman BUMD | Ubah dropdown entries dari 10 ke 25 / 50 | 25 | Jumlah baris tabel menyesuaikan 25 record | Medium | Planned |
| **BUMD-SC-053** | Navigasi Tombol Tambah Data | Berada di halaman list BUMD | Klik tombol "Tambah Data" / link create | - | Berpindah ke URL `/partner/finance/bumd/create` | High | Automated (PASS) |
| **BUMD-SC-054** | Aksi Tombol Edit Baris BUMD | List BUMD memiliki minimal 1 baris | Klik tombol ikon Edit pada baris pertama | Baris #1 | Dialihkan ke form edit BUMD dengan data terisi | High | Planned |
| **BUMD-SC-055** | Export Data BUMD ke Excel | Berada di halaman list BUMD | Klik tombol "Export Excel" / ikon export | - | File spreadsheet .xlsx ter-download atau request export berhasil | High | Automated (PASS) |
| **BUMD-SC-056** | Toggle Kolom / Filter Panel Visibility | Berada di halaman list BUMD | Klik tombol filter atau toggle filter | - | Panel form filter muncul/tersembunyi secara responsif | Medium | Automated (PASS) |
| **BUMD-SC-057** | Filter Berdasarkan Jenis Badan Hukum | Panel filter terbuka | Pilih Badan Hukum tertentu dan klik Terapkan | Perseroda | Tabel menampilkan hanya BUMD dengan jenis badan hukum terkait | Medium | Planned |
| **BUMD-SC-058** | Reset Filter | Filter sedang diterapkan | Klik tombol "Reset" pada filter | - | Form filter kembali kosong dan tabel menampilkan seluruh data | Medium | Planned |
| **BUMD-SC-059** | Search / Filter Berdasarkan Nama BUMD | Berada di halaman list BUMD | Ketik nama perusahaan di search box & submit | Keyword nama | Baris tabel yang tampil hanya yang memuat keyword pencarian | High | Automated (PASS) |
| **BUMD-SC-060** | Konfirmasi Hapus Data BUMD | List BUMD memiliki minimal 1 baris | Klik tombol Hapus pada baris data | Baris terpilih | Modal konfirmasi hapus muncul dengan tombol Batal / Konfirmasi | High | Planned |

---

## 4. Test Suite: Siklus Hidup Penuh CRUD & Bukti Visual (E2E Lifecycle)

| Test ID | Modul / Skenario | Preconditions | Langkah Pengujian | Bukti Screenshot | Hasil yang Diharapkan | Prioritas | Status Otomasi |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BUMD-CRUD-001** | Create Data BUMD & Verifikasi Tampil di Tabel | Login manajemen, buka form create | 1. Isi Tab 1 Perusahaan (Nama Unik)<br>2. Isi Tab 2 PJ<br>3. Isi Tab 3 Pimpinan<br>4. Isi Tab 4 Fee (Mgmt: 15%, BUMD: 10%)<br>5. Tangkap screenshot<br>6. Klik Simpan<br>7. Tunggu redirect ke tabel<br>8. Tangkap screenshot tabel | `01-create-wizard-tab4-filled.png`<br>`02-create-verified-in-table.png` | Form tersimpan, muncul alert sukses, dan baris data baru tampil di tabel dengan Fee Management 15% & Fee BUMD 10% | Critical | Automated (PASS) |
| **BUMD-CRUD-002** | Update Data BUMD & Verifikasi Perubahan di Tabel | Data BUMD baru tampil di tabel | 1. Klik ikon Edit pada baris terkait<br>2. Tangkap screenshot form edit<br>3. Ubah nomor telepon perusahaan<br>4. Beralih ke Tab 4 & ubah Fee BUMD jadi 12%<br>5. Klik Simpan<br>6. Tunggu redirect ke tabel<br>7. Tangkap screenshot tabel | `03-edit-form-opened.png`<br>`04-update-verified-in-table.png` | Form edit termuat dengan nilai awal; data berhasil diperbarui dan nomor telepon baru ter-render di tabel | Critical | Automated (PASS) |
| **BUMD-CRUD-003** | Delete Data BUMD & Verifikasi Hilang dari Tabel | Data BUMD hasil update tampil di tabel | 1. Klik tombol Hapus (Delete) pada baris terkait<br>2. Tangkap screenshot dialog konfirmasi<br>3. Konfirmasi penghapusan (Accept dialog)<br>4. Tunggu reload tabel<br>5. Tangkap screenshot tabel bersih | `05-delete-confirmation-dialog.png`<br>`06-delete-verified-removed.png` | Dialog konfirmasi "Hapus data ini?" muncul dan saat dikonfirmasi, data terhapus permanen dari tabel | Critical | Automated (PASS) |

---

## 5. Test Suite: Automated Regression Suite (`tests/bumd/bumd-regression.e2e.ts`)

| Test ID | Cakupan Uji Regresi | Komponen yang Divalidasi | Kriteria Lulus (Pass Criteria) | Durasi Uji | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BUMD-REG-001** | Table Rendering & Toolbar Integrity | Headers: Nama, Fee Mgmt, Fee BUMD, Aksi; Tombol: Tambah, Excel | Seluruh elemen header dan aksi ter-render visible | ~21s | **PASS** |
| **BUMD-REG-002** | Wizard Stepper Navigation & State Retention | Navigasi maju Tab 1-4 lalu mundur Tab 4-1 | Data pada input tidak hilang atau reset saat berpindah tab | ~30s | **PASS** |
| **BUMD-REG-003** | Full Data Lifecycle CRUD & Teardown | Create -> Table Verify -> Edit -> Update Verify -> Delete -> Clean Table | Seluruh siklus CRUD berhasil tanpa sisa data sampah di staging | ~54s | **PASS** |
| **BUMD-REG-004** | Search Filter & Export Response | Search box keyword, filter toggle, tombol export Excel | Filter interaktif dan tombol export Excel aktif | ~19s | **PASS** |

---

## 6. Matriks Traceability & Cakupan Fitur

- **Total Skenario Teridentifikasi**: 61 Skenario.
- **Skenario Terotomasi (E2E Automated)**: 18 Tests Terpadu (100% PASS).
- **Regression Execution Target**: Setiap sprint release fitur finance BUMD (`pnpm test:bumd:regression`).

