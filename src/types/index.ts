export type Category = 'food' | 'shopping' | 'transport' | 'home' | 'salary' | 'leisure' | 'other';

export type TransactionType = 'income' | 'expense';

export const SUPPORTED_CURRENCIES = ['FCFA', 'USD', 'EUR', 'Ar', 'CAD', 'CHF', 'GBP'] as const;
export type Currency = typeof SUPPORTED_CURRENCIES[number];

export interface Wallet {
  id: string;
  name: string;
  icon: string;
  currency: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: Category;
  subCategory?: string;
  tags?: string[];
  type: TransactionType;
  walletId: string;
  date: string;
}

export interface FinanceState {
  transactions: Transaction[];
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  currency: string;
  deadline?: string;
}

export interface Debt {
  id: string;
  title: string;
  amount: number;
  remaining: number;
  currency: string;
  dueDate?: string;
  isPaid: boolean;
}
