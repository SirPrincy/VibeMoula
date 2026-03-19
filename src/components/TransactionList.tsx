import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import type { Transaction, Category, Wallet } from '../types';
import { currencyService } from '../services/currencyService';

interface ItemProps {
  transaction: Transaction;
  wallet?: Wallet;
  category?: Category;
}

const TransactionItem: React.FC<ItemProps> = ({ transaction, wallet, category }) => {
  const isIncome = transaction.type === 'income';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        opacity: transaction.isDeleted ? 0.5 : 1
      }}
    >
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div style={{ 
          fontSize: '1.4rem', 
          background: 'var(--bg)', 
          width: '45px', 
          height: '45px', 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          border: '1px solid var(--border)' 
        }}>
          {category?.icon || '📦'}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{transaction.description}</h4>
            {transaction.isReconciled && (
               <CheckCircle size={14} color="#10b981" />
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}>
              {category?.name || 'Autre'} • {wallet?.name || 'Cash'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
              {new Date(transaction.date).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>
      </div>
      
      <div style={{ 
        fontWeight: 800, 
        fontSize: '1.1rem',
        color: isIncome ? '#10b981' : '#ef4444'
      }}>
        {isIncome ? '+' : '-'} {currencyService.format(Math.abs(transaction.amount), (wallet?.currency as any) || 'USD')}
      </div>
    </motion.div>
  );
};

interface ListProps {
  transactions: Transaction[];
  wallets: Wallet[];
  categories: Category[];
}

const TransactionList: React.FC<ListProps> = ({ transactions, wallets, categories }) => {
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
