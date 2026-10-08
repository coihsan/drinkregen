// Test fixture only. Never imported by the production service. No real rewards or OTP delivery.
import { rewardTypes, redemptionOptions, type SpinService, type SpinStatus, type SpinResult, type RedemptionResult } from './spin.types';
const dayKey = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
const nextReset = () => { const date = new Date(Date.now() + 7 * 3600000); date.setUTCHours(24, 0, 0, 0); return new Date(date.getTime() - 7 * 3600000).toISOString(); };
export function createMockSpinBackend(random: () => number = Math.random) {
  const accounts = new Map<string, { status: SpinStatus; day: string }>();
  return function session(seed: Partial<SpinStatus> = {}): SpinService {
    let status: SpinStatus = { registered: false, user: null, remainingSpins: 1, totalValidSpins: 0, points: 0, dailyResetAt: nextReset(), csrfToken: 'test-only', ...seed };
    let phone: string | null = null;
    let pending: { name: string; phone: string } | null = null;
    const spins = new Map<string, SpinResult>();
    const redemptions = new Map<string, RedemptionResult>();
    const verifications = new Map<string, SpinStatus>();
    function refresh() {
      const account = phone ? accounts.get(phone) : undefined;
      if (account) {
        if (account.day !== dayKey()) { account.status = { ...account.status, remainingSpins: 5, dailyResetAt: nextReset() }; account.day = dayKey(); }
        status = account.status;
      }
    }
    function save() { if (phone) accounts.set(phone, { status, day: dayKey() }); }
    return {
      async getStatus() { refresh(); return structuredClone(status); },
      async register(input) {
        const normalized = input.whatsapp.replace(/[\s-]/g, '').replace(/^\+/, '').replace(/^0/, '62');
        if (!input.name.trim() || !/^628\d{7,11}$/.test(normalized)) throw new Error('Data tidak valid.');
        pending = { name: input.name.trim(), phone: normalized }; return { challengeId: 'test-challenge' };
      },
      async verify(challengeId, code, id) {
        const cached = verifications.get(id); if (cached) return structuredClone(cached);
        if (!pending || challengeId !== 'test-challenge' || code !== '123456') throw new Error('Kode tidak valid.');
        const guestPoints = status.registered ? 0 : status.points;
        const existing = accounts.get(pending.phone);
        phone = pending.phone;
        if (existing) { refresh(); status = { ...status, points: status.points + guestPoints }; }
        else status = { ...status, registered: true, user: { id: `account-${accounts.size + 1}`, name: pending.name }, remainingSpins: 5 };
        pending = null; save(); verifications.set(id, structuredClone(status)); return structuredClone(status);
      },
      async spin(id) {
        refresh(); const cached = spins.get(id); if (cached) return structuredClone(cached);
        if (status.remainingSpins < 1) throw new Error('Kuota habis.');
        const pool = !status.registered && status.totalValidSpins === 0 ? rewardTypes.filter(type => type !== 'TRY_AGAIN') : rewardTypes;
        const rewardType = pool[Math.floor(random() * pool.length)];
        const points = rewardType === 'POINTS_5' ? 5 : rewardType === 'POINTS_10' ? 10 : 0;
        status = { ...status, remainingSpins: status.remainingSpins - 1, totalValidSpins: status.totalValidSpins + 1, points: status.points + points }; save();
        const result: SpinResult = { ...status, id, rewardType, ...(rewardType.startsWith('VOUCHER') ? { voucher: { code: 'TEST-ONLY', expiresAt: nextReset() } } : {}) };
        spins.set(id, structuredClone(result)); return structuredClone(result);
      },
      async redeem(rewardId, id) {
        refresh(); const cached = redemptions.get(id);
        if (cached) { if (cached.redemption.rewardId !== rewardId) throw new Error('Idempotency conflict.'); return structuredClone(cached); }
        const option = redemptionOptions.find(item => item.id === rewardId);
        if (!status.registered || !option || status.points < option.cost) throw new Error('Saldo tidak cukup atau akun belum terverifikasi.');
        status = { ...status, points: status.points - option.cost }; save();
        const result: RedemptionResult = { ...status, redemption: { id, rewardId, status: 'confirmed' } };
        redemptions.set(id, structuredClone(result)); return structuredClone(result);
      },
    };
  };
}
export const createMockSpinService = (seed: Partial<SpinStatus> = {}, random: () => number = Math.random) => createMockSpinBackend(random)(seed);
