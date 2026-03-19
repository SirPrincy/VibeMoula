import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Wallet, ReceiptText, PiggyBank, Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Tab = 'dashboard' | 'finance' | 'savings' | 'debt' | 'settings';

interface Props {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onAddClick: () => void;
}

const Navbar: React.FC<Props> = ({ activeTab, setActiveTab, onAddClick }) => {
  const tabs = [
    { id: 'dashboard' as Tab, label: 'Tableau', icon: LayoutDashboard },
    { id: 'finance' as Tab, label: 'Finance', icon: Wallet },
    { id: 'savings' as Tab, label: 'Épargne', icon: PiggyBank },
    { id: 'debt' as Tab, label: 'Dettes', icon: ReceiptText },
    { id: 'settings' as Tab, label: 'Réglages', icon: Settings },
  ];

  const renderTab = (tab: { id: Tab, label: string, icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    return (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={cn(
          "nav-item relative z-10 flex flex-1 flex-col items-center gap-1 bg-none border-none text-muted-foreground cursor-pointer transition-colors duration-300 lg:flex-none lg:flex-row lg:gap-[15px] lg:px-5 lg:py-3.5 lg:w-full lg:justify-start lg:rounded-2xl",
          isActive ? "text-foreground" : ""
        )}
      >
        <motion.div
          initial={false}
          animate={{ scale: isActive ? 1.1 : 1 }}
          className="icon-wrapper"
        >
          <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
        </motion.div>
        <span className={cn(
          "nav-label text-[0.55rem] font-bold uppercase tracking-[0.5px] lg:text-[0.95rem] lg:normal-case lg:tracking-normal",
          isActive ? "" : ""
        )}>{tab.label}</span>
        {isActive && (
          <motion.div
            layoutId="active-pill"
            className="active-pill absolute inset-0 -z-10 rounded-full border border-border bg-background lg:rounded-2xl"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </button>
    );
  };

  return (
    <nav className="navbar-container fixed bottom-5 left-1/2 z-50 w-[calc(100%-30px)] max-w-[440px] -translate-x-1/2 rounded-[100px] border border-border bg-card/15 p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl lg:left-[30px] lg:top-[30px] lg:bottom-[30px] lg:w-[240px] lg:max-w-[240px] lg:translate-x-0 lg:rounded-3xl lg:px-[15px] lg:py-10">
      <div className="navbar-content w-full">
        <div className="nav-logo desktop-only hidden lg:mb-10 lg:flex lg:pl-5">
          <span className="logo-text text-2xl font-black tracking-[-1px] text-foreground">VibeMoula</span>
        </div>
        
        <div className="tabs-wrapper w-full">
          {/* Mobile Layout with central plus - Filter out settings */}
          <div className="mobile-tabs-container flex w-full items-center justify-between px-2.5 lg:hidden">
            {tabs.filter(t => t.id !== 'settings').slice(0, 2).map(renderTab)}
            
            <button 
              className="nav-add-btn mx-[5px] flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-background shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-transform active:scale-90 border-none cursor-pointer" 
              onClick={onAddClick}
            >
              <Plus size={24} />
            </button>
            
            {tabs.filter(t => t.id !== 'settings').slice(2).map(renderTab)}
          </div>

          {/* Desktop Layout (Standard list with Add button at top) */}
          <div className="desktop-tabs-container desktop-only hidden lg:flex lg:flex-col lg:w-full">
            <button 
              className="sidebar-add-btn mb-[30px] flex w-full items-center gap-2.5 rounded-2xl bg-accent px-5 py-4 text-[1rem] font-black text-background transition-all hover:scale-[1.02] active:scale-100 hover:opacity-90 border-none cursor-pointer" 
              onClick={onAddClick}
            >
               <Plus size={20} /> Nouveau
            </button>
            
            <div className="sidebar-tabs-list flex flex-col gap-2.5 w-full">
              {tabs.map(renderTab)}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
