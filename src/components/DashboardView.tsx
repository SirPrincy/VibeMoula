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
      <div className="stats-grid grid grid-cols-1 gap-6 mb-12 sm:grid-cols-3">
        <div className="stat-card balance bg-card/40 border border-border p-6 rounded-[24px] backdrop-blur-sm shadow-subtle flex flex-col justify-between h-[160px]">
          <div className="stat-label flex items-center gap-2 text-[0.7rem] font-bold text-muted-foreground uppercase tracking-widest">
            <WalletIcon size={14} className="text-accent" /> Solde Total
          </div>
          <div>
            <div className="stat-value text-[2.2rem] font-black tracking-tighter text-accent leading-none mb-1">{currencyService.format(totals.balance, currency)}</div>
            <div className="stat-meta text-[0.75rem] font-medium text-muted-foreground/60">Vibe consolidée</div>
          </div>
        </div>
        
        <div className="stat-card income bg-card/40 border border-border p-6 rounded-[24px] backdrop-blur-sm shadow-subtle flex flex-col justify-between h-[160px]">
          <div className="stat-label flex items-center gap-2 text-[0.7rem] font-bold text-muted-foreground uppercase tracking-widest">
            <TrendingUp size={14} className="text-emerald-500" /> Revenus
          </div>
          <div>
            <div className="stat-value text-[2.2rem] font-black tracking-tighter text-emerald-500 leading-none mb-1">{currencyService.format(totals.income, currency)}</div>
            <div className="stat-meta text-[0.75rem] font-medium text-muted-foreground/60">Ce mois-ci</div>
          </div>
        </div>

        <div className="stat-card expenses bg-card/40 border border-border p-6 rounded-[24px] backdrop-blur-sm shadow-subtle flex flex-col justify-between h-[160px]">
          <div className="stat-label flex items-center gap-2 text-[0.7rem] font-bold text-muted-foreground uppercase tracking-widest">
            <TrendingDown size={14} className="text-red-500" /> Dépenses
          </div>
          <div>
            <div className="stat-value text-[2.2rem] font-black tracking-tighter text-red-500 leading-none mb-1">{currencyService.format(totals.expenses, currency)}</div>
            <div className="stat-meta text-[0.75rem] font-medium text-muted-foreground/60">Ce mois-ci</div>
          </div>
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
              <motion.div 
                key={t.id} 
                whileHover={{ x: 5 }}
                className="transaction-item flex items-center gap-4 p-5 bg-card/40 border border-border rounded-[24px] backdrop-blur-sm shadow-subtle group transition-all hover:bg-card hover:border-accent/10"
              >
                <div className={cn(
                  "icon-box p-3 rounded-2xl flex transition-all group-hover:scale-110",
                  t.type === 'income' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                )}>
                  {t.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                </div>
                <div className="details flex-1 overflow-hidden">
                  <div className="desc font-bold text-[0.95rem] tracking-tight mb-0.5 truncate">{t.description}</div>
                  <div className="meta text-[0.75rem] font-medium text-muted-foreground/60 flex items-center gap-2">
                    <span className="bg-muted/50 px-2 py-0.5 rounded-md">{t.category}</span>
                    <span>•</span>
                    <span>{new Date(t.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
                <div className={cn(
                  "amount font-black text-[1.2rem] tracking-tight",
                  t.type === 'income' ? "text-emerald-500" : "text-red-500"
                )}>
                  {t.type === 'income' ? '+' : '-'} {currencyService.format(Math.abs(t.amount), walletCurrency)}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardView;
