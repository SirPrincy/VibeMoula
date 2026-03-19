import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useFinance } from './hooks/useFinance';
import TransactionModal from './components/TransactionModal';
import Navbar from './components/Navbar';
import type { Tab } from './components/Navbar';
import FinanceView from './components/FinanceView';
import DebtView from './components/DebtView';
import DashboardView from './components/DashboardView';
import SavingsView from './components/SavingsView';
import SettingsView from './components/SettingsView';
import { Settings } from 'lucide-react';

function App() {
  const { 
    transactions, 
    wallets,
    dashboardCurrency,
    setDashboardCurrency,
    totalBalance, 
    totalIncome, 
    totalExpenses, 
    addTransaction, 
    addWallet,
    exportData,
    resetData
  } = useFinance();

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

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className="layout-root">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onAddClick={() => setIsModalOpen(true)}
      />
      
      <div className="container" style={{ 
        maxWidth: '1200px', 
        padding: '40px 20px 140px 20px'
      }}>
        <header className="mobile-header mobile-only" style={{ 
          marginBottom: '40px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '0 10px',
          width: '100%'
        }}>
          <h1 className="logo-title" style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>VibeMoula</h1>
          <button 
            onClick={() => setActiveTab(prev => prev === 'settings' ? 'dashboard' : 'settings')}
            className="settings-trigger"
            style={{ 
              background: 'var(--card-bg)', 
              border: '1px solid var(--border)', 
              padding: '8px', 
              borderRadius: '100px', 
              cursor: 'pointer', 
              color: activeTab === 'settings' ? 'var(--accent)' : 'var(--fg)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Settings size={18} />
          </button>
        </header>

        <main className="main-content" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <DashboardView 
                key="dashboard" 
                totalBalance={totalBalance} 
                totalIncome={totalIncome} 
                totalExpenses={totalExpenses} 
                transactions={transactions}
                currency={dashboardCurrency}
              />
            )}

            {activeTab === 'finance' && (
              <FinanceView 
                key="finance" 
                transactions={transactions} 
                wallets={wallets}
                onAddWallet={addWallet}
                onExport={exportData}
                dashboardCurrency={dashboardCurrency}
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
                currency={dashboardCurrency}
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
        />
      </div>

      <style>{`
        .layout-root {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        @media (min-width: 1024px) {
          .layout-root {
            flex-direction: row;
          }
          .container {
            margin-left: 270px !important;
            padding: 60px 80px !important;
            flex: 1;
            max-width: none !important;
          }
          .main-content {
            max-width: 900px !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
