import { z } from 'zod';
import { statusSchema, spinResultSchema, challengeSchema, redemptionSchema, type SpinService } from './spin.types';

export class SpinApiError extends Error {
  constructor(message: string, public readonly definitive: boolean) { super(message); }
}
// Proposed contract: see components/spin/README.md. No client-side reward fallback.
export function createApiSpinService(base = 'https://api.drinkregen.com/api/v1/spin'): SpinService {
  let csrfToken = '';
  async function request<T>(path: string, schema: z.ZodType<T>, body?: unknown, requestId?: string): Promise<T> {
    if (body !== undefined && !csrfToken) throw new SpinApiError('Muat ulang status sebelum melanjutkan.', true);
    const response = await fetch(`${base}${path}`, {
      method: body === undefined ? 'GET' : 'POST', credentials: 'include', cache: 'no-store',
      signal: AbortSignal.timeout(15000),
      headers: { ...(body === undefined ? {} : { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken }), ...(requestId ? { 'Idempotency-Key': requestId } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!response.ok) {
      const message = response.status === 401 ? 'Sesi berakhir. Muat ulang lalu verifikasi nomor WhatsApp.' : response.status === 429 ? 'Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.' : 'Permintaan belum berhasil. Periksa saldo atau kuota dan coba lagi.';
      throw new SpinApiError(message, response.status >= 400 && response.status < 500 && response.status !== 408 && response.status !== 409);
    }
    const data = schema.parse(await response.json());
    if (data && typeof data === 'object' && 'registered' in data) {
      const status = statusSchema.parse(data);
      if (status.registered !== Boolean(status.user) || (!status.registered && status.remainingSpins > 1)) {
        throw new Error('Status akun tidak valid.');
      }
    }
    if (data && typeof data === 'object' && 'csrfToken' in data && typeof data.csrfToken === 'string') csrfToken = data.csrfToken;
    return data;
  }
  return {
    getStatus: () => request('/status', statusSchema),
    spin: id => request('', spinResultSchema.refine(result =>
      (!result.rewardType.startsWith('VOUCHER') || Boolean(result.voucher)) &&
      (result.registered || result.totalValidSpins !== 1 || result.rewardType !== 'TRY_AGAIN')
    ), {}, id),
    register: input => request('/register', challengeSchema, input),
    verify: (challengeId, code, id) => request('/verify', statusSchema.refine(status => status.registered), { challengeId, code }, id),
    redeem: (rewardId, id) => request('/redeem', redemptionSchema.refine(result => result.registered && result.redemption.rewardId === rewardId), { rewardId }, id),
  };
}
export const spinService = createApiSpinService();

