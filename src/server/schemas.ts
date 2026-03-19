import { z } from 'zod';

const BaseEntitySchema = z.object({
  id: z.string().uuid(),
  updatedAt: z.string().datetime(),
  isDeleted: z.boolean().default(false),
});

export const WalletSchema = BaseEntitySchema.extend({
  name: z.string().min(1).max(50),
  icon: z.string().min(1),
  currency: z.string().min(1).max(10), // Increased to support FCFA, etc.
  initialBalance: z.number().default(0),
});

export const TransactionSchema = BaseEntitySchema.extend({
  description: z.string().max(200).optional().nullable(),
  amount: z.number().finite(),
  type: z.enum(['income', 'expense', 'transfer']),
  category: z.string().min(1),
  subCategory: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  walletId: z.string().uuid(),
  fromWalletId: z.string().uuid().optional().nullable(),
  date: z.string().datetime(),
});

export const SavingsSchema = BaseEntitySchema.extend({
  name: z.string().min(1).max(100),
  target: z.number().positive(),
  current: z.number().nonnegative(),
  currency: z.string().min(1).max(10),
  deadline: z.string().datetime().optional().nullable(),
});

export const DebtSchema = BaseEntitySchema.extend({
  title: z.string().min(1).max(100),
  amount: z.number().positive(),
  remaining: z.number().nonnegative(),
  currency: z.string().min(1).max(10),
  dueDate: z.string().datetime().optional().nullable(),
  isPaid: z.boolean().default(false),
});
