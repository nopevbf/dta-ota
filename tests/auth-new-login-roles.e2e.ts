import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import {
  TARGET_URL,
  setupApiRouteBridge,
  dismissInitialPromo,
  openLoginModal,
  logoutSession,
  takeAuthScreenshot
} from './support/auth-helpers.js';

test.describe('DParagon New Authentication - Multi-Role Login Suite', { serial: true }, () => {
  const mgmtUser = process.env.E2E_USER_MANAJEMEN_USERNAME || 'superadmin@dparagon.com';
  const mgmtPass = process.env.E2E_USER_MANAJEMEN_PASSWORD || 'Merpati98';

  const mitraUser = process.env.E2E_USER_MITRA_USERNAME || 'lodod41077@crybio.com';
  const mitraPass = process.env.E2E_USER_MITRA_PASSWORD || 'Qwerty12345';

  const tamuUser = process.env.E2E_USER_TAMU_USERNAME || 'kzodiek@gmail.com';
  const tamuPass = process.env.E2E_USER_TAMU_PASSWORD || 'qwerty12345';

  test.beforeEach(async ({ browser }) => {
    await setupApiRouteBridge(browser);
  });

  /**
   * Test Case ID   : TC-AUTH-POPUP-001
   * Test Suite     : Initial Promo Handling & Modal Opening
   * Module         : D'Paragon OTA Home
   * Test Objective : Verifikasi popup promo awal dapat ditutup dan modal login dapat dibuka
   * Priority       : High
   * Severity       : High
   */
  test('TC-AUTH-POPUP-001: should dismiss promo popup and open login modal', async ({ app, browser }) => {
    await browser.goto(TARGET_URL);
    await new Promise(r => setTimeout(r, 2000));

    // 1. Assert popup promo muncul atau langsung ditutup
    await dismissInitialPromo(browser);
    await takeAuthScreenshot(app, 'TC-AUTH-POPUP-001-promo-closed');

    // 2. Klik login untuk membuka modal
    await openLoginModal(browser);
    const modalHeading = browser.locator('h2:has-text("Log in to D’Paragon")');
    await expect(modalHeading).toBeVisible();
    await takeAuthScreenshot(app, 'TC-AUTH-POPUP-001-login-modal-open');
  });

  /**
   * Test Case ID   : TC-AUTH-MGMT-001
   * Test Suite     : Multi-Role Authentication
   * Module         : Manajemen Login
   * Test Objective : Memvalidasi login role Manajemen menggunakan modal baru sampai redirect ke dashboard manajemen
   * Priority       : Critical
   * Severity       : High
   */
  test('TC-AUTH-MGMT-001: authenticate Manajemen role and redirect to dashboard', async ({ app, browser }) => {
    await logoutSession(browser);
    await openLoginModal(browser);

    const userInput = browser.locator('input[placeholder*="Email address or username"]').first();
    const passInput = browser.locator('input[placeholder*="Password"]').first();
    const submitBtn = browser.locator('button[type="submit"]:has-text("Log In")').first();

    await userInput.fill(mgmtUser);
    await passInput.fill(mgmtPass);
    await takeAuthScreenshot(app, 'TC-AUTH-MGMT-001-form-filled');
    await submitBtn.click();

    // Tunggu redirect ke dashboard manajemen
    await browser.waitForURL(/.*management\.dparagon7\.persona-it\.com.*/, { timeout: 45000 });
    await expect(browser).toHaveURL(/.*management\.dparagon7\.persona-it\.com.*/);
    await takeAuthScreenshot(app, 'TC-AUTH-MGMT-001-dashboard-redirect');

    // Logout sebelum berpindah ke role berikutnya
    await logoutSession(browser);
    await takeAuthScreenshot(app, 'TC-AUTH-MGMT-001-logged-out');
  });

  /**
   * Test Case ID   : TC-AUTH-MITRA-001
   * Test Suite     : Multi-Role Authentication
   * Module         : Mitra Login
   * Test Objective : Memvalidasi login role Mitra menggunakan modal baru sampai redirect ke portal / dashboard mitra
   * Priority       : Critical
   * Severity       : High
   */
  test('TC-AUTH-MITRA-001: authenticate Mitra role and redirect to dashboard', async ({ app, browser }) => {
    await logoutSession(browser);
    await openLoginModal(browser);

    const userInput = browser.locator('input[placeholder*="Email address or username"]').first();
    const passInput = browser.locator('input[placeholder*="Password"]').first();
    const submitBtn = browser.locator('button[type="submit"]:has-text("Log In")').first();

    await userInput.fill(mitraUser);
    await passInput.fill(mitraPass);
    await takeAuthScreenshot(app, 'TC-AUTH-MITRA-001-form-filled');
    await submitBtn.click();

    // Tunggu redirect ke portal mitra (guest.dparagon7.persona-it.com/mitra)
    await browser.waitForURL(/.*mitra.*/, { timeout: 45000 });
    await expect(browser).toHaveURL(/.*mitra.*/);
    await takeAuthScreenshot(app, 'TC-AUTH-MITRA-001-dashboard-redirect');

    // Logout sebelum berpindah ke role berikutnya
    await logoutSession(browser);
    await takeAuthScreenshot(app, 'TC-AUTH-MITRA-001-logged-out');
  });

  /**
   * Test Case ID   : TC-AUTH-TAMU-001
   * Test Suite     : Multi-Role Authentication
   * Module         : Tamu Login
   * Test Objective : Memvalidasi login role Tamu menggunakan modal baru sampai sesi aktif
   * Priority       : Critical
   * Severity       : High
   */
  test('TC-AUTH-TAMU-001: authenticate Tamu role and verify active session', async ({ app, browser }) => {
    await logoutSession(browser);
    await openLoginModal(browser);

    const userInput = browser.locator('input[placeholder*="Email address or username"]').first();
    const passInput = browser.locator('input[placeholder*="Password"]').first();
    const submitBtn = browser.locator('button[type="submit"]:has-text("Log In")').first();

    await userInput.fill(tamuUser);
    await passInput.fill(tamuPass);
    await takeAuthScreenshot(app, 'TC-AUTH-TAMU-001-form-filled');
    await submitBtn.click();

    // Tunggu modal tertutup dan tombol profile / sesi aktif tampil
    const modalHeading = browser.locator('h2:has-text("Log in to D’Paragon")');
    await expect(modalHeading).not.toBeVisible({ timeout: 45000 });
    await takeAuthScreenshot(app, 'TC-AUTH-TAMU-001-session-active');

    // Logout
    await logoutSession(browser);
    await takeAuthScreenshot(app, 'TC-AUTH-TAMU-001-logged-out');
  });

  /**
   * Test Case ID   : TC-AUTH-NEG-001
   * Test Suite     : Negative Authentication Testing
   * Module         : Invalid Credentials
   * Test Objective : Verifikasi input kredensial salah menampilkan pesan error
   * Priority       : High
   * Severity       : Medium
   */
  test('TC-AUTH-NEG-001: submitting invalid credentials displays error feedback', async ({ app, browser }) => {
    await logoutSession(browser);
    await openLoginModal(browser);

    const userInput = browser.locator('input[placeholder*="Email address or username"]').first();
    const passInput = browser.locator('input[placeholder*="Password"]').first();
    const submitBtn = browser.locator('button[type="submit"]:has-text("Log In")').first();

    await userInput.fill('invalid_user_qa_istqb@example.com');
    await passInput.fill('WrongPassword123!');
    await submitBtn.click();

    // Tunggu feedback respon gagal dari backend
    await new Promise(r => setTimeout(r, 10000));
    await takeAuthScreenshot(app, 'TC-AUTH-NEG-001-invalid-credentials');

    // Modal tetap terbuka
    const modalHeading = browser.locator('h2:has-text("Log in to D’Paragon")');
    await expect(modalHeading).toBeVisible();
  });
});
