import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import { transactionSchema, type TransactionFormData } from '../lib/schemas';
import type { Category, Wallet, CreateTransactionInput } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransactionInput) => void;
  wallets: Wallet[];
  categories: Category[];
}

const TransactionModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, wallets, categories = [] }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema) as any,
    defaultValues: {
      type: 'expense',
      amount: 0,
      description: '',
      isReconciled: false,
      date: new Date().toISOString(),
      tags: [],
    },
  });

  const type = watch('type');
  const isReconciled = watch('isReconciled');

  React.useEffect(() => {
    if (isOpen) {
      if (wallets.length > 0) setValue('walletId', wallets[0].id);
      if (categories.length > 0) {
        const firstCat = categories[0];
        setValue('categoryId', firstCat.id);
        setValue('category', firstCat.name);
      }
    } else {
      reset();
    }
  }, [isOpen, wallets, categories, setValue, reset]);

  const onFormSubmit = (data: TransactionFormData) => {
    onSubmit({
      ...data,
      amount: data.amount,
      tags: data.tags || [],
    } as CreateTransactionInput);
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5 backdrop-blur-xl"
        >
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[450px] rounded-[24px] border border-border bg-card p-[30px] shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-extrabold tracking-tight">Nouvelle Vibe</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full text-muted-foreground hover:bg-muted"
                type="button"
              >
                <X size={20} />
              </Button>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
              {/* Type Switcher */}
              <div className="flex gap-2 rounded-xl bg-muted p-1">
                {(['expense', 'income'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setValue('type', t)}
                    className={cn(
                      "flex-1 rounded-lg py-2.5 text-sm font-bold transition-all duration-200",
                      type === t 
                        ? (t === 'expense' ? "bg-red-500 text-white shadow-sm" : "bg-emerald-500 text-white shadow-sm")
                        : "text-muted-foreground hover:bg-background/50"
                    )}
                  >
                    {t === 'expense' ? 'Dépense' : 'Revenu'}
                  </button>
                ))}
              </div>

              {/* Amount Input */}
              <div className="relative">
                <input
                  {...register('amount', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  autoFocus
                  className={cn(
                    "w-full bg-transparent text-center text-5xl font-black outline-none transition-colors",
                    type === 'expense' ? "text-red-500" : "text-emerald-500"
                  )}
                />
                {errors.amount && (
                  <p className="mt-1 text-center text-xs font-semibold text-red-500">{errors.amount.message}</p>
                )}
              </div>

              {/* Form Fields Grid */}
              <div className="grid gap-5">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Portefeuille</Label>
                  <select 
                    {...register('walletId')}
                    className="w-full rounded-xl border border-border bg-muted/30 p-3 text-sm font-semibold outline-none focus:border-foreground/20 focus:bg-muted/50"
                  >
                    {wallets.map(w => <option key={w.id} value={w.id}>{w.icon} {w.name}</option>)}
                  </select>
                  {errors.walletId && <p className="text-[10px] font-bold text-red-500">{errors.walletId.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Catégorie</Label>
                  <select 
                    onChange={(e) => {
                      const cat = categories.find(c => c.id === e.target.value);
                      setValue('categoryId', cat?.id);
                      setValue('category', cat?.name || '');
                    }}
                    value={watch('categoryId')}
                    className="w-full rounded-xl border border-border bg-muted/30 p-3 text-sm font-semibold outline-none focus:border-foreground/20 focus:bg-muted/50"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                    {categories.length === 0 && <option value="">Aucune catégorie</option>}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Description</Label>
                  <Input 
                    {...register('description')}
                    placeholder="Café, Loyer, Bonus..." 
                    className="h-11 rounded-xl border-border bg-muted/30 px-4 font-semibold focus:bg-muted/50 focus-visible:ring-0"
                  />
                  {errors.description && <p className="text-[10px] font-bold text-red-500">{errors.description.message}</p>}
                </div>
              </div>

              {/* Reconciliation Toggle */}
              <button
                type="button"
                onClick={() => setValue('isReconciled', !isReconciled)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-3.5 transition-all duration-200",
                  isReconciled 
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-500" 
                    : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/50"
                )}
              >
                <CheckCircle size={20} className={isReconciled ? "text-emerald-500" : "text-muted-foreground"} />
                <span className="text-sm font-bold">
                  {isReconciled ? 'Transaction Rapprochée' : 'Marquer comme Rapprochée'}
                </span>
              </button>

              <Button 
                type="submit" 
                className="h-14 w-full rounded-2xl bg-foreground text-lg font-black text-background transition-transform active:scale-[0.98] hover:opacity-90"
              >
                Ajouter la Transaction
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransactionModal;
