import { z } from 'zod';
import { statusSchema } from './spin.types';
export const previewKey = 'regen-prize-preview';
export const previewSchema = z.object({
  type: z.literal('regen-prize-preview'),
  spinRewards: statusSchema.shape.spinRewards.unwrap(),
  redemptionOptions: statusSchema.shape.redemptionOptions.unwrap(),
});
export function readPreview(): string | null {
  try { return localStorage.getItem(previewKey); } catch { return null; }
}
export function subscribePreview(listener: () => void) {
  window.addEventListener('storage', listener);
  return () => window.removeEventListener('storage', listener);
}
