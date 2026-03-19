import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Plus, X } from 'lucide-react';
import TransactionList from './TransactionList';
import type { Wallet, Transaction, Category, Budget, Currency } from '../types';
import { SUPPORTED_CURRENCIES } from '../types';
import { currencyService } from '../services/currencyService';

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Finance</h2>
        <button onClick={onExport} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 600 }}>
          <Download size={16} /> Export
        </button>
      </div>

      {/* Sub-Tabs */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
        {(['wallets', 'budgets', 'categories'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            style={{
              background: 'none',
              border: 'none',
              color: activeSubTab === tab ? 'var(--accent)' : 'var(--muted)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              textTransform: 'capitalize',
              position: 'relative'
            }}
          >
            {tab === 'wallets' ? 'Comptes' : tab}
            {activeSubTab === tab && <motion.div layoutId="subtab" style={{ position: 'absolute', bottom: '-11px', left: 0, right: 0, height: '2px', background: 'var(--accent)' }} />}
          </button>
        ))}
      </div>

      {activeSubTab === 'wallets' && (
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Mes Comptes</h3>
            <button onClick={() => setShowAddModal('wallet')} style={{ background: 'var(--accent)', color: 'var(--bg)', border: 'none', borderRadius: '50px', padding: '5px 12px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
              <Plus size={14} /> Nouveau
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {wallets.map(w => (
              <div key={w.id} style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{w.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--muted)' }}>{w.name}</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.4rem' }}>
                  {currencyService.format((w.initialBalance || 0) + (walletBalances[w.id] || 0), w.currency as Currency)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeSubTab === 'budgets' && (
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Budgets Mensuels</h3>
            <button onClick={() => setShowAddModal('budget')} style={{ background: 'var(--accent)', color: 'var(--bg)', border: 'none', borderRadius: '50px', padding: '5px 12px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
              <Plus size={14} /> Nouveau
            </button>
          </div>
          <div style={{ display: 'grid', gap: '15px' }}>
            {budgetProgress.map(b => {
              const category = categories.find(c => c.id === b.categoryId);
              const percent = Math.min((b.spent / b.amount) * 100, 100);
              return (
                <div key={b.id} style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{category?.icon || '📁'}</span>
                      <span style={{ fontWeight: 700 }}>{category?.name || 'Inconnu'}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: percent > 90 ? 'var(--error)' : 'var(--fg)' }}>
                      {currencyService.format(b.spent, dashboardCurrency)} / {currencyService.format(b.amount, dashboardCurrency)}
                    </span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      style={{ 
                        height: '100%', 
                        background: percent > 90 ? '#ef4444' : 'var(--accent)',
                        borderRadius: '4px' 
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {activeSubTab === 'categories' && (
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Catégories Personnalisées</h3>
            <button onClick={() => setShowAddModal('category')} style={{ background: 'var(--accent)', color: 'var(--bg)', border: 'none', borderRadius: '50px', padding: '5px 12px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
              <Plus size={14} /> Nouveau
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {categories.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--card-bg)', padding: '8px 16px', borderRadius: '100px', border: '1px solid var(--border)' }}>
                <span>{c.icon}</span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <TransactionList transactions={transactions} wallets={wallets} categories={categories} />

      {/* Simplified Add Modal (Reusable structure or individual ones) */}
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
      <form onSubmit={(e) => { e.preventDefault(); onAdd({ name, icon, currency: curr, initialBalance: initial }); onClose(); }}>
        <Input label="Nom" value={name} onChange={setName} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 800 }}>ICÔNE</label>
            <select value={icon} onChange={e => setIcon(e.target.value)} style={selectStyle}>
              <option value="🏦">🏦 Banque</option>
              <option value="💵">💵 Cash</option>
              <option value="💳">💳 Carte</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 800 }}>DEVISE</label>
            <select value={curr} onChange={e => setCurr(e.target.value)} style={selectStyle}>
              {SUPPORTED_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginTop: '15px' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: 800 }}>SOLDE INITIAL</label>
          <input type="number" value={initial} onChange={e => setInitial(Number(e.target.value))} style={inputStyle} />
        </div>
        <button type="submit" style={buttonStyle}>Créer</button>
      </form>
    </ModalWrapper>
  );
};

const CategoryAddModal = ({ onClose, onAdd }: any) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📁');
  return (
    <ModalWrapper title="Nouvelle Catégorie" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onAdd({ name, icon, type: 'expense' }); onClose(); }}>
        <Input label="Nom" value={name} onChange={setName} />
        <Input label="Icône" value={icon} onChange={setIcon} />
        <button type="submit" style={buttonStyle}>Créer</button>
      </form>
    </ModalWrapper>
  );
};

const BudgetAddModal = ({ onClose, onAdd, categories }: any) => {
  const [catId, setCatId] = useState('');
  const [amount, setAmount] = useState(0);
  return (
    <ModalWrapper title="Définir un Budget" onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onAdd({ categoryId: catId, amount, period: 'monthly' }); onClose(); }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: 800 }}>CATÉGORIE</label>
          <select value={catId} onChange={e => setCatId(e.target.value)} style={selectStyle}>
            <option value="">Sélectionner</option>
            {categories.map((c: any) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
        </div>
        <Input label="Montant Mensuel" type="number" value={amount} onChange={(v: any) => setAmount(Number(v))} />
        <button type="submit" style={buttonStyle}>Définir</button>
      </form>
    </ModalWrapper>
  );
};

const ModalWrapper = ({ children, title, onClose }: any) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
    onClick={onClose}
  >
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
      style={{ background: 'var(--card-bg)', padding: '30px', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '400px' }}
      onClick={e => e.stopPropagation()}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontWeight: 800 }}>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}><X size={20} /></button>
      </div>
      {children}
    </motion.div>
  </motion.div>
);

const Input = ({ label, value, onChange, type = "text" }: any) => (
  <div style={{ marginBottom: '15px' }}>
    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>{label.toUpperCase()}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} style={inputStyle} />
  </div>
);

const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--fg)', outline: 'none' };
const selectStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--fg)', outline: 'none' };
const buttonStyle = { width: '100%', padding: '15px', marginTop: '20px', borderRadius: '12px', background: 'var(--accent)', color: 'var(--bg)', border: 'none', fontWeight: 800, cursor: 'pointer' };

export default FinanceView;
