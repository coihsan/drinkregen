// Test fixture only. Never imported by the production service. No real rewards or OTP delivery.
import { rewardTypes, redemptionOptions, type SpinService, type SpinStatus, type SpinResult, type RedemptionResult } from './spin.types';
const nextReset = () => { const date = new Date(Date.now() + 7 * 3600000); date.setUTCHours(24, 0, 0, 0); return new Date(date.getTime() - 7 * 3600000).toISOString(); };
export function createMockSpinBackend(random: () => number = Math.random) {
  const accounts = new Map<string, { status: SpinStatus }>();
  return function session(seed: Partial<SpinStatus> = {}): SpinService {
    let status: SpinStatus = { registered: false, user: null, remainingSpins: 1, totalValidSpins: 0, points: 0, dailyResetAt: nextReset(), csrfToken: 'test-only', ...seed };
    let phone: string | null = null;
    const spins = new Map<string, SpinResult>();
    const redemptions = new Map<string, RedemptionResult>();
    const registrations = new Map<string, SpinStatus>();
    function refresh() {
      const account = phone ? accounts.get(phone) : undefined;
      if (account) {
        if (account.status.remainingSpins === 0 && Date.now() >= Date.parse(account.status.dailyResetAt)) { account.status = { ...account.status, remainingSpins: 5 }; }
        status = account.status;
      }
    }
    function save() { if (phone) accounts.set(phone, { status }); }
    return {
      async getHistory() { throw new Error('Riwayat hadiah hanya tersedia melalui API.'); },
      async getStatus() { refresh(); return structuredClone(status); },
      async register(input,id) {
        const name=input.name.trim();if(!name||name.length>191)throw new Error('Nama tidak valid.');
        const normalized=input.whatsapp.replace(/[\s-]/g,'').replace(/^\+/,'').replace(/^0/,'62');
        if(!/^628\d{7,11}$/.test(normalized))throw new Error('Data tidak valid.');
        const cached=registrations.get(id);if(cached)return structuredClone(cached);
        if(phone){if(phone!==normalized)throw new Error('Different participant');refresh();return structuredClone(status);}
        const existing=accounts.get(normalized);
        phone=normalized;
        if(existing){refresh();}
        else status={...status,registered:true,user:{id:'account-'+(accounts.size+1),name,whatsapp:normalized},remainingSpins:5};
        save();registrations.set(id,structuredClone(status));return structuredClone(status);
      },
      async spin(id) {
        refresh(); const cached = spins.get(id); if (cached) return structuredClone(cached);
        if (status.remainingSpins < 1) throw new Error('Kuota habis.');
        const pool = !status.registered && status.totalValidSpins === 0 ? rewardTypes.filter(type => type !== 'TRY_AGAIN') : rewardTypes;
        const rewardType = pool[Math.floor(random() * pool.length)];
        const points = rewardType === 'POINTS_5' ? 5 : rewardType === 'POINTS_10' ? 10 : 0;
        status = { ...status, remainingSpins: status.remainingSpins - 1, totalValidSpins: status.totalValidSpins + 1, points: status.points + points, ...(status.registered && status.remainingSpins === 1 ? { dailyResetAt: new Date(Date.now() + 86400000).toISOString() } : {}) }; save();
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
