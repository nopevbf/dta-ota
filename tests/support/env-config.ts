import fs from 'node:fs';
import path from 'node:path';

// Pemuatan .env yang toleran: memuat .env.${APP_ENV} jika ada, atau fallback ke .env
const requestedEnv = process.env.APP_ENV;
if (requestedEnv && fs.existsSync(`.env.${requestedEnv}`)) {
  process.loadEnvFile?.(`.env.${requestedEnv}`);
} else if (fs.existsSync('.env')) {
  process.loadEnvFile?.('.env');
}

export type SupportedEnv = 'dp7' | 'naufalans' | 'custom';

export interface RoleCredential {
  username: string;
  password: string;
}

export interface EnvCredentials {
  manajemen: RoleCredential;
  mitra: RoleCredential;
  tamu: RoleCredential;
}

export interface EnvProfile {
  name: SupportedEnv;
  appUrl: string;
  managementUrl: string;
  authUrl: string;
  guestUrl: string;
  mitraAuthUrl: string;
  authLogoutUrl: string;
  credentials: EnvCredentials;
}

export const ENV_PROFILES: Record<'dp7' | 'naufalans', EnvProfile> = {
  dp7: {
    name: 'dp7',
    appUrl: 'https://dp7.lab.daegi.dev/',
    managementUrl: 'https://management.dp7.lab.daegi.dev/',
    authUrl: 'https://auth.dp7.lab.daegi.dev/login',
    guestUrl: 'https://guest.dp7.lab.daegi.dev/',
    mitraAuthUrl: 'https://auth.dp7.lab.daegi.dev/mitra/login',
    authLogoutUrl: 'https://auth.dp7.lab.daegi.dev/logout',
    credentials: {
      manajemen: {
        username: 'superadmin@dparagon.com',
        password: 'Merpati98',
      },
      mitra: {
        username: 'lodod41077@crybio.com',
        password: 'Qwerty12345',
      },
      tamu: {
        username: 'kzodiek@gmail.com',
        password: 'qwerty12345',
      },
    },
  },
  naufalans: {
    name: 'naufalans',
    appUrl: 'https://fe.naufalans.me/',
    managementUrl: 'https://management.naufalans.me/',
    authUrl: 'https://auth.naufalans.me/login',
    guestUrl: 'https://guest.naufalans.me/',
    mitraAuthUrl: 'https://auth.naufalans.me/mitra/login',
    authLogoutUrl: 'https://auth.naufalans.me/logout',
    credentials: {
      manajemen: {
        username: 'superadmin@dparagon.com',
        password: 'M4li0b0r0_1st1m3w4!',
      },
      mitra: {
        username: 'mitra@gmail.com',
        password: 'P@ssword123',
      },
      tamu: {
        username: 'kzodiek@gmail.com',
        password: 'qwerty12345',
      },
    },
  },
};

/**
 * Menormalkan string URL agar selalu memiliki skema (https://) dan trailing slash yang rapi.
 */
export function normalizeUrl(rawUrl?: string, defaultUrl: string = ''): string {
  const target = (rawUrl || defaultUrl || '').trim();
  if (!target) return '';

  let withScheme = target;
  if (!/^https?:\/\//i.test(withScheme)) {
    withScheme = `https://${withScheme}`;
  }

  try {
    const parsed = new URL(withScheme);
    // Bersihkan trailing slash ganda pada pathname
    const cleanPath = parsed.pathname.replace(/\/+$/, '');
    parsed.pathname = cleanPath === '' ? '/' : cleanPath;
    return parsed.toString();
  } catch {
    return withScheme.replace(/\/+$/, '') + '/';
  }
}

/**
 * Mendapatkan daftar domain untuk penghapusan cookie sesi aktif
 */
export function getCookieDomains(urlStr: string): string[] {
  try {
    const url = new URL(urlStr.startsWith('http') ? urlStr : `https://${urlStr}`);
    const hostname = url.hostname;
    const parts = hostname.split('.');

    const domains = new Set<string>();
    domains.add(hostname);

    if (parts.length >= 2) {
      // e.g. "fe.naufalans.me" -> ".naufalans.me" & "naufalans.me"
      const rootDomain = parts.slice(-2).join('.');
      domains.add(rootDomain);
      domains.add(`.${rootDomain}`);

      // e.g. "dp7.lab.daegi.dev" -> ".daegi.dev" and ".lab.daegi.dev"
      if (parts.length >= 3) {
        const subRoot = parts.slice(-3).join('.');
        domains.add(subRoot);
        domains.add(`.${subRoot}`);
      }
    }

    return Array.from(domains);
  } catch {
    return [''];
  }
}

/**
 * Menyelesaikan konfigurasi lingkungan berdasarkan profil dan override variabel lingkungan
 */
export function resolveEnvironmentConfig(env: Record<string, string | undefined> = process.env) {
  let activeEnv: SupportedEnv = 'dp7';

  if (env.APP_ENV === 'naufalans' || env.APP_ENV === 'dp7') {
    activeEnv = env.APP_ENV;
  } else if (env.APP_URL?.includes('naufalans') || env.AUTH_URL?.includes('naufalans')) {
    activeEnv = 'naufalans';
  } else if (env.APP_ENV) {
    activeEnv = 'custom';
  }

  const preset = activeEnv === 'naufalans' ? ENV_PROFILES.naufalans : ENV_PROFILES.dp7;

  const appUrl = normalizeUrl(env.APP_URL, preset.appUrl);
  const managementUrl = normalizeUrl(env.MANAGEMENT_URL, preset.managementUrl);
  const authUrl = normalizeUrl(env.AUTH_URL, preset.authUrl);
  const guestUrl = normalizeUrl(env.GUEST_URL, preset.guestUrl);

  // Derive mitraAuthUrl and authLogoutUrl if not explicitly overridden
  const mitraAuthUrl = normalizeUrl(
    env.MITRA_AUTH_URL,
    authUrl.replace(/\/login\/?$/, '/mitra/login')
  );

  const authLogoutUrl = normalizeUrl(
    env.AUTH_LOGOUT_URL,
    authUrl.replace(/\/login\/?$/, '/logout')
  );

  const appQuery = env.APP_QUERY || '?ava_min_room_ready=1&ava_pax=2';
  const targetUrl = `${appUrl.replace(/\/+$/, '')}/lang_en${appQuery.startsWith('?') ? appQuery : `?${appQuery}`}`;

  const cookieDomains = Array.from(
    new Set([
      ...getCookieDomains(appUrl),
      ...getCookieDomains(authUrl),
      ...getCookieDomains(managementUrl),
      ...getCookieDomains(guestUrl),
    ])
  );

  const credentials: EnvCredentials = {
    manajemen: {
      username: env.E2E_USER_MANAJEMEN_USERNAME || preset.credentials.manajemen.username,
      password: env.E2E_USER_MANAJEMEN_PASSWORD || preset.credentials.manajemen.password,
    },
    mitra: {
      username: env.E2E_USER_MITRA_USERNAME || preset.credentials.mitra.username,
      password: env.E2E_USER_MITRA_PASSWORD || preset.credentials.mitra.password,
    },
    tamu: {
      username: env.E2E_USER_TAMU_USERNAME || preset.credentials.tamu.username,
      password: env.E2E_USER_TAMU_PASSWORD || preset.credentials.tamu.password,
    },
  };

  return {
    activeEnv,
    appUrl,
    managementUrl,
    authUrl,
    guestUrl,
    mitraAuthUrl,
    authLogoutUrl,
    appQuery,
    targetUrl,
    cookieDomains,
    credentials,
  };
}

// Export singleton konfigurasi aktif saat runtime
const resolved = resolveEnvironmentConfig(process.env);

export const ACTIVE_ENV = resolved.activeEnv;
export const APP_URL = resolved.appUrl;
export const MANAGEMENT_URL = resolved.managementUrl;
export const AUTH_URL = resolved.authUrl;
export const GUEST_URL = resolved.guestUrl;
export const MITRA_AUTH_URL = resolved.mitraAuthUrl;
export const AUTH_LOGOUT_URL = resolved.authLogoutUrl;
export const APP_QUERY = resolved.appQuery;
export const TARGET_URL = resolved.targetUrl;
export const COOKIE_DOMAINS = resolved.cookieDomains;
export const CREDENTIALS = resolved.credentials;
