import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Trash2, Calendar } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';

const SavingsView: React.FC = () => {
  const { savings, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal, addTransaction, wallets, dashboardCurrency } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  
  // States for each goal's input
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});
  const [isLoggingTransaction, setIsLoggingTransaction] = useState<Record<string, boolean>>({});
  const [selectedWallets, setSelectedWallets] = useState<Record<string, string>>({});

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newTarget) return;
    addSavingsGoal({
      name: newName,
      target: parseFloat(newTarget),
      current: 0,
      currency: dashboardCurrency,
      deadline: newDeadline || undefined
    });
    setNewName('');
    setNewTarget('');
    setNewDeadline('');
    setIsAdding(false);
  };

  const handleUpdateCurrent = (id: string, current: number, amount: number) => {
    const goal = savings.find(g => g.id === id);
    if (!goal) return;

    const newCurrent = Math.max(0, current + amount);
    updateSavingsGoal({ ...goal, current: newCurrent });

    // If transaction logging is enabled, record it
    if (isLoggingTransaction[id] && amount !== 0) {
      addTransaction({
        description: `${amount > 0 ? 'Dépôt' : 'Retrait'} Épargne : ${goal.name}`,
        amount: Math.abs(amount),
        category: 'other',
        type: amount > 0 ? 'expense' : 'income', 
        walletId: selectedWallets[id] || wallets[0]?.id || 'cash'
      });
    }
    
    // Reset custom input and collapse
    setCustomAmounts(prev => ({ ...prev, [id]: '' }));
    setExpandedGoalId(null);
  };

  const totalSaved = savings.reduce((acc, g) => acc + g.current, 0);
  const totalTarget = savings.reduce((acc, g) => acc + g.target, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="view-container"
    >
      <header style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Épargne</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(!isAdding)}
            style={{ 
              background: 'var(--accent)', 
              color: 'var(--bg)', 
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
            <Plus size={18} /> {isAdding ? 'Annuler' : 'Nouvel Objectif'}
          </motion.button>
        </div>

        <div style={{ 
          background: 'var(--card-bg)', 
          padding: '24px', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Épargné</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{totalSaved.toLocaleString()} {dashboardCurrency}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Objectif Global</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--muted)' }}>{totalTarget.toLocaleString()} {dashboardCurrency}</div>
            </div>
          </div>
          <div style={{ height: '8px', background: 'var(--bg)', borderRadius: '100px', overflow: 'hidden' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(overallProgress, 100)}%` }}
              style={{ height: '100%', background: 'var(--positive)', borderRadius: '100px' }} 
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
            onSubmit={handleAddGoal}
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
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '8px', display: 'block' }}>NOM DE L'OBJECTIF</label>
                <input 
                  type="text" 
                  placeholder="ex: Voyage au Japon" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: '12px', color: 'var(--fg)', fontWeight: 600, outline: 'none' }}
                />
              </div>
              <div className="input-field">
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '8px', display: 'block' }}>MONTANT CIBLE</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: '12px', color: 'var(--fg)', fontWeight: 600, outline: 'none' }}
                />
              </div>
            </div>
            <div className="input-field">
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '8px', display: 'block' }}>DATE ÉCHÉANCE (OPTIONNEL)</label>
              <input 
                type="date" 
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: '12px', color: 'var(--fg)', fontWeight: 600, outline: 'none' }}
              />
            </div>
            <button type="submit" style={{ background: 'var(--accent)', color: 'var(--bg)', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: 800, cursor: 'pointer', marginTop: '8px' }}>
              CRÉER L'OBJECTIF
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        <AnimatePresence>
          {savings.map((goal) => {
            const progress = (goal.current / (goal.target || 1)) * 100;
            const remaining = goal.target - goal.current;
            const goalAmount = customAmounts[goal.id] || '';
            const isLogging = isLoggingTransaction[goal.id] || false;
            const isExpanded = expandedGoalId === goal.id;
            
            return (
              <motion.div
                layout
                key={goal.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                onClick={() => !isExpanded && setExpandedGoalId(goal.id)}
                style={{
                  padding: '24px',
                  background: 'var(--card-bg)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  boxShadow: 'var(--shadow-subtle)',
                  cursor: isExpanded ? 'default' : 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ background: 'var(--bg)', padding: '10px', borderRadius: '12px', color: 'var(--positive)' }}>
                      <Target size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{goal.name}</h3>
                      {goal.deadline && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> {new Date(goal.deadline).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteSavingsGoal(goal.id); }} 
                    style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 700 }}>{progress.toFixed(0)}% complété</span>
                      <span style={{ color: 'var(--muted)', fontWeight: 600 }}>Reste {remaining > 0 ? remaining.toLocaleString() : 0} {goal.currency}</span>
                   </div>
                   <div style={{ height: '6px', background: 'var(--bg)', borderRadius: '100px', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 150)}%` }}
                      style={{ 
                        height: '100%', 
                        background: progress >= 100 ? 'var(--positive)' : 'var(--accent)', 
                        borderRadius: '100px' 
                      }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                    {goal.current.toLocaleString()} <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>/ {goal.target.toLocaleString()}</span>
                   </div>
                   {!isExpanded && (
                     <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>Gérer</div>
                   )}
                </div>

                {/* Custom Amount Section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onClick={(e) => e.stopPropagation()}
                      style={{ borderTop: '1px solid var(--bg)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}
                    >
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input 
                          autoFocus
                          type="number"
                          placeholder="Montant (+/-)"
                          value={goalAmount}
                          onChange={(e) => setCustomAmounts(prev => ({ ...prev, [goal.id]: e.target.value }))}
                          style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', padding: '8px 12px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--fg)', outline: 'none' }}
                        />
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUpdateCurrent(goal.id, goal.current, parseFloat(goalAmount || '0'))}
                          disabled={!goalAmount}
                          style={{ padding: '8px 16px', background: 'var(--accent)', color: 'var(--bg)', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', opacity: goalAmount ? 1 : 0.5 }}
                        >
                          Confirmer
                        </motion.button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)' }}>
                          <input 
                            type="checkbox"
                            checked={isLogging}
                            onChange={(e) => setIsLoggingTransaction(prev => ({ ...prev, [goal.id]: e.target.checked }))}
                            style={{ accentColor: 'var(--accent)' }}
                          />
                          <span>Enregistrer transaction FINANCE</span>
                        </label>

                        {isLogging && (
                          <motion.select
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            value={selectedWallets[goal.id] || wallets[0]?.id || ''}
                            onChange={(e) => setSelectedWallets(prev => ({ ...prev, [goal.id]: e.target.value }))}
                            style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', padding: '6px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--fg)', outline: 'none' }}
                          >
                            {wallets.map(w => (
                              <option key={w.id} value={w.id}>{w.icon} {w.name}</option>
                            ))}
                          </motion.select>
                        )}
                        
                        <button 
                          onClick={() => setExpandedGoalId(null)}
                          style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', textAlign: 'center', padding: '8px' }}
                        >
                          ANNULER
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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

export default SavingsView;
