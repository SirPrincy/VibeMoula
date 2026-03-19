import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useFinance } from './hooks/useFinance';
import { recurringService } from './services/recurringService';
import TransactionModal from './components/TransactionModal';
import Navbar from './components/Navbar';
import type { Tab } from './components/Navbar';
import type { Currency } from './types';
import FinanceView from './components/FinanceView';
import DebtView from './components/DebtView';
import DashboardView from './components/DashboardView';
import SavingsView from './components/SavingsView';
import SettingsView from './components/SettingsView';
import { Settings } from 'lucide-react';
import { cn } from './lib/utils';

function App() {
  const { 
    transactions, 
    wallets,
    categories,
    budgets,
    dashboardCurrency,
    setDashboardCurrency,
    addTransaction, 
    addWallet,
    addCategory,
    addBudget,
    exportData,
    resetData
  } = useFinance();

  const recentlyUsedCategoryIds = useMemo(() => {
    const ids = transactions
      .filter(t => t.categoryId)
      .slice(0, 10)
      .map(t => t.categoryId as string);
    return Array.from(new Set(ids));
  }, [transactions]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Check and generate recurring transactions on load
    recurringService.checkAndGenerate();
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className="layout-root flex flex-col min-h-screen lg:flex-row">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onAddClick={() => setIsModalOpen(true)}
      />
      
      <div className="container grow w-full max-w-[1200px] px-5 pt-10 pb-[140px] lg:ml-[270px] lg:px-20 lg:py-[60px] lg:max-w-none">
        <header className="mobile-header mobile-only mb-10 flex w-full items-center justify-between px-2.5 lg:hidden">
          <h1 className="logo-title text-[1.4rem] font-extrabold tracking-[-0.5px]">VibeMoula</h1>
          <button 
            onClick={() => setActiveTab(prev => prev === 'settings' ? 'dashboard' : 'settings')}
            className={cn(
              "settings-trigger flex items-center rounded-full border border-border bg-card p-2 transition-colors",
              activeTab === 'settings' ? "text-accent" : "text-foreground"
            )}
          >
            <Settings size={18} />
          </button>
        </header>

        <main className="main-content w-full max-w-[600px] mx-auto lg:max-w-[900px] lg:mx-0">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <DashboardView 
                key="dashboard" 
                transactions={transactions}
                wallets={wallets}
                currency={dashboardCurrency as Currency}
              />
            )}

            {activeTab === 'finance' && (
              <FinanceView 
                key="finance" 
                transactions={transactions} 
                wallets={wallets}
                categories={categories}
                budgets={budgets}
                onAddWallet={addWallet}
                onAddCategory={addCategory}
                onAddBudget={addBudget}
                onExport={exportData}
                dashboardCurrency={dashboardCurrency as Currency}
              />
            )}

            {activeTab === 'savings' && (
              <SavingsView key="savings" />
            )}

            {activeTab === 'debt' && (
              <DebtView key="debt" />
            )}

            {activeTab === 'settings' && (
              <SettingsView 
                key="settings"
                theme={theme}
                onToggleTheme={toggleTheme}
                onExport={exportData}
                currency={dashboardCurrency as Currency}
                onCurrencyChange={setDashboardCurrency}
                onResetData={resetData}
              />
            )}
          </AnimatePresence>
        </main>

        <TransactionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={addTransaction} 
          wallets={wallets}
          recentlyUsedCategoryIds={recentlyUsedCategoryIds}
        />
      </div>
    </div>
  );
}

export default App;
