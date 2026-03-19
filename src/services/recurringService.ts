import { financeApi } from '../api/financeApi';

export const recurringService = {
  checkAndGenerate: async () => {
    const templates = await financeApi.getRecurring();
    const activeTemplates = templates.filter(t => t.isActive && !t.isDeleted);
    const now = new Date();

    for (const template of activeTemplates) {
      let nextRun = new Date(template.nextRunDate);
      
      while (nextRun <= now) {
        console.log(`Generating transaction from template: ${template.description}`);
        
        // Generate Transaction
        const newTransaction: any = {
          description: template.description,
          amount: template.amount,
          categoryId: template.categoryId,
          category: 'Récurrent', // Legacy fallback
          type: template.amount > 0 ? 'income' : 'expense',
          walletId: template.walletId,
          date: nextRun.toISOString(),
          isReconciled: false,
        };

        await financeApi.createTransaction(newTransaction);

        // Calculate next run date based on frequency
        nextRun = calculateNextRun(nextRun, template.frequency);
      }

      // Update Template nextRunDate
      // await financeApi.updateRecurring({ ...template, nextRunDate: nextRun.toISOString() });
      // TODO: Add updateRecurring to financeApi
    }
  }
};

function calculateNextRun(current: Date, frequency: string): Date {
  const next = new Date(current);
  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}
