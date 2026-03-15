import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Transaction, Wallet, SavingsGoal, Debt } from '../types';

const TRANSACTIONS_URL = 'http://localhost:3001/api/transactions';
const WALLETS_URL = 'http://localhost:3001/api/wallets';
const SAVINGS_URL = 'http://localhost:3001/api/savings';
const DEBTS_URL = 'http://localhost:3001/api/debts';

export const useFinance = () => {
  const queryClient = useQueryClient();

  // Queries
  const { data: wallets = [] } = useQuery<Wallet[]>({
    queryKey: ['wallets'],
    queryFn: async () => {
      const res = await fetch(WALLETS_URL);
      if (!res.ok) throw new Error('Failed to fetch wallets');
      return res.json();
    },
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = await fetch(TRANSACTIONS_URL);
      return res.json();
    },
  });

  const { data: savings = [] } = useQuery<SavingsGoal[]>({
    queryKey: ['savings'],
    queryFn: async () => {
      const res = await fetch(SAVINGS_URL);
      return res.json();
    },
  });

  const { data: debts = [] } = useQuery<Debt[]>({
    queryKey: ['debts'],
    queryFn: async () => {
      const res = await fetch(DEBTS_URL);
      const data = await res.json();
      return data.map((d: any) => ({ ...d, isPaid: !!d.isPaid }));
    },
  });

  const [dashboardCurrency, setDashboardCurrency] = useState(() => 
    localStorage.getItem('vibemoula_currency') || 'USD'
  );

  useEffect(() => {
    localStorage.setItem('vibemoula_currency', dashboardCurrency);
  }, [dashboardCurrency]);

  const stats = useMemo(() => {
    let income = 0;
    let expenses = 0;
    transactions.forEach((t) => {
      if (t.type === 'income') income += t.amount;
      else expenses += t.amount;
    });
    return {
      totalIncome: income,
      totalExpenses: expenses,
      totalBalance: income - expenses,
    };
  }, [transactions]);

  // Mutations
  const addTransactionMutation = useMutation({
    mutationFn: async (data: Omit<Transaction, 'id' | 'date'>) => {
      const newTransaction = {
        ...data,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
      };
      const res = await fetch(TRANSACTIONS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const addWalletMutation = useMutation({
    mutationFn: async (wallet: Omit<Wallet, 'id'>) => {
      const newWallet = { ...wallet, id: crypto.randomUUID() };
      const res = await fetch(WALLETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWallet)
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });

  const addSavingsGoalMutation = useMutation({
    mutationFn: async (goal: Omit<SavingsGoal, 'id'>) => {
      const newGoal = { ...goal, id: crypto.randomUUID() };
      const res = await fetch(SAVINGS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal)
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings'] });
    },
  });

  const updateSavingsGoalMutation = useMutation({
    mutationFn: async (goal: SavingsGoal) => {
      const res = await fetch(`${SAVINGS_URL}/${goal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal)
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings'] });
    },
  });

  const deleteSavingsGoalMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`${SAVINGS_URL}/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings'] });
    },
  });

  const addDebtMutation = useMutation({
    mutationFn: async (debt: Omit<Debt, 'id'>) => {
      const newDebt = { ...debt, id: crypto.randomUUID() };
      const res = await fetch(DEBTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDebt)
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
  });

  const updateDebtMutation = useMutation({
    mutationFn: async (debt: Debt) => {
      const res = await fetch(`${DEBTS_URL}/${debt.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(debt)
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
  });

  const deleteDebtMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`${DEBTS_URL}/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
  });

  const resetDataMutation = useMutation({
    mutationFn: async () => {
      await fetch('http://localhost:3001/api/reset', { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      window.location.reload();
    },
  });

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ transactions, wallets, savings, debts }, null, 2));
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
    ...stats,
    addTransaction: addTransactionMutation.mutate,
    addWallet: addWalletMutation.mutate,
    addSavingsGoal: addSavingsGoalMutation.mutate,
    updateSavingsGoal: updateSavingsGoalMutation.mutate,
    deleteSavingsGoal: deleteSavingsGoalMutation.mutate,
    addDebt: addDebtMutation.mutate,
    updateDebt: updateDebtMutation.mutate,
    deleteDebt: deleteDebtMutation.mutate,
    exportData,
    resetData: () => {
      if (confirm('Êtes-vous sûr de vouloir supprimer TOUTES les données ? Cette action est irréversible.')) {
        resetDataMutation.mutate();
      }
    },
  };
};
