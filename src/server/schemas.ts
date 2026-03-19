import { z } from 'zod';

export const WalletSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  icon: z.string().optional(),
  currency: z.string().length(3),
});

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  description: z.string().max(200).optional().nullable(),
  amount: z.number().finite(),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1),
  subCategory: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  walletId: z.string().uuid(),
  date: z.string().datetime(),
});

export const SavingsSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  target: z.number().positive(),
  current: z.number().nonnegative(),
  currency: z.string().length(3),
  deadline: z.string().datetime().optional().nullable(),
});

export const DebtSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  amount: z.number().positive(),
  remaining: z.number().nonnegative(),
  currency: z.string().length(3),
  dueDate: z.string().datetime().optional().nullable(),
  isPaid: z.boolean().optional(),
});
