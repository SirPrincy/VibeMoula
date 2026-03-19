import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import type { Transaction, Category, Wallet } from '../types';
import { currencyService } from '../services/currencyService';
import { cn } from '@/lib/utils';

interface ItemProps {
  transaction: Transaction;
  wallet?: Wallet;
  category?: Category;
  onClick?: (tx: Transaction) => void;
}

const TransactionItem: React.FC<ItemProps> = ({ transaction, wallet, category, onClick }) => {
  const isIncome = transaction.type === 'income';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={onClick && !transaction.isDeleted ? { x: 5 } : undefined}
      onClick={() => onClick?.(transaction)}
      className={cn(
        "flex justify-between items-center p-5 bg-card/40 border border-border rounded-[24px] backdrop-blur-sm shadow-subtle group transition-all",
        transaction.isDeleted ? "opacity-50" : "opacity-100",
        onClick && !transaction.isDeleted ? "cursor-pointer hover:bg-card hover:border-accent/10 hover:shadow-md" : "cursor-default"
      )}
    >
      <div className="flex gap-4 items-center">
        <div className="text-[1.4rem] bg-background w-[45px] h-[45px] rounded-[16px] flex items-center justify-center border border-border transition-transform duration-300 group-hover:scale-110">
          {category?.icon || '📦'}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-[0.95rem] tracking-tight">{transaction.description}</h4>
            {transaction.isReconciled && (
               <CheckCircle size={14} className="text-emerald-500" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[0.75rem] font-semibold text-muted-foreground mr-1">
              {category?.name || 'Autre'} • {wallet?.name || 'Cash'}
            </span>
            <span className="text-[0.75rem] text-muted-foreground/60">
              {new Date(transaction.date).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className={cn(
          "font-black text-[1.1rem] tracking-tight",
          isIncome ? "text-emerald-500" : "text-red-500"
        )}>
          {isIncome ? '+' : '-'} {currencyService.format(Math.abs(transaction.amount), (wallet?.currency as any) || 'USD')}
        </div>
      </div>
    </motion.div>
  );
};

interface ListProps {
  transactions: Transaction[];
  wallets: Wallet[];
  categories: Category[];
  onEditTransaction?: (tx: Transaction) => void;
}

const TransactionList: React.FC<ListProps> = ({ transactions, wallets, categories, onEditTransaction }) => {
  const activeTransactions = transactions.filter(t => !t.isDeleted);

  return (
    <section style={{ marginTop: '40px' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>
        Dernières activités
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <AnimatePresence initial={false}>
          {activeTransactions.map((t) => (
            <TransactionItem 
              key={t.id} 
              transaction={t} 
              wallet={wallets.find(w => w.id === t.walletId)}
              category={categories.find(c => c.id === t.categoryId)}
              onClick={onEditTransaction}
            />
          ))}
        </AnimatePresence>
        {activeTransactions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)', fontSize: '0.9rem', border: '1px dashed var(--border)', borderRadius: '16px' }}>
            Aucune transaction trouvée.
          </div>
        )}
      </div>
    </section>
  );
};

export default TransactionList;
