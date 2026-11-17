import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeUrl,
  getCookieDomains,
  resolveEnvironmentConfig,
  ENV_PROFILES
} from '../support/env-config.ts';

describe('Environment Configuration & Switcher Suite', () => {
  describe('normalizeUrl', () => {
    test('TC-CFG-NORM-001: should add https:// to domain string without protocol', () => {
      const result = normalizeUrl('fe.naufalans.me');
      assert.equal(result, 'https://fe.naufalans.me/');
    });

    test('TC-CFG-NORM-002: should preserve existing https protocol and trim extra trailing slashes', () => {
      const result = normalizeUrl('https://management.naufalans.me///');
      assert.equal(result, 'https://management.naufalans.me/');
    });

    test('TC-CFG-NORM-003: should preserve http for local development', () => {
      const result = normalizeUrl('http://localhost:3000/');
      assert.equal(result, 'http://localhost:3000/');
    });

    test('TC-CFG-NORM-004: should fallback to defaultUrl if input is empty or nullish', () => {
      assert.equal(normalizeUrl('', 'https://dp7.lab.daegi.dev/'), 'https://dp7.lab.daegi.dev/');
      assert.equal(normalizeUrl(undefined, 'https://fe.naufalans.me/'), 'https://fe.naufalans.me/');
    });
  });

  describe('getCookieDomains', () => {
    test('TC-CFG-COOK-001: should extract root and full cookie domains for daegi.dev', () => {
      const domains = getCookieDomains('https://dp7.lab.daegi.dev/login');
      assert.ok(domains.includes('dp7.lab.daegi.dev'));
      assert.ok(domains.includes('.dp7.lab.daegi.dev') || domains.includes('.daegi.dev'));
    });

    test('TC-CFG-COOK-002: should extract root and full cookie domains for naufalans.me', () => {
      const domains = getCookieDomains('https://auth.naufalans.me/login');
      assert.ok(domains.includes('auth.naufalans.me'));
      assert.ok(domains.includes('.naufalans.me'));
    });

    test('TC-CFG-COOK-003: should handle localhost without errors', () => {
      const domains = getCookieDomains('http://localhost:3000');
      assert.ok(domains.includes('localhost'));
    });
  });

  describe('resolveEnvironmentConfig', () => {
    test('TC-CFG-SW-001: should resolve dp7 preset by default when no env is specified', () => {
      const cfg = resolveEnvironmentConfig({});
      assert.equal(cfg.activeEnv, 'dp7');
      assert.equal(cfg.appUrl, 'https://dp7.lab.daegi.dev/');
      assert.equal(cfg.managementUrl, 'https://management.dp7.lab.daegi.dev/');
      assert.equal(cfg.authUrl, 'https://auth.dp7.lab.daegi.dev/login');
      assert.equal(cfg.guestUrl, 'https://guest.dp7.lab.daegi.dev/');
      assert.equal(cfg.mitraAuthUrl, 'https://auth.dp7.lab.daegi.dev/mitra/login');
      assert.equal(cfg.authLogoutUrl, 'https://auth.dp7.lab.daegi.dev/logout');
    });

    test('TC-CFG-SW-002: should resolve naufalans preset when APP_ENV=naufalans', () => {
      const cfg = resolveEnvironmentConfig({ APP_ENV: 'naufalans' });
      assert.equal(cfg.activeEnv, 'naufalans');
      assert.equal(cfg.appUrl, 'https://fe.naufalans.me/');
      assert.equal(cfg.managementUrl, 'https://management.naufalans.me/');
      assert.equal(cfg.authUrl, 'https://auth.naufalans.me/login');
      assert.equal(cfg.guestUrl, 'https://guest.naufalans.me/');
      assert.equal(cfg.mitraAuthUrl, 'https://auth.naufalans.me/mitra/login');
      assert.equal(cfg.authLogoutUrl, 'https://auth.naufalans.me/logout');
    });

    test('TC-CFG-SW-003: should auto-detect naufalans if APP_URL points to naufalans without APP_ENV', () => {
      const cfg = resolveEnvironmentConfig({ APP_URL: 'fe.naufalans.me' });
      assert.equal(cfg.activeEnv, 'naufalans');
      assert.equal(cfg.appUrl, 'https://fe.naufalans.me/');
      assert.equal(cfg.managementUrl, 'https://management.naufalans.me/');
    });

    test('TC-CFG-SW-004: should allow granular override of specific URLs', () => {
      const cfg = resolveEnvironmentConfig({
        APP_ENV: 'dp7',
        APP_URL: 'https://staging-custom.daegi.dev/',
        AUTH_URL: 'https://auth-custom.daegi.dev/login'
      });
      assert.equal(cfg.appUrl, 'https://staging-custom.daegi.dev/');
      assert.equal(cfg.authUrl, 'https://auth-custom.daegi.dev/login');
      assert.equal(cfg.managementUrl, 'https://management.dp7.lab.daegi.dev/');
    });
  });

  describe('Environment Credentials Resolution', () => {
    test('TC-CRED-DP7-001: should resolve dp7 default credentials', () => {
      const cfg = resolveEnvironmentConfig({ APP_ENV: 'dp7' });
      assert.equal(cfg.credentials.manajemen.username, 'superadmin@dparagon.com');
      assert.equal(cfg.credentials.manajemen.password, 'Merpati98');
      assert.equal(cfg.credentials.mitra.username, 'lodod41077@crybio.com');
      assert.equal(cfg.credentials.mitra.password, 'Qwerty12345');
      assert.equal(cfg.credentials.tamu.username, 'kzodiek@gmail.com');
      assert.equal(cfg.credentials.tamu.password, 'qwerty12345');
    });

    test('TC-CRED-NAUFALANS-001: should resolve naufalans credentials', () => {
      const cfg = resolveEnvironmentConfig({ APP_ENV: 'naufalans' });
      assert.equal(cfg.credentials.manajemen.username, 'superadmin@dparagon.com');
      assert.equal(cfg.credentials.manajemen.password, 'M4li0b0r0_1st1m3w4!');
      assert.equal(cfg.credentials.mitra.username, 'mitra@gmail.com');
      assert.equal(cfg.credentials.mitra.password, 'P@ssword123');
      assert.equal(cfg.credentials.tamu.username, 'kzodiek@gmail.com');
      assert.equal(cfg.credentials.tamu.password, 'qwerty12345');
    });

    test('TC-CRED-OVERRIDE-001: should allow env vars to override credentials', () => {
      const cfg = resolveEnvironmentConfig({
        APP_ENV: 'naufalans',
        E2E_USER_MANAJEMEN_PASSWORD: 'CustomPassword999!',
        E2E_USER_MITRA_USERNAME: 'custom_mitra@example.com'
      });
      assert.equal(cfg.credentials.manajemen.password, 'CustomPassword999!');
      assert.equal(cfg.credentials.mitra.username, 'custom_mitra@example.com');
      assert.equal(cfg.credentials.mitra.password, 'P@ssword123');
    });
  });
});
