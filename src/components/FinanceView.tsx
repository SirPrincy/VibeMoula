import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Plus, X, Landmark } from 'lucide-react';
import TransactionList from './TransactionList';
import type { Wallet, Transaction } from '../types';
import { SUPPORTED_CURRENCIES } from '../types';
import { formatCurrency } from '../utils/format';

interface Props {
  transactions: Transaction[];
  wallets: Wallet[];
  onAddWallet: (wallet: Omit<Wallet, 'id'>) => void;
  onExport: () => void;
  dashboardCurrency: string;
}

const FinanceView: React.FC<Props> = ({ transactions, wallets, onAddWallet, onExport, dashboardCurrency }) => {
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [newWallName, setNewWallName] = useState('');
  const [newWallIcon, setNewWallIcon] = useState('💵');
  const [newWallCurr, setNewWallCurr] = useState('USD');

  const walletBalances = transactions.reduce((acc, t) => {
    const amount = (t.type === 'income' ? 1 : -1) * t.amount;
    acc[t.walletId] = (acc[t.walletId] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const handleAddWallet = (e: React.FormEvent) => {
    e.preventDefault();
    onAddWallet({
      name: newWallName,
      icon: newWallIcon,
      currency: newWallCurr
    });
    setNewWallName('');
    setShowAddWallet(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Finance</h2>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={onExport} title="Exporter" style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 600 }}>
            <Download size={16} /> Export
          </button>
        </div>
      </div>
      {/* Unified Financial Grid */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Aperçu des Comptes</h3>
          <button 
            onClick={() => setShowAddWallet(true)}
            style={{ background: 'var(--accent)', color: 'var(--bg)', border: 'none', borderRadius: '50px', padding: '5px 12px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Plus size={14} /> Nouveau Portefeuille
          </button>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '20px',
          width: '100%'
        }}>
          {/* Global Balance Card (Highlight) */}
          <div style={{ 
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--fg) 100%)', 
            padding: '25px', 
            borderRadius: 'var(--radius-lg)', 
            color: 'var(--bg)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '130px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1 }}>
              <Landmark size={80} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.8, textTransform: 'uppercase', marginBottom: '8px', position: 'relative' }}>Solde Total</span>
            <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0, letterSpacing: '-1px', position: 'relative' }}>
              {formatCurrency(
                transactions.reduce((sum, t) => sum + (t.type === 'income' ? 1 : -1) * t.amount, 0),
                dashboardCurrency
              )}
            </p>
          </div>

          {/* Individual Wallets */}
          {wallets.map(w => (
            <div key={w.id} style={{ 
              background: 'var(--card-bg)', 
              padding: '25px', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border)', 
              boxShadow: 'var(--shadow-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: '130px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '12px' }}>
                <div style={{ fontSize: '1.8rem' }}>{w.icon}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>{w.name}</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.5px' }}>
                {formatCurrency(walletBalances[w.id] || 0, w.currency)}
              </div>
            </div>
          ))}

          {wallets.length === 0 && (
            <div style={{ 
              background: 'var(--card-bg)', 
              padding: '40px 20px', 
              borderRadius: 'var(--radius-md)', 
              border: '1px dashed var(--border)', 
              textAlign: 'center', 
              color: 'var(--muted)', 
              fontSize: '0.9rem',
              gridColumn: '1 / -1' 
            }}>
               Clique sur "Nouveau Portefeuille" pour commencer.
            </div>
          )}
        </div>
      </section>

      <TransactionList transactions={transactions} wallets={wallets} />

      {/* Add Wallet Modal */}
      <AnimatePresence>
        {showAddWallet && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
            onClick={() => setShowAddWallet(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: 'var(--card-bg)', padding: '30px', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '400px', margin: 'auto' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontWeight: 800 }}>Nouveau Portefeuille</h3>
                <button onClick={() => setShowAddWallet(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleAddWallet}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>NOM</label>
                  <input required autoFocus value={newWallName} onChange={e => setNewWallName(e.target.value)} placeholder="ex: Compte Courant" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--fg)', outline: 'none' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>ICÔNE</label>
                    <select value={newWallIcon} onChange={e => setNewWallIcon(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--fg)', outline: 'none' }}>
                      <option value="💵">💵 Cash</option>
                      <option value="🏦">🏦 Banque</option>
                      <option value="📱">📱 Mobile</option>
                      <option value="💳">💳 Carte</option>
                      <option value="💰">💰 Épargne</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>DEVISE</label>
                    <select 
                      value={newWallCurr} 
                      onChange={e => setNewWallCurr(e.target.value)} 
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--fg)', outline: 'none' }}
                    >
                      {SUPPORTED_CURRENCIES.map(curr => (
                        <option key={curr} value={curr}>{curr}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'var(--accent)', color: 'var(--bg)', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Créer</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FinanceView;
