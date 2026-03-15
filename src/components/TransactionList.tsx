import { motion, AnimatePresence } from 'framer-motion';
import type { Transaction, Category, Wallet } from '../types';
import { formatCurrency } from '../utils/format';

const icons: Record<Category, string> = {
  food: '🍴',
  shopping: '🛍️',
  transport: '🚗',
  home: '🏠',
  salary: '💰',
  leisure: '🎨',
  other: '📦'
};

interface ItemProps {
  transaction: Transaction;
  wallet?: Wallet;
}

const TransactionItem: React.FC<ItemProps> = ({ transaction, wallet }) => {
  const isIncome = transaction.type === 'income';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="t-item"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div style={{ 
          fontSize: '1.5rem', 
          background: 'var(--bg)', 
          width: '45px', 
          height: '45px', 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          border: '1px solid var(--border)' 
        }}>
          {icons[transaction.category]}
        </div>
        <div className="t-details">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h4 style={{ fontWeight: 600 }}>{transaction.description}</h4>
            <span style={{ fontSize: '0.6rem', padding: '2px 6px', background: 'var(--bg)', borderRadius: '4px', border: '1px solid var(--border)', opacity: 0.8 }}>
              {wallet?.icon || '💵'} {(wallet?.name || 'CASH').toUpperCase()}
            </span>
            {transaction.subCategory && (
              <span style={{ fontSize: '0.6rem', padding: '2px 6px', background: 'var(--accent)', color: 'var(--bg)', borderRadius: '4px', fontWeight: 700 }}>
                {transaction.subCategory.toUpperCase()}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
              {new Date(transaction.date).toLocaleDateString()}
            </span>
            {transaction.tags && transaction.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '4px' }}>
                {transaction.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '0.6rem', padding: '1px 5px', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--muted)' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div style={{ 
        fontWeight: 700, 
        fontSize: '1.1rem',
        color: isIncome ? 'var(--positive)' : 'var(--negative)'
      }}>
        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, wallet?.currency || 'USD')}
      </div>
    </motion.div>
  );
};

interface ListProps {
  transactions: Transaction[];
  wallets: Wallet[];
}

const TransactionList: React.FC<ListProps> = ({ transactions, wallets }) => {
  return (
    <section className="history-section" style={{ marginTop: '50px' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '25px', paddingLeft: '10px' }}>
        Historique
      </h2>
      <div className="transaction-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <AnimatePresence initial={false}>
          {transactions.map((t) => (
            <TransactionItem 
              key={t.id} 
              transaction={t} 
              wallet={wallets.find(w => w.id === t.walletId)}
            />
          ))}
        </AnimatePresence>
        {transactions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
            Aucune transaction pour le moment.
          </div>
        )}
      </div>
    </section>
  );
};

export default TransactionList;
