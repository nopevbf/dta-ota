import http from 'k6/http';
import { parseHTML } from 'k6/html';
import { check } from 'k6';

/**
 * Mengambil halaman login dan mengekstrak CSRF token
 * @param {string} authUrl - URL auth portal
 * @returns {{ token: string, status: number, response: object }}
 */
export function fetchLoginForm(authUrl) {
  const res = http.get(`${authUrl}/login`, {
    headers: {
      'User-Agent': 'k6-load-tester/1.0',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    tags: { name: 'GET_LoginForm' },
  });

  const passed = check(res, {
    'GET /login status is 200': (r) => r.status === 200,
  });

  if (!passed) {
    return { token: null, status: res.status, response: res };
  }

  const doc = parseHTML(res.body);
  const token = doc.find('input[name="_token"]').attr('value') || '';

  return { token, status: res.status, response: res };
}

/**
 * Mengirim kredensial login (POST /login)
 * @param {string} authUrl - URL auth portal
 * @param {string} email - Email user
 * @param {string} password - Password user
 * @param {string} token - CSRF token
 * @returns {object} Response object k6
 */
export function submitLogin(authUrl, email, password, token) {
  const payload = {
    _token: token,
    email: email,
    password: password,
  };

  const res = http.post(`${authUrl}/login`, payload, {
    headers: {
      'User-Agent': 'k6-load-tester/1.0',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirects: 0, // Jangan auto-redirect agar kita bisa memverifikasi 302 Found
    tags: { name: 'POST_Login' },
  });

  check(res, {
    'POST /login redirects (302) or success (200)': (r) => r.status === 302 || r.status === 200,
  });

  return res;
}
