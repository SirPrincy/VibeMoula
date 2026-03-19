import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Category, TransactionType, Wallet, CreateTransactionInput } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransactionInput) => void;
  wallets: Wallet[];
}

const SUB_CATEGORIES: Record<Category, string[]> = {
  food: ['Resto', 'Courses', 'Café', 'Snacks'],
  shopping: ['Vêtements', 'Tech', 'Maison', 'Cadeaux'],
  transport: ['Carburant', 'Bus/Métro', 'Taxi/Uber'],
  home: ['Loyer', 'Électricité', 'Eau', 'Internet'],
  salary: ['Salaire Principal', 'Bonus', 'Freelance'],
  leisure: ['Cinéma', 'Sport', 'Voyage', 'Sorties'],
  other: ['Divers']
};

const TransactionModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, wallets }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('food');
  const [subCategory, setSubCategory] = useState(SUB_CATEGORIES['food'][0]);
  const [tags, setTags] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');

  // Mettre à jour le wallet par défaut quand les wallets sont chargés
  React.useEffect(() => {
    if (wallets.length > 0 && !walletId) {
      setWalletId(wallets[0].id);
    }
  }, [wallets, walletId]);

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setSubCategory(SUB_CATEGORIES[cat][0]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      description,
      amount: parseFloat(amount),
      category,
      subCategory,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      type,
      walletId
    });
    setDescription('');
    setAmount('');
    setTags('');
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
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--card-bg)',
              width: '100%',
              maxWidth: '500px',
              padding: '40px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-subtle)'
            }}
          >
            <h2 style={{ fontSize: '1.8rem', marginBottom: '25px', fontWeight: 800 }}>Nouvelle Transaction</h2>
            <form onSubmit={handleFormSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>
                    Montant (FCFA) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    style={{ width: '100%', padding: '16px 0', background: 'transparent', border: 'none', borderBottom: '2px solid var(--border)', color: 'var(--fg)', fontSize: '1.1rem', fontWeight: 600, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>
                    Wallet *
                  </label>
                  <select
                    required
                    value={walletId}
                    onChange={(e) => setWalletId(e.target.value)}
                    style={{ width: '100%', padding: '16px 0', background: 'transparent', border: 'none', borderBottom: '2px solid var(--border)', color: 'var(--fg)', fontSize: '1.1rem', fontWeight: 600, outline: 'none' }}
                  >
                    {wallets.length > 0 ? (
                      wallets.map(w => (
                        <option key={w.id} value={w.id} style={{ background: 'var(--card-bg)', color: 'var(--fg)' }}>{w.icon} {w.name} ({w.currency})</option>
                      ))
                    ) : (
                      <option value="cash" style={{ background: 'var(--card-bg)', color: 'var(--fg)' }}>💵 Cash (USD)</option>
                    )}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>
                    Catégorie *
                  </label>
                  <select
                    required
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value as Category)}
                    style={{ width: '100%', padding: '16px 0', background: 'transparent', border: 'none', borderBottom: '2px solid var(--border)', color: 'var(--fg)', fontSize: '1.1rem', fontWeight: 600, outline: 'none' }}
                  >
                    <option value="food" style={{ background: 'var(--card-bg)', color: 'var(--fg)' }}>🍴 Alimentation</option>
                    <option value="shopping" style={{ background: 'var(--card-bg)', color: 'var(--fg)' }}>🛍️ Shopping</option>
                    <option value="transport" style={{ background: 'var(--card-bg)', color: 'var(--fg)' }}>🚗 Transport</option>
                    <option value="home" style={{ background: 'var(--card-bg)', color: 'var(--fg)' }}>🏠 Maison</option>
                    <option value="salary" style={{ background: 'var(--card-bg)', color: 'var(--fg)' }}>💰 Salaire</option>
                    <option value="leisure" style={{ background: 'var(--card-bg)', color: 'var(--fg)' }}>🎨 Loisirs</option>
                    <option value="other" style={{ background: 'var(--card-bg)', color: 'var(--fg)' }}>📦 Autre</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>
                    Sous-catégorie *
                  </label>
                  <select
                    required
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    style={{ width: '100%', padding: '16px 0', background: 'transparent', border: 'none', borderBottom: '2px solid var(--border)', color: 'var(--fg)', fontSize: '1.1rem', fontWeight: 600, outline: 'none' }}
                  >
                    {SUB_CATEGORIES[category].map(sub => (
                      <option key={sub} value={sub} style={{ background: 'var(--card-bg)', color: 'var(--fg)' }}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>
                    Type *
                  </label>
                  <select
                    required
                    value={type}
                    onChange={(e) => setType(e.target.value as TransactionType)}
                    style={{ width: '100%', padding: '16px 0', background: 'transparent', border: 'none', borderBottom: '2px solid var(--border)', color: 'var(--fg)', fontSize: '1.1rem', fontWeight: 600, outline: 'none' }}
                  >
                    <option value="expense" style={{ background: 'var(--card-bg)', color: 'var(--fg)' }}>Sortie (-)</option>
                    <option value="income" style={{ background: 'var(--card-bg)', color: 'var(--fg)' }}>Entrée (+)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>
                    Tags (optionnel)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="ex: urgent, perso..."
                    style={{ width: '100%', padding: '16px 0', background: 'transparent', border: 'none', borderBottom: '2px solid var(--border)', color: 'var(--fg)', fontSize: '1.1rem', fontWeight: 600, outline: 'none' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '30px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '5px' }}>
                  Description (optionnel)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ex: Café, Loyer..."
                  style={{ width: '100%', padding: '16px 0', background: 'transparent', border: 'none', borderBottom: '2px solid var(--border)', color: 'var(--fg)', fontSize: '1.1rem', fontWeight: 600, outline: 'none' }}
                />
              </div>

              <button type="submit" style={{ width: '100%', padding: '20px', background: 'var(--accent)', color: 'var(--bg)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                Confirmer
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{ width: '100%', background: 'none', border: 'none', marginTop: '15px', color: 'var(--muted)', cursor: 'pointer', fontWeight: 600 }}
              >
                Annuler
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransactionModal;
