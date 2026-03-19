import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeApi } from '../../api/financeApi';
import type { Wallet, Transaction, SavingsGoal, Debt } from '../../types';

export const useWallets = () => {
  const queryClient = useQueryClient();
  const query = useQuery<Wallet[]>({
    queryKey: ['wallets'],
    queryFn: financeApi.getWallets,
  });

  const addWalletMutation = useMutation({
    mutationFn: financeApi.createWallet,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wallets'] }),
  });

  return { ...query, addWallet: addWalletMutation.mutate };
};

export const useTransactions = () => {
  const queryClient = useQueryClient();
  const query = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: financeApi.getTransactions,
  });

  const addTransactionMutation = useMutation({
    mutationFn: financeApi.createTransaction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions'] }),
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: financeApi.deleteTransaction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions'] }),
  });

  return { 
    ...query, 
    addTransaction: addTransactionMutation.mutate,
    deleteTransaction: deleteTransactionMutation.mutate
  };
};

export const useSavings = () => {
  const queryClient = useQueryClient();
  const query = useQuery<SavingsGoal[]>({
    queryKey: ['savings'],
    queryFn: financeApi.getSavings,
  });

  const addSavingsMutation = useMutation({
    mutationFn: financeApi.createSavings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savings'] }),
  });

  const updateSavingsMutation = useMutation({
    mutationFn: financeApi.updateSavings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savings'] }),
  });

  const deleteSavingsMutation = useMutation({
    mutationFn: financeApi.deleteSavings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savings'] }),
  });

  return { 
    ...query, 
    addSavings: addSavingsMutation.mutate, 
    updateSavings: updateSavingsMutation.mutate,
    deleteSavings: deleteSavingsMutation.mutate
  };
};

export const useDebts = () => {
  const queryClient = useQueryClient();
  const query = useQuery<Debt[]>({
    queryKey: ['debts'],
    queryFn: financeApi.getDebts,
  });

  const addDebtMutation = useMutation({
    mutationFn: financeApi.createDebt,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['debts'] }),
  });

  const updateDebtMutation = useMutation({
    mutationFn: financeApi.updateDebt,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['debts'] }),
  });

  const deleteDebtMutation = useMutation({
    mutationFn: financeApi.deleteDebt,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['debts'] }),
  });

  return { 
    ...query, 
    addDebt: addDebtMutation.mutate,
    updateDebt: updateDebtMutation.mutate,
    deleteDebt: deleteDebtMutation.mutate
  };
};
