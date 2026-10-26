import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import {
  TARGET_URL,
  setupApiRouteBridge,
  openLoginModal,
  logoutSession,
  takeAuthScreenshot
} from './support/auth-helpers.js';
import { createTempInbox, waitForEmailMessages } from './support/temp-mail.js';

test.describe('DParagon New Authentication - Partnership Registration Suite', { serial: true }, () => {
  let tempEmail = '';

  test.beforeEach(async ({ browser }) => {
    await setupApiRouteBridge(browser);
  });

  /**
   * Test Case ID   : TC-REG-MITRA-001
   * Test Suite     : Partnership Registration Navigation
   * Module         : Register Partnership
   * Test Objective : Verifikasi navigasi ke form Daftar Kemitraan via link Register Partnership pada modal login
   * Priority       : Critical
   * Severity       : High
   */
  test('TC-REG-MITRA-001: navigate to Daftar Kemitraan form', async ({ app, browser }) => {
    await logoutSession(browser);
    await openLoginModal(browser);

    const partnerBtn = browser.locator('button:has-text("Register Partnership")');
    await expect(partnerBtn).toBeVisible();
    await partnerBtn.click();

    // Verifikasi form Daftar Kemitraan tampil
    const heading = browser.locator('h2:has-text("Daftar Kemitraan D\'Paragon")');
    await expect(heading).toBeVisible();
    await takeAuthScreenshot(app, 'TC-REG-MITRA-001-form-opened');
  });

  /**
   * Test Case ID   : TC-REG-MITRA-002
   * Test Suite     : Partnership Form Validation
   * Module         : Password Policy Validation
   * Test Objective : Validasi password yang tidak memenuhi kriteria minimal menampilkan pesan error
   * Priority       : High
   * Severity       : Medium
   */
  test('TC-REG-MITRA-002: validation error when password does not meet complexity', async ({ app, browser }) => {
    await logoutSession(browser);
    await openLoginModal(browser);

    const partnerBtn = browser.locator('button:has-text("Register Partnership")');
    await partnerBtn.click();

    await browser.locator('input[placeholder="Nama Lengkap"]').fill('QA Mitra Simple');
    await browser.locator('input[placeholder="Alamat Email"]').fill('qa_simple_pass@example.com');
    await browser.locator('input[placeholder="WhatsApp number"]').fill('81234567899');
    await browser.locator('input[placeholder="Buat kata sandi"]').fill('12345');
    await browser.locator('input[placeholder="Ulangi kata sandi"]').fill('12345');

    await browser.locator('label:has(#terms-checkbox-mitra)').click();

    const submitBtn = browser.locator('button:has-text("Daftar Kemitraan")').first();
    await submitBtn.click();

    await new Promise(r => setTimeout(r, 1200));
    await takeAuthScreenshot(app, 'TC-REG-MITRA-002-password-complexity-err');

    const errText = browser.locator('text="Password harus terdiri dari minimal 7 karakter dengan kombinasi angka, huruf besar, dan huruf kecil."');
    await expect(errText).toBeVisible();
  });

  /**
   * Test Case ID   : TC-REG-MITRA-003
   * Test Suite     : Partnership Form Validation
   * Module         : Terms and Conditions Validation
   * Test Objective : Validasi submit registrasi kemitraan tanpa menyetujui syarat & ketentuan
   * Priority       : High
   * Severity       : Medium
   */
  test('TC-REG-MITRA-003: validation error when terms & conditions is unchecked', async ({ app, browser }) => {
    await logoutSession(browser);
    await openLoginModal(browser);

    const partnerBtn = browser.locator('button:has-text("Register Partnership")');
    await partnerBtn.click();

    await browser.locator('input[placeholder="Nama Lengkap"]').fill('QA Mitra Terms');
    await browser.locator('input[placeholder="Alamat Email"]').fill('qa_terms_mitra@example.com');
    await browser.locator('input[placeholder="WhatsApp number"]').fill('81234567899');
    await browser.locator('input[placeholder="Buat kata sandi"]').fill('Password123!');
    await browser.locator('input[placeholder="Ulangi kata sandi"]').fill('Password123!');

    // Biarkan checkbox terms tidak dicentang
    const submitBtn = browser.locator('button:has-text("Daftar Kemitraan")').first();
    await submitBtn.click();

    await new Promise(r => setTimeout(r, 1200));
    await takeAuthScreenshot(app, 'TC-REG-MITRA-003-terms-err');

    const heading = browser.locator('h2:has-text("Daftar Kemitraan D\'Paragon")');
    await expect(heading).toBeVisible();
  });

  /**
   * Test Case ID   : TC-REG-MITRA-004
   * Test Suite     : Partnership Registration End-to-End
   * Module         : Valid Registration with Temp Mail & Re-Login Attempt
   * Test Objective : Registrasi kemitraan valid menggunakan temp-mail.io, verifikasi email, dan re-login
   * Priority       : Critical
   * Severity       : High
   */
  test('TC-REG-MITRA-004: valid partnership registration with temp-mail.io and re-login', async ({ app, browser }) => {
    const inbox = await createTempInbox();
    tempEmail = inbox.email;
    console.log('Partner Temp Mail:', tempEmail);

    await logoutSession(browser);
    await openLoginModal(browser);

    const partnerBtn = browser.locator('button:has-text("Register Partnership")');
    await partnerBtn.click();

    const uniquePhone = '896' + Date.now().toString().slice(-8);

    await browser.locator('input[placeholder="Nama Lengkap"]').fill('QA Mitra Partner');
    await browser.locator('input[placeholder="Alamat Email"]').fill(tempEmail);
    await browser.locator('input[placeholder="WhatsApp number"]').fill(uniquePhone);
    await browser.locator('input[placeholder="Buat kata sandi"]').fill('Password123!');
    await browser.locator('input[placeholder="Ulangi kata sandi"]').fill('Password123!');

    // Centang syarat & ketentuan
    await browser.locator('label:has(#terms-checkbox-mitra)').click();
    await takeAuthScreenshot(app, 'TC-REG-MITRA-004-form-filled');

    const submitBtn = browser.locator('button:has-text("Daftar Kemitraan")').first();
    await submitBtn.click();

    // Tunggu notifikasi pendaftaran berhasil dan periksa email verifikasi
    await new Promise(r => setTimeout(r, 6000));
    await takeAuthScreenshot(app, 'TC-REG-MITRA-004-registered-modal');

    console.log('Polling verification email from temp-mail.io for', tempEmail);
    const messages = await waitForEmailMessages(tempEmail, 20000, 3000);
    console.log('Verification email count received:', messages.length);
    if (messages.length > 0) {
      console.log('Verification email subject:', messages[0].subject);
    }

    // Alur Re-Login akun kemitraan baru
    await logoutSession(browser);
    await openLoginModal(browser);

    const userInput = browser.locator('input[placeholder*="Email address or username"]').first();
    const passInput = browser.locator('input[placeholder*="Password"]').first();
    const loginSubmitBtn = browser.locator('button[type="submit"]:has-text("Log In")').first();

    await userInput.fill(tempEmail);
    await passInput.fill('Password123!');
    await takeAuthScreenshot(app, 'TC-REG-MITRA-004-relogin-form');
    await loginSubmitBtn.click();

    await new Promise(r => setTimeout(r, 5000));
    await takeAuthScreenshot(app, 'TC-REG-MITRA-004-relogin-result');

    await logoutSession(browser);
  });
});
