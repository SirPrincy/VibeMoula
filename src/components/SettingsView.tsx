import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Info, Database } from 'lucide-react';
import { SUPPORTED_CURRENCIES } from '../types';

interface Props {
  theme: string;
  onToggleTheme: () => void;
  onExport: () => void;
  currency: string;
  onCurrencyChange: (c: string) => void;
  onResetData: () => void;
}

const SettingsView: React.FC<Props> = ({ 
  theme, 
  onToggleTheme, 
  onExport,
  currency,
  onCurrencyChange,
  onResetData
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pb-20"
    >
      <h2 className="text-[1.8rem] font-black mb-[30px]">Réglages</h2>
      
      <div className="grid gap-5">
        {/* Theme Setting */}
        <div className="bg-card p-[25px] rounded-[24px] border border-border flex justify-between items-center">
          <div className="flex items-center gap-[15px]">
            <div className="bg-background p-2.5 rounded-xl text-accent">
              {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
            </div>
            <div>
              <p className="font-bold m-0 text-foreground">Apparence</p>
              <p className="text-[0.8rem] text-muted-foreground m-0">
                {theme === 'light' ? 'Mode Clair' : 'Mode Sombre'} actif
              </p>
            </div>
          </div>
          <button 
            onClick={onToggleTheme}
            className="bg-background border border-border px-5 py-2.5 rounded-full cursor-pointer text-foreground font-bold text-[0.85rem] transition-colors hover:bg-muted/50"
          >
            Changer
          </button>
        </div>

        {/* Currency Setting */}
        <div className="bg-card p-[25px] rounded-[24px] border border-border flex justify-between items-center">
          <div className="flex items-center gap-[15px]">
            <div className="bg-background p-2.5 rounded-xl text-accent">
              <span className="text-[1.2rem] font-black leading-none">$</span>
            </div>
            <div>
              <p className="font-bold m-0 text-foreground">Devise Dashboard</p>
              <p className="text-[0.8rem] text-muted-foreground m-0">Format d'affichage global</p>
            </div>
          </div>
          <select 
            value={currency} 
            onChange={e => onCurrencyChange(e.target.value)}
            className="w-[100px] p-2.5 rounded-xl border border-border bg-background text-foreground text-center font-black outline-none focus:ring-2 focus:ring-accent/20"
          >
            {SUPPORTED_CURRENCIES.map(curr => (
              <option key={curr} value={curr}>{curr}</option>
            ))}
          </select>
        </div>

        {/* Data Persistence */}
        <div className="bg-card p-[25px] rounded-[24px] border border-border">
          <div className="flex items-center gap-[15px] mb-[25px]">
            <div className="bg-background p-2.5 rounded-xl text-accent">
              <Database size={20} />
            </div>
            <p className="font-bold m-0 text-foreground">Données & Stockage</p>
          </div>
          
          <div className="grid gap-2.5">
            <button 
              onClick={onExport}
              className="w-full p-[15px] rounded-[16px] border border-border bg-background text-foreground font-bold text-left flex items-center gap-3 cursor-pointer transition-all hover:bg-muted/20"
            >
              <Info size={18} /> Exporter les données (JSON)
            </button>
          </div>
        </div>
        
        {/* Dangerous Zone */}
        <div className="bg-destructive/5 p-[25px] rounded-[24px] border border-destructive/20 mt-5">
          <div className="flex items-center gap-[15px] mb-5">
            <div className="bg-destructive/10 p-2.5 rounded-xl text-destructive">
              <Database size={20} />
            </div>
            <div>
              <p className="font-bold m-0 text-destructive">Zone de Danger</p>
              <p className="text-[0.8rem] text-muted-foreground m-0">Actions irréversibles</p>
            </div>
          </div>
          
          <button 
            onClick={onResetData}
            className="w-full p-[15px] rounded-[16px] border-none bg-destructive text-destructive-foreground font-black cursor-pointer text-[0.9rem] shadow-[0_4px_12px_rgba(255,59,48,0.2)] transition-opacity hover:opacity-90 active:scale-[0.98]"
          >
            Réinitialiser toutes les données
          </button>
        </div>

        {/* About */}
        <div className="p-5 text-center text-muted-foreground text-[0.8rem]">
          <p className="m-0 mb-1 font-bold">VibeMoula V4.0</p>
          <p className="m-0 italic">Fait avec ❤️ pour sirprincy</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsView;
