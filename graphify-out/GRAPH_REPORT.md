# Graph Report - DTA-OTA  (2026-10-26)

## Corpus Check
- 54 files · ~76,689 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: .example 1, (none) 1)

## Summary
- 297 nodes · 409 edges · 20 communities (18 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b533dafe`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- NPM Test Runner Scripts
- Mitra OTA & Core E2E Framework
- Central Auth & TempMail Helpers
- E2E Configuration & AI SDK Dependencies
- Finance BUMD Test Suite
- SKILL.md
- Cursor IDE MCP Integration
- Root MCP Tooling Server
- 3. Rincian Hasil Eksekusi per Test Suite
- DTA-OTA (D'Paragon Test Automation) 🚀
- 2. Rincian Hasil Eksekusi per Test Suite
- Master Test Summary Report: Otomasi Pengujian E2E DTA-OTA
- Agent steps
- Writing tests
- Setting up e2e
- Test Specification: BUMD & Fee Management (ISTQB Standard)
- Running a bug bash
- Dokumen Spesifikasi Test Case: Menu Setting Mitra (ISTQB Standard)
- Dokumen Spesifikasi Test Case: Menu Tag Properti (ISTQB Standard)
- Exploring without a test

## God Nodes (most connected - your core abstractions)
1. `@e2e-dev/web` - 25 edges
2. `e2e` - 24 edges
3. `scripts` - 18 edges
4. `Agent steps` - 12 edges
5. `DTA-OTA (D'Paragon Test Automation) 🚀` - 12 edges
6. `loginAndNavigateToMitra()` - 11 edges
7. `Master Test Summary Report: Otomasi Pengujian E2E DTA-OTA` - 10 edges
8. `Running a bug bash` - 9 edges
9. `Setting up e2e` - 9 edges
10. `Writing tests` - 9 edges

## Surprising Connections (you probably didn't know these)
- `5.1 God Nodes (Pusat Abstraksi Terpenting)` --references--> `loginAndNavigateToBumd()`  [INFERRED]
  reports/MASTER_TEST_SUMMARY_REPORT.md → tests/bumd/support.ts
- `5.1 God Nodes (Pusat Abstraksi Terpenting)` --references--> `loginAndNavigateToMitra()`  [INFERRED]
  reports/MASTER_TEST_SUMMARY_REPORT.md → tests/mitra/support.ts
- `7. Analisis Risiko & Mitigasi (Risk & Mitigation)` --references--> `setupApiRouteBridge()`  [INFERRED]
  reports/MASTER_TEST_SUMMARY_REPORT.md → tests/support/auth-helpers.ts
- `5.1 God Nodes (Pusat Abstraksi Terpenting)` --references--> `openLoginModal()`  [INFERRED]
  reports/MASTER_TEST_SUMMARY_REPORT.md → tests/support/auth-helpers.ts
- `5.1 God Nodes (Pusat Abstraksi Terpenting)` --references--> `logoutSession()`  [INFERRED]
  reports/MASTER_TEST_SUMMARY_REPORT.md → tests/support/auth-helpers.ts

## Import Cycles
- None detected.

## Communities (20 total, 2 thin omitted)

### Community 0 - "NPM Test Runner Scripts"
Cohesion: 0.11
Nodes (18): scripts, test:auth:all, test:auth:guest, test:auth:mitra, test:auth:roles, test:bumd, test:bumd:crud, test:bumd:regression (+10 more)

### Community 1 - "Mitra OTA & Core E2E Framework"
Cohesion: 0.21
Nodes (11): e2e, @e2e-dev/web, clickWizardSubmit(), submitAndAdvance(), loginAndNavigateToMitra(), loginAndNavigateToRegistrasiProperti(), loginAndNavigateToTagProperti(), loginMitraDashboard() (+3 more)

### Community 2 - "Central Auth & TempMail Helpers"
Cohesion: 0.25
Nodes (13): 5.1 God Nodes (Pusat Abstraksi Terpenting), 7. Analisis Risiko & Mitigasi (Risk & Mitigation), AUTH_LOGOUT_URL, dismissInitialPromo(), logoutSession(), openLoginModal(), setupApiRouteBridge(), takeAuthScreenshot() (+5 more)

### Community 3 - "E2E Configuration & AI SDK Dependencies"
Cohesion: 0.13
Nodes (13): devDependencies, ai, @ai-sdk/google, @ai-sdk/openai, e2e, @e2e-dev/web, zod, private (+5 more)

### Community 4 - "Finance BUMD Test Suite"
Cohesion: 0.40
Nodes (8): fillTab1(), fillTab2(), fillTab3(), loginAndNavigateToBumd(), navigateToTab4(), setFoundedYear(), submitWizardForm(), takeEvidenceScreenshot()

### Community 5 - "SKILL.md"
Cohesion: 0.07
Nodes (22): Debugging a failing run, Error codes, Flaky tests, Is it the app?, Read the failure, Tools, Driving the app over MCP, Rules (+14 more)

### Community 8 - "3. Rincian Hasil Eksekusi per Test Suite"
Cohesion: 0.08
Nodes (20): 1. Executive Summary, 2. Lingkungan & Konfigurasi Pengujian (Test Environment), 3. Rincian Hasil Eksekusi per Test Suite, 4. Galeri Bukti Tangkapan Layar (Screenshots Evidence), 5. Kesimpulan & Rekomendasi (Test Closure), Perintah Cepat Menjalankan Pengujian:, Ringkasan Metrik Eksekusi, Suite 1: `bumd-fee.e2e.ts` (Fitur Tambahan Fee BUMD) (+12 more)

### Community 9 - "DTA-OTA (D'Paragon Test Automation) 🚀"
Cohesion: 0.09
Nodes (22): 1. Central Authentication Portal, 1. Menjalankan Seluruh Suite Pengujian, 2. Modul Finance BUMD & Fee Management, 2. Perintah Pengujian Modul Finance BUMD, 3. Modul Setting Mitra OTA & Tag Properti, 3. Perintah Pengujian Modul Setting Mitra OTA, 4. 35-Step Full Regression Lifecycle (`REG-LIFECYCLE-002`), 4. Mode Interaktif (Headed Browser) & Debugging (+14 more)

### Community 10 - "2. Rincian Hasil Eksekusi per Test Suite"
Cohesion: 0.09
Nodes (22): 1. Bukti Tambah Mitra Baru (Form Create Terisi), 1. Bukti Tambah Tag Properti Baru (Form Create Terisi), 1. Executive Summary, 2.1 Bukti Visual Pengujian CRUD Lifecycle (Visual Evidence), 2. Bukti Mitra Baru Terverifikasi di Tabel (Auto Approve), 2. Bukti Tag Baru Terverifikasi di Tabel, 2. Rincian Hasil Eksekusi per Test Suite, 3. Bukti Modal Edit Tag Properti Terbuka (Update Data) (+14 more)

### Community 11 - "Master Test Summary Report: Otomasi Pengujian E2E DTA-OTA"
Cohesion: 0.10
Nodes (19): 1. Ringkasan Eksekutif (Executive Summary), 2.1 In-Scope (Dalam Lingkup), 2.2 Out-of-Scope (Di Luar Lingkup), 2. Lingkup & Sasaran Pengujian (Scope & Objectives), 3. Lingkungan Pengujian (Test Environment), 4.1 Modul 1: Central Authentication & Registration Portal, 4.2 Modul 2: Finance BUMD & Fee Management, 4.3 Modul 3: Setting Mitra OTA & Master Tag Properti (+11 more)

### Community 12 - "Agent steps"
Cohesion: 0.15
Nodes (13): act: one goal, Agent steps, assert, waitFor, extract: one question, Beyond the built-in agent, Budgets and cost, Choose an agent, Configure a model, In CI (+5 more)

### Community 13 - "Writing tests"
Cohesion: 0.15
Nodes (12): A complete file, Actions, app, expect, Fixtures, Habits, Locators, Reads (+4 more)

### Community 14 - "Setting up e2e"
Cohesion: 0.18
Nodes (11): Done when, Environment variables the runner reads, Existing MCP registration, Let the runner start the app, Mobile targets, Requirements, Scaffold, Setting up e2e (+3 more)

### Community 15 - "Test Specification: BUMD & Fee Management (ISTQB Standard)"
Cohesion: 0.18
Nodes (10): 1. Test Suite: Fee BUMD (Fitur Baru), 2. Test Suite: Master BUMD - Create Wizard (Spreadsheet Ref: BUMD-SC-001 s/d BUMD-SC-035), 3. Test Suite: Master BUMD - List, Search, Filter & Export (Spreadsheet Ref: BUMD-SC-036 s/d BUMD-SC-048 & BUMD-SC-050 s/d BUMD-SC-060), 4. Test Suite: Siklus Hidup Penuh CRUD & Bukti Visual (E2E Lifecycle), 5. Test Suite: Automated Regression Suite (`tests/bumd/bumd-regression.e2e.ts`), 6. Matriks Traceability & Cakupan Fitur, Tab 1: Identitas Perusahaan, Tab 2: Identitas Penanggungjawab (+2 more)

### Community 16 - "Running a bug bash"
Cohesion: 0.22
Nodes (9): 1. Prepare, 2. Plan charters, 3. Fan out, 4. Merge, 5. Triage, 6. Verify, 7. Report, Rules (+1 more)

### Community 17 - "Dokumen Spesifikasi Test Case: Menu Setting Mitra (ISTQB Standard)"
Cohesion: 0.22
Nodes (8): 1.1 Penyelarasan Terhadap Arsitektur e2e Framework (@e2e-dev/web), 1. Ringkasan Eksekutif & RTM Matrix, 2. Test Suite 1: Halaman "Daftar Mitra Terdaftar" (List, Tab & Filter) — 19 Test Cases, 3. Test Suite 2: Modal "Tambah Mitra" — 17 Test Cases, 4. Test Suite 3: Halaman "Detail Mitra" — 12 Test Cases, 5. Test Suite 4: Modal "Ubah Data Mitra" — 9 Test Cases, 6. Daftar Skenario Dikeluarkan (Obsolete List), Dokumen Spesifikasi Test Case: Menu Setting Mitra (ISTQB Standard)

### Community 18 - "Dokumen Spesifikasi Test Case: Menu Tag Properti (ISTQB Standard)"
Cohesion: 0.25
Nodes (7): 1.1 Penyelarasan Terhadap Arsitektur e2e Framework (@e2e-dev/web), 1. Ringkasan Eksekutif & RTM Matrix, 2. Test Suite 1: Halaman "Tag Properti" (List, Filter & Aksi) — 13 Test Cases, 3. Test Suite 2: Modal "Tambah Tag Properti" — 9 Test Cases, 4. Test Suite 3: Modal "Edit Tag Properti" — 12 Test Cases, 5. Daftar Skenario Dikeluarkan (Obsolete List), Dokumen Spesifikasi Test Case: Menu Tag Properti (ISTQB Standard)

### Community 19 - "Exploring without a test"
Cohesion: 0.29
Nodes (6): Exploring without a test, Flags, Reading the result, Start signed in, What a run does, When it does not fit

## Knowledge Gaps
- **4 isolated node(s):** `npx`, `npx`, `ai`, `zod`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 182 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@e2e-dev/web` connect `Mitra OTA & Core E2E Framework` to `Central Auth & TempMail Helpers`, `E2E Configuration & AI SDK Dependencies`, `Finance BUMD Test Suite`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **What connects `npx`, `npx`, `ai` to the rest of the system?**
  _4 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `NPM Test Runner Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `scripts` connect `NPM Test Runner Scripts` to `E2E Configuration & AI SDK Dependencies`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `E2E Configuration & AI SDK Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Why does `Master Test Summary Report: Otomasi Pengujian E2E DTA-OTA` connect `Master Test Summary Report: Otomasi Pengujian E2E DTA-OTA` to `Central Auth & TempMail Helpers`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `SKILL.md` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._