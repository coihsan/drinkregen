import { z } from 'zod';

export const rewardTypes = ['VOUCHER_10', 'POINTS_5', 'VOUCHER_50', 'POINTS_10', 'TRY_AGAIN'] as const;
export const redemptionOptions = [
  { id: 'CARTON', name: '1 Karton REGEN', cost: 100, image: '/spin/karton-regen.webp' },
  { id: 'THREE_BOTTLES', name: '3 Botol REGEN', cost: 25, image: '/spin/3botol-regen.webp' },
] as const;
export type RedemptionType = typeof redemptionOptions[number]['id'];
export const statusSchema = z.object({
  registered: z.boolean(),
  user: z.object({ id: z.string().min(1), name: z.string().min(1) }).nullable(),
  remainingSpins: z.number().int().min(0).max(5),
  totalValidSpins: z.number().int().nonnegative(),
  points: z.number().int().nonnegative(),
  dailyResetAt: z.string().datetime({ offset: true }),
  csrfToken: z.string().min(1),
});
export const spinResultSchema = statusSchema.extend({
  id: z.string().min(1), rewardType: z.enum(rewardTypes),
  voucher: z.object({ code: z.string().min(1), expiresAt: z.string().datetime({ offset: true }) }).optional(),
});
export const challengeSchema = z.object({ challengeId: z.string().min(1) });
export const redemptionSchema = statusSchema.extend({
  redemption: z.object({ id: z.string().min(1), rewardId: z.enum(['CARTON', 'THREE_BOTTLES']), status: z.literal('confirmed') }),
});
export type RewardType = typeof rewardTypes[number];
export type SpinStatus = z.infer<typeof statusSchema>;
export type SpinResult = z.infer<typeof spinResultSchema>;
export type RedemptionResult = z.infer<typeof redemptionSchema>;
export interface RegistrationInput { name: string; whatsapp: string }
export interface SpinService {
  getStatus(): Promise<SpinStatus>;
  spin(requestId: string): Promise<SpinResult>;
  register(input: RegistrationInput): Promise<z.infer<typeof challengeSchema>>;
  verify(challengeId: string, code: string, requestId: string): Promise<SpinStatus>;
  redeem(rewardId: RedemptionType, requestId: string): Promise<RedemptionResult>;
}
