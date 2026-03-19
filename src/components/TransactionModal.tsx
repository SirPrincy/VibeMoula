import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import { transactionSchema, type TransactionFormData } from '../lib/schemas';
import type { Wallet, CreateTransactionInput, Transaction } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import CategoryGrid from './CategoryGrid';
import { getCategoryById } from '@/lib/categories';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from './ui/dialog';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransactionInput) => void;
  onDelete?: (id: string) => void;
  wallets: Wallet[];
  recentlyUsedCategoryIds?: string[];
  initialData?: Transaction | null;
}

const TransactionModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onDelete,
  wallets, 
  recentlyUsedCategoryIds = [],
  initialData
}) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

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
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
      tags: [],
    },
  });

  const type = watch('type');
  const isReconciled = watch('isReconciled');

  React.useEffect(() => {
    if (type === 'transfer') {
      setValue('category', 'Transfert');
      setValue('categoryId', undefined);
    }
  }, [type, setValue]);

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          ...initialData,
          date: initialData.date.substring(0, 16),
        } as any);
      } else {
        reset({
          type: 'expense',
          amount: 0,
          description: '',
          isReconciled: false,
          date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
          tags: [],
        });
        if (wallets.length > 0) setValue('walletId', wallets[0].id);
      }
    } else {
      reset();
    }
  }, [isOpen, initialData, wallets, setValue, reset]);

  const onFormSubmit = (data: TransactionFormData) => {
    // Merge category name if it was selected via ID
    let finalCategory = data.category;
    if (data.type === 'transfer') {
      finalCategory = 'Transfert';
    } else if (data.categoryId) {
      const catDef = getCategoryById(data.categoryId);
      if (catDef) finalCategory = catDef.name;
    }

    const submitData = {
      ...data,
      category: finalCategory,
      categoryId: data.type === 'transfer' ? undefined : data.categoryId,
      amount: data.amount,
      description: data.description || '',
      tags: data.tags || [],
      date: new Date(data.date).toISOString(), // Convert local datetime back to UTC ISO for storage
    };

    onSubmit(submitData as CreateTransactionInput);
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
            className="w-full max-w-[500px] overflow-hidden rounded-[32px] border border-white/10 bg-[#161618]/80 p-0 shadow-2xl backdrop-blur-3xl lg:max-w-[600px]"
          >
            <div className="flex h-[85vh] flex-col lg:h-auto lg:max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-2">
                <h2 className="text-xl font-black tracking-tight text-white">
                  {initialData ? 'Modifier la Vibe' : 'Nouvelle Vibe'}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full text-white/50 hover:bg-white/10 hover:text-white"
                  type="button"
                >
                  <X size={20} />
                </Button>
              </div>

              <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-1 flex-col overflow-y-auto px-6 pb-8 pt-2 scrollbar-hide">
                <div className="space-y-8">
                  {/* Type Switcher */}
                  <div className="flex gap-2 rounded-xl bg-white/5 p-1">
                    {(['expense', 'income', 'transfer'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setValue('type', t)}
                        className={cn(
                          "flex-1 rounded-lg py-2.5 text-sm font-bold transition-all duration-200",
                          type === t 
                            ? (t === 'expense' ? "bg-red-500 text-white shadow-sm" : t === 'income' ? "bg-emerald-500 text-white shadow-sm" : "bg-blue-500 text-white shadow-sm")
                            : "text-white/40 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        {t === 'expense' ? 'Dépense' : t === 'income' ? 'Revenu' : 'Transfert'}
                      </button>
                    ))}
                  </div>

                  {/* Amount Input */}
                  <div className="relative">
                    <input
                      value={watch('amount') || ''}
                      onChange={(e) => setValue('amount', parseFloat(e.target.value) || 0, { shouldValidate: true })}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      autoFocus
                      className={cn(
                        "w-full bg-transparent text-center text-6xl font-black outline-none transition-colors",
                        type === 'expense' ? "text-red-500" : type === 'income' ? "text-emerald-500" : "text-blue-500"
                      )}
                    />
                    {errors.amount && (
                      <p className="mt-1 text-center text-xs font-semibold text-red-500">{errors.amount.message}</p>
                    )}
                  </div>

                  {/* Form Fields Grid */}
                  <div className="grid gap-8">
                    {type === 'transfer' && (
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black tracking-widest text-white/40 uppercase">Depuis Portefeuille (Source)</Label>
                        <select 
                          {...register('fromWalletId')}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-bold text-white outline-none focus:border-white/20 focus:bg-white/10"
                        >
                          {wallets.map(w => <option key={w.id} value={w.id} className="bg-[#161618]">{w.icon} {w.name}</option>)}
                        </select>
                        {errors.fromWalletId && <p className="text-[10px] font-bold text-red-500">{errors.fromWalletId.message as string}</p>}
                      </div>
                    )}

                    <div className="space-y-3">
                      <Label className="text-[10px] font-black tracking-widest text-white/40 uppercase">
                        {type === 'transfer' ? 'Vers Portefeuille (Destination)' : 'Portefeuille'}
                      </Label>
                      <select 
                        {...register('walletId')}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-bold text-white outline-none focus:border-white/20 focus:bg-white/10"
                      >
                        {wallets.map(w => <option key={w.id} value={w.id} className="bg-[#161618]">{w.icon} {w.name}</option>)}
                      </select>
                      {errors.walletId && <p className="text-[10px] font-bold text-red-500">{errors.walletId.message}</p>}
                    </div>

                    {type !== 'transfer' && (
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black tracking-widest text-white/40 uppercase">Catégorie</Label>
                        <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                          <DialogTrigger asChild>
                            <button 
                              type="button" 
                              className="w-full text-left rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-bold text-white outline-none focus:border-white/20 focus:bg-white/10"
                            >
                              {watch('categoryId') ? `${watch('category')} ${watch('subCategory') ? `> ${watch('subCategory')}` : ''}` : 'Sélectionner une catégorie'}
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-h-[85vh] overflow-y-auto bg-[#161618] border-white/10 p-6 sm:max-w-[425px]">
                            <DialogTitle className="text-white mb-4">Choisir une catégorie</DialogTitle>
                            <CategoryGrid 
                              type={type as any}
                              selectedCategoryId={watch('categoryId')}
                              selectedSubCategoryId={watch('subCategory')}
                              recentlyUsedIds={recentlyUsedCategoryIds}
                              onSelect={(cat, sub) => {
                                setValue('categoryId', cat.id);
                                setValue('category', cat.name);
                                setValue('subCategory', sub?.name || '');
                                setIsCategoryOpen(false);
                              }}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}

                    <div className="space-y-3">
                      <Label className="text-[10px] font-black tracking-widest text-white/40 uppercase">Date & Heure</Label>
                      <Input 
                        {...register('date')}
                        type="datetime-local"
                        className="h-14 rounded-2xl border-white/10 bg-white/5 px-5 font-bold text-white focus:bg-white/10 focus-visible:ring-0 [&::-webkit-calendar-picker-indicator]:invert"
                      />
                      {errors.date && <p className="text-[10px] font-bold text-red-500">{errors.date.message}</p>}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[10px] font-black tracking-widest text-white/40 uppercase">Description (Optionnel)</Label>
                      <Input 
                        {...register('description')}
                        placeholder="Café, Loyer, Bonus..." 
                        className="h-14 rounded-2xl border-white/10 bg-white/5 px-5 font-bold text-white placeholder:text-white/20 focus:bg-white/10 focus-visible:ring-0"
                      />
                      {errors.description && <p className="text-[10px] font-bold text-red-500">{errors.description.message}</p>}
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black tracking-widest text-white/40 uppercase">Tags (Prochainement)</Label>
                      <Input 
                        disabled
                        placeholder="#voyage, #pro..." 
                        className="h-14 rounded-2xl border-white/10 bg-white/5 px-5 font-bold text-white/50 placeholder:text-white/20 focus:bg-white/10 focus-visible:ring-0 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Reconciliation Toggle */}
                  <button
                    type="button"
                    onClick={() => setValue('isReconciled', !isReconciled)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border p-4 transition-all duration-300",
                      isReconciled 
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                        : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <CheckCircle size={20} className={isReconciled ? "text-emerald-500" : "text-white/40"} />
                    <span className="text-sm font-bold">
                      {isReconciled ? 'Transaction Rapprochée' : 'Marquer comme Rapprochée'}
                    </span>
                  </button>

                  <Button 
                    type="submit" 
                    className="h-16 w-full rounded-[24px] bg-white text-lg font-black text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {initialData ? 'Enregistrer les modifications' : 'Confirmer la transaction'}
                  </Button>
                  {initialData && onDelete && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette transaction ?")) {
                          onDelete(initialData.id);
                          onClose();
                        }
                      }}
                      className="flex h-12 w-full items-center justify-center rounded-[24px] text-sm font-bold text-red-500 hover:bg-red-500/10 hover:text-red-500 transition-all"
                    >
                      Supprimer la Vibe
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransactionModal;
