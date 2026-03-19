import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeApi } from '../../api/financeApi';
import type { 
  Wallet, Transaction, SavingsGoal, Debt, 
  Category, RecurringTemplate, Budget,
  CreateTransactionInput, CreateWalletInput, CreateCategoryInput,
  CreateSavingsGoalInput, CreateDebtInput, CreateRecurringTemplateInput, CreateBudgetInput
} from '../../types';

export const useWallets = () => {
  const queryClient = useQueryClient();
  const query = useQuery<Wallet[]>({
    queryKey: ['wallets'],
    queryFn: financeApi.getWallets,
  });

  const addWalletMutation = useMutation({
    mutationFn: (newWallet: CreateWalletInput & { id: string }) => 
      financeApi.createWallet(newWallet),
    onMutate: async (newWallet) => {
      await queryClient.cancelQueries({ queryKey: ['wallets'] });
      const previousWallets = queryClient.getQueryData<Wallet[]>(['wallets']);
      queryClient.setQueryData<Wallet[]>(['wallets'], (old = []) => [
        ...old,
        { 
          ...newWallet, 
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

  const updateWalletMutation = useMutation({
    mutationFn: financeApi.updateWallet,
    onMutate: async (updatedWallet) => {
      await queryClient.cancelQueries({ queryKey: ['wallets'] });
      const previousWallets = queryClient.getQueryData<Wallet[]>(['wallets']);
      queryClient.setQueryData<Wallet[]>(['wallets'], (old = []) => 
        old.map(w => w.id === updatedWallet.id ? { ...updatedWallet, updatedAt: new Date().toISOString() } : w)
      );
      return { previousWallets };
    },
    onError: (_err, _updatedWallet, context) => {
      queryClient.setQueryData(['wallets'], context?.previousWallets);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });

  const addWallet = (data: CreateWalletInput) => {
    const id = crypto.randomUUID();
    addWalletMutation.mutate({ ...data, id });
  };

  return { 
    ...query, 
    addWallet,
    updateWallet: updateWalletMutation.mutate 
  };
};

export const useCategories = () => {
  const queryClient = useQueryClient();
  const query = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: financeApi.getCategories,
  });

  const addCategoryMutation = useMutation({
    mutationFn: (newCategory: CreateCategoryInput & { id: string }) =>
      financeApi.createCategory(newCategory),
    onMutate: async (newCategory) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });
      const previous = queryClient.getQueryData<Category[]>(['categories']);
      queryClient.setQueryData<Category[]>(['categories'], (old = []) => [
        ...old,
        { ...newCategory, updatedAt: new Date().toISOString(), isDeleted: false } as Category,
      ]);
      return { previous };
    },
    onError: (_err, _new, context) => {
      queryClient.setQueryData(['categories'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const addCategory = (data: CreateCategoryInput) => {
    const id = crypto.randomUUID();
    addCategoryMutation.mutate({ ...data, id });
  };

  return { ...query, addCategory };
};

export const useTransactions = () => {
  const queryClient = useQueryClient();
  const query = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: financeApi.getTransactions,
  });

  const addTransactionMutation = useMutation({
    mutationFn: (newTransaction: CreateTransactionInput & { id: string }) => 
      financeApi.createTransaction(newTransaction),
    onMutate: async (newTransaction) => {
      await queryClient.cancelQueries({ queryKey: ['transactions'] });
      const previousTransactions = queryClient.getQueryData<Transaction[]>(['transactions']);
      
      const tempTransaction: Transaction = { 
        ...newTransaction as any, 
        date: new Date().toISOString(),
        isReconciled: false,
        updatedAt: new Date().toISOString(),
        isDeleted: false 
      };

      queryClient.setQueryData<Transaction[]>(['transactions'], (old = []) => [
        tempTransaction,
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

  const addTransaction = (data: CreateTransactionInput) => {
    const id = crypto.randomUUID();
    addTransactionMutation.mutate({ ...data, id });
  };

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

  const updateTransactionMutation = useMutation({
    mutationFn: financeApi.updateTransaction,
    onMutate: async (updatedTransaction) => {
      await queryClient.cancelQueries({ queryKey: ['transactions'] });
      const previousTransactions = queryClient.getQueryData<Transaction[]>(['transactions']);
      queryClient.setQueryData<Transaction[]>(['transactions'], (old = []) => 
        old.map(t => t.id === updatedTransaction.id ? { ...updatedTransaction, updatedAt: new Date().toISOString() } : t)
      );
      return { previousTransactions };
    },
    onError: (_err, _updatedTransaction, context) => {
      queryClient.setQueryData(['transactions'], context?.previousTransactions);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  return { 
    ...query, 
    addTransaction,
    updateTransaction: updateTransactionMutation.mutate,
    deleteTransaction: deleteTransactionMutation.mutate
  };
};

export const useRecurring = () => {
  const queryClient = useQueryClient();
  const query = useQuery<RecurringTemplate[]>({
    queryKey: ['recurring'],
    queryFn: financeApi.getRecurring,
  });

  const addRecurringMutation = useMutation({
    mutationFn: (newTemplate: CreateRecurringTemplateInput & { id: string }) =>
      financeApi.createRecurring(newTemplate),
    onMutate: async (newTemplate) => {
      await queryClient.cancelQueries({ queryKey: ['recurring'] });
      const previous = queryClient.getQueryData<RecurringTemplate[]>(['recurring']);
      queryClient.setQueryData<RecurringTemplate[]>(['recurring'], (old = []) => [
        ...old,
        { 
          ...newTemplate, 
          nextRunDate: new Date().toISOString(),
          isActive: true,
          updatedAt: new Date().toISOString(), 
          isDeleted: false 
        } as RecurringTemplate,
      ]);
      return { previous };
    },
    onError: (_err, _new, context) => {
      queryClient.setQueryData(['recurring'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring'] });
    },
  });

  const addRecurring = (data: CreateRecurringTemplateInput) => {
    const id = crypto.randomUUID();
    addRecurringMutation.mutate({ ...data, id });
  };

  return { ...query, addRecurring };
};

export const useBudgets = () => {
  const queryClient = useQueryClient();
  const query = useQuery<Budget[]>({
    queryKey: ['budgets'],
    queryFn: financeApi.getBudgets,
  });

  const addBudgetMutation = useMutation({
    mutationFn: (newBudget: CreateBudgetInput & { id: string }) =>
      financeApi.createBudget(newBudget),
    onMutate: async (newBudget) => {
      await queryClient.cancelQueries({ queryKey: ['budgets'] });
      const previous = queryClient.getQueryData<Budget[]>(['budgets']);
      queryClient.setQueryData<Budget[]>(['budgets'], (old = []) => [
        ...old,
        { ...newBudget, updatedAt: new Date().toISOString(), isDeleted: false } as Budget,
      ]);
      return { previous };
    },
    onError: (_err, _new, context) => {
      queryClient.setQueryData(['budgets'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });

  const addBudget = (data: CreateBudgetInput) => {
    const id = crypto.randomUUID();
    addBudgetMutation.mutate({ ...data, id });
  };

  return { ...query, addBudget };
};

export const useSavings = () => {
  const queryClient = useQueryClient();
  const query = useQuery<SavingsGoal[]>({
    queryKey: ['savings'],
    queryFn: financeApi.getSavings,
  });

  const addSavingsMutation = useMutation({
    mutationFn: (newGoal: CreateSavingsGoalInput & { id: string }) =>
      financeApi.createSavings(newGoal),
    onMutate: async (newGoal) => {
      await queryClient.cancelQueries({ queryKey: ['savings'] });
      const previousSavings = queryClient.getQueryData<SavingsGoal[]>(['savings']);
      queryClient.setQueryData<SavingsGoal[]>(['savings'], (old = []) => [
        ...old,
        { ...newGoal, updatedAt: new Date().toISOString(), isDeleted: false } as SavingsGoal,
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

  const addSavings = (data: CreateSavingsGoalInput) => {
    const id = crypto.randomUUID();
    addSavingsMutation.mutate({ ...data, id });
  };

  return { 
    ...query, 
    addSavings, 
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
    mutationFn: (newDebt: CreateDebtInput & { id: string }) =>
      financeApi.createDebt(newDebt),
    onMutate: async (newDebt) => {
      await queryClient.cancelQueries({ queryKey: ['debts'] });
      const previousDebts = queryClient.getQueryData<Debt[]>(['debts']);
      queryClient.setQueryData<Debt[]>(['debts'], (old = []) => [
        ...old,
        { ...newDebt, updatedAt: new Date().toISOString(), isDeleted: false } as Debt,
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

  const addDebt = (data: CreateDebtInput) => {
    const id = crypto.randomUUID();
    addDebtMutation.mutate({ ...data, id });
  };

  return { 
    ...query, 
    addDebt,
    updateDebt: updateDebtMutation.mutate,
    deleteDebt: deleteDebtMutation.mutate
  };
};
