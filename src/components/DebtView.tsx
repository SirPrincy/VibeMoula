import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Circle, Calendar } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { cn } from '@/lib/utils';

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
      className="view-container pb-10 px-0 md:px-2.5"
    >
      <header className="mb-10">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-[2rem] font-extrabold tracking-[-0.5px]">Dettes</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(!isAdding)}
            className="bg-red-500 text-white border-none rounded-full px-5 py-2.5 font-bold flex items-center gap-2 cursor-pointer text-[0.9rem] transition-transform"
          >
            <Plus size={18} /> {isAdding ? 'Annuler' : 'Ajouter une Dette'}
          </motion.button>
        </div>

        <div className="bg-card p-6 rounded-[24px] border border-border flex flex-col gap-4 shadow-subtle text-foreground">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[0.8rem] font-bold text-muted-foreground uppercase tracking-[0.5px]">Reste à payer</span>
              <div className="text-[1.8rem] font-black text-red-500">{totalRemaining.toLocaleString()} {dashboardCurrency}</div>
            </div>
            <div className="text-right">
              <span className="text-[0.8rem] font-bold text-muted-foreground uppercase tracking-[0.5px]">Progression Remboursement</span>
              <div className="text-[1.2rem] font-bold">{payoffProgress.toFixed(0)}%</div>
            </div>
          </div>
          <div className="h-2 bg-background rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${payoffProgress}%` }}
              className="h-full bg-red-500 rounded-full" 
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
            className="overflow-hidden mb-[30px] bg-card p-6 rounded-[24px] border border-border flex flex-col gap-4 shadow-lg text-foreground"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] font-bold text-muted-foreground uppercase">TITRE DE LA DETTE</label>
                <input 
                  type="text" 
                  placeholder="ex: Prêt Amis" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-background border border-border p-3 rounded-xl text-foreground font-semibold outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] font-bold text-muted-foreground uppercase">MONTANT INITIAL</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full bg-background border border-border p-3 rounded-xl text-foreground font-semibold outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.75rem] font-bold text-muted-foreground uppercase">DATE D'ÉCHÉANCE (OPTIONNEL)</label>
              <input 
                type="date" 
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full bg-background border border-border p-3 rounded-xl text-foreground font-semibold outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
              />
            </div>
            <button type="submit" className="bg-foreground text-background border-none rounded-xl p-3.5 font-black cursor-pointer mt-2 hover:opacity-90 active:scale-[0.98] transition-all">
              ENREGISTRER LA DETTE
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-3">
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
                className={cn(
                  "flex flex-col p-5 bg-card rounded-2xl border border-border transition-all text-foreground",
                  debt.isPaid ? "opacity-60" : "opacity-100 shadow-subtle",
                  !debt.isPaid && !isExpanded ? "cursor-pointer hover:border-red-500/30" : "cursor-default"
                )}
              >
                <div className={cn(
                  "flex justify-between items-center",
                  (debt.isPaid || !isExpanded) ? "mb-0" : "mb-4"
                )}>
                   <div className="flex items-center gap-4">
                    <motion.button 
                      whileTap={{ scale: 0.8 }}
                      onClick={(e) => { e.stopPropagation(); togglePaid(debt.id); }} 
                      className={cn(
                        "bg-transparent border-none p-0 cursor-pointer",
                        debt.isPaid ? "text-emerald-500" : "text-muted-foreground"
                      )}
                    >
                      {debt.isPaid ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </motion.button>
                    <div>
                      <span className={cn(
                        "font-bold text-[1.05rem]",
                        debt.isPaid && "line-through text-muted-foreground"
                      )}>{debt.title}</span>
                      {!debt.isPaid && debt.dueDate && (
                        <div className="text-[0.75rem] text-muted-foreground font-semibold flex items-center gap-1 mt-0.5">
                          <Calendar size={12} /> Échéance : {new Date(debt.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={cn("font-black", debt.isPaid ? "text-muted-foreground" : "text-foreground")}>
                        {debt.remaining.toLocaleString()} {debt.currency}
                      </div>
                      {!debt.isPaid && (
                        <div className="text-[0.7rem] text-muted-foreground font-bold uppercase">SUR {debt.amount.toLocaleString()}</div>
                      )}
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteDebt(debt.id); }} 
                      className="bg-transparent border-none text-muted-foreground cursor-pointer p-1 hover:text-red-500 transition-colors"
                    >
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
                    className="flex flex-col gap-4 border-t border-background pt-4"
                  >
                    <div className="flex gap-2">
                      <input 
                        autoFocus
                        type="number"
                        placeholder="Montant du remboursement"
                        value={repaymentAmount}
                        onChange={(e) => setCustomRepayments(prev => ({ ...prev, [debt.id]: e.target.value }))}
                        className="flex-1 bg-background border border-border p-2 rounded-[10px] text-[0.85rem] font-semibold text-foreground outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                      />
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePayment(debt.id, parseFloat(repaymentAmount || '0'))}
                        disabled={!repaymentAmount}
                        className={cn(
                          "px-4 py-2 bg-red-500 text-white border-none rounded-[10px] font-bold text-[0.8rem] cursor-pointer transition-opacity",
                          !repaymentAmount && "opacity-50"
                        )}
                      >
                        Rembourser
                      </motion.button>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 cursor-pointer text-[0.8rem] font-semibold text-muted-foreground hover:text-foreground transition-colors">
                        <input 
                          type="checkbox"
                          checked={isLogging}
                          onChange={(e) => setIsLoggingTransaction(prev => ({ ...prev, [debt.id]: e.target.checked }))}
                          className="accent-red-500 w-4 h-4 rounded"
                        />
                        <span>Enregistrer transaction FINANCE</span>
                      </label>

                      {isLogging && (
                        <motion.select
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          value={selectedWallets[debt.id] || wallets[0]?.id || ''}
                          onChange={(e) => setSelectedWallets(prev => ({ ...prev, [debt.id]: e.target.value }))}
                          className="w-full bg-background border border-border p-1.5 rounded-lg text-[0.75rem] font-semibold text-foreground outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                        >
                          {wallets.map(w => (
                            <option key={w.id} value={w.id}>{w.icon} {w.name}</option>
                          ))}
                        </motion.select>
                      )}
                      
                      <button 
                        onClick={() => setExpandedDebtId(null)}
                        className="bg-transparent border-none text-muted-foreground text-[0.7rem] font-bold cursor-pointer text-center p-2 hover:text-foreground transition-all"
                      >
                        ANNULER
                      </button>
                    </div>
                  </motion.div>
                )}
                
                {!debt.isPaid && !isExpanded && (
                  <div className="text-center mt-2">
                    <span className="text-[0.7rem] font-black text-red-500 uppercase tracking-widest">Gérer</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DebtView;
