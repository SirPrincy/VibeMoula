export type Category = 'food' | 'shopping' | 'transport' | 'home' | 'salary' | 'leisure' | 'other';

export type TransactionType = 'income' | 'expense' | 'transfer';

export const SUPPORTED_CURRENCIES = ['FCFA', 'USD', 'EUR', 'Ar', 'CAD', 'CHF', 'GBP'] as const;
export type Currency = typeof SUPPORTED_CURRENCIES[number];

export interface BaseEntity {
  id: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface Wallet extends BaseEntity {
  name: string;
  icon: string;
  currency: string;
  initialBalance: number;
}

export type CreateWalletInput = Omit<Wallet, keyof BaseEntity | 'initialBalance'> & { initialBalance?: number };

export interface Transaction extends BaseEntity {
  description: string;
  amount: number;
  category: Category;
  subCategory?: string;
  tags?: string[];
  type: TransactionType;
  walletId: string;
  fromWalletId?: string; // For transfers
  date: string;
}

export type CreateTransactionInput = Omit<Transaction, keyof BaseEntity | 'date'>;

export interface FinanceState {
  transactions: Transaction[];
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

export interface SavingsGoal extends BaseEntity {
  name: string;
  target: number;
  current: number;
  currency: string;
  deadline?: string;
}

export type CreateSavingsGoalInput = Omit<SavingsGoal, keyof BaseEntity>;

export interface Debt extends BaseEntity {
  title: string;
  amount: number;
  remaining: number;
  currency: string;
  dueDate?: string;
  isPaid: boolean;
}

export type CreateDebtInput = Omit<Debt, keyof BaseEntity>;
