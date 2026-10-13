# DTA-OTA (D'Paragon Test Automation) 🚀

[![Test Status](https://img.shields.io/badge/Test%20Suite-100%25%20PASS-brightgreen?style=flat-square)](./reports/mitra/TEST_EXECUTION_REPORT.md)
[![Framework](https://img.shields.io/badge/Framework-e2e%20v0.19.0-blue?style=flat-square)](https://github.com/tester-army/e2e)
[![Node](https://img.shields.io/badge/Node.js-%3E%3D22.0.0-green?style=flat-square)](https://nodejs.org/)
[![Package Manager](https://img.shields.io/badge/pnpm-9.x-orange?style=flat-square)](https://pnpm.io/)
[![Standards](https://img.shields.io/badge/QA%20Standard-ISTQB-purple?style=flat-square)](https://www.istqb.org/)

Repositori pengujian otomatis berbasis **Agentic End-to-End (E2E) Testing** untuk ekosistem portal **D'Paragon Management System & Central Authentication Portal**. Proyek ini mengintegrasikan framework pengujian `e2e` generasi baru yang didukung oleh AI SDK (Google Gemini & OpenAI) serta standar jaminan kualitas internasional **ISTQB (International Software Testing Qualifications Board)**.

---

## 📑 Daftar Isi

- [Ikhtisar & Cakupan Modul](#-ikhtisar--cakupan-modul)
- [Demo & Laporan Pengujian](#-demo--laporan-pengujian)
- [Arsitektur & Struktur Direktori](#-arsitektur--struktur-direktori)
- [Prasyarat (Prerequisites)](#-prasyarat-prerequisites)
- [Instalasi](#-instalasi)
- [Konfigurasi Lingkungan (.env)](#-konfigurasi-lingkungan-env)
- [Cara Penggunaan (Usage)](#-cara-penggunaan-usage)
- [Integrasi Model Context Protocol (MCP)](#-integrasi-model-context-protocol-mcp)
- [Panduan Kontribusi (Contributing)](#-panduan-kontribusi-contributing)
- [Lisensi & Kontak](#-lisensi--kontak)

---

## 🔍 Ikhtisar & Cakupan Modul

Proyek otomatisasi ini memvalidasi keandalan fungsional, integritas UI, serta alur proses bisnis penting pada sistem manajemen D'Paragon:

### 1. Central Authentication System
*File Uji: [`tests/auth-flow.e2e.ts`](file:///d:/Project/2026/Dparagon/DTA-OTA/tests/auth-flow.e2e.ts), [`tests/roles-auth.e2e.ts`](file:///d:/Project/2026/Dparagon/DTA-OTA/tests/roles-auth.e2e.ts)*
- Validasi antarmuka pemilihan multi-tipe akun (*Management*, *Mitra*, *Tamu*).
- Pengujian flow form otentikasi login, validasi credential, navigasi mundur/kembali, dan retensi session.

### 2. Modul Finance BUMD & Fee Management
*Direktori Uji: [`tests/bumd/`](file:///d:/Project/2026/Dparagon/DTA-OTA/tests/bumd/)*
- **Multi-Step Wizard Creation (`bumd-create-wizard.e2e.ts`)**: Pengujian pengisian bertahap (Tab 1 Perusahaan $\rightarrow$ Tab 2 Penanggung Jawab $\rightarrow$ Tab 3 Pimpinan $\rightarrow$ Tab 4 Fee) beserta persistensi data navigasi traversal dua arah.
- **Fee BUMD & Boundary Value Analysis (`bumd-fee.e2e.ts`)**: Validasi kolom Fee Management dan Fee BUMD pada tabel serta BVA persentase fee (`0%` batas bawah, `100%` batas atas).
- **Data Grid, Pencarian & Filter (`bumd-list-filter.e2e.ts`)**: Filter status, pencarian dinamis nama perusahaan/nomor rekening, dan tombol export Excel.
- **Full CRUD Lifecycle (`bumd-crud.e2e.ts`)**: Siklus hidup lengkap pembuatan data, verifikasi tabel, pembaruan data, hingga konfirmasi penghapusan data dengan bukti tangkapan layar.
- **Automated Regression Suite (`bumd-regression.e2e.ts`)**: Pengujian regresi otomatis komprehensif untuk memastikan stabilitas antar rilis.

### 3. Modul Setting Mitra OTA
*Direktori Uji: [`tests/mitra/`](file:///d:/Project/2026/Dparagon/DTA-OTA/tests/mitra/)*
- **List, Tab & Filter (`mitra-list-filter.e2e.ts`)**: Render tabel daftar mitra, tab "Memiliki Minimal 1 Properti", pencarian nama/email, dropdown filter status (*Pending*/*Approved*), tombol aksi, dan fitur reset filter.
- **Modal Tambah & Ubah Mitra (`mitra-modal-crud.e2e.ts`)**: Pembukaan form modal, validasi form kosong, BVA password (< 7 karakter & mismatch), serta pengisian ulang (*prefill*) modal ubah mitra.
- **Halaman Detail Mitra (`mitra-detail.e2e.ts`)**: Penelusuran profil identitas mitra, validasi tabel "Daftar Properti", "Riwayat Aktivitas" (audit log), dan breadcrumb navigasi.
- **Skenario Aktif / On-Progress (`mitra-onprogress.e2e.ts`)**: Filter query URL *Tag Kelompok*, pencegahan karakter non-digit pada nomor telepon saat tambah maupun ubah mitra.

---

## 📊 Demo & Laporan Pengujian

Setiap pengujian E2E menghasilkan artefak eksekusi yang komprehensif, mulai dari laporan status berstandar ISTQB hingga rekaman traces dan tangkapan layar.

### Ringkasan Status Eksekusi QA (STLC Phase 5 & 6)

| Modul Pengujian | Total Suite | Total Test Cases | Status | Pass Rate | Laporan Formal |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Finance BUMD** | 5 File | 18 Skenario | **PASS** | **100%** | [TEST_EXECUTION_REPORT.md](file:///d:/Project/2026/Dparagon/DTA-OTA/reports/bumd/TEST_EXECUTION_REPORT.md) |
| **Setting Mitra OTA** | 4 File | 17 Skenario | **PASS** | **100%** | [TEST_EXECUTION_REPORT.md](file:///d:/Project/2026/Dparagon/DTA-OTA/reports/mitra/TEST_EXECUTION_REPORT.md) |

### Galeri Bukti Tangkapan Layar (CRUD BUMD)
Bukti eksekusi tersimpan pada direktori [`reports/bumd/screenshots/`](file:///d:/Project/2026/Dparagon/DTA-OTA/reports/bumd/screenshots/):
1. **Pendaftaran Wizard Tab 4**: `01-create-wizard-tab4-filled.png`
2. **Verifikasi Data Baru di Tabel**: `02-create-verified-in-table.png`
3. **Form Ubah Data Dibuka**: `03-edit-form-opened.png`
4. **Verifikasi Perubahan Data**: `04-update-verified-in-table.png`
5. **Dialog Konfirmasi Hapus**: `05-delete-confirmation-dialog.png`
6. **Verifikasi Data Terhapus**: `06-delete-verified-removed.png`

---

## 📁 Arsitektur & Struktur Direktori

```text
DTA-OTA/
├── .claude/                # Agent prompt & referensi skills (e2e tooling)
├── .cursor/                # Konfigurasi workspace Cursor & MCP server
├── .e2e/                   # Direktori output otomatis runner (report.json, traces, logs)
│   ├── results/            # Rekaman visual & snapshot traces per skenario
│   └── report.json         # Ringkasan data eksekusi mesin
├── reports/                # Laporan pengujian formal (ISTQB Standard)
│   ├── bumd/               # Artefak QA Modul Finance BUMD
│   │   ├── screenshots/              # Bukti visual eksekusi CRUD
│   │   ├── TEST_CASES_BUMD.md        # Spesifikasi test cases & kriteria uji
│   │   └── TEST_EXECUTION_REPORT.md  # Laporan penutupan eksekusi BUMD
│   └── mitra/              # Artefak QA Modul Setting Mitra
│       ├── TEST_CASES_SETTING_MITRA.md # Matriks skenario uji Mitra
│       └── TEST_EXECUTION_REPORT.md    # Laporan penutupan eksekusi Mitra
├── tests/                  # Kumpulan suite pengujian E2E
│   ├── auth-flow.e2e.ts    # Test suite autentikasi umum
│   ├── roles-auth.e2e.ts   # Test suite validasi login multi-role
│   ├── bumd/               # Suite Pengujian Modul Finance BUMD
│   │   ├── bumd-create-wizard.e2e.ts # Wizard form bertahap
│   │   ├── bumd-crud.e2e.ts          # Siklus penuh CRUD & bukti tangkapan layar
│   │   ├── bumd-fee.e2e.ts           # Fitur Fee BUMD & BVA
│   │   ├── bumd-list-filter.e2e.ts   # List data, pencarian, & filter
│   │   ├── bumd-regression.e2e.ts    # Automated regression suite
│   │   └── support.ts                # Helper login, navigasi BUMD, & wizard
│   └── mitra/              # Suite Pengujian Modul Setting Mitra
│       ├── mitra-detail.e2e.ts       # Halaman detail & riwayat aktivitas
│       ├── mitra-list-filter.e2e.ts  # Daftar tabel, tab filter, & reset
│       ├── mitra-modal-crud.e2e.ts   # Modal tambah & ubah data mitra
│       ├── mitra-onprogress.e2e.ts   # Filter tag kelompok & validasi nomor HP
│       └── support.ts                # Helper navigasi Mitra & form helper
├── e2e.config.ts           # Konfigurasi engine e2e, model AI, dan target URL
├── package.json            # Dependensi paket & skrip pengujian npm/pnpm
├── pnpm-lock.yaml          # Kunci dependensi versi pnpm
└── README.md               # Dokumentasi utama proyek
```

---

## ⚙️ Prasyarat (Prerequisites)

Sebelum menjalankan pengujian otomatis, pastikan lingkungan komputer Anda telah memenuhi persyaratan berikut:

- **Node.js**: Versi `22.12.0` atau yang lebih baru (disarankan Node.js 22 LTS / 24+).
- **pnpm**: Versi `9.x` atau lebih baru (`corepack enable && corepack prepare pnpm@latest --activate`).
- **Browser Dependencies**: Playwright browser dependencies (terunduh otomatis via playwright install).
- **Koneksi Jaringan**: Akses ke server staging D'Paragon:
  - Manajemen: `https://management.dparagon7.persona-it.com/`
  - Central Auth: `https://auth.dparagon7.persona-it.com/`
- **API Key AI (Opsional)**: Google Gemini API Key (`GEMINI_API_KEY`) atau OpenAI API Key (`OPENAI_API_KEY`) jika memanfaatkan instruksi dinamis `agent.act`.

---

## 📥 Instalasi

1. **Clone repositori ke komputer lokal:**
   ```bash
   git clone <URL_REPOSITORY_DTA_OTA>
   cd DTA-OTA
   ```

2. **Pasang dependensi menggunakan `pnpm`:**
   ```bash
   pnpm install
   ```

3. **Pasang binary browser Playwright (jika belum terinstal):**
   ```bash
   pnpm exec playwright install chromium
   ```

---

## 🔐 Konfigurasi Lingkungan (.env)

Salin berkas contoh konfigurasi `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Sesuaikan parameter konfigurasi di dalam berkas `.env`:

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
GEMINI_API_KEY=AIzaSy...
# OPENAI_API_KEY=sk-...
```

---

## 🚀 Cara Penggunaan (Usage)

Proyek ini telah dilengkapi dengan shortcut skrip pnpm/npm yang terorganisir per modul:

### 1. Menjalankan Seluruh Suite Pengujian
```bash
pnpm test:e2e
```

### 2. Modul Finance BUMD
```bash
# Menjalankan seluruh tes modul BUMD
pnpm test:bumd

# Menjalankan siklus CRUD lengkap & tangkapan layar BUMD
pnpm test:bumd:crud

# Menjalankan pengujian regresi otomatis BUMD
pnpm test:bumd:regression
```

### 3. Modul Setting Mitra OTA
```bash
# Menjalankan seluruh tes modul Setting Mitra
pnpm test:mitra

# Menjalankan pengujian daftar tabel & filter Mitra
pnpm test:mitra:list

# Menjalankan pengujian modal CRUD Mitra
pnpm test:mitra:crud

# Menjalankan skenario khusus / On-Progress Mitra
pnpm test:mitra:onprogress
```

### 4. Mode Interaktif (Headed Browser)
Tambahkan flag `--headed` untuk menampilkan GUI browser secara langsung guna observasi interaktif:
```bash
pnpm exec e2e run tests/mitra/mitra-list-filter.e2e.ts --headed
```

### 5. Mode Debugging
Tambahkan flag `--debug` untuk menjalankan langkah demi langkah:
```bash
pnpm exec e2e run tests/mitra/mitra-modal-crud.e2e.ts --debug
```

### 6. Memeriksa Laporan dan Trace Eksekusi
Hasil eksekusi disimpan secara otomatis di folder `.e2e/`:
- Ringkasan mesin: `.e2e/report.json`
- Action Traces & snapshot: `.e2e/results/<nama_skenario>/trace.md`

---

## 🤖 Integrasi Model Context Protocol (MCP)

Repositori ini telah dikonfigurasi dengan **MCP Server** (`.mcp.json` dan `.cursor/mcp.json`). Fitur ini memungkinkan coding assistant (seperti Antigravity, Claude Code, atau Cursor) untuk mengontrol jalannya sesi browser, mengamati elemen UI secara kontekstual, dan memvalidasi locator secara real-time:

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
4. Pastikan menggunakan kaidah selektor semantik yang stabil (prioritaskan `data-testid`, accessible role, atau ID unik; hindari selector CSS styling yang rapuh).
5. Jalankan verifikasi lokal: `pnpm test:e2e`.
6. Buat **Commit** dengan deskripsi yang jelas sesuai standar (*Conventional Commits*).
7. Ajukan **Pull Request (PR)** dengan menyertakan ringkasan hasil pengujian.

---

## 📄 Lisensi & Kontak

- **Lisensi**: Hak cipta milik D'Paragon QA & Development Team. Proyek ini dilindungi sebagai bagian dari infrastruktur pengujian internal D'Paragon.
- **Issue Tracker & Pertanyaan**: Laporkan kendala teknis atau usulkan penambahan skenario pengujian melalui issue tracker internal atau hubungi tim QA Automation D'Paragon.
