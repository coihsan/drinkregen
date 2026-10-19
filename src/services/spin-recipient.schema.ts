import {z} from 'zod';
export const recipientSchema=z.object({recipientName:z.string().trim().min(2).max(191),phone:z.string().trim().regex(/^\+?[0-9]{8,15}$/),province:z.string().trim().min(2).max(191),city:z.string().trim().min(2).max(191),district:z.string().trim().min(2).max(191),address:z.string().trim().min(10).max(2000),postalCode:z.string().regex(/^[0-9]{5}$/)}).strict();
