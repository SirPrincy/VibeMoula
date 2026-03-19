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

import { cn } from '@/lib/utils';

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
      className="dashboard py-2.5"
    >
      <div className="stats-grid grid grid-cols-1 gap-5 mb-10 sm:grid-cols-3">
        <div className="stat-card balance bg-card border border-border p-6 rounded-[20px]">
          <div className="stat-label flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <WalletIcon size={16} /> Solde Total
          </div>
          <div className="stat-value text-[1.8rem] font-black mb-1 text-accent">{currencyService.format(totals.balance, currency)}</div>
          <div className="stat-meta text-[0.8rem] text-muted-foreground">Vibe consolidée</div>
        </div>
        
        <div className="stat-card income bg-card border border-border p-6 rounded-[20px]">
          <div className="stat-label flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <TrendingUp size={16} /> Revenus
          </div>
          <div className="stat-value text-[1.8rem] font-black mb-1 text-emerald-500">{currencyService.format(totals.income, currency)}</div>
          <div className="stat-meta text-[0.8rem] text-muted-foreground">Ce mois-ci</div>
        </div>

        <div className="stat-card expenses bg-card border border-border p-6 rounded-[20px]">
          <div className="stat-label flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <TrendingDown size={16} /> Dépenses
          </div>
          <div className="stat-value text-[1.8rem] font-black mb-1 text-red-500">{currencyService.format(totals.expenses, currency)}</div>
          <div className="stat-meta text-[0.8rem] text-muted-foreground">Ce mois-ci</div>
        </div>
      </div>

      <div className="recent-transactions mt-10">
        <div className="section-header flex justify-between items-center mb-6">
          <h2 className="text-xl font-extrabold">Activités Récentes</h2>
          <span className="badge px-3 py-1 rounded-full bg-muted text-[0.7rem] font-bold">Dernières 5</span>
        </div>
        
        <div className="transaction-list flex flex-col gap-3">
          {transactions.filter(t => !t.isDeleted).slice(0, 5).map(t => {
            const wallet = wallets.find(w => w.id === t.walletId);
            const walletCurrency = wallet?.currency as Currency || currency;
            
            return (
              <div key={t.id} className="transaction-item flex items-center gap-4 p-4 bg-card border border-border rounded-2xl">
                <div className={cn(
                  "icon-box p-2.5 rounded-xl flex transition-colors",
                  t.type === 'income' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                )}>
                  {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                </div>
                <div className="details flex-1">
                  <div className="desc font-bold text-sm mb-0.5">{t.description}</div>
                  <div className="meta text-[0.8rem] text-muted-foreground">
                    {t.category} • {new Date(t.date).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div className={cn(
                  "amount font-black text-[1.1rem]",
                  t.type === 'income' ? "text-emerald-500" : "text-red-500"
                )}>
                  {t.type === 'income' ? '+' : '-'} {currencyService.format(Math.abs(t.amount), walletCurrency)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardView;
