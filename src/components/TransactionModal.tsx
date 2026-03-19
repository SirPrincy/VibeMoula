import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import type { Category, TransactionType, Wallet, CreateTransactionInput } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransactionInput) => void;
  wallets: Wallet[];
  categories: Category[];
}

const TransactionModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, wallets, categories = [] }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [walletId, setWalletId] = useState('');
  const [isReconciled, setIsReconciled] = useState(false);

  useEffect(() => {
    if (wallets.length > 0 && !walletId) {
      setWalletId(wallets[0].id);
    }
  }, [wallets, walletId]);

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      description,
      amount: parseFloat(amount),
      categoryId,
      category: categories.find(c => c.id === categoryId)?.name || 'Autre', // Legacy fallback
      type,
      walletId,
      isReconciled,
      date: new Date().toISOString(),
      tags: [],
    });
    
    // Reset
    setDescription('');
    setAmount('');
    setIsReconciled(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--card-bg)',
              width: '100%',
              maxWidth: '450px',
              padding: '30px',
              borderRadius: '24px',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Nouvelle Vibe</h2>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}><X /></button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '25px', background: 'var(--bg)', padding: '4px', borderRadius: '12px' }}>
                {(['expense', 'income'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: type === t ? (t === 'expense' ? '#ef4444' : '#10b981') : 'transparent',
                      color: type === t ? '#fff' : 'var(--muted)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {t === 'expense' ? 'Dépense' : 'Revenu'}
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <input
                  required
                  autoFocus
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  style={{ 
                    width: '100%', 
                    fontSize: '3rem', 
                    fontWeight: 800, 
                    textAlign: 'center', 
                    background: 'transparent', 
                    border: 'none', 
                    color: type === 'expense' ? '#ef4444' : '#10b981',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gap: '15px', marginBottom: '25px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>PORTREFEUILLE</label>
                  <select value={walletId} onChange={e => setWalletId(e.target.value)} style={selectStyle}>
                    {wallets.map(w => <option key={w.id} value={w.id}>{w.icon} {w.name}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>CATÉGORIE</label>
                  <select value={categoryId} onChange={e => setCategoryId(e.target.value)} style={selectStyle}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                    {categories.length === 0 && <option value="">Aucune catégorie</option>}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>DESCRIPTION</label>
                  <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Café, Loyer, Bonus..." style={inputStyle} />
                </div>
              </div>

              <div 
                onClick={() => setIsReconciled(!isReconciled)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  marginBottom: '25px', 
                  cursor: 'pointer',
                  padding: '12px',
                  borderRadius: '12px',
                  background: isReconciled ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg)',
                  border: isReconciled ? '1px solid #10b981' : '1px solid var(--border)',
                  transition: 'all 0.2s'
                }}
              >
                <CheckCircle size={20} color={isReconciled ? '#10b981' : 'var(--muted)'} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: isReconciled ? '#10b981' : 'var(--fg)' }}>
                  {isReconciled ? 'Transaction Rapprochée' : 'Marquer comme Rapprochée'}
                </span>
              </div>

              <button type="submit" style={{ width: '100%', padding: '16px', borderRadius: '14px', background: 'var(--fg)', color: 'var(--bg)', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}>
                Ajouter la Transaction
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--fg)', outline: 'none' };
const selectStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--fg)', outline: 'none' };

export default TransactionModal;
