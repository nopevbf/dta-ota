import { sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { CURRENT_ENV } from '../config/environments.js';
import { fetchLoginForm, submitLogin } from '../helpers/auth.js';

// Custom Metrics
const loginDuration = new Trend('auth_login_duration');
const successfulLogins = new Rate('auth_login_success');

// Test Configuration (Spike Test)
// Lonjakan mendadak trafik login dalam waktu singkat
export const options = {
  stages: [
    { duration: '10s', target: 2 },   // Baseline santai
    { duration: '20s', target: 20 },  // Lonjakan mendadak (spike)
    { duration: '30s', target: 20 },  // Bertahan di puncak lonjakan
    { duration: '15s', target: 2 },   // Penurunan kembali
    { duration: '15s', target: 0 },   // Selesai
  ],
  thresholds: {
    'http_req_failed': ['rate<0.10'],
    'checks': ['rate>0.90'],
  },
};

const users = JSON.parse(open('../data/users.json'));
const roles = ['manajemen', 'mitra', 'tamu'];

export default function () {
  const role = roles[Math.floor(Math.random() * roles.length)];
  const user = users[role];

  const formResult = fetchLoginForm(CURRENT_ENV.authUrl);
  if (!formResult.token) {
    successfulLogins.add(0);
    return;
  }

  const loginRes = submitLogin(CURRENT_ENV.authUrl, user.email, user.password, formResult.token);
  loginDuration.add(loginRes.timings.duration);

  const isSuccess = loginRes.status === 302 || loginRes.status === 200;
  successfulLogins.add(isSuccess ? 1 : 0);

  sleep(1);
}
