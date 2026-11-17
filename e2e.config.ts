import type { E2EConfig } from 'e2e';
import { web } from '@e2e-dev/web';
import { google, createGoogleGenerativeAI } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import fs from 'node:fs';
import { APP_URL, CREDENTIALS } from './tests/support/env-config.ts';

if (process.env.APP_ENV && fs.existsSync(`.env.${process.env.APP_ENV}`)) {
  process.loadEnvFile?.(`.env.${process.env.APP_ENV}`);
} else if (fs.existsSync('.env')) {
  process.loadEnvFile?.('.env');
}

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
  timeout: 3600000,
  agents: {
    default: {
      model: resolveModel(),
      system: 'You are an ISTQB-aligned QA testing agent. Verify every outcome on screen.',
    },
  },
  credentials: {
    manajemen: CREDENTIALS.manajemen,
    mitra: CREDENTIALS.mitra,
    tamu: CREDENTIALS.tamu,
  },
  targets: [
    {
      engine: web(),
      app: {
        url: APP_URL,
      },
    },
  ],
} satisfies E2EConfig;
