import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import {
  TARGET_URL,
  setupApiRouteBridge,
  openLoginModal,
  logoutSession,
  takeAuthScreenshot
} from './support/auth-helpers.js';
import { createTempInbox } from './support/temp-mail.js';

test.describe('DParagon New Authentication - Guest Registration Suite', { serial: true }, () => {
  let tempEmail = '';

  test.beforeEach(async ({ browser }) => {
    await setupApiRouteBridge(browser);
  });

  /**
   * Test Case ID   : TC-REG-GUEST-001
   * Test Suite     : Guest Registration Navigation
   * Module         : Register at D'Paragon
   * Test Objective : Verifikasi navigasi ke form registrasi tamu via link Sign Up pada modal login
   * Priority       : Critical
   * Severity       : High
   */
  test('TC-REG-GUEST-001: navigate to Register at D\'Paragon form', async ({ app, browser }) => {
    await logoutSession(browser);
    await openLoginModal(browser);

    const signUpBtn = browser.locator('button:has-text("Sign Up")');
    await expect(signUpBtn).toBeVisible();
    await signUpBtn.click();

    // Verifikasi form Register at D'Paragon tampil
    const heading = browser.locator('h2:has-text("Register at D’Paragon")');
    await expect(heading).toBeVisible();
    await takeAuthScreenshot(app, 'TC-REG-GUEST-001-form-opened');
  });

  /**
   * Test Case ID   : TC-REG-GUEST-002
   * Test Suite     : Guest Registration Form Validation
   * Module         : Terms and Conditions Validation
   * Test Objective : Validasi submit registrasi tanpa menyetujui syarat & ketentuan memunculkan error
   * Priority       : High
   * Severity       : Medium
   */
  test('TC-REG-GUEST-002: validation error when terms & conditions is unchecked', async ({ app, browser }) => {
    await logoutSession(browser);
    await openLoginModal(browser);

    const signUpBtn = browser.locator('button:has-text("Sign Up")');
    await signUpBtn.click();

    // Isi form tanpa mencentang checkbox terms
    await browser.locator('input[placeholder="Full name"]').fill('QA Tamu Tester');
    await browser.locator('input[placeholder="Email address"]').fill('qa_terms_test@example.com');
    await browser.locator('input[placeholder="WhatsApp number"]').fill('81234567899');
    await browser.locator('input[placeholder="Password"]').fill('Password123!');
    await browser.locator('input[placeholder="Confirm password"]').fill('Password123!');

    const registerBtn = browser.locator('button:has-text("Register Now")').first();
    await registerBtn.click();

    await new Promise(r => setTimeout(r, 1200));
    await takeAuthScreenshot(app, 'TC-REG-GUEST-002-terms-validation');

    // Assert form menolak submit karena checkbox required belum dicentang
    const heading = browser.locator('h2:has-text("Register at D’Paragon")');
    await expect(heading).toBeVisible();

    const isMissing = await browser.evaluate(() => {
      const cb = document.querySelector('#terms-checkbox') as HTMLInputElement | null;
      return cb ? cb.validity.valueMissing : false;
    });
    expect(isMissing).toBe(true);
  });

  /**
   * Test Case ID   : TC-REG-GUEST-003
   * Test Suite     : Guest Registration Form Validation
   * Module         : Password Mismatch Validation
   * Test Objective : Validasi konfirmasi password yang berbeda menampilkan peringatan
   * Priority       : High
   * Severity       : Medium
   */
  test('TC-REG-GUEST-003: validation error when passwords do not match', async ({ app, browser }) => {
    await logoutSession(browser);
    await openLoginModal(browser);

    const signUpBtn = browser.locator('button:has-text("Sign Up")');
    await signUpBtn.click();

    await browser.locator('input[placeholder="Full name"]').fill('QA Tamu Tester');
    await browser.locator('input[placeholder="Email address"]').fill('qa_mismatch_test@example.com');
    await browser.locator('input[placeholder="WhatsApp number"]').fill('81234567899');
    await browser.locator('input[placeholder="Password"]').fill('Password123!');
    await browser.locator('input[placeholder="Confirm password"]').fill('DifferentPassword999!');

    // Centang terms
    await browser.locator('label:has(#terms-checkbox)').click();

    const registerBtn = browser.locator('button:has-text("Register Now")').first();
    await registerBtn.click();

    await new Promise(r => setTimeout(r, 1200));
    await takeAuthScreenshot(app, 'TC-REG-GUEST-003-password-mismatch');

    // Assert form menolak submit
    const heading = browser.locator('h2:has-text("Register at D’Paragon")');
    await expect(heading).toBeVisible();
  });

  /**
   * Test Case ID   : TC-REG-GUEST-004
   * Test Suite     : Guest Registration End-to-End
   * Module         : Valid Registration with Temp Mail & Default Password
   * Test Objective : Registrasi tamu valid menggunakan temp-mail.io, password 'Password123!', dan verifikasi alur
   * Priority       : Critical
   * Severity       : High
   */
  test('TC-REG-GUEST-004: valid guest registration with temp-mail.io and re-login', async ({ app, browser }) => {
    // 1. Generate temp mail
    const inbox = await createTempInbox();
    tempEmail = inbox.email;
    console.log('Guest Temp Mail:', tempEmail);

    await logoutSession(browser);
    await openLoginModal(browser);

    const signUpBtn = browser.locator('button:has-text("Sign Up")');
    await signUpBtn.click();

    const uniquePhone = '895' + Date.now().toString().slice(-8);

    await browser.locator('input[placeholder="Full name"]').fill('QA Tamu Istqb');
    await browser.locator('input[placeholder="Email address"]').fill(tempEmail);
    await browser.locator('input[placeholder="WhatsApp number"]').fill(uniquePhone);
    await browser.locator('input[placeholder="Password"]').fill('Password123!');
    await browser.locator('input[placeholder="Confirm password"]').fill('Password123!');

    // Centang Terms & Conditions
    await browser.locator('label:has(#terms-checkbox)').click();
    await takeAuthScreenshot(app, 'TC-REG-GUEST-004-form-filled');

    const registerBtn = browser.locator('button:has-text("Register Now")').first();
    await registerBtn.click();

    // Tunggu transisi ke tahap verifikasi (OTP / email)
    await new Promise(r => setTimeout(r, 6000));
    await takeAuthScreenshot(app, 'TC-REG-GUEST-004-verification-step');

    // 2. Alur Re-Login menggunakan akun tamu baru yang didaftarkan
    await logoutSession(browser);
    await openLoginModal(browser);

    const userInput = browser.locator('input[placeholder*="Email address or username"]').first();
    const passInput = browser.locator('input[placeholder*="Password"]').first();
    const submitBtn = browser.locator('button[type="submit"]:has-text("Log In")').first();

    await userInput.fill(tempEmail);
    await passInput.fill('Password123!');
    await takeAuthScreenshot(app, 'TC-REG-GUEST-004-relogin-form');
    await submitBtn.click();

    await new Promise(r => setTimeout(r, 5000));
    await takeAuthScreenshot(app, 'TC-REG-GUEST-004-relogin-result');

    await logoutSession(browser);
  });
});
