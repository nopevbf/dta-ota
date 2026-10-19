# Dokumen Spesifikasi Test Case: Menu Tag Properti (ISTQB Standard)

- **Aplikasi / Modul**: Sistem Manajemen D'Paragon - Menu Tag Properti
- **Target URL**: `https://management.dparagon7.persona-it.com/partner/property-tags`
- **Referensi Dokumen**: [Google Spreadsheet QA - Menu Tag Properti (gid=1620428578)](https://docs.google.com/spreadsheets/d/1NCZ-DhyVEJdUqinlM1oVKANZ4IBpBiYSnz_Qs1duQMA/edit?gid=1620428578#gid=1620428578)
- **Cakupan Pengujian**: **34 Test Case Aktif (Status: Passed)**. 7 Skenario berstatus *Obsolete* dikecualikan.
- **Standar Format**: ISTQB (International Software Testing Qualifications Board) — ISO/IEC/IEEE 29119-3
- **Teknik Pengujian Digunakan**:
  - Equivalence Partitioning (EP)
  - Boundary Value Analysis (BVA)
  - State Transition Testing (ST)
  - Decision Table Testing (DT)
  - GUI Verification & Usability Testing
  - Defect Reproduction & Error Guessing

---

## 1. Ringkasan Eksekutif & RTM Matrix

| Modul / Sub-Fitur | Rentang Scenario ID | Total TC Aktif | Status: Passed | Obsolete (Dikecualikan) |
| :--- | :--- | :---: | :---: | :---: |
| **1. Halaman Tag Properti (List, Filter & Aksi)** | `TAG-SC-001` - `TAG-SC-015` | 13 | 13 | 3 (`TAG-SC-009`, `TAG-SC-016`, `TAG-SC-044`) |
| **2. Modal "Tambah Tag Properti"** | `TAG-SC-018` - `TAG-SC-028` | 9 | 9 | 4 (`TAG-SC-023`, `TAG-SC-029`, `TAG-SC-030`, `TAG-SC-031`) |
| **3. Modal "Edit Tag Properti"** | `TAG-SC-032` - `TAG-SC-043` | 12 | 12 | 0 |
| **TOTAL KESELURUHAN** | | **34** | **34** | **(7 Dikeluarkan)** |

---

## 1.1 Penyelarasan Terhadap Arsitektur e2e Framework (@e2e-dev/web)

Untuk mendukung eksekusi otomatis yang andal, efisien, dan deterministik, setiap skenario pengujian dipetakan ke dalam konvensi resmi **e2e framework**:

1. **Test Runner & Engine**:
   - Engine: `@e2e-dev/web` (Playwright-backed browser engine).
   - Test Runner: `e2e` (v0.19.0).
   - Test File Otomasi: [`tests/mitra/tag-properti.e2e.ts`](file:///d:/Project/2026/Dparagon/DTA-OTA/tests/mitra/tag-properti.e2e.ts).

2. **Fixtures & Credential Management**:
   - `browser` (`Browser`): Navigasi halaman, observasi DOM, evaluasi context script.
   - `app` (`App`): Pengambilan bukti screenshot visual ke `reports/mitra/screenshots/`.
   - `screen` (`Screen`): Interaksi semantik berbasis role (`getByRole`, `getByLabel`).
   - `credentials`: Pengambilan kredensial manajemen terenkripsi dari `credentials.user('manajemen')`.

3. **Assertion & Polling Strategy**:
   - Assertion deterministik menggunakan `expect(locator).toBeVisible()`, `expect(locator).toHaveValue(...)`, `expect(browser).toHaveURL(...)`.
   - Menggunakan `expect.poll` untuk operasi asinkron (update status tabel, debounce search input).

4. **Perintah Eksekusi CLI**:
   ```bash
   pnpm test:mitra:tag
   ```

---

## 2. Test Suite 1: Halaman "Tag Properti" (List, Filter & Aksi) — 13 Test Cases

| Test Case ID | Ref ID | Test Objective / Skenario | Preconditions | Langkah Pengujian (Test Steps) | Test Data | Hasil yang Diharapkan (Expected Result) | Teknik ISTQB | Prioritas | Severity | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TAG-TC-001** | `TAG-SC-001` | Verifikasi filter "Cari tag..." menyaring data sesuai kata kunci Kode atau Nama Kelompok | Berada di halaman Tag Properti | 1. Ketik kata kunci Kode di input pencarian<br>2. Klik Cari<br>3. Uji ulang dengan Nama Kelompok | Keyword: `TAG-001` / `Dparagon` | Tabel memfilter dan menampilkan data tag properti yang cocok dengan kata kunci | EP | High | Major | **Passed** |
| **TAG-TC-002** | `TAG-SC-002` | Verifikasi filter "Cari tag..." dengan kata kunci yang tidak ada menampilkan empty state aman | Berada di halaman Tag Properti | 1. Masukkan kata kunci acak yang tidak ada di database<br>2. Klik Cari | Keyword: `TAG_TIDAK_ADA_999` | Tampil pesan data kosong tanpa error konsol atau crash sistem | EP (Negative) | Medium | Minor | **Passed** |
| **TAG-TC-003** | `TAG-SC-003` | Verifikasi dropdown filter "Semua Status" menyaring data sesuai status (Aktif/Nonaktif) | Berada di halaman Tag Properti | 1. Buka dropdown filter status<br>2. Pilih "Aktif" lalu klik Cari<br>3. Ubah ke "Nonaktif" lalu klik Cari | Opsi: `Aktif`, `Nonaktif` | Baris tabel hanya menampilkan tag yang statusnya sesuai pilihan dropdown | EP / Decision Table | High | Major | **Passed** |
| **TAG-TC-004** | `TAG-SC-004` | Verifikasi kombinasi filter kata kunci + status menggunakan logika boolean AND | Berada di halaman Tag Properti | 1. Masukkan keyword pencarian<br>2. Pilih dropdown Status<br>3. Klik tombol "Cari" | Keyword + Status `Aktif` | Hanya tag yang memenuhi kedua kriteria secara bersamaan yang ditampilkan | Decision Table | Medium | Major | **Passed** |
| **TAG-TC-005** | `TAG-SC-005` | Verifikasi kolom "Kode" menampilkan kode unik (misal TAG-001) tanpa duplikasi antar-baris | Berada di tabel Tag Properti | 1. Periksa nilai kolom "Kode" pada seluruh baris tabel | Data kode tag | Seluruh baris memiliki Kode Tag unik dengan format standar (`TAG-XXX`) tanpa duplikasi | Data Integrity | Medium | Major | **Passed** |
| **TAG-TC-006** | `TAG-SC-006` | Verifikasi kolom "Warna Label" menampilkan preview kotak warna visual sesuai data | Berada di tabel Tag Properti | 1. Amati tampilan pada kolom "Warna Label" | Kotak warna label | Menampilkan preview visual (kotak/badge) berisi warna sesuai data yang tersimpan, bukan kotak kosong | GUI Verification | Medium | Minor | **Passed** |
| **TAG-TC-007** | `TAG-SC-007` | Verifikasi kolom "Jml Properti" menghitung jumlah properti terafiliasi secara akurat | Tag digunakan oleh sejumlah properti | 1. Periksa angka pada kolom "Jml Properti"<br>2. Cross-check dengan data properti aktif | Counter relasi properti | Jumlah angka properti sesuai persis dengan kuantitas properti yang terhubung dengan tag tersebut | Integration | High | Major | **Passed** |
| **TAG-TC-008** | `TAG-SC-008` | Verifikasi visualisasi badge pada kolom "Status" (hijau untuk Aktif) | Baris tag dengan status berbeda | 1. Periksa styling badge status baris Aktif<br>2. Periksa badge status baris Nonaktif | Status Aktif & Nonaktif | Kolom Status menampilkan badge visual yang konsisten (badge hijau untuk "Aktif") | GUI Verification | Medium | Minor | **Passed** |
| **TAG-TC-010** | `TAG-SC-010` | Verifikasi tombol "+ Tambah" membuka modal "Tambah Tag Properti" dalam kondisi kosong | Halaman Tag Properti terbuka | 1. Klik tombol "+ Tambah Tag Properti"<br>2. Amati isi modal | - | Modal "Tambah Tag Properti" terbuka dengan form bersih/default | State Transition | High | Major | **Passed** |
| **TAG-TC-011** | `TAG-SC-011` | Verifikasi ikon "Edit" (pensil) membuka modal "Edit Tag Properti" dengan data ter-prefill | Minimal 1 tag di tabel | 1. Klik ikon pensil Edit pada baris tag terpilih | Tag terpilih | Modal edit terbuka dengan field nama, deskripsi, warna terisi sesuai data baris | State Transition | High | Major | **Passed** |
| **TAG-TC-012** | `TAG-SC-012` | Verifikasi ikon "Hapus" (tempat sampah) memunculkan dialog konfirmasi sebelum hapus | Minimal 1 tag di tabel | 1. Klik ikon Hapus pada salah satu baris tag | Tag terpilih | Muncul modal/alert konfirmasi "Apakah Anda yakin ingin menghapus tag ini?" | Usability / Safety | High | Major | **Passed** |
| **TAG-TC-013** | `TAG-SC-013` | Validasi proteksi: Sistem menolak/memperingatkan penghapusan tag yang masih memiliki Jml Properti > 0 | Tag sedang dipakai oleh properti (Jml > 0) | 1. Klik tombol Hapus pada tag dengan Jml Properti > 0<br>2. Amati respons sistem | Tag dengan properti terhubung | Sistem menolak penghapusan dan memberikan peringatan bahwa tag masih digunakan oleh properti | Business Rule / Safety | High | Critical | **Passed** |
| **TAG-TC-014** | `TAG-SC-014` | Verifikasi penghapusan tag berhasil saat dikonfirmasi (untuk tag dengan Jml Properti = 0) | Tag dengan Jml Properti = 0 | 1. Klik Hapus pada tag tanpa properti<br>2. Setujui konfirmasi penghapusan | Tag 0 properti | Tag berhasil dihapus dari daftar tabel, data ter-update, dan sistem memunculkan notifikasi: **" Tag berhasil dihapus."** | State Transition | Medium | Major | **Passed** |
| **TAG-TC-015** | `TAG-SC-015` | Verifikasi tampilan tabel saat belum ada data tag sama sekali (Empty State) | Database tag kosong / filter ekstrim | 1. Akses halaman tanpa data tag | Zero records | Tabel menampilkan pesan empty state informatif tanpa layout rusak | GUI Verification | Medium | Minor | **Passed** |

---

## 3. Test Suite 2: Modal "Tambah Tag Properti" — 9 Test Cases

| Test Case ID | Ref ID | Test Objective / Skenario | Preconditions | Langkah Pengujian (Test Steps) | Test Data | Hasil yang Diharapkan (Expected Result) | Teknik ISTQB | Prioritas | Severity | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TAG-TC-018** | `TAG-SC-018` | Validasi sistem menolak "Simpan" jika field mandatory "Nama Kelompok" dikosongkan | Modal Tambah Tag terbuka | 1. Kosongkan field "Nama Kelompok"<br>2. Lengkapi field lain<br>3. Klik "Simpan" | Nama Kelompok: `""` | Sistem menolak submit dan memunculkan peringatan Nama Kelompok wajib diisi | EP (Mandatory) | Critical | Blocker | **Passed** |
| **TAG-TC-019** | `TAG-SC-019` | Verifikasi sistem menerima form tanpa mengisi Jenis Mitra, Deskripsi, dan Warna Label (Opsional) | Modal Tambah Tag terbuka | 1. Isi Nama Kelompok valid<br>2. Biarkan field opsional kosong<br>3. Klik "Simpan" | Field opsional kosong | Form berhasil disimpan (field terbukti opsional tanpa tanda mandatory *) | EP (Optional Positive) | Medium | Minor | **Passed** |
| **TAG-TC-020** | `TAG-SC-020` | Validasi sistem menolak input manual "Kode" yang sudah terdaftar sebelumnya (Duplicate Check) | Modal Tambah Tag terbuka | 1. Masukkan kode tag yang sudah ada (misal: `TAG-001`)<br>2. Lengkapi form dan submit | Kode: `TAG-001` | Sistem menolak penyimpanan dan menampilkan alert duplikasi kode | Unique Constraint EP | Critical | Blocker | **Passed** |
| **TAG-TC-021** | `TAG-SC-021` | Verifikasi sistem menerima format kode tag yang sesuai contoh placeholder | Modal Tambah Tag terbuka | 1. Masukkan format kode baru (misal: `TAG-002`)<br>2. Submit form | Kode: `TAG-002` | Format kode diterima sistem tanpa error | EP (Format Valid) | Medium | Minor | **Passed** |
| **TAG-TC-024** | `TAG-SC-024` | Validasi pencegahan duplikasi nama kelompok dengan kelompok tag yang sudah ada | Modal Tambah Tag terbuka | 1. Masukkan "Nama Kelompok" yang sudah terdaftar<br>2. Klik "Simpan" | Nama Kelompok duplikat | Sistem menolak simpan dan memunculkan notifikasi duplikasi nama kelompok | Unique Constraint EP | Medium | Major | **Passed** |
| **TAG-TC-025** | `TAG-SC-025` | Verifikasi dropdown "Jenis Mitra" menampilkan pilihan dan dapat dipilih dengan benar | Modal Tambah Tag terbuka | 1. Buka dropdown "Jenis Mitra"<br>2. Pilih opsi (misal: "Badan Usaha") | Opsi: `Badan Usaha` | Pilihan berhasil terseleksi pada dropdown | GUI / Functional | Medium | Minor | **Passed** |
| **TAG-TC-026** | `TAG-SC-026` | Verifikasi field "Deskripsi" (textarea) menerima teks multi-baris | Modal Tambah Tag terbuka | 1. Ketik teks multi-baris pada textarea Deskripsi<br>2. Verifikasi karakter dan enter | Teks multi-baris | Field menerima input teks panjang/multi-baris secara rapi | Usability | Low | Minor | **Passed** |
| **TAG-TC-028** | `TAG-SC-028` | Verifikasi tag baru yang berhasil disimpan langsung muncul di tabel list | Modal Tambah Tag | 1. Submit tag baru dengan nama unik<br>2. Periksa baris tabel teratas | Data tag baru valid | Tag baru tampil di tabel dengan Jml Properti = 0 dan Status default "Aktif" | Integration / UC | Critical | Major | **Passed** |

---

## 4. Test Suite 3: Modal "Edit Tag Properti" — 12 Test Cases

| Test Case ID | Ref ID | Test Objective / Skenario | Preconditions | Langkah Pengujian (Test Steps) | Test Data | Hasil yang Diharapkan (Expected Result) | Teknik ISTQB | Prioritas | Severity | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TAG-TC-032** | `TAG-SC-032` | Verifikasi field Nama Kelompok, Deskripsi, Warna Label, dan Status ter-prefill sesuai data | Membuka modal Edit Tag | 1. Klik ikon Edit pada salah satu tag<br>2. Amati seluruh nilai input modal | Data tag terpilih | Seluruh input terisi otomatis identik dengan data tag tersimpan | GUI / Retention | High | Major | **Passed** |
| **TAG-TC-033** | `TAG-SC-033` | Verifikasi dropdown "Jenis Mitra" ikut ter-prefill sesuai data tersimpan (bukan placeholder default) | Tag memiliki Jenis Mitra tersimpan | 1. Buka modal Edit pada tag dengan Jenis Mitra "Badan Usaha"<br>2. Amati nilai dropdown Jenis Mitra | Jenis Mitra: `Badan Usaha` | Dropdown menampilkan nilai terpilih "Badan Usaha" (bukan default placeholder "Pilih jenis") | State Retention | High | Major | **Passed** |
| **TAG-TC-034** | `TAG-SC-034` | Verifikasi field "Kode" bersifat immutable (tidak ditampilkan/tidak dapat diedit) pada modal Edit | Modal Edit Tag terbuka | 1. Periksa field Kode pada modal Edit | Kode Tag | Field Kode tidak dapat dimodifikasi (atau disembunyikan) sesuai prinsip immutability kode | Data Security | Medium | Minor | **Passed** |
| **TAG-TC-035** | `TAG-SC-035` | Validasi sistem menolak "Simpan" jika field "Nama Kelompok" dikosongkan saat proses edit | Modal Edit Tag terbuka | 1. Hapus isi input "Nama Kelompok"<br>2. Klik "Simpan Perubahan" | Nama Kelompok: `""` | Sistem menolak perubahan dan memunculkan validasi Nama Kelompok wajib diisi | EP (Mandatory Negative) | Critical | Blocker | **Passed** |
| **TAG-TC-036** | `TAG-SC-036` | Verifikasi perubahan "Nama Kelompok" tersimpan dengan benar dan tabel tidak error 404 | Modal Edit Tag terbuka | 1. Ubah Nama Kelompok menjadi nama baru<br>2. Klik "Simpan Perubahan" | Nama baru unik | Sistem berhasil menyimpan, modal tertutup, redirect sukses tanpa 404, dan nama baru tampil | State Transition | High | Critical | **Passed** |
| **TAG-TC-037** | `TAG-SC-037` | Verifikasi perubahan "Jenis Mitra" pada modal Edit tersimpan dan tercermin di tabel | Modal Edit Tag terbuka | 1. Ganti opsi Jenis Mitra<br>2. Klik Simpan<br>3. Amati nilai pada tabel list | Jenis Mitra baru | Perubahan Jenis Mitra langsung tercermin pada kolom tabel yang bersangkutan | State Transition | Medium | Major | **Passed** |
| **TAG-TC-038** | `TAG-SC-038` | Verifikasi perubahan "Warna Label" tersimpan dan preview warna visual di tabel ikut ter-update | Modal Edit Tag terbuka | 1. Ubah warna label<br>2. Klik Simpan<br>3. Periksa preview warna di tabel | Warna hex baru | Preview kotak warna pada tabel menampilkan warna baru yang dipilih | GUI / State Transition | Medium | Minor | **Passed** |
| **TAG-TC-039** | `TAG-SC-039` | Verifikasi dropdown "Status" dapat diubah dari Aktif menjadi Nonaktif dan sebaliknya | Modal Edit Tag terbuka | 1. Ubah dropdown Status dari "Aktif" ke "Nonaktif"<br>2. Klik Simpan | Status: `Nonaktif` | Status berhasil diperbarui dan badge status di tabel berubah menjadi Nonaktif | State Transition | High | Major | **Passed** |
| **TAG-TC-040** | `TAG-SC-040` | Verifikasi mengubah Status tag menjadi Nonaktif tidak menghapus relasi properti terafiliasi | Tag memiliki Jml Properti > 0 | 1. Ubah status tag menjadi "Nonaktif"<br>2. Simpan perubahan<br>3. Periksa kolom Jml Properti | Tag aktif berproperti | Tag berstatus Nonaktif tetapi angka "Jml Properti" tetap sama (relasi data tidak putus) | Data Integrity | High | Critical | **Passed** |
| **TAG-TC-041** | `TAG-SC-041` | Verifikasi tombol "Batal" menutup modal tanpa menyimpan perubahan yang sudah diketik | Modal Edit Tag diubah | 1. Ubah nilai input Nama Kelompok<br>2. Klik tombol "Batal" | Perubahan dibatalkan | Modal tertutup dan nilai data tag di tabel tidak berubah | State Transition | Low | Minor | **Passed** |
| **TAG-TC-042** | `TAG-SC-042` | Verifikasi tombol "X" (close) berfungsi menutup modal dengan perilaku identik tombol Batal | Modal Edit Tag diubah | 1. Ubah nilai input<br>2. Klik tombol "X" di pojok header modal | Close action | Modal tertutup tanpa menyimpan perubahan data | State Transition | Low | Minor | **Passed** |
| **TAG-TC-043** | `TAG-SC-043` | Verifikasi data hasil edit langsung ter-render di tabel list secara reaktif tanpa refresh manual | Modal Edit Tag | 1. Simpan perubahan data tag<br>2. Amati tabel baris terkait | Modifikasi data | Nilai baru langsung terlihat di tabel list secara instan | Reactivity / GUI | Medium | Major | **Passed** |

---

## 5. Daftar Skenario Dikeluarkan (Obsolete List)
Terdapat 7 skenario pada dokumen sumber yang resmi **dikeluarkan** (*Obsolete / decline SA*):
1. `TAG-SC-009`: Kolom "Dibuat Oleh" (decline SA).
2. `TAG-SC-016`: Subjudul statis halaman deskripsi (decline SA / trivial).
3. `TAG-SC-023`: Validasi nama kelompok berisi simbol/spasi (decline SA).
4. `TAG-SC-029`: Kolom Dibuat Oleh terisi otomatis sesuai login (decline SA).
5. `TAG-SC-030`: Tombol Batal pada modal tambah (obsolete standar).
6. `TAG-SC-031`: Tombol X pada modal tambah (obsolete standar).
7. `TAG-SC-044`: Kolom Tanggal Dibuat (decline SA).
