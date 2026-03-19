import { financeApi } from '../api/financeApi';
import type { Wallet, Transaction, SavingsGoal, Debt, Category, RecurringTemplate, Budget } from '../types';

interface ExportDataV2 {
  appId: 'vibemoula';
  version: 2;
  exportDate: string;
  data: {
    wallets: Wallet[];
    transactions: Transaction[];
    savings: SavingsGoal[];
    debts: Debt[];
    categories: Category[];
    recurringTemplates: RecurringTemplate[];
    budgets: Budget[];
  };
}

export const importExportService = {
  exportData: async () => {
    const [wallets, transactions, savings, debts, categories, recurring, budgets] = await Promise.all([
      financeApi.getWallets(),
      financeApi.getTransactions(),
      financeApi.getSavings(),
      financeApi.getDebts(),
      financeApi.getCategories(),
      financeApi.getRecurring(),
      financeApi.getBudgets(),
    ]);

    const exportData: ExportDataV2 = {
      appId: 'vibemoula',
      version: 2,
      exportDate: new Date().toISOString(),
      data: {
        wallets,
        transactions,
        savings,
        debts,
        categories,
        recurringTemplates: recurring,
        budgets,
      },
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `vibemoula_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  importData: async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = JSON.parse(e.target?.result as string);
          
          if (content.appId !== 'vibemoula') {
            throw new Error('Fichier invalide : appId incorrect');
          }

          console.log(`Importing data version ${content.version}`);
          
          // Basic migration logic if version < 2
          if (content.version === 1 || !content.version) {
             // Handle migration from V1 to V2 if needed
             // For now, assume V1 is compatible with some fields missing
          }

          const { data } = content;
          
          // Parallel imports (sequential for DB safety if needed, but parallel is faster)
          // Note: In a real app, we might want to clear existing data first or merge
          if (confirm('L\'importation va écraser vos données actuelles. Continuer ?')) {
             await financeApi.resetAll();
             
             // This is simplified. Real import would iterate and call create APIs
             // ideally we'd have a bulk import endpoint
             for (const cat of data.categories || []) await financeApi.createCategory(cat);
             for (const w of data.wallets || []) await financeApi.createWallet(w);
             for (const t of data.transactions || []) await financeApi.createTransaction(t);
             for (const s of data.savings || []) await financeApi.createSavings(s);
             for (const d of data.debts || []) await financeApi.createDebt(d);
             for (const r of data.recurringTemplates || []) await financeApi.createRecurring(r);
             for (const b of data.budgets || []) await financeApi.createBudget(b);
             
             resolve();
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  }
};
