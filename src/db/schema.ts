import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';

export const wallets = sqliteTable('wallets', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  currency: text('currency').notNull(),
});

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  description: text('description'),
  amount: real('amount').notNull(),
  category: text('category').notNull(),
  subCategory: text('subCategory'),
  tags: text('tags'), // Stored as JSON string
  type: text('type', { enum: ['income', 'expense'] }).notNull(),
  walletId: text('walletId').notNull().references(() => wallets.id),
  date: text('date').notNull(),
});

export const savings = sqliteTable('savings', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  target: real('target').notNull(),
  current: real('current').notNull(),
  currency: text('currency').notNull(),
  deadline: text('deadline'),
});

export const debts = sqliteTable('debts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  amount: real('amount').notNull(),
  remaining: real('remaining').notNull(),
  currency: text('currency').notNull(),
  dueDate: text('dueDate'),
  isPaid: integer('isPaid', { mode: 'boolean' }).notNull().default(false),
});
