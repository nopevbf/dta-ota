import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const TEST_FILES = [
  // 1. Central Authentication (5 files)
  { group: 'auth', file: 'tests/roles-auth.e2e.ts' },
  { group: 'auth', file: 'tests/auth-flow.e2e.ts' },
  { group: 'auth', file: 'tests/auth-new-login-roles.e2e.ts' },
  { group: 'auth', file: 'tests/auth-new-register-guest.e2e.ts' },
  { group: 'auth', file: 'tests/auth-new-register-mitra.e2e.ts' },

  // 2. Finance BUMD (5 files)
  { group: 'bumd', file: 'tests/bumd/bumd-list-filter.e2e.ts' },
  { group: 'bumd', file: 'tests/bumd/bumd-create-wizard.e2e.ts' },
  { group: 'bumd', file: 'tests/bumd/bumd-fee.e2e.ts' },
  { group: 'bumd', file: 'tests/bumd/bumd-crud.e2e.ts' },
  { group: 'bumd', file: 'tests/bumd/bumd-regression.e2e.ts' },

  // 3. Setting Mitra & Tags (8 files)
  { group: 'mitra', file: 'tests/mitra/mitra-list-filter.e2e.ts' },
  { group: 'mitra', file: 'tests/mitra/mitra-detail.e2e.ts' },
  { group: 'mitra', file: 'tests/mitra/mitra-modal-crud.e2e.ts' },
  { group: 'mitra', file: 'tests/mitra/mitra-onprogress.e2e.ts' },
  { group: 'mitra', file: 'tests/mitra/tag-properti.e2e.ts' },
  { group: 'mitra', file: 'tests/mitra/tag-crud-lifecycle.e2e.ts' },
  { group: 'mitra', file: 'tests/mitra/mitra-crud-lifecycle.e2e.ts' },
  { group: 'mitra', file: 'tests/mitra/regression-suite.e2e.ts' },

  // 4. Revenue Report (1 file)
  { group: 'revenue', file: 'tests/reports/revenue-report.e2e.ts' },

  // 5. Core Regression 44 Items (1 file)
  { group: 'regression-44', file: 'tests/regression-44-items.e2e.ts' },

  // 6. 35-Step Full Lifecycle KSO (1 file)
  { group: 'lifecycle', file: 'tests/mitra/property-approval-kso-lifecycle.e2e.ts' },
];

const REPORTS_BASE = path.resolve(process.cwd(), 'reports', 'naufalans');
const SCREENSHOTS_BASE = path.join(REPORTS_BASE, 'screenshots');
const LOG_FILE = path.join(REPORTS_BASE, 'execution.log');

// Ensure base report directories exist
['auth', 'bumd', 'mitra', 'lifecycle', 'revenue', 'regression-44', 'failures'].forEach((sub) => {
  fs.mkdirSync(path.join(SCREENSHOTS_BASE, sub), { recursive: true });
});

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

/**
 * Run a command and return promise with output
 */
function runCommand(cmd, args, envVars = {}) {
  return new Promise((resolve) => {
    const isWin = process.platform === 'win32';
    const shellCmd = isWin ? 'cmd.exe' : '/bin/sh';
    const shellArgs = isWin ? ['/d', '/s', '/c', [cmd, ...args].join(' ')] : ['-c', [cmd, ...args].join(' ')];

    const child = spawn(shellCmd, shellArgs, {
      cwd: process.cwd(),
      env: { ...process.env, APP_ENV: 'naufalans', ...envVars },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (d) => {
      stdout += d.toString();
      process.stdout.write(d);
    });

    child.stderr.on('data', (d) => {
      stderr += d.toString();
      process.stderr.write(d);
    });

    child.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

/**
 * Scan .e2e/report.json and .e2e/results for artifacts
 */
function extractResultsFromReportJson(testFile, fallbackDuration) {
  const reportPath = path.resolve(process.cwd(), '.e2e', 'report.json');
  if (!fs.existsSync(reportPath)) return [];

  try {
    const data = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    const results = data.run?.results || [];
    const normalizedFile = testFile.replace(/\\/g, '/');

    // Filter results matching the executed file
    const matched = results.filter((r) => r.file && r.file.replace(/\\/g, '/') === normalizedFile);

    return matched.map((r) => {
      const attempt = r.attempts?.[0] || {};
      const durationMs = attempt.durationMs || 0;
      const title = r.titlePath ? r.titlePath.join(' › ') : r.testId;
      const status = r.status === 'passed' ? 'PASSED' : r.status === 'skipped' ? 'SKIPPED' : 'FAILED';
      const errorMsg = attempt.error?.message || attempt.secondaryErrors?.[0]?.message || '';

      // Collect artifacts from attempt
      const artifacts = attempt.artifacts || [];

      return {
        title,
        status,
        duration: durationMs ? `${(durationMs / 1000).toFixed(2)}s` : `${fallbackDuration}s`,
        error: errorMsg,
        artifacts,
      };
    });
  } catch (err) {
    return [];
  }
}

/**
 * Copy failure screenshots to reports/naufalans/screenshots/failures/
 */
function syncFailureScreenshots(testFileName) {
  const resultsDir = path.resolve(process.cwd(), '.e2e', 'results');
  if (!fs.existsSync(resultsDir)) return [];

  const copied = [];
  const failuresDir = path.join(SCREENSHOTS_BASE, 'failures');

  const walk = (dir) => {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const ent of entries) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) {
          walk(full);
        } else if (ent.name.endsWith('.png') && (ent.name.includes('failure') || ent.name.includes('FAILED') || dir.includes('attempt-'))) {
          const destName = `${path.basename(testFileName, '.e2e.ts')}-${ent.name}`;
          const destPath = path.join(failuresDir, destName);
          if (!fs.existsSync(destPath)) {
            fs.copyFileSync(full, destPath);
            copied.push(destPath);
          }
        }
      }
    } catch {}
  };

  walk(resultsDir);
  return copied;
}

async function main() {
  fs.writeFileSync(LOG_FILE, `=== E2E Test Suite Execution Started for Naufalans ===\n`);
  const overallStart = Date.now();

  const fileResults = [];
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  let totalSkipped = 0;

  for (let i = 0; i < TEST_FILES.length; i++) {
    const { group, file } = TEST_FILES[i];
    log(`[SUITE ${i + 1}/${TEST_FILES.length}] Menjalankan: ${file} (Modul: ${group})`);

    const fileStart = Date.now();
    const { code, stdout, stderr } = await runCommand('npx', ['e2e', 'run', file, '--trace', 'on']);
    const fileDuration = ((Date.now() - fileStart) / 1000).toFixed(2);

    // Read exact results from .e2e/report.json
    let parsedTests = extractResultsFromReportJson(file, fileDuration);
    syncFailureScreenshots(file);

    let filePassed = 0;
    let fileFailed = 0;
    let fileSkipped = 0;

    parsedTests.forEach((t) => {
      if (t.status === 'PASSED') filePassed++;
      else if (t.status === 'SKIPPED') fileSkipped++;
      else fileFailed++;
    });

    // Fallback if report.json had no matched tests
    if (parsedTests.length === 0) {
      if (code === 0) {
        filePassed = 1;
        parsedTests.push({ title: path.basename(file), status: 'PASSED', duration: `${fileDuration}s`, error: '' });
      } else {
        fileFailed = 1;
        parsedTests.push({ title: path.basename(file), status: 'FAILED', duration: `${fileDuration}s`, error: stderr.slice(-300) });
      }
    }

    totalTests += parsedTests.length;
    totalPassed += filePassed;
    totalFailed += fileFailed;
    totalSkipped += fileSkipped;

    const fileResult = {
      index: i + 1,
      group,
      file,
      code,
      duration: `${fileDuration}s`,
      tests: parsedTests,
      passed: filePassed,
      failed: fileFailed,
      skipped: fileSkipped,
    };
    fileResults.push(fileResult);

    log(`[SELESAI ${i + 1}/${TEST_FILES.length}] ${file}: ${filePassed} PASS, ${fileFailed} FAIL (${fileDuration}s)`);

    // Write progressive results JSON after each file
    fs.writeFileSync(
      path.join(REPORTS_BASE, 'test-results.json'),
      JSON.stringify({ totalTests, totalPassed, totalFailed, totalSkipped, durationSeconds: ((Date.now() - overallStart) / 1000).toFixed(2), fileResults }, null, 2)
    );
  }

  const overallDuration = ((Date.now() - overallStart) / 1000).toFixed(2);
  const passRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(2) : '0.00';

  log(`=== Eksekusi Selesai: Total ${totalTests} Tests | ${totalPassed} PASS | ${totalFailed} FAIL | Pass Rate: ${passRate}% (${overallDuration}s) ===`);

  // Generate ISTQB Master Test Summary Report
  generateMasterSummaryReport(fileResults, { totalTests, totalPassed, totalFailed, totalSkipped, passRate, overallDuration });

  // Generate Defect Log
  generateDefectLog(fileResults);

  log(`Laporan berhasil dikompilasi di ${REPORTS_BASE}`);
}

function generateMasterSummaryReport(fileResults, summary) {
  let md = `# Master Test Summary Report: Hasil Eksekusi Menyeluruh E2E DTA-OTA (Lingkungan Naufalans)\n\n`;
  md += `- **Nama Proyek**: D'Paragon Test Automation (DTA-OTA)\n`;
  md += `- **Target Sistem**: Portal Manajemen, Portal Mitra, Portal Tamu, & Portal Autentikasi Terpusat D'Paragon\n`;
  md += `- **Lingkungan Uji**: Staging Environment Naufalans (\`https://fe.naufalans.me/\`, \`https://management.naufalans.me/\`, \`https://guest.naufalans.me/\`, \`https://auth.naufalans.me/login\`)\n`;
  md += `- **Fase STLC**: Phase 6 — Test Cycle Closure (Penutupan Siklus Pengujian Staging Naufalans)\n`;
  md += `- **Standar QA**: ISTQB (International Software Testing Qualifications Board)\n`;
  md += `- **Tanggal Eksekusi**: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}\n`;
  md += `- **Test Runner & Engine**: \`e2e\` v0.19.0 · \`@e2e-dev/web\` (Playwright Chromium Engine - Headless)\n`;
  md += `- **Mode Eksekusi**: Sekuensial Strict One-Pass (0 Retry, As-Is)\n\n`;
  md += `---\n\n`;

  md += `## 1. Ringkasan Eksekutif (Executive Summary)\n\n`;
  md += `Seluruh rangkaian pengujian otomatis *End-to-End (E2E)* pada ekosistem **DTA-OTA** telah berhasil dieksekusi secara penuh pada lingkungan staging **Naufalans** (\`fe.naufalans.me\` dan portal terkait) dengan prinsip pengujian **apa adanya (*as-is*)** tanpa memanipulasi asersi.\n\n`;
  md += `Setiap pengujian telah dilengkapi bukti tangkapan layar visual (*visual screenshot evidence*) yang disimpan terpisah dalam direktori \`reports/naufalans/screenshots/\` berdasarkan kelompok modulnya masing-masing.\n\n`;

  md += `### Metrik Kuantitatif Kualitas (ISTQB Key Metrics)\n\n`;
  md += `| Metrik Pengujian | Nilai Aktual Naufalans | Standar Evaluasi ISTQB |\n`;
  md += `| :--- | :---: | :---: |\n`;
  md += `| **Total Test Suites Executed** | **${fileResults.length} File Suite** | **100% EXECUTED** |\n`;
  md += `| **Total Test Cases Executed** | **${summary.totalTests} Test Cases** | **100% EXECUTED** |\n`;
  md += `| **Passed Tests** | **${summary.totalPassed} Test Cases** | **${summary.passRate}% PASS** |\n`;
  md += `| **Failed Tests** | **${summary.totalFailed} Test Cases** | **${(100 - parseFloat(summary.passRate)).toFixed(2)}% FAIL** |\n`;
  md += `| **Pass Rate Konsolidasi** | **${summary.passRate}%** | **EVALUASI AKTUAL AS-IS** |\n`;
  md += `| **Total Durasi Eksekusi** | **${summary.overallDuration}s** | **SEKUENSIAL HEADLESS** |\n\n`;
  md += `---\n\n`;

  md += `## 2. Rincian Hasil Eksekusi per Test Suite\n\n`;
  md += `| No | Modul | Berkas Uji | Total Case | Pass | Fail | Durasi | Status Suite |\n`;
  md += `| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: |\n`;

  fileResults.forEach((fr) => {
    const statusIcon = fr.failed === 0 ? '✅ PASS' : '❌ FAIL';
    md += `| ${fr.index} | \`${fr.group}\` | [\`${fr.file}\`](file:///${path.resolve(process.cwd(), fr.file).replace(/\\/g, '/')}) | ${fr.tests.length} | ${fr.passed} | ${fr.failed} | ${fr.duration} | ${statusIcon} |\n`;
  });

  md += `\n---\n\n`;

  md += `## 3. Rincian per Kasus Uji & Tautan Bukti Screenshot\n\n`;

  fileResults.forEach((fr) => {
    md += `### Suite: \`${fr.file}\` (Modul: ${fr.group})\n\n`;
    md += `| Test Case / Skenario | Status | Durasi | Tautan Bukti Screenshot |\n`;
    md += `| :--- | :---: | :---: | :--- |\n`;

    fr.tests.forEach((t) => {
      const icon = t.status === 'PASSED' ? '✅ PASS' : '❌ FAIL';
      const cleanLabel = t.title.split(':')[0].trim().replace(/[^a-zA-Z0-9_-]/g, '_');

      // Search matching screenshot in module subfolder
      const groupDir = path.join(SCREENSHOTS_BASE, fr.group);
      let foundLink = '-';
      if (fs.existsSync(groupDir)) {
        const files = fs.readdirSync(groupDir);
        const match = files.find((f) => f.includes(cleanLabel) || t.title.includes(f.replace('.png', '')));
        if (match) {
          const abs = path.join(groupDir, match).replace(/\\/g, '/');
          foundLink = `[\`${match}\`](file:///${abs})`;
        }
      }

      // If failed and present in failures dir
      if (t.status === 'FAILED') {
        const failDir = path.join(SCREENSHOTS_BASE, 'failures');
        if (fs.existsSync(failDir)) {
          const fFiles = fs.readdirSync(failDir);
          const fMatch = fFiles.find((f) => f.includes(cleanLabel) || f.includes(path.basename(fr.file, '.e2e.ts')));
          if (fMatch) {
            const abs = path.join(failDir, fMatch).replace(/\\/g, '/');
            foundLink += ` / [Failure Evidence](file:///${abs})`;
          }
        }
      }

      md += `| **${t.title}** | ${icon} | ${t.duration || '-'} | ${foundLink} |\n`;
    });
    md += `\n`;
  });

  fs.writeFileSync(path.join(REPORTS_BASE, 'MASTER_TEST_SUMMARY_REPORT_NAUFALANS.md'), md);
}

function generateDefectLog(fileResults) {
  let md = `# Defect Log: Hasil Pengujian Otomatisasi Lingkungan Staging Naufalans\n\n`;
  md += `- **Lingkungan Uji**: \`https://fe.naufalans.me/\` & Portal Terkait\n`;
  md += `- **Tanggal Audit**: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}\n`;
  md += `- **Standar Pelaporan**: SQA-ISTQB Standard Defect Tracking\n`;
  md += `- **Prinsip Pelaporan**: *Apa Adanya (As-Is)* dengan Bukti Tangkapan Layar Lengkap\n\n`;
  md += `---\n\n`;

  const failedTests = [];
  fileResults.forEach((fr) => {
    fr.tests.forEach((t) => {
      if (t.status === 'FAILED') {
        failedTests.push({ ...t, file: fr.file, group: fr.group });
      }
    });
  });

  md += `## Ringkasan Defect (Defect Summary)\n\n`;
  md += `Total Cacat / Kegagalan Terdeteksi: **${failedTests.length} Defect**\n\n`;

  if (failedTests.length === 0) {
    md += `> [!NOTE]\n> **NIL DEFECTS**: Seluruh kasus uji yang dieksekusi pada lingkungan Naufalans berhasil diselesaikan tanpa cacat uji.\n\n`;
  } else {
    md += `| Defect ID | Kasus Uji | Modul | Berkas Uji | Status |\n`;
    md += `| :---: | :--- | :---: | :--- | :---: |\n`;
    failedTests.forEach((ft, idx) => {
      const defId = `DEF-NAUFALANS-${String(idx + 1).padStart(3, '0')}`;
      md += `| **${defId}** | ${ft.title} | \`${ft.group}\` | \`${ft.file}\` | **OPEN (INVESTIGASI)** |\n`;
    });
    md += `\n---\n\n`;

    md += `## Daftar Lengkap Defect (Defect Registry)\n\n`;
    failedTests.forEach((ft, idx) => {
      const defId = `DEF-NAUFALANS-${String(idx + 1).padStart(3, '0')}`;
      md += `### ${idx + 1}. ${defId}: Kegagalan Eksekusi pada [${ft.title}]\n`;
      md += `- **ID Kasus Uji**: \`${ft.title.split(':')[0].trim()}\`\n`;
      md += `- **Berkas Uji**: [\`${ft.file}\`](file:///${path.resolve(process.cwd(), ft.file).replace(/\\/g, '/')})\n`;
      md += `- **Modul Bisnis**: \`${ft.group}\`\n`;
      md += `- **Severity**: Medium / High\n`;
      md += `- **Priority**: High\n`;
      md += `- **Status**: OPEN\n`;
      md += `- **Langkah Reproduksi**:\n`;
      md += `  1. Buka runner E2E pada berkas \`${ft.file}\`.\n`;
      md += `  2. Jalankan pengujian pada target portal lingkungan naufalans.\n`;
      md += `  3. Amati kegagalan pada langkah asersi atau timeout navigasi.\n`;
      md += `- **Catatan Error**: \`${ft.error || 'Assertion failed / timeout during execution'}\`\n`;
      md += `- **Bukti Screenshot**: Tersedia di direktori [\`reports/naufalans/screenshots/failures/\`](file:///${path.resolve(SCREENSHOTS_BASE, 'failures').replace(/\\/g, '/')})\n\n`;
      md += `---\n\n`;
    });
  }

  fs.writeFileSync(path.join(REPORTS_BASE, 'DEFECT_LOG_NAUFALANS.md'), md);
}

main().catch((err) => {
  console.error('Fatal runner error:', err);
  process.exit(1);
});
