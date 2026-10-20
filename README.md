# DTA-OTA (D'Paragon Test Automation) 🚀

[![Test Status](https://img.shields.io/badge/Test%20Suite-100%25%20PASS-brightgreen?style=flat-square)](reports/mitra/TEST_EXECUTION_REPORT.md)
[![Framework](https://img.shields.io/badge/Framework-e2e%20v0.19.0-blue?style=flat-square)](https://github.com/tester-army/e2e)
[![Node](https://img.shields.io/badge/Node.js-%3E%3D22.0.0-green?style=flat-square)](https://nodejs.org/)
[![Package Manager](https://img.shields.io/badge/pnpm-9.x-orange?style=flat-square)](https://pnpm.io/)
[![Standards](https://img.shields.io/badge/QA%20Standard-ISTQB-purple?style=flat-square)](https://www.istqb.org/)
[![AI Engine](https://img.shields.io/badge/AI%20Agent-Gemini%203.8%20Flash%20%2F%20GPT--4o--mini-informational?style=flat-square)](https://ai.google.dev/)

Repositori pengujian otomatis berbasis **Agentic End-to-End (E2E) Testing** untuk ekosistem portal **D'Paragon Management System & Central Authentication Portal**. Proyek ini mengintegrasikan framework pengujian `e2e` generasi baru yang didukung oleh AI SDK (Google Gemini & OpenAI), browser engine Playwright, serta berakar pada metodologi jaminan kualitas perangkat lunak internasional **ISTQB (International Software Testing Qualifications Board)**.

---

## 📑 Daftar Isi

- [Ikhtisar & Cakupan Modul](#-ikhtisar--cakupan-modul)
  - [1. Central Authentication Portal](#1-central-authentication-portal)
  - [2. Modul Finance BUMD & Fee Management](#2-modul-finance-bumd--fee-management)
  - [3. Modul Setting Mitra OTA & Tag Properti](#3-modul-setting-mitra-ota--tag-properti)
  - [4. 35-Step Full Regression Lifecycle](#4-35-step-full-regression-lifecycle-reg-lifecycle-002)
- [Demo & Laporan Pengujian (QA Reports)](#-demo--laporan-pengujian-qa-reports)
  - [Ringkasan Status Eksekusi QA](#ringkasan-status-eksekusi-qa-stlc-phase-5--6)
  - [Bukti Visual & Galeri Eksekusi](#bukti-visual--galeri-eksekusi)
- [Arsitektur & Struktur Direktori](#-arsitektur--struktur-direktori)
- [Prasyarat (Prerequisites)](#-prasyarat-prerequisites)
- [Instalasi](#-instalasi)
- [Konfigurasi Lingkungan (.env)](#-konfigurasi-lingkungan-env)
- [Cara Penggunaan (Usage)](#-cara-penggunaan-usage)
  - [1. Menjalankan Seluruh Suite Pengujian](#1-menjalankan-seluruh-suite-pengujian)
  - [2. Perintah Pengujian Modul Finance BUMD](#2-perintah-pengujian-modul-finance-bumd)
  - [3. Perintah Pengujian Modul Setting Mitra OTA](#3-perintah-pengujian-modul-setting-mitra-ota)
  - [4. Mode Interaktif (Headed Browser) & Debugging](#4-mode-interaktif-headed-browser--debugging)
- [Integrasi Model Context Protocol (MCP)](#-integrasi-model-context-protocol-mcp)
- [Panduan Kontribusi (Contributing)](#-panduan-kontribusi-contributing)
- [Lisensi & Kontak](#-lisensi--kontak)

---

## 🔍 Ikhtisar & Cakupan Modul

Proyek otomatisasi ini memvalidasi keandalan fungsionalitas, kestabilan logika bisnis, validasi boundary input (BVA), penanganan error (Equivalence Partitioning), dan ketahanan alur end-to-end lintas modul pada platform D'Paragon:

### 1. Central Authentication Portal
*File Uji: [`tests/auth-flow.e2e.ts`](tests/auth-flow.e2e.ts), [`tests/roles-auth.e2e.ts`](tests/roles-auth.e2e.ts)*
- **Multi-Role Selector UI**: Verifikasi antarmuka pemilihan multi-tipe akun (*Management*, *Mitra*, *Tamu*).
- **Form Login & Validasi Kredensial**: Validasi login sukses, penolakan kredensial salah, penanganan form kosong, dan navigasi form dinamis.
- **Retensi Sesi & Navigasi**: Uji persistensi token autentikasi, navigasi mundur browser (*history back*), dan proteksi rute tertutup (*unauthorized redirect*).

### 2. Modul Finance BUMD & Fee Management
*Direktori Uji: [`tests/bumd/`](tests/bumd/)*
- **Multi-Step Wizard Creation ([`bumd-create-wizard.e2e.ts`](tests/bumd/bumd-create-wizard.e2e.ts))**: Pengujian wizard pengisian data bertahap (Tab 1 Perusahaan $\rightarrow$ Tab 2 Penanggung Jawab $\rightarrow$ Tab 3 Pimpinan $\rightarrow$ Tab 4 Fee) beserta persistensi data form saat navigasi maju-mundur.
- **Fee BUMD & Boundary Value Analysis ([`bumd-fee.e2e.ts`](tests/bumd/bumd-fee.e2e.ts))**: Validasi kolom Fee Management dan Fee BUMD pada data grid serta boundary value persentase fee (`0%` batas bawah, `100%` batas atas).
- **Data Grid, Pencarian & Filter ([`bumd-list-filter.e2e.ts`](tests/bumd/bumd-list-filter.e2e.ts))**: Filter status aktif/non-aktif, pencarian real-time nama instansi/nomor rekening, dan tombol export file Excel.
- **Full CRUD Lifecycle ([`bumd-crud.e2e.ts`](tests/bumd/bumd-crud.e2e.ts))**: Siklus hidup lengkap pembuatan BUMD, verifikasi di tabel, pembaruan data, hingga konfirmasi dialog penghapusan data dengan tangkapan layar otomatis.
- **Automated Regression Suite ([`bumd-regression.e2e.ts`](tests/bumd/bumd-regression.e2e.ts))**: Suite regresi berkala untuk memastikan tidak ada degradasi fitur antar deployment rilis.

### 3. Modul Setting Mitra OTA & Tag Properti
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

## 📊 Demo & Laporan Pengujian (QA Reports)

Setiap pengujian E2E menghasilkan artefak eksekusi yang komprehensif, mulai dari laporan status formal berstandar ISTQB hingga tangkapan layar di setiap langkah krusial.

### Ringkasan Status Eksekusi QA (STLC Phase 5 & 6)

| Modul Pengujian | Total File | Total Skenario | Status | Pass Rate | Laporan Formal |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Finance BUMD** | 5 File | 18 Kasus Uji | **PASS** | **100%** | [TEST_EXECUTION_REPORT.md](reports/bumd/TEST_EXECUTION_REPORT.md) |
| **Setting Mitra & Tag** | 8 File | 36 Kasus Uji | **PASS** | **100%** | [TEST_EXECUTION_REPORT.md](reports/mitra/TEST_EXECUTION_REPORT.md) |
| **Full Lifecycle (35 Steps)** | 1 File | 35 Tahapan E2E | **PASS** | **100%** | [TEST_CASES_REGRESSION.md](reports/mitra/TEST_CASES_REGRESSION.md) |

### Bukti Visual & Galeri Eksekusi

Artefak tangkapan layar tersimpan pada folder terstruktur:
- **Finance BUMD Screenshots**: [`reports/bumd/screenshots/`](reports/bumd/screenshots/)
  - `01-create-wizard-tab4-filled.png` (Pengisian wizard tab fee)
  - `02-create-verified-in-table.png` (Verifikasi record BUMD di tabel)
  - `03-edit-form-opened.png` (Modal form edit BUMD prefilled)
  - `04-update-verified-in-table.png` (Verifikasi pembaruan data)
  - `05-delete-confirmation-dialog.png` (Dialog konfirmasi hapus data)
  - `06-delete-verified-removed.png` (Verifikasi data berhasil dihapus)
- **Setting Mitra & Tag Screenshots**: [`reports/mitra/screenshots/`](reports/mitra/screenshots/)
  - `01-mitra-create-form.png` & `02-mitra-verified-in-table.png` (CRUD Mitra)
  - `03-mitra-edit-modal-opened.png` & `04-mitra-updated-verified.png` (Update Mitra)
  - `01-tag-create-form.png` s/d `04-tag-deleted-verified.png` (CRUD & Hapus Tag Properti)
- **35-Step Lifecycle Screenshots**: [`.e2e/results/`](.e2e/results/)
  - `001-step-01-buat-mitra-manajemen.png` hingga `035-step-35-halaman-kontak-terbuka.png` mencatat bukti visual lengkap per tahapan.

---

## 📁 Arsitektur & Struktur Direktori

```text
DTA-OTA/
├── .claude/                          # Agent skill references & e2e tooling
├── .cursor/                          # Konfigurasi workspace Cursor & MCP server
├── .e2e/                             # Hasil output mesin e2e runner
│   ├── results/                      # Visual trace & snapshot step-by-step
│   └── report.json                   # Ringkasan JSON hasil eksekusi pengujian
├── reports/                          # Laporan pengujian formal (Standar ISTQB)
│   ├── bumd/                         # Modul Finance BUMD
│   │   ├── screenshots/              # Bukti visual eksekusi BUMD
│   │   ├── TEST_CASES_BUMD.md        # Spesifikasi skenario uji BUMD
│   │   └── TEST_EXECUTION_REPORT.md  # Laporan penutupan uji BUMD
│   └── mitra/                        # Modul Setting Mitra & Tag Properti
│       ├── screenshots/              # Bukti visual CRUD Mitra & Tag
│       ├── TEST_CASES_REGRESSION.md  # Matriks skenario regresi & 35-step lifecycle
│       ├── TEST_CASES_SETTING_MITRA.md # Matriks skenario setting mitra
│       ├── TEST_CASES_TAG_PROPERTI.md  # Matriks skenario tag properti
│       └── TEST_EXECUTION_REPORT.md  # Laporan penutupan eksekusi Mitra
├── tests/                            # Test suites berbasis TypeScript & e2e
│   ├── assets/                       # Aset dummy pengujian (image.jpg, doc.pdf)
│   ├── auth-flow.e2e.ts              # Suite uji alur autentikasi umum
│   ├── roles-auth.e2e.ts             # Suite uji otentikasi login multi-role
│   ├── bumd/                         # Suite Pengujian Finance BUMD
│   │   ├── bumd-create-wizard.e2e.ts # Wizard pengisian multi-step BUMD
│   │   ├── bumd-crud.e2e.ts          # Siklus penuh CRUD & tangkapan layar
│   │   ├── bumd-fee.e2e.ts           # Fitur fee BUMD & BVA
│   │   ├── bumd-list-filter.e2e.ts   # Data grid, pencarian & filter
│   │   ├── bumd-regression.e2e.ts    # Automated regression suite BUMD
│   │   └── support.ts                # Helper login, navigasi & form BUMD
│   └── mitra/                        # Suite Pengujian Setting Mitra & Tag
│       ├── mitra-crud-lifecycle.e2e.ts          # Siklus CRUD Mitra terisolasi
│       ├── mitra-detail.e2e.ts                  # Halaman detail & riwayat aktivitas
│       ├── mitra-list-filter.e2e.ts             # Tabel daftar mitra & tab filter
│       ├── mitra-modal-crud.e2e.ts              # Modal tambah, validasi & ubah mitra
│       ├── mitra-onprogress.e2e.ts              # Skenario on-progress & no HP non-digit
│       ├── property-approval-kso-lifecycle.e2e.ts # 35-step full end-to-end lifecycle
│       ├── regression-suite.e2e.ts              # 14 skenario regresi fitur baru mitra
│       ├── support.ts                           # Helper navigasi, login & screenshot
│       ├── tag-crud-lifecycle.e2e.ts            # Siklus CRUD Tag Properti lengkap
│       └── tag-properti.e2e.ts                  # Test suite fungsional Tag Properti
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

E2E_USER_MITRA_USERNAME=lodod41077@crybio.com
E2E_USER_MITRA_PASSWORD=RahasiaPasswordMitra

E2E_USER_TAMU_USERNAME=kzodiek@gmail.com
E2E_USER_TAMU_PASSWORD=RahasiaPasswordTamu

# AI Provider API Key (untuk instruksi evaluasi Agentic)
GEMINI_API_KEY=AQ.Ab8RN6...
# OPENAI_API_KEY=sk-...
```

---

## 🚀 Cara Penggunaan (Usage)

Proyek ini telah dilengkapi dengan script runner `pnpm` yang terbagi menurut kebutuhan modul:

### 1. Menjalankan Seluruh Suite Pengujian
```bash
pnpm test:e2e
```

### 2. Perintah Pengujian Modul Finance BUMD
```bash
# Menjalankan seluruh tes modul BUMD
pnpm test:bumd

# Menjalankan siklus CRUD lengkap BUMD & capture screenshots
pnpm test:bumd:crud

# Menjalankan suite regresi otomatis BUMD
pnpm test:bumd:regression
```

### 3. Perintah Pengujian Modul Setting Mitra OTA
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

# Menjalankan 35-Step Full Regression Lifecycle (Mitra -> Properti -> Approval -> KSO -> Core Link -> AI Self-Service)
pnpm test:mitra:lifecycle
```

### 4. Mode Interaktif (Headed Browser) & Debugging

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
