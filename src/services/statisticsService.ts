import type { Transaction } from '../types';

export const statisticsService = {
  calculateTotals: (transactions: Transaction[]) => {
    let income = 0;
    let expenses = 0;
    transactions.forEach((t) => {
      if (t.isDeleted) return;
      if (t.type === 'income') income += t.amount;
      else if (t.type === 'expense') expenses += t.amount;
    });
    return {
      totalIncome: income,
      totalExpenses: expenses,
      totalBalance: income - expenses,
    };
  },
  
  calculateSavingsRate: (income: number, expenses: number) => {
    return income > 0 ? ((income - expenses) / income) * 100 : 0;
  },

  getCategoryData: (transactions: Transaction[]) => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categories: Record<string, number> = {};
    expenses.forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }
};
