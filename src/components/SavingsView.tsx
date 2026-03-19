import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Trash2, Calendar } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { cn } from '@/lib/utils';

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
        walletId: selectedWallets[id] || wallets[0]?.id || 'cash',
        date: new Date().toISOString(),
        isReconciled: false
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
      className="pb-10 px-0 md:px-2.5"
    >
      <header className="mb-10">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-[2rem] font-extrabold tracking-[-0.5px]">Épargne</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(!isAdding)}
            className="bg-accent text-background border-none rounded-full px-5 py-2.5 font-bold flex items-center gap-2 cursor-pointer text-[0.9rem] transition-transform"
          >
            <Plus size={18} /> {isAdding ? 'Annuler' : 'Nouvel Objectif'}
          </motion.button>
        </div>

        <div className="bg-card p-6 rounded-[24px] border border-border flex flex-col gap-4 shadow-subtle text-foreground">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[0.8rem] font-bold text-muted-foreground uppercase tracking-[0.5px]">Total Épargné</span>
              <div className="text-[1.8rem] font-black">{totalSaved.toLocaleString()} {dashboardCurrency}</div>
            </div>
            <div className="text-right">
              <span className="text-[0.8rem] font-bold text-muted-foreground uppercase tracking-[0.5px]">Objectif Global</span>
              <div className="text-[1.2rem] font-bold text-muted-foreground">{totalTarget.toLocaleString()} {dashboardCurrency}</div>
            </div>
          </div>
          <div className="h-2 bg-background rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(overallProgress, 100)}%` }}
              className="h-full bg-emerald-500 rounded-full" 
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
            className="overflow-hidden mb-[30px] bg-card p-6 rounded-[24px] border border-border flex flex-col gap-4 shadow-lg text-foreground"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] font-bold text-muted-foreground uppercase">NOM DE L'OBJECTIF</label>
                <input 
                  type="text" 
                  placeholder="ex: Voyage au Japon" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-background border border-border p-3 rounded-xl text-foreground font-semibold outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] font-bold text-muted-foreground uppercase">MONTANT CIBLE</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full bg-background border border-border p-3 rounded-xl text-foreground font-semibold outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.75rem] font-bold text-muted-foreground uppercase">DATE ÉCHÉANCE (OPTIONNEL)</label>
              <input 
                type="date" 
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="w-full bg-background border border-border p-3 rounded-xl text-foreground font-semibold outline-none focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
            <button type="submit" className="bg-accent text-background border-none rounded-xl p-3.5 font-black cursor-pointer mt-2 hover:opacity-90 active:scale-[0.98] transition-all">
              CRÉER L'OBJECTIF
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                className={cn(
                  "p-6 bg-card rounded-[24px] border border-border relative flex flex-col gap-5 shadow-subtle transition-all text-foreground",
                  isExpanded ? "cursor-default" : "cursor-pointer hover:border-accent/30 hover:shadow-lg"
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 items-center">
                    <div className="bg-background p-2.5 rounded-xl text-emerald-500">
                      <Target size={20} />
                    </div>
                    <div>
                      <h3 className="text-[1.1rem] font-black">{goal.name}</h3>
                      {goal.deadline && (
                        <span className="text-[0.75rem] text-muted-foreground font-semibold flex items-center gap-1">
                          <Calendar size={12} /> {new Date(goal.deadline).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteSavingsGoal(goal.id); }} 
                    className="bg-transparent border-none text-muted-foreground cursor-pointer p-1 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div>
                   <div className="flex justify-between mb-2 text-[0.85rem]">
                      <span className="font-bold">{progress.toFixed(0)}% complété</span>
                      <span className="text-muted-foreground font-semibold">Reste {remaining > 0 ? remaining.toLocaleString() : 0} {goal.currency}</span>
                   </div>
                   <div className="h-1.5 bg-background rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 150)}%` }}
                      className={cn(
                        "h-full rounded-full transition-colors",
                        progress >= 100 ? "bg-emerald-500" : "bg-accent"
                      )} 
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                   <div className="text-[1.2rem] font-black">
                    {goal.current.toLocaleString()} <span className="text-[0.8rem] text-muted-foreground font-bold">/ {goal.target.toLocaleString()}</span>
                   </div>
                   {!isExpanded && (
                     <div className="text-[0.7rem] font-black text-accent uppercase tracking-wider">Gérer</div>
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
                      className="border-t border-background pt-4 flex flex-col gap-3"
                    >
                      <div className="flex gap-2">
                        <input 
                          autoFocus
                          type="number"
                          placeholder="Montant (+/-)"
                          value={goalAmount}
                          onChange={(e) => setCustomAmounts(prev => ({ ...prev, [goal.id]: e.target.value }))}
                          className="flex-1 bg-background border border-border p-2 rounded-[10px] text-[0.85rem] font-semibold text-foreground outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                        />
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUpdateCurrent(goal.id, goal.current, parseFloat(goalAmount || '0'))}
                          disabled={!goalAmount}
                          className={cn(
                            "px-4 py-2 bg-accent text-background border-none rounded-[10px] font-bold text-[0.8rem] cursor-pointer transition-opacity",
                            !goalAmount && "opacity-50"
                          )}
                        >
                          Confirmer
                        </motion.button>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer text-[0.8rem] font-semibold text-muted-foreground hover:text-foreground transition-colors">
                          <input 
                            type="checkbox"
                            checked={isLogging}
                            onChange={(e) => setIsLoggingTransaction(prev => ({ ...prev, [goal.id]: e.target.checked }))}
                            className="accent-accent w-4 h-4 rounded"
                          />
                          <span>Enregistrer transaction FINANCE</span>
                        </label>

                        {isLogging && (
                          <motion.select
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            value={selectedWallets[goal.id] || wallets[0]?.id || ''}
                            onChange={(e) => setSelectedWallets(prev => ({ ...prev, [goal.id]: e.target.value }))}
                            className="w-full bg-background border border-border p-1.5 rounded-lg text-[0.75rem] font-semibold text-foreground outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                          >
                            {wallets.map(w => (
                              <option key={w.id} value={w.id}>{w.icon} {w.name}</option>
                            ))}
                          </motion.select>
                        )}
                        
                        <button 
                          onClick={() => setExpandedGoalId(null)}
                          className="bg-transparent border-none text-muted-foreground text-[0.7rem] font-bold cursor-pointer text-center p-2 hover:text-foreground transition-colors"
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
    </motion.div>
  );
};

export default SavingsView;
