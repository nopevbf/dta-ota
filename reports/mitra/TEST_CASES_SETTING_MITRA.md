# Dokumen Spesifikasi Test Case: Menu Setting Mitra (ISTQB Standard)

- **Aplikasi / Modul**: Sistem Manajemen D'Paragon - Menu Setting Mitra
- **Target URL**: `https://management.dparagon7.persona-it.com/` (Path: `/partner/mitra` atau `/setting/mitra`)
- **Referensi Dokumen**: [DOKUMEN TEST SCENARIO QA - MENU SETTING MITRA](https://docs.google.com/spreadsheets/d/1NCZ-DhyVEJdUqinlM1oVKANZ4IBpBiYSnz_Qs1duQMA/edit?gid=0#gid=0)
- **Cakupan Dokumen**: **57 Test Case Aktif & Tervalidasi (Status: Passed & On Progress)**. Seluruh skenario *Obsolete* telah dieksklusikan.
- **Standar Format**: ISTQB (International Software Testing Qualifications Board) — ISO/IEC/IEEE 29119-3
- **Teknik Pengujian Digunakan**:
  - Equivalence Partitioning (EP)
  - Boundary Value Analysis (BVA)
  - State Transition Testing (ST)
  - Decision Table Testing (DT)
  - Use Case Testing (UC)
  - GUI Verification & Data Integrity Testing

---

## 1. Ringkasan Eksekutif & RTM Matrix

| Modul / Sub-Fitur | Rentang Scenario ID | Total TC Aktif | Status: Passed | Status: On Progress | Status: Obsolete (Dikecualikan) |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **1. Halaman "Daftar Mitra Terdaftar" (List, Tab & Filter)** | `MITRA-SC-001` - `MITRA-SC-021` | 19 | 18 | 1 (`SC-008`) | 1 (`SC-018`) |
| **2. Modal "Tambah Mitra"** | `MITRA-SC-022` - `MITRA-SC-040` | 17 | 16 | 1 (`SC-033`) | 2 (`SC-038`, `SC-039`) |
| **3. Halaman "Detail Mitra"** | `MITRA-SC-041` - `MITRA-SC-054` | 12 | 12 | 0 | 2 (`SC-046`, `SC-049`) |
| **4. Modal "Ubah Data Mitra"** | `MITRA-SC-055` - `MITRA-SC-063` | 9 | 8 | 1 (`SC-058`) | 0 |
| **TOTAL TEST CASES** | | **57** | **54** | **3** | **(5 Dikeluarkan)** |

---

## 1.1 Penyelarasan Terhadap Arsitektur e2e Framework (@e2e-dev/web)

Untuk standardisasi pengujian E2E otomatis, seluruh skenario Setting Mitra telah diselaraskan dengan **e2e framework**:
1. **Automated Test Suites**:
   - `tests/mitra/mitra-list-filter.e2e.ts` (6 tests - List & Filter)
   - `tests/mitra/mitra-modal-crud.e2e.ts` (4 tests - Modal Tambah & Ubah)
   - `tests/mitra/mitra-detail.e2e.ts` (4 tests - Detail & Breadcrumb)
   - `tests/mitra/mitra-onprogress.e2e.ts` (3 tests - On Progress verification)
2. **Kredensial & Autentikasi**:
   - Menggunakan `credentials.user('manajemen')` dari `e2e` config.
3. **Command CLI**:
   ```bash
   pnpm test:mitra
   ```
   *Hasil verifikasi*: 17/17 tests Passed (100% Pass Rate).

---

## 2. Test Suite 1: Halaman "Daftar Mitra Terdaftar" (List, Tab & Filter) — 19 Test Cases

| Test Case ID | Ref ID | Test Objective / Skenario | Preconditions | Langkah Pengujian (Test Steps) | Test Data | Hasil yang Diharapkan (Expected Result) | Teknik ISTQB | Prioritas | Severity | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **MITRA-TC-001** | `MITRA-SC-001` | Verifikasi jumlah data pada tab "Daftar Seluruh Mitra" sesuai badge counter dan jumlah baris tabel | Login sebagai Manajemen, berada di halaman Setting Mitra | 1. Buka tab "Daftar Seluruh Mitra"<br>2. Periksa angka counter badge<br>3. Hitung baris data aktual di tabel | Data mitra tersimpan | Angka counter badge sesuai persis dengan jumlah baris mitra aktual di tabel | GUI / Integrity | High | Major | **Passed** |
| **MITRA-TC-002** | `MITRA-SC-002` | Verifikasi tab "Memiliki Minimal 1 Properti" hanya menampilkan mitra dengan Jumlah Properti ≥ 1 | Berada di halaman Setting Mitra | 1. Klik tab "Memiliki Minimal 1 Properti"<br>2. Cek kolom "Jml Properti"<br>3. Periksa counter badge | Mitra properti: Papa Zola (2), Firman SQA (1) vs Boby Ponomo (0) | Hanya mitra dengan Jml Properti ≥ 1 yang muncul. Mitra dengan 0 properti tidak ditampilkan. Badge sesuai | EP / BVA | High | Major | **Passed** |
| **MITRA-TC-003** | `MITRA-SC-003` | Verifikasi tab "Properti Sedang Proses Approval" hanya memfilter mitra yang memiliki properti berstatus approval | Berada di halaman Setting Mitra | 1. Klik tab "Properti Sedang Proses Approval"<br>2. Amati status properti mitra yang tampil | Mitra berproperti in-approval | Hanya menampilkan mitra yang memiliki properti dalam proses approval; badge counter sesuai data aktual | EP | High | Major | **Passed** |
| **MITRA-TC-004** | `MITRA-SC-004` | Verifikasi filter yang telah diterapkan tidak hilang saat pengguna berpindah antar-tab | Filter aktif terpasang pada satu tab | 1. Terapkan filter keyword atau status<br>2. Pindah ke tab lain<br>3. Kembali ke tab semula | Filter aktif | Nilai filter dan hasil penyaringan tetap bertahan (state retention) | State Transition | Medium | Minor | **Passed** |
| **MITRA-TC-005** | `MITRA-SC-005` | Verifikasi filter "Cari Nama / Email" menampilkan data yang sesuai kata kunci | Berada pada tabel mitra | 1. Ketik kata kunci nama di input search<br>2. Klik tombol "Cari"<br>3. Uji ulang dengan kata kunci email | Keyword: `Boby`, `lodod41077@crybio.com` | Tabel memfilter baris yang memuat nama atau email yang sesuai | EP | High | Major | **Passed** |
| **MITRA-TC-006** | `MITRA-SC-006` | Verifikasi filter "Cari Nama / Email" dengan kata kunci yang tidak ada menampilkan empty state tanpa error | Berada pada tabel mitra | 1. Masukkan keyword acak yang tidak terdaftar<br>2. Klik tombol "Cari" | Keyword: `XYZ_TIDAK_DITEMUKAN_999` | Tampil pesan data kosong / empty state secara rapi tanpa error runtime | EP (Negative) | Medium | Minor | **Passed** |
| **MITRA-TC-007** | `MITRA-SC-007` | Verifikasi dropdown filter "Status" menyaring data sesuai status (Pending / Approved) | Berada pada tabel mitra | 1. Pilih dropdown status "Pending" lalu klik Cari<br>2. Ganti opsi ke "Approved" lalu klik Cari | Opsi: `Pending`, `Approved` | Tabel menampilkan hanya mitra yang statusnya sesuai pilihan dropdown | EP / Decision Table | High | Major | **Passed** |
| **MITRA-TC-008** | `MITRA-SC-008` | Verifikasi dropdown filter "Tag Kelompok" (Kelompok Kerjasama) menyaring data sesuai tag terpilih | Berada pada tabel mitra | 1. Buka dropdown Tag Kelompok<br>2. Pilih salah satu tag kerjasama<br>3. Klik tombol "Cari" | Opsi tag kerjasama aktif | Tabel menyaring data sesuai tag kelompok kerjasama terpilih (evaluasi tampilan kolom di tabel) | EP | Medium | Minor | **On Progress** |
| **MITRA-TC-009** | `MITRA-SC-009` | Validasi kombinasi filter Nama/Email + Status + Tag Kelompok menggunakan logika boolean AND | Berada pada tabel mitra | 1. Input keyword Nama/Email<br>2. Pilih opsi Status<br>3. Pilih Tag Kelompok<br>4. Klik tombol "Cari" | Kombinasi multi-kriteria | Hanya baris yang memenuhi ketiga kriteria filter secara bersamaan yang ditampilkan (logika AND) | Decision Table | High | Major | **Passed** |
| **MITRA-TC-010** | `MITRA-SC-010` | Verifikasi visualisasi badge status mitra: kuning untuk Pending dan hijau untuk Approved | Berada pada tabel mitra | 1. Cek baris mitra Pending<br>2. Cek baris mitra Approved | Variasi status mitra | Kolom Status menampilkan badge kuning untuk "Pending" dan hijau untuk "Approved" | GUI Verification | Medium | Minor | **Passed** |
| **MITRA-TC-012** | `MITRA-SC-012` | Verifikasi kolom "Aksi" pada mitra Pending menampilkan 3 ikon: Lihat, Ubah, Setujui | Terdapat mitra status Pending di tabel | 1. Temukan baris mitra status Pending<br>2. Amati tombol pada kolom Aksi | Mitra Pending | Kolom Aksi memuat 3 tombol aksi: Lihat (mata), Ubah (pensil), dan Setujui (centang) | GUI / Functional | High | Major | **Passed** |
| **MITRA-TC-013** | `MITRA-SC-013` | Verifikasi kolom "Aksi" pada mitra Approved hanya menampilkan 2 ikon: Lihat, Ubah | Terdapat mitra status Approved di tabel | 1. Temukan baris mitra status Approved<br>2. Amati tombol pada kolom Aksi | Mitra Approved | Kolom Aksi memuat tepat 2 tombol aksi: Lihat dan Ubah (tanpa ikon Setujui) | GUI / Functional | High | Major | **Passed** |
| **MITRA-TC-014** | `MITRA-SC-014` | Verifikasi tombol aksi "Lihat" mengarahkan ke halaman Detail Mitra yang sesuai | Berada pada tabel mitra | 1. Klik ikon "Lihat" pada salah satu baris mitra | Baris mitra terpilih | Browser bernavigasi ke halaman Detail Mitra yang datanya sesuai dengan baris yang diklik | Use Case / Nav | High | Major | **Passed** |
| **MITRA-TC-015** | `MITRA-SC-015` | Verifikasi tombol aksi "Ubah" membuka modal "Ubah Data Mitra" dengan form ter-prefill | Berada pada tabel mitra | 1. Klik ikon "Ubah" pada baris mitra | Baris mitra terpilih | Modal "Ubah Data Mitra" terbuka dengan input nama & nomor HP terisi sesuai data baris | State Transition | High | Major | **Passed** |
| **MITRA-TC-016** | `MITRA-SC-016` | Verifikasi ikon "Setujui" langsung mengubah status mitra dari Pending menjadi Approved | Mitra status Pending di tabel | 1. Klik ikon centang "Setujui" pada baris Pending<br>2. Konfirmasi tindakan (jika ada) | Data uji: Boby Ponomo (`MTR-0006`) | Status mitra pada baris langsung berganti menjadi "Approved" tanpa perlu membuka halaman detail | State Transition | High | Critical | **Passed** |
| **MITRA-TC-017** | `MITRA-SC-017` | Verifikasi tombol "+ Tambah Mitra" membuka modal dengan form dalam kondisi kosong | Halaman Setting Mitra terbuka | 1. Klik tombol "+ Tambah Mitra"<br>2. Amati seluruh input pada modal | - | Modal "Tambah Mitra" terbuka dengan semua field input kosong/default | State Transition | High | Major | **Passed** |
| **MITRA-TC-019** | `MITRA-SC-019` | Verifikasi tampilan tabel saat tidak ada data mitra sama sekali (Empty State) | Tabel dalam kondisi 0 data | 1. Akses halaman tanpa data mitra di database | Database kosong | Tabel menampilkan empty state yang informatif dan layout tetap utuh | GUI Verification | Medium | Minor | **Passed** |
| **MITRA-TC-020** | `MITRA-SC-020` | Verifikasi mitra dengan Jumlah Properti = 0 tidak muncul di tab "Memiliki Minimal 1 Properti" | Terdapat mitra berproperti 0 | 1. Buka tab "Memiliki Minimal 1 Properti"<br>2. Telusuri seluruh data tabel | Mitra: Boby Ponomo, Mitra AA, Mitra A | Mitra yang memiliki 0 properti dipastikan tidak muncul pada tab ini | BVA (Boundary Zero) | Medium | Major | **Passed** |
| **MITRA-TC-021** | `MITRA-SC-021` | Verifikasi tombol "Reset" membersihkan filter dan mengembalikan tampilan tabel semula | Filter pencarian/status aktif | 1. Klik tombol "Reset"<br>2. Amati input filter dan baris tabel | Filter aktif | Semua input filter kembali kosong/default dan tabel menampilkan kembali seluruh daftar mitra | State Transition | High | Major | **Passed** |

---

## 3. Test Suite 2: Modal "Tambah Mitra" — 17 Test Cases

| Test Case ID | Ref ID | Test Objective / Skenario | Preconditions | Langkah Pengujian (Test Steps) | Test Data | Hasil yang Diharapkan (Expected Result) | Teknik ISTQB | Prioritas | Severity | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **MITRA-TC-022** | `MITRA-SC-022` | Validasi sistem menolak submit jika field mandatory "Nama Depan" dikosongkan | Modal Tambah Mitra terbuka | 1. Kosongkan "Nama Depan"<br>2. Isi field mandatory lainnya<br>3. Klik "Simpan Mitra" | Nama Depan: `""` | Sistem menolak submit dan memunculkan notifikasi/pesan validasi bahwa Nama Depan wajib diisi | EP (Mandatory) | Critical | Blocker | **Passed** |
| **MITRA-TC-023** | `MITRA-SC-023` | Validasi sistem menolak submit jika field mandatory "Email" dikosongkan | Modal Tambah Mitra terbuka | 1. Kosongkan "Email"<br>2. Isi Nama Depan, Password, Konfirmasi valid<br>3. Klik "Simpan Mitra" | Email: `""` | Sistem menolak submit dan menandai field Email wajib diisi | EP (Mandatory) | Critical | Blocker | **Passed** |
| **MITRA-TC-024** | `MITRA-SC-024` | Validasi sistem menolak submit jika field mandatory "Password" dikosongkan | Modal Tambah Mitra terbuka | 1. Kosongkan "Password"<br>2. Isi field mandatory lainnya<br>3. Klik "Simpan Mitra" | Password: `""` | Sistem menolak submit dan meminta password diisi | EP (Mandatory) | Critical | Blocker | **Passed** |
| **MITRA-TC-025** | `MITRA-SC-025` | Validasi sistem menolak submit jika "Konfirmasi Password" dikosongkan | Modal Tambah Mitra terbuka | 1. Isi Password valid<br>2. Kosongkan "Konfirmasi Password"<br>3. Klik "Simpan Mitra" | Konfirmasi: `""` | Sistem menolak submit dan meminta konfirmasi password diisi | EP (Mandatory) | Critical | Blocker | **Passed** |
| **MITRA-TC-026** | `MITRA-SC-026` | Verifikasi sistem menerima penyimpanan form tanpa mengisi "Nama Belakang" dan "No. HP" (Field Opsional) | Modal Tambah Mitra terbuka | 1. Lengkapi field mandatory<br>2. Kosongkan Nama Belakang & No HP<br>3. Klik "Simpan Mitra" | Nama Belakang: `""`, No HP: `""` | Form berhasil disimpan (field terbukti opsional tanpa penanda mandatory *) | EP (Optional Positive) | Medium | Minor | **Passed** |
| **MITRA-TC-027** | `MITRA-SC-027` | Validasi sistem menolak input "Email" dengan format tidak valid (tanpa @ / domain) | Modal Tambah Mitra terbuka | 1. Masukkan string email tidak valid<br>2. Lengkapi form dan submit | Email: `formatemailtidaksah` | Muncul pesan kesalahan format email (validasi format email HTML5/backend) | EP (Invalid Format) | High | Major | **Passed** |
| **MITRA-TC-028** | `MITRA-SC-028` | Validasi penolakan duplikasi email yang sudah terdaftar di sistem (Duplicate Check) | Modal Tambah Mitra terbuka | 1. Masukkan email yang sudah terdaftar di database<br>2. Lengkapi form dan klik "Simpan Mitra" | Email: `lodod41077@crybio.com` | Sistem menolak penyimpanan dan menampilkan alert "Email sudah terdaftar" | Error Guessing / Rule | High | Critical | **Passed** |
| **MITRA-TC-029** | `MITRA-SC-029` | Validasi Boundary Value Analysis: Sistem menolak Password dengan panjang kurang dari 7 karakter | Modal Tambah Mitra terbuka | 1. Masukkan password dengan panjang 6 karakter berkombinasi<br>2. Submit form | Password: `Aa1234` (6 karakter) | Sistem menolak dengan pesan validasi "Password minimal 7 karakter" | BVA (Batas Bawah - 1) | High | Major | **Passed** |
| **MITRA-TC-030** | `MITRA-SC-030` | Validasi aturan kompleksitas Password: Menolak password tanpa kombinasi huruf besar, kecil, angka | Modal Tambah Mitra terbuka | 1. Masukkan password ≥ 7 karakter hanya huruf kecil<br>2. Submit form | Password: `hanyahurufkecil` | Sistem menolak dan mewajibkan kombinasi huruf besar, huruf kecil, dan angka | EP (Invalid Rule) | High | Major | **Passed** |
| **MITRA-TC-031** | `MITRA-SC-031` | Verifikasi penerimaan Password yang memenuhi seluruh syarat (≥7 karakter, kombinasi huruf besar, kecil, angka) | Modal Tambah Mitra terbuka | 1. Masukkan password 7 karakter valid<br>2. Isi konfirmasi password yang cocok<br>3. Submit form | Password: `Komb123` | Password diterima sistem tanpa error validasi | BVA (Batas Bawah Valid) | Medium | Minor | **Passed** |
| **MITRA-TC-032** | `MITRA-SC-032` | Validasi sistem menolak submit jika "Konfirmasi Password" tidak sama dengan "Password" | Modal Tambah Mitra terbuka | 1. Input Password: `Password123`<br>2. Input Konfirmasi: `PasswordBeda99`<br>3. Klik "Simpan Mitra" | Nilai password tidak cocok | Sistem menolak submit dengan pesan bahwa konfirmasi password tidak cocok | EP (Mismatch Negative) | Critical | Blocker | **Passed** |
| **MITRA-TC-033** | `MITRA-SC-033` | Validasi sanitasi karakter field "No. HP" menolak input huruf atau simbol | Modal Tambah Mitra terbuka | 1. Masukkan karakter alfabet/simbol pada field No. HP<br>2. Submit form | No HP: `0812abc#$!@` | Sistem membatasi input hanya angka atau memvalidasi format nomor telepon tidak sah | EP / Sanitization | Low | Minor | **On Progress** |
| **MITRA-TC-034** | `MITRA-SC-034` | Verifikasi keamanan UI: Karakter pada field Password dan Konfirmasi Password tersamarkan (Masked) | Modal Tambah Mitra terbuka | 1. Ketik nilai pada input Password<br>2. Ketik nilai pada input Konfirmasi Password | Sembarang karakter | Karakter tersamarkan (`type="password"`) tidak terbaca teks biasa | GUI Security | Medium | Minor | **Passed** |
| **MITRA-TC-035** | `MITRA-SC-035` | Verifikasi aturan bisnis: Mitra baru yang disimpan melalui manajemen langsung berstatus "Approved" | Modal Tambah Mitra terbuka | 1. Simpan mitra baru dengan data valid<br>2. Periksa status mitra yang tercipta di tabel | Form data valid lengkap | Mitra langsung berstatus "Approved" (bukan Pending) sesuai notice di modal | Business Rule | Critical | Critical | **Passed** |
| **MITRA-TC-036** | `MITRA-SC-036` | Verifikasi sistem TIDAK mengirimkan email verifikasi ke mitra baru yang dibuat oleh manajemen | Modal Tambah Mitra terbuka | 1. Simpan mitra baru<br>2. Cek status Email Verified pada detail mitra | Mitra baru | Tidak ada pengiriman email verifikasi; akun langsung siap digunakan sesuai notice modal | Business Rule | Medium | Minor | **Passed** |
| **MITRA-TC-037** | `MITRA-SC-037` | Verifikasi mitra baru yang tersimpan langsung muncul di tabel "Daftar Seluruh Mitra" | Modal Tambah Mitra terbuka | 1. Submit mitra baru dengan nama unik<br>2. Amati pembaruan tabel | Mitra: `Mitra Otomasi QA` | Baris mitra baru langsung tampil di urutan atas tabel daftar mitra | Integration / UC | Critical | Major | **Passed** |
| **MITRA-TC-040** | `MITRA-SC-040` | Verifikasi generate "Kode Mitra" otomatis berurutan format 4 digit (misal: MTR-0007) tanpa duplikasi | Pembuatan mitra baru beruntun | 1. Simpan mitra baru ke-1<br>2. Catat Kode Mitra<br>3. Simpan mitra baru ke-2 | Data serial mitra | Kode Mitra otomatis ter-generate secara sekuensial unik format 4 digit (`MTR-XXXX`) tanpa tabrakan ID | Data Integrity | Medium | Major | **Passed** |

---

## 4. Test Suite 3: Halaman "Detail Mitra" — 12 Test Cases

| Test Case ID | Ref ID | Test Objective / Skenario | Preconditions | Langkah Pengujian (Test Steps) | Test Data | Hasil yang Diharapkan (Expected Result) | Teknik ISTQB | Prioritas | Severity | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **MITRA-TC-041** | `MITRA-SC-041` | Validasi kelengkapan seluruh atribut pada panel "Detail Setting Mitra" sesuai data tersimpan | Berada di halaman Detail Mitra terpilih | 1. Periksa Kode Mitra, PIC Utama, Email, No HP<br>2. Periksa Jml Properti, Jml User, Status, Tgl Gabung, Email Verified | Data mitra tersimpan | Seluruh informasi panel menampilkan data yang identik dengan database master | Data Integrity | Critical | Critical | **Passed** |
| **MITRA-TC-042** | `MITRA-SC-042` | Verifikasi field opsional yang belum terisi menampilkan tanda "-" secara konsisten | Mitra dengan data profil belum lengkap | 1. Periksa field Nama Perusahaan, Kelompok Kerjasama, Jenis Mitra, Skema Komisi | Data profil kosong | Field yang belum terisi secara konsisten menampilkan tanda "-" tanpa layout pecah | GUI Verification | Low | Minor | **Passed** |
| **MITRA-TC-043** | `MITRA-SC-043` | Verifikasi tombol "Setujui Mitra" dan "Tolak Mitra" HANYA muncul saat Status Mitra = Pending | Buka detail mitra Pending | 1. Akses halaman detail mitra berstatus Pending<br>2. Periksa area tombol aksi | Mitra Status Pending | Tombol "Setujui Mitra" dan "Tolak Mitra" tampil dan dapat diklik | State Transition | High | Major | **Passed** |
| **MITRA-TC-044** | `MITRA-SC-044` | Verifikasi tombol "Setujui Mitra" dan "Tolak Mitra" TIDAK muncul saat Status Mitra = Approved | Buka detail mitra Approved | 1. Akses halaman detail mitra berstatus Approved<br>2. Periksa area tombol aksi | Mitra Status Approved | Tombol "Setujui Mitra" dan "Tolak Mitra" tidak muncul di halaman | State Transition | High | Major | **Passed** |
| **MITRA-TC-045** | `MITRA-SC-045` | Validasi klik tombol "Setujui Mitra" mengubah status menjadi Approved dan menyembunyikan tombol | Berada di detail mitra Pending | 1. Klik tombol "Setujui Mitra"<br>2. Konfirmasi dialog persetujuan<br>3. Amati perubahan halaman | Mitra Pending | Status Mitra berubah menjadi "Approved", badge hijau aktif, dan tombol persetujuan otomatis hilang | State Transition | Critical | Critical | **Passed** |
| **MITRA-TC-047** | `MITRA-SC-047` | Verifikasi tabel "Daftar Properti" menampilkan empty state saat Jumlah Properti = 0 | Mitra memiliki 0 properti | 1. Buka bagian/tab "Daftar Properti"<br>2. Amati isi tabel | Mitra 0 properti | Menampilkan teks "Belum ada properti terdaftar." secara informatif | GUI Verification | Medium | Minor | **Passed** |
| **MITRA-TC-048** | `MITRA-SC-048` | Validasi tabel "Daftar Properti" menampilkan data properti yang benar saat mitra memiliki ≥ 1 properti | Mitra memiliki ≥ 1 properti | 1. Buka bagian "Daftar Properti"<br>2. Periksa baris data properti yang tampil | Mitra berproperti aktif | Menampilkan daftar properti yang dimiliki secara lengkap dan valid | Integration | High | Major | **Passed** |
| **MITRA-TC-050** | `MITRA-SC-050` | Verifikasi kolom "Status Akun" pada Daftar User Mitra menampilkan badge yang sesuai | Halaman detail memiliki daftar user | 1. Periksa kolom Status Akun pada tabel user mitra | User mitra | Menampilkan badge status akun yang sesuai (misal: badge hijau "Aktif") | GUI Verification | Medium | Minor | **Passed** |
| **MITRA-TC-051** | `MITRA-SC-051` | Verifikasi tabel "Riwayat Aktivitas" menampilkan pesan empty state saat belum ada riwayat | Mitra baru tanpa aktivitas | 1. Buka bagian "Riwayat Aktivitas"<br>2. Amati isi tabel | Mitra baru | Menampilkan pesan "Belum ada riwayat aktivitas." | GUI Verification | Medium | Minor | **Passed** |
| **MITRA-TC-052** | `MITRA-SC-052` | Verifikasi pencatatan audit log "Riwayat Aktivitas" mencatat aksi baru beserta rincian before & after | Mitra yang baru saja dilakukan aksi persetujuan / ubah data | 1. Lakukan aksi persetujuan atau edit data<br>2. Buka tabel "Riwayat Aktivitas"<br>3. Amati entri riwayat terbaru | Aksi: Setujui / Ubah Data | Entri baru tercatat lengkap dengan Timestamp, PIC Pelaku, jenis aksi, serta perbandingan data sebelum dan sesudah diedit | Audit Trail | High | Major | **Passed** |
| **MITRA-TC-053** | `MITRA-SC-053` | Verifikasi tombol "Ubah" pada panel Detail Setting Mitra membuka modal edit dengan data terisi | Berada pada halaman Detail Mitra | 1. Klik tombol "Ubah" pada panel profil | Data mitra aktif | Modal "Ubah Data Mitra" terbuka dengan input nama & nomor HP terisi sesuai profil mitra | State Transition | High | Major | **Passed** |
| **MITRA-TC-054** | `MITRA-SC-054` | Verifikasi breadcrumb navigasi "Setting Mitra > Detail" berfungsi kembali ke halaman list | Berada pada halaman Detail Mitra | 1. Klik breadcrumb link "Setting Mitra" | Navigasi breadcrumb | Browser kembali ke halaman daftar seluruh mitra | Navigation | Low | Minor | **Passed** |

---

## 5. Test Suite 4: Modal "Ubah Data Mitra" — 9 Test Cases

| Test Case ID | Ref ID | Test Objective / Skenario | Preconditions | Langkah Pengujian (Test Steps) | Test Data | Hasil yang Diharapkan (Expected Result) | Teknik ISTQB | Prioritas | Severity | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **MITRA-TC-055** | `MITRA-SC-055` | Verifikasi prefill data awal pada field Nama Depan, Nama Belakang, dan No. HP di modal ubah | Membuka modal Ubah Data pada mitra tertentu | 1. Klik ikon/tombol Ubah pada mitra<br>2. Amati isi input pada modal | Data mitra tersimpan | Input Nama Depan, Nama Belakang, dan No. HP terisi otomatis sesuai data mitra yang dipilih | GUI / Retention | High | Major | **Passed** |
| **MITRA-TC-056** | `MITRA-SC-056` | Validasi sistem menolak "Simpan Perubahan" jika field mandatory "Nama Depan" dikosongkan | Modal Ubah Data terbuka | 1. Hapus teks pada input "Nama Depan"<br>2. Klik "Simpan Perubahan" | Nama Depan: `""` | Sistem menolak perubahan dan menampilkan alert Nama Depan wajib diisi | EP (Mandatory Negative) | Critical | Blocker | **Passed** |
| **MITRA-TC-057** | `MITRA-SC-057` | Verifikasi penerimaan "Simpan Perubahan" tanpa mengisi Nama Belakang / No. HP (Field Opsional) | Modal Ubah Data terbuka | 1. Pastikan Nama Depan valid<br>2. Kosongkan Nama Belakang dan No. HP<br>3. Klik "Simpan Perubahan" | Field opsional kosong | Data berhasil disimpan tanpa hambatan validasi | EP (Optional Positive) | Medium | Minor | **Passed** |
| **MITRA-TC-058** | `MITRA-SC-058` | Validasi sanitasi karakter No. HP saat diedit menolak huruf atau simbol | Modal Ubah Data terbuka | 1. Ubah No. HP menjadi string mengandung huruf/simbol<br>2. Klik "Simpan Perubahan" | No HP: `0819-XYZ-@@@` | Sistem memvalidasi dan menolak perubahan nomor telepon yang bukan angka murni | EP / Sanitization | Low | Minor | **On Progress** |
| **MITRA-TC-059** | `MITRA-SC-059` | Verifikasi modal ini TIDAK menyediakan field Email dan Password untuk diubah | Modal Ubah Data terbuka | 1. Periksa seluruh daftar field pada modal | Form struktur | Modal hanya menyediakan field identitas profil dasar (Email & Password tidak dapat diubah di modal ini) | Security / Spec | Low | Minor | **Passed** |
| **MITRA-TC-060** | `MITRA-SC-060` | Verifikasi perubahan data berhasil tersimpan dan langsung tercermin di list tabel & halaman detail | Berada di modal Ubah Data | 1. Ubah Nama Depan menjadi nama baru<br>2. Klik "Simpan Perubahan"<br>3. Verifikasi baris tabel & halaman detail | Nama baru: `Mitra Diperbarui` | Perubahan data langsung ter-update di tabel list dan halaman detail secara konsisten | Use Case / Sync | Critical | Major | **Passed** |
| **MITRA-TC-061** | `MITRA-SC-061` | Verifikasi tombol "Batal" menutup modal tanpa menyimpan perubahan yang telah diketik | Modal Ubah Data dengan nilai diubah | 1. Ubah nilai input Nama Depan<br>2. Klik tombol "Batal"<br>3. Cek data di tabel | Perubahan dibatalkan | Modal tertutup dan nilai data mitra tidak berubah | State Transition | Medium | Minor | **Passed** |
| **MITRA-TC-062** | `MITRA-SC-062` | Verifikasi tombol "X" (close) di pojok modal berfungsi sama seperti tombol "Batal" | Modal Ubah Data dengan nilai diubah | 1. Ubah isi form modal<br>2. Klik tombol "X" di header modal | Close action | Modal tertutup tanpa menyimpan perubahan data | State Transition | Low | Minor | **Passed** |
| **MITRA-TC-063** | `MITRA-SC-063` | Validasi sinkronisasi relasi: Perubahan Nama Depan/Belakang di modal otomatis memperbarui "PIC Utama Mitra" di Detail | Di modal Ubah Data Mitra | 1. Ubah Nama Depan & Belakang<br>2. Simpan perubahan<br>3. Buka halaman Detail Mitra<br>4. Periksa kolom "PIC Utama Mitra" | Nama: `Budi` `Santoso` | Kolom "PIC Utama Mitra" pada panel Detail Mitra otomatis ter-update mengikuti nama baru yang digabungkan | Integration / Sync | Medium | Major | **Passed** |

---

## 6. Daftar Skenario Dikeluarkan (Obsolete List)

Untuk transparansi penelusuran audit QA, berikut 5 skenario yang resmi **dikeluarkan** dari Test Case karena berstatus *Obsolete*:
1. `MITRA-SC-018`: Format tanggal bergabung list view disederhanakan mengikuti tampilan live saat ini.
2. `MITRA-SC-038`: Tombol Batal pada Modal Tambah Mitra.
3. `MITRA-SC-039`: Tombol Close (X) pada Modal Tambah Mitra.
4. `MITRA-SC-046`: Aksi tombol Tolak Mitra pada Halaman Detail Mitra.
5. `MITRA-SC-049`: Tabel Daftar User Mitra pada Halaman Detail Mitra.
