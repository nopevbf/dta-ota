export interface TempMailInbox {
  email: string;
  token?: string;
}

export interface TempMailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  body_text?: string;
  body_html?: string;
  created_at: string;
}

/**
 * Membuat inbox email sekali pakai baru via temp-mail.io
 */
export async function createTempInbox(): Promise<TempMailInbox> {
  const resp = await fetch('https://api.internal.temp-mail.io/api/v3/email/new', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ min_name_length: 10, max_name_length: 10 })
  });

  if (!resp.ok) {
    throw new Error(`Failed to create temp inbox: ${resp.status} ${resp.statusText}`);
  }

  const data = await resp.json();
  return {
    email: data.email,
    token: data.token
  };
}

/**
 * Menunggu pesan email verifikasi masuk ke alamat temp-mail tertentu
 */
export async function waitForEmailMessages(
  email: string,
  timeoutMs: number = 60000,
  pollIntervalMs: number = 3000
): Promise<TempMailMessage[]> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    try {
      const resp = await fetch(`https://api.internal.temp-mail.io/api/v3/email/${encodeURIComponent(email)}/messages`);
      if (resp.ok) {
        const messages: TempMailMessage[] = await resp.json();
        if (messages && messages.length > 0) {
          return messages;
        }
      }
    } catch (e) {
      // Abaikan transient network error saat polling
    }
    await new Promise(r => setTimeout(r, pollIntervalMs));
  }

  return [];
}

/**
 * Mengekstrak link verifikasi atau kode OTP dari isi email
 */
export function extractVerificationLinkOrOtp(message: TempMailMessage): { link?: string; otp?: string } {
  const content = `${message.subject || ''}\n${message.body_text || ''}\n${message.body_html || ''}`;

  // Cari link verifikasi/aktivasi
  const urlMatch = content.match(/https?:\/\/[^\s"'<>]+(?:verify|verification|activate|activation|confirm)[^\s"'<>]*/i);
  const generalUrlMatch = content.match(/https?:\/\/[^\s"'<>]+/i);

  // Cari OTP 4 - 6 digit
  const otpMatch = content.match(/\b\d{4,6}\b/);

  return {
    link: urlMatch ? urlMatch[0] : (generalUrlMatch ? generalUrlMatch[0] : undefined),
    otp: otpMatch ? otpMatch[0] : undefined
  };
}
