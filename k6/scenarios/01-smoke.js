import { sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { CURRENT_ENV } from '../config/environments.js';
import { fetchLoginForm, submitLogin } from '../helpers/auth.js';

// Custom Metrics
const loginDuration = new Trend('auth_login_duration');
const successfulLogins = new Rate('auth_login_success');

// Test Configuration (Smoke Test)
export const options = {
  vus: 1,
  iterations: 3,
  thresholds: {
    'http_req_failed': ['rate<0.05'], // Max 5% gagal
    'checks': ['rate>0.95'],          // Min 95% check pass
    'auth_login_success': ['rate>0.90'], // Min 90% login berhasil
  },
};

const users = JSON.parse(open('../data/users.json'));
const roles = ['manajemen', 'mitra', 'tamu'];

export default function (data) {
  // Ambil role secara bergantian sesuai nomor iterasi
  const role = roles[__ITER % roles.length];
  const user = users[role];

  console.log(`[Smoke] Testing role: ${role} (${user.email})`);

  // Step 1: GET Form & CSRF Token
  const formResult = fetchLoginForm(CURRENT_ENV.authUrl);
  if (!formResult.token) {
    console.error(`[Smoke] Failed to retrieve CSRF token for ${role}`);
    successfulLogins.add(0);
    return;
  }

  // Step 2: POST Login Credentials
  const loginRes = submitLogin(CURRENT_ENV.authUrl, user.email, user.password, formResult.token);
  loginDuration.add(loginRes.timings.duration);

  const isSuccess = loginRes.status === 302 || loginRes.status === 200;
  successfulLogins.add(isSuccess ? 1 : 0);

  console.log(`[Smoke] Response status for ${role}: ${loginRes.status} (Duration: ${loginRes.timings.duration.toFixed(2)}ms)`);

  sleep(1);
}
