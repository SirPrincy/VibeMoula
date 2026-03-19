import { z } from 'zod';

export const BaseEntitySchema = z.object({
  id: z.string(),
  updatedAt: z.string(),
  isDeleted: z.boolean(),
});

export const CategorySchema = BaseEntitySchema.extend({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  type: z.enum(['income', 'expense']),
});

export const WalletSchema = BaseEntitySchema.extend({
  name: z.string(),
  icon: z.string(),
  currency: z.string(),
  initialBalance: z.number().default(0),
});

export const TransactionSchema = BaseEntitySchema.extend({
  description: z.string(),
  amount: z.number(),
  categoryId: z.string().optional(),
  category: z.string(),
  subCategory: z.string().optional(),
  tags: z.array(z.string()).optional(),
  type: z.enum(['income', 'expense', 'transfer']),
  walletId: z.string(),
  fromWalletId: z.string().optional(),
  date: z.string(),
  isReconciled: z.boolean().default(false),
});

export const RecurringTemplateSchema = BaseEntitySchema.extend({
  description: z.string(),
  amount: z.number(),
  categoryId: z.string().optional(),
  walletId: z.string(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  startDate: z.string(),
  nextRunDate: z.string(),
  lastRunDate: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const BudgetSchema = BaseEntitySchema.extend({
  categoryId: z.string(),
  amount: z.number(),
  period: z.literal('monthly'),
});

export const SavingsSchema = BaseEntitySchema.extend({
  name: z.string(),
  target: z.number(),
  current: z.number(),
  currency: z.string(),
  deadline: z.string().optional(),
});

export const DebtSchema = BaseEntitySchema.extend({
  title: z.string(),
  amount: z.number(),
  remaining: z.number(),
  currency: z.string(),
  dueDate: z.string().optional(),
  isPaid: z.boolean().default(false),
});
