import { sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { CURRENT_ENV } from '../config/environments.js';
import { fetchLoginForm, submitLogin } from '../helpers/auth.js';

// Custom Metrics
const loginDuration = new Trend('auth_login_duration');
const successfulLogins = new Rate('auth_login_success');

// Test Configuration (Load Test)
// Bertahap naik ke 5 VUs, bertahan, lalu turun
export const options = {
  stages: [
    { duration: '30s', target: 5 }, // Ramp up ke 5 pengguna bersamaan
    { duration: '1m', target: 5 },  // Pertahankan 5 pengguna bersamaan
    { duration: '30s', target: 0 }, // Ramp down kembali ke 0
  ],
  thresholds: {
    'http_req_failed': ['rate<0.05'],     // Maksimal 5% gagal
    'checks': ['rate>0.95'],              // 95% assertion lolos
    'auth_login_success': ['rate>0.90'],  // 90% login berhasil
  },
};

const users = JSON.parse(open('../data/users.json'));
const roles = ['manajemen', 'mitra', 'tamu'];

export default function () {
  const role = roles[Math.floor(Math.random() * roles.length)];
  const user = users[role];

  // 1. Ambil Form & Token CSRF
  const formResult = fetchLoginForm(CURRENT_ENV.authUrl);
  if (!formResult.token) {
    successfulLogins.add(0);
    return;
  }

  // 2. Submit Kredensial Login
  const loginRes = submitLogin(CURRENT_ENV.authUrl, user.email, user.password, formResult.token);
  loginDuration.add(loginRes.timings.duration);

  const isSuccess = loginRes.status === 302 || loginRes.status === 200;
  successfulLogins.add(isSuccess ? 1 : 0);

  // Think time antar user
  sleep(Math.random() * 2 + 1);
}
