import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Plus, X } from 'lucide-react';
import TransactionList from './TransactionList';
import type { Wallet, Transaction, Category, Budget, Currency } from '../types';
import { SUPPORTED_CURRENCIES } from '../types';
import { currencyService } from '../services/currencyService';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Download, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Label } from './ui/label';
interface Props {
  transactions: Transaction[];
  wallets: Wallet[];
  categories: Category[];
  budgets: Budget[];
  onAddWallet: (wallet: any) => void;
  onAddCategory: (category: any) => void;
  onAddBudget: (budget: any) => void;
  onExport: () => void;
  dashboardCurrency: Currency;
}

const FinanceView: React.FC<Props> = ({ 
  transactions, 
  wallets, 
  categories,
  budgets,
  onAddWallet, 
  onAddCategory,
  onAddBudget,
  onExport, 
  dashboardCurrency 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'wallets' | 'budgets' | 'categories'>('wallets');
  const [showAddModal, setShowAddModal] = useState<string | null>(null);
  
  // Wallet logic
  const walletBalances = useMemo(() => {
    return transactions.reduce((acc, t) => {
      const amount = (t.type === 'income' ? 1 : -1) * t.amount;
      acc[t.walletId] = (acc[t.walletId] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);
  }, [transactions]);

  // Budget logic
  const budgetProgress = useMemo(() => {
    return budgets.map(budget => {
      const spent = transactions
        .filter(t => t.categoryId === budget.categoryId && t.type === 'expense' && !t.isDeleted)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      return { ...budget, spent };
    });
  }, [budgets, transactions]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="flex justify-between items-center mb-[30px]">
        <h2 className="text-[1.8rem] font-black">Finance</h2>
        <button 
          onClick={onExport} 
          className="flex items-center gap-1.5 bg-none border-none text-muted-foreground text-[0.8rem] font-bold cursor-pointer hover:text-foreground transition-colors"
        >
          <Download size={16} /> Export
        </button>
      </div>

      {/* Sub-Tabs */}
      <div className="flex gap-5 mb-[30px] border-b border-border pb-2.5">
        {(['wallets', 'budgets', 'categories'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={cn(
               "relative bg-none border-none font-bold text-[0.9rem] cursor-pointer capitalize transition-colors",
               activeSubTab === tab ? "text-accent" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === 'wallets' ? 'Comptes' : tab}
            {activeSubTab === tab && (
              <motion.div 
                layoutId="subtab" 
                className="absolute left-0 right-0 bottom-[-11px] h-[2px] bg-accent" 
              />
            )}
          </button>
        ))}
      </div>

      {activeSubTab === 'wallets' && (
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[1rem] font-bold">Mes Comptes</h3>
            <button 
              onClick={() => setShowAddModal('wallet')} 
              className="flex items-center gap-1 bg-accent text-background border-none rounded-full px-3 py-1.5 text-[0.75rem] font-bold cursor-pointer transition-transform active:scale-95"
            >
              <Plus size={14} /> Nouveau
            </button>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
            {wallets.map(w => (
              <div key={w.id} className="bg-card p-5 rounded-[16px] border border-border transition-shadow hover:shadow-lg">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="text-[1.5rem]">{w.icon}</span>
                  <span className="font-bold text-[0.9rem] text-muted-foreground">{w.name}</span>
                </div>
                <div className="font-black text-[1.4rem]">
                  {currencyService.format((w.initialBalance || 0) + (walletBalances[w.id] || 0), w.currency as Currency)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeSubTab === 'budgets' && (
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[1rem] font-bold">Budgets Mensuels</h3>
            <button 
              onClick={() => setShowAddModal('budget')} 
              className="flex items-center gap-1 bg-accent text-background border-none rounded-full px-3 py-1.5 text-[0.75rem] font-bold cursor-pointer transition-transform active:scale-95"
            >
              <Plus size={14} /> Nouveau
            </button>
          </div>
          <div className="grid gap-4">
            {budgetProgress.map(b => {
              const category = categories.find(c => c.id === b.categoryId);
              const percent = Math.min((b.spent / b.amount) * 100, 100);
              return (
                <div key={b.id} className="bg-card p-5 rounded-[16px] border border-border">
                  <div className="flex justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                       <span className="text-[1.2rem]">{category?.icon || '📁'}</span>
                       <span className="font-bold">{category?.name || 'Inconnu'}</span>
                    </div>
                    <span className={cn(
                      "font-bold",
                      percent > 90 ? "text-red-500" : "text-foreground"
                    )}>
                      {currencyService.format(b.spent, dashboardCurrency)} / {currencyService.format(b.amount, dashboardCurrency)}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      className={cn(
                        "h-full rounded-full",
                        percent > 90 ? "bg-red-500" : "bg-accent"
                      )} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {activeSubTab === 'categories' && (
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[1rem] font-bold">Catégories Personnalisées</h3>
            <button 
              onClick={() => setShowAddModal('category')} 
              className="flex items-center gap-1 bg-accent text-background border-none rounded-full px-3 py-1.5 text-[0.75rem] font-bold cursor-pointer transition-transform active:scale-95"
            >
              <Plus size={14} /> Nouveau
            </button>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {categories.map(c => (
              <div key={c.id} className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 hover:bg-muted/50 transition-colors">
                <span>{c.icon}</span>
                <span className="font-bold text-[0.85rem]">{c.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <TransactionList transactions={transactions} wallets={wallets} categories={categories} />

      {/* Modals */}
      <AnimatePresence>
        {showAddModal === 'wallet' && (
           <WalletAddModal onClose={() => setShowAddModal(null)} onAdd={onAddWallet} />
        )}
        {showAddModal === 'category' && (
           <CategoryAddModal onClose={() => setShowAddModal(null)} onAdd={onAddCategory} />
        )}
        {showAddModal === 'budget' && (
           <BudgetAddModal onClose={() => setShowAddModal(null)} onAdd={onAddBudget} categories={categories} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Sub-components for Modals
const WalletAddModal = ({ onClose, onAdd }: any) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🏦');
  const [curr, setCurr] = useState('USD');
  const [initial, setInitial] = useState(0);

  return (
    <ModalWrapper title="Nouveau Portefeuille" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onAdd({ name, icon, currency: curr, initialBalance: initial }); onClose(); }} className="space-y-4">
        <Input label="Nom" value={name} onChange={setName} />
        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1.5">
            <Label className="text-[0.7rem] font-black uppercase text-muted-foreground">Icône</Label>
            <select 
              value={icon} 
              onChange={e => setIcon(e.target.value)} 
              className="w-full rounded-xl border border-border bg-muted/30 p-3 text-sm font-semibold outline-none focus:border-foreground/20 focus:bg-muted/50"
            >
              <option value="🏦">🏦 Banque</option>
              <option value="💵">💵 Cash</option>
              <option value="💳">💳 Carte</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[0.7rem] font-black uppercase text-muted-foreground">Devise</Label>
            <select 
              value={curr} 
              onChange={e => setCurr(e.target.value)} 
              className="w-full rounded-xl border border-border bg-muted/30 p-3 text-sm font-semibold outline-none focus:border-foreground/20 focus:bg-muted/50"
            >
              {SUPPORTED_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[0.7rem] font-black uppercase text-muted-foreground">Solde Initial</Label>
          <Input type="number" value={initial} onChange={(v: any) => setInitial(Number(v))} />
        </div>
        <Button type="submit" className="w-full h-12 mt-5 rounded-xl bg-accent text-background font-black text-lg">Créer</Button>
      </form>
    </ModalWrapper>
  );
};

const CategoryAddModal = ({ onClose, onAdd }: any) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📁');
  return (
    <ModalWrapper title="Nouvelle Catégorie" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onAdd({ name, icon, type: 'expense' }); onClose(); }} className="space-y-4">
        <Input label="Nom" value={name} onChange={setName} />
        <Input label="Icône" value={icon} onChange={setIcon} />
        <Button type="submit" className="w-full h-12 mt-5 rounded-xl bg-accent text-background font-black text-lg">Créer</Button>
      </form>
    </ModalWrapper>
  );
};

const BudgetAddModal = ({ onClose, onAdd, categories }: any) => {
  const [catId, setCatId] = useState('');
  const [amount, setAmount] = useState(0);
  return (
    <ModalWrapper title="Définir un Budget" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onAdd({ categoryId: catId, amount, period: 'monthly' }); onClose(); }} className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-[0.7rem] font-black uppercase text-muted-foreground">Catégorie</Label>
          <select 
            value={catId} 
            onChange={e => setCatId(e.target.value)} 
            className="w-full rounded-xl border border-border bg-muted/30 p-3 text-sm font-semibold outline-none focus:border-foreground/20 focus:bg-muted/50"
          >
            <option value="">Sélectionner</option>
            {categories.map((c: any) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
        </div>
        <Input label="Montant Mensuel" type="number" value={amount} onChange={(v: any) => setAmount(Number(v))} />
        <Button type="submit" className="w-full h-12 mt-5 rounded-xl bg-accent text-background font-black text-lg">Définir</Button>
      </form>
    </ModalWrapper>
  );
};

const ModalWrapper = ({ children, title, onClose }: any) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[1100] flex items-center justify-center p-5 bg-black/40 backdrop-blur-md"
    onClick={onClose}
  >
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
      className="w-full max-w-[400px] bg-card p-[30px] rounded-[24px] shadow-2xl border border-border"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black">{title}</h3>
        <button 
          onClick={onClose} 
          className="bg-none border-none text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </motion.div>
  </motion.div>
);

const Input = ({ label, value, onChange, type = "text" }: any) => (
  <div className="space-y-1.5">
    {label && <Label className="text-[0.7rem] font-black uppercase text-muted-foreground">{label}</Label>}
    <input 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className="w-full rounded-xl border border-border bg-muted/30 p-3 text-sm font-semibold outline-none focus:border-foreground/20 focus:bg-muted/50 transition-colors"
    />
  </div>
);

export default FinanceView;
