import fs from 'node:fs';
import path from 'node:path';
import { getReportScreenshotDir } from './env-config.ts';

/**
 * Menyimpan screenshot bukti uji secara dinamis ke direktori reports/<ACTIVE_ENV>/screenshots/<module>/
 */
export async function captureEvidenceScreenshot(
  app: any,
  moduleName: string,
  testId: string,
  suffix?: string
): Promise<string> {
  const reportsDir = getReportScreenshotDir(moduleName);
  const cleanId = testId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = suffix ? `${cleanId}-${suffix}.png` : `${cleanId}.png`;
  const destPath = path.join(reportsDir, filename);

  try {
    const label = suffix ? `${cleanId}_${suffix}` : cleanId;
    const relative = await app.screenshot(label);

    if (relative) {
      const candidate = path.resolve(process.cwd(), relative);
      if (fs.existsSync(candidate)) {
        fs.copyFileSync(candidate, destPath);
        return destPath;
      }
    }

    const resultsDir = path.resolve(process.cwd(), '.e2e', 'results');
    if (fs.existsSync(resultsDir)) {
      const searchFile = (dir: string): boolean => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            if (searchFile(full)) return true;
          } else if (entry.name.includes(cleanId) && entry.name.endsWith('.png')) {
            fs.copyFileSync(full, destPath);
            return true;
          }
        }
        return false;
      };
      searchFile(resultsDir);
    }
  } catch (err) {
    // Fail-safe jika permission buffer ditolak
  }

  return destPath;
}
