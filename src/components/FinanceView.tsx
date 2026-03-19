import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Download, X, Settings } from 'lucide-react';
import TransactionList from './TransactionList';
import type { Wallet, Transaction, Category, Budget, Currency } from '../types';
import { SUPPORTED_CURRENCIES } from '../types';
import { currencyService } from '../services/currencyService';
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
  onEditTransaction?: (tx: Transaction) => void;
  onEditWallet?: (wallet: Wallet) => void;
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
  dashboardCurrency,
  onEditTransaction,
  onEditWallet
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'wallets' | 'budgets' | 'categories'>('wallets');
  const [showAddModal, setShowAddModal] = useState<string | null>(null);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);

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

  const totalBalance = useMemo(() => {
    return wallets.reduce((acc, w) => {
      return acc + currencyService.convert((w.initialBalance || 0) + (walletBalances[w.id] || 0), w.currency as Currency, dashboardCurrency);
    }, 0);
  }, [wallets, walletBalances, dashboardCurrency]);

  const toggleWalletSelection = (walletId: string) => {
    setSelectedWallets(prev => 
      prev.includes(walletId) ? prev.filter(id => id !== walletId) : [...prev, walletId]
    );
  };

  const filteredTransactions = useMemo(() => {
    if (selectedWallets.length === 0) return transactions;
    return transactions.filter(t => selectedWallets.includes(t.walletId));
  }, [transactions, selectedWallets]);

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
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-[1rem] font-bold">Mes Comptes</h3>
            </div>
            <button
              onClick={() => { setEditingWallet(null); setShowAddModal('wallet'); }}
              className="flex items-center gap-1 bg-accent text-background border-none rounded-full px-3 py-1.5 text-[0.75rem] font-bold cursor-pointer transition-transform active:scale-95"
            >
              <Plus size={14} /> Nouveau
            </button>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              onClick={() => setSelectedWallets([])}
              className={cn(
                "group relative overflow-hidden bg-accent text-background p-6 rounded-[24px] border shadow-xl backdrop-blur-sm transition-all hover:shadow-2xl cursor-pointer",
                selectedWallets.length === 0 ? "ring-2 ring-background/40" : ""
              )}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background/20 text-2xl">
                    🌍
                  </div>
                  <span className="font-bold text-[1rem] tracking-tight">Solde Total</span>
                </div>
              </div>
              <div className="font-black text-[1.8rem] tracking-tighter">
                {currencyService.format(totalBalance, dashboardCurrency)}
              </div>
              <div className="absolute top-0 right-0 h-24 w-24 translate-x-12 translate-y-[-12px] rounded-full bg-background/10 blur-3xl transition-opacity group-hover:opacity-100 pointer-events-none" />
            </motion.div>

            {wallets.map(w => {
              const isSelected = selectedWallets.includes(w.id);
              return (
              <motion.div
                key={w.id}
                whileHover={{ y: -5 }}
                onClick={() => toggleWalletSelection(w.id)}
                className={cn(
                  "group relative overflow-hidden bg-card/40 p-6 rounded-[24px] border shadow-subtle backdrop-blur-sm transition-all hover:border-accent/20 hover:shadow-xl cursor-pointer",
                  isSelected ? "border-accent ring-2 ring-accent/20" : "border-border"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/5 text-2xl transition-colors group-hover:bg-accent/10">
                      {w.icon}
                    </div>
                    <span className="font-bold text-[1rem] tracking-tight">{w.name}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setEditingWallet(w); setShowAddModal('wallet'); }}
                    className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-accent rounded-full hover:bg-muted/50 transition-colors"
                  >
                    <Settings size={16} />
                  </button>
                </div>
                <div className="font-black text-[1.8rem] tracking-tighter">
                  {currencyService.format((w.initialBalance || 0) + (walletBalances[w.id] || 0), w.currency as Currency)}
                </div>
                <div className="absolute top-0 right-0 h-24 w-24 translate-x-12 translate-y-[-12px] rounded-full bg-accent/5 blur-3xl transition-opacity group-hover:opacity-100 pointer-events-none" />
              </motion.div>
            )})}
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
          <div className="grid gap-5">
            {budgetProgress.map(b => {
              const category = categories.find(c => c.id === b.categoryId);
              const percent = Math.min((b.spent / b.amount) * 100, 100);
              return (
                <div key={b.id} className="bg-card/40 p-6 rounded-[24px] border border-border backdrop-blur-sm shadow-subtle">
                  <div className="flex justify-between items-end mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category?.icon || '📁'}</span>
                      <div>
                        <span className="block font-black text-[1rem] tracking-tight">{category?.name || 'Inconnu'}</span>
                        <span className="text-[0.7rem] font-bold text-muted-foreground uppercase tracking-widest">Budget Mensuel</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "block font-black text-lg",
                        percent > 90 ? "text-red-500" : "text-foreground"
                      )}>
                        {currencyService.format(b.spent, dashboardCurrency)}
                      </span>
                      <span className="text-[0.7rem] font-bold text-muted-foreground uppercase">sur {currencyService.format(b.amount, dashboardCurrency)}</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      className={cn(
                        "h-full rounded-full transition-colors duration-500",
                        percent > 90 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-accent shadow-[0_0_10px_rgba(255,255,255,0.2)]"
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

      <TransactionList transactions={filteredTransactions} wallets={wallets} categories={categories} onEditTransaction={onEditTransaction} />

      {/* Modals */}
      <AnimatePresence>
        {showAddModal === 'wallet' && (
          <WalletModal 
            onClose={() => { setShowAddModal(null); setEditingWallet(null); }} 
            onSubmit={(data: any) => editingWallet && onEditWallet ? onEditWallet({ ...editingWallet, ...data } as Wallet) : onAddWallet(data)}
            initialData={editingWallet}
          />
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
const WalletModal = ({ onClose, onSubmit, initialData }: any) => {
  const [name, setName] = useState(initialData?.name || '');
  const [icon, setIcon] = useState(initialData?.icon || '🏦');
  const [curr, setCurr] = useState(initialData?.currency || 'USD');
  const [initial, setInitial] = useState(initialData?.initialBalance || 0);

  return (
    <ModalWrapper title={initialData ? "Modifier Portefeuille" : "Nouveau Portefeuille"} onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit({ name, icon, currency: curr, initialBalance: initial }); onClose(); }} className="space-y-4">
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
        <Button type="submit" className="w-full h-12 mt-5 rounded-xl bg-accent text-background font-black text-lg">
          {initialData ? "Enregistrer" : "Créer"}
        </Button>
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
    className="fixed inset-0 z-[1100] flex items-center justify-center p-5 bg-black/60 backdrop-blur-xl"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.9, y: 20, opacity: 0 }}
      className="w-full max-w-[440px] bg-[#161618] p-8 rounded-[32px] shadow-2xl border border-white/10"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black text-white">{title}</h3>
        <button
          onClick={onClose}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5 text-white/50 cursor-pointer hover:bg-white/10 hover:text-white transition-all shadow-sm"
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
