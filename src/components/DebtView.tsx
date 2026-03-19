import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Circle, Calendar } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';

const DebtView: React.FC = () => {
  const { debts, addDebt, updateDebt, deleteDebt, addTransaction, wallets, dashboardCurrency } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  // States for each debt's custom repayment
  const [expandedDebtId, setExpandedDebtId] = useState<string | null>(null);
  const [customRepayments, setCustomRepayments] = useState<Record<string, string>>({});
  const [isLoggingTransaction, setIsLoggingTransaction] = useState<Record<string, boolean>>({});
  const [selectedWallets, setSelectedWallets] = useState<Record<string, string>>({});

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAmount) return;
    addDebt({
      title: newTitle,
      amount: parseFloat(newAmount),
      remaining: parseFloat(newAmount),
      currency: dashboardCurrency,
      dueDate: newDueDate || undefined,
      isPaid: false
    });
    setNewTitle('');
    setNewAmount('');
    setNewDueDate('');
    setIsAdding(false);
  };

  const togglePaid = (id: string) => {
    const debt = debts.find(d => d.id === id);
    if (debt) {
      updateDebt({ 
        ...debt, 
        isPaid: !debt.isPaid,
        remaining: !debt.isPaid ? 0 : debt.amount
      });
    }
  };

  const handlePayment = (id: string, payment: number) => {
    const debt = debts.find(d => d.id === id);
    if (!debt) return;

    const newRemaining = Math.max(0, debt.remaining - payment);
    updateDebt({ 
      ...debt, 
      remaining: newRemaining,
      isPaid: newRemaining === 0
    });

    // If transaction logging is enabled, record it
    if (isLoggingTransaction[id] && payment !== 0) {
      addTransaction({
        description: `Remboursement Dette : ${debt.title}`,
        amount: Math.abs(payment),
        category: 'other',
        type: 'expense',
        walletId: selectedWallets[id] || wallets[0]?.id || 'cash',
        date: new Date().toISOString(),
        isReconciled: false
      });
    }

    // Reset custom input and collapse
    setCustomRepayments(prev => ({ ...prev, [id]: '' }));
    setExpandedDebtId(null);
  };

  const totalRemaining = debts.filter(d => !d.isPaid).reduce((acc, d) => acc + d.remaining, 0);
  const totalOriginal = debts.reduce((acc, d) => acc + d.amount, 0);
  const payoffProgress = totalOriginal > 0 ? ((totalOriginal - totalRemaining) / totalOriginal) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="view-container"
    >
      <header style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Dettes</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(!isAdding)}
            style={{ 
              background: 'var(--negative)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '100px', 
              padding: '10px 20px', 
              fontWeight: 700, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            <Plus size={18} /> {isAdding ? 'Annuler' : 'Ajouter une Dette'}
          </motion.button>
        </div>

        <div style={{ 
          background: 'var(--card-bg)', 
          padding: '24px', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reste à payer</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--negative)' }}>{totalRemaining.toLocaleString()} {dashboardCurrency}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Progression Remboursement</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{payoffProgress.toFixed(0)}%</div>
            </div>
          </div>
          <div style={{ height: '8px', background: 'var(--bg)', borderRadius: '100px', overflow: 'hidden' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${payoffProgress}%` }}
              style={{ height: '100%', background: 'var(--negative)', borderRadius: '100px' }} 
            />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleAdd}
            style={{ 
              overflow: 'hidden',
              marginBottom: '30px',
              background: 'var(--card-bg)',
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="input-field">
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '8px', display: 'block' }}>TITRE DE LA DETTE</label>
                <input 
                  type="text" 
                  placeholder="ex: Prêt Amis" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: '12px', color: 'var(--fg)', fontWeight: 600, outline: 'none' }}
                />
              </div>
              <div className="input-field">
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '8px', display: 'block' }}>MONTANT INITIAL</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: '12px', color: 'var(--fg)', fontWeight: 600, outline: 'none' }}
                />
              </div>
            </div>
            <div className="input-field">
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '8px', display: 'block' }}>DATE D'ÉCHÉANCE (OPTIONNEL)</label>
              <input 
                type="date" 
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: '12px', color: 'var(--fg)', fontWeight: 600, outline: 'none' }}
              />
            </div>
            <button type="submit" style={{ background: 'var(--fg)', color: 'var(--bg)', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: 800, cursor: 'pointer', marginTop: '8px' }}>
              ENREGISTRER LA DETTE
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <AnimatePresence>
          {debts.map((debt) => {
            const repaymentAmount = customRepayments[debt.id] || '';
            const isLogging = isLoggingTransaction[debt.id] || false;
            const isExpanded = expandedDebtId === debt.id;

            return (
              <motion.div
                layout
                key={debt.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => !isExpanded && !debt.isPaid && setExpandedDebtId(debt.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '20px',
                  background: 'var(--card-bg)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  opacity: debt.isPaid ? 0.6 : 1,
                  transition: 'opacity 0.3s ease',
                  boxShadow: 'var(--shadow-subtle)',
                  cursor: !debt.isPaid && !isExpanded ? 'pointer' : 'default'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: (debt.isPaid || !isExpanded) ? 0 : '16px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <motion.button 
                      whileTap={{ scale: 0.8 }}
                      onClick={(e) => { e.stopPropagation(); togglePaid(debt.id); }} 
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: debt.isPaid ? 'var(--positive)' : 'var(--muted)' }}
                    >
                      {debt.isPaid ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </motion.button>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '1.05rem', textDecoration: debt.isPaid ? 'line-through' : 'none' }}>{debt.title}</span>
                      {!debt.isPaid && debt.dueDate && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <Calendar size={12} /> Échéance : {new Date(debt.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: debt.isPaid ? 'var(--muted)' : 'var(--fg)' }}>{debt.remaining.toLocaleString()} {debt.currency}</div>
                      {!debt.isPaid && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 700 }}>SUR {debt.amount.toLocaleString()}</div>
                      )}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteDebt(debt.id); }} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '4px' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {!debt.isPaid && isExpanded && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--bg)', paddingTop: '16px' }}
                  >
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        autoFocus
                        type="number"
                        placeholder="Montant du remboursement"
                        value={repaymentAmount}
                        onChange={(e) => setCustomRepayments(prev => ({ ...prev, [debt.id]: e.target.value }))}
                        style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', padding: '8px 12px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--fg)', outline: 'none' }}
                      />
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePayment(debt.id, parseFloat(repaymentAmount || '0'))}
                        disabled={!repaymentAmount}
                        style={{ padding: '8px 16px', background: 'var(--negative)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', opacity: repaymentAmount ? 1 : 0.5 }}
                      >
                        Rembourser
                      </motion.button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)' }}>
                        <input 
                          type="checkbox"
                          checked={isLogging}
                          onChange={(e) => setIsLoggingTransaction(prev => ({ ...prev, [debt.id]: e.target.checked }))}
                          style={{ accentColor: 'var(--negative)' }}
                        />
                        <span>Enregistrer transaction FINANCE</span>
                      </label>

                      {isLogging && (
                        <motion.select
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          value={selectedWallets[debt.id] || wallets[0]?.id || ''}
                          onChange={(e) => setSelectedWallets(prev => ({ ...prev, [debt.id]: e.target.value }))}
                          style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', padding: '6px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--fg)', outline: 'none' }}
                        >
                          {wallets.map(w => (
                            <option key={w.id} value={w.id}>{w.icon} {w.name}</option>
                          ))}
                        </motion.select>
                      )}
                      
                      <button 
                        onClick={() => setExpandedDebtId(null)}
                        style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', textAlign: 'center', padding: '8px' }}
                      >
                        ANNULER
                      </button>
                    </div>
                  </motion.div>
                )}
                
                {!debt.isPaid && !isExpanded && (
                  <div style={{ textAlign: 'center', marginTop: '8px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--negative)', textTransform: 'uppercase' }}>Gérer</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <style>{`
        .view-container {
          padding-bottom: 40px;
        }
        @media (max-width: 768px) {
          .view-container {
            padding: 0 10px;
          }
        }
        input[type="checkbox"] {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }
      `}</style>
    </motion.div>
  );
};

export default DebtView;
