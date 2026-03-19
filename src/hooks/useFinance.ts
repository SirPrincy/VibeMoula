import { useState, useEffect, useMemo } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { 
  useWallets, useTransactions, useSavings, useDebts, 
  useCategories, useBudgets 
} from './queries/useFinanceQueries';
import { statisticsService } from '../services/statisticsService';
import { persistenceService } from '../services/persistenceService';
import { financeApi } from '../api/financeApi';
import { importExportService } from '../services/importExportService';

export const useFinance = () => {
  const queryClient = useQueryClient();
  
  // New granular hooks
  const { data: wallets = [], addWallet } = useWallets();
  const { data: transactions = [], addTransaction, deleteTransaction, updateTransaction } = useTransactions();
  const { data: savings = [], addSavings, updateSavings, deleteSavings } = useSavings();
  const { data: debts = [], addDebt, updateDebt, deleteDebt } = useDebts();
  const { data: categories = [], addCategory } = useCategories();
  const { data: budgets = [], addBudget } = useBudgets();

  // Local state for settings (moved partially to persistenceService)
  const [dashboardCurrency, setDashboardCurrency] = useState(persistenceService.getCurrency);

  useEffect(() => {
    persistenceService.setCurrency(dashboardCurrency);
  }, [dashboardCurrency]);

  // Derived stats via Service
  const stats = useMemo(() => statisticsService.calculateTotals(transactions), [transactions]);

  // Global actions
  const resetDataMutation = useMutation({
    mutationFn: financeApi.resetAll,
    onSuccess: () => {
      queryClient.invalidateQueries();
      window.location.reload();
    },
  });

  return {
    transactions,
    wallets,
    savings,
    debts,
    categories,
    budgets,
    dashboardCurrency,
    setDashboardCurrency,
    totalIncome: stats.totalIncome,
    totalExpenses: stats.totalExpenses,
    totalBalance: stats.totalBalance,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addWallet,
    addCategory,
    addBudget,
    addSavingsGoal: addSavings,
    updateSavingsGoal: updateSavings,
    deleteSavingsGoal: deleteSavings,
    addDebt,
    updateDebt,
    deleteDebt,
    exportData: importExportService.exportData,
    importData: importExportService.importData,
    resetData: () => {
      if (confirm('Êtes-vous sûr de vouloir supprimer TOUTES les données ? Cette action est irréversible.')) {
        resetDataMutation.mutate();
      }
    },
  };
};
