import { z } from 'zod';
import { statusSchema, spinResultSchema, redemptionSchema, type SpinService, type SpinStatus } from './spin.types';

export class SpinApiError extends Error {
  constructor(message: string, public readonly definitive: boolean) { super(message); }
}
// Database-backed API contract: see components/spin/README.md. No client-side reward fallback.
export function createApiSpinService(base = 'https://api.drinkregen.com/api/v1/spin'): SpinService {
  let csrfToken = '';
  let statusRequest: Promise<SpinStatus> | null = null;
  async function request<T>(path: string, schema: z.ZodType<T>, body?: unknown, requestId?: string): Promise<T> {
    if (body !== undefined && !csrfToken) throw new SpinApiError('Muat ulang status sebelum melanjutkan.', true);
    const response = await fetch(`${base}${path}`, {
      method: body === undefined ? 'GET' : 'POST', credentials: 'include', cache: 'no-store',
      signal: AbortSignal.timeout(15000),
      headers: { ...(body === undefined ? {} : { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken }), ...(requestId ? { 'Idempotency-Key': requestId } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!response.ok) {
      if(path==='/redeem'&&[400,422].includes(response.status)){const detail=await response.json().catch(()=>null);const message=response.status===400?'Data penerima tidak valid. Periksa seluruh kolom dan kode POS.':typeof detail?.message==='string'&&detail.message.length<=300?detail.message:'Hadiah tidak tersedia atau poin belum cukup.';throw new SpinApiError(message,true);}
      const message = response.status === 401 ? 'Sesi berakhir. Muat ulang untuk memeriksa sesi Anda.' : response.status === 429 ? 'Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.' : 'Permintaan belum berhasil. Periksa saldo atau kuota dan coba lagi.';
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
    getStatus: () => statusRequest ??= request('/status', statusSchema).finally(() => { statusRequest = null; }),
    spin: id => request('', spinResultSchema.refine(result =>
      (!result.rewardType.startsWith('VOUCHER') || Boolean(result.voucher)) &&
      (result.registered || result.totalValidSpins !== 1 || !result.rewardType.startsWith('TRY_AGAIN'))
    ), {}, id),
    register: (input, id) => request('/register', statusSchema.refine(status => status.registered), input, id),
    redeem: (rewardId, id,recipient) => request('/redeem', redemptionSchema.refine(result => result.registered && result.redemption.rewardId === rewardId), { rewardId,...recipient }, id),
  };
}
export const spinService = createApiSpinService(import.meta.env?.PUBLIC_SPIN_API_URL || 'https://api.drinkregen.com/api/v1/spin');

