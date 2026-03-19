import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeApi } from '../../api/financeApi';
import type { Wallet, Transaction, SavingsGoal, Debt, BaseEntity } from '../../types';

export const useWallets = () => {
  const queryClient = useQueryClient();
  const query = useQuery<Wallet[]>({
    queryKey: ['wallets'],
    queryFn: financeApi.getWallets,
  });

  const addWalletMutation = useMutation({
    mutationFn: financeApi.createWallet,
    onMutate: async (newWallet) => {
      await queryClient.cancelQueries({ queryKey: ['wallets'] });
      const previousWallets = queryClient.getQueryData<Wallet[]>(['wallets']);
      queryClient.setQueryData<Wallet[]>(['wallets'], (old = []) => [
        ...old,
        { 
          ...newWallet, 
          id: crypto.randomUUID(), 
          initialBalance: newWallet.initialBalance || 0,
          updatedAt: new Date().toISOString(),
          isDeleted: false 
        } as Wallet,
      ]);
      return { previousWallets };
    },
    onError: (_err, _newWallet, context) => {
      queryClient.setQueryData(['wallets'], context?.previousWallets);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
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
    onMutate: async (newTransaction) => {
      await queryClient.cancelQueries({ queryKey: ['transactions'] });
      const previousTransactions = queryClient.getQueryData<Transaction[]>(['transactions']);
      queryClient.setQueryData<Transaction[]>(['transactions'], (old = []) => [
        { 
          ...newTransaction, 
          id: crypto.randomUUID(), 
          date: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isDeleted: false 
        } as Transaction,
        ...old,
      ]);
      return { previousTransactions };
    },
    onError: (_err, _newTransaction, context) => {
      queryClient.setQueryData(['transactions'], context?.previousTransactions);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: financeApi.deleteTransaction,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['transactions'] });
      const previousTransactions = queryClient.getQueryData<Transaction[]>(['transactions']);
      queryClient.setQueryData<Transaction[]>(['transactions'], (old = []) => 
        old.filter(t => t.id !== id)
      );
      return { previousTransactions };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(['transactions'], context?.previousTransactions);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
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
    onMutate: async (newGoal) => {
      await queryClient.cancelQueries({ queryKey: ['savings'] });
      const previousSavings = queryClient.getQueryData<SavingsGoal[]>(['savings']);
      queryClient.setQueryData<SavingsGoal[]>(['savings'], (old = []) => [
        ...old,
        { ...newGoal, id: crypto.randomUUID(), updatedAt: new Date().toISOString(), isDeleted: false } as SavingsGoal,
      ]);
      return { previousSavings };
    },
    onError: (_err, _newGoal, context) => {
      queryClient.setQueryData(['savings'], context?.previousSavings);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['savings'] });
    },
  });

  const updateSavingsMutation = useMutation({
    mutationFn: financeApi.updateSavings,
    onMutate: async (updatedGoal) => {
      await queryClient.cancelQueries({ queryKey: ['savings'] });
      const previousSavings = queryClient.getQueryData<SavingsGoal[]>(['savings']);
      queryClient.setQueryData<SavingsGoal[]>(['savings'], (old = []) => 
        old.map(g => g.id === updatedGoal.id ? { ...updatedGoal, updatedAt: new Date().toISOString() } : g)
      );
      return { previousSavings };
    },
    onError: (_err, _updatedGoal, context) => {
      queryClient.setQueryData(['savings'], context?.previousSavings);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['savings'] });
    },
  });

  const deleteSavingsMutation = useMutation({
    mutationFn: financeApi.deleteSavings,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['savings'] });
      const previousSavings = queryClient.getQueryData<SavingsGoal[]>(['savings']);
      queryClient.setQueryData<SavingsGoal[]>(['savings'], (old = []) => 
        old.filter(g => g.id !== id)
      );
      return { previousSavings };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(['savings'], context?.previousSavings);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['savings'] });
    },
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
    onMutate: async (newDebt) => {
      await queryClient.cancelQueries({ queryKey: ['debts'] });
      const previousDebts = queryClient.getQueryData<Debt[]>(['debts']);
      queryClient.setQueryData<Debt[]>(['debts'], (old = []) => [
        ...old,
        { ...newDebt, id: crypto.randomUUID(), updatedAt: new Date().toISOString(), isDeleted: false } as Debt,
      ]);
      return { previousDebts };
    },
    onError: (_err, _newDebt, context) => {
      queryClient.setQueryData(['debts'], context?.previousDebts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
  });

  const updateDebtMutation = useMutation({
    mutationFn: financeApi.updateDebt,
    onMutate: async (updatedDebt) => {
      await queryClient.cancelQueries({ queryKey: ['debts'] });
      const previousDebts = queryClient.getQueryData<Debt[]>(['debts']);
      queryClient.setQueryData<Debt[]>(['debts'], (old = []) => 
        old.map(d => d.id === updatedDebt.id ? { ...updatedDebt, updatedAt: new Date().toISOString() } : d)
      );
      return { previousDebts };
    },
    onError: (_err, _updatedDebt, context) => {
      queryClient.setQueryData(['debts'], context?.previousDebts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
  });

  const deleteDebtMutation = useMutation({
    mutationFn: financeApi.deleteDebt,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['debts'] });
      const previousDebts = queryClient.getQueryData<Debt[]>(['debts']);
      queryClient.setQueryData<Debt[]>(['debts'], (old = []) => 
        old.filter(d => d.id !== id)
      );
      return { previousDebts };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(['debts'], context?.previousDebts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
    },
  });

  return { 
    ...query, 
    addDebt: addDebtMutation.mutate,
    updateDebt: updateDebtMutation.mutate,
    deleteDebt: deleteDebtMutation.mutate
  };
};
