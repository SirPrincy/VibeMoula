import { apiClient } from './apiClient';
import type { 
  Wallet, Transaction, SavingsGoal, Debt, 
  CreateWalletInput, CreateTransactionInput, CreateSavingsGoalInput, CreateDebtInput 
} from '../types';

export const financeApi = {
  // Wallets
  getWallets: () => apiClient.get<Wallet[]>('/wallets'),
  createWallet: (wallet: CreateWalletInput) => 
    apiClient.post<Wallet>('/wallets', { 
      ...wallet, 
      id: crypto.randomUUID(),
      initialBalance: wallet.initialBalance || 0,
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    }),

  // Transactions
  getTransactions: () => apiClient.get<Transaction[]>('/transactions'),
  createTransaction: (transaction: CreateTransactionInput) => 
    apiClient.post<Transaction>('/transactions', {
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    }),
  deleteTransaction: (id: string) => apiClient.delete(`/transactions/${id}`),
  clearTransactions: () => apiClient.delete('/transactions'),

  // Savings
  getSavings: () => apiClient.get<SavingsGoal[]>('/savings'),
  createSavings: (goal: CreateSavingsGoalInput) => 
    apiClient.post<SavingsGoal>('/savings', { 
      ...goal, 
      id: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    }),
  updateSavings: (goal: SavingsGoal) => apiClient.put<SavingsGoal>(`/savings/${goal.id}`, {
    ...goal,
    updatedAt: new Date().toISOString(),
  }),
  deleteSavings: (id: string) => apiClient.delete(`/savings/${id}`),

  // Debts
  getDebts: async () => {
    const data = await apiClient.get<Debt[]>('/debts');
    return data.map(d => ({ ...d, isPaid: !!d.isPaid }));
  },
  createDebt: (debt: CreateDebtInput) => 
    apiClient.post<Debt>('/debts', { 
      ...debt, 
      id: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    }),
  updateDebt: (debt: Debt) => apiClient.put<Debt>(`/debts/${debt.id}`, {
    ...debt,
    updatedAt: new Date().toISOString(),
  }),
  deleteDebt: (id: string) => apiClient.delete(`/debts/${id}`),

  // Reset
  resetAll: () => apiClient.delete('/reset'),
};
