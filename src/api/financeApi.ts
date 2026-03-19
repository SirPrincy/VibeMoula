import { apiClient } from './apiClient';
import type { Wallet, Transaction, SavingsGoal, Debt } from '../types';

export const financeApi = {
  // Wallets
  getWallets: () => apiClient.get<Wallet[]>('/wallets'),
  createWallet: (wallet: Omit<Wallet, 'id'>) => apiClient.post<Wallet>('/wallets', { ...wallet, id: crypto.randomUUID() }),

  // Transactions
  getTransactions: () => apiClient.get<Transaction[]>('/transactions'),
  createTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => 
    apiClient.post<Transaction>('/transactions', {
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    }),
  deleteTransaction: (id: string) => apiClient.delete(`/transactions/${id}`),
  clearTransactions: () => apiClient.delete('/transactions'),

  // Savings
  getSavings: () => apiClient.get<SavingsGoal[]>('/savings'),
  createSavings: (goal: Omit<SavingsGoal, 'id'>) => apiClient.post<SavingsGoal>('/savings', { ...goal, id: crypto.randomUUID() }),
  updateSavings: (goal: SavingsGoal) => apiClient.put<SavingsGoal>(`/savings/${goal.id}`, goal),
  deleteSavings: (id: string) => apiClient.delete(`/savings/${id}`),

  // Debts
  getDebts: async () => {
    const data = await apiClient.get<Debt[]>('/debts');
    return data.map(d => ({ ...d, isPaid: !!d.isPaid }));
  },
  createDebt: (debt: Omit<Debt, 'id'>) => apiClient.post<Debt>('/debts', { ...debt, id: crypto.randomUUID() }),
  updateDebt: (debt: Debt) => apiClient.put<Debt>(`/debts/${debt.id}`, debt),
  deleteDebt: (id: string) => apiClient.delete(`/debts/${id}`),

  // Reset
  resetAll: () => apiClient.delete('/reset'),
};
