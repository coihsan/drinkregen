import { defaultSpinRewards, type RewardType, type SpinResult, type SpinService, type SpinStatus } from './spin.types';

// In-memory sandbox: never contacts the API or persists real rewards.
export function createDevelopmentSpinService(getReward: () => RewardType | 'random', catalog?: Pick<SpinStatus, 'spinRewards' | 'redemptionOptions'>): SpinService {
  let status: SpinStatus = {
    available: true, registered: true, user: { id: 'development', name: 'Developer' },
    remainingSpins: 5, totalValidSpins: 0, points: 0,
    dailyResetAt: new Date(Date.now() + 86400000).toISOString(),
    csrfToken: 'development-only', redemptionOptions: catalog?.redemptionOptions ?? [], spinRewards: catalog?.spinRewards ?? defaultSpinRewards,
  };
  const results = new Map<string, SpinResult>();
  return {
    async getStatus() { return structuredClone(status); },
    async spin(id) {
      const cached = results.get(id);
      if (cached) return structuredClone(cached);
      const selected = getReward();
      const rewards = status.spinRewards!;
      if (!rewards.length) throw new Error('Belum ada hadiah spin aktif.');
      const reward = selected === 'random' ? rewards[Math.floor(Math.random() * rewards.length)] : rewards.find(reward => reward.code === selected);
      if (!reward) throw new Error('Hadiah tidak ditemukan dalam katalog.');
      const rewardType = reward.code, awardedPoints = reward.points;
      status = { ...status, totalValidSpins: status.totalValidSpins + 1, points: status.points + awardedPoints };
      const result: SpinResult = {
        ...status, id, rewardType, rewardName: reward.name, awardedPoints,
        ...(rewardType.startsWith('VOUCHER') ? { voucher: { code: 'DEMO-TIDAK-BERLAKU', expiresAt: status.dailyResetAt } } : {}),
      };
      results.set(id, structuredClone(result));
      return structuredClone(result);
    },
    async register() { return structuredClone(status); },
    async redeem() { throw new Error('Penukaran hadiah tidak tersedia dalam mode development.'); },
  };
}
