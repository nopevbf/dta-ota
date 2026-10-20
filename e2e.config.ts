import type { E2EConfig } from 'e2e';
import { web } from '@e2e-dev/web';
import { google, createGoogleGenerativeAI } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';

process.loadEnvFile?.('.env');

// Map GEMINI_API_KEY to GOOGLE_GENERATIVE_AI_API_KEY if needed by @ai-sdk/google
const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
if (geminiKey) {
  process.env.GOOGLE_GENERATIVE_AI_API_KEY = geminiKey;
  process.env.GEMINI_API_KEY = geminiKey;
}

function resolveModel() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (apiKey) {
    const googleClient = createGoogleGenerativeAI({ apiKey });
    return googleClient('gemini-3.8-flash');
  }
  if (process.env.OPENAI_API_KEY) {
    return openai('gpt-4o-mini');
  }
  return google('gemini-3.8-flash');
}

export default {
  workers: 1,
  timeout: 1200000,
  agents: {
    default: {
      model: resolveModel(),
      system: 'You are an ISTQB-aligned QA testing agent. Verify every outcome on screen.',
    },
  },
  credentials: {
    manajemen: {
      username: process.env.E2E_USER_MANAJEMEN_USERNAME ?? 'superadmin@dparagon.com',
      password: process.env.E2E_USER_MANAJEMEN_PASSWORD ?? 'Merpati98',
    },
    mitra: {
      username: process.env.E2E_USER_MITRA_USERNAME ?? 'lodod41077@crybio.com',
      password: process.env.E2E_USER_MITRA_PASSWORD ?? 'Qwerty12345',
    },
    tamu: {
      username: process.env.E2E_USER_TAMU_USERNAME ?? 'kzodiek@gmail.com',
      password: process.env.E2E_USER_TAMU_PASSWORD ?? 'qwerty12345',
    },
  },
  targets: [
    {
      engine: web(),
      app: {
        url: process.env.APP_URL ?? 'https://dparagon7.persona-it.com/',
      },
    },
  ],
} satisfies E2EConfig;
