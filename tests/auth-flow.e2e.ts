import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

const AUTH_URL = 'https://auth.dparagon7.persona-it.com/login';

/**
 * Test Case ID   : AUTH-E2E-001
 * Test Suite     : Authentication & Account Type Selection
 * Module         : D'Paragon Central Authentication System
 * Test Objective : Validate account type selection (Management), login form rendering, and back button navigation
 * Preconditions  : App target accessible at auth portal
 * Priority       : Critical
 * Severity       : High
 */
test('AUTH-E2E-001: user can select Management account type and view login form', async ({ browser }) => {
  // 1. Arrange: Navigasi ke auth portal
  await browser.goto(AUTH_URL);

  // 2. Assert Precondition: Tampilan awal pemilihan tipe akun
  const heading = browser.locator('h4:has-text("Let\'s Get Started")');
  await expect(heading).toBeVisible();

  const managementCard = browser.locator('a.login-type-card:has-text("Management")');
  await expect(managementCard).toBeVisible();

  // 3. Act: Klik kartu Management
  await managementCard.click();

  // 4. Assert: Form panel login tampil dengan input email & password
  const emailInput = browser.locator('#username');
  const passwordInput = browser.locator('#userpassword');
  const submitBtn = browser.locator('button[type="submit"]:has-text("Masuk")');

  await expect(emailInput).toBeVisible();
  await expect(passwordInput).toBeVisible();
  await expect(submitBtn).toBeVisible();

  // 5. Act: Klik tombol "Kembali"
  const backBtn = browser.locator('button.back-to-type:has-text("Kembali")');
  await expect(backBtn).toBeVisible();
  await backBtn.click();

  // 6. Assert: Panel pemilihan akun tampil kembali
  await expect(managementCard).toBeVisible();
});

/**
 * Test Case ID   : AUTH-E2E-002
 * Test Suite     : Authentication Validation
 * Module         : D'Paragon Central Authentication System
 * Test Objective : Verify invalid login attempt (Negative Testing - Equivalence Partitioning)
 * Preconditions  : User is on login form
 * Priority       : High
 * Severity       : High
 */
test('AUTH-E2E-002: negative test - submitting invalid credentials fails authentication', async ({ browser }) => {
  await browser.goto(AUTH_URL);

  const managementCard = browser.locator('a.login-type-card:has-text("Management")');
  await managementCard.click();

  const emailInput = browser.locator('#username');
  const passwordInput = browser.locator('#userpassword');
  const submitBtn = browser.locator('button[type="submit"]:has-text("Masuk")');

  // Input invalid credentials
  await emailInput.fill('invalid_qa_user@example.com');
  await passwordInput.fill('WrongPassword123!');
  await submitBtn.click();

  // Assert: User should not reach dashboard and remains on auth/login page
  await expect(browser).toHaveURL(/.*login.*/);
});
