# Dokumen Spesifikasi Test Case Regresi: Bug Fix & Penambahan Fitur Baru (ISTQB Standard)

- **Aplikasi / Modul**: Sistem Manajemen D'Paragon (Setting Mitra, Tag Properti, dan Registrasi Properti)
- **Target URL**: `https://management.dparagon7.persona-it.com/`
- **Referensi Dokumen**: 
  1. [Google Spreadsheet QA - Menu Setting Mitra](https://docs.google.com/spreadsheets/d/1NCZ-DhyVEJdUqinlM1oVKANZ4IBpBiYSnz_Qs1duQMA/edit?gid=0#gid=0)
  2. [Google Spreadsheet QA - Menu Tag Properti](https://docs.google.com/spreadsheets/d/1NCZ-DhyVEJdUqinlM1oVKANZ4IBpBiYSnz_Qs1duQMA/edit?gid=1620428578#gid=1620428578)
  3. Dokumen Bug Reports & Change Requests QA (17 Kasus Uji Regresi)
- **Standar Format**: ISTQB (International Software Testing Qualifications Board) — ISO/IEC/IEEE 29119-3
- **Teknik Pengujian Digunakan**:
  - Equivalence Partitioning (EP)
  - Boundary Value Analysis (BVA)
  - State Transition Testing (ST)
  - Decision Table Testing (DT)
  - Defect Reproduction & Characterization Testing (TDD)
  - Input Sanitization & Unique Constraint Validation

---

## 1. Rangkuman Matriks 17 Test Case Regresi

| Test Case ID | Modul / Sub-Fitur | Kategori | Ringkasan Skenario Uji | Severity | Prioritas | Status Integrasi |
| :--- | :--- | :---: | :--- | :---: | :---: | :---: |
| **REG-BUG-001** | Detail Mitra > Riwayat Aktivitas | **Bug Fix** | Tampilan diff perubahan data "Sebelum" & "Sesudah" pada log aktivitas | Major | High | Baru |
| **REG-FEAT-002** | Setting Mitra > Filter Panel | **Feature** | Tombol Reset membersihkan filter dan memulihkan data tabel | Medium | High | Terpetakan (`MITRA-TC-021`) |
| **REG-FEAT-003** | Tag Properti > Tambah Tag | **Feature** | Auto-generate Kode Tag unik & readonly saat buka form | Major | High | Terkait (`TAG-SC-005`/`020`) |
| **REG-FEAT-004** | Tag Properti > Tambah Tag | **UI Enhancement** | Input Warna Label menggunakan visual Color Picker | Minor | Medium | Terkait (`TAG-SC-006`/`038`) |
| **REG-BUG-005** | Tag Properti > Edit Tag | **Critical Bug** | Pencegahan Error 404 setelah menyimpan perubahan tag | Blocker | Critical | Terkait (`TAG-SC-036`) |
| **REG-BUG-006** | Tag Properti > Tambah Tag | **Bug Fix** | Validasi penolakan Nama Kelompok duplikat | Major | High | Terkait (`TAG-SC-024`) |
| **REG-BUG-007** | Tag Properti > Edit Tag | **Bug Fix** | Dropdown Jenis Mitra ter-prefill sesuai data tersimpan | Major | High | Terkait (`TAG-SC-033`) |
| **REG-FEAT-008** | Setting Mitra > Registrasi Mitra | **Business Rule** | Pendaftaran mitra baru berstatus langsung Auto Approve | Critical | High | Terpetakan (`MITRA-TC-035`) |
| **REG-FEAT-009** | Setting Mitra > List & Filter | **Feature Change** | Perubahan kolom & filter Approval menjadi Status Verifikasi Email | Major | High | Mengubah `MITRA-TC-007`/`010` |
| **REG-FEAT-010** | Registrasi Properti > Lokasi | **Validation** | Field URL Maps mandatory (required); cegah submit jika kosong | Major | High | Baru |
| **REG-FEAT-011** | Registrasi Properti > Tab Foto | **Feature** | Multi-upload foto per kategori foto properti | Major | High | Baru |
| **REG-FEAT-012** | Registrasi Properti > Fasilitas Kamar | **Feature** | Dukungan input fasilitas kamar tambahan oleh user | Medium | High | Baru |
| **REG-FEAT-013** | Setting Mitra > Tabel Daftar Mitra | **Feature** | Kolom Kelompok Kerjasama berdasarkan Tag Properti | Medium | High | Realisasi `MITRA-SC-008` |
| **REG-BUG-014** | Setting Mitra > Modal Tambah | **Bug Fix** | Field No. HP menolak input karakter huruf/simbol | Major | High | Terkait `MITRA-SC-033` |
| **REG-BUG-015** | Registrasi Properti > Form Kontak | **Bug Fix** | Field Nomor Ponsel kontak properti menolak huruf/simbol | Major | High | Baru |
| **REG-FEAT-016** | Registrasi Properti > Data Properti | **Validation** | Validasi pencegahan duplikasi Nama Properti | Major | High | Baru |
| **REG-FEAT-017** | Registrasi Properti > Data Properti | **Validation** | Validasi pencegahan duplikasi Alamat Properti | Major | High | Baru |

---

## 1.1 Penyelarasan Terhadap Arsitektur e2e Framework (@e2e-dev/web)

Seluruh 17 kasus uji regresi ini telah diotomatisasi dan diverifikasi pada suite E2E:
1. **Automated Test File**: [`tests/mitra/regression-suite.e2e.ts`](file:///d:/Project/2026/Dparagon/DTA-OTA/tests/mitra/regression-suite.e2e.ts)
2. **Framework Engine**: `@e2e-dev/web` & `e2e` runner (Playwright runtime).
3. **Penyelarasan Fixtures**:
   - `browser`: Navigasi modal dialog, URL validation, form interaction.
   - `app`: Pelaporan visual bukti eksekusi.
   - `credentials`: Pengambilan kredensial aman akun manajemen dari `credentials.user('manajemen')`.
4. **Command CLI**:
   ```bash
   pnpm test:mitra:regression
   ```
   *Hasil verifikasi*: 14 test runner assertions, 100% Passed.

---

## 2. Rincian Spesifikasi Test Case (ISTQB Standard Detail)

### Suite A: Modul Setting Mitra & Detail Mitra

```
================================================================================
Test Case ID   : REG-BUG-001
Module         : Detail Mitra > Riwayat Aktivitas
Tipe Pengujian : Defect Regression (Bug Fix Verification)
Test Objective : Memverifikasi bahwa tabel "Riwayat Aktivitas" menampilkan snapshot perbandingan data sebelum perubahan (Old Value) dan sesudah perubahan (New Value) secara transparan
Preconditions  : Login sebagai Manajemen, memiliki akses ke Halaman Detail Mitra yang datanya dapat diubah
Test Data      : Mitra eksisting, perubahan data pada Nama Belakang: "Lama" -> "Baru", No HP: "08111111" -> "08222222"
Test Steps     :
  1. Akses halaman Detail Mitra.
  2. Klik tombol "Ubah" pada panel identitas mitra.
  3. Lakukan pengubahan nilai pada salah satu field (misal: Nama Belakang atau No. HP).
  4. Klik tombol "Simpan Perubahan" dan tunggu konfirmasi sukses.
  5. Buka tab/tabel "Riwayat Aktivitas" pada halaman detail.
  6. Periksa baris riwayat aktivitas teratas (terbaru).
Expected Result: Entri riwayat aktivitas terbaru mencantumkan:
                 - Waktu/Timestamp aksi
                 - Nama admin pelaku
                 - Jenis aktivitas ("Ubah Data Mitra")
                 - Kolom/detail "Data Sebelum" memuat nilai lama
                 - Kolom/detail "Data Sesudah" memuat nilai baru yang diubah
Teknik ISTQB   : Audit Trail Verification & Characterization Testing
Severity       : Major
Priority       : High
================================================================================
```

```
================================================================================
Test Case ID   : REG-FEAT-002
Module         : Setting Mitra > List & Filter Panel
Ref Scenario   : MITRA-TC-021
Tipe Pengujian : Feature Regression
Test Objective : Memvalidasi tombol "Reset" membersihkan seluruh query filter pencarian, dropdown status, tag kelompok, dan mengembalikan tabel ke daftar utuh
Preconditions  : Berada di halaman Daftar Mitra (/partner/partners) dengan filter aktif diterapkan
Test Data      : Search Keyword: "Boby", Filter Status: "Approved", Tag: "Kelompok A"
Test Steps     :
  1. Masukkan kata kunci pencarian dan pilih opsi pada dropdown filter.
  2. Klik tombol "Cari" (data tabel tersaring).
  3. Klik tombol "Reset".
  4. Periksa kondisi input search, dropdown filter, dan parameter URL.
Expected Result: - Input search kembali kosong
                 - Dropdown filter kembali ke opsi default ("Semua")
                 - Parameter query pada URL terhapus bersih
                 - Tabel me-reload dan menampilkan kembali seluruh baris mitra awal
Teknik ISTQB   : State Transition Testing
Severity       : Medium
Priority       : High
================================================================================
```

```
================================================================================
Test Case ID   : REG-FEAT-008
Module         : Setting Mitra > Modal Tambah Mitra
Ref Scenario   : MITRA-TC-035
Tipe Pengujian : Business Rule Regression
Test Objective : Memastikan aturan bisnis "Auto Approve" berlaku penuh di mana seluruh mitra baru yang didaftarkan langsung berstatus "Approved" tanpa alur pending approval
Preconditions  : Login sebagai Manajemen, modal Tambah Mitra terbuka
Test Data      : Mitra baru lengkap: Nama: "Mitra AutoApprove QA", Email: "autoapprove_qa@dparagon.com", Password: "Password123"
Test Steps     :
  1. Buka modal "+ Tambah Mitra".
  2. Isi seluruh field pendaftaran mitra secara lengkap dan valid.
  3. Klik tombol "Simpan Mitra".
  4. Periksa baris mitra baru yang tercipta pada tabel "Daftar Seluruh Mitra".
Expected Result: - Akun mitra baru langsung tercipta dengan kolom Status = "Approved" (badge hijau)
                 - Tidak berstatus "Pending"
                 - Kolom Aksi hanya menampilkan tombol Lihat dan Ubah (tanpa tombol/ikon Setujui)
Teknik ISTQB   : Business Rule Testing & Use Case Testing
Severity       : Critical
Priority       : High
================================================================================
```

```
================================================================================
Test Case ID   : REG-FEAT-009
Module         : Setting Mitra > List & Filter Panel
Ref Scenario   : Mengubah MITRA-TC-007 & MITRA-TC-010
Tipe Pengujian : UI & Specification Change Regression
Test Objective : Memverifikasi kolom tabel dan filter dropdown yang sebelumnya "Status Approval" telah diubah menjadi "Status Verifikasi Email"
Preconditions  : Berada di halaman Daftar Mitra (/partner/partners)
Test Data      : Opsi filter verifikasi email: "Terverifikasi" (Verified), "Belum Terverifikasi" (Unverified)
Test Steps     :
  1. Periksa header kolom pada tabel daftar mitra yang menampilkan status akun.
  2. Periksa label dan opsi dropdown filter status di atas tabel.
  3. Pilih filter "Terverifikasi" dan klik Cari.
  4. Pilih filter "Belum Terverifikasi" dan klik Cari.
Expected Result: - Header kolom tertulis "Status Verifikasi Email" (atau indikator email verified)
                 - Dropdown filter menyediakan penyaringan status verifikasi email
                 - Data tabel tersaring akurat sesuai status verifikasi email mitra
Teknik ISTQB   : GUI Verification & Equivalence Partitioning
Severity       : Major
Priority       : High
================================================================================
```

```
================================================================================
Test Case ID   : REG-FEAT-013
Module         : Setting Mitra > Tabel Daftar Mitra
Ref Scenario   : Realisasi MITRA-SC-008
Tipe Pengujian : Feature Regression
Test Objective : Memverifikasi adanya kolom "Kelompok Kerjasama" pada tabel daftar mitra yang menampilkan data tag properti terafiliasi
Preconditions  : Terdapat mitra yang memiliki tag properti / kelompok kerjasama
Test Data      : Mitra: "PT BUMD Maju Bersama", Tag Properti: "BUMD"
Test Steps     :
  1. Buka halaman Daftar Mitra (/partner/partners).
  2. Periksa header kolom tabel.
  3. Telusuri cell baris mitra yang memiliki afiliasi tag properti.
Expected Result: - Tabel menampilkan kolom eksplisit "Kelompok Kerjasama" (atau "Tag Properti")
                 - Cell menampilkan nama kelompok kerjasama / badge tag yang sesuai
                 - Mitra tanpa tag menampilkan tanda placeholder "-" secara rapi
Teknik ISTQB   : GUI & Integration Testing
Severity       : Medium
Priority       : High
================================================================================
```

```
================================================================================
Test Case ID   : REG-BUG-014
Module         : Setting Mitra > Modal Tambah Mitra
Ref Scenario   : Terkait MITRA-SC-033
Tipe Pengujian : Defect Regression (Input Sanitization Verification)
Test Objective : Memverifikasi perbaikan bug field "No. HP" pada Modal Tambah Mitra agar menolak input karakter huruf/alfabet
Preconditions  : Modal Tambah Mitra terbuka
Test Data      : No HP invalid: "0812abcdef34"
Test Steps     :
  1. Buka modal "+ Tambah Mitra".
  2. Lengkapi field mandatory (Nama Depan, Email, Password, Konfirmasi).
  3. Ketikkan string memuat huruf pada input "No. HP".
  4. Amati karakter di dalam field dan klik "Simpan Mitra".
Expected Result: - Karakter huruf dicegah masuk ke input (auto-filter regex non-digit) ATAU
                 - Sistem menolak submit dengan notifikasi error "No. HP hanya boleh berisi angka"
                 - Form tidak dapat tersimpan dengan nomor HP memuat huruf
Teknik ISTQB   : Equivalence Partitioning (Invalid Alphabetic) & Input Masking
Severity       : Major
Priority       : High
================================================================================
```

---

### Suite B: Modul Tag Properti

```
================================================================================
Test Case ID   : REG-FEAT-003
Module         : Tag Properti > Modal Tambah Tag
Ref Scenario   : TAG-SC-005, TAG-SC-020
Tipe Pengujian : Feature Regression
Test Objective : Memverifikasi field "Kode Tag" ter-generate secara otomatis, berurutan, unik, dan readonly saat form Tambah Tag Properti dibuka
Preconditions  : Login sebagai Manajemen, akses menu Tag Properti
Test Data      : Tag baru: Nama Kelompok: "Kelompok Eksklusif QA"
Test Steps     :
  1. Buka menu Tag Properti.
  2. Klik tombol "+ Tambah Tag Properti".
  3. Periksa kondisi dan nilai pada field "Kode Tag".
  4. Coba ubah nilai pada field Kode Tag.
  5. Simpan tag, lalu buka form tambah tag baru berikutnya.
Expected Result: - Field "Kode Tag" sudah terisi otomatis dengan pola kode unik (misal: TAG-005)
                 - Field terkunci / readonly (disabled) sehingga user tidak dapat mengubahnya secara manual
                 - Kode berikutnya otomatis bertambah (+1) tanpa bentrok/duplikasi
Teknik ISTQB   : Business Logic Validation & State Retention
Severity       : Major
Priority       : High
================================================================================
```

```
================================================================================
Test Case ID   : REG-FEAT-004
Module         : Tag Properti > Modal Tambah Tag
Ref Scenario   : TAG-SC-006, TAG-SC-038
Tipe Pengujian : UI & Usability Regression
Test Objective : Memverifikasi field input "Warna Label" menggunakan komponen visual Color Picker bukan input teks manual
Preconditions  : Modal Tambah Tag Properti terbuka
Test Data      : Warna Hex: "#FF5733" (Oranye Kustom)
Test Steps     :
  1. Buka form Tambah Tag Properti.
  2. Periksa elemen input "Warna Label".
  3. Klik elemen input warna untuk memicu popup palet Color Picker.
  4. Pilih salah satu warna visual atau masukkan nilai Hex "#FF5733".
  5. Submit tag dan amati kolom Warna Label di tabel list.
Expected Result: - Komponen input berupa visual Color Picker (<input type="color"> atau widget palette)
                 - Nilai warna yang dipilih tercermin pada indikator preview warna
                 - Setelah disimpan, kotak preview warna di tabel list menampilkan warna tersebut secara akurat
Teknik ISTQB   : GUI Verification & Usability Testing
Severity       : Minor
Priority       : Medium
================================================================================
```

```
================================================================================
Test Case ID   : REG-BUG-005
Module         : Tag Properti > Edit Tag Properti
Ref Scenario   : TAG-SC-036, TAG-SC-043
Tipe Pengujian : Critical Defect Regression (Bug Fix Verification)
Test Objective : Memverifikasi perbaikan bug 404: Sistem tidak lagi menampilkan error "404 Not Found" setelah user menyimpan perubahan data tag properti
Preconditions  : Minimal 1 data tag properti aktif di tabel
Test Data      : Tag ID aktif, perubahan deskripsi: "Deskripsi diperbarui tanpa 404"
Test Steps     :
  1. Akses tabel Tag Properti.
  2. Klik ikon Edit pada salah satu tag.
  3. Lakukan perubahan pada field Deskripsi atau Nama Kelompok.
  4. Klik tombol "Simpan Perubahan".
  5. Amati rute URL dan tampilan respons halaman setelah submit.
Expected Result: - Request update menghasilkan HTTP 200/302 (bukan HTTP 404)
                 - Tidak muncul halaman "404 Page Not Found"
                 - Browser berhasil diarahkan kembali ke tabel Tag Properti dengan pesan sukses
                 - Perubahan data langsung ter-render di tabel
Teknik ISTQB   : State Transition Testing & Error Reproduction
Severity       : Blocker
Priority       : Critical
================================================================================
```

```
================================================================================
Test Case ID   : REG-BUG-006
Module         : Tag Properti > Modal Tambah Tag
Ref Scenario   : TAG-SC-024
Tipe Pengujian : Defect Regression (Data Integrity Verification)
Test Objective : Memverifikasi perbaikan bug duplikasi: Sistem menolak penyimpanan tag baru jika "Nama Kelompok" sudah terdaftar di database
Preconditions  : Terdapat tag dengan Nama Kelompok "Dparagon" di database
Test Data      : Nama Kelompok: "Dparagon" (Duplikat)
Test Steps     :
  1. Buka modal Tambah Tag Properti.
  2. Masukkan Nama Kelompok "Dparagon" (persis dengan yang sudah ada).
  3. Lengkapi field lain dan klik tombol "Simpan".
Expected Result: - Sistem mendeteksi adanya duplikasi nama kelompok
                 - Penyimpanan diblokir
                 - Muncul pesan error/validasi: "Nama kelompok sudah digunakan"
                 - Tidak ada data ganda yang tersimpan di tabel
Teknik ISTQB   : Equivalence Partitioning (Unique Constraint Negative)
Severity       : Major
Priority       : High
================================================================================
```

```
================================================================================
Test Case ID   : REG-BUG-007
Module         : Tag Properti > Modal Edit Tag
Ref Scenario   : TAG-SC-033
Tipe Pengujian : Defect Regression (State Retention Verification)
Test Objective : Memverifikasi perbaikan bug prefill: Dropdown "Jenis Mitra" pada modal Edit Tag Properti ter-prefill sesuai nilai data yang tersimpan
Preconditions  : Terdapat tag yang memiliki nilai Jenis Mitra "Badan Usaha"
Test Data      : Tag tersimpan dengan Jenis Mitra: "Badan Usaha"
Test Steps     :
  1. Cari baris tag yang memiliki data Jenis Mitra "Badan Usaha".
  2. Klik ikon Edit (pensil) pada baris tersebut.
  3. Amati elemen dropdown "Jenis Mitra" pada modal yang terbuka.
Expected Result: - Dropdown "Jenis Mitra" otomatis memilih opsi "Badan Usaha" (selected)
                 - Dropdown TIDAK menampilkan placeholder default ("Pilih jenis" / kosong)
Teknik ISTQB   : State Retention & GUI Verification
Severity       : Major
Priority       : High
================================================================================
```

---

### Suite C: Modul Registrasi Properti & Kamar

```
================================================================================
Test Case ID   : REG-FEAT-010
Module         : Registrasi Properti > Form Lokasi / Alamat
Tipe Pengujian : Validation Rule Change Regression
Test Objective : Memverifikasi field "URL Maps" bersifat wajib (mandatory/required) dan form menolak submit jika field ini dikosongkan
Preconditions  : Berada di form Registrasi Properti (Bagian Lokasi/Alamat)
Test Data      : URL Maps kosong: "", URL Maps valid: "https://maps.app.goo.gl/xyz123"
Test Steps     :
  1. Buka form Registrasi Properti.
  2. Isi seluruh field data umum dan alamat properti secara lengkap.
  3. Biarkan field "URL Maps" kosong.
  4. Klik tombol "Simpan" / "Lanjutkan".
  5. Amati respons validasi sistem.
  6. Masukkan URL Maps valid ("https://maps.app.goo.gl/xyz123") lalu submit ulang.
Expected Result: - Saat kosong: muncul indikator error/validasi HTML5 "URL Maps wajib diisi" dan form ditahan
                 - Terdapat penanda bintang merah (*) pada label URL Maps
                 - Saat diisi URL Maps valid: form berhasil melanjutkan/disubmit
Teknik ISTQB   : Equivalence Partitioning (Mandatory vs Empty) & Boundary Testing
Severity       : Major
Priority       : High
================================================================================
```

```
================================================================================
Test Case ID   : REG-FEAT-011
Module         : Registrasi Properti > Tab Foto Properti
Tipe Pengujian : Feature Regression (Multi-Upload Verification)
Test Objective : Memverifikasi bahwa user dapat mengunggah beberapa file foto sekaligus (multi-upload) untuk setiap kategori foto properti
Preconditions  : Berada di tab "Foto Properti" pada form Registrasi Properti
Test Data      : 3 file gambar format JPG/PNG per kategori (Kamar, Kamar Mandi, Bangunan)
Test Steps     :
  1. Akses tab "Foto Properti".
  2. Klik area upload pada kategori "Foto Kamar".
  3. Pilih 3 file gambar sekaligus pada dialog file explorer.
  4. Amati tampilan thumbnail preview foto.
  5. Ulangi multi-upload pada kategori "Foto Kamar Mandi" dan "Foto Fasad/Bangunan".
Expected Result: - Elemen upload mendukung atribut multiple selection
                 - Ketiga thumbnail gambar ter-render lengkap di bawah kategori yang bersangkutan
                 - Setiap foto memiliki opsi hapus/preview individual
                 - Seluruh foto berhasil diunggah saat registrasi properti disubmit
Teknik ISTQB   : Boundary Value Analysis & Multi-Upload Testing
Severity       : Major
Priority       : High
================================================================================
```

```
================================================================================
Test Case ID   : REG-FEAT-012
Module         : Registrasi Properti > Fasilitas Kamar
Tipe Pengujian : Feature Regression (Custom Input Verification)
Test Objective : Memverifikasi field Fasilitas Kamar mendukung input penambahan fasilitas custom di luar daftar fasilitas default sistem
Preconditions  : Berada pada form registrasi kamar / tipe kamar
Test Data      : Fasilitas custom baru: "Smart Door Lock Otomatis", "Air Purifier HEPA"
Test Steps     :
  1. Buka tab/bagian "Fasilitas Kamar".
  2. Pilih fasilitas default yang tersedia (misal: AC, WiFi, Kasur).
  3. Masukkan teks fasilitas custom pada input "Fasilitas Tambahan" (misal: "Smart Door Lock Otomatis").
  4. Klik tombol "+ Tambah Fasilitas" atau tekan tombol Enter.
  5. Simpan data tipe kamar/properti.
Expected Result: - Fasilitas custom berhasil ditambahkan sebagai badge/chips baru
                 - Fasilitas custom dapat dihapus jika user mengklik tanda silang (x) pada badge
                 - Fasilitas custom tersimpan dan muncul pada detail spesifikasi kamar
Teknik ISTQB   : Equivalence Partitioning & Usability Testing
Severity       : Medium
Priority       : High
================================================================================
```

```
================================================================================
Test Case ID   : REG-BUG-015
Module         : Registrasi Properti > Form Kontak Properti
Tipe Pengujian : Defect Regression (Input Sanitization Verification)
Test Objective : Memverifikasi perbaikan bug pada field "Nomor Ponsel" kontak properti agar menolak input karakter huruf/simbol
Preconditions  : Form Kontak Properti terbuka
Test Data      : Input nomor telepon invalid: "0813abc#$567"
Test Steps     :
  1. Akses form bagian Kontak Pengelola / PIC Properti.
  2. Masukkan karakter alfabet dan simbol pada input "Nomor Ponsel".
  3. Klik tombol "Simpan" / "Lanjutkan".
Expected Result: - Karakter huruf/simbol otomatis terfilter (tidak dapat diketik) ATAU
                 - Muncul alert validasi "Nomor ponsel hanya boleh berisi angka"
                 - Form menahan penyimpanan data nomor telepon tidak valid
Teknik ISTQB   : Equivalence Partitioning (Invalid Alphabetic) & Security
Severity       : Major
Priority       : High
================================================================================
```

```
================================================================================
Test Case ID   : REG-FEAT-016
Module         : Registrasi Properti > Data Properti
Tipe Pengujian : Validation Rule Regression (Unique Constraint)
Test Objective : Memvalidasi sistem menolak pendaftaran properti baru jika "Nama Properti" sudah digunakan di sistem (Duplicate Check)
Preconditions  : Terdapat properti eksisting bernama "D'Paragon Seturan 1" di database
Test Data      : Nama Properti duplikat: "D'Paragon Seturan 1"
Test Steps     :
  1. Buka form Registrasi Properti baru.
  2. Masukkan Nama Properti "D'Paragon Seturan 1" (sama persis dengan yang sudah ada).
  3. Lengkapi field lainnya secara valid.
  4. Klik tombol "Simpan Properti".
Expected Result: - Sistem mendeteksi duplikasi nama properti
                 - Penyimpanan ditolak
                 - Muncul pesan validasi: "Nama properti sudah terdaftar, gunakan nama lain"
                 - Properti duplikat tidak tersimpan di database
Teknik ISTQB   : Unique Constraint Testing & Equivalence Partitioning
Severity       : Major
Priority       : High
================================================================================
```

```
================================================================================
Test Case ID   : REG-FEAT-017
Module         : Registrasi Properti > Data Properti
Tipe Pengujian : Validation Rule Regression (Unique Constraint)
Test Objective : Memvalidasi sistem menolak pendaftaran properti baru jika "Alamat Properti" persis sama dengan properti eksisting
Preconditions  : Terdapat properti eksisting dengan Alamat "Jl. Seturan Raya No. 99, Sleman, Yogyakarta"
Test Data      : Alamat Properti duplikat: "Jl. Seturan Raya No. 99, Sleman, Yogyakarta"
Test Steps     :
  1. Buka form Registrasi Properti baru.
  2. Masukkan Alamat Properti yang identik dengan properti yang sudah terdaftar sebelumnya.
  3. Lengkapi field lainnya.
  4. Klik tombol "Simpan Properti".
Expected Result: - Sistem memberikan notifikasi peringatan/validasi duplikasi alamat properti
                 - Sistem meminta verifikasi apakah properti di lokasi tersebut memang cabang/unit baru atau duplikasi yang tidak disengaja
                 - Mencegah registrasi properti ganda pada alamat yang sama
Teknik ISTQB   : Unique Constraint Testing & Boundary Testing
Severity       : Major
Priority       : High
================================================================================
```
