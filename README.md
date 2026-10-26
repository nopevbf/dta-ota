# DTA-OTA (D'Paragon Test Automation) 🚀

[![Test Suite Status](https://img.shields.io/badge/Test%20Suite-100%25%20PASS%20(68%2F68)-brightgreen?style=flat-square)](reports/MASTER_TEST_SUMMARY_REPORT.md)
[![Framework](https://img.shields.io/badge/Framework-e2e%20v0.19.0-blue?style=flat-square)](https://github.com/tester-army/e2e)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.12.0-green?style=flat-square)](https://nodejs.org/)
[![Package Manager](https://img.shields.io/badge/pnpm-9.x-orange?style=flat-square)](https://pnpm.io/)
[![QA Standard](https://img.shields.io/badge/QA%20Standard-ISTQB-purple?style=flat-square)](https://www.istqb.org/)
[![Knowledge Graph](https://img.shields.io/badge/Knowledge%20Graph-297%20Nodes%20%7C%20Graphify-blueviolet?style=flat-square)](graphify-out/graph.html)
[![AI Agent Engine](https://img.shields.io/badge/AI%20Engine-Gemini%203.8%20Flash%20%2F%20GPT--4o--mini-informational?style=flat-square)](https://ai.google.dev/)

Repositori pengujian otomatis berbasis **Agentic End-to-End (E2E) Testing** untuk ekosistem portal **D'Paragon Management System & Central Authentication Portal**. Proyek ini mengintegrasikan framework pengujian `e2e` generasi baru yang didukung oleh AI SDK (Google Gemini & OpenAI), browser engine Playwright, arsitektur *Knowledge Graph* Graphify, serta berakar pada standar metodologi penjaminan mutu perangkat lunak internasional **ISTQB (International Software Testing Qualifications Board)**.

---

## 📑 Daftar Isi

- [Ikhtisar & Cakupan Pengujian](#-ikhtisar--cakupan-pengujian)
  - [1. Central Authentication & Registration Portal](#1-central-authentication--registration-portal)
  - [2. Modul Finance BUMD & Fee Management](#2-modul-finance-bumd--fee-management)
  - [3. Modul Setting Mitra OTA & Master Tag Properti](#3-modul-setting-mitra-ota--master-tag-properti)
  - [4. 35-Step Full Regression Lifecycle (`REG-LIFECYCLE-002`)](#4-35-step-full-regression-lifecycle-reg-lifecycle-002)
- [Demo & Laporan Hasil Pengujian (QA Reports)](#-demo--laporan-hasil-pengujian-qa-reports)
  - [Matriks Status Eksekusi QA (STLC Phase 6 Closure)](#matriks-status-eksekusi-qa-stlc-phase-6-closure)
  - [Galeri Bukti Visual & Tangkapan Layar](#galeri-bukti-visual--tangkapan-layar)
- [Arsitektur & Struktur Direktori](#-arsitektur--struktur-direktori)
- [Prasyarat (Prerequisites)](#-prasyarat-prerequisites)
- [Instalasi](#-instalasi)
- [Konfigurasi Lingkungan (.env)](#-konfigurasi-lingkungan-env)
- [Cara Penggunaan (Usage)](#-cara-penggunaan-usage)
  - [1. Eksekusi Menyeluruh Suite](#1-eksekusi-menyeluruh-suite)
  - [2. Pengujian Central Authentication & Registrasi](#2-pengujian-central-authentication--registrasi)
  - [3. Pengujian Modul Finance BUMD](#3-pengujian-modul-finance-bumd)
  - [4. Pengujian Modul Setting Mitra & Tag Properti](#4-pengujian-modul-setting-mitra--tag-properti)
  - [5. Mode Interaktif (Headed Browser) & Debugging](#5-mode-interaktif-headed-browser--debugging)
- [Knowledge Graph Arsitektur (Graphify)](#-knowledge-graph-arsitektur-graphify)
- [Integrasi Model Context Protocol (MCP)](#-integrasi-model-context-protocol-mcp)
- [Panduan Kontribusi (Contributing)](#-panduan-kontribusi-contributing)
- [Lisensi & Kontak](#-lisensi--kontak)

---

## 🔍 Ikhtisar & Cakupan Pengujian

Proyek otomatisasi ini memvalidasi keandalan fungsionalitas, kestabilan logika bisnis, validasi boundary input (*Boundary Value Analysis*), penanganan error (*Equivalence Partitioning*), dan ketahanan alur end-to-end lintas modul pada platform D'Paragon:

### 1. Central Authentication & Registration Portal
*Direktori Uji: [`tests/auth-new-login-roles.e2e.ts`](tests/auth-new-login-roles.e2e.ts), [`tests/auth-new-register-guest.e2e.ts`](tests/auth-new-register-guest.e2e.ts), [`tests/auth-new-register-mitra.e2e.ts`](tests/auth-new-register-mitra.e2e.ts), [`tests/roles-auth.e2e.ts`](tests/roles-auth.e2e.ts), [`tests/auth-flow.e2e.ts`](tests/auth-flow.e2e.ts)*
- **Dismiss Popup & Promo Handler**: Penanganan otomatis banner/modal promo sebelum interaksi login (`TC-AUTH-POPUP-001`).
- **Multi-Role Login Portal**: Verifikasi autentikasi 3 peran (*Superadmin Manajemen*, *Mitra Bisnis*, dan *Tamu/Guest*) serta navigasi redirect ke dashboard masing-masing (`TC-AUTH-MGMT-001`, `TC-AUTH-MITRA-001`, `TC-AUTH-TAMU-001`).
- **Uji Negatif Kredensial**: Deteksi dan validasi pesan galat pada kombinasi email/password yang tidak valid (`TC-AUTH-NEG-001`).
- **Registrasi Tamu (Guest)**: Uji alur pendaftaran tamu, validasi mandatory persetujuan Syarat & Ketentuan, penolakan password mismatch, dan pembuatan akun nyata via dynamic disposable email (`TC-REG-GUEST-001` s/d `004`).
- **Registrasi Kemitraan (Mitra)**: Pendaftaran kemitraan D'Paragon, kepatuhan batas minimum kompleksitas password, persetujuan syarat kemitraan, dan aktivasi akun (`TC-REG-MITRA-001` s/d `004`).
- **Helper Integrasi Temp-Mail**: Pembuatan kotak surat sementara dinamis dan pengecekan inbox aktivasi secara otomatis via [`tests/support/temp-mail.ts`](tests/support/temp-mail.ts).

### 2. Modul Finance BUMD & Fee Management
*Direktori Uji: [`tests/bumd/`](tests/bumd/)*
- **Multi-Step Wizard Creation ([`bumd-create-wizard.e2e.ts`](tests/bumd/bumd-create-wizard.e2e.ts))**: Pengujian wizard formulir 4-langkah (Tab 1 Perusahaan $\rightarrow$ Tab 2 Penanggung Jawab $\rightarrow$ Tab 3 Pimpinan $\rightarrow$ Tab 4 Fee) beserta retensi data saat navigasi maju-mundur.
- **Fee BUMD & Boundary Value Analysis ([`bumd-fee.e2e.ts`](tests/bumd/bumd-fee.e2e.ts))**: Validasi kolom Fee Management dan Fee BUMD pada data grid serta boundary value batas bawah (`0%`) dan batas atas (`100%`).
- **Data Grid, Pencarian & Filter ([`bumd-list-filter.e2e.ts`](tests/bumd/bumd-list-filter.e2e.ts))**: Filter status aktif/non-aktif, pencarian real-time nama instansi/nomor rekening, dan tombol export file Excel.
- **Full CRUD Lifecycle ([`bumd-crud.e2e.ts`](tests/bumd/bumd-crud.e2e.ts))**: Siklus hidup lengkap pembuatan BUMD, verifikasi di tabel, pembaruan data, hingga konfirmasi dialog penghapusan data dengan tangkapan layar otomatis.
- **Automated Regression Suite ([`bumd-regression.e2e.ts`](tests/bumd/bumd-regression.e2e.ts))**: Suite regresi berkala untuk memastikan tidak ada degradasi fitur antar deployment rilis.

### 3. Modul Setting Mitra OTA & Master Tag Properti
*Direktori Uji: [`tests/mitra/`](tests/mitra/)*
- **List, Tab & Filter ([`mitra-list-filter.e2e.ts`](tests/mitra/mitra-list-filter.e2e.ts))**: Rendering tabel mitra, tab penyaring *"Memiliki Minimal 1 Properti"*, pencarian nama/email, dropdown filter status (*Pending*/*Approved*), dan aksi tombol Reset filter.
- **Modal Tambah & Ubah Mitra ([`mitra-modal-crud.e2e.ts`](tests/mitra/mitra-modal-crud.e2e.ts))**: Form modal interaktif, validasi form kosong, batas panjang password (< 7 karakter & mismatch), dan fitur prefill data saat edit.
- **Halaman Detail Mitra ([`mitra-detail.e2e.ts`](tests/mitra/mitra-detail.e2e.ts))**: Inspeksi profil mitra, tabel Daftar Properti, audit log *Riwayat Aktivitas* (diff data sebelum vs sesudah), serta navigasi breadcrumb.
- **Skenario Aktif / On-Progress ([`mitra-onprogress.e2e.ts`](tests/mitra/mitra-onprogress.e2e.ts))**: Verifikasi query parameter `?tag=...` pada dropdown Tag Kelompok, serta validasi pencegahan karakter alfabetis/simbol pada input nomor telepon.
- **Suite Regresi Mitra ([`regression-suite.e2e.ts`](tests/mitra/regression-suite.e2e.ts))**: 14 skenario uji regresi yang mencakup auto-approve mitra, status verifikasi email, tag kelompok, URL Maps wajib, multi-foto properti, fasilitas tambahan, dan pencegahan duplikasi data properti.
- **Menu Tag Properti ([`tag-properti.e2e.ts`](tests/mitra/tag-properti.e2e.ts) & [`tag-crud-lifecycle.e2e.ts`](tests/mitra/tag-crud-lifecycle.e2e.ts))**: Pengujian menyeluruh fitur master Tag Properti (`/partner/property-tags`), meliputi Create tag, verifikasi tabel, Update deskripsi/nama tag, hingga Delete tag melalui native dialog confirm dengan alert notifikasi sukses.

### 4. 35-Step Full Regression Lifecycle (`REG-LIFECYCLE-002`)
*File Uji: [`tests/mitra/property-approval-kso-lifecycle.e2e.ts`](tests/mitra/property-approval-kso-lifecycle.e2e.ts)*
Suite pengujian **Release-Gate Blocker** otomatis yang menghubungkan 35 tahapan alur operasional bisnis antar-portal secara *end-to-end* tanpa intervensi manual:
1. **Pembuatan Akun Mitra Baru** di portal Manajemen (`superadmin`).
2. **Login Mitra Baru & Pengisian Properti Wizard 5 Langkah** (Informasi Umum, Lokasi/Maps, Fasilitas Properti & Kamar, Dokumen Legal/NPWP/KTP, dan Foto Galeri).
3. **Approval Properti di Portal Manajemen** (Inspeksi detail properti, tagging kelompok acak, verifikasi, dan persetujuan).
4. **Verifikasi Antrean Rekening Bank Mitra** (Verifikasi rekening operasional mitra untuk bagi hasil).
5. **Pembuatan Kontrak Kerjasama (KSO)** (Pemilihan properti, penetapan persentase bagi hasil, durasi kontrak, upload dokumen PDF kontrak, dan simpan).
6. **Penautan Properti ke Properti Inti** (Core linking properti di panel manajemen).
7. **Login Kembali ke Akun Mitra & Self-Service Portal** (Pendaftaran Crisis Policy baru, penelusuran tabel kontrak hotel, dan pemeriksaan kontak properti via bantuan AI Agent).

---

## 📊 Demo & Laporan Hasil Pengujian (QA Reports)

Setiap pengujian E2E menghasilkan artefak eksekusi yang komprehensif, mulai dari laporan status formal berstandar ISTQB hingga tangkapan layar di setiap langkah krusial.

### Matriks Status Eksekusi QA (STLC Phase 6 Closure)

Dokumen lengkap tersedia pada: [`reports/MASTER_TEST_SUMMARY_REPORT.md`](reports/MASTER_TEST_SUMMARY_REPORT.md).

| Modul Pengujian | Test Files | Total Test Cases | Status | Pass Rate | Laporan Khusus |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Central Auth & Registration** | 3 File | 13 Kasus Uji | **PASS** | **100.00%** | [MASTER_TEST_SUMMARY_REPORT.md](reports/MASTER_TEST_SUMMARY_REPORT.md#21-kelompok-1-central-authentication--registration-portal) |
| **Finance BUMD & Fee** | 5 File | 18 Kasus Uji | **PASS** | **100.00%** | [TEST_EXECUTION_REPORT.md](reports/bumd/TEST_EXECUTION_REPORT.md) |
| **Setting Mitra & Master Tag** | 8 File | 36 Kasus Uji | **PASS** | **100.00%** | [TEST_EXECUTION_REPORT.md](reports/mitra/TEST_EXECUTION_REPORT.md) |
| **35-Step Full Lifecycle** | 1 File | 1 Master Uji (35 Steps) | **PASS** | **100.00%** | [TEST_CASES_REGRESSION.md](reports/mitra/TEST_CASES_REGRESSION.md) |
| **TOTAL KESELURUHAN** | **17 File** | **68 Kasus Uji (102 Operasi)** | **PASS** | **100.00%** | [MASTER_TEST_SUMMARY_REPORT.md](reports/MASTER_TEST_SUMMARY_REPORT.md) |

### Galeri Bukti Visual & Tangkapan Layar

Artefak visual disimpan secara terstruktur dan dapat diaudit secara langsung:
- **Central Auth & Registrasi ([`reports/screenshots/auth/`](reports/screenshots/auth/))**:
  - `TC-AUTH-MGMT-001-dashboard-redirect.png` (Redirect Dashboard Manajemen)
  - `TC-AUTH-MITRA-001-dashboard-redirect.png` (Redirect Dashboard Mitra)
  - `TC-AUTH-TAMU-001-session-active.png` (Sesi Login Tamu)
  - `TC-REG-GUEST-004-relogin-result.png` (Hasil Registrasi Tamu Berhasil)
  - `TC-REG-MITRA-004-relogin-result.png` (Hasil Registrasi Kemitraan Berhasil)
- **Finance BUMD Screenshots ([`reports/bumd/screenshots/`](reports/bumd/screenshots/))**:
  - `01-create-wizard-tab4-filled.png` (Pengisian wizard tab fee)
  - `02-create-verified-in-table.png` (Verifikasi record BUMD di tabel)
  - `03-edit-form-opened.png` (Modal form edit BUMD prefilled)
  - `04-update-verified-in-table.png` (Verifikasi pembaruan data)
  - `05-delete-confirmation-dialog.png` (Dialog konfirmasi hapus data)
  - `06-delete-verified-removed.png` (Verifikasi data berhasil dihapus)
- **Setting Mitra & Tag Screenshots ([`reports/mitra/screenshots/`](reports/mitra/screenshots/))**:
  - `01-mitra-create-form.png` & `02-mitra-verified-in-table.png` (CRUD Mitra)
  - `03-mitra-edit-modal-opened.png` & `04-mitra-updated-verified.png` (Update Mitra)
  - `01-tag-create-form.png` s/d `04-tag-deleted-verified.png` (CRUD & Hapus Tag Properti)
- **35-Step Lifecycle Screenshots ([`reports/mitra/screenshots/lifecycle/`](reports/mitra/screenshots/lifecycle/))**:
  - `01-buat-mitra-manajemen.png` hingga `35-halaman-kontak-terbuka.png` mencatat bukti visual lengkap per tahapan.

---

## 📁 Arsitektur & Struktur Direktori

```text
DTA-OTA/
├── .claude/                          # Agent skill references & e2e tooling
├── .cursor/                          # Konfigurasi workspace Cursor & MCP server
├── .e2e/                             # Hasil output mesin e2e runner
│   ├── results/                      # Visual trace & snapshot step-by-step
│   └── report.json                   # Ringkasan JSON hasil eksekusi pengujian
├── graphify-out/                     # Knowledge Graph arsitektur kode
│   ├── graph.html                    # Visualisasi graph interaktif di browser
│   ├── graph.json                    # Data relasi simpul & busur (nodes & edges)
│   └── GRAPH_REPORT.md               # Laporan audit relasi & komunitas graph
├── reports/                          # Laporan pengujian formal (Standar ISTQB)
│   ├── bumd/                         # Modul Finance BUMD
│   │   ├── screenshots/              # Bukti visual eksekusi BUMD
│   │   ├── TEST_CASES_BUMD.md        # Spesifikasi skenario uji BUMD
│   │   └── TEST_EXECUTION_REPORT.md  # Laporan penutupan uji BUMD
│   ├── mitra/                        # Modul Setting Mitra & Tag Properti
│   │   ├── screenshots/              # Bukti visual CRUD Mitra, Tag & Lifecycle
│   │   ├── TEST_CASES_REGRESSION.md  # Matriks skenario regresi & 35-step lifecycle
│   │   ├── TEST_CASES_SETTING_MITRA.md # Matriks skenario setting mitra
│   │   ├── TEST_CASES_TAG_PROPERTI.md  # Matriks skenario tag properti
│   │   └── TEST_EXECUTION_REPORT.md  # Laporan penutupan eksekusi Mitra
│   ├── screenshots/                  # Tangkapan layar umum
│   │   └── auth/                     # Bukti visual eksekusi login & registrasi
│   └── MASTER_TEST_SUMMARY_REPORT.md # Laporan penutupan uji induk seluruh modul
├── tests/                            # Test suites berbasis TypeScript & e2e
│   ├── assets/                       # Aset dummy pengujian (image.jpg, doc.pdf)
│   ├── bumd/                         # Suite Pengujian Finance BUMD
│   │   ├── bumd-create-wizard.e2e.ts # Wizard pengisian multi-step BUMD
│   │   ├── bumd-crud.e2e.ts          # Siklus penuh CRUD & tangkapan layar
│   │   ├── bumd-fee.e2e.ts           # Fitur fee BUMD & BVA
│   │   ├── bumd-list-filter.e2e.ts   # Data grid, pencarian & filter
│   │   ├── bumd-regression.e2e.ts    # Automated regression suite BUMD
│   │   └── support.ts                # Helper login, navigasi & form BUMD
│   ├── mitra/                        # Suite Pengujian Setting Mitra & Tag
│   │   ├── mitra-crud-lifecycle.e2e.ts          # Siklus CRUD Mitra terisolasi
│   │   ├── mitra-detail.e2e.ts                  # Halaman detail & riwayat aktivitas
│   │   ├── mitra-list-filter.e2e.ts             # Tabel daftar mitra & tab filter
│   │   ├── mitra-modal-crud.e2e.ts              # Modal tambah, validasi & ubah mitra
│   │   ├── mitra-onprogress.e2e.ts              # Skenario on-progress & no HP non-digit
│   │   ├── property-approval-kso-lifecycle.e2e.ts # 35-step full end-to-end lifecycle
│   │   ├── regression-suite.e2e.ts              # 14 skenario regresi fitur baru mitra
│   │   ├── support.ts                           # Helper navigasi, login & screenshot
│   │   ├── tag-crud-lifecycle.e2e.ts            # Siklus CRUD Tag Properti lengkap
│   │   └── tag-properti.e2e.ts                  # Test suite fungsional Tag Properti
│   ├── support/                      # Utilitas & helper pendukung
│   │   ├── auth-helpers.ts           # Helper penanganan modal popup & multi-role login
│   │   └── temp-mail.ts              # Integrasi API kotak pos dinamis (disposable email)
│   ├── auth-flow.e2e.ts              # Suite uji alur autentikasi umum
│   ├── auth-new-login-roles.e2e.ts   # Suite login multi-peran (Superadmin, Mitra, Tamu)
│   ├── auth-new-register-guest.e2e.ts# Suite registrasi akun tamu & validasi
│   ├── auth-new-register-mitra.e2e.ts# Suite registrasi akun mitra & aktivasi
│   └── roles-auth.e2e.ts             # Suite uji autentikasi multi-role dasar
├── .env                              # Variabel lingkungan & kredensial rahasia
├── .env.example                      # Template variabel lingkungan
├── .gitignore                        # File & folder yang diabaikan Git
├── .mcp.json                         # Definisi konfigurasi MCP server lokal
├── e2e.config.ts                     # Konfigurasi e2e runner, target URL & AI Agent
├── package.json                      # Daftar dependensi & script runner
├── pnpm-lock.yaml                    # Lockfile pnpm
└── README.md                         # Dokumentasi utama proyek
```

---

## ⚙️ Prasyarat (Prerequisites)

Sebelum menjalankan pengujian otomatis, pastikan lingkungan komputer telah terpasang:

- **Node.js**: Versi `22.12.0` atau lebih tinggi (disarankan Node.js 22 LTS / 24+).
- **pnpm**: Versi `9.x` atau lebih baru (`corepack enable && corepack prepare pnpm@latest --activate`).
- **Browser Playwright**: Chromium engine (`pnpm exec playwright install chromium`).
- **Akses Jaringan**: Akses ke server staging D'Paragon:
  - Manajemen: `https://dparagon7.persona-it.com/` (portal manajemen `/partner/partners`, `/bumd`, dll.)
  - Central Auth: `https://auth.dparagon7.persona-it.com/login`
- **AI Provider API Key (Opsional / Recommended)**: `GEMINI_API_KEY` atau `OPENAI_API_KEY` untuk memberdayakan evaluasi AI dinamis melalui `agent.act` dan `agent.assert`.

---

## 📥 Instalasi

1. **Clone repositori ke direktori lokal Anda:**
   ```bash
   git clone <URL_REPOSITORY_DTA_OTA>
   cd DTA-OTA
   ```

2. **Pasang dependensi menggunakan `pnpm`:**
   ```bash
   pnpm install
   ```

3. **Unduh binary browser Playwright:**
   ```bash
   pnpm exec playwright install chromium
   ```

---

## 🔐 Konfigurasi Lingkungan (.env)

Salin berkas template konfigurasi `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Sesuaikan parameter di dalam berkas `.env`:

```dotenv
# Target Web Application
APP_URL=https://dparagon7.persona-it.com/?ava_min_room_ready=1&ava_pax=2
AUTH_URL=https://auth.dparagon7.persona-it.com/login

# Kredensial Pengujian (Role Akun)
E2E_USER_MANAJEMEN_USERNAME=superadmin@dparagon.com
E2E_USER_MANAJEMEN_PASSWORD=RahasiaPasswordManajemen

E2E_USER_MITRA_USERNAME=mitra@contoh.com
E2E_USER_MITRA_PASSWORD=RahasiaPasswordMitra

E2E_USER_TAMU_USERNAME=tamu@contoh.com
E2E_USER_TAMU_PASSWORD=RahasiaPasswordTamu

# AI Provider API Key (untuk instruksi evaluasi Agentic)
GEMINI_API_KEY=AIzaSy...
# OPENAI_API_KEY=sk-...
```

---

## 🚀 Cara Penggunaan (Usage)

Proyek ini telah dilengkapi dengan script runner `pnpm` yang terbagi menurut kebutuhan modul:

### 1. Eksekusi Menyeluruh Suite
```bash
# Menjalankan seluruh test suite otomatis (17 file uji)
pnpm test:e2e
```

### 2. Pengujian Central Authentication & Registrasi
```bash
# Menjalankan uji login multi-role (Superadmin, Mitra, Tamu)
pnpm test:auth:roles

# Menjalankan uji pendaftaran akun tamu & verifikasi formulir
pnpm test:auth:guest

# Menjalankan uji pendaftaran akun mitra & verifikasi syarat kemitraan
pnpm test:auth:mitra

# Menjalankan seluruh rangkaian autentikasi & registrasi
pnpm test:auth:all
```

### 3. Pengujian Modul Finance BUMD
```bash
# Menjalankan seluruh tes modul BUMD
pnpm test:bumd

# Menjalankan siklus CRUD lengkap BUMD & capture screenshots
pnpm test:bumd:crud

# Menjalankan suite regresi otomatis BUMD
pnpm test:bumd:regression
```

### 4. Pengujian Modul Setting Mitra & Tag Properti
```bash
# Menjalankan seluruh tes modul Setting Mitra
pnpm test:mitra

# Menjalankan pengujian daftar tabel & filter Mitra
pnpm test:mitra:list

# Menjalankan pengujian modal CRUD Mitra
pnpm test:mitra:crud

# Menjalankan skenario khusus on-progress Mitra
pnpm test:mitra:onprogress

# Menjalankan 14 skenario regresi fitur baru Mitra
pnpm test:mitra:regression

# Menjalankan pengujian fungsional Tag Properti
pnpm test:mitra:tag

# Menjalankan siklus CRUD Mitra terisolasi & screenshot
pnpm test:mitra:crud:lifecycle

# Menjalankan siklus CRUD Tag Properti lengkap (Create -> Update -> Delete)
pnpm test:tag:crud:lifecycle

# Menjalankan 35-Step Full Regression Lifecycle (Release-Gate Blocker)
pnpm test:mitra:lifecycle
```

### 5. Mode Interaktif (Headed Browser) & Debugging

- **Tampilkan GUI Browser (Headed Mode)**:
  Tambahkan opsi `--headed` untuk mengamati aksi runner di layar secara visual:
  ```bash
  pnpm exec e2e run tests/mitra/mitra-modal-crud.e2e.ts --headed
  ```

- **Langkah demi Langkah (Debug Mode)**:
  Tambahkan opsi `--debug` untuk menghentikan runner di setiap step inspeksi:
  ```bash
  pnpm exec e2e run tests/mitra/property-approval-kso-lifecycle.e2e.ts --debug
  ```

- **Melihat Hasil Eksekusi**:
  - Rekapitulasi status eksekusi mesin: `.e2e/report.json`
  - Visual trace dan rekaman step: `.e2e/results/<nama_skenario>/`

---

## 🧠 Knowledge Graph Arsitektur (Graphify)

Proyek ini telah dipetakan menggunakan **Graphify Engine** untuk menganalisis hubungan dependensi, komunitas file, dan struktur arsitektur:
- **Total Simpul (Nodes)**: 297 Entitas
- **Total Relasi (Edges)**: 409 Koneksi
- **Kluster Komunitas**: 20 Komunitas Terkelompok
- **Visualisasi Interaktif**: Buka berkas [`graphify-out/graph.html`](graphify-out/graph.html) langsung di browser Anda untuk menjelajahi grafik relasi kode.
- **Laporan Audit Arsitektur**: Baca [`graphify-out/GRAPH_REPORT.md`](graphify-out/GRAPH_REPORT.md).

---

## 🤖 Integrasi Model Context Protocol (MCP)

Repositori ini telah dikonfigurasi dengan **MCP Server** (`.mcp.json` dan `.cursor/mcp.json`). Fitur ini memungkinkan AI Assistant (seperti Antigravity, Claude Code, atau Cursor) untuk berinteraksi langsung dengan engine pengujian, mengamati DOM secara real-time, dan menguji skenario E2E secara cerdas:

```json
{
  "mcpServers": {
    "e2e": {
      "command": "npx",
      "args": ["e2e", "mcp"]
    }
  }
}
```

---

## 🤝 Panduan Kontribusi (Contributing)

Kontribusi untuk memperluas cakupan skenario pengujian sangat disambut:

1. **Fork** repositori ini ke akun Anda.
2. Buat branch fitur baru (`git checkout -b feature/tambah-skenario-baru`).
3. Tulis skenario pengujian baru di direktori `tests/` dengan konvensi penamaan `*.e2e.ts`.
4. Terapkan prinsip penulisan pengujian yang tangguh:
   - Prioritaskan pemilih semantik (`data-testid`, accesible role, atau atribut spesifik).
   - Hindari CSS class styling dinamis yang rentan berubah antar rilis.
   - Gunakan timeout eksplisit dan helper `waitForURL` yang tahan terhadap latensi jaringan.
5. Jalankan verifikasi lokal: `pnpm test:e2e`.
6. Buat **Commit** dengan pesan deskriptif sesuai format *Conventional Commits* (misal: `test(mitra): add test case for auto approve notification`).
7. Ajukan **Pull Request (PR)** dengan melampirkan screenshot atau log eksekusi pengujian.

---

## 📄 Lisensi & Kontak

- **Lisensi**: Hak cipta milik **D'Paragon QA & Engineering Team**. Proyek ini merupakan aset internal untuk penjaminan mutu ekosistem aplikasi D'Paragon.
- **Dukungan & Pertanyaan**: Untuk pelaporan kendala atau permintaan penambahan modul pengujian, hubungi tim Quality Assurance Automation D'Paragon melalui issue tracker internal.
