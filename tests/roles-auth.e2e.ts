import { test } from '@e2e-dev/web';
import { expect, credentials } from 'e2e';

const AUTH_BASE_URL = 'https://auth.dparagon7.persona-it.com/login';
const MITRA_AUTH_URL = 'https://auth.dparagon7.persona-it.com/mitra/login';

/**
 * Test Case ID   : OTA-AVAIL-001
 * Test Suite     : Target Page Navigation
 * Module         : D'Paragon OTA Booking Portal
 * Test Objective : Validasi akses halaman OTA dengan parameter ketersediaan kamar
 * Preconditions  : Server OTA live aktif
 * Priority       : High
 * Severity       : Medium
 */
test('OTA-AVAIL-001: loads OTA target page with availability filters', async ({ app, browser }) => {
  // Buka URL target dengan query parameter ketersediaan kamar
  await app.open('/?ava_min_room_ready=1&ava_pax=2');

  await expect(browser.locator('body')).toBeVisible();
  await expect(browser).toHaveURL(/.*ava_min_room_ready=1.*ava_pax=2.*/);
});

/**
 * Test Case ID   : AUTH-MGMT-001
 * Test Suite     : Role Authentication
 * Module         : D'Paragon Central Auth - Manajemen
 * Test Objective : Memvalidasi login role Manajemen menggunakan kredensial valid
 * Preconditions  : Akun manajemen terdaftar dan aktif
 * Priority       : Critical
 * Severity       : High
 */
test('AUTH-MGMT-001: authenticate role Manajemen with valid credentials', async ({ browser }) => {
  const mgmt = credentials.user('manajemen');

  await browser.goto(AUTH_BASE_URL);

  // Verifikasi landing dan pilih kartu Management
  const mgmtCard = browser.locator('a.login-type-card:has-text("Management")');
  await expect(mgmtCard).toBeVisible();
  await mgmtCard.click();

  // Input kredensial manajemen
  const emailInput = browser.locator('#username');
  const passwordInput = browser.locator('#userpassword');
  const submitBtn = browser.locator('button[type="submit"]:has-text("Masuk")');

  await expect(emailInput).toBeVisible();
  await emailInput.fill(mgmt.username);
  await passwordInput.fill(mgmt.password);
  await submitBtn.click();

  // Validasi: Pengguna berhasil login (berpindah dari halaman login auth)
  await expect(browser).not.toHaveURL(AUTH_BASE_URL);
});

/**
 * Test Case ID   : AUTH-MITRA-001
 * Test Suite     : Role Authentication
 * Module         : D'Paragon Mitra Portal Login
 * Test Objective : Memvalidasi login role Mitra menggunakan kredensial valid
 * Preconditions  : Akun mitra terdaftar dan aktif
 * Priority       : Critical
 * Severity       : High
 */
test('AUTH-MITRA-001: authenticate role Mitra with valid credentials', async ({ browser }) => {
  const mitra = credentials.user('mitra');

  await browser.goto(MITRA_AUTH_URL);

  // Verifikasi form login mitra
  const emailInput = browser.locator('#email');
  const passwordInput = browser.locator('#userpassword');
  const submitBtn = browser.locator('button[type="submit"]:has-text("Masuk")');

  await expect(emailInput).toBeVisible();
  await emailInput.fill(mitra.username);
  await passwordInput.fill(mitra.password);
  await submitBtn.click();

  // Validasi: Pengguna berhasil login (berpindah dari URL /mitra/login)
  await expect(browser).not.toHaveURL(MITRA_AUTH_URL);
});

/**
 * Test Case ID   : AUTH-TAMU-001
 * Test Suite     : Role Authentication
 * Module         : D'Paragon Central Auth - Tamu / Pencari Kamar
 * Test Objective : Memvalidasi login role Tamu menggunakan kredensial valid
 * Preconditions  : Akun tamu terdaftar dan aktif
 * Priority       : Critical
 * Severity       : High
 */
test('AUTH-TAMU-001: authenticate role Tamu with valid credentials', async ({ browser }) => {
  const tamu = credentials.user('tamu');

  await browser.goto(AUTH_BASE_URL);

  // Pilih kartu Tamu / Pencari Kamar
  const tamuCard = browser.locator('a.login-type-card:has-text("Pencari Kamar")');
  await expect(tamuCard).toBeVisible();
  await tamuCard.click();

  // Input kredensial tamu
  const emailInput = browser.locator('#username');
  const passwordInput = browser.locator('#userpassword');
  const submitBtn = browser.locator('button[type="submit"]:has-text("Masuk")');

  await expect(emailInput).toBeVisible();
  await emailInput.fill(tamu.username);
  await passwordInput.fill(tamu.password);
  await submitBtn.click();

  // Validasi: Pengguna berhasil login (berpindah dari halaman login auth)
  await expect(browser).not.toHaveURL(AUTH_BASE_URL);
});
