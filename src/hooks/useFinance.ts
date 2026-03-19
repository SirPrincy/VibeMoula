import { useState, useEffect, useMemo } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useWallets, useTransactions, useSavings, useDebts } from './queries/useFinanceQueries';
import { statisticsService } from '../services/statisticsService';
import { persistenceService } from '../services/persistenceService';
import { financeApi } from '../api/financeApi';

export const useFinance = () => {
  const queryClient = useQueryClient();
  
  // New granular hooks
  const { data: wallets = [], addWallet } = useWallets();
  const { data: transactions = [], addTransaction, deleteTransaction } = useTransactions();
  const { data: savings = [], addSavings, updateSavings, deleteSavings } = useSavings();
  const { data: debts = [], addDebt, updateDebt, deleteDebt } = useDebts();

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

  const exportData = () => {
    const data = { transactions, wallets, savings, debts };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "vibemoula_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return {
    transactions,
    wallets,
    savings,
    debts,
    dashboardCurrency,
    setDashboardCurrency,
    totalIncome: stats.totalIncome,
    totalExpenses: stats.totalExpenses,
    totalBalance: stats.totalBalance,
    addTransaction,
    deleteTransaction,
    addWallet,
    addSavingsGoal: addSavings,
    updateSavingsGoal: updateSavings,
    deleteSavingsGoal: deleteSavings,
    addDebt,
    updateDebt,
    deleteDebt,
    exportData,
    resetData: () => {
      if (confirm('Êtes-vous sûr de vouloir supprimer TOUTES les données ? Cette action est irréversible.')) {
        resetDataMutation.mutate();
      }
    },
  };
};
