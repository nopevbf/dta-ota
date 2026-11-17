# Defect Log: Hasil Pengujian Otomatisasi Lingkungan Staging Naufalans

- **Lingkungan Uji**: `https://fe.naufalans.me/` & Portal Terkait
- **Tanggal Audit**: 17 November 2026
- **Standar Pelaporan**: SQA-ISTQB Standard Defect Tracking
- **Prinsip Pelaporan**: *Apa Adanya (As-Is)* dengan Bukti Tangkapan Layar Lengkap

---

## Ringkasan Defect (Defect Summary)

Total Cacat / Kegagalan Terdeteksi: **14 Defect**

| Defect ID | Kasus Uji | Modul | Berkas Uji | Status |
| :---: | :--- | :---: | :--- | :---: |
| **DEF-NAUFALANS-001** | Bank Data BUMD: List & Filter Tests › BUMD-SC-043: verify search by company name filters data | `bumd` | `tests/bumd/bumd-list-filter.e2e.ts` | **OPEN (INVESTIGASI)** |
| **DEF-NAUFALANS-002** | Form Tambah Data BUMD: Wizard Tabs Tests › BUMD-SC-010: verify Province selection loads Regency/City options | `bumd` | `tests/bumd/bumd-create-wizard.e2e.ts` | **OPEN (INVESTIGASI)** |
| **DEF-NAUFALANS-003** | Form Tambah Data BUMD: Wizard Tabs Tests › BUMD-SC-012 & BUMD-SC-024: fill Tab 1 validly and advance to Tab 2 and Tab 3 | `bumd` | `tests/bumd/bumd-create-wizard.e2e.ts` | **OPEN (INVESTIGASI)** |
| **DEF-NAUFALANS-004** | Fitur Tambahan: Fee BUMD Tests › BUMD-FEE-006: verify Fee Management and Fee BUMD columns in table | `bumd` | `tests/bumd/bumd-fee.e2e.ts` | **OPEN (INVESTIGASI)** |
| **DEF-NAUFALANS-005** | Fitur Tambahan: Fee BUMD Tests › BUMD-FEE-001 & BUMD-FEE-002: navigate to Fee BUMD tab and validate inputs | `bumd` | `tests/bumd/bumd-fee.e2e.ts` | **OPEN (INVESTIGASI)** |
| **DEF-NAUFALANS-006** | Fitur Tambahan: Fee BUMD Tests › BUMD-FEE-003: Boundary Value Analysis (BVA) for Fee BUMD (0% and 100%) | `bumd` | `tests/bumd/bumd-fee.e2e.ts` | **OPEN (INVESTIGASI)** |
| **DEF-NAUFALANS-007** | Bank Data BUMD: End-to-End CRUD Lifecycle with Visual Evidence › BUMD-CRUD-LIFECYCLE: Create, Verify in Table, Update, and Delete BUMD with Visual Evidence | `bumd` | `tests/bumd/bumd-crud.e2e.ts` | **OPEN (INVESTIGASI)** |
| **DEF-NAUFALANS-008** | Bank Data BUMD: Regression Test Suite (Automated End-to-End) › BUMD-REG-002: Wizard Stepper Navigation and Form State Retention (Tab 1 to Tab 4) | `bumd` | `tests/bumd/bumd-regression.e2e.ts` | **OPEN (INVESTIGASI)** |
| **DEF-NAUFALANS-009** | Bank Data BUMD: Regression Test Suite (Automated End-to-End) › BUMD-REG-003: Full Data Lifecycle CRUD (Create -> Verify -> Update -> Verify -> Delete -> Verify Teardown) | `bumd` | `tests/bumd/bumd-regression.e2e.ts` | **OPEN (INVESTIGASI)** |
| **DEF-NAUFALANS-010** | Suite Regresi: Menu Tag Properti › REG-BUG-006: Verifikasi penolakan duplikasi Nama Kelompok pada Tag Properti | `mitra` | `tests/mitra/regression-suite.e2e.ts` | **OPEN (INVESTIGASI)** |
| **DEF-NAUFALANS-011** | Modul 2: Setting Mitra & Master Tag Properti (11 Kasus Uji) › TAG-UI-002: Ubah Input Warna Label Menjadi Color Picker pada Form Tambah Tag Properti | `regression-44` | `tests/regression-44-items.e2e.ts` | **OPEN (INVESTIGASI)** |
| **DEF-NAUFALANS-012** | Modul 2: Setting Mitra & Master Tag Properti (11 Kasus Uji) › TRANSIT-EXP-001: Slot Transit Kedaluwarsa Ditolak / Tidak Bisa Dilanjutkan | `regression-44` | `tests/regression-44-items.e2e.ts` | **OPEN (INVESTIGASI)** |
| **DEF-NAUFALANS-013** | Modul 4: Portal Mitra: Kontak, Kontrak, & Crisis Policy (12 Kasus Uji) › AUTH-REV-001: Integrasi Pendaftaran Mitra OTA dengan Halaman Revamp & Modal Login Baru | `regression-44` | `tests/regression-44-items.e2e.ts` | **OPEN (INVESTIGASI)** |
| **DEF-NAUFALANS-014** | REG-LIFECYCLE-002: 35-Step Full Regression Lifecycle with AI Agent Integration | `lifecycle` | `tests/mitra/property-approval-kso-lifecycle.e2e.ts` | **OPEN (INVESTIGASI)** |

---

## Daftar Lengkap Defect (Defect Registry)

### 1. DEF-NAUFALANS-001: Kegagalan Eksekusi pada [Bank Data BUMD: List & Filter Tests › BUMD-SC-043: verify search by company name filters data]
- **ID Kasus Uji**: `Bank Data BUMD`
- **Berkas Uji**: [`tests/bumd/bumd-list-filter.e2e.ts`](file:///D:/Project/2026/Dparagon/DTA-OTA/tests/bumd/bumd-list-filter.e2e.ts)
- **Modul Bisnis**: `bumd`
- **Severity**: Medium / High
- **Priority**: High
- **Status**: OPEN
- **Langkah Reproduksi**:
  1. Buka runner E2E pada berkas `tests/bumd/bumd-list-filter.e2e.ts`.
  2. Jalankan pengujian pada target portal lingkungan naufalans.
  3. Amati kegagalan pada langkah asersi atau timeout navigasi.
- **Catatan Error**: `locator matched no nodes: locator("table tbody tr td:nth-child(3)").first()`
- **Bukti Screenshot**: Tersedia di direktori [`reports/naufalans/screenshots/failures/`](file:///D:/Project/2026/Dparagon/DTA-OTA/reports/naufalans/screenshots/failures)

---

### 2. DEF-NAUFALANS-002: Kegagalan Eksekusi pada [Form Tambah Data BUMD: Wizard Tabs Tests › BUMD-SC-010: verify Province selection loads Regency/City options]
- **ID Kasus Uji**: `Form Tambah Data BUMD`
- **Berkas Uji**: [`tests/bumd/bumd-create-wizard.e2e.ts`](file:///D:/Project/2026/Dparagon/DTA-OTA/tests/bumd/bumd-create-wizard.e2e.ts)
- **Modul Bisnis**: `bumd`
- **Severity**: Medium / High
- **Priority**: High
- **Status**: OPEN
- **Langkah Reproduksi**:
  1. Buka runner E2E pada berkas `tests/bumd/bumd-create-wizard.e2e.ts`.
  2. Jalankan pengujian pada target portal lingkungan naufalans.
  3. Amati kegagalan pada langkah asersi atau timeout navigasi.
- **Catatan Error**: `selectOption did not become actionable in time: locator.selectOption: Timeout 29739ms exceeded.
Call log:
  - waiting for locator('select#input-province, select[name="province_id"]')
    - locator resolved to <select required="" tabindex="-1" name="province_id" aria-hidden="true" id="input-province" onchange="getCities()" class="form-control select2 select2-hidden-accessible">…</select>
  - attempting select option action
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
    - waiting 20ms
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
      - waiting 100ms
    58 × waiting for element to be visible and enabled
       - did not find some options
     - retrying select option action
       - waiting 500ms
: locator("select#input-province, select[name=\"province_id\"]")`
- **Bukti Screenshot**: Tersedia di direktori [`reports/naufalans/screenshots/failures/`](file:///D:/Project/2026/Dparagon/DTA-OTA/reports/naufalans/screenshots/failures)

---

### 3. DEF-NAUFALANS-003: Kegagalan Eksekusi pada [Form Tambah Data BUMD: Wizard Tabs Tests › BUMD-SC-012 & BUMD-SC-024: fill Tab 1 validly and advance to Tab 2 and Tab 3]
- **ID Kasus Uji**: `Form Tambah Data BUMD`
- **Berkas Uji**: [`tests/bumd/bumd-create-wizard.e2e.ts`](file:///D:/Project/2026/Dparagon/DTA-OTA/tests/bumd/bumd-create-wizard.e2e.ts)
- **Modul Bisnis**: `bumd`
- **Severity**: Medium / High
- **Priority**: High
- **Status**: OPEN
- **Langkah Reproduksi**:
  1. Buka runner E2E pada berkas `tests/bumd/bumd-create-wizard.e2e.ts`.
  2. Jalankan pengujian pada target portal lingkungan naufalans.
  3. Amati kegagalan pada langkah asersi atau timeout navigasi.
- **Catatan Error**: `selectOption did not become actionable in time: locator.selectOption: Timeout 29740ms exceeded.
Call log:
  - waiting for locator('select#input-province')
    - locator resolved to <select required="" tabindex="-1" name="province_id" aria-hidden="true" id="input-province" onchange="getCities()" class="form-control select2 select2-hidden-accessible">…</select>
  - attempting select option action
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
    - waiting 20ms
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
      - waiting 100ms
    58 × waiting for element to be visible and enabled
       - did not find some options
     - retrying select option action
       - waiting 500ms
: locator("select#input-province")`
- **Bukti Screenshot**: Tersedia di direktori [`reports/naufalans/screenshots/failures/`](file:///D:/Project/2026/Dparagon/DTA-OTA/reports/naufalans/screenshots/failures)

---

### 4. DEF-NAUFALANS-004: Kegagalan Eksekusi pada [Fitur Tambahan: Fee BUMD Tests › BUMD-FEE-006: verify Fee Management and Fee BUMD columns in table]
- **ID Kasus Uji**: `Fitur Tambahan`
- **Berkas Uji**: [`tests/bumd/bumd-fee.e2e.ts`](file:///D:/Project/2026/Dparagon/DTA-OTA/tests/bumd/bumd-fee.e2e.ts)
- **Modul Bisnis**: `bumd`
- **Severity**: Medium / High
- **Priority**: High
- **Status**: OPEN
- **Langkah Reproduksi**:
  1. Buka runner E2E pada berkas `tests/bumd/bumd-fee.e2e.ts`.
  2. Jalankan pengujian pada target portal lingkungan naufalans.
  3. Amati kegagalan pada langkah asersi atau timeout navigasi.
- **Catatan Error**: `expect.toBeVisible failed
locator: locator("table tbody tr td:nth-child(11)").first()
expected: visible
observed: no node (match count 0)`
- **Bukti Screenshot**: Tersedia di direktori [`reports/naufalans/screenshots/failures/`](file:///D:/Project/2026/Dparagon/DTA-OTA/reports/naufalans/screenshots/failures)

---

### 5. DEF-NAUFALANS-005: Kegagalan Eksekusi pada [Fitur Tambahan: Fee BUMD Tests › BUMD-FEE-001 & BUMD-FEE-002: navigate to Fee BUMD tab and validate inputs]
- **ID Kasus Uji**: `Fitur Tambahan`
- **Berkas Uji**: [`tests/bumd/bumd-fee.e2e.ts`](file:///D:/Project/2026/Dparagon/DTA-OTA/tests/bumd/bumd-fee.e2e.ts)
- **Modul Bisnis**: `bumd`
- **Severity**: Medium / High
- **Priority**: High
- **Status**: OPEN
- **Langkah Reproduksi**:
  1. Buka runner E2E pada berkas `tests/bumd/bumd-fee.e2e.ts`.
  2. Jalankan pengujian pada target portal lingkungan naufalans.
  3. Amati kegagalan pada langkah asersi atau timeout navigasi.
- **Catatan Error**: `selectOption did not become actionable in time: locator.selectOption: Timeout 29745ms exceeded.
Call log:
  - waiting for locator('select#input-province')
    - locator resolved to <select required="" tabindex="-1" name="province_id" aria-hidden="true" id="input-province" onchange="getCities()" class="form-control select2 select2-hidden-accessible">…</select>
  - attempting select option action
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
    - waiting 20ms
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
      - waiting 100ms
    58 × waiting for element to be visible and enabled
       - did not find some options
     - retrying select option action
       - waiting 500ms
: locator("select#input-province")`
- **Bukti Screenshot**: Tersedia di direktori [`reports/naufalans/screenshots/failures/`](file:///D:/Project/2026/Dparagon/DTA-OTA/reports/naufalans/screenshots/failures)

---

### 6. DEF-NAUFALANS-006: Kegagalan Eksekusi pada [Fitur Tambahan: Fee BUMD Tests › BUMD-FEE-003: Boundary Value Analysis (BVA) for Fee BUMD (0% and 100%)]
- **ID Kasus Uji**: `Fitur Tambahan`
- **Berkas Uji**: [`tests/bumd/bumd-fee.e2e.ts`](file:///D:/Project/2026/Dparagon/DTA-OTA/tests/bumd/bumd-fee.e2e.ts)
- **Modul Bisnis**: `bumd`
- **Severity**: Medium / High
- **Priority**: High
- **Status**: OPEN
- **Langkah Reproduksi**:
  1. Buka runner E2E pada berkas `tests/bumd/bumd-fee.e2e.ts`.
  2. Jalankan pengujian pada target portal lingkungan naufalans.
  3. Amati kegagalan pada langkah asersi atau timeout navigasi.
- **Catatan Error**: `selectOption did not become actionable in time: locator.selectOption: Timeout 29746ms exceeded.
Call log:
  - waiting for locator('select#input-province')
    - locator resolved to <select required="" tabindex="-1" name="province_id" aria-hidden="true" id="input-province" onchange="getCities()" class="form-control select2 select2-hidden-accessible">…</select>
  - attempting select option action
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
    - waiting 20ms
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
      - waiting 100ms
    58 × waiting for element to be visible and enabled
       - did not find some options
     - retrying select option action
       - waiting 500ms
: locator("select#input-province")`
- **Bukti Screenshot**: Tersedia di direktori [`reports/naufalans/screenshots/failures/`](file:///D:/Project/2026/Dparagon/DTA-OTA/reports/naufalans/screenshots/failures)

---

### 7. DEF-NAUFALANS-007: Kegagalan Eksekusi pada [Bank Data BUMD: End-to-End CRUD Lifecycle with Visual Evidence › BUMD-CRUD-LIFECYCLE: Create, Verify in Table, Update, and Delete BUMD with Visual Evidence]
- **ID Kasus Uji**: `Bank Data BUMD`
- **Berkas Uji**: [`tests/bumd/bumd-crud.e2e.ts`](file:///D:/Project/2026/Dparagon/DTA-OTA/tests/bumd/bumd-crud.e2e.ts)
- **Modul Bisnis**: `bumd`
- **Severity**: Medium / High
- **Priority**: High
- **Status**: OPEN
- **Langkah Reproduksi**:
  1. Buka runner E2E pada berkas `tests/bumd/bumd-crud.e2e.ts`.
  2. Jalankan pengujian pada target portal lingkungan naufalans.
  3. Amati kegagalan pada langkah asersi atau timeout navigasi.
- **Catatan Error**: `selectOption did not become actionable in time: locator.selectOption: Timeout 29743ms exceeded.
Call log:
  - waiting for locator('select#input-province')
    - locator resolved to <select required="" tabindex="-1" name="province_id" aria-hidden="true" id="input-province" onchange="getCities()" class="form-control select2 select2-hidden-accessible">…</select>
  - attempting select option action
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
    - waiting 20ms
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
      - waiting 100ms
    58 × waiting for element to be visible and enabled
       - did not find some options
     - retrying select option action
       - waiting 500ms
: locator("select#input-province")`
- **Bukti Screenshot**: Tersedia di direktori [`reports/naufalans/screenshots/failures/`](file:///D:/Project/2026/Dparagon/DTA-OTA/reports/naufalans/screenshots/failures)

---

### 8. DEF-NAUFALANS-008: Kegagalan Eksekusi pada [Bank Data BUMD: Regression Test Suite (Automated End-to-End) › BUMD-REG-002: Wizard Stepper Navigation and Form State Retention (Tab 1 to Tab 4)]
- **ID Kasus Uji**: `Bank Data BUMD`
- **Berkas Uji**: [`tests/bumd/bumd-regression.e2e.ts`](file:///D:/Project/2026/Dparagon/DTA-OTA/tests/bumd/bumd-regression.e2e.ts)
- **Modul Bisnis**: `bumd`
- **Severity**: Medium / High
- **Priority**: High
- **Status**: OPEN
- **Langkah Reproduksi**:
  1. Buka runner E2E pada berkas `tests/bumd/bumd-regression.e2e.ts`.
  2. Jalankan pengujian pada target portal lingkungan naufalans.
  3. Amati kegagalan pada langkah asersi atau timeout navigasi.
- **Catatan Error**: `selectOption did not become actionable in time: locator.selectOption: Timeout 29742ms exceeded.
Call log:
  - waiting for locator('select#input-province')
    - locator resolved to <select required="" tabindex="-1" name="province_id" aria-hidden="true" id="input-province" onchange="getCities()" class="form-control select2 select2-hidden-accessible">…</select>
  - attempting select option action
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
    - waiting 20ms
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
      - waiting 100ms
    58 × waiting for element to be visible and enabled
       - did not find some options
     - retrying select option action
       - waiting 500ms
: locator("select#input-province")`
- **Bukti Screenshot**: Tersedia di direktori [`reports/naufalans/screenshots/failures/`](file:///D:/Project/2026/Dparagon/DTA-OTA/reports/naufalans/screenshots/failures)

---

### 9. DEF-NAUFALANS-009: Kegagalan Eksekusi pada [Bank Data BUMD: Regression Test Suite (Automated End-to-End) › BUMD-REG-003: Full Data Lifecycle CRUD (Create -> Verify -> Update -> Verify -> Delete -> Verify Teardown)]
- **ID Kasus Uji**: `Bank Data BUMD`
- **Berkas Uji**: [`tests/bumd/bumd-regression.e2e.ts`](file:///D:/Project/2026/Dparagon/DTA-OTA/tests/bumd/bumd-regression.e2e.ts)
- **Modul Bisnis**: `bumd`
- **Severity**: Medium / High
- **Priority**: High
- **Status**: OPEN
- **Langkah Reproduksi**:
  1. Buka runner E2E pada berkas `tests/bumd/bumd-regression.e2e.ts`.
  2. Jalankan pengujian pada target portal lingkungan naufalans.
  3. Amati kegagalan pada langkah asersi atau timeout navigasi.
- **Catatan Error**: `selectOption did not become actionable in time: locator.selectOption: Timeout 29744ms exceeded.
Call log:
  - waiting for locator('select#input-province')
    - locator resolved to <select required="" tabindex="-1" name="province_id" aria-hidden="true" id="input-province" onchange="getCities()" class="form-control select2 select2-hidden-accessible">…</select>
  - attempting select option action
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
    - waiting 20ms
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
      - waiting 100ms
    58 × waiting for element to be visible and enabled
       - did not find some options
     - retrying select option action
       - waiting 500ms
: locator("select#input-province")`
- **Bukti Screenshot**: Tersedia di direktori [`reports/naufalans/screenshots/failures/`](file:///D:/Project/2026/Dparagon/DTA-OTA/reports/naufalans/screenshots/failures)

---

### 10. DEF-NAUFALANS-010: Kegagalan Eksekusi pada [Suite Regresi: Menu Tag Properti › REG-BUG-006: Verifikasi penolakan duplikasi Nama Kelompok pada Tag Properti]
- **ID Kasus Uji**: `Suite Regresi`
- **Berkas Uji**: [`tests/mitra/regression-suite.e2e.ts`](file:///D:/Project/2026/Dparagon/DTA-OTA/tests/mitra/regression-suite.e2e.ts)
- **Modul Bisnis**: `mitra`
- **Severity**: Medium / High
- **Priority**: High
- **Status**: OPEN
- **Langkah Reproduksi**:
  1. Buka runner E2E pada berkas `tests/mitra/regression-suite.e2e.ts`.
  2. Jalankan pengujian pada target portal lingkungan naufalans.
  3. Amati kegagalan pada langkah asersi atau timeout navigasi.
- **Catatan Error**: `expect.toBeVisible failed
locator: locator(".modal, [role=\"dialog\"]").first()
expected: visible
observed: states: hidden (match count 1)`
- **Bukti Screenshot**: Tersedia di direktori [`reports/naufalans/screenshots/failures/`](file:///D:/Project/2026/Dparagon/DTA-OTA/reports/naufalans/screenshots/failures)

---

### 11. DEF-NAUFALANS-011: Kegagalan Eksekusi pada [Modul 2: Setting Mitra & Master Tag Properti (11 Kasus Uji) › TAG-UI-002: Ubah Input Warna Label Menjadi Color Picker pada Form Tambah Tag Properti]
- **ID Kasus Uji**: `Modul 2`
- **Berkas Uji**: [`tests/regression-44-items.e2e.ts`](file:///D:/Project/2026/Dparagon/DTA-OTA/tests/regression-44-items.e2e.ts)
- **Modul Bisnis**: `regression-44`
- **Severity**: Medium / High
- **Priority**: High
- **Status**: OPEN
- **Langkah Reproduksi**:
  1. Buka runner E2E pada berkas `tests/regression-44-items.e2e.ts`.
  2. Jalankan pengujian pada target portal lingkungan naufalans.
  3. Amati kegagalan pada langkah asersi atau timeout navigasi.
- **Catatan Error**: `expect.toBeVisible failed
locator: locator("input[type=\"color\"]").first()
expected: visible
observed: no node (match count 0)`
- **Bukti Screenshot**: Tersedia di direktori [`reports/naufalans/screenshots/failures/`](file:///D:/Project/2026/Dparagon/DTA-OTA/reports/naufalans/screenshots/failures)

---

### 12. DEF-NAUFALANS-012: Kegagalan Eksekusi pada [Modul 2: Setting Mitra & Master Tag Properti (11 Kasus Uji) › TRANSIT-EXP-001: Slot Transit Kedaluwarsa Ditolak / Tidak Bisa Dilanjutkan]
- **ID Kasus Uji**: `Modul 2`
- **Berkas Uji**: [`tests/regression-44-items.e2e.ts`](file:///D:/Project/2026/Dparagon/DTA-OTA/tests/regression-44-items.e2e.ts)
- **Modul Bisnis**: `regression-44`
- **Severity**: Medium / High
- **Priority**: High
- **Status**: OPEN
- **Langkah Reproduksi**:
  1. Buka runner E2E pada berkas `tests/regression-44-items.e2e.ts`.
  2. Jalankan pengujian pada target portal lingkungan naufalans.
  3. Amati kegagalan pada langkah asersi atau timeout navigasi.
- **Catatan Error**: `expect.toBeVisible failed
locator: locator(":has-text(\"kedaluwarsa\"), :has-text(\"tidak tersedia\"), :has-text(\"expired\")").first()
expected: visible
observed: no node (match count 0)`
- **Bukti Screenshot**: Tersedia di direktori [`reports/naufalans/screenshots/failures/`](file:///D:/Project/2026/Dparagon/DTA-OTA/reports/naufalans/screenshots/failures)

---

### 13. DEF-NAUFALANS-013: Kegagalan Eksekusi pada [Modul 4: Portal Mitra: Kontak, Kontrak, & Crisis Policy (12 Kasus Uji) › AUTH-REV-001: Integrasi Pendaftaran Mitra OTA dengan Halaman Revamp & Modal Login Baru]
- **ID Kasus Uji**: `Modul 4`
- **Berkas Uji**: [`tests/regression-44-items.e2e.ts`](file:///D:/Project/2026/Dparagon/DTA-OTA/tests/regression-44-items.e2e.ts)
- **Modul Bisnis**: `regression-44`
- **Severity**: Medium / High
- **Priority**: High
- **Status**: OPEN
- **Langkah Reproduksi**:
  1. Buka runner E2E pada berkas `tests/regression-44-items.e2e.ts`.
  2. Jalankan pengujian pada target portal lingkungan naufalans.
  3. Amati kegagalan pada langkah asersi atau timeout navigasi.
- **Catatan Error**: `expect.toBeVisible failed
locator: locator("a[href*=\"mitra/register\"], a:has-text(\"Daftar Mitra\"), button:has-text(\"Daftar Mitra\")").first()
expected: visible
observed: no node (match count 0)`
- **Bukti Screenshot**: Tersedia di direktori [`reports/naufalans/screenshots/failures/`](file:///D:/Project/2026/Dparagon/DTA-OTA/reports/naufalans/screenshots/failures)

---

### 14. DEF-NAUFALANS-014: Kegagalan Eksekusi pada [REG-LIFECYCLE-002: 35-Step Full Regression Lifecycle with AI Agent Integration]
- **ID Kasus Uji**: `REG-LIFECYCLE-002`
- **Berkas Uji**: [`tests/mitra/property-approval-kso-lifecycle.e2e.ts`](file:///D:/Project/2026/Dparagon/DTA-OTA/tests/mitra/property-approval-kso-lifecycle.e2e.ts)
- **Modul Bisnis**: `lifecycle`
- **Severity**: Medium / High
- **Priority**: High
- **Status**: OPEN
- **Langkah Reproduksi**:
  1. Buka runner E2E pada berkas `tests/mitra/property-approval-kso-lifecycle.e2e.ts`.
  2. Jalankan pengujian pada target portal lingkungan naufalans.
  3. Amati kegagalan pada langkah asersi atau timeout navigasi.
- **Catatan Error**: `selectOption did not become actionable in time: locator.selectOption: Timeout 29715ms exceeded.
Call log:
  - waiting for locator('select#province_id')
    - locator resolved to <select required="" tabindex="-1" id="province_id" name="province_id" aria-hidden="true" class="mp-form-control select2 select2-hidden-accessible">…</select>
  - attempting select option action
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
    - waiting 20ms
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
      - waiting 100ms
    58 × waiting for element to be visible and enabled
       - did not find some options
     - retrying select option action
       - waiting 500ms
: locator("select#province_id")`
- **Bukti Screenshot**: Tersedia di direktori [`reports/naufalans/screenshots/failures/`](file:///D:/Project/2026/Dparagon/DTA-OTA/reports/naufalans/screenshots/failures)

---

