# DTA-OTA (D'Paragon Test Automation) 🚀

[![Test Status](https://img.shields.io/badge/Test%20Suite-100%25%20PASS-brightgreen?style=flat-square)](./reports/bumd/TEST_EXECUTION_REPORT.md)
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

Proyek otomatisasi ini memvalidasi keandalan dan integritas proses bisnis penting pada sistem manajemen D'Paragon:

1. **Central Authentication System (`tests/auth-flow.e2e.ts`, `tests/roles-auth.e2e.ts`)**:
   - Validasi antarmuka pemilihan multi-tipe akun (*Management*, *Mitra*, *Tamu*).
   - Pengujian flow form autentikasi, navigasi mundur/kembali, dan penanganan session.
2. **Finance BUMD Multi-Step Wizard (`tests/bumd/bumd-create-wizard.e2e.ts`)**:
   - Pengujian alur pembuatan data BUMD secara bertahap (Tab 1 Perusahaan $\rightarrow$ Tab 2 Penanggung Jawab $\rightarrow$ Tab 3 Pimpinan $\rightarrow$ Tab 4 Fee).
   - Validasi persistensi input data saat navigasi maju-mundur (*step traversal*).
3. **Fitur Fee BUMD & Boundary Value Analysis (`tests/bumd/bumd-fee.e2e.ts`)**:
   - Validasi kolom *Fee Management* dan *Fee BUMD* pada tabel ringkasan.
   - Analisis nilai batas (*Boundary Value Analysis - BVA*) untuk persentase `0%` (batas bawah) dan `100%` (batas atas).
4. **Pencarian, Filter & Data Grid BUMD (`tests/bumd/bumd-list-filter.e2e.ts`)**:
   - Filter status verifikasi (*Menunggu Verifikasi*, *Terverifikasi*, *Ditolak*).
   - Pencarian cerdas berdasarkan nomor rekening dan nama perusahaan.

---

## 📊 Demo & Laporan Pengujian

Setiap pengujian E2E menghasilkan artefak eksekusi yang komprehensif, mulai dari laporan status ISTQB hingga *action traces*.

### Status Eksekusi Terakhir (STLC Phase 5 & 6)
- **Hasil**: 13 / 13 Skenario **PASS** (100% Kelulusan)
- **Durasi Eksekusi**: ~273 detik (Single worker execution untuk stabilitas session)
- **Laporan Lengkap**: [TEST_EXECUTION_REPORT.md](file:///d:/Project/2026/Dparagon/DTA-OTA/reports/bumd/TEST_EXECUTION_REPORT.md)
- **Dokumentasi Test Cases**: [TEST_CASES_BUMD.md](file:///d:/Project/2026/Dparagon/DTA-OTA/reports/bumd/TEST_CASES_BUMD.md)

```
============================================================
✓ tests/bumd/bumd-fee.e2e.ts (3 tests) [69.60s]
✓ tests/bumd/bumd-create-wizard.e2e.ts (5 tests) [110.51s]
✓ tests/bumd/bumd-list-filter.e2e.ts (5 tests) [92.92s]
============================================================
Summary: 13 passed, 0 failed, 0 skipped
```

---

## 📁 Arsitektur & Struktur Direktori

```text
DTA-OTA/
├── .claude/                # Agent prompt & reference skills (e2e tooling)
├── .cursor/                # Konfigurasi workspace Cursor & MCP
├── .e2e/                   # Direktori output otomatis (report.json, traces, logs)
│   ├── results/            # Rekaman visual & trace per skenario
│   └── report.json         # Ringkasan data eksekusi mesin
├── reports/                # Laporan pengujian formal (ISTQB Standard)
│   └── bumd/
│       ├── TEST_CASES_BUMD.md        # Spesifikasi skenario & kriteria uji
│       └── TEST_EXECUTION_REPORT.md  # Laporan penutupan eksekusi QA
├── tests/                  # Kumpulan suite pengujian E2E
│   ├── auth-flow.e2e.ts    # Test suite autentikasi umum
│   ├── roles-auth.e2e.ts   # Test suite validasi login multi-role
│   └── bumd/               # Modul Finance BUMD
│       ├── bumd-create-wizard.e2e.ts
│       ├── bumd-fee.e2e.ts
│       ├── bumd-list-filter.e2e.ts
│       └── support.ts      # Helper functions (login, navigasi, setup form)
├── e2e.config.ts           # Konfigurasi engine e2e, model AI, dan target URL
├── package.json            # Daftar dependensi & npm scripts
├── pnpm-lock.yaml          # Kunci dependensi pnpm
└── README.md               # Dokumentasi utama proyek
```

---

## ⚙️ Prasyarat (Prerequisites)

Sebelum menjalankan pengujian otomatis, pastikan lingkungan komputer Anda telah memenuhi persyaratan berikut:

- **Node.js**: Versi `22.12.0` atau yang lebih baru (disarankan Node.js 22 LTS / 24+).
- **pnpm**: Versi `9.x` atau lebih baru (`corepack enable && corepack prepare pnpm@latest --activate`).
- **Browser Dependencies**: Playwright browser dependencies (terunduh otomatis saat inisialisasi).
- **Koneksi Jaringan**: Akses ke server staging D'Paragon (`https://management.dparagon7.persona-it.com/` dan `https://auth.dparagon7.persona-it.com/`).
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

3. **Pasang browser binary Playwright (jika belum terinstal):**
   ```bash
   pnpm exec playwright install chromium
   ```

---

## 🔐 Konfigurasi Lingkungan (.env)

Salin berkas contoh lingkungan `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Sesuaikan variabel di dalam berkas `.env`:

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

# AI Provider API Key (untuk evaluasi Agentic)
GEMINI_API_KEY=AIzaSy...
# OPENAI_API_KEY=sk-...
```

---

## 🚀 Cara Penggunaan (Usage)

Framework `e2e` menyediakan berbagai fleksibilitas eksekusi sesuai kebutuhan pengujian:

### 1. Menjalankan Seluruh Suite Pengujian
```bash
pnpm test:e2e
```
*atau:*
```bash
pnpm exec e2e run
```

### 2. Menjalankan File Uji Tertentu
```bash
# Menjalankan pengujian wizard Finance BUMD
pnpm exec e2e run tests/bumd/bumd-create-wizard.e2e.ts

# Menjalankan pengujian fitur Fee BUMD
pnpm exec e2e run tests/bumd/bumd-fee.e2e.ts

# Menjalankan pengujian autentikasi
pnpm exec e2e run tests/auth-flow.e2e.ts
```

### 3. Mode Interaktif / Headed (Melihat Browser Terbuka)
Gunakan opsi `--headed` untuk menampilkan GUI browser secara langsung guna observasi manual:
```bash
pnpm exec e2e run tests/bumd/bumd-fee.e2e.ts --headed
```

### 4. Mode Debugging
Jalankan pengujian langkah demi langkah saat menelusuri bug:
```bash
pnpm exec e2e run tests/bumd/bumd-fee.e2e.ts --debug
```

### 5. Memeriksa Laporan dan Trace Eksekusi
Hasil eksekusi disimpan di folder `.e2e/`. Anda dapat membaca laporan mesin pada:
- `.e2e/report.json`
- `.e2e/results/<nama_skenario>/trace.md`

---

## 🤖 Integrasi Model Context Protocol (MCP)

Repositori ini telah dikonfigurasi dengan **MCP Server** (`.mcp.json` dan `.cursor/mcp.json`). Fitur ini memungkinkan coding assistant (seperti Antigravity, Claude, atau Cursor) untuk mengontrol jalannya sesi browser, mengamati elemen UI secara kontekstual, dan memvalidasi locator secara real-time via subproses:

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
2. Buat branch fitur baru (`git checkout -b feature/tambah-test-kamar`).
3. Tulis skenario pengujian baru di direktori `tests/` dengan penamaan `*.e2e.ts`.
4. Pastikan menggunakan kaidah selektor semantik yang stabil (utamakan `data-testid`, `role`, atau ID unik; hindari selector CSS rapuh yang terikat styling).
5. Jalankan verifikasi lokal: `pnpm test:e2e`.
6. Buat **Commit** dengan deskripsi yang jelas sesuai standar (*Conventional Commits*).
7. Ajukan **Pull Request (PR)** dengan melampirkan ringkasan pengujian.

---

## 📄 Lisensi & Kontak

- **Lisensi**: Hak cipta milik D'Paragon QA & Development Team. Proyek ini dilindungi sebagai bagian dari infrastruktur pengujian internal.
- **Issue Tracker & Pertanyaan**: Silakan laporkan kendala teknis atau usulan skenario pengujian baru melalui menu internal issue tracker atau hubungi tim QA Automation D'Paragon.
