import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft
} from 'lucide-react';
import type { Transaction, Wallet, Currency } from '../types';
import { currencyService } from '../services/currencyService';

interface DashboardViewProps {
  transactions: Transaction[];
  wallets: Wallet[];
  currency: Currency;
}

const DashboardView: React.FC<DashboardViewProps> = ({ 
  transactions, 
  wallets,
  currency 
}) => {
  const totals = useMemo(() => {
    const balance = wallets.reduce((acc, w) => {
      const converted = currencyService.convert(w.initialBalance || 0, w.currency as Currency, currency);
      return acc + converted;
    }, 0);

    const income = transactions
      .filter(t => t.type === 'income' && !t.isDeleted)
      .reduce((acc, t) => {
        const wallet = wallets.find(w => w.id === t.walletId);
        const fromCurrency = wallet?.currency as Currency || currency;
        return acc + currencyService.convert(t.amount, fromCurrency, currency);
      }, 0);

    const expenses = transactions
      .filter(t => t.type === 'expense' && !t.isDeleted)
      .reduce((acc, t) => {
        const wallet = wallets.find(w => w.id === t.walletId);
        const fromCurrency = wallet?.currency as Currency || currency;
        return acc + currencyService.convert(Math.abs(t.amount), fromCurrency, currency);
      }, 0);

    return { 
      balance: balance + income - expenses, 
      income, 
      expenses 
    };
  }, [wallets, transactions, currency]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="dashboard"
    >
      <div className="stats-grid">
        <div className="stat-card balance">
          <div className="stat-label">
            <WalletIcon size={16} /> Solde Total
          </div>
          <div className="stat-value">{currencyService.format(totals.balance, currency)}</div>
          <div className="stat-meta">Vibe consolidée</div>
        </div>
        
        <div className="stat-card income">
          <div className="stat-label">
            <TrendingUp size={16} /> Revenus
          </div>
          <div className="stat-value">{currencyService.format(totals.income, currency)}</div>
          <div className="stat-meta">Ce mois-ci</div>
        </div>

        <div className="stat-card expenses">
          <div className="stat-label">
            <TrendingDown size={16} /> Dépenses
          </div>
          <div className="stat-value">{currencyService.format(totals.expenses, currency)}</div>
          <div className="stat-meta">Ce mois-ci</div>
        </div>
      </div>

      <div className="recent-transactions">
        <div className="section-header">
          <h2>Activités Récentes</h2>
          <span className="badge">Dernières 5</span>
        </div>
        
        <div className="transaction-list">
          {transactions.filter(t => !t.isDeleted).slice(0, 5).map(t => {
            const wallet = wallets.find(w => w.id === t.walletId);
            const walletCurrency = wallet?.currency as Currency || currency;
            
            return (
              <div key={t.id} className="transaction-item">
                <div className={`icon-box ${t.type}`}>
                  {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                </div>
                <div className="details">
                  <div className="desc">{t.description}</div>
                  <div className="meta">
                    {t.category} • {new Date(t.date).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div className={`amount ${t.type}`}>
                  {t.type === 'income' ? '+' : '-'} {currencyService.format(Math.abs(t.amount), walletCurrency)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .dashboard { padding: 10px 0; }
        .stats-grid { 
          display: grid; 
          grid-template-columns: 1fr; 
          gap: 20px; 
          margin-bottom: 40px; 
        }
        @media (min-width: 640px) {
          .stats-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .stat-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          padding: 24px;
          border-radius: 20px;
        }
        .stat-label { 
          display: flex; 
          align-items: center; 
          gap: 8px; 
          font-size: 0.9rem; 
          color: var(--fg-muted);
          margin-bottom: 12px;
        }
        .stat-value { font-size: 1.8rem; font-weight: 800; margin-bottom: 4px; }
        .stat-meta { font-size: 0.8rem; color: var(--fg-muted); }
        
        .balance .stat-value { color: var(--accent); }
        .income .stat-value { color: #10b981; }
        .expenses .stat-value { color: #ef4444; }

        .recent-transactions { margin-top: 40px; }
        .section-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 24px; 
        }
        .transaction-list { display: flex; flex-direction: column; gap: 12px; }
        .transaction-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 16px;
        }
        .icon-box {
          padding: 10px;
          border-radius: 12px;
          display: flex;
        }
        .icon-box.income { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .icon-box.expense { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        
        .details { flex: 1; }
        .desc { font-weight: 600; margin-bottom: 2px; }
        .meta { font-size: 0.8rem; color: var(--fg-muted); }
        .amount { font-weight: 700; font-size: 1.1rem; }
      `}</style>
    </motion.div>
  );
};

export default DashboardView;
