import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  color: text('color').notNull(),
  type: text('type').notNull(), // 'income' | 'expense'
  updatedAt: text('updatedAt').notNull(),
  isDeleted: integer('isDeleted', { mode: 'boolean' }).default(false).notNull(),
});

export const wallets = sqliteTable('wallets', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  currency: text('currency').notNull(),
  initialBalance: real('initialBalance').default(0).notNull(),
  updatedAt: text('updatedAt').notNull(),
  isDeleted: integer('isDeleted', { mode: 'boolean' }).default(false).notNull(),
});

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  description: text('description').notNull(),
  amount: real('amount').notNull(),
  categoryId: text('categoryId').references(() => categories.id),
  category: text('category').notNull(), // Legacy field for compatibility
  subCategory: text('subCategory'),
  tags: text('tags', { mode: 'json' }),
  type: text('type').notNull(),
  walletId: text('walletId').references(() => wallets.id).notNull(),
  fromWalletId: text('fromWalletId'),
  date: text('date').notNull(),
  isReconciled: integer('isReconciled', { mode: 'boolean' }).default(false).notNull(),
  updatedAt: text('updatedAt').notNull(),
  isDeleted: integer('isDeleted', { mode: 'boolean' }).default(false).notNull(),
});

export const recurringTemplates = sqliteTable('recurring_templates', {
  id: text('id').primaryKey(),
  description: text('description').notNull(),
  amount: real('amount').notNull(),
  categoryId: text('categoryId').references(() => categories.id),
  walletId: text('walletId').references(() => wallets.id).notNull(),
  frequency: text('frequency').notNull(), // 'daily' | 'weekly' | 'monthly' | 'yearly'
  startDate: text('startDate').notNull(),
  nextRunDate: text('nextRunDate').notNull(),
  lastRunDate: text('lastRunDate'),
  isActive: integer('isActive', { mode: 'boolean' }).default(true).notNull(),
  updatedAt: text('updatedAt').notNull(),
  isDeleted: integer('isDeleted', { mode: 'boolean' }).default(false).notNull(),
});

export const budgets = sqliteTable('budgets', {
  id: text('id').primaryKey(),
  categoryId: text('categoryId').references(() => categories.id).notNull(),
  amount: real('amount').notNull(),
  period: text('period').notNull(), // 'monthly'
  updatedAt: text('updatedAt').notNull(),
  isDeleted: integer('isDeleted', { mode: 'boolean' }).default(false).notNull(),
});

export const savings = sqliteTable('savings', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  target: real('target').notNull(),
  current: real('current').default(0).notNull(),
  currency: text('currency').notNull(),
  deadline: text('deadline'),
  updatedAt: text('updatedAt').notNull(),
  isDeleted: integer('isDeleted', { mode: 'boolean' }).default(false).notNull(),
});

export const debts = sqliteTable('debts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  amount: real('amount').notNull(),
  remaining: real('remaining').notNull(),
  currency: text('currency').notNull(),
  dueDate: text('dueDate'),
  isPaid: integer('isPaid', { mode: 'boolean' }).default(false).notNull(),
  updatedAt: text('updatedAt').notNull(),
  isDeleted: integer('isDeleted', { mode: 'boolean' }).default(false).notNull(),
});
