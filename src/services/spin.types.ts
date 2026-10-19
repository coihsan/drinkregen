import { z } from 'zod';

export const rewardTypes = ['VOUCHER_10', 'POINTS_5', 'VOUCHER_50', 'POINTS_10', 'TRY_AGAIN'] as const;
export const rewardCodeSchema = z.string().regex(/^(?:VOUCHER_(?:10|50)|POINTS_(?:5|10)|TRY_AGAIN)(?:_[A-Z0-9]+)?$/);
export const defaultSpinRewards = rewardTypes.map(code => ({code, name: ({VOUCHER_10:'Shopee 10%',POINTS_5:'Poin 5',VOUCHER_50:'Shopee 50%',POINTS_10:'Poin 10',TRY_AGAIN:'Coba lagi'})[code], points:code==='POINTS_5'?5:code==='POINTS_10'?10:0}));
export const redemptionOptions = [
  { id: 'CARTON', name: '1 Karton REGEN', cost: 100, image: '/spin/karton-regen.webp' },
  { id: 'THREE_BOTTLES', name: '3 Botol REGEN', cost: 25, image: '/spin/3botol-regen.webp' },
] as const;
export type RedemptionType = string;
export const statusSchema = z.object({
  available: z.boolean().optional(),
  registered: z.boolean(),
  user: z.object({ id: z.string().min(1), name: z.string().min(1) }).nullable(),
  remainingSpins: z.number().int().min(0).max(5),
  totalValidSpins: z.number().int().nonnegative(),
  points: z.number().int().nonnegative(),
  dailyResetAt: z.string().datetime({ offset: true }),
  csrfToken: z.string().min(1),
  redemptionOptions:z.array(z.object({id:z.string().min(1),name:z.string().min(1),type:z.string().optional(),imageUrl:z.string().optional(),cost:z.number().int().positive(),stockRemaining:z.number().int().nonnegative().nullable()})).optional(),
  spinRewards:z.array(z.object({code:rewardCodeSchema,name:z.string().min(1),imageUrl:z.string().optional(),points:z.number().int().nonnegative()})).optional(),
});
export const spinResultSchema = statusSchema.extend({
  id: z.string().min(1), rewardType: rewardCodeSchema,
  rewardName:z.string().min(1).optional(),awardedPoints:z.number().int().nonnegative().optional(),
  voucher: z.object({ code: z.string().min(1), expiresAt: z.string().datetime({ offset: true }) }).optional(),
});
export const redemptionSchema = statusSchema.extend({
  redemption: z.object({ id: z.string().min(1), rewardId: z.string().min(1), status: z.literal('confirmed') }),
});
export type RewardType = string;
export type SpinStatus = z.infer<typeof statusSchema>;
export type SpinResult = z.infer<typeof spinResultSchema>;
export type RedemptionResult = z.infer<typeof redemptionSchema>;
export interface RegistrationInput { name: string; whatsapp: string }
export interface RecipientInput {recipientName:string;phone:string;province:string;city:string;district:string;address:string;postalCode:string}
export interface SpinService {
  getStatus(): Promise<SpinStatus>;
  spin(requestId: string): Promise<SpinResult>;
  register(input: RegistrationInput, requestId: string): Promise<SpinStatus>;
  redeem(rewardId: RedemptionType, requestId: string, recipient:RecipientInput): Promise<RedemptionResult>;
}
