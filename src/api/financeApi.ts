import { apiClient } from './apiClient';
import type { 
  Wallet, Transaction, SavingsGoal, Debt, 
  Category, RecurringTemplate, Budget,
  CreateWalletInput, CreateTransactionInput, CreateSavingsGoalInput, CreateDebtInput,
  CreateCategoryInput, CreateRecurringTemplateInput, CreateBudgetInput
} from '../types';

export const financeApi = {
  // Wallets
  getWallets: () => apiClient.get<Wallet[]>('/wallets'),
  createWallet: (wallet: CreateWalletInput & { id?: string }) => 
    apiClient.post<Wallet>('/wallets', { 
      ...wallet, 
      id: wallet.id || crypto.randomUUID(),
      initialBalance: wallet.initialBalance || 0,
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    }),
  updateWallet: (wallet: Wallet) =>
    apiClient.put<Wallet>(`/wallets/${wallet.id}`, {
      ...wallet,
      updatedAt: new Date().toISOString(),
    }),

  // Categories
  getCategories: () => apiClient.get<Category[]>('/categories'),
  createCategory: (category: CreateCategoryInput & { id?: string }) =>
    apiClient.post<Category>('/categories', {
      ...category,
      id: category.id || crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    }),

  // Transactions
  getTransactions: () => apiClient.get<Transaction[]>('/transactions'),
  createTransaction: (transaction: CreateTransactionInput & { id?: string }) => 
    apiClient.post<Transaction>('/transactions', {
      ...transaction,
      id: transaction.id || crypto.randomUUID(),
      date: transaction.date || new Date().toISOString(),
      isReconciled: !!transaction.isReconciled,
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    }),
  updateTransaction: (transaction: Transaction) =>
    apiClient.put<Transaction>(`/transactions/${transaction.id}`, {
      ...transaction,
      updatedAt: new Date().toISOString(),
    }),
  deleteTransaction: (id: string) => apiClient.delete(`/transactions/${id}`),
  clearTransactions: () => apiClient.delete('/transactions'),

  // Recurring
  getRecurring: () => apiClient.get<RecurringTemplate[]>('/recurring'),
  createRecurring: (template: CreateRecurringTemplateInput & { id?: string }) =>
    apiClient.post<RecurringTemplate>('/recurring', {
      ...template,
      id: template.id || crypto.randomUUID(),
      nextRunDate: new Date().toISOString(), // Initial next run
      isActive: true,
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    }),
  updateRecurring: (template: RecurringTemplate) => 
    apiClient.put<RecurringTemplate>(`/recurring/${template.id}`, {
      ...template,
      updatedAt: new Date().toISOString(),
    }),

  // Budgets
  getBudgets: () => apiClient.get<Budget[]>('/budgets'),
  createBudget: (budget: CreateBudgetInput & { id?: string }) =>
    apiClient.post<Budget>('/budgets', {
      ...budget,
      id: budget.id || crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    }),

  // Savings
  getSavings: () => apiClient.get<SavingsGoal[]>('/savings'),
  createSavings: (goal: CreateSavingsGoalInput & { id?: string }) => 
    apiClient.post<SavingsGoal>('/savings', { 
      ...goal, 
      id: goal.id || crypto.randomUUID(),
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
  createDebt: (debt: CreateDebtInput & { id?: string }) => 
    apiClient.post<Debt>('/debts', { 
      ...debt, 
      id: debt.id || crypto.randomUUID(),
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
